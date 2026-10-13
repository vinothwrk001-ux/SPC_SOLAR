import React, { useState, useEffect, useMemo } from 'react';
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
  FiPlus,
  FiX,
  FiAlertTriangle,
  FiFileText,
  FiUsers
} from 'react-icons/fi';
import { FaWhatsapp, FaFileExcel } from 'react-icons/fa';
import { exportLeadsToExcel } from '../../utils/excelExporter';

const STATUS_OPTIONS = ['ALL', 'NEW', 'CONTACTED', 'IN_DISCUSSION', 'CONVERTED', 'LOST'];

const AdminLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Notes Modal State
  const [selectedLead, setSelectedLead] = useState(null);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [notesInput, setNotesInput] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  // Create Lead Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    monthlyBill: '',
    systemSize: '',
    notes: '',
    status: 'NEW',
  });
  const [creatingLead, setCreatingLead] = useState(false);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);

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
      toast.error('Failed to fetch customer leads');
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
      toast.success(`Lead moved to ${newStatus}`);
      setLeads((prev) =>
        prev.map((l) => (l._id === id ? { ...l, status: newStatus } : l))
      );
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleOpenNotes = (lead) => {
    setSelectedLead(lead);
    setNotesInput(lead.notes || '');
    setIsNotesModalOpen(true);
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
      setIsNotesModalOpen(false);
    } catch (error) {
      toast.error('Failed to save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    if (!createForm.name.trim() || !createForm.phone.trim()) {
      toast.error('Please enter customer name and phone');
      return;
    }

    try {
      setCreatingLead(true);
      const { data } = await api.post('/leads', createForm);
      toast.success('Lead created successfully!');
      setIsCreateModalOpen(false);
      setCreateForm({
        name: '',
        phone: '',
        email: '',
        city: '',
        monthlyBill: '',
        systemSize: '',
        notes: '',
        status: 'NEW',
      });
      fetchLeads();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create lead');
    } finally {
      setCreatingLead(false);
    }
  };

  const handlePromptDelete = (lead) => {
    setLeadToDelete(lead);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!leadToDelete) return;
    try {
      setDeleting(true);
      await api.delete(`/leads/${leadToDelete._id}`);
      toast.success('Lead removed successfully');
      setLeads((prev) => prev.filter((l) => l._id !== leadToDelete._id));
      setDeleteModalOpen(false);
      setLeadToDelete(null);
    } catch (error) {
      toast.error('Failed to delete lead');
    } finally {
      setDeleting(false);
    }
  };

  const openWhatsApp = (lead) => {
    const cleanPhone = (lead.phone || '').replace(/\D/g, '');
    const phoneWithCode = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const message = `Hello ${lead.name || 'there'}! 👋\n\nGreetings from *SPC Solar*! ☀️\n\nWe received your inquiry regarding solar rooftop installation. When is a good time for a brief call to evaluate your site and provide a free design estimate?`;
    window.open(`https://wa.me/${phoneWithCode}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchSearch =
        (lead.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.phone || '').includes(searchTerm) ||
        (lead.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.notes || '').toLowerCase().includes(searchTerm.toLowerCase());

      const leadStatus = (lead.status || '').toUpperCase().replace(/[\s-]/g, '_');
      const filterStatusNorm = statusFilter.toUpperCase().replace(/[\s-]/g, '_');
      const matchStatus = statusFilter === 'ALL' || leadStatus === filterStatusNorm;
      return matchSearch && matchStatus;
    });
  }, [leads, searchTerm, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((l) => (l.status || '').toUpperCase() === 'NEW').length;
    const inDiscussion = leads.filter((l) => {
      const s = (l.status || '').toUpperCase().replace(/[\s-]/g, '_');
      return s === 'IN_DISCUSSION' || s === 'CONTACTED';
    }).length;
    const converted = leads.filter((l) => (l.status || '').toUpperCase() === 'CONVERTED').length;
    const lost = leads.filter((l) => {
      const s = (l.status || '').toUpperCase();
      return s === 'LOST' || s === 'CLOSED';
    }).length;
    return { total, newCount, inDiscussion, converted, lost };
  }, [leads]);

  const getStatusBadgeClass = (status) => {
    const s = (status || '').toUpperCase().replace(/[\s-]/g, '_');
    switch (s) {
      case 'NEW':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CONTACTED':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'IN_DISCUSSION':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'QUOTED':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'FOLLOW_UP':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'CONVERTED':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'CLOSED':
      case 'LOST':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const handleExportExcel = async () => {
    const listToExport = filteredLeads.length > 0 ? filteredLeads : leads;
    if (listToExport.length === 0) {
      toast.error('No leads available to export');
      return;
    }

    try {
      setExporting(true);
      toast.loading('Generating Excel report...', { id: 'excel-export' });
      await exportLeadsToExcel(listToExport, statusFilter);
      toast.success(`Exported ${listToExport.length} leads to Excel!`, { id: 'excel-export' });
    } catch (error) {
      console.error('Failed to export leads to Excel:', error);
      toast.error(error.message || 'Failed to export Excel file', { id: 'excel-export' });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red animate-pulse" />
            <span className="font-accent text-xs font-bold uppercase tracking-wider text-red">Customer Leads & CRM Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading text-black font-bold tracking-tight">
            Customer Leads Module
          </h1>
          <p className="text-sm text-gray-500 font-body mt-1">
            Track quotation requests, contact phone numbers, follow-up notes, and pipeline conversion stages.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto flex-wrap">
          <Button
            variant="outline"
            onClick={fetchLeads}
            className="flex items-center gap-2 text-xs font-accent uppercase tracking-wider px-3 py-2.5"
            title="Refresh list"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} size={15} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <button
            type="button"
            onClick={handleExportExcel}
            disabled={exporting || leads.length === 0}
            className="flex items-center gap-2 text-xs font-accent font-bold uppercase tracking-wider px-3.5 py-2.5 bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 rounded-btn transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            title="Export customer leads to formatted Excel spreadsheet"
          >
            {exporting ? (
              <FiRefreshCw className="animate-spin text-emerald-700" size={15} />
            ) : (
              <FaFileExcel className="text-emerald-700" size={15} />
            )}
            <span>Export as Excel</span>
          </button>

          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 text-xs font-accent uppercase tracking-wider px-4 py-2.5 shadow-md hover:shadow-lg"
          >
            <FiPlus size={16} />
            <span>Add Lead</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-accent uppercase tracking-wider text-gray-500 font-bold">Total Inquiries</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-heading font-bold text-black">{stats.total}</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-semibold">All</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-accent uppercase tracking-wider text-blue-600 font-bold">New Leads</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-heading font-bold text-blue-700">{stats.newCount}</span>
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-semibold">Fresh</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-accent uppercase tracking-wider text-amber-600 font-bold">In Discussion</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-heading font-bold text-amber-700">{stats.inDiscussion}</span>
            <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md font-semibold">Warm</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-accent uppercase tracking-wider text-green-600 font-bold">Converted</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-heading font-bold text-green-700">{stats.converted}</span>
            <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-md font-semibold">Closed</span>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-accent uppercase tracking-wider text-gray-400 font-bold">Lost / Inactive</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-heading font-bold text-gray-500">{stats.lost}</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-semibold">Closed</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Search and Status Filter */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
            <input
              type="text"
              placeholder="Search by customer name, phone number, city, or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-black transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              >
                <FiX size={15} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-accent font-semibold uppercase tracking-wider bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-black"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'ALL' ? 'All Pipeline Stages' : opt.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-gray-100">
          <span className="text-[11px] font-accent uppercase tracking-wider text-gray-400 font-bold mr-1">Stage:</span>
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-full text-xs font-accent font-semibold tracking-wider transition-all ${
                statusFilter === status
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status === 'ALL' ? 'All' : status.replace('_', ' ')}
            </button>
          ))}
          {filteredLeads.length !== leads.length && (
            <span className="text-xs text-gray-400 font-body ml-auto">
              Showing {filteredLeads.length} of {leads.length}
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
          <p className="text-sm font-accent uppercase tracking-wider text-gray-500">Loading leads pipeline...</p>
        </Card>
      ) : filteredLeads.length === 0 ? (
        <Card className="p-12 text-center bg-white border border-gray-200 rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center mb-4">
            <FiUsers size={28} />
          </div>
          <h3 className="font-heading text-lg text-black mb-1">No Leads Found</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-5 font-body">
            No inquiries match your current search and stage filters.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('ALL');
            }}
            className="text-xs font-accent uppercase tracking-wider"
          >
            Reset Filters
          </Button>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden bg-white border border-gray-200/90 shadow-sm rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/90 text-gray-600 border-b border-gray-200 text-xs font-accent font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-12 text-center">User</th>
                  <th className="py-3.5 px-4">Contact & Location</th>
                  <th className="py-3.5 px-4">Requirement / Bill</th>
                  <th className="py-3.5 px-4">Pipeline Status</th>
                  <th className="py-3.5 px-4">Notes</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-black divide-y divide-gray-100">
                {filteredLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50/70 transition-colors group">
                    {/* User Avatar */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="w-9 h-9 rounded-full bg-red text-white flex items-center justify-center font-heading font-bold text-xs uppercase shadow-sm mx-auto">
                        {(lead.name || 'L').slice(0, 2)}
                      </div>
                    </td>

                    {/* Contact & Location */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-heading font-bold text-black text-sm group-hover:text-red transition-colors">
                        {lead.name}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-600 font-body">
                        <span className="font-semibold text-gray-800">{lead.phone}</span>
                        {lead.city && (
                          <span className="flex items-center gap-0.5 text-gray-500">
                            <FiMapPin size={11} className="text-gray-400" />
                            {lead.city}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Requirement / Bill */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs font-body">
                      {lead.systemSize && (
                        <div className="font-bold text-black font-accent">
                          {lead.systemSize}
                        </div>
                      )}
                      {lead.monthlyBill && (
                        <div className="text-gray-500">
                          Bill: ₹{lead.monthlyBill}/mo
                        </div>
                      )}
                      {!lead.systemSize && !lead.monthlyBill && (
                        <span className="text-gray-400">Rooftop Inquiry</span>
                      )}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <select
                        value={(lead.status || 'NEW').toUpperCase().replace(/[\s-]/g, '_')}
                        onChange={(e) => updateStatus(lead._id, e.target.value)}
                        className={`text-xs font-accent font-bold uppercase rounded-full px-2.5 py-1 border outline-none cursor-pointer ${getStatusBadgeClass(lead.status)}`}
                      >
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="IN_DISCUSSION">In Discussion</option>
                        <option value="CONVERTED">Converted</option>
                        <option value="LOST">Lost</option>
                      </select>
                    </td>

                    {/* Notes preview */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <button
                        onClick={() => handleOpenNotes(lead)}
                        className="text-left w-full hover:bg-gray-100 p-1.5 rounded-lg transition-colors group/note"
                      >
                        {lead.notes ? (
                          <p className="text-xs text-gray-700 font-body line-clamp-1">
                            {lead.notes}
                          </p>
                        ) : (
                          <span className="text-xs text-gray-400 italic flex items-center gap-1">
                            <FiEdit3 size={11} /> Add notes...
                          </span>
                        )}
                      </button>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-xs text-gray-500 font-body whitespace-nowrap">
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Recent'}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openWhatsApp(lead)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-200"
                          title="Message on WhatsApp"
                        >
                          <FaWhatsapp size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenNotes(lead)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                          title="Edit Notes"
                        >
                          <FiEdit3 size={15} />
                        </button>
                        <button
                          onClick={() => handlePromptDelete(lead)}
                          className="p-1.5 text-red hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                          title="Delete Lead"
                        >
                          <FiTrash2 size={15} />
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

      {/* NOTES MODAL */}
      <Modal
        isOpen={isNotesModalOpen}
        onClose={() => !savingNotes && setIsNotesModalOpen(false)}
        title={`Follow-up Notes: ${selectedLead?.name || ''}`}
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs text-gray-600 flex justify-between">
            <span><strong>Phone:</strong> {selectedLead?.phone}</span>
            <span><strong>Location:</strong> {selectedLead?.city || 'N/A'}</span>
            <span><strong>Status:</strong> {selectedLead?.status}</span>
          </div>

          <div>
            <label className="block mb-1.5 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
              Interaction Log / Requirement Details
            </label>
            <textarea
              rows={5}
              placeholder="Record call discussions, roof size, budget expectations, follow-up dates..."
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-btn focus:outline-none focus:border-black resize-y font-body"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsNotesModalOpen(false)}
              disabled={savingNotes}
              className="text-xs font-accent uppercase tracking-wider px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSaveNotes}
              disabled={savingNotes}
              className="text-xs font-accent uppercase tracking-wider px-5 py-2"
            >
              {savingNotes ? 'Saving...' : 'Save Notes'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* CREATE LEAD MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => !creatingLead && setIsCreateModalOpen(false)}
        title="Create New Customer Inquiry"
        size="md"
      >
        <form onSubmit={handleCreateLead} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block mb-1 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
                Customer Name <span className="text-red">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Anand Joshi"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-btn focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block mb-1 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
                Phone Number <span className="text-red">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 9876543210"
                value={createForm.phone}
                onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-btn focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block mb-1 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="customer@gmail.com"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-btn focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block mb-1 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
                City / Location
              </label>
              <input
                type="text"
                placeholder="e.g. Pune, MH"
                value={createForm.city}
                onChange={(e) => setCreateForm({ ...createForm, city: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-btn focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block mb-1 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
                Current Monthly Bill (₹)
              </label>
              <input
                type="text"
                placeholder="e.g. 6500"
                value={createForm.monthlyBill}
                onChange={(e) => setCreateForm({ ...createForm, monthlyBill: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-btn focus:outline-none focus:border-black"
              />
            </div>

            <div className="col-span-2">
              <label className="block mb-1 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
                Requirement Details / Notes
              </label>
              <textarea
                rows={3}
                placeholder="Inquiry notes..."
                value={createForm.notes}
                onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-btn focus:outline-none focus:border-black resize-y font-body"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
              disabled={creatingLead}
              className="text-xs font-accent uppercase tracking-wider px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={creatingLead}
              className="text-xs font-accent uppercase tracking-wider px-5 py-2"
            >
              {creatingLead ? 'Creating...' : 'Create Lead'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE MODAL */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => !deleting && setDeleteModalOpen(false)}
        title="Confirm Removal"
        size="sm"
      >
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red mx-auto flex items-center justify-center">
            <FiAlertTriangle size={24} />
          </div>
          <div className="text-center">
            <h4 className="font-heading font-bold text-base text-black mb-1">
              Delete this lead?
            </h4>
            <p className="text-xs text-gray-600 font-body leading-relaxed">
              Are you sure you want to permanently delete lead for{' '}
              <strong className="text-black font-semibold">"{leadToDelete?.name}"</strong>?
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-3 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleting}
              className="text-xs font-accent uppercase tracking-wider px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="text-xs font-accent uppercase tracking-wider px-5 py-2 bg-red hover:bg-red-700 flex items-center gap-1.5"
            >
              {deleting ? 'Deleting...' : 'Yes, Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminLeads;
