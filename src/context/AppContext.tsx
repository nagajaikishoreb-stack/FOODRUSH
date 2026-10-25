import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  UserProfile,
  UserRole,
  Restaurant,
  MenuItem,
  MenuItemVariant,
  MenuItemAddon,
  CartItem,
  CartState,
  Order,
  OrderStatus,
  RewardLedgerEntry,
  RewardWallet,
  Coupon,
  MobileRechargePlan,
  RechargeTransaction,
  SupportTicket,
  DeliveryAddress,
  TelecomOperator,
  AuditLogItem,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_RESTAURANTS,
  INITIAL_MENU_ITEMS,
  INITIAL_COUPONS,
  INITIAL_LEDGER,
  INITIAL_ORDERS,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_AUDIT_LOGS,
} from '../data/mockData';
import {
  deriveWalletBalances,
  grantOrderDeliveryReward,
  transferFoodToRecharge,
  transferRechargeToFood,
  recordFoodRewardDebit,
  recordRechargeRewardDebit,
} from '../services/rewardService';
import { validateCoupon } from '../services/couponService';
import { computeCartBill } from '../services/cartService';

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'reward';
  title: string;
  message: string;
}

interface AppContextType {
  user: UserProfile;
  setUserRole: (role: UserRole) => void;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  selectedAddress: DeliveryAddress;
  setSelectedAddress: (addr: DeliveryAddress) => void;
  addDeliveryAddress: (addr: Omit<DeliveryAddress, 'id'>) => void;

  restaurants: Restaurant[];
  menuItems: MenuItem[];
  toggleRestaurantOpen: (restaurantId: string) => void;
  toggleItemAvailability: (itemId: string) => void;

  cart: CartState;
  addToCart: (
    item: MenuItem,
    variant?: MenuItemVariant,
    addons?: MenuItemAddon[],
    instructions?: string
  ) => { success: boolean; conflictRestaurantName?: string; pendingItem?: () => void };
  forceAddToCartReplacingRestaurant: (
    item: MenuItem,
    variant?: MenuItemVariant,
    addons?: MenuItemAddon[],
    instructions?: string
  ) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  setFoodRewardRedemption: (amount: number) => void;
  setDriverTip: (amount: number) => void;

  orders: Order[];
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  placeOrder: (
    paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod',
    deliveryInstructions?: string
  ) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  progressOrderToNextStep: (orderId: string) => void;

  ledger: RewardLedgerEntry[];
  wallet: RewardWallet;
  transferRewards: (
    amount: number,
    direction: 'food_to_recharge' | 'recharge_to_food'
  ) => { success: boolean; error?: string };

  coupons: Coupon[];
  toggleCouponActive: (code: string) => void;
  createCoupon: (newCoupon: Coupon) => void;

  rechargeTxns: RechargeTransaction[];
  executeMobileRecharge: (
    mobileNumber: string,
    operator: TelecomOperator,
    circle: string,
    plan: MobileRechargePlan,
    rewardUsed: number
  ) => Promise<{ success: boolean; txnId?: string; error?: string }>;

  supportTickets: SupportTicket[];
  submitSupportTicket: (
    category: SupportTicket['category'],
    subject: string,
    message: string,
    orderId?: string
  ) => void;
  replyToSupportTicket: (ticketId: string, text: string, sender: 'user' | 'agent') => void;

  auditLogs: AuditLogItem[];

  favorites: { restaurants: string[]; dishes: string[] };
  toggleFavoriteRestaurant: (id: string) => void;
  toggleFavoriteDish: (id: string) => void;

