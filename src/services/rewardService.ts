import { RewardLedgerEntry, RewardWallet } from '../types';

export const REWARD_AMOUNT_PER_ORDER = 20; // Exactly ₹20 per qualifying delivered order
export const MAX_FOOD_REWARD_REDEMPTION_PERCENT = 50; // Max 50% of item total can be paid via food rewards
export const MIN_ORDER_FOR_FOOD_REWARD = 100; // Minimum order value of ₹100 to redeem food rewards

/**
 * Reconciles and derives accurate, immutable balances directly from the ledger.
 * This guarantees financial integrity and prevents drift or client-side manipulation.
 */
export function deriveWalletBalances(ledger: RewardLedgerEntry[], userId: string): RewardWallet {
  let foodBalance = 0;
  let rechargeBalance = 0;
  let pendingBalance = 0;
  let lifetimeEarned = 0;

  for (const entry of ledger) {
    if (entry.userId !== userId) continue;

    // Credit from delivered order
    if (entry.type === 'credit_order_reward' && entry.status === 'available') {
      foodBalance += entry.amount;
      lifetimeEarned += entry.amount;
    }
    // Debit for food order checkout
    else if (entry.type === 'debit_food_order' && (entry.status === 'redeemed' || entry.status === 'reserved')) {
      foodBalance -= entry.amount;
    }
    // Transfer from Food to Recharge
    else if (entry.type === 'transfer_to_recharge' && entry.status === 'available') {
      foodBalance -= entry.amount;
      rechargeBalance += entry.amount;
    }
    // Transfer from Recharge back to Food
    else if (entry.type === 'transfer_to_food' && entry.status === 'available') {
      rechargeBalance -= entry.amount;
      foodBalance += entry.amount;
    }
    // Debit for Mobile Recharge
    else if (entry.type === 'debit_recharge' && (entry.status === 'redeemed' || entry.status === 'reserved')) {
      rechargeBalance -= entry.amount;
    }
    // Reversal if order refunded
    else if (entry.type === 'refund_reversal' && entry.status === 'reversed') {
      foodBalance = Math.max(0, foodBalance - entry.amount);
    }
  }

  // Safety invariant: balances cannot be negative
  foodBalance = Math.max(0, foodBalance);
  rechargeBalance = Math.max(0, rechargeBalance);

  return {
    userId,
    foodBalance,
    rechargeBalance,
    pendingBalance,
    lifetimeEarned,
    ledger: [...ledger].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  };
}

/**
 * Validates and grants the guaranteed ₹20 reward for an eligible, delivered order.
 * Strictly prevents duplicate awards for the same orderId.
 */
export function grantOrderDeliveryReward(
  currentLedger: RewardLedgerEntry[],
  userId: string,
  orderId: string,
  orderNumber: string
): { success: boolean; updatedLedger: RewardLedgerEntry[]; error?: string; grantedEntry?: RewardLedgerEntry } {
  // 1. Idempotency & Unique check: check if reward already credited for this order
  const existingGrant = currentLedger.find(
    (e) => e.orderId === orderId && e.type === 'credit_order_reward'
  );

  if (existingGrant) {
    return {
      success: false,
      updatedLedger: currentLedger,
      error: `Reward for order ${orderNumber} has already been granted (Ledger ID: ${existingGrant.id}).`,
    };
  }

  // 2. Create immutable credit ledger entry
  const newEntry: RewardLedgerEntry = {
    id: `ledg_cr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    userId,
    orderId,
    type: 'credit_order_reward',
    amount: REWARD_AMOUNT_PER_ORDER,
    category: 'food',
    status: 'available',
    description: `Guaranteed ₹20 Reward earned for completed delivery of Order #${orderNumber}`,
    referenceId: orderNumber,
    createdAt: new Date().toISOString(),
  };

  const updatedLedger = [...currentLedger, newEntry];
  return {
    success: true,
    updatedLedger,
    grantedEntry: newEntry,
  };
}

/**
 * Transfers eligible reward balance from Food Reward Balance to Mobile Recharge Reward Balance
 * Atomically records transfer ledger entries.
 */
