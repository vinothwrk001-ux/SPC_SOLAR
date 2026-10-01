import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ServicesPage from './pages/public/ServicesPage';
import ProjectsPage from './pages/public/ProjectsPage';
import SubsidyPage from './pages/public/SubsidyPage';
import BlogPage from './pages/public/BlogPage';
import BlogDetailPage from './pages/public/BlogDetailPage';
import BlogCategoryPage from './pages/public/BlogCategoryPage';
import BlogTagPage from './pages/public/BlogTagPage';
import ContactPage from './pages/public/ContactPage';
import QuotationPage from './pages/public/QuotationPage';
import ReelsPage from './pages/public/ReelsPage';
import ScrollToTop from './components/layout/ScrollToTop';

import { AuthProvider } from './context/AuthContext';
import AdminLayout from './components/layout/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSolarCalculatorConfig from './pages/admin/AdminSolarCalculatorConfig';
import AdminReelsPage from './pages/admin/AdminReelsPage';
import AdminQuotations from './pages/admin/AdminQuotations';
import AdminProjects from './pages/admin/AdminProjects';
import AdminBlogs from './pages/admin/AdminBlogs';
import AdminBlogCreate from './pages/admin/AdminBlogCreate';
import AdminBlogEdit from './pages/admin/AdminBlogEdit';
import AdminBlogPreview from './pages/admin/AdminBlogPreview';
import AdminCategories from './pages/admin/AdminCategories';
import AdminTags from './pages/admin/AdminTags';
import AdminServices from './pages/admin/AdminServices';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminQuotationMaker from './pages/admin/AdminQuotationMaker';
import PublicLayout from './components/layout/PublicLayout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/reels" element={<ReelsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/subsidy" element={<SubsidyPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
            <Route path="/blog/category/:slug" element={<BlogCategoryPage />} />
            <Route path="/blog/tag/:slug" element={<BlogTagPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/quotation" element={<QuotationPage />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="reels" element={<AdminReelsPage />} />
            <Route path="solar-calculator" element={<AdminSolarCalculatorConfig />} />
            <Route path="quotation-maker" element={<AdminQuotationMaker />} />
            <Route path="quotations" element={<AdminQuotations />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="blogs" element={<AdminBlogs />} />
            <Route path="blogs/create" element={<AdminBlogCreate />} />
            <Route path="blogs/:id/edit" element={<AdminBlogEdit />} />
            <Route path="blogs/:id/preview" element={<AdminBlogPreview />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="tags" element={<AdminTags />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
