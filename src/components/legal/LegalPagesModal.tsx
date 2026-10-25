import React from 'react';
import { X, ShieldCheck, Gift, RotateCcw, FileText, CheckCircle2 } from 'lucide-react';

interface LegalPagesModalProps {
  page: 'terms' | 'privacy' | 'reward_policy' | 'refund_policy' | null;
  onClose: () => void;
}

export const LegalPagesModal: React.FC<LegalPagesModalProps> = ({ page, onClose }) => {
  if (!page) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              {page === 'reward_policy' ? (
                <Gift className="w-4 h-4" />
              ) : page === 'refund_policy' ? (
                <RotateCcw className="w-4 h-4" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-neutral-900">
                {page === 'reward_policy' && '₹20 Loyalty Reward Policy & Rules'}
                {page === 'refund_policy' && 'Refund & Cancellation Policy'}
                {page === 'terms' && 'Platform Terms of Service'}
                {page === 'privacy' && 'Privacy & Data Protection Policy'}
              </h3>
              <p className="text-[11px] text-neutral-500">
                Published & Effective: October 2026 · FoodRush Technologies India Pvt. Ltd.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-200/60 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-neutral-600 leading-relaxed">
          {page === 'reward_policy' && (
            <>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 font-medium">
                <strong>Core Brand Promise:</strong> For every successfully delivered and completed food order, FoodRush awards exactly one ₹20 promotional loyalty reward voucher into the customer's wallet ledger.
              </div>

              <h4 className="font-heading font-bold text-sm text-neutral-900 pt-2">1. Eligibility & Qualifying Criteria</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Rewards are granted solely when an order reaches confirmed "Delivered" status verified by the customer's 4-digit PIN.</li>
                <li>Cancelled, abandoned, or refunded orders are strictly ineligible for reward vouchers.</li>
                <li>Each unique qualifying order receives its ₹20 reward exactly once. Idempotent system safeguards prevent double-crediting.</li>
              </ul>

              <h4 className="font-heading font-bold text-sm text-neutral-900 pt-2">2. Separation of Balances</h4>
              <p>FoodRush maintains two separate ledger balances:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Food Reward Balance:</strong> Applicable toward future food deliveries on the FoodRush platform (up to 50% of dish total).</li>
                <li><strong>Mobile Recharge Reward Balance:</strong> Applicable toward telecom recharges across authorized carriers (Jio, Airtel, Vi, BSNL).</li>
              </ul>

              <h4 className="font-heading font-bold text-sm text-neutral-900 pt-2">3. Non-Withdrawable Compliance Guarantee</h4>
              <p>
                In compliance with Reserve Bank of India (RBI) prepaid payment instruments regulations, FoodRush promotional reward balances cannot under any circumstances be withdrawn to a bank account, redeemed for physical cash, or transferred to third-party accounts.
              </p>
            </>
          )}

          {page === 'refund_policy' && (
            <>
              <h4 className="font-heading font-bold text-sm text-neutral-900">1. Cancellation Timelines</h4>
              <p>
                Customers can cancel any placed food order unconditionally within 60 seconds of placement or prior to restaurant kitchen confirmation free of penalty.
              </p>

              <h4 className="font-heading font-bold text-sm text-neutral-900 pt-2">2. Kitchen Preparation Stage</h4>
              <p>
                Once a partner restaurant accepts and begins preparing freshly made food, cancellation requests require kitchen mutual confirmation to prevent perishable food wastage.
              </p>

              <h4 className="font-heading font-bold text-sm text-neutral-900 pt-2">3. Refund Processing</h4>
              <p>
                Eligible refunds are processed back to the original payment source (UPI, Debit/Credit Card, or Net Banking) within 2 to 4 business days. Any reward amount redeemed is refunded to your Food Reward Balance instantaneously.
              </p>
            </>
          )}

          {page === 'terms' && (
            <>
              <h4 className="font-heading font-bold text-sm text-neutral-900">1. Acceptance of Terms</h4>
              <p>
                By accessing or placing an order through FoodRush, you agree to be bound by these standard platform terms and conditions.
              </p>

              <h4 className="font-heading font-bold text-sm text-neutral-900 pt-2">2. Transparent Pricing Guarantee</h4>
              <p>
                FoodRush displays honest, itemized billings with clear delivery fees, packaging fees, 5% GST on restaurant services, and a flat ₹3 platform fee. No inflated surge markups.
              </p>

              <h4 className="font-heading font-bold text-sm text-neutral-900 pt-2">3. User Conduct</h4>
              <p>
                Fraudulent activity, simulated OTP abuse, or repeated bad-faith cancellations will result in permanent account suspension and voucher forfeiture.
              </p>
            </>
          )}

          {page === 'privacy' && (
            <>
              <h4 className="font-heading font-bold text-sm text-neutral-900">1. Data Minimization</h4>
              <p>
                FoodRush collects only information necessary for fulfillment (delivery address, contact phone number, and preferences). We never sell your personal data to marketing brokers.
              </p>

              <h4 className="font-heading font-bold text-sm text-neutral-900 pt-2">2. Security & Encryption</h4>
              <p>
                All network communication, payment transactions, and authentication tokens are secured with 256-bit SSL encryption. Payment card credentials are never stored on FoodRush servers.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-900 text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            I Understand & Accept
          </button>
        </div>
      </div>
    </div>
  );
};
