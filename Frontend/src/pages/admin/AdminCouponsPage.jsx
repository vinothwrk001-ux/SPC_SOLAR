import React, { useState, useEffect } from 'react';
import { 
  FiTag, 
  FiCheckCircle, 
  FiClock, 
  FiRefreshCw, 
  FiSave, 
  FiUser, 
  FiCopy, 
  FiSearch,
  FiFilter,
  FiInfo,
  FiPercent
} from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';
import SEOHead from '../../components/ui/SEOHead';

const AdminCouponsPage = () => {
  const [config, setConfig] = useState({
    isActive: true,
    codeType: 'fixed',
    couponCode: 'WELCOME1000',
    codePrefix: 'SPC',
    discountAmount: 1000,
    title: 'New Customer Installation Discount',
    description: 'Flat ₹1,000 reduction applied on your final rooftop solar turnkey installation invoice.',
    minSystemSizeKW: 1,
    validityDays: 60,
    terms: [
      'Valid on all grid-connected rooftop solar installations (1 kW and above).',
      'Discount amount is directly deducted from the final turnkey installation invoice after installation.',
      'Applicable once per registered consumer connection.',
      'Can be combined with PM Surya Ghar Muft Bijli Yojana Central Subsidy.',
    ],
  });

  const [issuedCoupons, setIssuedCoupons] = useState([]);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchConfig();
    fetchIssuedCoupons();
  }, []);

  const fetchConfig = async () => {
    setLoadingConfig(true);
    try {
      const res = await api.get('/coupon/admin/config');
      if (res.data) {
        setConfig(res.data);
      }
    } catch (error) {
      console.error('Error fetching coupon config:', error);
      toast.error('Failed to load coupon configuration');
    } finally {
      setLoadingConfig(false);
    }
  };

  const fetchIssuedCoupons = async () => {
    setLoadingUsers(true);
    try {
      const res = await api.get('/coupon/admin/issued');
      setIssuedCoupons(res.data || []);
    } catch (error) {
      console.error('Error fetching issued coupons:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      await api.put('/coupon/admin/config', config);
      toast.success('Coupon configuration saved successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update configuration');
    } finally {
      setSavingConfig(false);
    }
  };

  const handleUpdateStatus = async (userId, newStatus) => {
    try {
      await api.put(`/coupon/admin/status/${userId}`, {
        status: newStatus,
        claimedNotes: newStatus === 'Claimed' ? 'Discount deducted from final installation invoice' : '',
      });
      toast.success(`Coupon marked as ${newStatus}`);
      fetchIssuedCoupons();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  // Filtered issued coupons
  const filteredUsers = issuedCoupons.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone?.includes(searchTerm) ||
      u.coupon?.code?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || u.coupon?.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 font-sans">
      <SEOHead title="Welcome Coupon Settings | Admin" description="Configure new customer welcome coupons" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 flex items-center gap-2.5">
            <FiTag className="text-red" /> New User Welcome Coupon System
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure welcome discount vouchers issued to newly registered customers and track installation deductions.
          </p>
        </div>
        <button
          onClick={() => {
            fetchConfig();
            fetchIssuedCoupons();
          }}
          className="px-4 py-2 border border-gray-200 text-gray-700 hover:text-red rounded-xl text-xs font-accent font-bold uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto transition-colors"
        >
          <FiRefreshCw className={loadingConfig || loadingUsers ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* 2-Column: Form & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Configuration Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-gray-900">Coupon Parameters</h2>
            {/* Active Toggle */}
            <label className="flex items-center gap-2.5 cursor-pointer">
              <span className="text-xs font-accent uppercase text-gray-600 font-semibold">
                {config.isActive ? 'Coupon System Active' : 'Coupon System Disabled'}
              </span>
              <input
                type="checkbox"
                checked={config.isActive}
                onChange={(e) => setConfig({ ...config, isActive: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600 relative"></div>
            </label>
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-5">
            {/* Code Type & Coupon Code Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Coupon Code Type
                </label>
                <select
                  value={config.codeType}
                  onChange={(e) => setConfig({ ...config, codeType: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red focus:bg-white"
                >
                  <option value="fixed">Fixed Code (Same for all new users)</option>
                  <option value="unique">Unique Code (Generated per user)</option>
                </select>
              </div>

              {config.codeType === 'fixed' ? (
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Fixed Coupon Code
                  </label>
                  <input
                    type="text"
                    required
                    value={config.couponCode}
                    onChange={(e) => setConfig({ ...config, couponCode: e.target.value.toUpperCase() })}
                    placeholder="WELCOME1000"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono font-bold uppercase focus:outline-none focus:border-red focus:bg-white"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Unique Code Prefix
                  </label>
                  <input
                    type="text"
                    required
                    value={config.codePrefix}
                    onChange={(e) => setConfig({ ...config, codePrefix: e.target.value.toUpperCase() })}
                    placeholder="SPC"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono font-bold uppercase focus:outline-none focus:border-red focus:bg-white"
                  />
                </div>
              )}
            </div>

            {/* Discount Amount & Validity Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Installation Discount (₹)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 font-bold">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    required
                    value={config.discountAmount}
                    onChange={(e) => setConfig({ ...config, discountAmount: Number(e.target.value) })}
                    className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:border-red focus:bg-white"
                  />
                </div>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Amount deducted from final installation invoice.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Coupon Validity (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  required
                  value={config.validityDays}
                  onChange={(e) => setConfig({ ...config, validityDays: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-red focus:bg-white"
                />
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Voucher Title
              </label>
              <input
                type="text"
                required
                value={config.title}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Description / Benefit Explanation
              </label>
              <textarea
                rows="2"
                value={config.description}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red focus:bg-white"
              />
            </div>

            {/* Terms & Conditions */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Terms & Conditions (One per line)
              </label>
              <textarea
                rows="4"
                value={config.terms?.join('\n') || ''}
                onChange={(e) => setConfig({ ...config, terms: e.target.value.split('\n').filter(Boolean) })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:border-red focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={savingConfig}
              className="w-full py-3 bg-red hover:bg-red-dark text-white font-accent font-bold uppercase tracking-wider text-xs rounded-xl shadow-md shadow-red/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FiSave /> {savingConfig ? 'Saving Settings...' : 'Save Coupon Settings'}
            </button>
          </form>
        </div>

        {/* Right Column: Live Customer Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-xs font-accent uppercase text-gray-500 font-bold tracking-wider">
              Live Customer Preview
            </h3>
            
            {/* The Ticket Voucher Preview */}
            <div className="relative bg-gradient-to-br from-[#111827] via-[#0f172a] to-[#1e1b4b] text-white p-6 rounded-2xl border border-amber-500/30 shadow-xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex justify-between items-start">
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] uppercase font-accent font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <FiTag size={10} /> {config.title || 'Welcome Voucher'}
                </span>
                <span className="text-green-400 text-xs font-bold flex items-center gap-1">
                  <FiCheckCircle size={12} /> Active
                </span>
              </div>

              <div className="mt-4">
                <span className="text-3xl font-extrabold text-amber-400 font-heading">
                  ₹{Number(config.discountAmount || 0).toLocaleString()} OFF
                </span>
                <p className="text-xs text-white/70 mt-1">
                  {config.description || 'Deducted directly from your final solar installation bill.'}
                </p>
              </div>

              {/* Coupon Code Pill */}
              <div className="mt-5 p-3 bg-white/10 border border-dashed border-white/30 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-white/50 block font-accent uppercase">Your Coupon Code</span>
                  <span className="font-mono font-bold tracking-widest text-base text-white">
                    {config.codeType === 'fixed' ? config.couponCode : `${config.codePrefix}-1000-XXXX`}
                  </span>
                </div>
                <span className="text-xs font-accent text-amber-300 font-bold">
                  {config.validityDays} Days Valid
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-white/50">
                • Reduced from final turnkey rooftop installation invoice
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Issued Coupons Management Table */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Customers Issued Welcome Coupons ({issuedCoupons.length})
            </h2>
            <p className="text-sm text-gray-500">
              View customer codes and mark them as "Claimed" once installation deduction is applied.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search user or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-red"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-red"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Claimed">Claimed / Deducted</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Coupon Code</th>
                <th className="py-3.5 px-4">Discount</th>
                <th className="py-3.5 px-4">Issued On</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loadingUsers ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">
                    Loading customer coupons...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">
                    No customer coupons found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const status = u.coupon?.status || 'Active';
                  return (
                    <tr key={u._id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-900">{u.name}</div>
                        <div className="text-xs text-gray-400">{u.email} • {u.phone || 'No phone'}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-gray-900">
                        {u.coupon?.code}
                      </td>
                      <td className="py-3 px-4 font-bold text-green-600">
                        ₹{(u.coupon?.discountAmount || 1000).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-500">
                        {u.coupon?.issuedAt ? new Date(u.coupon.issuedAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${
                            status === 'Active'
                              ? 'bg-green-100 text-green-800'
                              : status === 'Claimed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {status === 'Claimed' ? 'Claimed (Deducted)' : status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        {status === 'Active' ? (
                          <button
                            onClick={() => handleUpdateStatus(u._id, 'Claimed')}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                          >
                            Mark as Claimed / Deducted
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(u._id, 'Active')}
                            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Reactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCouponsPage;
