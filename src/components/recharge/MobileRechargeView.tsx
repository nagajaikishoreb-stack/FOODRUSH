import React, { useState } from 'react';
import {
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Gift,
  ArrowRight,
  Receipt,
  AlertCircle,
  Clock,
  Wifi,
  PhoneCall,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TelecomOperator, MobileRechargePlan } from '../../types';
import { INITIAL_RECHARGE_PLANS } from '../../data/mockData';

interface MobileRechargeViewProps {
  setCurrentTab: (tab: string) => void;
}

export const MobileRechargeView: React.FC<MobileRechargeViewProps> = ({ setCurrentTab }) => {
  const { wallet, executeMobileRecharge, rechargeTxns, addToast } = useApp();

  const [mobileNumber, setMobileNumber] = useState('9876543210');
  const [operator, setOperator] = useState<TelecomOperator>('Jio');
  const [circle, setCircle] = useState('Karnataka & Bengaluru');
  const [connectionType, setConnectionType] = useState<'prepaid' | 'postpaid'>('prepaid');
  const [selectedPlan, setSelectedPlan] = useState<MobileRechargePlan>(INITIAL_RECHARGE_PLANS[0]);
  const [useRewards, setUseRewards] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<any | null>(null);

  const operators: TelecomOperator[] = ['Jio', 'Airtel', 'Vi', 'BSNL'];
  const circles = ['Karnataka & Bengaluru', 'Mumbai', 'Delhi NCR', 'Tamil Nadu & Chennai', 'Hyderabad & Telangana'];

  // Plans filtered by operator
  const availablePlans = INITIAL_RECHARGE_PLANS.filter((p) => p.operator === operator);

  // Maximum rewards applicable (cannot exceed recharge price or available balance)
  const maxApplicableReward = Math.min(wallet.rechargeBalance, selectedPlan.price);
  const rewardDeduction = useRewards ? maxApplicableReward : 0;
  const finalPayable = Math.max(0, selectedPlan.price - rewardDeduction);

  const handleRecharge = async () => {
    setIsSubmitting(true);
    try {
      // Simulate real-world 1.5s telco API response
      await new Promise((r) => setTimeout(r, 1400));
      const res = await executeMobileRecharge(
        mobileNumber,
        operator,
        circle,
        selectedPlan,
        rewardDeduction
      );
      setIsSubmitting(false);

      if (res.success && res.txnId) {
        setLastReceipt({
          txnId: res.txnId,
          mobileNumber,
          operator,
          circle,
          plan: selectedPlan,
          rewardDeduction,
          finalPayable,
          date: new Date().toLocaleString(),
        });
      } else {
        addToast('warning', 'Recharge Failed', res.error || 'Transaction could not be processed.');
      }
    } catch (e: any) {
      setIsSubmitting(false);
      addToast('warning', 'Recharge Gateway Timeout', e?.message || 'Please check operator service.');
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 mb-1">
          <Smartphone className="w-4 h-4" />
          <span>FoodRush Telecom Utility Integration</span>
        </div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-900 tracking-tight">
          Instant Mobile Recharge
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Recharge your prepaid mobile number and pay effortlessly using your FoodRush reward balances.
        </p>
      </div>

      {/* Rewards Availability Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-[11px] text-emerald-100 uppercase tracking-wider block font-semibold">
              Available Mobile Recharge Rewards
            </span>
            <div className="font-heading font-extrabold text-2xl tabular-nums">
              ₹{wallet.rechargeBalance}
            </div>
          </div>
        </div>
        <button
          onClick={() => setCurrentTab('rewards')}
          className="px-3.5 py-2 bg-white text-emerald-900 text-xs font-bold rounded-xl shadow-xs hover:bg-emerald-50 transition-colors cursor-pointer shrink-0"
        >
          Transfer Rewards →
        </button>
      </div>

      {/* Main Recharge Form & Plan Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Number & Operator Selection */}
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-xs space-y-5">
          <h3 className="font-heading font-bold text-base text-neutral-900">
            Mobile Number & Operator
          </h3>

          {/* Connection Type */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setConnectionType('prepaid')}
              className={`py-2 rounded-xl border text-center font-bold transition-colors cursor-pointer ${
                connectionType === 'prepaid'
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-neutral-50 text-neutral-600 border-neutral-200'
              }`}
            >
              Prepaid
            </button>
            <button
              type="button"
              onClick={() => setConnectionType('postpaid')}
              className={`py-2 rounded-xl border text-center font-bold transition-colors cursor-pointer ${
                connectionType === 'postpaid'
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-neutral-50 text-neutral-600 border-neutral-200'
              }`}
            >
              Postpaid
            </button>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">
              Mobile Number (+91)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400">
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="10-digit mobile number"
                className="w-full pl-12 pr-4 py-2.5 text-sm font-semibold bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 tabular-nums"
              />
            </div>
          </div>

          {/* Operator Selection */}
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-2">
              Select Telecom Operator
            </label>
            <div className="grid grid-cols-2 gap-2">
              {operators.map((op) => (
                <button
                  key={op}
                  type="button"
                  onClick={() => {
                    setOperator(op);
                    const defaultPlan = INITIAL_RECHARGE_PLANS.find((p) => p.operator === op);
                    if (defaultPlan) setSelectedPlan(defaultPlan);
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    operator === op
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-2xs'
                      : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {op}
                </button>
              ))}
            </div>
          </div>

          {/* Telecom Circle */}
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">
              Telecom Circle / Region
            </label>
            <select
              value={circle}
              onChange={(e) => setCircle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-amber-500"
            >
              {circles.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Checkout Breakdown & Pay button */}
          <div className="pt-4 border-t border-neutral-200 space-y-3">
            <div className="p-3 bg-neutral-50 rounded-xl space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Plan Price</span>
                <span className="tabular-nums font-semibold text-neutral-900">₹{selectedPlan.price}</span>
              </div>

              {wallet.rechargeBalance > 0 && (
                <div className="flex items-center justify-between text-emerald-700 font-semibold pt-1 border-t border-neutral-200/60">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useRewards}
                      onChange={(e) => setUseRewards(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Apply Rewards</span>
                  </label>
                  <span className="tabular-nums">-₹{rewardDeduction}</span>
                </div>
              )}

              <div className="flex justify-between font-bold text-sm text-neutral-900 pt-1.5 border-t border-neutral-200">
                <span>Total to Pay</span>
                <span className="tabular-nums text-emerald-600">₹{finalPayable}</span>
              </div>
            </div>

            <button
              disabled={isSubmitting || mobileNumber.length !== 10}
              onClick={handleRecharge}
              className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting to {operator} Gateway...</span>
                </span>
              ) : (
                <span>Confirm & Recharge • ₹{finalPayable}</span>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Plans Selector */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-neutral-900">
              Select {operator} Recharge Plan
            </h3>
            <span className="text-xs text-neutral-500">
              {availablePlans.length} plans available
            </span>
          </div>

          <div className="space-y-3">
            {availablePlans.map((plan) => {
              const isSelected = selectedPlan.id === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                      : 'border-neutral-200 bg-white hover:border-neutral-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-4">
                      <div>
                        <div className="font-heading font-black text-2xl text-neutral-900 tabular-nums">
                          ₹{plan.price}
                        </div>
                        <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                          {plan.category}
                        </span>
                      </div>

                      <div className="border-l border-neutral-200 pl-4 space-y-1 text-xs">
                        <div className="flex items-center gap-3 text-neutral-700">
                          <span className="font-bold">{plan.validity}</span>
                          <span>·</span>
                          <span className="font-medium">{plan.data}</span>
                          <span>·</span>
                          <span>{plan.calls}</span>
                        </div>
                        <p className="text-[11px] text-neutral-500">
                          {plan.benefits.join(' • ')}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Select Plan'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Successful Transaction Receipt Modal */}
      {lastReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 text-center animate-in zoom-in-95 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                Transaction Successful
              </span>
              <h3 className="font-heading font-extrabold text-2xl text-neutral-900 mt-1">
                Recharge Confirmed!
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Pack of ₹{lastReceipt.plan.price} activated on {lastReceipt.mobileNumber}
              </p>
            </div>

            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-500">Transaction ID:</span>
                <span className="font-mono font-bold text-neutral-900">{lastReceipt.txnId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Telecom Operator:</span>
                <span className="font-bold text-neutral-900">{lastReceipt.operator} ({lastReceipt.circle})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Plan Details:</span>
                <span className="font-medium text-neutral-800">{lastReceipt.plan.data} · {lastReceipt.plan.validity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Rewards Redeemed:</span>
                <span className="font-bold text-emerald-700 tabular-nums">₹{lastReceipt.rewardDeduction}</span>
              </div>
              <div className="flex justify-between border-t border-neutral-200 pt-1.5 font-bold">
                <span className="text-neutral-700">Cash Amount Paid:</span>
                <span className="tabular-nums text-neutral-900">₹{lastReceipt.finalPayable}</span>
              </div>
            </div>

            <button
              onClick={() => setLastReceipt(null)}
              className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
            >
              Done & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