  toasts: ToastNotification[];
  addToast: (type: ToastNotification['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;

  // Search & Navigation Filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCuisine: string | null;
  setSelectedCuisine: (c: string | null) => void;
  vegOnlyFilter: boolean;
  setVegOnlyFilter: (v: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [selectedAddress, setSelectedAddress] = useState<DeliveryAddress>(INITIAL_USER.savedAddresses[0]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCouponCode, setCartCouponCode] = useState<string | null>(null);
  const [cartFoodRewardRedeemed, setCartFoodRewardRedeemed] = useState<number>(0);
  const [cartDriverTip, setCartDriverTip] = useState<number>(0);

  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const [ledger, setLedger] = useState<RewardLedgerEntry[]>(INITIAL_LEDGER);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [rechargeTxns, setRechargeTxns] = useState<RechargeTransaction[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);

  const [favorites, setFavorites] = useState<{ restaurants: string[]; dishes: string[] }>({
    restaurants: ['rest_biryani_01', 'rest_udupi_03'],
    dishes: ['menu_biryani_01', 'menu_dosa_01'],
  });

  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [vegOnlyFilter, setVegOnlyFilter] = useState(false);

  const addToast = (type: ToastNotification['type'], title: string, message: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Derive wallet balances from immutable ledger in real-time
  const wallet = useMemo(() => {
    return deriveWalletBalances(ledger, user.id);
  }, [ledger, user.id]);

  // Derive cart state using cartService
  const cart: CartState = useMemo(() => {
    if (cartItems.length === 0) {
      return computeCartBill([], 0, null, 0, 0, 0, null, null);
    }
    const currentRestId = cartItems[0]?.menuItem.restaurantId;
    const currentRest = restaurants.find((r) => r.id === currentRestId);
    const distance = currentRest?.distanceKm || 2.0;

    // Check coupon discount
    let couponDiscount = 0;
    if (cartCouponCode) {
      const couponObj = coupons.find((c) => c.code === cartCouponCode);
      if (couponObj) {
        const itemTotal = cartItems.reduce((acc, it) => acc + it.totalPrice, 0);
        const valRes = validateCoupon(couponObj, itemTotal, orders, user.id, currentRestId);
        if (valRes.isValid) {
          couponDiscount = valRes.discountAmount;
        }
      }
    }

    return computeCartBill(
      cartItems,
      distance,
      cartCouponCode,
      couponDiscount,
      cartFoodRewardRedeemed,
      cartDriverTip,
      currentRestId,
      currentRest?.name || 'Selected Restaurant'
    );
  }, [cartItems, cartCouponCode, cartFoodRewardRedeemed, cartDriverTip, restaurants, coupons, orders, user.id]);

  const setUserRole = (role: UserRole) => {
    setUser((prev) => ({ ...prev, role }));
    addToast('info', 'Switched Workspace Role', `Viewing application as ${role.replace('_', ' ').toUpperCase()}`);
  };

  const updateUserProfile = (data: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...data }));
    addToast('success', 'Profile Updated', 'Your profile details have been saved.');
  };

  const addDeliveryAddress = (addr: Omit<DeliveryAddress, 'id'>) => {
    const newAddr: DeliveryAddress = {
      ...addr,
      id: `addr_${Date.now()}`,
    };
    setUser((prev) => ({
      ...prev,
      savedAddresses: [...prev.savedAddresses, newAddr],
    }));
    setSelectedAddress(newAddr);
    addToast('success', 'Address Saved', `${addr.type} address added successfully.`);
  };

  const toggleRestaurantOpen = (restaurantId: string) => {
    setRestaurants((prev) =>
      prev.map((r) => (r.id === restaurantId ? { ...r, isOpen: !r.isOpen } : r))
    );
  };

  const toggleItemAvailability = (itemId: string) => {
    setMenuItems((prev) =>
      prev.map((m) => (m.id === itemId ? { ...m, isAvailable: !m.isAvailable } : m))
    );
  };

  // Add to cart with single-restaurant conflict detection
  const addToCart = (
    item: MenuItem,
    variant?: MenuItemVariant,
    addons?: MenuItemAddon[],
    instructions?: string
  ) => {
    if (cartItems.length > 0 && cartItems[0].menuItem.restaurantId !== item.restaurantId) {
      const activeRest = restaurants.find((r) => r.id === cartItems[0].menuItem.restaurantId);
      return {
        success: false,
        conflictRestaurantName: activeRest?.name || 'another restaurant',
        pendingItem: () => forceAddToCartReplacingRestaurant(item, variant, addons, instructions),
      };
    }

    const unitPrice = (variant?.price ?? item.price) + (addons?.reduce((sum, a) => sum + a.price, 0) || 0);
    const cartItemId = `${item.id}_${variant?.id || 'std'}_${addons?.map((a) => a.id).sort().join('-') || 'none'}`;

    setCartItems((prev) => {
      const existingIdx = prev.findIndex((ci) => ci.id === cartItemId);
      if (existingIdx >= 0) {
        const copy = [...prev];
        const updatedQty = copy[existingIdx].quantity + 1;
        copy[existingIdx] = {
          ...copy[existingIdx],
          quantity: updatedQty,
          totalPrice: updatedQty * copy[existingIdx].unitPrice,
        };
        return copy;
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          menuItem: item,
          selectedVariant: variant,
          selectedAddons: addons || [],
          specialInstructions: instructions,
          quantity: 1,
          unitPrice,
          totalPrice: unitPrice,
        };
        return [...prev, newItem];
      }
    });

    addToast('success', 'Added to Cart', `${item.name} added to your order.`);
    return { success: true };
  };

