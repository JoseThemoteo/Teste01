import { useState } from 'react';
import { Header } from './components/Header';
import { PromoBanner } from './components/PromoBanner';
import { CategoryGrid } from './components/CategoryGrid';
import { LoyaltyCard } from './components/LoyaltyCard';
import { ProductSection, products, type Product } from './components/ProductSection';
import { BottomNav, type NavTab } from './components/BottomNav';
import { CartDrawer, type CartItem } from './components/CartDrawer';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: products[0], quantity: 1 },
    { product: products[1], quantity: 1 },
  ]);

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex justify-center selection:bg-amber-500 selection:text-stone-950">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-md bg-[#121212] min-h-screen pb-24 shadow-2xl relative flex flex-col">
        {/* Top Header */}
        <Header
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenProfile={() => setActiveTab('profile')}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Dynamic Content Views */}
        <main className="flex-1">
          {activeTab === 'home' && (
            <>
              {/* Promo Combo Banner */}
              <PromoBanner
                onOrderNow={() => {
                  handleAddToCart({
                    id: 'combo-dia',
                    name: 'Combo Smash Cheddar Duplo',
                    tag: 'Combo do Dia',
                    description: 'Duplo smash 90g + Fritas Rústicas + Refri',
                    price: 38.90,
                    imageUrl:
                      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
                  });
                  setIsCartOpen(true);
                }}
              />

              {/* Quick Action Category Grid */}
              <CategoryGrid
                onSelectCategory={(catId) => {
                  if (catId === 'menu') setActiveTab('menu');
                  if (catId === 'loyalty') setActiveTab('loyalty');
                  if (catId === 'orders' || catId === 'account') setIsCartOpen(true);
                }}
              />

              {/* Loyalty Program Progress */}
              <LoyaltyCard currentPts={320} maxPts={400} />

              {/* Popular Products Carousel */}
              <ProductSection
                onAddToCart={(prod) => {
                  handleAddToCart(prod);
                }}
                onViewAll={() => setActiveTab('menu')}
              />
            </>
          )}

          {activeTab === 'menu' && (
            <div className="px-4 py-4 text-white">
              <h2 className="text-xl font-extrabold mb-4">Nosso Cardápio</h2>
              <div className="grid grid-cols-1 gap-4">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between bg-[#1c1c1e] p-3 rounded-2xl border border-stone-800"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-16 h-16 object-cover rounded-xl"
                      />
                      <div>
                        <h3 className="font-bold text-sm text-white">{p.name}</h3>
                        <p className="text-stone-400 text-xs line-clamp-1">{p.description}</p>
                        <p className="text-amber-500 font-black text-sm mt-1">
                          R$ {p.price.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddToCart(p)}
                      className="bg-amber-500 text-stone-950 font-bold px-3 py-1.5 rounded-xl text-xs hover:bg-amber-400 transition-colors"
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'loyalty' && (
            <div className="px-4 py-4 text-white">
              <h2 className="text-xl font-extrabold mb-4">Programa de Fidelidade</h2>
              <LoyaltyCard currentPts={320} maxPts={400} />
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="px-4 py-6 text-white text-center">
              <div className="w-20 h-20 bg-[#f3ab51] text-stone-950 rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-3 shadow-lg">
                M
              </div>
              <h2 className="text-xl font-extrabold">Matheus Silva</h2>
              <p className="text-stone-400 text-sm">matheus@burgercraft.com</p>
            </div>
          )}
        </main>

        {/* Fixed Bottom Navigation */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Cart Side Drawer */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onClearCart={handleClearCart}
        />
      </div>
    </div>
  );
}

export default App;
