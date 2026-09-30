import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiFileText, FiBriefcase, FiMessageSquare } from 'react-icons/fi';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    quotations: 0,
    newQuotations: 0,
    contacts: 0,
    projects: 0,
    blogs: 0
  });
  
  const [recentQuotes, setRecentQuotes] = useState([]);

  useEffect(() => {
    // In a real app, this would be a single dashboard endpoint.
    // For scaffolding, we simulate fetching stats from multiple endpoints.
    const fetchStats = async () => {
      try {
        const [quotesRes, contactsRes, projectsRes, blogsRes] = await Promise.all([
          api.get('/quotations'),
          api.get('/contact'),
          api.get('/projects'),
          api.get('/blogs')
        ]);
        
        const quotes = quotesRes.data;
        setStats({
          quotations: quotes.length,
          newQuotations: quotes.filter(q => q.status === 'New').length,
          contacts: contactsRes.data.length,
          projects: projectsRes.data.length,
          blogs: blogsRes.data.length
        });
        
        // Take latest 5 quotations
        setRecentQuotes(quotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5));
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };
    
    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Quotations", value: stats.quotations, icon: <FiFileText className="text-red" size={24} />, bg: "bg-red-light" },
    { title: "New Quotations Today", value: stats.newQuotations, icon: <FiFileText className="text-red" size={24} />, bg: "bg-red-light border border-red" },
    { title: "Total Contacts", value: stats.contacts, icon: <FiUsers className="text-blue-500" size={24} />, bg: "bg-blue-100" },
    { title: "Total Projects", value: stats.projects, icon: <FiBriefcase className="text-green-500" size={24} />, bg: "bg-green-100" },
    { title: "Published Blogs", value: stats.blogs, icon: <FiMessageSquare className="text-purple-500" size={24} />, bg: "bg-purple-100" },
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((card, index) => (
          <Card key={index} className={`flex flex-col p-4 ${card.bg}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white p-2 rounded-full">{card.icon}</div>
            </div>
            <h4 className="text-3xl font-heading text-black mb-1">{card.value}</h4>
            <p className="text-sm font-accent text-gray-700">{card.title}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2">
          <Card className="h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-heading text-xl">Recent Quotations</h3>
              <Link to="/admin/quotations" className="text-sm text-red hover:underline font-accent">View All</Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-light text-gray text-sm">
                    <th className="py-2 px-2 font-accent">Date</th>
                    <th className="py-2 px-2 font-accent">Customer</th>
                    <th className="py-2 px-2 font-accent">Capacity</th>
                    <th className="py-2 px-2 font-accent">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-black">
                  {recentQuotes.length === 0 ? (
                    <tr><td colSpan="4" className="py-4 text-center text-gray">No quotations found</td></tr>
                  ) : (
                    recentQuotes.map(q => (
                      <tr key={q._id} className="border-b border-gray-light hover:bg-surface">
                        <td className="py-3 px-2">{new Date(q.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-2 font-semibold">{q.name}</td>
                        <td className="py-3 px-2">{q.recommendedKW} kW</td>
                        <td className="py-3 px-2">
                          <Badge color={getStatusColor(q.status)}>{q.status}</Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="h-full">
            <h3 className="font-heading text-xl mb-6">Quick Actions</h3>
            <div className="space-y-4">
              <Link to="/admin/quotations" className="block w-full text-left px-4 py-3 bg-surface hover:bg-red hover:text-white rounded-btn transition-colors border border-gray-light font-accent">
                View New Quotations
              </Link>
              <Link to="/admin/projects" className="block w-full text-left px-4 py-3 bg-surface hover:bg-black hover:text-white rounded-btn transition-colors border border-gray-light font-accent">
                Add New Project
              </Link>
              <Link to="/admin/blogs" className="block w-full text-left px-4 py-3 bg-surface hover:bg-black hover:text-white rounded-btn transition-colors border border-gray-light font-accent">
                Add New Blog Post
              </Link>
            </div>
          </Card>
        </div>
      </div>
      
    </div>
  );
};

export default AdminDashboard;
