import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  ShieldCheck,
  Search,
  Plus,
  Minus,
  Sparkles,
  ShoppingBag,
  Percent,
} from 'lucide-react';
import { Restaurant, MenuItem } from '../../types';
import { useApp } from '../../context/AppContext';

interface RestaurantDetailPageProps {
  restaurant: Restaurant;
  onBack: () => void;
  onOpenCustomization: (item: MenuItem) => void;
  onOpenCart: () => void;
}

export const RestaurantDetailPage: React.FC<RestaurantDetailPageProps> = ({
  restaurant,
  onBack,
  onOpenCustomization,
  onOpenCart,
}) => {
  const { menuItems, cart, addToCart, updateCartQuantity } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchInMenu, setSearchInMenu] = useState('');
  const [vegOnly, setVegOnly] = useState(false);

  // Dishes belonging to this restaurant
  const restaurantDishes = useMemo(() => {
    return menuItems.filter((item) => item.restaurantId === restaurant.id);
  }, [menuItems, restaurant.id]);

  // Categories present in this restaurant's items
  const categories = useMemo(() => {
    const set = new Set(restaurantDishes.map((d) => d.category));
    return ['all', ...Array.from(set)];
  }, [restaurantDishes]);

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    return restaurantDishes.filter((dish) => {
      if (selectedCategory !== 'all' && dish.category !== selectedCategory) {
        return false;
      }
      if (vegOnly && !dish.isVeg) {
        return false;
      }
      if (searchInMenu.trim()) {
        const query = searchInMenu.toLowerCase();
        return (
          dish.name.toLowerCase().includes(query) ||
          dish.description.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [restaurantDishes, selectedCategory, vegOnly, searchInMenu]);

  // Check if cart has items from this restaurant
  const itemsInCartForThisRestaurant = cart.items.filter(
    (ci) => ci.menuItem.restaurantId === restaurant.id
  );
  const totalQuantity = itemsInCartForThisRestaurant.reduce((sum, ci) => sum + ci.quantity, 0);

  return (
    <div className="pb-24 space-y-8 animate-in fade-in">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Restaurants</span>
      </button>

      {/* Restaurant Header Card */}
      <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="relative h-48 md:h-64 bg-neutral-900">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {restaurant.isPureVeg && (
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs">
                  PURE VEG
                </span>
              )}
              <span className="text-xs text-amber-300 font-medium">
                {restaurant.cuisines.join(' · ')}
              </span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              {restaurant.name}
            </h1>
            <p className="text-xs text-neutral-300 mt-1 max-w-xl">{restaurant.tagline}</p>
          </div>
        </div>

        {/* Highlights Bar */}
        <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <span className="font-bold text-neutral-900 block text-sm">{restaurant.rating} ★</span>
              <span className="text-[11px] text-neutral-400">{restaurant.ratingCount}+ reviews</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-700 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <span className="font-bold text-neutral-900 block text-sm">{restaurant.deliveryTimeMinutes} mins</span>
              <span className="text-[11px] text-neutral-400">{restaurant.distanceKm} km away</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-700 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-neutral-600" />
            </div>
            <div>
              <span className="font-bold text-neutral-900 block text-sm">{restaurant.locality}</span>
              <span className="text-[11px] text-neutral-400">Min. order ₹{restaurant.minOrderAmount}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <span className="font-bold text-neutral-900 block text-sm">FSSAI Certified</span>
              <span className="text-[11px] text-neutral-400">Lic. #{restaurant.fssaiNumber}</span>
            </div>
          </div>
        </div>

        {/* Reward Value strip */}
        <div className="bg-amber-50/70 px-6 py-2.5 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Eligible for <strong>Guaranteed ₹20 Reward Voucher</strong> on delivery!</span>
          </div>
          {restaurant.featuredOffer && (
            <div className="hidden sm:flex items-center gap-1 font-semibold text-amber-800">
              <Percent className="w-3.5 h-3.5" />
              <span>{restaurant.featuredOffer}</span>
            </div>
          )}
        </div>
      </div>

      {/* Menu Filters & Search Bar */}
      <div className="sticky top-20 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Menu Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search in this restaurant's menu..."
              value={searchInMenu}
              onChange={(e) => setSearchInMenu(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-100 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 border border-transparent transition-all"
            />
          </div>

          {/* Veg Only Toggle */}
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
              vegOnly
                ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${vegOnly ? 'bg-emerald-600' : 'bg-neutral-300'}`} />
            <span>Veg Only</span>
          </button>
        </div>

        {/* Category horizontal scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg capitalize whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white font-semibold shadow-2xs'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
              }`}
            >
              {cat === 'all' ? 'Full Menu' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Dishes List */}
      <div className="space-y-4">
        <h2 className="font-heading font-bold text-xl text-neutral-900">
          {selectedCategory === 'all' ? 'All Dishes' : selectedCategory} ({filteredDishes.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDishes.map((dish) => {
            const hasCustomizations = (dish.variants && dish.variants.length > 0) || (dish.addonGroups && dish.addonGroups.length > 0);
            const inCartItems = cart.items.filter((ci) => ci.menuItem.id === dish.id);
            const dishQtyInCart = inCartItems.reduce((sum, ci) => sum + ci.quantity, 0);

            return (
              <div
                key={dish.id}
                className="bg-white rounded-2xl border border-neutral-200 p-4 flex gap-4 hover:border-neutral-300 transition-all shadow-2xs"
              >
                {/* Info side */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center border text-[9px] ${
                          dish.isVeg ? 'border-emerald-600 text-emerald-600' : 'border-rose-600 text-rose-600'
                        }`}
                      >
                        ●
                      </span>
                      {dish.isBestseller && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded">
                          ★ Bestseller
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading font-bold text-sm text-neutral-900">{dish.name}</h3>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-heading font-extrabold text-sm text-neutral-900 tabular-nums">
                        ₹{dish.price}
                      </span>
                      {dish.originalPrice && (
                        <span className="text-xs text-neutral-400 line-through tabular-nums">
                          ₹{dish.originalPrice}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 line-clamp-2 mt-1 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>

                  {hasCustomizations && (
                    <span className="text-[10px] text-amber-700 font-medium mt-2">
                      Customizable (Options available)
                    </span>
                  )}
                </div>

                {/* Image and Add button side */}
                <div className="relative w-28 h-28 shrink-0 flex flex-col items-center">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full rounded-xl object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />

                  {/* Add / Quantity Control */}
                  <div className="absolute -bottom-2 w-24 bg-white rounded-lg shadow-md border border-neutral-200 text-xs font-bold overflow-hidden">
                    {dishQtyInCart > 0 && !hasCustomizations ? (
                      <div className="flex items-center justify-between px-1 py-1 text-emerald-700">
                        <button
                          onClick={() => updateCartQuantity(inCartItems[0].id, -1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-neutral-100 rounded cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="tabular-nums">{dishQtyInCart}</span>
                        <button
                          onClick={() => updateCartQuantity(inCartItems[0].id, 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-neutral-100 rounded cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          if (hasCustomizations) {
                            onOpenCustomization(dish);
                          } else {
                            addToCart(dish);
                          }
                        }}
                        className="w-full py-1 text-center text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                      >
                        ADD
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Cart Bar (if items in cart) */}
      {totalQuantity > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-2xl mx-auto animate-in slide-in-from-bottom-4">
          <div className="bg-neutral-900 text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4 border border-neutral-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-base tabular-nums">
                  {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
                </span>
                <span className="text-neutral-400">·</span>
                <span className="font-heading font-extrabold text-base tabular-nums text-amber-400">
                  ₹{cart.finalPayableAmount}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                From {restaurant.name} • Extra ₹20 Reward on Delivery!
              </p>
            </div>
            <button
              onClick={onOpenCart}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Checkout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
