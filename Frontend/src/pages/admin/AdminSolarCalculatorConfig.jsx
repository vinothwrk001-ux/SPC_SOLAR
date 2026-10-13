import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { FiSave, FiSettings, FiRefreshCw, FiDollarSign, FiZap, FiGrid } from 'react-icons/fi';

const AdminSolarCalculatorConfig = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    perKwPrice: 45000,
    baseTariff: 8.5,
    minCapacity: 1.0,
    maxCapacity: 100.0,
    roofAreaSqFtPerKW: 60,
    minBillAmount: 500,
    maxBillAmount: 50000,
    defaultBillAmount: 6900
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/solar-calculator/admin/config');
      if (data) {
        setForm({
          perKwPrice: data.perKwPrice || 45000,
          baseTariff: data.baseTariff || 8.5,
          minCapacity: data.minCapacity || 1.0,
          maxCapacity: data.maxCapacity || 100.0,
          roofAreaSqFtPerKW: data.roofAreaSqFtPerKW || 60,
          minBillAmount: data.minBillAmount || 500,
          maxBillAmount: data.maxBillAmount || 50000,
          defaultBillAmount: data.defaultBillAmount || 6900
        });
      }
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/solar-calculator/admin/config', form);
      toast.success('Solar Calculator Settings Saved Successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red animate-pulse" />
            <span className="font-accent text-xs font-bold uppercase tracking-wider text-red">Algorithm Configuration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading text-black font-bold tracking-tight">
            Solar Calculator Settings Module
          </h1>
          <p className="text-sm text-gray-500 font-body mt-1">
            Configure tariffs, generation formulas, rooftop area ratios, and cost benchmarks for the customer savings estimator.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <Button
            variant="outline"
            onClick={fetchConfig}
            className="flex items-center gap-2 text-xs font-accent uppercase tracking-wider px-3 py-2.5"
            title="Refresh settings"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} size={15} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 text-xs font-accent uppercase tracking-wider px-4 py-2.5 shadow-md hover:shadow-lg"
          >
            <FiSave size={16} />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </Button>
        </div>
      </div>

      {/* Stats KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-accent uppercase tracking-wider text-red font-bold">Base Benchmark / kW</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-heading font-bold text-red">₹{Number(form.perKwPrice).toLocaleString()}</span>
            <span className="text-xs bg-red-50 text-red px-2 py-0.5 rounded-md font-semibold">Per kW</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-accent uppercase tracking-wider text-blue-600 font-bold">Grid Tariff Rate</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-heading font-bold text-blue-700">₹{form.baseTariff}</span>
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-semibold">/ kWh</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-accent uppercase tracking-wider text-amber-600 font-bold">Roof Area Ratio</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-heading font-bold text-amber-700">{form.roofAreaSqFtPerKW} sq.ft</span>
            <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md font-semibold">Per kW</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-accent uppercase tracking-wider text-green-600 font-bold">Default Bill</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-heading font-bold text-green-700">₹{Number(form.defaultBillAmount).toLocaleString()}</span>
            <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-md font-semibold">/ Month</span>
          </div>
        </div>
      </div>

      {/* Settings Form Card */}
      <Card className="p-6 sm:p-8 bg-white border border-gray-200/90 shadow-sm rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="font-heading font-bold text-lg text-black">Financial & Technical Parameters</h3>
            <p className="text-xs text-gray-500 font-body mt-0.5">
              These values directly influence the estimations displayed on the public Solar Calculator page.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1.5 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
                Installation Price per kW (₹)
              </label>
              <input
                type="number"
                value={form.perKwPrice}
                onChange={(e) => setForm({ ...form, perKwPrice: Number(e.target.value) })}
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-btn focus:bg-white focus:outline-none focus:border-black"
              />
              <span className="text-xs text-gray-400 font-body mt-1 block">Default benchmark: ₹45,000 / kW</span>
            </div>

            <div>
              <label className="block mb-1.5 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
                Average Grid Electricity Tariff (₹ / kWh Unit)
              </label>
              <input
                type="number"
                step="0.1"
                value={form.baseTariff}
                onChange={(e) => setForm({ ...form, baseTariff: Number(e.target.value) })}
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-btn focus:bg-white focus:outline-none focus:border-black"
              />
              <span className="text-xs text-gray-400 font-body mt-1 block">DISCOM average rate in ₹ (e.g. 8.5)</span>
            </div>

            <div>
              <label className="block mb-1.5 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
                Rooftop Area Requirement (Sq. Ft per kW)
              </label>
              <input
                type="number"
                value={form.roofAreaSqFtPerKW}
                onChange={(e) => setForm({ ...form, roofAreaSqFtPerKW: Number(e.target.value) })}
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-btn focus:bg-white focus:outline-none focus:border-black"
              />
              <span className="text-xs text-gray-400 font-body mt-1 block">Standard shadow-free area per kilowatt (approx 60-80)</span>
            </div>

            <div>
              <label className="block mb-1.5 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
                Default Monthly Bill Slider Starting Point (₹)
              </label>
              <input
                type="number"
                value={form.defaultBillAmount}
                onChange={(e) => setForm({ ...form, defaultBillAmount: Number(e.target.value) })}
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-btn focus:bg-white focus:outline-none focus:border-black"
              />
              <span className="text-xs text-gray-400 font-body mt-1 block">Pre-selected value on calculator load</span>
            </div>

            <div>
              <label className="block mb-1.5 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
                Minimum Bill Amount Slider Limit (₹)
              </label>
              <input
                type="number"
                value={form.minBillAmount}
                onChange={(e) => setForm({ ...form, minBillAmount: Number(e.target.value) })}
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-btn focus:bg-white focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block mb-1.5 font-accent font-semibold text-xs uppercase tracking-wider text-gray-700">
                Maximum Bill Amount Slider Limit (₹)
              </label>
              <input
                type="number"
                value={form.maxBillAmount}
                onChange={(e) => setForm({ ...form, maxBillAmount: Number(e.target.value) })}
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-btn focus:bg-white focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button
              type="submit"
              variant="primary"
              disabled={saving}
              className="text-xs font-accent uppercase tracking-wider px-6 py-2.5 flex items-center gap-1.5"
            >
              <FiSave size={16} />
              <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AdminSolarCalculatorConfig;
