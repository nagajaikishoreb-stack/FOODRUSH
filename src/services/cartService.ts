import { CartItem, CartState } from '../types';

export const PLATFORM_FEE = 3.0; // ₹3 transparent platform development & maintenance fee
export const PACKAGING_FEE = 15.0; // ₹15 restaurant hygienic tamper-proof packing fee
export const GST_RATE = 0.05; // 5% GST on Restaurant Services (as per Indian taxation norms)

export function calculateDeliveryFee(distanceKm: number, isFreeDeliveryCoupon: boolean): number {
  if (isFreeDeliveryCoupon) return 0;
  if (distanceKm <= 2) return 25;
  if (distanceKm <= 4) return 35;
  return 45;
}

export function computeCartBill(
  items: CartItem[],
  distanceKm: number,
  couponCode: string | null,
  couponDiscount: number,
  foodRewardRedeemed: number,
  driverTip: number,
  restaurantId: string | null,
  restaurantName: string | null
): CartState {
  // 1. Calculate item total
  const itemTotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

  if (items.length === 0) {
    return {
      restaurantId: null,
      restaurantName: null,
      items: [],
      itemTotal: 0,
      couponCode: null,
      couponDiscount: 0,
      foodRewardRedeemed: 0,
      deliveryFee: 0,
      packagingFee: 0,
      platformFee: 0,
      gstAmount: 0,
      driverTip: 0,
      finalPayableAmount: 0,
    };
  }

  // 2. Fees
  const isFreeDeliveryCoupon = couponCode === 'FREEDELIVERY';
  const deliveryFee = calculateDeliveryFee(distanceKm, isFreeDeliveryCoupon);
  const packagingFee = PACKAGING_FEE;
  const platformFee = PLATFORM_FEE;
  const gstAmount = Math.round(itemTotal * GST_RATE * 100) / 100;

  // 3. Gross amount before discounts
  const grossSubtotal = itemTotal + deliveryFee + packagingFee + platformFee + gstAmount + driverTip;

  // 4. Net deductions (coupon and reward)
  const actualCouponDiscount = Math.min(couponDiscount, itemTotal);
  const remainingAfterCoupon = Math.max(0, grossSubtotal - actualCouponDiscount);
  const actualRewardRedeemed = Math.min(foodRewardRedeemed, remainingAfterCoupon);

  // 5. Final payable amount (cannot be negative)
  const finalPayableAmount = Math.max(0, Math.round((remainingAfterCoupon - actualRewardRedeemed) * 100) / 100);

  return {
    restaurantId,
    restaurantName,
    items,
    itemTotal,
    couponCode,
    couponDiscount: actualCouponDiscount,
    foodRewardRedeemed: actualRewardRedeemed,
    deliveryFee,
    packagingFee,
    platformFee,
    gstAmount,
    driverTip,
    finalPayableAmount,
  };
}
