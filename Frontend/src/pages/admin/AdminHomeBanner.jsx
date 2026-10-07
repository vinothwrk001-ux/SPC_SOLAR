import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { FiImage, FiUploadCloud } from 'react-icons/fi';

const AdminHomeBanner = () => {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchBanner = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:5000/api/banner', { withCredentials: true });
      setBanner(data);
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error('Failed to load active banner');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error('Please select an image first');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', image);

      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      };

      await axios.post('http://localhost:5000/api/banner', formData, config);
      toast.success('Home banner updated successfully');
      setImage(null);
      fetchBanner();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-heading flex items-center">
            <FiImage className="mr-3 text-red" /> Home Banner Module
          </h2>
          <p className="text-gray text-sm">Manage the main hero banner displayed on the storefront</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-xl font-heading mb-4 border-b border-gray-light pb-2">Upload New Banner</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Image File</label>
              <div className="border-2 border-dashed border-gray-light rounded p-6 text-center hover:border-red transition-colors">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm"
                  id="banner-upload"
                />
              </div>
              <p className="text-xs text-gray mt-2">Recommended resolution: 1920x1080 (16:9). High quality JPEG/PNG.</p>
            </div>
            
            <div className="pt-4">
              <Button type="submit" variant="primary" disabled={uploading || !image} className="w-full flex justify-center items-center">
                <FiUploadCloud className="mr-2" />
                {uploading ? 'Uploading...' : 'Set as Home Banner'}
              </Button>
            </div>
          </form>
        </Card>

        <Card>
          <h3 className="text-xl font-heading mb-4 border-b border-gray-light pb-2">Current Active Banner</h3>
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red"></div>
            </div>
          ) : banner ? (
            <div className="rounded overflow-hidden border border-gray-200">
              <img 
                src={`http://localhost:5000${banner.imageUrl}`} 
                alt="Current Home Banner" 
                className="w-full h-auto object-cover"
                style={{ maxHeight: '300px' }}
              />
              <div className="p-3 bg-gray-50 flex justify-between items-center">
                <span className="text-xs text-gray-500 font-mono break-all">{banner.imageUrl}</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold">Active</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-48 bg-gray-50 rounded border border-gray-200">
              <p className="text-gray-500 text-sm">No custom banner active. Default image is shown.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminHomeBanner;
