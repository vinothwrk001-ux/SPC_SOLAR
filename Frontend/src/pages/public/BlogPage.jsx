import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/ui/SEOHead';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FiArrowRight } from 'react-icons/fi';

const BlogPage = () => {
  const blogs = [
    { slug: "understand-pm-surya-ghar", title: "Everything You Need to Know About PM Surya Ghar Scheme", excerpt: "The government has recently announced the PM Surya Ghar scheme. Here's a breakdown of the subsidy...", category: "Government Schemes", date: "Oct 15, 2025", image: "https://images.unsplash.com/photo-1509391366360-5157625bf958?auto=format&fit=crop&q=80&w=800" },
    { slug: "solar-maintenance-tips", title: "Top 5 Maintenance Tips for Your Solar Panels", excerpt: "To ensure maximum efficiency and generation, your solar panels need periodic maintenance...", category: "Solar Tips", date: "Oct 02, 2025", image: "https://images.unsplash.com/photo-1611365892502-8eebf8c148e3?auto=format&fit=crop&q=80&w=800" },
    { slug: "commercial-solar-roi", title: "Why Commercial Solar is the Best Investment in 2025", excerpt: "With electricity tariffs rising across the country, businesses are turning to rooftop solar...", category: "Case Studies", date: "Sep 28, 2025", image: "https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&q=80&w=800" }
  ];

  return (
    <div className="bg-bg min-h-screen">
      <SEOHead 
        title="Solar Energy Blog & News | SPC Solar" 
        description="Read the latest news, tips, and updates about solar energy, PM Surya Ghar scheme, and renewable technologies."
      />
      
      <section className="bg-black py-20 text-center border-b-4 border-red text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-heading mb-4">SOLAR INSIGHTS</h1>
          <p className="text-xl text-gray-light font-body">
            Latest news, tips, and updates from the world of solar energy.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <Card key={index} className="flex flex-col p-0 overflow-hidden h-full">
                <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover" />
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-center mb-3 text-xs font-accent uppercase tracking-wider text-gray">
                    <span className="text-red font-bold">{blog.category}</span>
                    <span>{blog.date}</span>
                  </div>
                  <h3 className="text-2xl font-heading mb-3 line-clamp-2">{blog.title}</h3>
                  <p className="text-gray text-sm mb-6 flex-grow">{blog.excerpt}</p>
                  <Link to={`/blog/${blog.slug}`} className="mt-auto inline-flex items-center text-black hover:text-red font-accent font-bold uppercase text-sm tracking-wide transition-colors">
                    Read Article <FiArrowRight className="ml-2" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
