import React, { useState } from 'react';
import {
  Bike,
  Power,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
  Navigation,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DeliveryPartnerDashboard: React.FC = () => {
  const { orders, updateOrderStatus, addToast } = useApp();
  const [isOnline, setIsOnline] = useState(true);
  const [enteredOtp, setEnteredOtp] = useState('');

  // Active delivery assigned to rider
  const activeDelivery = orders.find(
    (o) => o.status === 'partner_assigned' || o.status === 'out_for_delivery' || o.status === 'ready_for_pickup'
  );

  const completedDeliveries = orders.filter((o) => o.status === 'delivered');

  const todayEarnings = completedDeliveries.length * 45 + 50; // base pay + surge

  const handleConfirmDelivery = (orderId: string, actualOtp: string) => {
    if (enteredOtp.trim() !== actualOtp) {
      addToast('warning', 'Invalid OTP PIN', 'Please ask customer for the correct 4-digit delivery PIN.');
      return;
    }
    updateOrderStatus(orderId, 'delivered', 'Partner verified customer OTP and marked delivered');
    setEnteredOtp('');
    addToast('success', 'Delivery Completed!', '₹45 trip fee added to your partner wallet.');
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in">
      {/* Top Bar with Online Toggle & Today's Earnings */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-heading font-extrabold text-2xl text-neutral-900">
              Delivery Partner Portal
            </h1>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'
              }`}
            >
              {isOnline ? 'Online (Accepting Orders)' : 'Offline (On Break)'}
            </span>
          </div>
          <p className="text-xs text-neutral-500">
            Rider ID: KA-8821 · Suresh Kumar · 4.9 ★ Partner Rating
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsOnline(!isOnline);
              addToast('info', 'Duty Status Changed', isOnline ? 'You are now Offline.' : 'You are now Online!');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              isOnline
                ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{isOnline ? 'Go Offline' : 'Go Online'}</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-neutral-200">
          <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-semibold">Today's Earnings</span>
          <div className="font-heading font-extrabold text-2xl text-neutral-900 mt-1 tabular-nums">
            ₹{todayEarnings}
          </div>
          <span className="text-emerald-600 text-[11px] font-semibold mt-1 block">Payout daily at 11 PM</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200">
          <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-semibold">Trips Completed</span>
          <div className="font-heading font-extrabold text-2xl text-neutral-900 mt-1 tabular-nums">
            {completedDeliveries.length}
          </div>
          <span className="text-neutral-400 text-[11px] mt-1 block">100% on-time rating</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200">
          <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-semibold">Customer Tips</span>
          <div className="font-heading font-extrabold text-2xl text-neutral-900 mt-1 tabular-nums">
            ₹30
          </div>
          <span className="text-neutral-400 text-[11px] mt-1 block">Directly credited to you</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200">
          <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-semibold">Safety & Compliance</span>
          <div className="font-heading font-extrabold text-base text-emerald-700 mt-2 flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Verified Pro</span>
          </div>
        </div>
      </div>

      {/* Active Assignment Section */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <h2 className="font-heading font-bold text-lg text-neutral-900">
          Current Assignment
        </h2>

        {!activeDelivery ? (
          <div className="py-12 text-center text-neutral-400 text-xs">
            <Bike className="w-10 h-10 mx-auto text-neutral-300 mb-2" />
            <p className="font-semibold text-neutral-700">No active deliveries assigned</p>
            <p className="text-neutral-400 mt-0.5">Stay online. New orders in Koramangala will appear here automatically.</p>
          </div>
        ) : (
          <div className="p-5 rounded-2xl border border-amber-300 bg-amber-50/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
              <div>
                <span className="text-xs font-bold text-amber-900">
                  Order #{activeDelivery.orderNumber}
                </span>
                <span className="text-xs text-neutral-500 ml-2">
                  Status: <strong className="capitalize text-neutral-800">{activeDelivery.status.replace('_', ' ')}</strong>
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
                Payout: ₹45.00
              </span>
            </div>

            {/* Route Stops */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Pickup */}
              <div className="p-3 bg-white rounded-xl border border-neutral-200 space-y-1">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                  Pickup From:
                </span>
                <h4 className="font-bold text-neutral-900">{activeDelivery.restaurantName}</h4>
                <p className="text-neutral-500">{activeDelivery.restaurantAddress}</p>
              </div>

              {/* Delivery Drop */}
              <div className="p-3 bg-white rounded-xl border border-neutral-200 space-y-1">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                  Drop to Customer:
                </span>
                <h4 className="font-bold text-neutral-900">
                  {activeDelivery.deliveryAddress.type} ({activeDelivery.deliveryAddress.area})
                </h4>
                <p className="text-neutral-500">
                  {activeDelivery.deliveryAddress.street}, {activeDelivery.deliveryAddress.city}
                </p>
              </div>
            </div>

            {/* Actions based on state */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {activeDelivery.status === 'ready_for_pickup' || activeDelivery.status === 'partner_assigned' ? (
                <button
                  onClick={() => updateOrderStatus(activeDelivery.id, 'out_for_delivery', 'Partner picked up hot parcels')}
                  className="w-full sm:w-auto px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Confirm Pickup & Start Delivery →
                </button>
              ) : activeDelivery.status === 'out_for_delivery' ? (
                <div className="w-full flex flex-col sm:flex-row items-center gap-3">
                  <div className="w-full sm:w-auto flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="Enter 4-digit PIN"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                      className="px-3 py-2 text-xs font-mono font-bold bg-white border border-neutral-300 rounded-xl focus:outline-none focus:border-amber-500 w-36 text-center tabular-nums"
                    />
                    <button
                      onClick={() => handleConfirmDelivery(activeDelivery.id, activeDelivery.deliveryOtp)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                    >
                      Confirm Drop-off
                    </button>
                  </div>
                  <span className="text-[11px] text-neutral-500 italic">
                    (Demo hint: Customer OTP is {activeDelivery.deliveryOtp})
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* Completed Deliveries History */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <h3 className="font-heading font-bold text-base text-neutral-900">
          Recent Completed Trips
        </h3>
        <div className="divide-y divide-neutral-100 text-xs">
          {completedDeliveries.map((d) => (
            <div key={d.id} className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-neutral-900">Order #{d.orderNumber}</span>
                <p className="text-neutral-500">{d.restaurantName} → {d.deliveryAddress.area}</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-emerald-600 block tabular-nums">+₹45.00</span>
                <span className="text-[10px] text-neutral-400">Delivered</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
