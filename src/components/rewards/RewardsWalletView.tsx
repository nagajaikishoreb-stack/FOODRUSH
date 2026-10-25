import React, { useState } from 'react';
import {
  Gift,
  Smartphone,
  UtensilsCrossed,
  ArrowRightLeft,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  Percent,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface RewardsWalletViewProps {
  setCurrentTab: (tab: string) => void;
  onOpenLegal: (page: 'reward_policy') => void;
}

export const RewardsWalletView: React.FC<RewardsWalletViewProps> = ({
  setCurrentTab,
  onOpenLegal,
}) => {
  const { wallet, transferRewards, user, addToast } = useApp();
  const [transferAmount, setTransferAmount] = useState<string>('20');
  const [direction, setDirection] = useState<'food_to_recharge' | 'recharge_to_food'>('food_to_recharge');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit' | 'transfer'>('all');

  const handleTransfer = () => {
    const num = Number(transferAmount);
    if (isNaN(num) || num <= 0) {
      addToast('warning', 'Invalid Amount', 'Please enter a valid amount in multiples of ₹1.');
      return;
    }
    const res = transferRewards(num, direction);
    if (res.success) {
      setShowTransferModal(false);
    } else {
      addToast('warning', 'Transfer Failed', res.error || 'Unable to allocate balances.');
    }
  };

  const filteredLedger = wallet.ledger.filter((entry) => {
    if (filterType === 'credit') return entry.type === 'credit_order_reward';
    if (filterType === 'debit') return entry.type === 'debit_food_order' || entry.type === 'debit_recharge';
    if (filterType === 'transfer') return entry.type === 'transfer_to_recharge' || entry.type === 'transfer_to_food';
    return true;
  });

  return (
    <div className="space-y-8 pb-20 animate-in fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 mb-1">
            <Gift className="w-4 h-4" />
            <span>FoodRush Guaranteed Customer Loyalty Engine</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-900 tracking-tight">
            ₹20 Reward Wallet
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Every successfully delivered meal automatically earns a ₹20 reward voucher.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTransferModal(true)}
            className="px-4 py-2 bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-800 text-xs font-bold rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-amber-600" />
            <span>Allocate Balances</span>
          </button>

          <button
            onClick={() => setCurrentTab('home')}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Order Food Now
          </button>
        </div>
      </div>

      {/* Main Balances Showcase Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Available */}
        <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white p-5 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[11px] font-semibold text-amber-100 uppercase tracking-wider block">
              Total Available Rewards
            </span>
            <div className="font-heading font-black text-3xl sm:text-4xl tabular-nums mt-1">
              ₹{wallet.foodBalance + wallet.rechargeBalance}
            </div>
            <p className="text-[11px] text-amber-100 mt-2">
              Combined balance across Food and Mobile Recharge.
            </p>
          </div>
          <Gift className="w-24 h-24 absolute -right-4 -bottom-4 text-white/10" />
        </div>

        {/* Card 2: Food Reward Balance */}
        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                Food Reward Balance
              </span>
              <UtensilsCrossed className="w-4 h-4 text-amber-600" />
            </div>
            <div className="font-heading font-extrabold text-2xl text-neutral-900 tabular-nums">
              ₹{wallet.foodBalance}
            </div>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Redeem toward future food deliveries (up to 50% per order).
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentTab('home')}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Redeem on Meals</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Card 3: Mobile Recharge Balance */}
        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                Mobile Recharge Balance
              </span>
              <Smartphone className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="font-heading font-extrabold text-2xl text-neutral-900 tabular-nums">
              ₹{wallet.rechargeBalance}
            </div>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Use toward Jio, Airtel, Vi, and BSNL recharge plans.
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentTab('recharge')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Recharge Mobile</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Card 4: Lifetime Earned */}
        <div className="bg-neutral-50 p-5 rounded-3xl border border-neutral-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="font-semibold uppercase tracking-wider text-[10px] text-neutral-500 block mb-1">
              Lifetime Rewards Earned
            </span>
            <div className="font-heading font-extrabold text-2xl text-neutral-900 tabular-nums">
              ₹{wallet.lifetimeEarned}
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Total promotional vouchers issued across {wallet.lifetimeEarned / 20} completed deliveries.
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-neutral-200/60 flex items-center gap-1.5 text-[11px] text-neutral-600">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Audited Immutable Ledger</span>
          </div>
        </div>
      </div>

      {/* How the ₹20 Reward System Works Explainer */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-lg text-neutral-900">
            How FoodRush Guaranteed ₹20 Rewards Work
          </h2>
          <button
            onClick={() => onOpenLegal('reward_policy')}
            className="text-xs font-semibold text-amber-600 hover:text-amber-700 cursor-pointer flex items-center gap-1"
          >
            <span>Read Published Policy</span>
            <FileText className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white font-bold flex items-center justify-center text-xs">
              1
            </div>
            <h4 className="font-bold text-neutral-900 text-sm">Order Any Meal</h4>
            <p className="text-neutral-500 leading-relaxed">
              Browse top restaurants, add dishes to cart, and complete payment with transparent pricing.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-white font-bold flex items-center justify-center text-xs">
              2
            </div>
            <h4 className="font-bold text-neutral-900 text-sm">Confirm Delivery</h4>
            <p className="text-neutral-500 leading-relaxed">
              When your rider drops off food and confirms with your 4-digit PIN, qualifying status is achieved.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
              3
            </div>
            <h4 className="font-bold text-neutral-900 text-sm">Guaranteed ₹20 Credit</h4>
            <p className="text-neutral-500 leading-relaxed">
              Exactly ₹20 voucher is immediately committed to your Food Reward Balance. Zero delays, zero lottery gimmicks.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
              4
            </div>
            <h4 className="font-bold text-neutral-900 text-sm">Eat Free or Recharge</h4>
            <p className="text-neutral-500 leading-relaxed">
              Redeem on future orders (combine with coupons!), or allocate to Mobile Recharge for instant prepaid SIM packs.
            </p>
          </div>
        </div>

        {/* Regulatory & Anti-Fraud Notice */}
        <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Regulatory Compliance Notice:</strong> FoodRush promotional rewards are in-app promotional discount vouchers. In accordance with RBI and Indian payment guidelines, promotional rewards cannot be withdrawn to a bank account, converted to fiat cash, or transferred to third parties. They are valid exclusively for food orders and authorized mobile telecom recharges.
          </p>
        </div>
      </div>

      {/* Immutable Reward Ledger History */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-heading font-bold text-lg text-neutral-900">
              Reward Transaction Ledger
            </h3>
            <p className="text-xs text-neutral-500">
              Permanent double-entry record of all credits, debits, and balance allocations.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl text-xs">
            {(['all', 'credit', 'debit', 'transfer'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors cursor-pointer ${
                  filterType === t
                    ? 'bg-white text-neutral-900 font-bold shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Table */}
        <div className="border border-neutral-200 rounded-2xl overflow-hidden divide-y divide-neutral-100 text-xs">
          {filteredLedger.length === 0 ? (
            <div className="p-8 text-center text-neutral-400">No transactions recorded for this filter.</div>
          ) : (
            filteredLedger.map((entry) => {
              const isCredit = entry.type === 'credit_order_reward';
              const isTransfer = entry.type === 'transfer_to_recharge' || entry.type === 'transfer_to_food';
              const isDebit = entry.type === 'debit_food_order' || entry.type === 'debit_recharge';

              return (
                <div key={entry.id} className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-50/70 transition-colors">
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isCredit
                          ? 'bg-emerald-100 text-emerald-700'
                          : isTransfer
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      {isCredit ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : isTransfer ? (
                        <ArrowRightLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900 text-xs truncate">
                          {entry.description}
                        </span>
                        <span className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded capitalize">
                          {entry.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Ref: {entry.referenceId} · {new Date(entry.createdAt).toLocaleDateString()} at {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`font-heading font-extrabold text-sm tabular-nums block ${
                        isCredit
                          ? 'text-emerald-600'
                          : isDebit
                          ? 'text-neutral-900'
                          : 'text-blue-600'
                      }`}
                    >
                      {isCredit ? `+₹${entry.amount}` : isDebit ? `-₹${entry.amount}` : `₹${entry.amount}`}
                    </span>
                    <span className="text-[10px] text-neutral-400 capitalize">{entry.status}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Balance Allocation Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h3 className="font-heading font-bold text-base text-neutral-900">
                Allocate Reward Balance
              </h3>
              <button
                onClick={() => setShowTransferModal(false)}
                className="text-neutral-400 hover:text-neutral-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed">
              Transfer your earned reward vouchers between Food Delivery and Mobile Recharge balances without losing value.
            </p>

            {/* Transfer Direction */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-700 block">Transfer Direction</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setDirection('food_to_recharge')}
                  className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                    direction === 'food_to_recharge'
                      ? 'border-amber-500 bg-amber-50/70 font-bold text-amber-950'
                      : 'border-neutral-200 text-neutral-600'
                  }`}
                >
                  <span className="block text-[10px] text-neutral-400">From Food → To Recharge</span>
                  <span>Food to Mobile</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDirection('recharge_to_food')}
                  className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                    direction === 'recharge_to_food'
                      ? 'border-amber-500 bg-amber-50/70 font-bold text-amber-950'
                      : 'border-neutral-200 text-neutral-600'
                  }`}
                >
                  <span className="block text-[10px] text-neutral-400">From Recharge → To Food</span>
                  <span>Mobile to Food</span>
                </button>
              </div>
            </div>

            {/* Current Balances Context */}
            <div className="p-3 bg-neutral-50 rounded-xl text-xs space-y-1 text-neutral-600">
              <div className="flex justify-between">
                <span>Food Reward Balance:</span>
                <span className="font-bold text-neutral-900 tabular-nums">₹{wallet.foodBalance}</span>
              </div>
              <div className="flex justify-between">
                <span>Mobile Recharge Balance:</span>
                <span className="font-bold text-neutral-900 tabular-nums">₹{wallet.rechargeBalance}</span>
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">
                Transfer Amount (₹)
              </label>
              <input
                type="number"
                min="1"
                max={direction === 'food_to_recharge' ? wallet.foodBalance : wallet.rechargeBalance}
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-bold bg-white border border-neutral-300 rounded-xl focus:outline-none focus:border-amber-500 tabular-nums"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowTransferModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleTransfer}
                className="flex-1 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                Confirm Allocation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
