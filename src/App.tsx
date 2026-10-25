import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { HomePage } from './components/home/HomePage';
import { RestaurantDetailPage } from './components/restaurant/RestaurantDetailPage';
import { FoodCustomizationModal } from './components/food/FoodCustomizationModal';
import { RestaurantConflictModal } from './components/food/RestaurantConflictModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { OrderTrackingView } from './components/tracking/OrderTrackingView';
import { RewardsWalletView } from './components/rewards/RewardsWalletView';
import { MobileRechargeView } from './components/recharge/MobileRechargeView';
import { CouponCenterView } from './components/coupons/CouponCenterView';
import { CustomerSupportView } from './components/support/CustomerSupportView';
import { CustomerProfileView } from './components/profile/CustomerProfileView';
import { DeliveryPartnerDashboard } from './components/delivery/DeliveryPartnerDashboard';
import { RestaurantOwnerDashboard } from './components/restaurant/RestaurantOwnerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LegalPagesModal } from './components/legal/LegalPagesModal';
import { Restaurant, MenuItem, Order } from './types';

function MainAppContent() {
  const { user, addToCart, forceAddToCartReplacingRestaurant, clearCart } = useApp();

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [trackedOrderId, setTrackedOrderId] = useState<string | null>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [conflictModalData, setConflictModalData] = useState<{
    restaurantName: string;
    onConfirm: () => void;
  } | null>(null);
  const [legalModalPage, setLegalModalPage] = useState<'terms' | 'privacy' | 'reward_policy' | 'refund_policy' | null>(null);

  // Handle adding to cart with conflict detection
  const handleAddToCart = (
    item: MenuItem,
    variant?: any,
    addons?: any,
    instructions?: string
  ) => {
    const res = addToCart(item, variant, addons, instructions);
    if (!res.success && res.conflictRestaurantName && res.pendingItem) {
      setConflictModalData({
        restaurantName: res.conflictRestaurantName,
        onConfirm: () => {
          forceAddToCartReplacingRestaurant(item, variant, addons, instructions);
          setConflictModalData(null);
        },
      });
    }
  };

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setCurrentTab('restaurant_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderPlaced = (orderId: string) => {
    setTrackedOrderId(orderId);
    setCurrentTab('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReorder = (order: Order) => {
    clearCart();
    for (const item of order.items) {
      forceAddToCartReplacingRestaurant(
        item.menuItem,
        item.selectedVariant,
        item.selectedAddons,
        item.specialInstructions
      );
    }
    setIsCartOpen(true);
  };

  const handleTrackOrderFromProfile = (order: Order) => {
    setTrackedOrderId(order.id);
    setCurrentTab('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50/60 text-neutral-900 font-sans selection:bg-amber-500 selection:text-white">
      {/* Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Page Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Role View Routing */}
        {user.role === 'delivery_partner' && <DeliveryPartnerDashboard />}
        {user.role === 'restaurant_owner' && <RestaurantOwnerDashboard />}
        {user.role === 'admin' && <AdminDashboard />}

        {/* Customer Tab Routing */}
        {user.role === 'customer' && (
          <>
            {currentTab === 'home' && (
              <HomePage
                onSelectRestaurant={handleSelectRestaurant}
                onOpenCustomization={(item) => setCustomizingItem(item)}
                setCurrentTab={(tab) => {
                  setCurrentTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {currentTab === 'restaurant_detail' && selectedRestaurant && (
              <RestaurantDetailPage
                restaurant={selectedRestaurant}
                onBack={() => {
                  setCurrentTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenCustomization={(item) => setCustomizingItem(item)}
                onOpenCart={() => setIsCartOpen(true)}
              />
            )}

            {currentTab === 'tracking' && (
              <OrderTrackingView
                orderId={trackedOrderId || undefined}
                onBackToHome={() => setCurrentTab('home')}
                onOpenSupport={() => setCurrentTab('support')}
              />
            )}

            {currentTab === 'rewards' && (
              <RewardsWalletView
                setCurrentTab={(tab) => {
                  setCurrentTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenLegal={(page) => setLegalModalPage(page)}
              />
            )}

            {currentTab === 'recharge' && (
              <MobileRechargeView
                setCurrentTab={(tab) => {
                  setCurrentTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {currentTab === 'coupons' && (
              <CouponCenterView
                setCurrentTab={(tab) => {
                  setCurrentTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {currentTab === 'support' && (
              <CustomerSupportView
                setCurrentTab={(tab) => {
                  setCurrentTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {currentTab === 'profile' && (
              <CustomerProfileView
                onReorder={handleReorder}
                onTrackOrder={handleTrackOrderFromProfile}
                setCurrentTab={(tab) => {
                  setCurrentTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenLegal={(page) => setLegalModalPage(page)}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Floating Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Dish Customization Modal */}
      {customizingItem && (
        <FoodCustomizationModal
          item={customizingItem}
          onClose={() => setCustomizingItem(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Restaurant Cart Conflict Modal */}
      {conflictModalData && (
        <RestaurantConflictModal
          currentRestaurantName={conflictModalData.restaurantName}
          onCancel={() => setConflictModalData(null)}
          onConfirmReplace={conflictModalData.onConfirm}
        />
      )}

      {/* Legal & Policy Modal */}
      <LegalPagesModal
        page={legalModalPage}
        onClose={() => setLegalModalPage(null)}
      />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
