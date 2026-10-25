import React, { useState } from 'react';
import { ResourceItem, Order, OrderItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingBag,
  ShoppingCart,
  Check,
  Truck,
  CreditCard,
  Search,
  Package,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

interface AgriMarketplaceProps {
  resources: ResourceItem[];
  orders: Order[];
  onPlaceOrder: (order: Partial<Order>) => Promise<void>;
  onAddResource?: (resource: Partial<ResourceItem>) => Promise<void>;
}

export const AgriMarketplace: React.FC<AgriMarketplaceProps> = ({
  resources,
  orders,
  onPlaceOrder,
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'catalog' | 'orders'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart State
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);

  const [checkoutData, setCheckoutData] = useState({
    shippingAddress: 'Village Sanwer, Dhar Road Post, Indore 453551',
    paymentMethod: 'Kisan Credit Card (KCC)' as Order['paymentMethod'],
    kccNumber: '5049-8821-3341-9012',
  });

  const categories = ['all', 'Seeds', 'Organic Fertilizers', 'Bio-Pesticides', 'Micro-Irrigation', 'Tools & Equipment'];

  const filteredResources = resources.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const addToCart = (item: ResourceItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.resourceId === item.id);
      if (existing) {
        return prev.map((i) => (i.resourceId === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [
        ...prev,
        {
          resourceId: item.id,
          title: item.title,
          price: item.price,
          quantity: 1,
          unit: item.unit,
        },
      ];
    });
    setShowCartDrawer(true);
  };

  const updateQuantity = (resourceId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.resourceId === resourceId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as OrderItem[]
    );
  };

  const removeFromCart = (resourceId: string) => {
    setCart((prev) => prev.filter((i) => i.resourceId !== resourceId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrdering(true);
    try {
      const orderPayload: Partial<Order> = {
        userId: user?.id || 'usr-farmer-1',
        userName: user?.name || 'Ramesh Patel',
        items: cart,
        totalAmount: cartTotal,
        shippingAddress: checkoutData.shippingAddress,
        paymentMethod: checkoutData.paymentMethod,
        paymentStatus: 'Paid',
      };
      await onPlaceOrder(orderPayload);
      setCart([]);
      setShowCheckoutModal(false);
      setShowCartDrawer(false);
      setActiveTab('orders');
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            {t('agriStoreTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Procure certified seeds, ICAR-recommended bio-inputs, and precision irrigation hardware
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Catalog vs Orders Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'catalog' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Browse Catalog
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'orders' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Orders ({orders.length})
            </button>
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setShowCartDrawer(true)}
            className="relative p-2 bg-emerald-800 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            title="Open Shopping Cart"
          >
            <ShoppingCart className="w-4 h-4" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-500 text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center">
                {cart.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'catalog' ? (
        <>
          {/* Search & Categories */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search seed varieties, bio-fertilizers, drip kits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
                    selectedCategory === cat
                      ? 'bg-emerald-800 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {cat === 'all' ? 'All Products' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredResources.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    {item.certifiedOrganic && (
                      <span className="text-[11px] font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Organic</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{item.brand}</p>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">{item.description}</p>

                  {item.dosageOrUsage && (
                    <div className="mt-2 text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                      <strong className="text-slate-700">Usage:</strong> {item.dosageOrUsage}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                      ₹{item.price.toLocaleString()}
                    </div>
                    <span className="text-[11px] text-slate-400">per {item.unit}</span>
                  </div>

                  <button
                    onClick={() => addToCart(item)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{t('addToCart')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Orders & Live Tracking View */
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h2 className="text-sm font-bold text-slate-900 mb-1">{t('ordersHistory')}</h2>
            <p className="text-xs text-slate-500 mb-4">
              Real-time dispatch, route logistics, and Kisan Credit Card invoice receipts
            </p>

            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 font-mono">{ord.id}</span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-500 font-mono tabular-nums">{ord.trackingNumber}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Placed on {new Date(ord.createdAt).toLocaleDateString()} · Payment: {ord.paymentMethod}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                          ord.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {ord.status}
                      </span>
                      <span className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                        ₹{ord.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Tracking status bar */}
                  <div className="py-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1 font-medium">
                      <span>Order Placed</span>
                      <span>Confirmed</span>
                      <span>Dispatched</span>
                      <span className="text-emerald-700 font-bold">In Transit</span>
                      <span>Delivered</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-1.5 rounded-full"
                        style={{
                          width:
                            ord.status === 'Delivered'
                              ? '100%'
                              : ord.status === 'In Transit'
                              ? '75%'
                              : ord.status === 'Dispatched'
                              ? '50%'
                              : '25%',
                        }}
                      />
                    </div>
                  </div>

                  {/* Items */}
                  <div className="text-xs space-y-1 pt-1">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-slate-700">
                        <span>
                          {item.quantity}x {item.title} ({item.unit})
                        </span>
                        <span className="font-mono tabular-nums text-slate-900">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                    <strong className="text-slate-700">Shipping To:</strong> {ord.shippingAddress}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer Overlay */}
      {showCartDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md h-full flex flex-col justify-between p-6 shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-emerald-800" />
                  <h2 className="text-base font-bold text-slate-900">Shopping Cart</h2>
                </div>
                <button
                  onClick={() => setShowCartDrawer(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕ Close
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p>Your cart is empty. Add certified seeds or equipment from the catalog.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.resourceId}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                        <div className="text-slate-500 font-mono tabular-nums">
                          ₹{item.price} / {item.unit}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.resourceId, -1)}
                          className="p-1 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono tabular-nums font-bold text-slate-900 w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.resourceId, 1)}
                          className="p-1 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.resourceId)}
                          className="p-1 text-slate-400 hover:text-rose-600 ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-slate-200 pt-4 space-y-3 text-xs">
                <div className="flex items-baseline justify-between">
                  <span className="text-slate-600">{t('cartTotal')}</span>
                  <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                    ₹{cartTotal.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setShowCartDrawer(false);
                    setShowCheckoutModal(true);
                  }}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Proceed to Payment</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Confirm Agri-Procurement Order</h2>
            <p className="text-xs text-slate-500 mb-4">
              Select agricultural financing or digital payment method.
            </p>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Delivery Farm Address</label>
                <textarea
                  rows={2}
                  required
                  value={checkoutData.shippingAddress}
                  onChange={(e) => setCheckoutData({ ...checkoutData, shippingAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Payment Method</label>
                <select
                  value={checkoutData.paymentMethod}
                  onChange={(e) => setCheckoutData({ ...checkoutData, paymentMethod: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                >
                  <option value="Kisan Credit Card (KCC)">Kisan Credit Card (KCC - Subsidized 4% Interest)</option>
                  <option value="UPI / Direct Bank">UPI / Direct Bank Transfer</option>
                  <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                </select>
              </div>

              {checkoutData.paymentMethod === 'Kisan Credit Card (KCC)' && (
                <div>
                  <label className="block font-medium text-slate-700 mb-1">KCC Number</label>
                  <input
                    type="text"
                    value={checkoutData.kccNumber}
                    onChange={(e) => setCheckoutData({ ...checkoutData, kccNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600 font-mono"
                  />
                  <p className="text-[10px] text-emerald-700 mt-1">Verified NABARD & Cooperative Bank integration.</p>
                </div>
              )}

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Items Subtotal:</span>
                  <span className="font-mono tabular-nums">₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Agricultural Delivery Subsidy:</span>
                  <span className="text-emerald-700 font-medium">FREE</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200">
                  <span>Payable Total:</span>
                  <span className="font-mono tabular-nums text-sm">₹{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isOrdering}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {isOrdering ? 'Processing Payment...' : 'Confirm & Place Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
