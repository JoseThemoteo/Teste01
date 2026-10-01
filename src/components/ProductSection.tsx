import React from 'react';
import { Flame, ChevronRight, Plus, CheckCircle2, Utensils } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  tag: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface ProductSectionProps {
  onAddToCart: (product: Product) => void;
  onViewAll?: () => void;
}

export const products: Product[] = [
  {
    id: 'smash-bacon-trufado',
    name: 'Smash Bacon Trufado',
    tag: 'Artesanal',
    description: 'Brioche na manteiga, 2x smash 90g, cheddar inglês derretido, bacon...',
    price: 34.90,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'classic-burger',
    name: 'Classic Burger',
    tag: 'Grelhado no Fogo',
    description: 'Pão com gergelim, hambúrguer 180g na brasa, queijo prato, molho especial...',
    price: 31.50,
    imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'duplo-cheddar-crispy',
    name: 'Duplo Cheddar Crispy',
    tag: 'Mais Vendido',
    description: 'Pão australiano, 2x smash 90g, muito cheddar cremoso e cebola crispy...',
    price: 36.90,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
  },
];

export const ProductSection: React.FC<ProductSectionProps> = ({
  onAddToCart,
  onViewAll,
}) => {
  return (
    <div className="py-3">
      {/* Section Header */}
      <div className="flex items-center justify-between px-4 mb-3">
        <div className="flex items-center gap-1.5">
          <Flame size={18} className="text-amber-500 fill-amber-500" />
          <h2 className="text-lg font-black text-white tracking-tight">Mais Pedidos</h2>
        </div>
        <button
          onClick={onViewAll}
          className="flex items-center text-xs font-bold text-amber-500 hover:text-amber-400 transition-colors"
        >
          <span>Ver todos</span>
          <ChevronRight size={14} className="ml-0.5" />
        </button>
      </div>

      {/* Product Scroll List */}
      <div className="flex gap-3.5 overflow-x-auto no-scrollbar px-4 pb-2 snap-x">
        {products.map((product) => (
          <div
            key={product.id}
            className="shrink-0 w-[240px] bg-[#f4ebd0] text-stone-950 rounded-3xl p-3 shadow-md snap-start flex flex-col justify-between"
          >
            <div>
              {/* Product Image Box */}
              <div className="relative w-full h-[140px] rounded-2xl overflow-hidden mb-3 bg-stone-800">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-[#1c1c1e]/80 backdrop-blur-md text-stone-200 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-stone-700/50">
                  {product.tag}
                </span>
              </div>

              {/* Product Info */}
              <h3 className="font-extrabold text-stone-900 text-base leading-snug tracking-tight mb-1">
                {product.name}
              </h3>
              <p className="text-stone-700 text-xs line-clamp-2 font-medium leading-relaxed mb-3">
                {product.description}
              </p>
            </div>

            {/* Price & Add Button */}
            <div className="flex items-center justify-between pt-1">
              <span className="font-black text-lg text-stone-950 tracking-tight">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
              <button
                onClick={() => onAddToCart(product)}
                className="w-9 h-9 rounded-full bg-[#121212] text-white flex items-center justify-center hover:bg-stone-800 transition-all active:scale-90 shadow"
                aria-label={`Adicionar ${product.name}`}
              >
                <Plus size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Blends Moídos Diariamente Banner */}
      <div className="px-4 mt-4">
        <div className="bg-[#18181b] border border-stone-800/80 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#27272a] flex items-center justify-center text-amber-500">
              {/* Skillet / Pan icon */}
              <Utensils size={20} />
            </div>
            <div>
              <h4 className="text-white font-extrabold text-sm tracking-tight">
                Blends Moídos Diariamente
              </h4>
              <p className="text-stone-400 text-xs font-medium">
                Carne 100% Angus fresca sem conservantes
              </p>
            </div>
          </div>
          <CheckCircle2 size={18} className="text-stone-400 shrink-0 ml-2" />
        </div>
      </div>
    </div>
  );
};
