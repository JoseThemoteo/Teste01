import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import type { Product } from './ProductSection';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onClearCart,
}) => {
  if (!isOpen) return null;

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#18181b] text-white h-full flex flex-col shadow-2xl overflow-hidden border-l border-stone-800">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800 bg-[#121212]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center">
              <ShoppingBag size={18} />
            </div>
            <h2 className="text-lg font-black tracking-tight text-white">Seu Carrinho</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-stone-800 flex items-center justify-center text-stone-500 mb-4">
                <ShoppingBag size={32} />
              </div>
              <p className="text-stone-300 font-bold text-base mb-1">Seu carrinho está vazio</p>
              <p className="text-stone-500 text-xs max-w-xs">
                Adicione deliciosos hambúrgueres e combos do nosso cardápio!
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between bg-[#202023] p-3.5 rounded-2xl border border-stone-800"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-14 h-14 object-cover rounded-xl bg-stone-800"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-white">{item.product.name}</h4>
                    <p className="text-amber-500 font-extrabold text-xs mt-0.5">
                      R$ {item.product.price.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-[#121212] border border-stone-800 rounded-xl p-1">
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, -1)}
                    className="p-1 text-stone-400 hover:text-white transition-colors"
                  >
                    {item.quantity === 1 ? <Trash2 size={14} className="text-red-400" /> : <Minus size={14} />}
                  </button>
                  <span className="font-bold text-xs min-w-[16px] text-center text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, 1)}
                    className="p-1 text-stone-400 hover:text-white transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-stone-800 bg-[#121212] space-y-3">
            <div className="flex items-center justify-between text-sm text-stone-400">
              <span>Subtotal</span>
              <span className="font-bold text-white">R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-stone-400">
              <span>Taxa de entrega</span>
              <span className="text-emerald-400 font-bold">Grátis</span>
            </div>
            <div className="border-t border-stone-800 pt-2 flex items-center justify-between text-base font-black text-white">
              <span>Total</span>
              <span className="text-amber-500 text-lg">R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>

            <button
              onClick={() => {
                alert('Pedido realizado com sucesso!');
                onClearCart();
                onClose();
              }}
              className="w-full bg-[#ea8b1f] hover:bg-amber-500 text-stone-950 font-extrabold text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg active:scale-98 mt-2"
            >
              <span>Finalizar Pedido</span>
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
