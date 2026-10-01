import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';
import { FiSave, FiSettings } from 'react-icons/fi';

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
      toast.success('Solar Calculator Settings Saved!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray font-accent">Loading Solar Calculator Settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-gray-light pb-4">
        <h1 className="text-3xl font-heading text-black flex items-center gap-2">
          <FiSettings className="text-red" /> SOLAR CALCULATOR SETTINGS
        </h1>
        <p className="text-gray text-sm mt-1">
          Simple configuration for your public solar savings calculator.
        </p>
      </div>

      <Card className="p-8 shadow-card border border-gray-light">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-accent font-semibold mb-1">
                Base Turnkey Cost per kW (₹ / kW)
              </label>
              <Input
                type="number"
                value={form.perKwPrice}
                onChange={(e) => setForm({ ...form, perKwPrice: parseInt(e.target.value) || 0 })}
                placeholder="e.g. 45000"
                required
              />
              <span className="text-xs text-gray mt-1 block">Average system cost per 1 kW installation</span>
            </div>

            <div>
              <label className="block text-sm font-accent font-semibold mb-1">
                Base Electricity Rate (₹ / kWh unit)
              </label>
              <Input
                type="number"
                step="0.1"
                value={form.baseTariff}
                onChange={(e) => setForm({ ...form, baseTariff: parseFloat(e.target.value) || 0 })}
                placeholder="e.g. 8.5"
                required
              />
              <span className="text-xs text-gray mt-1 block">Local electricity tariff rate per unit</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-light">
            <div>
              <label className="block text-sm font-accent font-semibold mb-1">
                Required Roof Area per kW (sq. ft / kW)
              </label>
              <Input
                type="number"
                value={form.roofAreaSqFtPerKW}
                onChange={(e) => setForm({ ...form, roofAreaSqFtPerKW: parseInt(e.target.value) || 0 })}
                placeholder="e.g. 60"
                required
              />
              <span className="text-xs text-gray mt-1 block">Rooftop space needed per 1 kW solar panel</span>
            </div>

            <div>
              <label className="block text-sm font-accent font-semibold mb-1">
                Default Slider Electricity Bill (₹)
              </label>
              <Input
                type="number"
                value={form.defaultBillAmount}
                onChange={(e) => setForm({ ...form, defaultBillAmount: parseInt(e.target.value) || 0 })}
                placeholder="e.g. 6900"
                required
              />
              <span className="text-xs text-gray mt-1 block">Default bill amount pre-selected on calculator slider</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-light">
            <div>
              <label className="block text-sm font-accent font-semibold mb-1">
                Minimum Bill Limit (₹)
              </label>
              <Input
                type="number"
                value={form.minBillAmount}
                onChange={(e) => setForm({ ...form, minBillAmount: parseInt(e.target.value) || 0 })}
                placeholder="500"
              />
            </div>

            <div>
              <label className="block text-sm font-accent font-semibold mb-1">
                Maximum Bill Limit (₹)
              </label>
              <Input
                type="number"
                value={form.maxBillAmount}
                onChange={(e) => setForm({ ...form, maxBillAmount: parseInt(e.target.value) || 0 })}
                placeholder="50000"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-light flex justify-end">
            <Button
              type="submit"
              variant="primary"
              disabled={saving}
              className="bg-red hover:bg-black text-white px-8 py-3 flex items-center gap-2"
            >
              <FiSave /> <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </Button>
          </div>

        </form>
      </Card>
    </div>
  );
};

export default AdminSolarCalculatorConfig;
