import React, { useEffect, useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Phone,
  MessageSquare,
  ShieldCheck,
  AlertTriangle,
  Gift,
  MapPin,
  Store,
  Bike,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Headphones,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { useApp } from '../../context/AppContext';

interface OrderTrackingViewProps {
  orderId?: string;
  onBackToHome: () => void;
  onOpenSupport: () => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  orderId,
  onBackToHome,
  onOpenSupport,
}) => {
  const { orders, activeOrder, progressOrderToNextStep, updateOrderStatus } = useApp();

  const currentOrder = orders.find((o) => o.id === orderId) || activeOrder || orders[0];

  const [bikePosition, setBikePosition] = useState(20); // 0 to 100% along route

  const stages: Array<{ key: OrderStatus; label: string; desc: string }> = [
    { key: 'placed', label: 'Order Placed', desc: 'Received & sent to restaurant' },
    { key: 'paid', label: 'Payment Verified', desc: 'Secure payment confirmed' },
    { key: 'accepted', label: 'Restaurant Confirmed', desc: 'Kitchen acknowledged order' },
    { key: 'preparing', label: 'Cooking & Packing', desc: 'Chef preparing fresh dishes' },
    { key: 'ready_for_pickup', label: 'Ready for Pickup', desc: 'Packed hot & sealed' },
    { key: 'partner_assigned', label: 'Rider Assigned', desc: 'Delivery partner reached kitchen' },
    { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Rider on route to your location' },
    { key: 'delivered', label: 'Order Delivered', desc: 'Delivered with OTP verification' },
  ];

  const currentStageIndex = stages.findIndex((s) => s.key === currentOrder?.status);

  // Animate bike position based on stage
  useEffect(() => {
    if (!currentOrder) return;
    const progressMap: Record<OrderStatus, number> = {
      placed: 5,
      paid: 15,
      accepted: 25,
      preparing: 40,
      ready_for_pickup: 55,
      partner_assigned: 70,
      out_for_delivery: 88,
      delivered: 100,
      cancelled: 0,
      refunded: 0,
    };
    setBikePosition(progressMap[currentOrder.status] || 10);
  }, [currentOrder?.status]);

  if (!currentOrder) {
    return (
      <div className="py-20 text-center bg-white rounded-3xl border border-neutral-200">
        <h3 className="font-heading font-bold text-lg text-neutral-800">No active order found</h3>
        <p className="text-xs text-neutral-500 mt-1">Place an order to experience live tracking.</p>
        <button
          onClick={onBackToHome}
          className="mt-4 px-4 py-2 bg-neutral-900 text-white text-xs font-bold rounded-xl cursor-pointer"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  const isDelivered = currentOrder.status === 'delivered';

  return (
    <div className="space-y-6 pb-20 animate-in fade-in">
      {/* Top Banner Status */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-heading font-extrabold text-2xl text-neutral-900">
              {isDelivered ? 'Order Delivered!' : `Arriving in ~${currentOrder.estimatedDeliveryMinutes} mins`}
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                isDelivered
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800 animate-pulse'
              }`}
            >
              {currentOrder.status.replace('_', ' ')}
            </span>
          </div>
          <p className="text-xs text-neutral-500">
            Order #{currentOrder.orderNumber} • Placed at {new Date(currentOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Delivery OTP Card */}
        <div className="flex items-center gap-4 bg-neutral-50 border border-neutral-200 px-4 py-2.5 rounded-2xl shrink-0">
          <div>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold">
              Delivery OTP PIN
            </span>
            <span className="font-heading font-black text-xl text-neutral-900 tracking-widest tabular-nums">
              {currentOrder.deliveryOtp}
            </span>
          </div>
          <span className="text-[11px] text-neutral-500 max-w-[130px] leading-tight">
            Share this 4-digit code with your rider upon arrival
          </span>
        </div>
      </div>

      {/* Simulated Live Route Map View */}
      <div className="relative bg-neutral-900 rounded-3xl overflow-hidden shadow-lg border border-neutral-800 h-72 sm:h-80">
        {/* Stylized Dark Grid Map SVG */}
        <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="mapgrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapgrid)" />
          {/* Main roads */}
          <path d="M 50 180 Q 250 80 450 160 T 800 120" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" strokeLinecap="round" />
          <path d="M 120 40 L 220 280" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
          <path d="M 350 40 L 400 280" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
          <path d="M 600 40 L 550 280" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
          {/* Active Navigation Route */}
          <path
            d="M 100 200 C 250 120, 450 240, 700 140"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="6 4"
          />
        </svg>

        {/* Map Elements: Restaurant Pin */}
        <div className="absolute left-[12%] bottom-[25%] -translate-x-1/2 flex flex-col items-center">
          <div className="w-10 h-10 rounded-2xl bg-white text-neutral-900 shadow-xl flex items-center justify-center font-bold text-xs ring-4 ring-amber-500/30">
            <Store className="w-5 h-5 text-amber-600" />
          </div>
          <span className="text-[11px] font-bold text-white bg-black/70 px-2 py-0.5 rounded-md mt-1 backdrop-blur-xs whitespace-nowrap">
            {currentOrder.restaurantName}
          </span>
        </div>

        {/* Moving Delivery Partner Bike Pin */}
        <div
          className="absolute top-[48%] -translate-y-1/2 -translate-x-1/2 flex flex-col items-center transition-all duration-1000"
          style={{ left: `${Math.min(85, Math.max(15, bikePosition))}%` }}
        >
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-neutral-950 shadow-2xl flex items-center justify-center font-bold text-xs ring-4 ring-white/50 animate-bounce">
              <Bike className="w-6 h-6" />
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/40 rounded-full blur-xs" />
          </div>
          <span className="text-[10px] font-bold text-neutral-950 bg-amber-400 px-2 py-0.5 rounded-md mt-1 whitespace-nowrap shadow-xs">
            Rider Suresh (KA-01-ER-8821)
          </span>
        </div>

        {/* Map Elements: Customer Destination Pin */}
        <div className="absolute right-[12%] top-[25%] -translate-x-1/2 flex flex-col items-center">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white shadow-xl flex items-center justify-center font-bold text-xs ring-4 ring-emerald-500/30">
            <MapPin className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-white bg-black/70 px-2 py-0.5 rounded-md mt-1 backdrop-blur-xs whitespace-nowrap">
            {currentOrder.deliveryAddress.type} ({currentOrder.deliveryAddress.area})
          </span>
        </div>

        {/* Simulation Controls Strip */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-neutral-950/80 backdrop-blur-md p-2 rounded-xl border border-neutral-700">
          <span className="text-[10px] text-neutral-400 font-semibold uppercase px-1">
            Simulate Stage:
          </span>
          {!isDelivered ? (
            <>
              <button
                onClick={() => progressOrderToNextStep(currentOrder.id)}
                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-bold rounded-lg cursor-pointer"
              >
                Next Step →
              </button>
              <button
                onClick={() => updateOrderStatus(currentOrder.id, 'delivered')}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Instant Deliver & Earn ₹20
              </button>
            </>
          ) : (
            <span className="text-xs text-emerald-400 font-bold px-2">✓ Delivered & ₹20 Credited</span>
          )}
        </div>
      </div>

      {/* Guaranteed ₹20 Reward Notification Banner */}
      <div
        className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
          isDelivered
            ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300 text-emerald-950 shadow-sm'
            : 'bg-amber-50/70 border-amber-200 text-amber-950'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isDelivered ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
            }`}
          >
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider">
              {isDelivered ? '🎉 ₹20 Reward Successfully Credited!' : '₹20 Reward Voucher Pending Delivery'}
            </h4>
            <p className="text-xs text-neutral-600 mt-0.5">
              {isDelivered
                ? 'Your Food Reward Balance was credited with ₹20. Use it on your next meal or allocate to Mobile Recharge.'
                : 'Guaranteed credit as soon as rider Suresh confirms delivery with your 4-digit PIN.'}
            </p>
          </div>
        </div>

        {isDelivered && (
          <button
            onClick={onBackToHome}
            className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-neutral-800 shrink-0"
          >
            Order More Food →
          </button>
        )}
      </div>

      {/* Two Column Layout: Lifecycle Steps + Partner Details & Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Lifecycle Steps Timeline */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-neutral-200 p-6 shadow-xs space-y-6">
          <h3 className="font-heading font-bold text-lg text-neutral-900">Live Order Lifecycle</h3>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-neutral-200">
            {stages.map((stage, idx) => {
              const isPassed = idx <= currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div key={stage.key} className="relative flex items-start gap-3">
                  {/* Step Dot */}
                  <div
                    className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isPassed
                        ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                        : 'bg-neutral-200 text-neutral-500'
                    }`}
                  >
                    {isPassed ? '✓' : idx + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-xs font-bold ${
                          isCurrent ? 'text-amber-600' : isPassed ? 'text-neutral-900' : 'text-neutral-400'
                        }`}
                      >
                        {stage.label}
                      </h4>
                      {isCurrent && (
                        <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                          In Progress
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">{stage.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Delivery Partner Card & Receipt Summary */}
        <div className="space-y-4">
          {/* Rider Card */}
          <div className="bg-white rounded-3xl border border-neutral-200 p-5 shadow-xs">
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">
              Delivery Partner
            </h4>
            <div className="flex items-center gap-3">
              <img
                src={currentOrder.deliveryPartner?.photo}
                alt={currentOrder.deliveryPartner?.name}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-neutral-200"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-neutral-900 truncate">
                    {currentOrder.deliveryPartner?.name}
                  </h4>
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5">
                    ★ {currentOrder.deliveryPartner?.rating}
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  Vehicle: {currentOrder.deliveryPartner?.vehicleNumber}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center gap-2">
              <a
                href={`tel:${currentOrder.deliveryPartner?.phone}`}
                className="flex-1 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Partner</span>
              </a>
              <button
                onClick={onOpenSupport}
                className="py-2 px-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Headphones className="w-3.5 h-3.5 text-amber-600" />
                <span>Support</span>
              </button>
            </div>
          </div>

          {/* Receipt Breakdown */}
          <div className="bg-white rounded-3xl border border-neutral-200 p-5 shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between font-bold text-neutral-900">
              <span>Order Summary</span>
              <span className="text-neutral-500 font-normal">
                {currentOrder.items.length} items
              </span>
            </div>

            <div className="divide-y divide-neutral-100">
              {currentOrder.items.map((it) => (
                <div key={it.id} className="py-2 flex items-center justify-between">
                  <div className="truncate mr-2">
                    <span className="font-medium text-neutral-800">{it.quantity}x {it.menuItem.name}</span>
                  </div>
                  <span className="tabular-nums font-semibold text-neutral-900">₹{it.totalPrice}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-neutral-100 space-y-1.5 text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="tabular-nums">₹{currentOrder.breakdown.itemTotal}</span>
              </div>
              {currentOrder.breakdown.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon Discount</span>
                  <span className="tabular-nums">-₹{currentOrder.breakdown.couponDiscount}</span>
                </div>
              )}
              {currentOrder.breakdown.foodRewardRedeemed > 0 && (
                <div className="flex justify-between text-amber-700">
                  <span>Reward Redeemed</span>
                  <span className="tabular-nums">-₹{currentOrder.breakdown.foodRewardRedeemed}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery & Platform Fee</span>
                <span className="tabular-nums">₹{currentOrder.breakdown.deliveryFee + currentOrder.breakdown.platformFee}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-neutral-900 pt-1 border-t border-neutral-100">
                <span>Amount Paid ({currentOrder.paymentMethod.toUpperCase()})</span>
                <span className="tabular-nums text-amber-600">₹{currentOrder.breakdown.totalPaid}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
