import React from 'react';
import { AlertCircle, Trash2, ArrowRight } from 'lucide-react';

interface RestaurantConflictModalProps {
  currentRestaurantName: string;
  onCancel: () => void;
  onConfirmReplace: () => void;
}

export const RestaurantConflictModal: React.FC<RestaurantConflictModalProps> = ({
  currentRestaurantName,
  onCancel,
  onConfirmReplace,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 text-center animate-in zoom-in-95">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>

        <h3 className="font-heading font-bold text-lg text-neutral-900 mb-2">
          Replace Cart Items?
        </h3>

        <p className="text-xs text-neutral-600 leading-relaxed mb-6">
          Your cart currently contains items from <strong className="text-neutral-900">{currentRestaurantName}</strong>. Food delivery platforms process orders from one restaurant at a time to ensure optimal freshness and delivery speed.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            Keep Current Cart
          </button>
          <button
            onClick={onConfirmReplace}
            className="flex-1 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Replace & Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
