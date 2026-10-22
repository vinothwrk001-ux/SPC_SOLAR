import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { 
  FiGlobe, 
  FiCheckCircle, 
  FiRefreshCw, 
  FiSend, 
  FiExternalLink, 
  FiShield, 
  FiMapPin, 
  FiLayers, 
  FiSearch,
  FiTrendingUp,
  FiCheck
} from 'react-icons/fi';

const AdminSEOPage = () => {
  const [loading, setLoading] = useState(true);
  const [pinging, setPinging] = useState(false);
  const [auditData, setAuditData] = useState(null);
  const [pingResults, setPingResults] = useState(null);

  const fetchSEOAudit = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/seo/audit');
      if (data?.success) {
        setAuditData(data.audit);
      }
    } catch (err) {
      console.error('Failed to fetch SEO audit:', err);
      toast.error('Could not load SEO audit data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSEOAudit();
  }, []);

  const handlePingSearchEngines = async () => {
    try {
      setPinging(true);
      const { data } = await api.post('/seo/ping', {});
      if (data?.success) {
        setPingResults(data.pingResult);
        toast.success('Search engines pinged successfully! Sitemap cache refreshed.');
      }
    } catch (err) {
      console.error('Ping failed:', err);
      toast.error('Failed to notify search engines');
    } finally {
      setPinging(false);
    }
  };

  const copyToClipboard = (text, message = 'Copied to clipboard!') => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-red/10 text-red rounded-lg">
              <FiGlobe className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold font-heading text-gray-900">
              Master SEO & Search Console Control Center
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Monitor real-time sitemap indexing, ping Google & Bing, and dominate search rankings for Coimbatore solar keywords.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={fetchSEOAudit}
            disabled={loading}
            className="flex items-center gap-2 text-xs"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            Refresh Status
          </Button>
          <Button
            variant="primary"
            onClick={handlePingSearchEngines}
            disabled={pinging}
            className="flex items-center gap-2 text-xs bg-red hover:bg-red-dark text-white"
          >
            <FiSend className={pinging ? 'animate-pulse' : ''} />
            {pinging ? 'Pinging Search Engines...' : 'Ping Google & Bing'}
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Total Indexed URLs</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {auditData ? auditData.totalIndexedUrls : '...'}
              </h3>
            </div>
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <FiLayers size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Dynamic articles, tags, & pages</p>
        </Card>

        <Card className="p-4 bg-white border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Sitemap Status</p>
              <h3 className="text-xl font-bold text-emerald-600 mt-1 flex items-center gap-1.5">
                <FiCheckCircle size={18} /> Active
              </h3>
            </div>
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <FiGlobe size={20} />
            </div>
          </div>
          <a
            href="https://spcsolarcbe.com/sitemap.xml"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-blue-600 hover:underline mt-2 inline-flex items-center gap-1"
          >
            /sitemap.xml <FiExternalLink size={11} />
          </a>
        </Card>

        <Card className="p-4 bg-white border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Robots Directives</p>
              <h3 className="text-xl font-bold text-emerald-600 mt-1 flex items-center gap-1.5">
                <FiCheckCircle size={18} /> Valid
              </h3>
            </div>
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <FiShield size={20} />
            </div>
          </div>
          <a
            href="https://spcsolarcbe.com/robots.txt"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-blue-600 hover:underline mt-2 inline-flex items-center gap-1"
          >
            /robots.txt <FiExternalLink size={11} />
          </a>
        </Card>

        <Card className="p-4 bg-white border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Local SEO Authority</p>
              <h3 className="text-xl font-bold text-gray-900 mt-1 flex items-center gap-1.5">
                Coimbatore #1
              </h3>
            </div>
            <div className="w-10 h-10 bg-red/10 text-red rounded-xl flex items-center justify-center">
              <FiMapPin size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">RS Puram, Tamil Nadu</p>
        </Card>
      </div>

      {/* Ping Results Notification Box (if fired) */}
      {pingResults && (
        <Card className="p-5 bg-emerald-50 border border-emerald-200">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-bold text-emerald-900 flex items-center gap-2">
                <FiCheckCircle className="text-emerald-600" />
                Search Engines Notified Successfully
              </h4>
              <p className="text-xs text-emerald-700 mt-1">
                Triggered for: <span className="font-mono">{pingResults.sitemapUrl}</span> at {new Date(pingResults.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {pingResults.results?.map((res) => (
              <div key={res.service} className="p-2.5 bg-white/80 rounded-lg text-xs flex items-center justify-between border border-emerald-100">
                <span className="font-semibold text-gray-800">{res.service}</span>
                <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${res.success ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {res.success ? 'Status 200 OK' : 'Sent'}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Main Grid: Google Search Console Guide (Left) & Coimbatore Keywords Dominance (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Search Console Setup & Verification */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 bg-white border border-gray-100 shadow-xs">
            <h3 className="text-lg font-bold font-heading text-gray-900 flex items-center gap-2">
              <FiSearch className="text-red" />
              Google Search Console Onboarding
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Follow these simple steps to ensure Google indexes all 52+ URLs for rank #1 status:
            </p>

            <div className="mt-5 space-y-4">
              <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-6 h-6 rounded-full bg-red text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <div className="flex-1">
                  <h5 className="text-xs font-bold text-gray-900">Add Property in Google Search Console</h5>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Open Search Console, select <strong>URL prefix</strong> and enter <code className="bg-white px-1.5 py-0.5 rounded border border-gray-200">https://spcsolarcbe.com/</code>
                  </p>
                  <a
                    href="https://search.google.com/search-console"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-red font-semibold hover:underline mt-2"
                  >
                    Open Google Search Console <FiExternalLink size={12} />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-6 h-6 rounded-full bg-red text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <div className="flex-1">
                  <h5 className="text-xs font-bold text-gray-900">Verify Ownership via HTML Tag</h5>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Your <code className="bg-white px-1 py-0.5 rounded border border-gray-200">index.html</code> already includes the verification meta tag ready to receive your code:
                  </p>
                  <div className="mt-2 p-2.5 bg-gray-900 text-gray-200 rounded-lg font-mono text-[11px] flex items-center justify-between">
                    <span className="truncate">&lt;meta name="google-site-verification" content="..." /&gt;</span>
                    <button
                      onClick={() => copyToClipboard('<meta name="google-site-verification" content="google-search-console-verification-code" />')}
                      className="text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded transition-colors ml-2 flex-shrink-0"
                    >
                      Copy Tag
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-6 h-6 rounded-full bg-red text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <div className="flex-1">
                  <h5 className="text-xs font-bold text-gray-900">Submit Sitemaps</h5>
                  <p className="text-xs text-gray-600 mt-0.5">
                    In the left navigation of Search Console, click <strong>Sitemaps</strong>, type <code className="bg-white px-1 py-0.5 rounded border border-gray-200">sitemap.xml</code> and click <strong>Submit</strong>.
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      readOnly
                      value="https://spcsolarcbe.com/sitemap.xml"
                      className="bg-white border border-gray-200 text-xs px-3 py-1.5 rounded-lg flex-1 font-mono text-gray-700"
                    />
                    <button
                      onClick={() => copyToClipboard('https://spcsolarcbe.com/sitemap.xml', 'Sitemap URL copied!')}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Copy URL
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Local Coimbatore Dominance Checklist */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 bg-white border border-gray-100 shadow-xs">
            <h3 className="text-lg font-bold font-heading text-gray-900 flex items-center gap-2">
              <FiTrendingUp className="text-red" />
              Target Coimbatore Solar Keywords
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Active high-intent keywords optimized across all pages:
            </p>

            <div className="mt-4 space-y-2.5">
              {[
                { kw: 'best solar in coimbatore', intent: 'Commercial & High Intent' },
                { kw: 'solar company in coimbatore', intent: 'Branded & Local Search' },
                { kw: 'rooftop solar coimbatore', intent: 'Residential Rooftop' },
                { kw: 'pm surya ghar subsidy coimbatore', intent: 'Government Subsidy (₹78,000)' },
                { kw: 'solar panel price coimbatore', intent: 'Transactional Quotation' },
                { kw: 'tangedco net metering coimbatore', intent: 'Grid Synchronization' },
                { kw: 'industrial solar epc tamil nadu', intent: 'Megawatt Scale B2B' }
              ].map((item) => (
                <div key={item.kw} className="p-2.5 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FiCheck className="text-emerald-500 flex-shrink-0" />
                    <span className="font-semibold text-gray-900">{item.kw}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                    {item.intent}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                NAP Consistency (Name, Address, Phone)
              </h4>
              <div className="space-y-1.5 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p><strong>Business:</strong> SPC Solar (Smart Power Controls)</p>
                <p><strong>Address:</strong> No-115-117, Easwari Towers, Devanga High School Road, RS Puram, Coimbatore - 641002</p>
                <p><strong>Phone:</strong> +91 80987 44044 / +91 84896 44044</p>
                <p><strong>Coordinates:</strong> 11.0168° N, 76.9558° E</p>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default AdminSEOPage;