  const forceAddToCartReplacingRestaurant = (
    item: MenuItem,
    variant?: MenuItemVariant,
    addons?: MenuItemAddon[],
    instructions?: string
  ) => {
    const unitPrice = (variant?.price ?? item.price) + (addons?.reduce((sum, a) => sum + a.price, 0) || 0);
    const cartItemId = `${item.id}_${variant?.id || 'std'}_${addons?.map((a) => a.id).sort().join('-') || 'none'}`;

    const newItem: CartItem = {
      id: cartItemId,
      menuItem: item,
      selectedVariant: variant,
      selectedAddons: addons || [],
      specialInstructions: instructions,
      quantity: 1,
      unitPrice,
      totalPrice: unitPrice,
    };

    setCartItems([newItem]);
    setCartCouponCode(null);
    setCartFoodRewardRedeemed(0);
    addToast('info', 'Cart Replaced', `Started a fresh cart from ${item.restaurantId}.`);
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((ci) => {
          if (ci.id === cartItemId) {
            const nextQty = ci.quantity + delta;
            return {
              ...ci,
              quantity: nextQty,
              totalPrice: nextQty * ci.unitPrice,
            };
          }
          return ci;
        })
        .filter((ci) => ci.quantity > 0);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setCartCouponCode(null);
    setCartFoodRewardRedeemed(0);
    setCartDriverTip(0);
  };

  const applyCoupon = (code: string) => {
    const uppercaseCode = code.trim().toUpperCase();
    const coupon = coupons.find((c) => c.code === uppercaseCode);
    if (!coupon) {
      return { success: false, message: `Coupon "${code}" does not exist.` };
    }

    const currentRestId = cartItems[0]?.menuItem.restaurantId;
    const itemTotal = cartItems.reduce((acc, it) => acc + it.totalPrice, 0);
    const validation = validateCoupon(coupon, itemTotal, orders, user.id, currentRestId);

    if (!validation.isValid) {
      return { success: false, message: validation.reason || 'Coupon is not eligible for this order.' };
    }

    setCartCouponCode(coupon.code);
    addToast('reward', 'Coupon Applied!', `You saved ₹${validation.discountAmount} with code ${coupon.code}`);
    return { success: true, message: `Applied ${coupon.code} saving ₹${validation.discountAmount}` };
  };

  const removeCoupon = () => {
    setCartCouponCode(null);
    addToast('info', 'Coupon Removed', 'Coupon discount removed.');
  };

  const setFoodRewardRedemption = (amount: number) => {
    const safeAmount = Math.max(0, Math.min(amount, wallet.foodBalance));
    setCartFoodRewardRedeemed(safeAmount);
  };

  const setDriverTip = (amount: number) => {
    setCartDriverTip(Math.max(0, amount));
  };

