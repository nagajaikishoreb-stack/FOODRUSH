import React from 'react';
import { ShieldCheck, Heart, Sparkles, Smartphone, Award } from 'lucide-react';

interface FooterProps {
  onOpenLegal: (page: 'terms' | 'privacy' | 'reward_policy' | 'refund_policy') => void;
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal, setCurrentTab }) => {
  return (
    <footer className="bg-neutral-900 text-neutral-400 border-t border-neutral-800 text-sm mt-auto">
      {/* ₹20 Reward Value Strip */}
      <div className="border-b border-neutral-800 py-6 px-4 bg-neutral-950/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Guaranteed ₹20 Reward Voucher on Every Delivery</p>
              <p className="text-xs text-neutral-400">
                Automated credit upon successful drop-off. Redeem for future meals or instant mobile recharge across all operators.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentTab('rewards')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
          >
            Explore Rewards Wallet
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                FR
              </div>
              <span className="font-heading font-extrabold text-xl text-white tracking-tight">
                Food<span className="text-amber-500">Rush</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed mb-4">
              A modern, high-reward food delivery platform engineered for transparent pricing, fast fulfillment, and guaranteed customer value with ₹20 rewards and mobile recharge utilities.
            </p>
            <div className="flex items-center gap-3 text-xs text-neutral-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>256-bit Encrypted Checkout</span>
              </div>
              <span>·</span>
              <span>FSSAI Lic. 11223344005566</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentTab('home')} className="hover:text-white transition-colors cursor-pointer">
                  Explore Restaurants
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('rewards')} className="hover:text-white transition-colors cursor-pointer">
                  ₹20 Reward System
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('recharge')} className="hover:text-white transition-colors cursor-pointer">
                  Mobile Recharge Utility
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('coupons')} className="hover:text-white transition-colors cursor-pointer">
                  Active Coupons & Deals
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('support')} className="hover:text-white transition-colors cursor-pointer">
                  Customer Support & Help
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Trust */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Policies & Safety</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onOpenLegal('reward_policy')} className="hover:text-white transition-colors cursor-pointer text-left">
                  ₹20 Reward Policy Rules
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('refund_policy')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Refund & Cancellation Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('terms')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('privacy')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Privacy Policy & Data Security
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Top Cuisines */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Popular Cuisines</h4>
            <ul className="space-y-2 text-xs">
              <li><span>Hyderabadi Dum Biryani</span></li>
              <li><span>Artisanal Wood-Fired Pizza</span></li>
              <li><span>South Indian Ghee Dosas</span></li>
              <li><span>Mughlai Kebabs & Curries</span></li>
              <li><span>Craft Burgers & Shakes</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
          <p>© {new Date().getFullYear()} FoodRush Technologies India Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for hungry food lovers across India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
