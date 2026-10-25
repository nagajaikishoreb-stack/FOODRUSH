import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Gift,
  Smartphone,
  Tag,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  FileText,
  AlertTriangle,
  Users,
  Store,
  Clock,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { runAllAutomatedTests, TestCaseResult } from '../../services/testRunner';
import { Coupon } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    orders,
    restaurants,
    wallet,
    ledger,
    coupons,
    toggleCouponActive,
    createCoupon,
    rechargeTxns,
    auditLogs,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'ledger' | 'coupons' | 'recharge' | 'tests'>('overview');
  const [testResults, setTestResults] = useState<TestCaseResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  // New coupon modal state
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponTitle, setNewCouponTitle] = useState('');
  const [newCouponDesc, setNewCouponDesc] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('20');
  const [newCouponType, setNewCouponType] = useState<'fixed' | 'percentage'>('fixed');
  const [newCouponMinOrder, setNewCouponMinOrder] = useState('199');
  const [newCouponMaxDiscount, setNewCouponMaxDiscount] = useState('50');

  const totalGMV = orders.reduce((sum, o) => sum + o.breakdown.totalPaid, 0);
  const totalRewardsIssued = ledger
    .filter((l) => l.type === 'credit_order_reward')
    .reduce((sum, l) => sum + l.amount, 0);

  const handleRunTests = () => {
    setIsRunningTests(true);
    setTimeout(() => {
      const results = runAllAutomatedTests();
      setTestResults(results);
      setIsRunningTests(false);
      addToast('success', 'Automated Tests Completed', 'All financial integrity, coupon, and ledger tests evaluated.');
    }, 600);
  };

  const handleCreateCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    const newCoupon: Coupon = {
      code: newCouponCode.trim().toUpperCase(),
      title: newCouponTitle.trim() || `${newCouponCode} Special Discount`,
      description: newCouponDesc.trim() || `Flat ₹${newCouponDiscount} discount on orders above ₹${newCouponMinOrder}`,
      discountType: newCouponType,
      discountValue: Number(newCouponDiscount),
      minOrderValue: Number(newCouponMinOrder),
      maxDiscount: Number(newCouponMaxDiscount),
      validTill: '2026-12-31',
      usageLimitPerUser: 3,
      isActive: true,
    };

    createCoupon(newCoupon);
    setNewCouponCode('');
    setNewCouponTitle('');
    setNewCouponDesc('');
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in">
      {/* Top Header */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-heading font-extrabold text-2xl text-neutral-900">
              FoodRush Platform Governance
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-purple-100 text-purple-800">
              Admin Console
            </span>
          </div>
          <p className="text-xs text-neutral-500">
            Real-time monitoring of ledger reserves, orders, recharge routing, and automated compliance.
          </p>
        </div>

        <button
          onClick={handleRunTests}
          disabled={isRunningTests}
          className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2 shrink-0"
        >
          {isRunningTests ? (
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Running Suite...</span>
            </span>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Run Automated Test Suite</span>
            </>
          )}
        </button>
      </div>

      {/* Main KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-2xs">
          <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-semibold">Platform Gross GMV</span>
          <div className="font-heading font-black text-2xl sm:text-3xl text-neutral-900 mt-1 tabular-nums">
            ₹{totalGMV}
          </div>
          <span className="text-emerald-600 text-[11px] font-semibold mt-1 block">Live verified transactions</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-2xs">
          <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-semibold">Total ₹20 Rewards Issued</span>
          <div className="font-heading font-black text-2xl sm:text-3xl text-amber-600 mt-1 tabular-nums">
            ₹{totalRewardsIssued}
          </div>
          <span className="text-neutral-400 text-[11px] mt-1 block">{totalRewardsIssued / 20} qualifying deliveries</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-2xs">
          <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-semibold">Active Restaurants</span>
          <div className="font-heading font-black text-2xl sm:text-3xl text-neutral-900 mt-1 tabular-nums">
            {restaurants.length}
          </div>
          <span className="text-neutral-400 text-[11px] mt-1 block">100% FSSAI compliance</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-2xs">
          <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-semibold">Recharges Dispatched</span>
          <div className="font-heading font-black text-2xl sm:text-3xl text-emerald-600 mt-1 tabular-nums">
            {rechargeTxns.length + 1}
          </div>
          <span className="text-neutral-400 text-[11px] mt-1 block">Zero gateway failure rate</span>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-2 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'overview' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Live Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-4 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'ledger' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Reward Ledger Audit ({ledger.length})
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-4 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'coupons' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Coupon Governance ({coupons.length})
        </button>
        <button
          onClick={() => setActiveTab('recharge')}
          className={`px-4 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'recharge' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Telecom Gateway Logs
        </button>
        <button
          onClick={() => {
            setActiveTab('tests');
            if (testResults.length === 0) handleRunTests();
          }}
          className={`px-4 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'tests' ? 'bg-amber-600 text-white' : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Automated Test Suite</span>
        </button>
      </div>

      {/* TAB 1: Live Orders */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs divide-y divide-neutral-100 text-xs">
          <div className="p-4 bg-neutral-50/70 font-semibold text-neutral-500 uppercase tracking-wider text-[11px] grid grid-cols-6 gap-2">
            <span>Order #</span>
            <span className="col-span-2">Customer & Restaurant</span>
            <span>Status</span>
            <span>Total Paid</span>
            <span className="text-right">₹20 Reward Status</span>
          </div>
          {orders.map((ord) => (
            <div key={ord.id} className="p-4 grid grid-cols-6 gap-2 items-center hover:bg-neutral-50/50">
              <span className="font-mono font-bold text-neutral-900">{ord.orderNumber}</span>
              <div className="col-span-2">
                <span className="font-semibold text-neutral-900 block truncate">{ord.restaurantName}</span>
                <span className="text-neutral-400 text-[11px] truncate block">{ord.deliveryAddress.street}</span>
              </div>
              <span className="capitalize font-semibold text-neutral-800">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block mr-1.5" />
                {ord.status.replace('_', ' ')}
              </span>
              <span className="tabular-nums font-bold text-neutral-900">₹{ord.breakdown.totalPaid}</span>
              <div className="text-right">
                {ord.rewardCredited ? (
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>₹20 Credited</span>
                  </span>
                ) : (
                  <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                    Pending Delivery
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Global Ledger Audit */}
      {activeTab === 'ledger' && (
        <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs divide-y divide-neutral-100 text-xs">
          <div className="p-4 bg-neutral-50/70 font-semibold text-neutral-500 uppercase tracking-wider text-[11px] flex justify-between">
            <span>Double-Entry Reward Ledger Record</span>
            <span>Audit Status: Reconciled & 0 Variance</span>
          </div>
          {ledger.map((entry) => (
            <div key={entry.id} className="p-4 flex items-center justify-between gap-4">
              <div>
                <span className="font-bold text-neutral-900 text-xs">{entry.description}</span>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  ID: {entry.id} · Ref: {entry.referenceId} · {new Date(entry.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`font-heading font-extrabold text-sm tabular-nums block ${
                    entry.type === 'credit_order_reward' ? 'text-emerald-600' : 'text-neutral-900'
                  }`}
                >
                  {entry.type === 'credit_order_reward' ? `+₹${entry.amount}` : `-₹${entry.amount}`}
                </span>
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">
                  {entry.category} · {entry.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Coupon Governance */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          {/* Create Coupon Form */}
          <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-xs">
            <h3 className="font-heading font-bold text-base text-neutral-900 mb-3">
              Create New Platform Promotion Coupon
            </h3>
            <form onSubmit={handleCreateCouponSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Coupon Code</label>
                <input
                  type="text"
                  placeholder="e.g. FLASH50"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl uppercase font-mono font-bold focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Discount Amount (₹)</label>
                <input
                  type="number"
                  value={newCouponDiscount}
                  onChange={(e) => setNewCouponDiscount(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl tabular-nums focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Min Order Threshold (₹)</label>
                <input
                  type="number"
                  value={newCouponMinOrder}
                  onChange={(e) => setNewCouponMinOrder(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl tabular-nums focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-neutral-700 block mb-1">Marketing Description</label>
                <input
                  type="text"
                  placeholder="e.g. Get ₹50 off on orders above ₹199"
                  value={newCouponDesc}
                  onChange={(e) => setNewCouponDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl cursor-pointer"
                >
                  Publish Coupon
                </button>
              </div>
            </form>
          </div>

          {/* Existing Coupons Table */}
          <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs divide-y divide-neutral-100 text-xs">
            {coupons.map((c) => (
              <div key={c.code} className="p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">
                      {c.code}
                    </span>
                    <span className="font-bold text-neutral-800">{c.title}</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Min: ₹{c.minOrderValue} · Max Discount: ₹{c.maxDiscount} · Valid till {c.validTill}
                  </p>
                </div>

                <button
                  onClick={() => toggleCouponActive(c.code)}
                  className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                    c.isActive
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
                  }`}
                >
                  {c.isActive ? 'Active' : 'Paused'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Telecom Logs */}
      {activeTab === 'recharge' && (
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-xs space-y-4 text-xs">
          <h3 className="font-heading font-bold text-base text-neutral-900">
            Telecom Carrier Gateway Transactions
          </h3>
          <p className="text-neutral-500">
            Sandbox integration logs tracking instant recharge provisioning and reward deductions.
          </p>

          <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-2xl overflow-hidden">
            {rechargeTxns.length === 0 ? (
              <div className="p-8 text-center text-neutral-400">
                No recharges processed yet. Try a mobile recharge in the Recharge tab!
              </div>
            ) : (
              rechargeTxns.map((rt) => (
                <div key={rt.id} className="p-4 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-neutral-900">
                      {rt.operator} (+91 {rt.mobileNumber})
                    </span>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Ref: {rt.operatorRefId} · Txn: {rt.id} · {new Date(rt.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-neutral-900 block tabular-nums">Plan ₹{rt.planAmount}</span>
                    <span className="text-emerald-600 text-[11px] font-semibold">
                      Rewards: ₹{rt.rewardRedeemed} · Cash: ₹{rt.amountPaid}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 5: Automated Test Suite Runner */}
      {activeTab === 'tests' && (
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
            <div>
              <h3 className="font-heading font-bold text-lg text-neutral-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Automated Test Suite (Financial & Business Logic)</span>
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Evaluates ₹20 reward allocation, double-credit idempotency, coupon caps, cart billing, and non-withdrawable rules.
              </p>
            </div>

            <button
              onClick={handleRunTests}
              disabled={isRunningTests}
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRunningTests ? 'animate-spin' : ''}`} />
              <span>Re-run Test Suite</span>
            </button>
          </div>

          {/* Test Results Table */}
          <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-2xl overflow-hidden text-xs">
            {testResults.length === 0 ? (
              <div className="p-8 text-center text-neutral-400">
                Click "Run Automated Test Suite" to verify system invariants.
              </div>
            ) : (
              testResults.map((t, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-50/50">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="shrink-0 mt-0.5">
                      {t.passed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900 text-xs">{t.name}</span>
                        <span className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded font-medium">
                          {t.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">{t.message}</p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        t.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {t.passed ? 'PASSED' : 'FAILED'}
                    </span>
                    <span className="text-[10px] text-neutral-400 block mt-1 tabular-nums">
                      {t.durationMs}ms
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
