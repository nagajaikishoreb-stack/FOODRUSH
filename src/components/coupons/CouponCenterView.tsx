import React, { useState } from 'react';
import { Tag, Copy, Check, Percent, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CouponCenterViewProps {
  setCurrentTab: (tab: string) => void;
}

export const CouponCenterView: React.FC<CouponCenterViewProps> = ({ setCurrentTab }) => {
  const { coupons, addToast } = useApp();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    addToast('reward', 'Coupon Copied!', `Code "${code}" copied to clipboard. Apply at checkout.`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 mb-1">
          <Tag className="w-4 h-4" />
          <span>FoodRush Savings Engine</span>
        </div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-900 tracking-tight">
          Coupon & Promo Center
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Stack coupons with your guaranteed ₹20 rewards for unbeatable dining discounts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon) => {
          const isCopied = copiedCode === coupon.code;
          return (
            <div
              key={coupon.code}
              className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-300 text-amber-900 rounded-lg text-xs font-mono font-bold tracking-wider">
                    {coupon.code}
                  </div>
                  <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Valid till {coupon.validTill}</span>
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base text-neutral-900 leading-tight">
                  {coupon.title}
                </h3>
                <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                  {coupon.description}
                </p>

                <div className="mt-3 pt-3 border-t border-neutral-100 flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
                  <span>Min Order: <strong>₹{coupon.minOrderValue}</strong></span>
                  <span>·</span>
                  <span>Max Savings: <strong>₹{coupon.maxDiscount}</strong></span>
                  <span>·</span>
                  <span>Limit: <strong>{coupon.usageLimitPerUser}x</strong></span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center gap-2">
                <button
                  onClick={() => handleCopy(coupon.code)}
                  className="flex-1 py-2 px-3 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setCurrentTab('home')}
                  className="py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Use Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
