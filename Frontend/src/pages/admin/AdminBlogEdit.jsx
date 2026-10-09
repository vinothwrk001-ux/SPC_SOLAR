import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { blogService } from '../../services/blogService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';
import { FiSave, FiUpload, FiPlus, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { slugify } from '../../utils/blogHelpers';

const AdminBlogEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  // Active Tab: 'content' | 'seo' | 'faq' | 'publishing'
  const [activeTab, setActiveTab] = useState('content');

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Solar Basics');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const [scheduledAt, setScheduledAt] = useState('');

  // Featured Image
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [featuredImageAlt, setFeaturedImageAlt] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Thumbnail Image
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState('');
  const [thumbnailImageAlt, setThumbnailImageAlt] = useState('');
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  // Main Image
  const [mainImageUrl, setMainImageUrl] = useState('');
  const [mainImageAlt, setMainImageAlt] = useState('');
  const [uploadingMainImage, setUploadingMainImage] = useState(false);

  // Author
  const [authorName, setAuthorName] = useState('SPC Solar Expert');

  // FAQs
  const [faqs, setFaqs] = useState([]);

  // SEO Settings
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [noIndex, setNoIndex] = useState(false);

  // Categories list
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    const fetchBlogAndCategories = async () => {
      try {
        setLoading(true);
        const [blogData, cats] = await Promise.all([
          blogService.getBlogById(id),
          blogService.getCategories()
        ]);
        setCategoriesList(cats);

        // Populate fields
        setTitle(blogData.title || '');
        setSubtitle(blogData.subtitle || '');
        setSlug(blogData.slug || '');
        setExcerpt(blogData.excerpt || '');
        setContent(blogData.content || '');
        setCategory(blogData.category || (cats[0]?.name || 'Solar Basics'));
        setTags(blogData.tags || []);
        setStatus(blogData.status || 'DRAFT');
        setScheduledAt(blogData.scheduledAt ? new Date(blogData.scheduledAt).toISOString().slice(0, 16) : '');
        setFeaturedImageUrl(blogData.featuredImage?.url || '');
        setFeaturedImageAlt(blogData.featuredImage?.alt || '');
        setThumbnailImageUrl(blogData.thumbnailImage?.url || '');
        setThumbnailImageAlt(blogData.thumbnailImage?.alt || '');
        setMainImageUrl(blogData.mainImage?.url || '');
        setMainImageAlt(blogData.mainImage?.alt || '');
        setAuthorName(blogData.author?.name || 'SPC Solar Expert');
        setFaqs(blogData.faq || []);

        if (blogData.seo) {
          setMetaTitle(blogData.seo.metaTitle || '');
          setMetaDescription(blogData.seo.metaDescription || '');
          setFocusKeyword(blogData.seo.focusKeyword || '');
          setCanonicalUrl(blogData.seo.canonicalUrl || '');
          setNoIndex(blogData.seo.noIndex || false);
        }
      } catch (error) {
        toast.error('Failed to load blog data');
        navigate('/admin/blogs');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogAndCategories();
  }, [id]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadingImage(true);
      const res = await blogService.uploadImage(formData);
      setFeaturedImageUrl(res.url);
      setFeaturedImageAlt(res.alt || title);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadingThumbnail(true);
      const res = await blogService.uploadImage(formData);
      setThumbnailImageUrl(res.url);
      setThumbnailImageAlt(res.alt || title);
      toast.success('Thumbnail uploaded successfully!');
    } catch (error) {
      toast.error('Thumbnail upload failed');
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadingMainImage(true);
      const res = await blogService.uploadImage(formData);
      setMainImageUrl(res.url);
      setMainImageAlt(res.alt || title);
      toast.success('Main image uploaded successfully!');
    } catch (error) {
      toast.error('Main image upload failed');
    } finally {
      setUploadingMainImage(false);
    }
  };

  const insertFormatting = (tagStart, tagEnd = '') => {
    setContent((prev) => prev + `${tagStart}${tagEnd}`);
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const handleRemoveFaq = (index) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleFaqChange = (index, field, value) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  const handleSubmit = async (overrideStatus = null) => {
    if (!title.trim()) {
      toast.error('Article Title is required');
      return;
    }
    if (!content.trim()) {
      toast.error('Article Content is required');
      return;
    }

    const finalStatus = overrideStatus || status;

    const payload = {
      title,
      subtitle,
      slug: slug || slugify(title),
      excerpt,
      content,
      category,
      tags,
      status: finalStatus,
      scheduledAt: finalStatus === 'SCHEDULED' ? scheduledAt : null,
      featuredImage: {
        url: featuredImageUrl,
        alt: featuredImageAlt || title
      },
      thumbnailImage: {
        url: thumbnailImageUrl,
        alt: thumbnailImageAlt || title
      },
      mainImage: {
        url: mainImageUrl,
        alt: mainImageAlt || title
      },
      author: {
        name: authorName
      },
      seo: {
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt || title,
        focusKeyword,
        canonicalUrl,
        noIndex
      },
      faq: faqs.filter((f) => f.question.trim() && f.answer.trim())
    };

    try {
      await blogService.updateBlog(id, payload);
      toast.success('Blog article updated successfully!');
      navigate('/admin/blogs');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update blog');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray">Loading blog editor...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-light pb-4">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/admin/blogs')} className="text-gray hover:text-black">
            <FiArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-heading">Edit Article</h2>
            <p className="text-xs text-gray">Updating: {title}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="secondary" onClick={() => handleSubmit('DRAFT')} className="text-xs flex items-center">
            <FiSave className="mr-1.5" /> Save Changes
          </Button>
          <Button variant="primary" onClick={() => handleSubmit('PUBLISHED')} className="text-xs flex items-center">
            Update & Publish
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-light space-x-4">
        {[
          { key: 'content', label: '1. Article Content' },
          { key: 'seo', label: '2. SEO Metadata' },
          { key: 'faq', label: '3. FAQs & Structured Data' },
          { key: 'publishing', label: '4. Status & Settings' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`py-3 px-4 text-xs font-accent font-bold tracking-wider uppercase border-b-2 transition-colors ${
              activeTab === tab.key ? 'border-red text-red' : 'border-transparent text-gray hover:text-black'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Content */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <Input label="Article Title *" value={title} onChange={(e) => setTitle(e.target.value)} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
              <Input label="URL Slug" value={slug} onChange={(e) => setSlug(slugify(e.target.value))} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Category</label>
                <select
                  className="w-full border border-gray-light p-2.5 rounded focus:outline-none focus:border-red text-sm"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categoriesList.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                  {categoriesList.length === 0 && <option value="Solar Basics">Solar Basics</option>}
                </select>
              </div>

              <Input label="Author Name" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold mb-1">Tags / Keywords</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="flex-1 border border-gray-light p-2 rounded text-sm focus:outline-none focus:border-red"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tag"
                />
                <Button type="button" variant="secondary" onClick={handleAddTag} className="text-xs">
                  Add Tag
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="bg-surface text-black border border-gray-light text-xs font-accent px-2.5 py-1 rounded-full flex items-center"
                  >
                    #{t}
                    <button type="button" onClick={() => handleRemoveTag(t)} className="ml-1 text-red font-bold">
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Excerpt</label>
              <textarea
                className="w-full border border-gray-light p-2.5 rounded focus:outline-none focus:border-red text-sm"
                rows="2"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
              />
            </div>
          </Card>

          {/* Featured Image */}
          <Card className="p-6 space-y-4">
            <h3 className="font-heading text-lg">Featured Image (Fallback)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-sm font-semibold mb-1">Image URL</label>
                <input
                  type="text"
                  className="w-full border border-gray-light p-2.5 rounded focus:outline-none focus:border-red text-sm"
                  value={featuredImageUrl}
                  onChange={(e) => setFeaturedImageUrl(e.target.value)}
                />
                <div className="mt-2">
                  <label className="cursor-pointer inline-flex items-center text-xs font-accent font-bold bg-surface border border-gray-light px-3 py-2 rounded hover:bg-gray-200">
                    <FiUpload className="mr-1.5" />
                    {uploadingImage ? 'Uploading...' : 'Upload Image'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>
              <div>
                <Input label="Alt Text" value={featuredImageAlt} onChange={(e) => setFeaturedImageAlt(e.target.value)} />
                {featuredImageUrl && (
                  <img
                    src={featuredImageUrl}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded mt-2 border border-gray-light"
                  />
                )}
              </div>
            </div>

            <h3 className="font-heading text-lg mt-6">Thumbnail Image (For Blog Grid)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-sm font-semibold mb-1">Thumbnail Image URL</label>
                <input
                  type="text"
                  className="w-full border border-gray-light p-2.5 rounded focus:outline-none focus:border-red text-sm"
                  value={thumbnailImageUrl}
                  onChange={(e) => setThumbnailImageUrl(e.target.value)}
                  placeholder="https://... or click upload"
                />
                <div className="mt-2">
                  <label className="cursor-pointer inline-flex items-center text-xs font-accent font-bold bg-surface border border-gray-light px-3 py-2 rounded hover:bg-gray-200">
                    <FiUpload className="mr-1.5" />
                    {uploadingThumbnail ? 'Uploading...' : 'Upload Thumbnail'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
                  </label>
                </div>
              </div>
              <div>
                <Input
                  label="Alt Text"
                  value={thumbnailImageAlt}
                  onChange={(e) => setThumbnailImageAlt(e.target.value)}
                  placeholder="Description of the thumbnail"
                />
                {thumbnailImageUrl && (
                  <img
                    src={thumbnailImageUrl}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded mt-2 border border-gray-light"
                  />
                )}
              </div>
            </div>

            <h3 className="font-heading text-lg mt-6">Main Image (Inside Blog Article)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-sm font-semibold mb-1">Main Image URL</label>
                <input
                  type="text"
                  className="w-full border border-gray-light p-2.5 rounded focus:outline-none focus:border-red text-sm"
                  value={mainImageUrl}
                  onChange={(e) => setMainImageUrl(e.target.value)}
                  placeholder="https://... or click upload"
                />
                <div className="mt-2">
                  <label className="cursor-pointer inline-flex items-center text-xs font-accent font-bold bg-surface border border-gray-light px-3 py-2 rounded hover:bg-gray-200">
                    <FiUpload className="mr-1.5" />
                    {uploadingMainImage ? 'Uploading...' : 'Upload Main Image'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleMainImageUpload} />
                  </label>
                </div>
              </div>
              <div>
                <Input
                  label="Alt Text"
                  value={mainImageAlt}
                  onChange={(e) => setMainImageAlt(e.target.value)}
                  placeholder="Description of the main image"
                />
                {mainImageUrl && (
                  <img
                    src={mainImageUrl}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded mt-2 border border-gray-light"
                  />
                )}
              </div>
            </div>
          </Card>

          {/* Content Editor */}
          <Card className="p-6 space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold">Article Body Content (HTML)</label>
              <div className="flex flex-wrap gap-1 bg-surface p-1 rounded border border-gray-light">
                <button type="button" onClick={() => insertFormatting('<h2>', '</h2>')} className="px-2 py-1 text-xs font-bold font-mono hover:bg-white rounded">
                  H2
                </button>
                <button type="button" onClick={() => insertFormatting('<h3>', '</h3>')} className="px-2 py-1 text-xs font-bold font-mono hover:bg-white rounded">
                  H3
                </button>
                <button type="button" onClick={() => insertFormatting('<strong>', '</strong>')} className="px-2 py-1 text-xs font-bold font-mono hover:bg-white rounded">
                  B
                </button>
                <button type="button" onClick={() => insertFormatting('<em>', '</em>')} className="px-2 py-1 text-xs font-bold font-mono hover:bg-white rounded">
                  I
                </button>
              </div>
            </div>
            <textarea
              className="w-full border border-gray-light p-4 rounded focus:outline-none focus:border-red font-mono text-sm leading-relaxed"
              rows="14"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Card>
        </div>
      )}

      {/* Tab 2: SEO */}
      {activeTab === 'seo' && (
        <Card className="p-6 space-y-4">
          <h3 className="font-heading text-lg border-b border-gray-light pb-2">SEO Settings</h3>
          <Input label="Meta Title" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
          <div>
            <label className="block text-sm font-semibold mb-1">Meta Description</label>
            <textarea
              className="w-full border border-gray-light p-2.5 rounded focus:outline-none focus:border-red text-sm"
              rows="3"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Focus Keyword" value={focusKeyword} onChange={(e) => setFocusKeyword(e.target.value)} />
            <Input label="Canonical URL" value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} />
          </div>
        </Card>
      )}

      {/* Tab 3: FAQ */}
      {activeTab === 'faq' && (
        <Card className="p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-light pb-2">
            <h3 className="font-heading text-lg">FAQs</h3>
            <Button type="button" variant="secondary" onClick={handleAddFaq} className="text-xs flex items-center">
              <FiPlus className="mr-1" /> Add Question
            </Button>
          </div>
          {faqs.map((f, index) => (
            <div key={index} className="p-4 border border-gray-light rounded bg-surface space-y-3 relative">
              <button
                type="button"
                onClick={() => handleRemoveFaq(index)}
                className="absolute top-3 right-3 text-red font-bold text-xs"
              >
                <FiTrash2 size={16} />
              </button>
              <Input
                label={`Question ${index + 1}`}
                value={f.question}
                onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
              />
              <div>
                <label className="block text-sm font-semibold mb-1">Answer</label>
                <textarea
                  className="w-full border border-gray-light p-2 rounded focus:outline-none focus:border-red text-sm"
                  rows="2"
                  value={f.answer}
                  onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                />
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Tab 4: Publishing Settings */}
      {activeTab === 'publishing' && (
        <Card className="p-6 space-y-6">
          <h3 className="font-heading text-lg border-b border-gray-light pb-2">Publication & Scheduling</h3>
          <div>
            <label className="block text-sm font-semibold mb-2">Publishing Status</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { key: 'DRAFT', title: 'Draft' },
                { key: 'PUBLISHED', title: 'Published' },
                { key: 'SCHEDULED', title: 'Scheduled' }
              ].map((item) => (
                <div
                  key={item.key}
                  onClick={() => setStatus(item.key)}
                  className={`p-4 border rounded cursor-pointer ${
                    status === item.key ? 'border-red bg-red/5 font-bold' : 'border-gray-light bg-surface'
                  }`}
                >
                  <div className="font-accent text-sm uppercase">{item.title}</div>
                </div>
              ))}
            </div>
          </div>
          {status === 'SCHEDULED' && (
            <div>
              <label className="block text-sm font-semibold mb-1">Scheduled Date & Time</label>
              <input
                type="datetime-local"
                className="w-full md:w-72 border border-gray-light p-2.5 rounded text-sm"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
              />
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default AdminBlogEdit;
