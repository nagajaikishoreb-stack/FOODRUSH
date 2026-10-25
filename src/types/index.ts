export type UserRole = 'customer' | 'restaurant_owner' | 'delivery_partner' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  dietaryPreferences: string[];
  allergens: string[];
  savedAddresses: DeliveryAddress[];
  role: UserRole;
  createdAt: string;
}

export interface DeliveryAddress {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault?: boolean;
  coordinates?: { lat: number; lng: number };
}

export interface MenuItemAddon {
  id: string;
  name: string;
  price: number; // in rupees
  isVeg: boolean;
}

export interface AddonGroup {
  id: string;
  title: string;
  minSelection: number;
  maxSelection: number;
  addons: MenuItemAddon[];
}

export interface MenuItemVariant {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isVeg: boolean;
  isBestseller?: boolean;
  isAvailable: boolean;
  rating: number;
  ratingCount: number;
  preparationTimeMinutes: number;
  variants?: MenuItemVariant[];
  addonGroups?: AddonGroup[];
  spiceLevel?: 'Mild' | 'Medium' | 'Spicy';
  calories?: number;
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  cuisines: string[];
  rating: number;
  ratingCount: number;
  deliveryTimeMinutes: number;
  distanceKm: number;
  priceForTwo: number;
  image: string;
  coverImage?: string;
  isPureVeg: boolean;
  isOpen: boolean;
  openingHours: string;
  address: string;
  locality: string;
  minOrderAmount: number;
  featuredOffer?: string;
  hygieneRating: string;
  fssaiNumber: string;
  menuCategories: string[];
}

export interface CartItem {
  id: string; // unique item instance id
  menuItem: MenuItem;
  selectedVariant?: MenuItemVariant;
  selectedAddons: MenuItemAddon[];
  specialInstructions?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CartState {
  restaurantId: string | null;
  restaurantName: string | null;
  items: CartItem[];
  itemTotal: number;
  couponCode: string | null;
  couponDiscount: number;
  foodRewardRedeemed: number;
  deliveryFee: number;
  packagingFee: number;
  platformFee: number;
  gstAmount: number;
  driverTip: number;
  finalPayableAmount: number;
}

export type OrderStatus =
  | 'placed'
  | 'paid'
  | 'accepted'
  | 'preparing'
  | 'ready_for_pickup'
  | 'partner_assigned'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;
  restaurantImage: string;
  items: CartItem[];
  deliveryAddress: DeliveryAddress;
  deliveryInstructions?: string;
  status: OrderStatus;
  statusHistory: OrderStatusHistoryItem[];
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod';
  paymentStatus: 'pending' | 'success' | 'failed' | 'refunded';
  paymentTxnId: string;
  breakdown: {
    itemTotal: number;
    couponDiscount: number;
    foodRewardRedeemed: number;
    deliveryFee: number;
    packagingFee: number;
    platformFee: number;
    gstAmount: number;
    driverTip: number;
    totalPaid: number;
  };
  couponApplied?: string;
  rewardEarned: number; // ₹20 upon delivery
  rewardCredited: boolean;
  deliveryPartner?: {
    id: string;
    name: string;
    phone: string;
    photo: string;
    vehicleNumber: string;
    rating: number;
    currentCoords?: { lat: number; lng: number };
  };
  deliveryOtp: string;
  estimatedDeliveryMinutes: number;
  createdAt: string;
  deliveredAt?: string;
}

export type LedgerEntryType =
  | 'credit_order_reward'
  | 'debit_food_order'
  | 'transfer_to_recharge'
  | 'transfer_to_food'
  | 'debit_recharge'
  | 'refund_reversal';

export interface RewardLedgerEntry {
  id: string;
  userId: string;
  orderId?: string;
  type: LedgerEntryType;
  amount: number; // in Rupees
  category: 'food' | 'recharge';
  status: 'available' | 'reserved' | 'redeemed' | 'reversed' | 'expired';
  description: string;
  referenceId: string; // e.g., order #, recharge txn #
  createdAt: string;
}

export interface RewardWallet {
  userId: string;
  foodBalance: number;
  rechargeBalance: number;
  pendingBalance: number;
  lifetimeEarned: number;
  ledger: RewardLedgerEntry[];
}

export interface Coupon {
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount: number;
  validTill: string;
  firstOrderOnly?: boolean;
  categoryRestriction?: string;
  usageLimitPerUser: number;
  isActive: boolean;
}

export type TelecomOperator = 'Jio' | 'Airtel' | 'Vi' | 'BSNL';

export interface MobileRechargePlan {
  id: string;
  operator: TelecomOperator;
  category: 'Recommended' | 'Truly Unlimited' | 'Data Booster' | 'Annual Value';
  price: number;
  validity: string;
  data: string;
  calls: string;
  sms: string;
  benefits: string[];
}

export interface RechargeTransaction {
  id: string;
  userId: string;
  mobileNumber: string;
  operator: TelecomOperator;
  circle: string;
  planId: string;
  planAmount: number;
  rewardRedeemed: number;
  amountPaid: number;
  paymentMethod: string;
  status: 'success' | 'processing' | 'failed';
  operatorRefId: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  orderId?: string;
  category: 'Order Issue' | 'Delivery Delay' | 'Reward Wallet' | 'Mobile Recharge' | 'General Query';
  subject: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  messages: Array<{
    id: string;
    sender: 'user' | 'agent' | 'system';
    text: string;
    timestamp: string;
  }>;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  role: string;
  entityId: string;
  details: string;
  severity: 'info' | 'warning' | 'critical';
}
