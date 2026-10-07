import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { 
  FiPhone, 
  FiMessageSquare, 
  FiMapPin, 
  FiCalendar, 
  FiTrash2, 
  FiEdit3, 
  FiRefreshCw, 
  FiSearch, 
  FiCheckCircle, 
  FiClock,
  FiUserCheck,
  FiGift,
  FiFileText
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const AdminLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notesInput, setNotesInput] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/leads');
      if (data.success && data.leads) {
        setLeads(data.leads);
      } else if (Array.isArray(data)) {
        setLeads(data);
      }
    } catch (error) {
      toast.error('Failed to fetch leads from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/leads/${id}`, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      setLeads((prev) =>
        prev.map((l) => (l._id === id ? { ...l, status: newStatus } : l))
      );
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    setSavingNotes(true);
    try {
      await api.put(`/leads/${selectedLead._id}`, { notes: notesInput });
      toast.success('Notes saved successfully');
      setLeads((prev) =>
        prev.map((l) => (l._id === selectedLead._id ? { ...l, notes: notesInput } : l))
      );
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await api.delete(`/leads/${id}`);
      toast.success('Lead removed');
      setLeads((prev) => prev.filter((l) => l._id !== id));
    } catch (error) {
      toast.error('Failed to delete lead');
    }
  };

  const openWhatsApp = (lead) => {
    const cleanPhone = lead.phone.replace(/\D/g, '');
    const phoneWithCode = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const message = `Hello ${lead.name || 'there'}! 👋\n\nGreetings from *SPC Solar*! ☀️\n\nWe received your request for a solar quotation (with up to *₹1,000 offer* applied).\n\nWhen would be a convenient time for a quick 5-minute call to discuss your energy requirements and site details?`;
    window.open(`https://wa.me/${phoneWithCode}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const openNotesModal = (lead) => {
    setSelectedLead(lead);
    setNotesInput(lead.notes || '');
    setIsModalOpen(true);
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'New':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'Contacted':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Follow-up':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'Converted':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Closed':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      (lead.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.phone || '').includes(searchTerm) ||
      (lead.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.state || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === 'New').length,
    contacted: leads.filter((l) => l.status === 'Contacted').length,
    converted: leads.filter((l) => l.status === 'Converted').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 flex items-center gap-2">
            <FiGift className="text-red-500" /> Customer Leads
          </h2>
          <p className="text-sm text-gray-500 font-body">
            Inquiries captured from the website quotation modal with ₹1,000 offer
          </p>
        </div>
        <Button onClick={fetchLeads} variant="outline" className="flex items-center gap-2 text-sm">
          <FiRefreshCw className={loading ? 'animate-spin' : ''} /> Refresh Leads
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase">
            <span>Total Leads</span>
            <FiMessageSquare className="text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-2">{stats.total}</div>
        </div>

        <div className="bg-red-50 p-4 rounded-xl border border-red-200 shadow-sm">
          <div className="flex items-center justify-between text-red-600 text-xs font-semibold uppercase">
            <span>New Inquiries</span>
            <FiClock className="text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-600 mt-2">{stats.new}</div>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between text-blue-600 text-xs font-semibold uppercase">
            <span>Contacted</span>
            <FiPhone className="text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600 mt-2">{stats.contacted}</div>
        </div>

        <div className="bg-green-50 p-4 rounded-xl border border-green-200 shadow-sm">
          <div className="flex items-center justify-between text-green-600 text-xs font-semibold uppercase">
            <span>Converted</span>
            <FiUserCheck className="text-green-500" />
          </div>
          <div className="text-2xl font-bold text-green-600 mt-2">{stats.converted}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone, city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {['ALL', 'New', 'Contacted', 'Follow-up', 'Converted', 'Closed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  statusFilter === status
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Leads Table */}
      <Card className="p-0 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-900 text-white text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Phone & Direct Contact</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Quotation Maker</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Notes</th>
                <th className="py-3.5 px-4 text-center">Delete</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <FiRefreshCw className="animate-spin text-red-500" /> Loading leads...
                    </div>
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-500">
                    No leads found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                    {/* Date */}
                    <td className="py-4 px-4 whitespace-nowrap text-gray-600 text-xs">
                      <div className="flex items-center gap-1.5">
                        <FiCalendar className="text-gray-400" />
                        {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-[11px] text-gray-400 pl-4">
                        {new Date(lead.createdAt).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>

                    {/* Customer Info */}
                    <td className="py-4 px-4 font-semibold text-gray-900">
                      <div>{lead.name || 'Anonymous User'}</div>
                      <div className="text-xs text-red-600 font-normal mt-0.5">
                        {lead.source || '₹1,000 Offer Lead'}
                      </div>
                    </td>

                    {/* Phone & Contact Buttons */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-gray-800 text-sm tracking-wide">
                        {lead.phone}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        {/* Direct Call */}
                        <a
                          href={`tel:${lead.phone}`}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md font-semibold transition-colors border border-gray-300"
                          title="Call Customer"
                        >
                          <FiPhone size={12} className="text-blue-600" /> Call
                        </a>

                        {/* WhatsApp Direct */}
                        <button
                          onClick={() => openWhatsApp(lead)}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md font-semibold transition-colors shadow-sm"
                          title="Message on WhatsApp"
                        >
                          <FaWhatsapp size={13} /> WhatsApp
                        </button>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-4 text-gray-700 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-xs font-medium">
                        <FiMapPin className="text-red-500 flex-shrink-0" />
                        <span>{lead.city || '—'}, {lead.state || '—'}</span>
                      </div>
                    </td>

                    {/* Quotation Maker Action */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <a
                        href={`/admin/quotation-maker?leadId=${lead._id}&name=${encodeURIComponent(lead.name || '')}&phone=${encodeURIComponent(lead.phone || '')}&city=${encodeURIComponent(lead.city || '')}&state=${encodeURIComponent(lead.state || '')}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 rounded-lg text-xs font-bold transition-all shadow-sm group"
                        title="Create / Edit & Download Quotation for this client"
                      >
                        <FiFileText size={13} className="text-red-600 group-hover:text-white" />
                        <span>Create / Edit Quotation</span>
                      </a>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-4 px-4">
                      <select
                        value={lead.status || 'New'}
                        onChange={(e) => updateStatus(lead._id, e.target.value)}
                        className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border outline-none cursor-pointer transition-colors ${getStatusBadgeColor(
                          lead.status
                        )}`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Follow-up">Follow-up</option>
                        <option value="Converted">Converted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>

                    {/* Notes */}
                    <td className="py-4 px-4">
                      {lead.notes ? (
                        <div 
                          onClick={() => openNotesModal(lead)}
                          className="max-w-[180px] truncate text-xs text-gray-600 cursor-pointer hover:text-black bg-gray-50 p-1.5 rounded border border-gray-200"
                          title={lead.notes}
                        >
                          {lead.notes}
                        </div>
                      ) : (
                        <button
                          onClick={() => openNotesModal(lead)}
                          className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 underline"
                        >
                          <FiEdit3 size={12} /> Add Note
                        </button>
                      )}
                    </td>

                    {/* Delete */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleDelete(lead._id)}
                        className="text-gray-400 hover:text-red-600 p-1 rounded-md transition-colors"
                        title="Delete Lead"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Notes Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Lead Notes: ${selectedLead?.name || 'Customer'}`}
      >
        {selectedLead && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs text-gray-600 grid grid-cols-2 gap-2">
              <div>
                <span className="font-semibold text-gray-800">Phone:</span> {selectedLead.phone}
              </div>
              <div>
                <span className="font-semibold text-gray-800">City:</span> {selectedLead.city}, {selectedLead.state}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Admin Notes & Call Summary:
              </label>
              <textarea
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="Write notes about quotation discussion, site details, customer requirements..."
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveNotes} disabled={savingNotes}>
                {savingNotes ? 'Saving...' : 'Save Notes'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminLeads;