export function transferFoodToRecharge(
  currentLedger: RewardLedgerEntry[],
  userId: string,
  amount: number
): { success: boolean; updatedLedger: RewardLedgerEntry[]; error?: string } {
  if (amount <= 0) {
    return { success: false, updatedLedger: currentLedger, error: 'Transfer amount must be greater than ₹0' };
  }

  const wallet = deriveWalletBalances(currentLedger, userId);
  if (amount > wallet.foodBalance) {
    return {
      success: false,
      updatedLedger: currentLedger,
      error: `Insufficient Food Reward Balance. Available: ₹${wallet.foodBalance}, Requested: ₹${amount}`,
    };
  }

  const transferEntry: RewardLedgerEntry = {
    id: `txfr_f2r_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    userId,
    type: 'transfer_to_recharge',
    amount,
    category: 'recharge',
    status: 'available',
    description: `Allocated ₹${amount} from Food Reward to Mobile Recharge Balance`,
    referenceId: `TXFR-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  return {
    success: true,
    updatedLedger: [...currentLedger, transferEntry],
  };
}

/**
 * Transfers eligible reward balance from Mobile Recharge back to Food Reward Balance
 */
export function transferRechargeToFood(
  currentLedger: RewardLedgerEntry[],
  userId: string,
  amount: number
): { success: boolean; updatedLedger: RewardLedgerEntry[]; error?: string } {
  if (amount <= 0) {
    return { success: false, updatedLedger: currentLedger, error: 'Transfer amount must be greater than ₹0' };
  }

  const wallet = deriveWalletBalances(currentLedger, userId);
  if (amount > wallet.rechargeBalance) {
    return {
      success: false,
      updatedLedger: currentLedger,
      error: `Insufficient Mobile Recharge Balance. Available: ₹${wallet.rechargeBalance}, Requested: ₹${amount}`,
    };
  }

  const transferEntry: RewardLedgerEntry = {
    id: `txfr_r2f_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    userId,
    type: 'transfer_to_food',
    amount,
    category: 'food',
    status: 'available',
    description: `Allocated ₹${amount} from Mobile Recharge to Food Reward Balance`,
    referenceId: `TXFR-REV-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  return {
    success: true,
    updatedLedger: [...currentLedger, transferEntry],
  };
}

/**
 * Calculates max allowed Food Reward redemption for a checkout order
 */
export function calculateEligibleFoodRewardRedemption(
  itemTotal: number,
  availableFoodBalance: number
): { maxRedeemable: number; isEligible: boolean; reason?: string } {
  if (availableFoodBalance <= 0) {
    return { maxRedeemable: 0, isEligible: false, reason: 'No reward balance available' };
  }

  if (itemTotal < MIN_ORDER_FOR_FOOD_REWARD) {
    return {
      maxRedeemable: 0,
      isEligible: false,
      reason: `Minimum item total of ₹${MIN_ORDER_FOR_FOOD_REWARD} required to redeem Food Rewards`,
    };
  }

  // Cap at 50% of item total to preserve platform unit economics
  const maxCap = Math.floor((itemTotal * MAX_FOOD_REWARD_REDEMPTION_PERCENT) / 100);
  const eligibleAmount = Math.min(availableFoodBalance, maxCap);

  return {
    maxRedeemable: eligibleAmount,
    isEligible: eligibleAmount > 0,
  };
}

/**
 * Records a debit entry for a completed food order
 */
export function recordFoodRewardDebit(
  currentLedger: RewardLedgerEntry[],
  userId: string,
  amount: number,
  orderNumber: string
): RewardLedgerEntry[] {
  if (amount <= 0) return currentLedger;

  const debitEntry: RewardLedgerEntry = {
    id: `ledg_db_food_${Date.now()}`,
    userId,
    type: 'debit_food_order',
    amount,
    category: 'food',
    status: 'redeemed',
    description: `Redeemed ₹${amount} Food Reward on Order #${orderNumber}`,
    referenceId: orderNumber,
    createdAt: new Date().toISOString(),
  };

  return [...currentLedger, debitEntry];
}

/**
 * Records a debit entry for a successful mobile recharge
 */
export function recordRechargeRewardDebit(
  currentLedger: RewardLedgerEntry[],
  userId: string,
  amount: number,
  mobileNumber: string,
  txnId: string
): RewardLedgerEntry[] {
  if (amount <= 0) return currentLedger;

  const debitEntry: RewardLedgerEntry = {
    id: `ledg_db_rch_${Date.now()}`,
    userId,
    type: 'debit_recharge',
    amount,
    category: 'recharge',
    status: 'redeemed',
    description: `Redeemed ₹${amount} on Mobile Recharge for ${mobileNumber} (Txn: ${txnId})`,
    referenceId: txnId,
    createdAt: new Date().toISOString(),
  };

  return [...currentLedger, debitEntry];
}
