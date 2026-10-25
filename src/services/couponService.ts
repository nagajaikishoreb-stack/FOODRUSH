import { Coupon, Order } from '../types';

export interface CouponValidationResult {
  isValid: boolean;
  discountAmount: number;
  reason?: string;
  appliedCoupon?: Coupon;
}

/**
 * Validates a coupon against current order subtotal, user order history, and coupon rules.
 */
export function validateCoupon(
  coupon: Coupon,
  itemTotal: number,
  userOrders: Order[],
  userId: string,
  restaurantId?: string,
  isPureVegOrder?: boolean
): CouponValidationResult {
  // 1. Active check
  if (!coupon.isActive) {
    return { isValid: false, discountAmount: 0, reason: 'This coupon is currently inactive or disabled.' };
  }

  // 2. Expiration check
  const now = new Date();
  const expiry = new Date(coupon.validTill);
  if (now > expiry) {
    return { isValid: false, discountAmount: 0, reason: `Coupon expired on ${coupon.validTill}.` };
  }

  // 3. Minimum order threshold
  if (itemTotal < coupon.minOrderValue) {
    return {
      isValid: false,
      discountAmount: 0,
      reason: `Add ₹${coupon.minOrderValue - itemTotal} more to unlock coupon "${coupon.code}" (Min: ₹${coupon.minOrderValue}).`,
    };
  }

  // 4. First-order only restriction
  if (coupon.firstOrderOnly) {
    const previousSuccessfulOrders = userOrders.filter(
      (o) => o.userId === userId && o.status !== 'cancelled' && o.status !== 'refunded'
    );
    if (previousSuccessfulOrders.length > 0) {
      return { isValid: false, discountAmount: 0, reason: 'This coupon is valid only on your first order.' };
    }
  }

  // 5. Per-user usage limit
  const timesUsedByUser = userOrders.filter(
    (o) => o.userId === userId && o.couponApplied === coupon.code && o.status !== 'cancelled'
  ).length;

  if (timesUsedByUser >= coupon.usageLimitPerUser) {
    return {
      isValid: false,
      discountAmount: 0,
      reason: `You have reached the maximum redemption limit (${coupon.usageLimitPerUser} times) for coupon ${coupon.code}.`,
    };
  }

  // 6. Special veg coupon check
  if (coupon.code === 'VEGDEAL' && isPureVegOrder === false) {
    return {
      isValid: false,
      discountAmount: 0,
      reason: 'Coupon VEGDEAL is only valid on Pure Vegetarian orders.',
    };
  }

  // 7. Calculate discount
  let calculatedDiscount = 0;
  if (coupon.discountType === 'percentage') {
    calculatedDiscount = Math.round((itemTotal * coupon.discountValue) / 100);
    calculatedDiscount = Math.min(calculatedDiscount, coupon.maxDiscount);
  } else {
    calculatedDiscount = Math.min(coupon.discountValue, coupon.maxDiscount);
  }

  // Cap discount so total doesn't become negative
  calculatedDiscount = Math.min(calculatedDiscount, itemTotal);

  return {
    isValid: true,
    discountAmount: calculatedDiscount,
    appliedCoupon: coupon,
  };
}

/**
 * Finds and recommends the best coupon that maximizes customer savings.
 */
export function findBestCoupon(
  coupons: Coupon[],
  itemTotal: number,
  userOrders: Order[],
  userId: string,
  restaurantId?: string,
  isPureVegOrder?: boolean
): { bestCoupon: Coupon | null; savings: number; allApplicable: Array<{ coupon: Coupon; savings: number }> } {
  let bestCoupon: Coupon | null = null;
  let maxSavings = 0;
  const allApplicable: Array<{ coupon: Coupon; savings: number }> = [];

  for (const coupon of coupons) {
    const result = validateCoupon(coupon, itemTotal, userOrders, userId, restaurantId, isPureVegOrder);
    if (result.isValid && result.discountAmount > 0) {
      allApplicable.push({ coupon, savings: result.discountAmount });
      if (result.discountAmount > maxSavings) {
        maxSavings = result.discountAmount;
        bestCoupon = coupon;
      }
    }
  }

  allApplicable.sort((a, b) => b.savings - a.savings);

  return {
    bestCoupon,
    savings: maxSavings,
    allApplicable,
  };
}
