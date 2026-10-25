import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Star,
  Clock,
  MapPin,
  ChevronRight,
  TrendingUp,
  Percent,
  Gift,
  Smartphone,
  ArrowRight,
  Filter,
  Check,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Restaurant, MenuItem } from '../../types';
import { HERO_BANNER_IMAGE, BIRYANI_POT_IMAGE, PIZZA_IMAGE, DOSA_THALI_IMAGE } from '../../data/mockData';

interface HomePageProps {
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onOpenCustomization: (item: MenuItem) => void;
  setCurrentTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectRestaurant,
  onOpenCustomization,
  setCurrentTab,
}) => {
  const {
    restaurants,
    menuItems,
    searchQuery,
    setSearchQuery,
    selectedCuisine,
    setSelectedCuisine,
    vegOnlyFilter,
    setVegOnlyFilter,
    activeOrder,
    wallet,
    addToCart,
    user,
  } = useApp();

  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'deliveryTime' | 'priceLow'>('relevance');
  const [maxDeliveryTime, setMaxDeliveryTime] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: 'All Cravings', icon: '🍽️' },
    { id: 'Biryani', label: 'Biryani', icon: '🍲' },
    { id: 'Italian', label: 'Pizzas & Pasta', icon: '🍕' },
    { id: 'South Indian', label: 'South Indian', icon: '🥞' },
    { id: 'Burgers', label: 'Craft Burgers', icon: '🍔' },
    { id: 'Chinese', label: 'Asian & Wok', icon: '🍜' },
    { id: 'Snacks', label: 'Chai & Snacks', icon: '☕' },
  ];

  // Filter restaurants
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      // Query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = r.name.toLowerCase().includes(query);
        const matchesCuisine = r.cuisines.some((c) => c.toLowerCase().includes(query));
        const matchesDish = menuItems.some(
          (m) => m.restaurantId === r.id && m.name.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesCuisine && !matchesDish) return false;
      }

      // Cuisine category
      if (selectedCuisine && selectedCuisine !== 'all') {
        const matchesCuisine = r.cuisines.some(
          (c) => c.toLowerCase() === selectedCuisine.toLowerCase()
        );
        if (!matchesCuisine) return false;
      }

      // Veg only filter
      if (vegOnlyFilter && !r.isPureVeg) {
        return false;
      }

      // Delivery time cap
      if (maxDeliveryTime && r.deliveryTimeMinutes > maxDeliveryTime) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'deliveryTime') return a.deliveryTimeMinutes - b.deliveryTimeMinutes;
      if (sortBy === 'priceLow') return a.priceForTwo - b.priceForTwo;
      return 0; // relevance
    });
  }, [restaurants, menuItems, searchQuery, selectedCuisine, vegOnlyFilter, maxDeliveryTime, sortBy]);

  // Trending & Budget Meals
  const trendingDishes = useMemo(() => {
    return menuItems.filter((m) => m.isBestseller).slice(0, 4);
  }, [menuItems]);

  const budgetDishes = useMemo(() => {
    return menuItems.filter((m) => m.price <= 150).slice(0, 4);
  }, [menuItems]);

  return (
    <div className="space-y-10 pb-16">
      {/* Active Order Live Tracker Bar (if active) */}
      {activeOrder && activeOrder.status !== 'delivered' && activeOrder.status !== 'cancelled' && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl p-4 shadow-lg flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-white animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">Order #{activeOrder.orderNumber} in Progress</span>
                <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full capitalize">
                  {activeOrder.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-amber-100 mt-0.5">
                From {activeOrder.restaurantName} • Est. arrival in {activeOrder.estimatedDeliveryMinutes} mins
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentTab('tracking')}
            className="px-4 py-2 bg-white text-neutral-900 text-xs font-bold rounded-xl shadow-xs hover:bg-neutral-100 transition-colors cursor-pointer shrink-0"
          >
            Track Live Map →
          </button>
        </div>
      )}

      {/* Hero Banner: Premium Culinary Visual with ₹20 Value Proposition */}
      <div className="relative rounded-3xl overflow-hidden bg-neutral-900 shadow-xl border border-neutral-800">
        <div className="absolute inset-0">
          <img
            src={HERO_BANNER_IMAGE}
            alt="FoodRush Gourmet Culinary Feast"
            className="w-full h-full object-cover opacity-45 scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
        </div>

        <div className="relative z-10 px-6 sm:px-10 py-12 md:py-16 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 mb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Guaranteed Value on Every Single Meal</span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-[1.15] mb-4 text-balance">
            Order top food, earn guaranteed <span className="text-amber-500">₹20 rewards</span> on every delivery.
          </h1>

          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
            Why settle for hidden markups? Enjoy transparent restaurant prices, zero surge manipulation, and ₹20 loyalty vouchers you can redeem on food or transfer directly to recharge your mobile phone.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById('explore-restaurants');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-98"
            >
              <span>Explore Restaurants</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentTab('rewards')}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold rounded-xl backdrop-blur-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <Gift className="w-4 h-4 text-amber-400" />
              <span>How ₹20 Rewards Work</span>
            </button>
          </div>
        </div>

        {/* Hero Bottom Metric Strip */}
        <div className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-md px-6 sm:px-10 py-3 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-neutral-300">
          <div>
            <span className="text-white font-bold block tabular-nums text-sm">₹20 per Order</span>
            <span className="text-neutral-400 text-[11px]">Guaranteed reward voucher</span>
          </div>
          <div>
            <span className="text-white font-bold block tabular-nums text-sm">100% Usable</span>
            <span className="text-neutral-400 text-[11px]">On food or mobile recharge</span>
          </div>
          <div>
            <span className="text-white font-bold block tabular-nums text-sm">₹3 Platform Fee</span>
            <span className="text-neutral-400 text-[11px]">Honest, transparent billing</span>
          </div>
          <div>
            <span className="text-white font-bold block tabular-nums text-sm">30 Mins Average</span>
            <span className="text-neutral-400 text-[11px]">Fast hot delivery</span>
          </div>
        </div>
      </div>

      {/* ₹20 Reward & Mobile Recharge Quick Feature Spotlight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card A: Reward Wallet Balance */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/90 to-orange-50/50 border border-amber-200/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-sm shrink-0">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
                Your Reward Wallet
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-heading font-extrabold text-2xl text-neutral-900 tabular-nums">
                  ₹{wallet.foodBalance + wallet.rechargeBalance}
                </span>
                <span className="text-xs text-neutral-500">
                  (Food: ₹{wallet.foodBalance} · Recharge: ₹{wallet.rechargeBalance})
                </span>
              </div>
              <p className="text-xs text-neutral-600 mt-0.5">
                Earned from {wallet.lifetimeEarned / 20} successfully delivered orders.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentTab('rewards')}
            className="px-3.5 py-2 bg-white hover:bg-neutral-50 border border-amber-300 text-amber-900 text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer shrink-0"
          >
            Manage →
          </button>
        </div>

        {/* Card B: Mobile Recharge Shortcut */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
              <Smartphone className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                Mobile Recharge Utility
              </span>
              <h4 className="font-heading font-bold text-base text-neutral-900 leading-tight">
                Recharge with FoodRush Rewards
              </h4>
              <p className="text-xs text-neutral-500 mt-0.5">
                Support for Jio, Airtel, Vi, and BSNL instant prepaid packs.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentTab('recharge')}
            className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer shrink-0"
          >
            Recharge Now
          </button>
        </div>
      </div>

      {/* Category Segmented Filter Tabs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading font-bold text-lg text-neutral-900">What's on your mind?</h2>
          <span className="text-xs text-neutral-500">Curated dishes & regional specialties</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCuisine === cat.id || (!selectedCuisine && cat.id === 'all');
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCuisine(cat.id === 'all' ? null : cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Trending Bestsellers Carousel */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold mb-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Trending Across Bengaluru</span>
            </div>
            <h2 className="font-heading font-bold text-xl text-neutral-900">Most Loved Dishes</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trendingDishes.map((dish) => {
            const rest = restaurants.find((r) => r.id === dish.restaurantId);
            return (
              <div
                key={dish.id}
                className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col group"
              >
                <div className="relative h-44 overflow-hidden bg-neutral-100">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-bold text-neutral-900 flex items-center gap-1 shadow-2xs">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        dish.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                      }`}
                    />
                    <span>{dish.isVeg ? 'VEG' : 'NON-VEG'}</span>
                  </div>

                  <div className="absolute bottom-2 right-2 bg-neutral-900/90 text-white px-2 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{dish.rating}</span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] text-neutral-500 truncate block">
                      {rest?.name}
                    </span>
                    <h3 className="font-heading font-bold text-sm text-neutral-900 line-clamp-1 mt-0.5">
                      {dish.name}
                    </h3>
                    <p className="text-xs text-neutral-500 line-clamp-2 mt-1 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between">
                    <div>
                      <span className="font-heading font-extrabold text-base text-neutral-900 tabular-nums">
                        ₹{dish.price}
                      </span>
                      {dish.originalPrice && (
                        <span className="text-xs text-neutral-400 line-through ml-1.5 tabular-nums">
                          ₹{dish.originalPrice}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => onOpenCustomization(dish)}
                      className="px-3.5 py-1.5 bg-neutral-100 hover:bg-amber-50 hover:text-amber-700 text-neutral-900 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      + ADD
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Budget Friendly Meals (Under ₹150) */}
      <div className="p-6 rounded-3xl bg-neutral-100 border border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Pocket-Friendly
            </span>
            <h2 className="font-heading font-bold text-xl text-neutral-900">
              Delicious Meals Under ₹150
            </h2>
          </div>
          <span className="text-xs text-neutral-500 hidden sm:inline">
            Same guaranteed ₹20 reward applies!
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {budgetDishes.map((dish) => {
            const rest = restaurants.find((r) => r.id === dish.restaurantId);
            return (
              <div
                key={dish.id}
                className="bg-white rounded-2xl p-3 border border-neutral-200/80 shadow-2xs flex items-center gap-3 hover:border-neutral-300 transition-colors"
              >
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-18 h-18 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-neutral-400 truncate block">{rest?.name}</span>
                  <h4 className="font-bold text-xs text-neutral-900 truncate">{dish.name}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-heading font-extrabold text-sm text-neutral-900 tabular-nums">
                      ₹{dish.price}
                    </span>
                    <button
                      onClick={() => onOpenCustomization(dish)}
                      className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      ADD
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Restaurant Discovery Grid with Filter Controls */}
      <div id="explore-restaurants" className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-heading font-bold text-2xl text-neutral-900">
              Restaurants to Explore ({filteredRestaurants.length})
            </h2>
            <p className="text-xs text-neutral-500">
              Delivering to <strong className="text-neutral-700">{user.savedAddresses[0]?.area || 'Koramangala'}</strong>
            </p>
          </div>

          {/* Interactive Filters Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Pure Veg Filter */}
            <button
              onClick={() => setVegOnlyFilter(!vegOnlyFilter)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                vegOnlyFilter
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                  : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${vegOnlyFilter ? 'bg-emerald-600' : 'bg-neutral-300'}`} />
              <span>Pure Veg Only</span>
            </button>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-1.5 text-xs font-medium rounded-xl border border-neutral-200 bg-white text-neutral-700 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="rating">Highest Rated (4.5+)</option>
              <option value="deliveryTime">Fastest Delivery</option>
              <option value="priceLow">Cost: Low to High</option>
            </select>
          </div>
        </div>

        {/* Restaurant Cards Grid */}
        {filteredRestaurants.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-neutral-200">
            <p className="font-heading font-bold text-lg text-neutral-800">No restaurants found</p>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              We couldn't find any match for your filters. Try clearing your search query or toggling filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCuisine(null);
                setVegOnlyFilter(false);
              }}
              className="mt-4 px-4 py-2 bg-neutral-900 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((rest) => (
              <div
                key={rest.id}
                onClick={() => onSelectRestaurant(rest)}
                className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col group"
              >
                {/* Restaurant Image */}
                <div className="relative h-48 bg-neutral-100 overflow-hidden">
                  <img
                    src={rest.image}
                    alt={rest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-bold text-neutral-900 flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{rest.rating}</span>
                    <span className="text-[10px] text-neutral-400">({rest.ratingCount})</span>
                  </div>

                  {/* Featured Offer tag */}
                  {rest.featuredOffer && (
                    <div className="absolute bottom-3 left-3 bg-neutral-900/90 text-white text-xs font-semibold px-2.5 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1">
                      <Percent className="w-3 h-3 text-amber-400" />
                      <span>{rest.featuredOffer}</span>
                    </div>
                  )}

                  {rest.isPureVeg && (
                    <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs">
                      PURE VEG
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-neutral-900 leading-tight group-hover:text-amber-600 transition-colors">
                      {rest.name}
                    </h3>
                    <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">{rest.tagline}</p>
                    <p className="text-xs text-neutral-400 mt-1 truncate">
                      {rest.cuisines.join(' · ')}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600">
                    <div className="flex items-center gap-1 font-semibold text-neutral-800">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{rest.deliveryTimeMinutes} mins</span>
                    </div>
                    <span aria-hidden="true" className="text-neutral-300">·</span>
                    <span>{rest.distanceKm} km</span>
                    <span aria-hidden="true" className="text-neutral-300">·</span>
                    <span className="font-medium text-neutral-700">₹{rest.priceForTwo} for two</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
