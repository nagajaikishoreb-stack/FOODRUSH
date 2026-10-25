import React, { useState } from 'react';
import {
  Headphones,
  MessageSquare,
  Send,
  HelpCircle,
  FileQuestion,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Bot,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SupportTicket } from '../../types';

interface CustomerSupportViewProps {
  setCurrentTab: (tab: string) => void;
}

export const CustomerSupportView: React.FC<CustomerSupportViewProps> = ({ setCurrentTab }) => {
  const { supportTickets, submitSupportTicket, replyToSupportTicket, orders, user } = useApp();

  const [activeTicketId, setActiveTicketId] = useState<string>(
    supportTickets.length > 0 ? supportTickets[0].id : ''
  );
  const [newCategory, setNewCategory] = useState<SupportTicket['category']>('Order Issue');
  const [newSubject, setNewSubject] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [replyText, setReplyText] = useState('');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);

  // Quick FAQ Bot
  const [botQuery, setBotQuery] = useState('');
  const [botAnswers, setBotAnswers] = useState<Array<{ q: string; a: string }>>([
    {
      q: 'How does the ₹20 Reward guarantee work?',
      a: 'For every successfully completed and delivered order, exactly ₹20 reward voucher is instantly credited to your Food Reward Balance. You can use it toward future orders or allocate it toward mobile recharges.',
    },
    {
      q: 'Can I withdraw my reward balance as cash to my bank?',
      a: 'No. In compliance with RBI regulations and platform terms, promotional loyalty rewards are strictly non-withdrawable and cannot be transferred to a bank or converted to fiat cash. They are usable for food deliveries and prepaid mobile recharges only.',
    },
    {
      q: 'How do I recharge my mobile using rewards?',
      a: 'Head to the "Mobile Recharge" tab, enter your 10-digit mobile number, pick your operator (Jio, Airtel, Vi, BSNL) and plan, then check "Apply Rewards" to deduct your recharge reward balance from the final bill!',
    },
    {
      q: 'What is the cancellation and refund policy?',
      a: 'Orders can be cancelled free of charge before the restaurant accepts food preparation. Once food cooking has begun, full or partial refund eligibility is determined based on restaurant mutual cancellation approval.',
    },
  ]);

  const activeTicket = supportTickets.find((t) => t.id === activeTicketId) || supportTickets[0];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) return;

    submitSupportTicket(newCategory, newSubject.trim(), newMessage.trim());
    setNewSubject('');
    setNewMessage('');
    setShowNewTicketModal(false);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    replyToSupportTicket(activeTicket.id, replyText.trim(), 'user');
    setReplyText('');
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 mb-1">
            <Headphones className="w-4 h-4" />
            <span>24/7 Priority Resolution Desk</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-900 tracking-tight">
            Customer Support & Assistance
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            We are here to help with your orders, ₹20 reward balances, mobile recharge status, and refunds.
          </p>
        </div>

        <button
          onClick={() => setShowNewTicketModal(true)}
          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
        >
          + Open Support Ticket
        </button>
      </div>

      {/* AI Assistant Quick Knowledge Base */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-amber-900">
          <Bot className="w-5 h-5 text-amber-600" />
          <h3 className="font-heading font-bold text-base">
            Instant AI Support Assistant (FAQs & Rules)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {botAnswers.map((item, idx) => (
            <div key={idx} className="p-4 bg-white/80 backdrop-blur-xs rounded-2xl border border-amber-200/60 space-y-1.5">
              <h4 className="font-bold text-neutral-900 flex items-start gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>{item.q}</span>
              </h4>
              <p className="text-neutral-600 leading-relaxed pl-5">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tickets Interface: Left List + Right Chat Thread */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket Selector List */}
        <div className="bg-white rounded-3xl border border-neutral-200 p-4 shadow-xs space-y-3">
          <h3 className="font-heading font-bold text-sm text-neutral-900 px-2">
            Your Support Tickets ({supportTickets.length})
          </h3>

          <div className="space-y-2">
            {supportTickets.map((t) => {
              const isSelected = activeTicket?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setActiveTicketId(t.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer text-xs ${
                    isSelected
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold opacity-70 uppercase">
                      {t.category}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        t.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {t.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="font-bold truncate">{t.subject}</h4>
                  <p className="text-[11px] opacity-70 mt-1">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ticket Conversation Thread */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-neutral-200 p-6 shadow-xs flex flex-col justify-between min-h-[420px]">
          {activeTicket ? (
            <>
              <div>
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                      Ticket #{activeTicket.id} · {activeTicket.category}
                    </span>
                    <h3 className="font-heading font-bold text-lg text-neutral-900">
                      {activeTicket.subject}
                    </h3>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                      activeTicket.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {activeTicket.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Messages Stream */}
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {activeTicket.messages.map((m) => {
                    const isUser = m.sender === 'user';
                    return (
                      <div
                        key={m.id}
                        className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-md p-3.5 rounded-2xl text-xs space-y-1 ${
                            isUser
                              ? 'bg-neutral-900 text-white rounded-br-xs'
                              : 'bg-neutral-100 text-neutral-900 rounded-bl-xs'
                          }`}
                        >
                          <span className="text-[10px] opacity-60 font-semibold block">
                            {isUser ? 'You' : 'FoodRush Support Agent'} · {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <p className="leading-relaxed">{m.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reply Input Form */}
              <form onSubmit={handleSendReply} className="pt-4 mt-4 border-t border-neutral-100 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type your reply to the support team..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="py-20 text-center text-neutral-400 text-xs">
              Select or open a support ticket to view conversation.
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h3 className="font-heading font-bold text-base text-neutral-900">
                Open Support Ticket
              </h3>
              <button
                onClick={() => setShowNewTicketModal(false)}
                className="text-neutral-400 hover:text-neutral-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Issue Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-amber-500"
                >
                  <option value="Order Issue">Order Issue (Missing, wrong items)</option>
                  <option value="Delivery Delay">Delivery Delay</option>
                  <option value="Reward Wallet">₹20 Reward Wallet inquiry</option>
                  <option value="Mobile Recharge">Mobile Recharge status / failure</option>
                  <option value="General Query">General Query</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="e.g., Reward voucher not showing after delivery"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Description / Details</label>
                <textarea
                  rows={4}
                  placeholder="Please describe what happened with relevant details..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:border-amber-500 leading-relaxed"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold cursor-pointer"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
