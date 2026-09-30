import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const { data } = await api.get('/blogs');
      setBlogs(data);
    } catch (error) {
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-heading">Blogs Management</h2>
        <Button variant="primary" className="text-sm px-4 py-2">Add New Blog Post</Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-black text-white">
              <tr>
                <th className="py-4 px-4 font-accent text-sm tracking-wide uppercase">Title</th>
                <th className="py-4 px-4 font-accent text-sm tracking-wide uppercase">Category</th>
                <th className="py-4 px-4 font-accent text-sm tracking-wide uppercase">Status</th>
                <th className="py-4 px-4 font-accent text-sm tracking-wide uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-black divide-y divide-gray-light">
              {loading ? (
                <tr><td colSpan="4" className="py-8 text-center">Loading...</td></tr>
              ) : blogs.length === 0 ? (
                <tr><td colSpan="4" className="py-8 text-center text-gray">No blogs found</td></tr>
              ) : (
                blogs.map(b => (
                  <tr key={b._id} className="hover:bg-surface transition-colors">
                    <td className="py-4 px-4 font-semibold max-w-md truncate">{b.title}</td>
                    <td className="py-4 px-4">{b.category}</td>
                    <td className="py-4 px-4">
                      {b.isPublished ? (
                        <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-sm">Published</span>
                      ) : (
                        <span className="bg-gray-200 text-gray-800 text-xs font-bold px-2 py-1 rounded-sm">Draft</span>
                      )}
                    </td>
                    <td className="py-4 px-4 space-x-2">
                      <button className="text-blue-600 hover:underline text-xs font-accent font-bold">EDIT</button>
                      <button className="text-red hover:underline text-xs font-accent font-bold">DELETE</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminBlogs;
