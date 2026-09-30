import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SEOHead from '../../components/ui/SEOHead';
import { FiArrowLeft, FiCalendar, FiTag } from 'react-icons/fi';

const BlogDetailPage = () => {
  const { slug } = useParams();
  
  // Dummy fetch based on slug
  const blog = {
    title: "Everything You Need to Know About PM Surya Ghar Scheme",
    content: `
      <p>The PM Surya Ghar: Muft Bijli Yojana is a groundbreaking initiative aimed at providing free electricity to households across India. Launched with a massive budget, this scheme incentivizes rooftop solar installations.</p>
      <h3>Understanding the Subsidy Structure</h3>
      <p>Under this scheme, the central government provides a direct subsidy to your bank account upon successful installation and commissioning of the solar plant.</p>
      <ul>
        <li>Up to 2kW: Rs. 30,000 per kW</li>
        <li>2kW to 3kW: Rs. 18,000 for the extra kW</li>
        <li>Above 3kW: Capped at Rs. 78,000</li>
      </ul>
      <p>This makes solar energy highly affordable and reduces the ROI period to just 3-4 years for most residential users.</p>
    `,
    category: "Government Schemes",
    date: "Oct 15, 2025",
    image: "https://images.unsplash.com/photo-1509391366360-5157625bf958?auto=format&fit=crop&q=80&w=1200"
  };

  return (
    <div className="bg-bg min-h-screen pb-20">
      <SEOHead 
        title={`${blog.title} | SPC Solar`}
        description={blog.title}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <Link to="/blog" className="inline-flex items-center text-gray hover:text-red font-accent font-semibold tracking-wider uppercase text-sm mb-8 transition-colors">
          <FiArrowLeft className="mr-2" /> Back to Blog
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-heading mb-6">{blog.title}</h1>
        
        <div className="flex items-center space-x-6 text-sm text-gray font-accent mb-8 border-b border-gray-light pb-6">
          <div className="flex items-center"><FiTag className="mr-2 text-red" /> {blog.category}</div>
          <div className="flex items-center"><FiCalendar className="mr-2 text-red" /> {blog.date}</div>
        </div>

        <img src={blog.image} alt={blog.title} className="w-full h-[400px] object-cover rounded-card mb-10" />

        <div className="prose prose-lg max-w-none text-gray font-body prose-headings:font-heading prose-headings:text-black prose-a:text-red">
          <div dangerouslySetInnerHTML={{ __line: blog.content, __html: blog.content }}></div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
