import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { FaWhatsapp, FaEnvelope, FaFilePdf } from 'react-icons/fa';

const AdminQuotations = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/quotations');
      // Sort by newest first
      setQuotations(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      toast.error("Failed to fetch quotations");
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
      toast.success("Status updated");
      fetchQuotations(); // Refresh list
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'red';
      case 'Sent': return 'blue';
      case 'Followup': return 'orange';
      case 'Converted': return 'green';
      case 'Closed': return 'gray';
      default: return 'gray';
    }
  };

  const handleSendWhatsApp = async (quote) => {
    // Ideally calls the backend /send endpoint
    try {
      await api.post(`/quotations/${quote._id}/send`, { method: 'whatsapp' });
      toast.success("Sent via WhatsApp!");
      if (quote.status === 'New') {
        updateStatus(quote._id, 'Sent');
      }
    } catch (error) {
      toast.error("Failed to send");
    }
  };

  const handleSendEmail = async (quote) => {
    try {
      await api.post(`/quotations/${quote._id}/send`, { method: 'email' });
      toast.success("Sent via Email!");
      if (quote.status === 'New') {
        updateStatus(quote._id, 'Sent');
      }
    } catch (error) {
      toast.error("Failed to send");
    }
  };

  const openDetails = (quote) => {
    setSelectedQuote(quote);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-heading">Quotations Management</h2>
        <Button onClick={fetchQuotations} variant="outline" className="text-sm px-4 py-2">Refresh</Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-black text-white">
              <tr>
                <th className="py-4 px-4 font-accent text-sm tracking-wide uppercase">Date</th>
                <th className="py-4 px-4 font-accent text-sm tracking-wide uppercase">Customer</th>
                <th className="py-4 px-4 font-accent text-sm tracking-wide uppercase">Location</th>
                <th className="py-4 px-4 font-accent text-sm tracking-wide uppercase">System</th>
                <th className="py-4 px-4 font-accent text-sm tracking-wide uppercase">Status</th>
                <th className="py-4 px-4 font-accent text-sm tracking-wide uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-black divide-y divide-gray-light">
              {loading ? (
                <tr><td colSpan="6" className="py-8 text-center">Loading...</td></tr>
              ) : quotations.length === 0 ? (
                <tr><td colSpan="6" className="py-8 text-center text-gray">No quotations found</td></tr>
              ) : (
                quotations.map(q => (
                  <tr key={q._id} className="hover:bg-surface transition-colors">
                    <td className="py-4 px-4">{new Date(q.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-4">
                      <p className="font-semibold">{q.name}</p>
                      <p className="text-xs text-gray">{q.phone}</p>
                    </td>
                    <td className="py-4 px-4">{q.location}, {q.state}</td>
                    <td className="py-4 px-4">
                      <p className="font-bold">{q.recommendedKW} kW</p>
                      <p className="text-xs text-gray">₹{q.netCost.toLocaleString()}</p>
                    </td>
                    <td className="py-4 px-4">
                      <select 
                        value={q.status}
                        onChange={(e) => updateStatus(q._id, e.target.value)}
                        className={`text-xs font-bold px-2 py-1 rounded-sm border outline-none ${getStatusColor(q.status) === 'red' ? 'text-red border-red' : 'text-black border-gray-light'}`}
                      >
                        <option value="New">New</option>
                        <option value="Sent">Sent</option>
                        <option value="Followup">Follow-up</option>
                        <option value="Converted">Converted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 space-x-2 flex">
                      <button onClick={() => openDetails(q)} className="text-blue-600 hover:underline text-xs font-accent font-bold">VIEW</button>
                      <button onClick={() => handleSendWhatsApp(q)} className="text-green-600 hover:text-green-800" title="Send WhatsApp">
                        <FaWhatsapp size={18} />
                      </button>
                      <button onClick={() => handleSendEmail(q)} className="text-red hover:text-red-dark" title="Send Email">
                        <FaEnvelope size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Quotation Details">
        {selectedQuote && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray uppercase">Customer Info</p>
                <p className="font-bold">{selectedQuote.name}</p>
                <p>{selectedQuote.phone}</p>
                <p>{selectedQuote.email}</p>
                <p>{selectedQuote.location}, {selectedQuote.state}</p>
              </div>
              <div>
                <p className="text-xs text-gray uppercase">Input Data</p>
                <p>Bill: ₹{selectedQuote.monthlyBill}/mo</p>
                <p>Type: {selectedQuote.connectionType}</p>
                <p>Phase: {selectedQuote.phase}</p>
              </div>
            </div>
            
            <div className="bg-surface p-4 rounded-sm border border-gray-light">
              <p className="text-xs text-gray uppercase mb-2">Calculated Results</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p>System Size:</p><p className="font-bold text-red">{selectedQuote.recommendedKW} kW</p>
                <p>Gross Cost:</p><p>₹{selectedQuote.estimatedCost.toLocaleString()}</p>
                <p>Subsidy:</p><p className="text-green-600">₹{selectedQuote.centralSubsidy.toLocaleString()}</p>
                <p>Net Cost:</p><p className="font-bold text-xl">₹{selectedQuote.netCost.toLocaleString()}</p>
                <p>ROI:</p><p>{selectedQuote.roiYears} Years</p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setIsModalOpen(false)} variant="outline">Close</Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default AdminQuotations;
