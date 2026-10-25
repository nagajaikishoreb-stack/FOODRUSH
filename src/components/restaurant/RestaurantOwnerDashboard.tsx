import React, { useState } from 'react';
import {
  Store,
  CheckCircle2,
  Clock,
  Power,
  UtensilsCrossed,
  AlertCircle,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RestaurantOwnerDashboard: React.FC = () => {
  const {
    restaurants,
    menuItems,
    toggleRestaurantOpen,
    toggleItemAvailability,
    orders,
    updateOrderStatus,
    addToast,
  } = useApp();

  // For demo, manage the first restaurant (Nawabi Handi & Biryani)
  const currentRest = restaurants[0];
  const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders');

  const restOrders = orders.filter((o) => o.restaurantId === currentRest.id);
  const restMenuItems = menuItems.filter((m) => m.restaurantId === currentRest.id);

  const pendingOrders = restOrders.filter(
    (o) => o.status === 'paid' || o.status === 'placed' || o.status === 'accepted' || o.status === 'preparing'
  );

  const todayRevenue = restOrders
    .filter((o) => o.status !== 'cancelled' && o.status !== 'refunded')
    .reduce((sum, o) => sum + o.breakdown.itemTotal, 0);

  return (
    <div className="space-y-6 pb-20 animate-in fade-in">
      {/* Top Bar with Outlet Status Toggle */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-heading font-extrabold text-2xl text-neutral-900">
              {currentRest.name} Merchant Portal
            </h1>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                currentRest.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}
            >
              {currentRest.isOpen ? 'Accepting Orders' : 'Store Offline'}
            </span>
          </div>
          <p className="text-xs text-neutral-500">
            FSSAI Lic: {currentRest.fssaiNumber} · {currentRest.address}
          </p>
        </div>

        <button
          onClick={() => {
            toggleRestaurantOpen(currentRest.id);
            addToast('info', 'Store Status Updated', currentRest.isOpen ? 'Store is now Closed.' : 'Store is now Open!');
          }}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            currentRest.isOpen
              ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{currentRest.isOpen ? 'Close Outlet' : 'Open Outlet'}</span>
        </button>
      </div>

      {/* Role Security Notice */}
      <div className="p-3 bg-neutral-100 rounded-2xl border border-neutral-200 text-xs text-neutral-600 flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-neutral-500 shrink-0" />
        <span>
          <strong>Role Guard:</strong> Restaurant owners can manage store menus, prep workflows, and order dispatches. Platform ₹20 rewards, wallets, and platform-wide coupons are strictly managed by system admin.
        </span>
      </div>

      {/* Analytics KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-neutral-200">
          <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-semibold">Today's Kitchen GMV</span>
          <div className="font-heading font-extrabold text-2xl text-neutral-900 mt-1 tabular-nums">
            ₹{todayRevenue}
          </div>
          <span className="text-emerald-600 text-[11px] font-semibold mt-1 block">Net payout after 15% comm.</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200">
          <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-semibold">Total Orders</span>
          <div className="font-heading font-extrabold text-2xl text-neutral-900 mt-1 tabular-nums">
            {restOrders.length}
          </div>
          <span className="text-neutral-400 text-[11px] mt-1 block">{pendingOrders.length} active in queue</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200">
          <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-semibold">Avg. Prep Time</span>
          <div className="font-heading font-extrabold text-2xl text-neutral-900 mt-1 tabular-nums">
            18 mins
          </div>
          <span className="text-emerald-600 text-[11px] font-semibold mt-1 block">Super fast kitchen badge</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200">
          <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-semibold">Hygiene Audit</span>
          <div className="font-heading font-extrabold text-base text-emerald-700 mt-2">
            5-Star Hygiene
          </div>
          <span className="text-neutral-400 text-[11px] mt-1 block">Inspected Oct 2026</span>
        </div>
      </div>

      {/* Tabs: Orders Queue vs Menu Management */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'orders' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Live Kitchen Queue ({pendingOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={`px-4 py-2 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'menu' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Menu & Stock Manager ({restMenuItems.length})
        </button>
      </div>

      {activeTab === 'orders' ? (
        <div className="space-y-4">
          {pendingOrders.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-neutral-200 text-xs text-neutral-400">
              <UtensilsCrossed className="w-10 h-10 mx-auto text-neutral-300 mb-2" />
              <p className="font-semibold text-neutral-700">All orders dispatched!</p>
              <p className="text-neutral-400 mt-0.5">Incoming food orders will chime here in real-time.</p>
            </div>
          ) : (
            pendingOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                  <div>
                    <span className="font-heading font-extrabold text-base text-neutral-900">
                      Order #{ord.orderNumber}
                    </span>
                    <span className="text-xs text-neutral-500 ml-2">
                      Placed at {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full capitalize">
                    {ord.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-1.5 text-xs">
                  {ord.items.map((it) => (
                    <div key={it.id} className="flex justify-between font-medium">
                      <span>{it.quantity}x {it.menuItem.name} {it.selectedVariant ? `(${it.selectedVariant.name})` : ''}</span>
                      <span className="tabular-nums font-semibold">₹{it.totalPrice}</span>
                    </div>
                  ))}
                  {ord.deliveryInstructions && (
                    <p className="text-neutral-500 italic text-[11px] pt-1">
                      Note from customer: "{ord.deliveryInstructions}"
                    </p>
                  )}
                </div>

                {/* Workflow Buttons */}
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
                  {ord.status === 'paid' || ord.status === 'placed' ? (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'accepted', 'Restaurant accepted order')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Accept Order
                    </button>
                  ) : ord.status === 'accepted' ? (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'preparing', 'Chef started preparing')}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Start Cooking
                    </button>
                  ) : ord.status === 'preparing' ? (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'ready_for_pickup', 'Packed and ready for rider')}
                      className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Mark Ready for Rider Pickup →
                    </button>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Menu Items Stock Manager */
        <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs divide-y divide-neutral-100 text-xs">
          {restMenuItems.map((item) => (
            <div key={item.id} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`}
                    />
                    <h4 className="font-bold text-neutral-900 truncate">{item.name}</h4>
                  </div>
                  <p className="text-neutral-400 text-[11px] truncate">{item.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="font-heading font-extrabold text-sm tabular-nums text-neutral-900">
                  ₹{item.price}
                </span>

                <button
                  onClick={() => toggleItemAvailability(item.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                    item.isAvailable
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-50 text-rose-800 border border-rose-300'
                  }`}
                >
                  {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
