import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiHome, FiFileText, FiBriefcase, FiSettings, FiMessageSquare, FiStar, FiLogOut, FiVideo, FiMenu, FiX } from 'react-icons/fi';
import Logo from '../../assets/Logo.png';

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FiHome /> },
    { name: 'Solar Reels', path: '/admin/reels', icon: <FiVideo /> },
    { name: 'Solar Calculator Settings', path: '/admin/solar-calculator', icon: <FiSettings /> },
    { name: 'Quotation Maker', path: '/admin/quotation-maker', icon: <FiFileText /> },
    { name: 'Quotations List', path: '/admin/quotations', icon: <FiFileText /> },
    { name: 'Projects', path: '/admin/projects', icon: <FiBriefcase /> },
    { name: 'Services', path: '/admin/services', icon: <FiSettings /> },
    { name: 'Blogs', path: '/admin/blogs', icon: <FiMessageSquare /> },
    { name: 'Blog Categories', path: '/admin/categories', icon: <FiFileText /> },
    { name: 'Blog Tags', path: '/admin/tags', icon: <FiFileText /> },
    { name: 'Testimonials', path: '/admin/testimonials', icon: <FiStar /> },
  ];

  return (
    <div className="flex h-screen bg-surface">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-black text-white flex flex-col h-full overflow-y-auto transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="SPC Solar Logo" className="h-8 w-auto object-contain" />
          </Link>
          <span className="text-xs uppercase text-gray-light">Admin</span>
        </div>
        
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center px-6 py-3 font-accent tracking-wide transition-colors ${
                    location.pathname === item.path
                      ? 'bg-red text-white border-r-4 border-white'
                      : 'text-gray-light hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-2 text-gray-light hover:text-red transition-colors font-accent"
          >
            <FiLogOut className="mr-3" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <header className="bg-white shadow-sm h-16 flex items-center px-4 md:px-8 justify-between border-b border-gray-light">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-gray-700 hover:text-red transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <FiMenu size={24} />
            </button>
            <h2 className="font-heading text-xl text-black truncate max-w-[200px] md:max-w-none">
              {navItems.find(i => i.path === location.pathname)?.name || 'Admin Panel'}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray font-body">
              Welcome, <span className="font-bold text-black">{admin.username || 'Admin'}</span>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-surface p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