  // Place order with full server simulation & ledger deductions
  const placeOrder = async (
    paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod',
    deliveryInstructions?: string
  ): Promise<{ success: boolean; orderId?: string; error?: string }> => {
    if (cartItems.length === 0) {
      return { success: false, error: 'Your cart is empty.' };
    }

    const currentRest = restaurants.find((r) => r.id === cart.restaurantId);
    if (!currentRest) {
      return { success: false, error: 'Restaurant details missing.' };
    }

    const orderNum = `FR-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderId = `ord_${Date.now()}`;
    const paymentTxnId = `${paymentMethod.toUpperCase()}-TXN-${Math.floor(100000000 + Math.random() * 900000000)}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber: orderNum,
      userId: user.id,
      restaurantId: currentRest.id,
      restaurantName: currentRest.name,
      restaurantAddress: currentRest.address,
      restaurantImage: currentRest.image,
      items: [...cartItems],
      deliveryAddress: selectedAddress,
      deliveryInstructions,
      status: 'placed',
      statusHistory: [
        { status: 'placed', timestamp: new Date().toISOString(), note: `Order placed via ${paymentMethod.toUpperCase()}` },
        { status: 'paid', timestamp: new Date().toISOString(), note: `Payment of ₹${cart.finalPayableAmount} verified successfully` },
      ],
      paymentMethod,
      paymentStatus: 'success',
      paymentTxnId,
      breakdown: {
        itemTotal: cart.itemTotal,
        couponDiscount: cart.couponDiscount,
        foodRewardRedeemed: cart.foodRewardRedeemed,
        deliveryFee: cart.deliveryFee,
        packagingFee: cart.packagingFee,
        platformFee: cart.platformFee,
        gstAmount: cart.gstAmount,
        driverTip: cart.driverTip,
        totalPaid: cart.finalPayableAmount,
      },
      couponApplied: cart.couponCode || undefined,
      rewardEarned: 20, // Guaranteed ₹20 to be granted on delivery
      rewardCredited: false,
      deliveryPartner: {
        id: 'rider_suresh_01',
        name: 'Suresh Kumar',
        phone: '+91 98450 12345',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        vehicleNumber: 'KA-01-ER-8821',
        rating: 4.9,
      },
      deliveryOtp: String(Math.floor(1000 + Math.random() * 9000)),
      estimatedDeliveryMinutes: currentRest.deliveryTimeMinutes,
      createdAt: new Date().toISOString(),
    };

    // If Food Reward was redeemed, record debit in ledger
    if (cart.foodRewardRedeemed > 0) {
      setLedger((prev) => recordFoodRewardDebit(prev, user.id, cart.foodRewardRedeemed, orderNum));
    }

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    clearCart();

    addToast(
      'reward',
      `Order #${orderNum} Confirmed!`,
      `Track your meal now. You'll earn ₹20 reward voucher as soon as it arrives!`
    );

