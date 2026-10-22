import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/public/HomePage';
import ScrollToTop from './components/layout/ScrollToTop';
import Loader from './components/ui/Loader';

import { AuthProvider } from './context/AuthContext';
import { UserAuthProvider } from './context/UserAuthContext';
import PublicLayout from './components/layout/PublicLayout';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { PreloadProvider } from './context/PreloadContext';
import WelcomeSplashScreen from './components/ui/WelcomeSplashScreen';

// Code-Split Secondary Public Routes
const AboutPage = lazy(() => import('./pages/public/AboutPage'));
const ServicesPage = lazy(() => import('./pages/public/ServicesPage'));
const ProjectsPage = lazy(() => import('./pages/public/ProjectsPage'));
const SubsidyPage = lazy(() => import('./pages/public/SubsidyPage'));
const BlogPage = lazy(() => import('./pages/public/BlogPage'));
const BlogDetailPage = lazy(() => import('./pages/public/BlogDetailPage'));
const BlogCategoryPage = lazy(() => import('./pages/public/BlogCategoryPage'));
const BlogTagPage = lazy(() => import('./pages/public/BlogTagPage'));
const ContactPage = lazy(() => import('./pages/public/ContactPage'));
const ComponentsGalleryPage = lazy(() => import('./pages/public/ComponentsGalleryPage'));
const QuotationPage = lazy(() => import('./pages/public/QuotationPage'));
const ReelsPage = lazy(() => import('./pages/public/ReelsPage'));

// Code-Split Admin Routes (isolates ExcelJS and admin modules from public bundle)
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminCouponsPage = lazy(() => import('./pages/admin/AdminCouponsPage'));
const AdminSolarCalculatorConfig = lazy(() => import('./pages/admin/AdminSolarCalculatorConfig'));
const AdminReelsPage = lazy(() => import('./pages/admin/AdminReelsPage'));
const AdminQuotations = lazy(() => import('./pages/admin/AdminQuotations'));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'));
const AdminBlogs = lazy(() => import('./pages/admin/AdminBlogs'));
const AdminBlogCreate = lazy(() => import('./pages/admin/AdminBlogCreate'));
const AdminBlogEdit = lazy(() => import('./pages/admin/AdminBlogEdit'));
const AdminBlogPreview = lazy(() => import('./pages/admin/AdminBlogPreview'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminTags = lazy(() => import('./pages/admin/AdminTags'));
const AdminServices = lazy(() => import('./pages/admin/AdminServices'));
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials'));
const AdminQuotationMaker = lazy(() => import('./pages/admin/AdminQuotationMaker'));
const AdminGalleryComponents = lazy(() => import('./pages/admin/AdminGalleryComponents'));
const AdminHomeBanner = lazy(() => import('./pages/admin/AdminHomeBanner'));
const AdminLeads = lazy(() => import('./pages/admin/AdminLeads'));
const AdminMediaManager = lazy(() => import('./pages/admin/AdminMediaManager'));
const AdminSEOPage = lazy(() => import('./pages/admin/AdminSEOPage'));

function App() {
  return (
    <ErrorBoundary>
      <PreloadProvider>
        <WelcomeSplashScreen />
        <AuthProvider>
          <UserAuthProvider>
            <Router>
              <ScrollToTop />
              <Suspense fallback={<Loader fullPage text="Loading SPC Solar..." />}>
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
                    <Route path="/components" element={<ComponentsGalleryPage />} />
                    <Route path="/quotation" element={<QuotationPage />} />
                  </Route>

                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="leads" element={<AdminLeads />} />
                    <Route path="coupons" element={<AdminCouponsPage />} />
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
                    <Route path="gallery-components" element={<AdminGalleryComponents />} />
                    <Route path="home-banner" element={<AdminHomeBanner />} />
                    <Route path="media" element={<AdminMediaManager />} />
                    <Route path="seo" element={<AdminSEOPage />} />
                  </Route>
                </Routes>
              </Suspense>
            </Router>
          </UserAuthProvider>
        </AuthProvider>
      </PreloadProvider>
    </ErrorBoundary>
  );
}

export default App;
