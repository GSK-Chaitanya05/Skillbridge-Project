import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Order, PestAlert, ResourceItem } from '../types';
import {
  Shield,
  Users,
  Coins,
  MapPin,
  TrendingUp,
  Package,
  Plus,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

interface AdminDashboardProps {
  orders: Order[];
  pestAlerts: PestAlert[];
  resources: ResourceItem[];
  onUpdateOrderStatus: (orderId: string, status: string) => Promise<void>;
  onAddResource: (res: Partial<ResourceItem>) => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  pestAlerts,
  resources,
  onUpdateOrderStatus,
  onAddResource,
}) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  const [productForm, setProductForm] = useState({
    title: '',
    category: 'Seeds' as ResourceItem['category'],
    price: '1200',
    unit: 'Bag (25kg)',
    brand: 'National Seeds Corp',
    description: '',
    certifiedOrganic: false,
    stockCount: '100',
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getAdminStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [orders.length, pestAlerts.length, resources.length]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddResource({
      title: productForm.title,
      category: productForm.category,
      price: parseFloat(productForm.price),
      unit: productForm.unit,
      brand: productForm.brand,
      description: productForm.description,
      certifiedOrganic: productForm.certifiedOrganic,
      stockCount: parseInt(productForm.stockCount) || 50,
    });
    setShowAddProductModal(false);
    setProductForm({
      title: '',
      category: 'Seeds',
      price: '1200',
      unit: 'Bag (25kg)',
      brand: 'National Seeds Corp',
      description: '',
      certifiedOrganic: false,
      stockCount: '100',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-700" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              System Administration & Platform Command
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Role-based security governance, catalog approval, order fulfillment, and regional crop safety
          </p>
        </div>

        <button
          onClick={() => setShowAddProductModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-medium transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Catalog Product</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <span className="text-xs text-slate-500 font-medium">Monitored Farmland</span>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {stats?.monitoredAcreage || 12.5} Acres
          </div>
          <div className="mt-2 text-xs text-emerald-700 font-medium">
            Across {stats?.totalFarms || 2} Connected Parcels
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <span className="text-xs text-slate-500 font-medium">Total Procurement GMV</span>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono tabular-nums">
            ₹{(stats?.marketplaceRevenue || orders.reduce((s, o) => s + o.totalAmount, 0)).toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-slate-500 font-mono tabular-nums">
            {orders.length} Verified Orders
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <span className="text-xs text-slate-500 font-medium">Active Pest Advisories</span>
          <div className="mt-2 text-2xl font-bold text-rose-700 font-mono tabular-nums">
            {pestAlerts.length}
          </div>
          <div className="mt-2 text-xs text-rose-600">
            {pestAlerts.filter((a) => a.severity === 'Urgent').length} Urgent Warnings Active
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <span className="text-xs text-slate-500 font-medium">Platform Health Index</span>
          <div className="mt-2 text-2xl font-bold text-emerald-700 font-mono tabular-nums">
            85%
          </div>
          <div className="mt-2 text-xs text-emerald-600">High Agronomic Resiliency</div>
        </div>
      </div>

      {/* Orders Fulfillment Dispatcher */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Fulfillment & Logistics Dispatch</h2>
            <p className="text-xs text-slate-500">Update shipping and delivery statuses for farmers</p>
          </div>
          <span className="text-xs text-slate-500 font-mono tabular-nums">{orders.length} Orders</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-medium text-[11px]">
                <th className="py-2.5 px-3">Order ID</th>
                <th className="py-2.5 px-3">Farmer</th>
                <th className="py-2.5 px-3">Items</th>
                <th className="py-2.5 px-3">Total Amount</th>
                <th className="py-2.5 px-3">Payment</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-mono font-medium text-slate-900">{ord.id}</td>
                  <td className="py-3 px-3 font-medium text-slate-800">{ord.userName}</td>
                  <td className="py-3 px-3 text-slate-600">
                    {ord.items.map((i) => `${i.quantity}x ${i.title}`).join(', ')}
                  </td>
                  <td className="py-3 px-3 font-mono tabular-nums font-bold text-slate-900">
                    ₹{ord.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-slate-600">{ord.paymentMethod}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        ord.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.status === 'In Transit'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <select
                      value={ord.status}
                      onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value)}
                      className="text-xs px-2 py-1 border border-slate-300 rounded focus:outline-purple-600 bg-white"
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Catalog Management Preview */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Catalog Inventory & Certification</h2>
            <p className="text-xs text-slate-500">Certified farm inputs currently live on marketplace</p>
          </div>
          <span className="text-xs text-slate-500 font-mono tabular-nums">{resources.length} Listed Items</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {resources.map((item) => (
            <div key={item.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex justify-between items-center">
              <div>
                <h4 className="font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                <div className="text-slate-500">{item.brand} · {item.category}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-mono font-bold text-slate-900">₹{item.price}</div>
                <span className="text-[10px] text-slate-400">Stock: {item.stockCount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Add Certified Product</h2>
            <p className="text-xs text-slate-500 mb-4">
              Expand marketplace catalog with certified seeds, fertilizers, or tools.
            </p>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Certified Zinc Micronutrient Granules"
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-purple-600"
                  >
                    <option value="Seeds">Seeds</option>
                    <option value="Organic Fertilizers">Organic Fertilizers</option>
                    <option value="Bio-Pesticides">Bio-Pesticides</option>
                    <option value="Micro-Irrigation">Micro-Irrigation</option>
                    <option value="Tools & Equipment">Tools & Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Brand / Certifier</label>
                  <input
                    type="text"
                    required
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-purple-600"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-purple-600"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Stock Qty</label>
                  <input
                    type="number"
                    required
                    value={productForm.stockCount}
                    onChange={(e) => setProductForm({ ...productForm, stockCount: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Product Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Enter specifications, active contents, or dosage..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-purple-600"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="certOrg"
                  checked={productForm.certifiedOrganic}
                  onChange={(e) => setProductForm({ ...productForm, certifiedOrganic: e.target.checked })}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="certOrg" className="font-medium text-slate-700">
                  Certified 100% Organic (NPOP / USDA Standard)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-medium transition-colors"
                >
                  Publish to Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