    return { success: true, orderId };
  };

  // Progress order lifecycle & trigger ₹20 Reward on Delivered
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    setOrders((prev) => {
      return prev.map((ord) => {
        if (ord.id !== orderId) return ord;

        const updatedHistory = [
          ...ord.statusHistory,
          {
            status: newStatus,
            timestamp: new Date().toISOString(),
            note: note || `Order status updated to ${newStatus.replace('_', ' ')}`,
          },
        ];

        let rewardCredited = ord.rewardCredited;

        // CRITICAL RULE: Award ₹20 only when delivered and not previously credited
        if (newStatus === 'delivered' && !ord.rewardCredited) {
          const grantRes = grantOrderDeliveryReward(ledger, ord.userId, ord.id, ord.orderNumber);
          if (grantRes.success) {
            setLedger(grantRes.updatedLedger);
            rewardCredited = true;
            addToast(
              'reward',
              '🎉 ₹20 Reward Credited!',
              `Order #${ord.orderNumber} delivered! ₹20 has been added to your Food Reward balance.`
            );
          }
        }

        const updatedOrder: Order = {
          ...ord,
          status: newStatus,
          statusHistory: updatedHistory,
          rewardCredited,
          deliveredAt: newStatus === 'delivered' ? new Date().toISOString() : ord.deliveredAt,
        };

        if (activeOrder?.id === orderId) {
          setActiveOrder(updatedOrder);
        }

        return updatedOrder;
      });
    });
  };

  const progressOrderToNextStep = (orderId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    const stages: OrderStatus[] = [
      'placed',
      'paid',
      'accepted',
      'preparing',
      'ready_for_pickup',
      'partner_assigned',
      'out_for_delivery',
      'delivered',
    ];

    const currentIdx = stages.indexOf(targetOrder.status);
    if (currentIdx >= 0 && currentIdx < stages.length - 1) {
      const nextStatus = stages[currentIdx + 1];
      const stageNotes: Record<OrderStatus, string> = {
        placed: 'Order placed',
        paid: 'Payment verified',
        accepted: 'Restaurant confirmed the order',
        preparing: 'Kitchen is actively preparing your fresh dishes',
        ready_for_pickup: 'Food is packed hot and ready for rider pickup',
        partner_assigned: 'Delivery partner reached restaurant',
        out_for_delivery: 'Rider is on the way to your delivery location',
        delivered: 'Delivered securely to customer with OTP verification',
        cancelled: 'Order was cancelled',
        refunded: 'Order refunded',
      };
      updateOrderStatus(orderId, nextStatus, stageNotes[nextStatus]);
    }
  };

  // Transfer rewards between food and recharge balances
  const transferRewards = (amount: number, direction: 'food_to_recharge' | 'recharge_to_food') => {
    if (direction === 'food_to_recharge') {
      const res = transferFoodToRecharge(ledger, user.id, amount);
      if (res.success) {
        setLedger(res.updatedLedger);
        addToast(
          'reward',
          'Rewards Allocated!',
          `₹${amount} transferred to your Mobile Recharge Balance. You can now use it on recharges.`
        );
        return { success: true };
      }
      return { success: false, error: res.error };
    } else {
      const res = transferRechargeToFood(ledger, user.id, amount);
      if (res.success) {
        setLedger(res.updatedLedger);
        addToast(
          'reward',
          'Rewards Transferred!',
          `₹${amount} transferred back to your Food Reward Balance.`
        );
        return { success: true };
      }
      return { success: false, error: res.error };
    }
  };

  // Execute Mobile Recharge
  const executeMobileRecharge = async (
    mobileNumber: string,
    operator: TelecomOperator,
    circle: string,
    plan: MobileRechargePlan,
    rewardUsed: number
  ): Promise<{ success: boolean; txnId?: string; error?: string }> => {
    // 1. Basic validation
    if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
      return { success: false, error: 'Please enter a valid 10-digit Indian mobile number.' };
    }

    if (rewardUsed > wallet.rechargeBalance) {
      return { success: false, error: 'Insufficient Mobile Recharge reward balance.' };
    }

    const amountPaid = Math.max(0, plan.price - rewardUsed);
    const txnId = `RCH-${Date.now()}`;
    const operatorRef = `OP-${operator.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

    // 2. Record debit in reward ledger
    if (rewardUsed > 0) {
      setLedger((prev) => recordRechargeRewardDebit(prev, user.id, rewardUsed, mobileNumber, txnId));
    }

    // 3. Record recharge transaction
    const newTxn: RechargeTransaction = {
      id: txnId,
      userId: user.id,
      mobileNumber,
      operator,
      circle,
      planId: plan.id,
      planAmount: plan.price,
      rewardRedeemed: rewardUsed,
      amountPaid,
      paymentMethod: rewardUsed >= plan.price ? 'Reward Balance Only' : 'UPI / Card + Reward',
      status: 'success',
      operatorRefId: operatorRef,
      createdAt: new Date().toISOString(),
    };

    setRechargeTxns((prev) => [newTxn, ...prev]);

    // 4. Audit log
    setAuditLogs((prev) => [
      {
        id: `aud_${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'MOBILE_RECHARGE_COMMITTED',
        performedBy: user.email,
        role: user.role,
        entityId: txnId,
        details: `Recharge of ₹${plan.price} for ${operator} (${mobileNumber}) succeeded. Rewards redeemed: ₹${rewardUsed}, Cash paid: ₹${amountPaid}`,
        severity: 'info',
      },
      ...prev,
    ]);

    addToast(
      'success',
      'Mobile Recharge Successful!',
      `Pack of ₹${plan.price} activated on ${mobileNumber} (${operator}). Reference: ${operatorRef}`
    );

    return { success: true, txnId };
  };

  // Support Tickets
  const submitSupportTicket = (
    category: SupportTicket['category'],
    subject: string,
    message: string,
    orderId?: string
  ) => {
    const newTicket: SupportTicket = {
      id: `tkt_${Date.now()}`,
      userId: user.id,
      orderId,
      category,
      subject,
      status: 'open',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: `msg_${Date.now()}`,
          sender: 'user',
          text: message,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    setSupportTickets((prev) => [newTicket, ...prev]);
    addToast('success', 'Ticket Created', 'Our customer support specialist is reviewing your query.');

    // Simulated automated prompt agent response
    setTimeout(() => {
      setSupportTickets((prev) =>
        prev.map((t) => {
          if (t.id === newTicket.id) {
            return {
              ...t,
              status: 'in_progress',
              messages: [
                ...t.messages,
                {
                  id: `msg_agent_${Date.now()}`,
                  sender: 'agent',
                  text: `Hello ${user.name.split(' ')[0]}! Thank you for contacting FoodRush Priority Support regarding "${subject}". Our team has verified your details and we are resolving this immediately.`,
                  timestamp: new Date().toISOString(),
                },
              ],
            };
          }
          return t;
        })
      );
    }, 2000);
  };

  const replyToSupportTicket = (ticketId: string, text: string, sender: 'user' | 'agent') => {
    setSupportTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            messages: [
              ...t.messages,
              {
                id: `msg_${Date.now()}`,
                sender,
                text,
                timestamp: new Date().toISOString(),
              },
            ],
          };
        }
        return t;
      })
    );
  };

  const toggleCouponActive = (code: string) => {
    setCoupons((prev) => prev.map((c) => (c.code === code ? { ...c, isActive: !c.isActive } : c)));
  };

  const createCoupon = (newCoupon: Coupon) => {
    setCoupons((prev) => [newCoupon, ...prev]);
    addToast('success', 'Coupon Created', `Coupon ${newCoupon.code} is now live.`);
  };

  const toggleFavoriteRestaurant = (id: string) => {
    setFavorites((prev) => {
      const exists = prev.restaurants.includes(id);
      return {
        ...prev,
        restaurants: exists ? prev.restaurants.filter((r) => r !== id) : [...prev.restaurants, id],
      };
    });
  };

  const toggleFavoriteDish = (id: string) => {
    setFavorites((prev) => {
      const exists = prev.dishes.includes(id);
      return {
        ...prev,
        dishes: exists ? prev.dishes.filter((d) => d !== id) : [...prev.dishes, id],
      };
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUserRole,
        updateUserProfile,
        selectedAddress,
        setSelectedAddress,
        addDeliveryAddress,
        restaurants,
        menuItems,
        toggleRestaurantOpen,
        toggleItemAvailability,
        cart,
        addToCart,
        forceAddToCartReplacingRestaurant,
        updateCartQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        setFoodRewardRedemption,
        setDriverTip,
        orders,
        activeOrder,
        setActiveOrder,
        placeOrder,
        updateOrderStatus,
        progressOrderToNextStep,
        ledger,
        wallet,
        transferRewards,
        coupons,
        toggleCouponActive,
        createCoupon,
        rechargeTxns,
        executeMobileRecharge,
        supportTickets,
        submitSupportTicket,
        replyToSupportTicket,
        auditLogs,
        favorites,
        toggleFavoriteRestaurant,
        toggleFavoriteDish,
        toasts,
        addToast,
        removeToast,
        searchQuery,
        setSearchQuery,
        selectedCuisine,
        setSelectedCuisine,
        vegOnlyFilter,
        setVegOnlyFilter,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
