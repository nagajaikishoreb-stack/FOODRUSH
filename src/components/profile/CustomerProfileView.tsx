import React, { useState } from 'react';
import {
  User,
  MapPin,
  Clock,
  Heart,
  Shield,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  Sparkles,
  Gift,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DeliveryAddress, Order } from '../../types';

interface CustomerProfileViewProps {
  onReorder: (order: Order) => void;
  onTrackOrder: (order: Order) => void;
  setCurrentTab: (tab: string) => void;
}

export const CustomerProfileView: React.FC<CustomerProfileViewProps> = ({
  onReorder,
  onTrackOrder,
  setCurrentTab,
}) => {
  const { user, updateUserProfile, addDeliveryAddress, orders, wallet, addToast } = useApp();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);
  const [phoneInput, setPhoneInput] = useState(user.phone);

  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [addrType, setAddrType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrArea, setAddrArea] = useState('');
  const [addrCity, setAddrCity] = useState('Bengaluru');
  const [addrPincode, setAddrPincode] = useState('560034');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name: nameInput, phone: phoneInput });
    setIsEditingProfile(false);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrStreet.trim() || !addrArea.trim()) return;

    addDeliveryAddress({
      type: addrType,
      street: addrStreet.trim(),
      area: addrArea.trim(),
      city: addrCity.trim(),
      state: 'Karnataka',
      pincode: addrPincode.trim(),
    });

    setAddrStreet('');
    setAddrArea('');
    setShowAddAddressModal(false);
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-amber-500/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-extrabold text-2xl text-neutral-900">{user.name}</h1>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full uppercase">
                {user.role.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">{user.email} · {user.phone}</p>
            <p className="text-[11px] text-neutral-400 mt-1">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditingProfile(!isEditingProfile)}
          className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
        >
          {isEditingProfile ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* Edit Profile Form */}
      {isEditingProfile && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-xs space-y-4 text-xs">
          <h3 className="font-heading font-bold text-base text-neutral-900">Update Profile Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-neutral-700 block mb-1">Full Name</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-neutral-700 block mb-1">Phone Number</label>
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl cursor-pointer"
          >
            Save Changes
          </button>
        </form>
      )}

      {/* Saved Delivery Addresses */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg text-neutral-900">Saved Delivery Addresses</h3>
            <p className="text-xs text-neutral-500">Fast one-click checkout across your locations</p>
          </div>
          <button
            onClick={() => setShowAddAddressModal(true)}
            className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Address</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {user.savedAddresses.map((addr) => (
            <div
              key={addr.id}
              className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-neutral-900 text-sm flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-600" />
                    <span>{addr.type}</span>
                  </span>
                  {addr.isDefault && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-neutral-600 leading-relaxed">
                  {addr.street}, {addr.area}, {addr.city} - {addr.pincode}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order History */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-lg text-neutral-900">Your Orders ({orders.length})</h3>
          <span className="text-xs text-neutral-500">Every delivered order earned guaranteed ₹20 reward</span>
        </div>

        <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-2xl overflow-hidden text-xs">
          {orders.map((ord) => (
            <div key={ord.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-900 text-sm">{ord.restaurantName}</span>
                  <span className="text-neutral-400">·</span>
                  <span className="text-neutral-500 font-mono">#{ord.orderNumber}</span>
                  <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded capitalize">
                    {ord.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-neutral-500 text-[11px]">
                  {ord.items.map((i) => `${i.quantity}x ${i.menuItem.name}`).join(', ')}
                </p>
                <p className="text-neutral-400 text-[10px]">
                  Ordered on {new Date(ord.createdAt).toLocaleDateString()} at {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="font-heading font-extrabold text-sm text-neutral-900 block tabular-nums">
                    ₹{ord.breakdown.totalPaid}
                  </span>
                  {ord.rewardCredited && (
                    <span className="text-[10px] text-emerald-600 font-bold">
                      ✓ Earned ₹20 Reward
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onReorder(ord)}
                  className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3 text-neutral-500" />
                  <span>Reorder</span>
                </button>

                <button
                  onClick={() => onTrackOrder(ord)}
                  className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Track
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h3 className="font-heading font-bold text-base text-neutral-900">Add New Delivery Address</h3>
              <button
                onClick={() => setShowAddAddressModal(false)}
                className="text-neutral-400 hover:text-neutral-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Address Label</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Home', 'Work', 'Other'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setAddrType(t)}
                      className={`py-2 rounded-xl border text-center font-bold cursor-pointer ${
                        addrType === t ? 'bg-neutral-900 text-white' : 'bg-neutral-50 text-neutral-600'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">House / Flat / Building</label>
                <input
                  type="text"
                  placeholder="e.g. Flat 301, Sunshine Residency, 2nd Main"
                  value={addrStreet}
                  onChange={(e) => setAddrStreet(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Area / Locality</label>
                <input
                  type="text"
                  placeholder="e.g. HSR Layout Sector 2"
                  value={addrArea}
                  onChange={(e) => setAddrArea(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">City</label>
                  <input
                    type="text"
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Pincode</label>
                  <input
                    type="text"
                    value={addrPincode}
                    onChange={(e) => setAddrPincode(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
