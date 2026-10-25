import React, { useState } from 'react';
import {
  ShoppingBag,
  MapPin,
  Search,
  Sparkles,
  Smartphone,
  Tag,
  Headphones,
  User,
  ChevronDown,
  Gift,
  Bike,
  Store,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab, onOpenCart }) => {
  const { user, setUserRole, selectedAddress, setSelectedAddress, cart, wallet, searchQuery, setSearchQuery } = useApp();
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const cartItemsCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const roles: Array<{ role: UserRole; label: string; icon: any; color: string }> = [
    { role: 'customer', label: 'Customer View', icon: User, color: 'text-amber-600' },
    { role: 'delivery_partner', label: 'Delivery Partner', icon: Bike, color: 'text-emerald-600' },
    { role: 'restaurant_owner', label: 'Restaurant Owner', icon: Store, color: 'text-blue-600' },
    { role: 'admin', label: 'Platform Admin', icon: ShieldCheck, color: 'text-purple-600' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 shrink-0" />
        <span>Guaranteed ₹20 Reward Voucher on every completed delivery • Redeem on future meals or instant Mobile Recharge!</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Zone 1: Brand Wordmark & Location */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => setCurrentTab('home')}
              className="flex items-center gap-2 group text-left cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-xl shadow-sm group-hover:scale-105 transition-transform">
                FR
              </div>
              <div>
                <span className="font-heading font-extrabold text-2xl tracking-tight text-neutral-900 group-hover:text-amber-600 transition-colors">
                  Food<span className="text-amber-600">Rush</span>
                </span>
              </div>
            </button>

            {/* Address Selector */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowAddressDropdown(!showAddressDropdown)}
                className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200/80 px-3 py-1.5 rounded-lg transition-colors cursor-pointer max-w-[200px]"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="font-semibold text-neutral-800 shrink-0">{selectedAddress.type}:</span>
                <span className="truncate">{selectedAddress.area}</span>
                <ChevronDown className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
              </button>

              {showAddressDropdown && (
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Select Delivery Address
                  </div>
                  {user.savedAddresses.map((addr) => (
                    <button
                      key={addr.id}
                      onClick={() => {
                        setSelectedAddress(addr);
                        setShowAddressDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-amber-50 flex items-start gap-2 transition-colors cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 font-semibold text-neutral-800">
                          <span>{addr.type}</span>
                          {addr.id === selectedAddress.id && (
                            <Check className="w-3 h-3 text-amber-600 inline ml-1" />
                          )}
                        </div>
                        <p className="text-neutral-500 truncate">{addr.street}, {addr.area}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search Bar (Customer Mode) */}
          {user.role === 'customer' && (
            <div className="flex-1 max-w-md hidden sm:block">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search for biryani, pizzas, dosas, restaurants..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (currentTab !== 'home') setCurrentTab('home');
                  }}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-neutral-100 hover:bg-neutral-200/60 focus:bg-white border border-transparent focus:border-amber-500 rounded-xl focus:outline-none transition-all placeholder:text-neutral-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-neutral-600">
            <button
              onClick={() => setCurrentTab('home')}
              className={`hover:text-amber-600 transition-colors whitespace-nowrap cursor-pointer ${
                currentTab === 'home' ? 'text-amber-600 font-semibold' : ''
              }`}
            >
              Restaurants
            </button>
            <button
              onClick={() => setCurrentTab('rewards')}
              className={`flex items-center gap-1.5 hover:text-amber-600 transition-colors whitespace-nowrap cursor-pointer ${
                currentTab === 'rewards' ? 'text-amber-600 font-semibold' : ''
              }`}
            >
              <Gift className="w-4 h-4 text-amber-600" />
              <span>₹20 Rewards</span>
            </button>
            <button
              onClick={() => setCurrentTab('recharge')}
              className={`flex items-center gap-1.5 hover:text-amber-600 transition-colors whitespace-nowrap cursor-pointer ${
                currentTab === 'recharge' ? 'text-amber-600 font-semibold' : ''
              }`}
            >
              <Smartphone className="w-4 h-4 text-amber-600" />
              <span>Mobile Recharge</span>
            </button>
            <button
              onClick={() => setCurrentTab('coupons')}
              className={`flex items-center gap-1.5 hover:text-amber-600 transition-colors whitespace-nowrap cursor-pointer ${
                currentTab === 'coupons' ? 'text-amber-600 font-semibold' : ''
              }`}
            >
              <Tag className="w-4 h-4 text-amber-600" />
              <span>Coupons</span>
            </button>
            <button
              onClick={() => setCurrentTab('support')}
              className={`flex items-center gap-1.5 hover:text-amber-600 transition-colors whitespace-nowrap cursor-pointer ${
                currentTab === 'support' ? 'text-amber-600 font-semibold' : ''
              }`}
            >
              <Headphones className="w-4 h-4" />
              <span>Support</span>
            </button>
          </nav>

          {/* Zone 3: Wallet Pill, Role Switcher, Cart & Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Reward Balance Pill */}
            <button
              onClick={() => setCurrentTab('rewards')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 text-amber-900 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs group"
              title="Click to view ₹20 Reward Wallet"
            >
              <Gift className="w-3.5 h-3.5 text-amber-600 group-hover:rotate-12 transition-transform" />
              <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] text-amber-700">Rewards</span>
                <span className="tabular-nums font-bold text-amber-900">₹{wallet.foodBalance + wallet.rechargeBalance}</span>
              </div>
            </button>

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-xl border border-neutral-200 hover:border-neutral-300 bg-neutral-50 hover:bg-white transition-colors cursor-pointer"
                title="Switch role to test all personas"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="hidden sm:inline capitalize text-neutral-700">{user.role.replace('_', ' ')}</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-neutral-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Switch Persona Role
                  </div>
                  {roles.map((r) => {
                    const IconComponent = r.icon;
                    return (
                      <button
                        key={r.role}
                        onClick={() => {
                          setUserRole(r.role);
                          setShowRoleDropdown(false);
                          if (r.role === 'customer') setCurrentTab('home');
                          else if (r.role === 'delivery_partner') setCurrentTab('delivery_dashboard');
                          else if (r.role === 'restaurant_owner') setCurrentTab('restaurant_dashboard');
                          else if (r.role === 'admin') setCurrentTab('admin_dashboard');
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          user.role === r.role ? 'bg-amber-50 font-semibold text-amber-900' : 'hover:bg-neutral-50 text-neutral-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <IconComponent className={`w-4 h-4 ${r.color}`} />
                          <span>{r.label}</span>
                        </div>
                        {user.role === r.role && <Check className="w-3.5 h-3.5 text-amber-600" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Shopping Cart Button */}
            {user.role === 'customer' && (
              <button
                onClick={onOpenCart}
                className="relative flex items-center gap-2 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Cart</span>
                {cartItemsCount > 0 && (
                  <span className="bg-amber-500 text-neutral-900 text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center tabular-nums">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            )}

            {/* Profile Avatar / Trigger */}
            <button
              onClick={() => setCurrentTab('profile')}
              className="p-1 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
              title="Customer Profile"
            >
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-500/20"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center justify-around py-2 px-2 bg-neutral-50/90 border-t border-neutral-200 text-xs text-neutral-600">
        <button
          onClick={() => setCurrentTab('home')}
          className={`py-1 px-2.5 rounded-lg transition-colors ${currentTab === 'home' ? 'text-amber-600 font-semibold bg-white shadow-2xs' : ''}`}
        >
          Restaurants
        </button>
        <button
          onClick={() => setCurrentTab('rewards')}
          className={`py-1 px-2.5 rounded-lg transition-colors ${currentTab === 'rewards' ? 'text-amber-600 font-semibold bg-white shadow-2xs' : ''}`}
        >
          ₹20 Rewards
        </button>
        <button
          onClick={() => setCurrentTab('recharge')}
          className={`py-1 px-2.5 rounded-lg transition-colors ${currentTab === 'recharge' ? 'text-amber-600 font-semibold bg-white shadow-2xs' : ''}`}
        >
          Recharge
        </button>
        <button
          onClick={() => setCurrentTab('coupons')}
          className={`py-1 px-2.5 rounded-lg transition-colors ${currentTab === 'coupons' ? 'text-amber-600 font-semibold bg-white shadow-2xs' : ''}`}
        >
          Coupons
        </button>
        <button
          onClick={() => setCurrentTab('support')}
          className={`py-1 px-2.5 rounded-lg transition-colors ${currentTab === 'support' ? 'text-amber-600 font-semibold bg-white shadow-2xs' : ''}`}
        >
          Support
        </button>
      </div>
    </header>
  );
};
