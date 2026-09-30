import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-heading">Projects Management</h2>
        <Button variant="primary" className="text-sm px-4 py-2">Add New Project</Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-black text-white">
              <tr>
                <th className="py-4 px-4 font-accent text-sm tracking-wide uppercase">Title</th>
                <th className="py-4 px-4 font-accent text-sm tracking-wide uppercase">Location</th>
                <th className="py-4 px-4 font-accent text-sm tracking-wide uppercase">Capacity</th>
                <th className="py-4 px-4 font-accent text-sm tracking-wide uppercase">Type</th>
                <th className="py-4 px-4 font-accent text-sm tracking-wide uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-black divide-y divide-gray-light">
              {loading ? (
                <tr><td colSpan="5" className="py-8 text-center">Loading...</td></tr>
              ) : projects.length === 0 ? (
                <tr><td colSpan="5" className="py-8 text-center text-gray">No projects found</td></tr>
              ) : (
                projects.map(p => (
                  <tr key={p._id} className="hover:bg-surface transition-colors">
                    <td className="py-4 px-4 font-semibold">{p.title}</td>
                    <td className="py-4 px-4">{p.location}</td>
                    <td className="py-4 px-4 font-bold text-red">{p.capacity} kW</td>
                    <td className="py-4 px-4">{p.clientType}</td>
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

export default AdminProjects;
