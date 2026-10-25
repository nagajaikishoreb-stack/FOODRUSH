import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  Gift,
  MapPin,
  Clock,
  ShieldCheck,
  CreditCard,
  QrCode,
  Banknote,
  Sparkles,
  ChevronRight,
  Info,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateEligibleFoodRewardRedemption } from '../../services/rewardService';
import { findBestCoupon } from '../../services/couponService';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderPlaced: (orderId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onOrderPlaced }) => {
  const {
    cart,
    updateCartQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    wallet,
    setFoodRewardRedemption,
    setDriverTip,
    selectedAddress,
    placeOrder,
    coupons,
    orders,
    user,
    addToast,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCouponList, setShowCouponList] = useState(false);

  if (!isOpen) return null;

  // Best coupon recommendation
  const bestCouponResult = findBestCoupon(coupons, cart.itemTotal, orders, user.id, cart.restaurantId || undefined);

  // Eligible food reward
  const rewardEligibility = calculateEligibleFoodRewardRedemption(cart.itemTotal, wallet.foodBalance);

  const handleApplyCustomCoupon = () => {
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    if (!res.success) {
      addToast('warning', 'Coupon Not Valid', res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleCheckout = async () => {
    if (cart.items.length === 0) return;
    setIsProcessing(true);

    try {
      // Simulate real-world 1.2s gateway verification
      await new Promise((r) => setTimeout(r, 1200));
      const res = await placeOrder(selectedPayment, deliveryNote);
      if (res.success && res.orderId) {
        setIsProcessing(false);
        onClose();
        onOrderPlaced(res.orderId);
      } else {
        setIsProcessing(false);
        addToast('warning', 'Checkout Error', res.error || 'Failed to place order.');
      }
    } catch (err: any) {
      setIsProcessing(false);
      addToast('warning', 'Checkout Error', err?.message || 'Transaction could not be completed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/80">
            <div>
              <h2 className="font-heading font-bold text-lg text-neutral-900">Your FoodRush Cart</h2>
              <p className="text-xs text-neutral-500">
                {cart.restaurantName ? `From ${cart.restaurantName}` : 'Add your favorite dishes'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-200/60 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 text-sm">
            {cart.items.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                  <Gift className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="font-heading font-bold text-base text-neutral-800">Your cart is empty</h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  Explore our top-rated restaurants, pick mouthwatering dishes, and earn guaranteed ₹20 on delivery!
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-neutral-900 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-neutral-800 cursor-pointer"
                >
                  Browse Menus
                </button>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    <span>Order Items ({cart.items.length})</span>
                    <button
                      onClick={clearCart}
                      className="text-rose-600 hover:text-rose-700 normal-case font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  </div>

                  <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-2xl overflow-hidden p-3 bg-neutral-50/50">
                    {cart.items.map((item) => (
                      <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                        <div className="flex items-start gap-2 min-w-0">
                          <span
                            className={`w-3 h-3 mt-0.5 rounded-xs flex items-center justify-center border text-[8px] shrink-0 ${
                              item.menuItem.isVeg
                                ? 'border-emerald-600 text-emerald-600'
                                : 'border-rose-600 text-rose-600'
                            }`}
                          >
                            ●
                          </span>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-xs text-neutral-900 truncate">
                              {item.menuItem.name}
                            </h4>
                            {item.selectedVariant && (
                              <p className="text-[11px] text-neutral-500 truncate">
                                Size: {item.selectedVariant.name}
                              </p>
                            )}
                            {item.selectedAddons.length > 0 && (
                              <p className="text-[10px] text-neutral-400 truncate">
                                + {item.selectedAddons.map((a) => a.name).join(', ')}
                              </p>
                            )}
                            <div className="font-semibold text-xs text-neutral-800 mt-0.5 tabular-nums">
                              ₹{item.totalPrice}
                            </div>
                          </div>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-1 bg-white border border-neutral-300 rounded-lg p-0.5 shadow-2xs shrink-0">
                          <button
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="w-5 h-5 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 rounded cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold text-neutral-900 tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="w-5 h-5 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 rounded cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address Review */}
                <div className="p-3.5 rounded-2xl border border-neutral-200 bg-white">
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>Delivery Address: {selectedAddress.type}</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {selectedAddress.street}, {selectedAddress.area}, {selectedAddress.city} - {selectedAddress.pincode}
                  </p>
                  <input
                    type="text"
                    placeholder="Delivery instructions (e.g. Leave with guard, ring doorbell twice)..."
                    value={deliveryNote}
                    onChange={(e) => setDeliveryNote(e.target.value)}
                    className="w-full mt-2.5 px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Coupon Application Module */}
                <div className="p-3.5 rounded-2xl border border-neutral-200 bg-neutral-50 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-900">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-amber-600" />
                      <span>Offers & Coupons</span>
                    </div>
                    {cart.couponCode && (
                      <button
                        onClick={removeCoupon}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {cart.couponCode ? (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900 font-semibold">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Code "{cart.couponCode}" Applied!</span>
                      </div>
                      <span className="tabular-nums">-₹{cart.couponDiscount}</span>
                    </div>
                  ) : (
                    <>
                      {/* Input Box */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Enter coupon code (e.g. WELCOME50)"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          className="flex-1 px-3 py-2 text-xs uppercase bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-amber-500"
                        />
                        <button
                          onClick={handleApplyCustomCoupon}
                          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>

                      {/* Best Coupon 1-click recommendation */}
                      {bestCouponResult.bestCoupon && (
                        <div className="p-2.5 bg-amber-100/60 border border-amber-300 rounded-xl flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-amber-900">
                              Best Savings: {bestCouponResult.bestCoupon.code}
                            </span>
                            <p className="text-[11px] text-amber-800">
                              Save ₹{bestCouponResult.savings} instantly!
                            </p>
                          </div>
                          <button
                            onClick={() => applyCoupon(bestCouponResult.bestCoupon!.code)}
                            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs cursor-pointer shadow-2xs"
                          >
                            Apply Best
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* ₹20 Reward Wallet Redemption Module */}
                <div className="p-3.5 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-bold text-amber-950">Redeem Food Rewards</span>
                    </div>
                    <span className="text-xs font-bold text-amber-900 tabular-nums">
                      Balance: ₹{wallet.foodBalance}
                    </span>
                  </div>

                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Use your earned ₹20 reward vouchers to save on this meal (up to 50% of dish total).
                  </p>

                  {rewardEligibility.isEligible ? (
                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 text-xs font-medium text-amber-950 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cart.foodRewardRedeemed > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFoodRewardRedemption(rewardEligibility.maxRedeemable);
                            } else {
                              setFoodRewardRedemption(0);
                            }
                          }}
                          className="rounded text-amber-600 focus:ring-amber-500"
                        />
                        <span>Apply maximum available (₹{rewardEligibility.maxRedeemable})</span>
                      </label>
                      {cart.foodRewardRedeemed > 0 && (
                        <span className="text-xs font-bold text-amber-900 tabular-nums">
                          -₹{cart.foodRewardRedeemed}
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-[11px] text-neutral-500 italic">
                      {rewardEligibility.reason || 'Rewards require ₹100 min order.'}
                    </p>
                  )}
                </div>

                {/* Driver Tip */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-neutral-800">Tip your delivery rider</span>
                    <span className="text-[11px] text-neutral-400">100% goes directly to partner</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 20, 30, 50].map((tip) => (
                      <button
                        key={tip}
                        onClick={() => setDriverTip(tip)}
                        className={`py-1.5 text-xs font-bold rounded-xl border transition-colors cursor-pointer tabular-nums ${
                          cart.driverTip === tip
                            ? 'bg-neutral-900 text-white border-neutral-900'
                            : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        {tip === 0 ? 'No tip' : `₹${tip}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Option Selector */}
                <div>
                  <div className="text-xs font-bold text-neutral-800 mb-2">Select Payment Method</div>
                  <div className="space-y-1.5">
                    {[
                      { id: 'upi', label: 'UPI (Google Pay, PhonePe, Paytm, QR)', icon: QrCode },
                      { id: 'card', label: 'Credit / Debit Card (Visa, RuPay, MC)', icon: CreditCard },
                      { id: 'cod', label: 'Cash on Delivery (Verified OTP)', icon: Banknote },
                    ].map((m) => {
                      const Icon = m.icon;
                      return (
                        <label
                          key={m.id}
                          className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                            selectedPayment === m.id
                              ? 'border-amber-500 bg-amber-50/50 shadow-2xs'
                              : 'border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="radio"
                              name="checkout_payment"
                              checked={selectedPayment === m.id}
                              onChange={() => setSelectedPayment(m.id as any)}
                              className="text-amber-600 focus:ring-amber-500"
                            />
                            <Icon className="w-4 h-4 text-neutral-600" />
                            <span className="text-xs font-medium text-neutral-800">{m.label}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Transparent Bill Breakdown */}
                <div className="border border-neutral-200 rounded-2xl p-4 bg-white space-y-2 text-xs">
                  <div className="font-bold text-neutral-900 mb-1">Bill Details</div>

                  <div className="flex items-center justify-between text-neutral-600">
                    <span>Item Total</span>
                    <span className="tabular-nums font-medium text-neutral-900">₹{cart.itemTotal}</span>
                  </div>

                  {cart.couponDiscount > 0 && (
                    <div className="flex items-center justify-between text-emerald-600 font-semibold">
                      <span>Coupon Discount</span>
                      <span className="tabular-nums">-₹{cart.couponDiscount}</span>
                    </div>
                  )}

                  {cart.foodRewardRedeemed > 0 && (
                    <div className="flex items-center justify-between text-amber-700 font-semibold">
                      <span>Food Reward Voucher</span>
                      <span className="tabular-nums">-₹{cart.foodRewardRedeemed}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-neutral-600">
                    <span className="flex items-center gap-1">
                      <span>Delivery Partner Fee</span>
                      <Info className="w-3 h-3 text-neutral-400" />
                    </span>
                    <span className="tabular-nums font-medium text-neutral-900">
                      {cart.deliveryFee === 0 ? <span className="text-emerald-600">FREE</span> : `₹${cart.deliveryFee}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-neutral-600">
                    <span>Restaurant Packaging</span>
                    <span className="tabular-nums font-medium text-neutral-900">₹{cart.packagingFee}</span>
                  </div>

                  <div className="flex items-center justify-between text-neutral-600">
                    <span className="flex items-center gap-1">
                      <span>Platform Fee</span>
                      <span className="text-[10px] bg-neutral-100 text-neutral-500 px-1 rounded">Fixed</span>
                    </span>
                    <span className="tabular-nums font-medium text-neutral-900">₹{cart.platformFee}</span>
                  </div>

                  <div className="flex items-center justify-between text-neutral-600">
                    <span>GST (5% on Restaurant Services)</span>
                    <span className="tabular-nums font-medium text-neutral-900">₹{cart.gstAmount}</span>
                  </div>

                  {cart.driverTip > 0 && (
                    <div className="flex items-center justify-between text-neutral-600">
                      <span>Delivery Partner Tip</span>
                      <span className="tabular-nums font-medium text-neutral-900">₹{cart.driverTip}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-neutral-200 flex items-center justify-between font-heading font-extrabold text-base text-neutral-900">
                    <span>To Pay</span>
                    <span className="tabular-nums text-amber-600">₹{cart.finalPayableAmount}</span>
                  </div>
                </div>

                {/* Guaranteed Reward Promise Banner */}
                <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl text-xs flex items-center gap-2.5 shadow-sm">
                  <Gift className="w-5 h-5 shrink-0" />
                  <div>
                    <span className="font-bold block">₹20 Reward Voucher will be unlocked</span>
                    <span className="text-[11px] text-amber-100">
                      Credited automatically upon successful delivery confirmation!
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer / Place Order CTA */}
          {cart.items.length > 0 && (
            <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-neutral-500">Total Payable</span>
                <div className="font-heading font-extrabold text-xl text-neutral-900 tabular-nums">
                  ₹{cart.finalPayableAmount}
                </div>
              </div>

              <button
                disabled={isProcessing}
                onClick={handleCheckout}
                className="flex-1 py-3 px-6 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing Payment...</span>
                  </span>
                ) : (
                  <span>Place Order • ₹{cart.finalPayableAmount}</span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
