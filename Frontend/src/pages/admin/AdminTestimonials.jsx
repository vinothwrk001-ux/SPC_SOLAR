import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';
import { 
  FiStar, 
  FiCheckCircle, 
  FiXCircle, 
  FiTrash2, 
  FiPlus, 
  FiMessageSquare,
  FiUser,
  FiMapPin,
  FiClock
} from 'react-icons/fi';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    location: 'Homeowner, Delhi',
    systemSize: '5 kW System',
    rating: 5,
    review: '',
    status: 'Approved'
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/testimonials/admin/all');
      setTestimonials(data);
    } catch (error) {
      toast.error('Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.put(`/testimonials/admin/${id}/status`, { status: newStatus });
      toast.success(`Review ${newStatus === 'Approved' ? 'Approved & Published' : newStatus}!`);
      fetchTestimonials();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial record?')) return;
    try {
      await api.delete(`/testimonials/admin/${id}`);
      toast.success('Testimonial deleted');
      fetchTestimonials();
    } catch (error) {
      toast.error('Failed to delete testimonial');
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.review) {
      toast.error('Please enter name and review content');
      return;
    }

    try {
      await api.post('/testimonials/admin', form);
      toast.success('Testimonial created!');
      setIsModalOpen(false);
      setForm({ name: '', location: 'Homeowner, Delhi', systemSize: '5 kW System', rating: 5, review: '', status: 'Approved' });
      fetchTestimonials();
    } catch (error) {
      toast.error('Failed to create testimonial');
    }
  };

  const pendingCount = testimonials.filter(t => t.status === 'Pending').length;

  const filteredTestimonials = testimonials.filter(t => {
    if (activeFilter === 'Pending') return t.status === 'Pending';
    if (activeFilter === 'Approved') return t.status === 'Approved';
    if (activeFilter === 'Rejected') return t.status === 'Rejected';
    return true;
  });

  if (loading) {
    return <div className="p-8 text-center text-gray font-accent">Loading Testimonials & Customer Reviews...</div>;
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-light pb-6">
        <div>
          <h1 className="text-3xl font-heading text-black flex items-center gap-2">
            <FiMessageSquare className="text-red" /> TESTIMONIALS & CUSTOMER REVIEWS
          </h1>
          <p className="text-gray text-sm mt-1">
            Moderate customer-submitted reviews and manage featured client testimonials on your website.
          </p>
        </div>

        <Button 
          variant="primary" 
          onClick={() => setIsModalOpen(true)} 
          className="flex items-center space-x-2 bg-red hover:bg-black text-white"
        >
          <FiPlus /> <span>Add Testimonial</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-gray-light pb-2 overflow-x-auto">
        {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setActiveFilter(status)}
            className={`px-4 py-2 rounded-btn font-accent text-sm flex items-center space-x-2 transition-all ${
              activeFilter === status
                ? 'bg-black text-white font-bold shadow-md'
                : 'bg-white text-gray hover:bg-gray-100 hover:text-black border border-gray-light'
            }`}
          >
            <span>{status === 'Pending' ? 'Pending Approval' : status}</span>
            {status === 'Pending' && pendingCount > 0 && (
              <span className="bg-red text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTestimonials.map((t) => (
          <Card key={t._id} className="p-6 space-y-4 shadow-sm border border-gray-light relative">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-red text-white flex items-center justify-center font-heading font-bold uppercase">
                  {t.name.slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-heading text-lg text-black">{t.name}</h3>
                  <p className="text-xs text-gray flex items-center gap-1 font-accent">
                    <FiMapPin className="text-red" /> {t.location} {t.systemSize ? `• ${t.systemSize}` : ''}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-1">
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-accent font-bold uppercase ${
                  t.status === 'Approved' ? 'bg-green-100 text-green-800 border border-green-300' :
                  t.status === 'Pending' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                  'bg-red-100 text-red-800 border border-red-300'
                }`}>
                  {t.status}
                </span>
                <span className="text-[10px] text-gray uppercase font-accent">Source: {t.source}</span>
              </div>
            </div>

            {/* Rating Stars */}
            <div className="flex space-x-1 text-amber-400">
              {Array.from({ length: t.rating || 5 }).map((_, i) => (
                <FiStar key={i} className="fill-current w-4 h-4 text-red" />
              ))}
            </div>

            {/* Review Content */}
            <p className="text-gray-700 text-sm font-body italic bg-gray-50 p-4 rounded-card border border-gray-light">
              "{t.review}"
            </p>

            {/* Actions Bar */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-light">
              <span className="text-xs text-gray font-accent flex items-center gap-1">
                <FiClock /> {new Date(t.createdAt).toLocaleDateString()}
              </span>

              <div className="flex items-center space-x-2">
                {t.status !== 'Approved' && (
                  <button
                    onClick={() => handleStatusUpdate(t._id, 'Approved')}
                    className="flex items-center space-x-1 text-xs font-accent font-bold bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-btn transition-colors"
                  >
                    <FiCheckCircle /> <span>Approve</span>
                  </button>
                )}

                {t.status !== 'Rejected' && (
                  <button
                    onClick={() => handleStatusUpdate(t._id, 'Rejected')}
                    className="flex items-center space-x-1 text-xs font-accent font-bold bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-btn transition-colors"
                  >
                    <FiXCircle /> <span>Reject</span>
                  </button>
                )}

                <button
                  onClick={() => handleDelete(t._id)}
                  className="p-1.5 text-gray hover:text-red transition-colors"
                  title="Delete"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          </Card>
        ))}

        {filteredTestimonials.length === 0 && (
          <div className="col-span-2 text-center py-12 bg-white rounded-card border border-gray-light text-gray">
            No {activeFilter.toLowerCase()} testimonials found.
          </div>
        )}
      </div>

      {/* Modal Add Testimonial */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="ADD TESTIMONIAL">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input 
            label="Client Name *" 
            placeholder="e.g. Rahul Sharma" 
            value={form.name} 
            onChange={(e) => setForm({ ...form, name: e.target.value })} 
            required 
          />
          <Input 
            label="Location / Role" 
            placeholder="e.g. Homeowner, Delhi" 
            value={form.location} 
            onChange={(e) => setForm({ ...form, location: e.target.value })} 
          />
          <Input 
            label="System Size (Optional)" 
            placeholder="e.g. 5 kW System" 
            value={form.systemSize} 
            onChange={(e) => setForm({ ...form, systemSize: e.target.value })} 
          />
          
          <div>
            <label className="block text-sm font-accent font-semibold mb-1">Star Rating (1 - 5)</label>
            <select
              className="w-full px-4 py-2 border border-gray-light rounded-btn"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })}
            >
              <option value="5">⭐⭐⭐⭐⭐ (5 Stars - Excellent)</option>
              <option value="4">⭐⭐⭐⭐ (4 Stars - Good)</option>
              <option value="3">⭐⭐⭐ (3 Stars - Average)</option>
              <option value="2">⭐⭐ (2 Stars - Poor)</option>
              <option value="1">⭐ (1 Star - Terrible)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-accent font-semibold mb-1">Review Content *</label>
            <textarea
              rows="4"
              className="w-full px-4 py-2 border border-gray-light rounded-btn text-sm"
              placeholder="Enter client review testimonial..."
              value={form.review}
              onChange={(e) => setForm({ ...form, review: e.target.value })}
              required
            />
          </div>

          <Button type="submit" variant="primary" className="w-full bg-red hover:bg-black text-white">
            Create & Publish Testimonial
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminTestimonials;
