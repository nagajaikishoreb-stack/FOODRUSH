import React, { useState } from 'react';
import { MenuItem, MenuItemVariant, MenuItemAddon } from '../../types';
import { X, Plus, Minus, Flame, Sparkles } from 'lucide-react';

interface FoodCustomizationModalProps {
  item: MenuItem;
  onClose: () => void;
  onAddToCart: (item: MenuItem, variant?: MenuItemVariant, addons?: MenuItemAddon[], instructions?: string) => void;
}

export const FoodCustomizationModal: React.FC<FoodCustomizationModalProps> = ({
  item,
  onClose,
  onAddToCart,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<MenuItemVariant | undefined>(
    item.variants && item.variants.length > 0 ? item.variants[0] : undefined
  );
  const [selectedAddons, setSelectedAddons] = useState<MenuItemAddon[]>([]);
  const [instructions, setInstructions] = useState('');

  const toggleAddon = (addon: MenuItemAddon) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const currentPrice =
    (selectedVariant ? selectedVariant.price : item.price) +
    selectedAddons.reduce((sum, a) => sum + a.price, 0);

  const handleAdd = () => {
    onAddToCart(item, selectedVariant, selectedAddons, instructions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="relative h-48 bg-neutral-100 overflow-hidden shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center border text-[9px] ${
                    item.isVeg ? 'border-emerald-600 text-emerald-600' : 'border-rose-600 text-rose-600'
                  }`}
                >
                  ●
                </span>
                {item.spiceLevel && (
                  <span className="text-[11px] text-amber-300 flex items-center gap-1 font-medium">
                    <Flame className="w-3 h-3 text-amber-400" />
                    {item.spiceLevel}
                  </span>
                )}
              </div>
              <h3 className="font-heading font-bold text-lg text-white leading-tight">{item.name}</h3>
              <p className="text-xs text-neutral-200 line-clamp-1 mt-0.5">{item.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Customization Options */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm">
          {/* Variants */}
          {item.variants && item.variants.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">
                  Select Portion / Size
                </h4>
                <span className="text-[11px] text-neutral-500 font-medium">Required (Choose 1)</span>
              </div>
              <div className="space-y-2">
                {item.variants.map((v) => (
                  <label
                    key={v.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedVariant?.id === v.id
                        ? 'border-amber-500 bg-amber-50/60 shadow-2xs'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="dish_variant"
                        checked={selectedVariant?.id === v.id}
                        onChange={() => setSelectedVariant(v)}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span className="font-medium text-neutral-800">{v.name}</span>
                    </div>
                    <span className="font-semibold text-neutral-900 tabular-nums">₹{v.price}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Add-ons */}
          {item.addonGroups &&
            item.addonGroups.map((group) => (
              <div key={group.id}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">
                    {group.title}
                  </h4>
                  <span className="text-[11px] text-neutral-500">Optional</span>
                </div>
                <div className="space-y-2">
                  {group.addons.map((addon) => {
                    const isChecked = selectedAddons.some((a) => a.id === addon.id);
                    return (
                      <label
                        key={addon.id}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                          isChecked
                            ? 'border-amber-500 bg-amber-50/60 shadow-2xs'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleAddon(addon)}
                            className="rounded text-amber-600 focus:ring-amber-500"
                          />
                          <span className="text-neutral-800 font-medium">{addon.name}</span>
                        </div>
                        <span className="font-semibold text-neutral-700 tabular-nums">+₹{addon.price}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}

          {/* Cooking Instructions */}
          <div>
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider mb-2">
              Cooking Instructions (Optional)
            </h4>
            <input
              type="text"
              placeholder="e.g., Less oil, extra spicy, no onions, keep gravy separate..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
              maxLength={150}
            />
          </div>
        </div>

        {/* Modal Footer with Add Button */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[11px] text-neutral-500">Item Total</span>
            <div className="font-heading font-extrabold text-xl text-neutral-900 tabular-nums">
              ₹{currentPrice}
            </div>
          </div>
          <button
            onClick={handleAdd}
            className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 active:scale-98 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
