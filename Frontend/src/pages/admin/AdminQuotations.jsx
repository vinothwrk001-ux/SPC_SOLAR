import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { 
  FiFileText, 
  FiRefreshCw, 
  FiSearch, 
  FiPlus, 
  FiMapPin, 
  FiEye, 
  FiCheckCircle, 
  FiClock, 
  FiDollarSign, 
  FiX,
  FiMail,
  FiZap
} from 'react-icons/fi';
import { FaWhatsapp, FaEnvelope } from 'react-icons/fa';

const STATUS_OPTIONS = ['ALL', 'New', 'Sent', 'Followup', 'Converted', 'Closed'];

const AdminQuotations = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const [selectedQuote, setSelectedQuote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/quotations');
      const list = Array.isArray(data) ? data : [];
      setQuotations(list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      toast.error('Failed to fetch quotations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/quotations/${id}/status`, { status });
      toast.success(`Quotation marked as ${status}`);
      setQuotations((prev) =>
        prev.map((q) => (q._id === id ? { ...q, status } : q))
      );
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleSendWhatsApp = async (quote) => {
    try {
      await api.post(`/quotations/${quote._id}/send`, { method: 'whatsapp' });
      toast.success('Sent via WhatsApp!');
      if (quote.status === 'New') {
        updateStatus(quote._id, 'Sent');
      }
    } catch (error) {
      // Fallback direct WhatsApp web
      const cleanPhone = (quote.customerPhone || '').replace(/\D/g, '');
      const phoneWithCode = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
      const msg = `Hello ${quote.customerName || 'there'}! Here is your custom solar proposal from SPC Solar for ${quote.systemCapacity || 'your installation'}. Estimated Cost: ₹${(quote.finalPayable || quote.totalAmount || 0).toLocaleString('en-IN')}. Please reply if you have questions!`;
      window.open(`https://wa.me/${phoneWithCode}?text=${encodeURIComponent(msg)}`, '_blank');
    }
  };

  const handleSendEmail = async (quote) => {
    try {
      await api.post(`/quotations/${quote._id}/send`, { method: 'email' });
      toast.success('Sent via Email!');
      if (quote.status === 'New') {
        updateStatus(quote._id, 'Sent');
      }
    } catch (error) {
      toast.error('Failed to send email');
    }
  };

  const openDetails = (quote) => {
    setSelectedQuote(quote);
    setIsModalOpen(true);
  };

  // Filtered Quotations
  const filteredQuotations = useMemo(() => {
    return quotations.filter((q) => {
      const nameMatch = (q.customerName || '').toLowerCase().includes(searchQuery.toLowerCase());
      const phoneMatch = (q.customerPhone || '').includes(searchQuery);
      const locMatch = (q.customerCity || q.customerAddress || '').toLowerCase().includes(searchQuery.toLowerCase());
      const idMatch = (q.quotationNumber || q._id || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSearch = nameMatch || phoneMatch || locMatch || idMatch;

      const matchesStatus = selectedStatus === 'ALL' || q.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [quotations, searchQuery, selectedStatus]);

  // Statistics
  const stats = useMemo(() => {
    const total = quotations.length;
    const newQuotes = quotations.filter((q) => q.status === 'New').length;
    const sent = quotations.filter((q) => q.status === 'Sent').length;
    const followup = quotations.filter((q) => q.status === 'Followup').length;
    const converted = quotations.filter((q) => q.status === 'Converted').length;
    return { total, newQuotes, sent, followup, converted };
  }, [quotations]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Sent':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Followup':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Converted':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Closed':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red animate-pulse" />
            <span className="font-accent text-xs font-bold uppercase tracking-wider text-red">Quotation Pipeline & Estimates</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading text-black font-bold tracking-tight">
            Quotations Module
          </h1>
          <p className="text-sm text-gray-500 font-body mt-1">
            Review generated solar proposals, equipment specifications, pricing estimates, and customer dispatches.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <Button
            variant="outline"
            onClick={fetchQuotations}
            className="flex items-center gap-2 text-xs font-accent uppercase tracking-wider px-3 py-2.5"
            title="Refresh list"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} size={15} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Link to="/admin/quotation-maker">
            <Button
              variant="primary"
              className="flex items-center gap-2 text-xs font-accent uppercase tracking-wider px-4 py-2.5 shadow-md hover:shadow-lg"
            >
              <FiPlus size={16} />
              <span>Generate Quote</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-accent uppercase tracking-wider text-gray-500 font-bold">Total Quotes</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-heading font-bold text-black">{stats.total}</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-semibold">All</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-accent uppercase tracking-wider text-blue-600 font-bold">New Quotes</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-heading font-bold text-blue-700">{stats.newQuotes}</span>
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-semibold">Draft</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-accent uppercase tracking-wider text-purple-600 font-bold">Sent to Client</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-heading font-bold text-purple-700">{stats.sent}</span>
            <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md font-semibold">Delivered</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-accent uppercase tracking-wider text-amber-600 font-bold">In Follow-Up</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-heading font-bold text-amber-700">{stats.followup}</span>
            <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md font-semibold">Active</span>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-accent uppercase tracking-wider text-green-600 font-bold">Converted</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-heading font-bold text-green-700">{stats.converted}</span>
            <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-md font-semibold">Won</span>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
            <input
              type="text"
              placeholder="Search by customer name, phone number, location, quote ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-black transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              >
                <FiX size={15} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs font-accent font-semibold uppercase tracking-wider bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-black"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'ALL' ? 'All Statuses' : opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-gray-100">
          <span className="text-[11px] font-accent uppercase tracking-wider text-gray-400 font-bold mr-1">Status:</span>
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1 rounded-full text-xs font-accent font-semibold tracking-wider transition-all ${
                selectedStatus === status
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
          {filteredQuotations.length !== quotations.length && (
            <span className="text-xs text-gray-400 font-body ml-auto">
              Showing {filteredQuotations.length} of {quotations.length}
            </span>
          )}
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <Card className="p-12 text-center bg-white border border-gray-200">
          <div className="inline-block animate-spin text-red mb-3">
            <FiRefreshCw size={28} />
          </div>
          <p className="text-sm font-accent uppercase tracking-wider text-gray-500">Loading quotations...</p>
        </Card>
      ) : filteredQuotations.length === 0 ? (
        <Card className="p-12 text-center bg-white border border-gray-200 rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center mb-4">
            <FiFileText size={28} />
          </div>
          <h3 className="font-heading text-lg text-black mb-1">No Quotations Found</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-5 font-body">
            No proposal records match your search query.
          </p>
          <Link to="/admin/quotation-maker">
            <Button
              variant="primary"
              className="text-xs font-accent uppercase tracking-wider inline-flex items-center gap-1.5"
            >
              <FiPlus size={15} /> Generate New Quote
            </Button>
          </Link>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden bg-white border border-gray-200/90 shadow-sm rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/90 text-gray-600 border-b border-gray-200 text-xs font-accent font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-12 text-center">Type</th>
                  <th className="py-3.5 px-4">Date & Ref</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">System Specs</th>
                  <th className="py-3.5 px-4">Payable Amount</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Dispatch & Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-black divide-y divide-gray-100">
                {filteredQuotations.map((q) => (
                  <tr key={q._id} className="hover:bg-gray-50/70 transition-colors group">
                    <td className="py-3.5 px-4 text-center">
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-red flex items-center justify-center mx-auto">
                        <FiFileText size={15} />
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono text-xs font-bold text-gray-900">
                        {q.quotationNumber || `#${q._id.slice(-6).toUpperCase()}`}
                      </div>
                      <div className="text-[11px] text-gray-500 font-body">
                        {q.createdAt ? new Date(q.createdAt).toLocaleDateString() : 'Recent'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-heading font-bold text-black text-sm group-hover:text-red transition-colors">
                        {q.customerName || 'Customer'}
                      </div>
                      <div className="text-xs text-gray-500 font-body">
                        {q.customerPhone || q.customerEmail || '—'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-gray-600 font-body">
                      <div className="flex items-center gap-1">
                        <FiMapPin size={12} className="text-gray-400" />
                        <span>{q.customerCity || q.customerAddress || 'India'}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-xs">
                      <div className="font-bold text-black font-accent">
                        {q.systemCapacity || q.systemSize || 'Custom'}
                      </div>
                      <div className="text-gray-500">
                        {q.panelBrand || q.panelModel || 'Tier-1 Solar'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-accent font-bold text-red text-sm">
                      ₹{(q.finalPayable || q.totalAmount || 0).toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <select
                        value={q.status || 'New'}
                        onChange={(e) => updateStatus(q._id, e.target.value)}
                        className={`text-xs font-accent font-bold uppercase rounded-full px-2.5 py-1 border outline-none cursor-pointer ${getStatusBadge(q.status)}`}
                      >
                        <option value="New">New</option>
                        <option value="Sent">Sent</option>
                        <option value="Followup">Followup</option>
                        <option value="Converted">Converted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleSendWhatsApp(q)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-200"
                          title="Send via WhatsApp"
                        >
                          <FaWhatsapp size={16} />
                        </button>
                        <button
                          onClick={() => handleSendEmail(q)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                          title="Send via Email"
                        >
                          <FaEnvelope size={15} />
                        </button>
                        <button
                          onClick={() => openDetails(q)}
                          className="p-1.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                          title="View Details"
                        >
                          <FiEye size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* QUOTATION DETAILS MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Quotation Summary"
        size="lg"
      >
        {selectedQuote && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-gray-400 block font-accent uppercase">Reference</span>
                <span className="font-bold text-black font-mono">
                  {selectedQuote.quotationNumber || selectedQuote._id}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block font-accent uppercase">Customer</span>
                <span className="font-bold text-black">{selectedQuote.customerName}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-accent uppercase">Phone</span>
                <span className="font-bold text-black">{selectedQuote.customerPhone}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-accent uppercase">Status</span>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusBadge(selectedQuote.status)}`}>
                  {selectedQuote.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-body">
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-1.5">
                <h4 className="font-heading font-bold text-black text-sm mb-2">Technical Specs</h4>
                <div className="flex justify-between">
                  <span className="text-gray-500">System Capacity:</span>
                  <span className="font-bold text-black">{selectedQuote.systemCapacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Panel Brand:</span>
                  <span className="font-semibold text-black">{selectedQuote.panelBrand || 'Tier-1 Mono PERC'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Inverter Model:</span>
                  <span className="font-semibold text-black">{selectedQuote.inverterModel || 'High Efficiency String'}</span>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-1.5">
                <h4 className="font-heading font-bold text-black text-sm mb-2">Financial Breakdown</h4>
                <div className="flex justify-between">
                  <span className="text-gray-500">Base System Cost:</span>
                  <span className="font-semibold text-black">₹{(selectedQuote.totalAmount || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Govt. Subsidy:</span>
                  <span className="font-semibold text-green-600">- ₹{(selectedQuote.subsidyAmount || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100 font-bold text-sm">
                  <span>Net Payable:</span>
                  <span className="text-red">₹{(selectedQuote.finalPayable || selectedQuote.totalAmount || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="text-xs font-accent uppercase tracking-wider px-4 py-2"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminQuotations;
