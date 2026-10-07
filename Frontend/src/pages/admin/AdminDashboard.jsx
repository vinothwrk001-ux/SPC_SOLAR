import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiFileText, FiBriefcase, FiMessageSquare, FiGift, FiPhoneCall } from 'react-icons/fi';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    leads: 0,
    newLeads: 0,
    quotations: 0,
    newQuotations: 0,
    contacts: 0,
    projects: 0,
    blogs: 0
  });
  
  const [recentQuotes, setRecentQuotes] = useState([]);
  const [recentLeads, setRecentLeads] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [leadsRes, quotesRes, contactsRes, projectsRes, blogsRes] = await Promise.all([
          api.get('/leads').catch(() => ({ data: { leads: [] } })),
          api.get('/quotations').catch(() => ({ data: [] })),
          api.get('/contact').catch(() => ({ data: [] })),
          api.get('/projects').catch(() => ({ data: [] })),
          api.get('/blogs').catch(() => ({ data: [] }))
        ]);
        
        const leadsList = leadsRes.data?.leads || (Array.isArray(leadsRes.data) ? leadsRes.data : []);
        const quotes = Array.isArray(quotesRes.data) ? quotesRes.data : [];
        const contacts = Array.isArray(contactsRes.data) ? contactsRes.data : [];
        const projects = Array.isArray(projectsRes.data) ? projectsRes.data : [];
        const blogs = Array.isArray(blogsRes.data) ? blogsRes.data : [];

        setStats({
          leads: leadsList.length,
          newLeads: leadsList.filter(l => l.status === 'New').length,
          quotations: quotes.length,
          newQuotations: quotes.filter(q => q.status === 'New').length,
          contacts: contacts.length,
          projects: projects.length,
          blogs: blogs.length
        });
        
        setRecentQuotes(quotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5));
        setRecentLeads(leadsList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5));
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };
    
    fetchStats();
  }, []);

  const statCards = [
    { title: "New Customer Leads", value: stats.newLeads, subtitle: `Total: ${stats.leads}`, icon: <FiGift className="text-red-500" size={24} />, bg: "bg-red-50 border border-red-200", link: "/admin/leads" },
    { title: "Total Quotations", value: stats.quotations, subtitle: `New: ${stats.newQuotations}`, icon: <FiFileText className="text-blue-500" size={24} />, bg: "bg-blue-50 border border-blue-100", link: "/admin/quotations" },
    { title: "Contact Messages", value: stats.contacts, icon: <FiUsers className="text-purple-500" size={24} />, bg: "bg-purple-50 border border-purple-100" },
    { title: "Total Projects", value: stats.projects, icon: <FiBriefcase className="text-green-500" size={24} />, bg: "bg-green-50 border border-green-100", link: "/admin/projects" },
    { title: "Published Blogs", value: stats.blogs, icon: <FiMessageSquare className="text-amber-500" size={24} />, bg: "bg-amber-50 border border-amber-100", link: "/admin/blogs" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'red';
      case 'Sent': return 'blue';
      case 'Followup': return 'orange';
      case 'Converted': return 'green';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {statCards.map((card, index) => {
          const content = (
            <Card key={index} className={`flex flex-col p-4 ${card.bg} hover:shadow-md transition-shadow cursor-pointer`}>
              <div className="flex justify-between items-start mb-3">
                <div className="bg-white p-2 rounded-full shadow-sm">{card.icon}</div>
                {card.subtitle && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-gray-700">
                    {card.subtitle}
                  </span>
                )}
              </div>
              <h4 className="text-3xl font-heading text-black mb-1">{card.value}</h4>
              <p className="text-xs font-accent font-semibold text-gray-700 uppercase tracking-wider">{card.title}</p>
            </Card>
          );
          return card.link ? (
            <Link key={index} to={card.link}>
              {content}
            </Link>
          ) : (
            <div key={index}>{content}</div>
          );
        })}
      </div>

      {/* Main Grid Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Recent Modal Leads */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="h-full">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <FiGift className="text-red-500" size={20} />
                <h3 className="font-heading text-xl">Recent Inquiries (₹1,000 Offer)</h3>
              </div>
              <Link to="/admin/leads" className="text-sm text-red-600 hover:underline font-accent font-bold">
                View All Leads →
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-light text-gray text-xs uppercase font-accent">
                    <th className="py-2 px-2">Date</th>
                    <th className="py-2 px-2">Customer</th>
                    <th className="py-2 px-2">Phone</th>
                    <th className="py-2 px-2">Location</th>
                    <th className="py-2 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-black">
                  {recentLeads.length === 0 ? (
                    <tr><td colSpan="5" className="py-6 text-center text-gray">No customer leads found yet</td></tr>
                  ) : (
                    recentLeads.map(l => (
                      <tr key={l._id} className="border-b border-gray-light hover:bg-surface transition-colors">
                        <td className="py-3 px-2 text-xs text-gray">
                          {new Date(l.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </td>
                        <td className="py-3 px-2 font-semibold">{l.name || 'Anonymous'}</td>
                        <td className="py-3 px-2">
                          <a href={`tel:${l.phone}`} className="text-blue-600 font-bold hover:underline">
                            {l.phone}
                          </a>
                        </td>
                        <td className="py-3 px-2 text-xs text-gray-700">{l.city || '—'}, {l.state || '—'}</td>
                        <td className="py-3 px-2">
                          <Badge color={getStatusColor(l.status)}>{l.status}</Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <h3 className="font-heading text-xl mb-6">Quick Actions</h3>
            <div className="space-y-4">
              <Link to="/admin/leads" className="block w-full text-left px-4 py-3 bg-red-50 hover:bg-red hover:text-white rounded-btn transition-colors border border-red-200 font-accent font-semibold text-sm flex items-center justify-between">
                <span>View Customer Leads</span>
                <span className="text-xs bg-red text-white group-hover:bg-white group-hover:text-red px-2 py-0.5 rounded-full font-bold">
                  {stats.newLeads} New
                </span>
              </Link>
              <Link to="/admin/quotations" className="block w-full text-left px-4 py-3 bg-surface hover:bg-black hover:text-white rounded-btn transition-colors border border-gray-light font-accent text-sm">
                View Quotations List
              </Link>
              <Link to="/admin/quotation-maker" className="block w-full text-left px-4 py-3 bg-surface hover:bg-black hover:text-white rounded-btn transition-colors border border-gray-light font-accent text-sm">
                Create New Quotation
              </Link>
              <Link to="/admin/projects" className="block w-full text-left px-4 py-3 bg-surface hover:bg-black hover:text-white rounded-btn transition-colors border border-gray-light font-accent text-sm">
                Add New Project
              </Link>
            </div>
          </Card>
        </div>
      </div>
      
    </div>
  );
};

export default AdminDashboard;
