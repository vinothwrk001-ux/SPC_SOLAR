import React from 'react';
import { useForm } from 'react-hook-form';
import Input from '../ui/Input';
import Button from '../ui/Button';

const QuotationForm = ({ onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <div className="bg-white p-6 rounded-card shadow-card">
      <h2 className="text-2xl font-heading mb-6 border-b border-gray-light pb-4">YOUR DETAILS</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Full Name" 
            placeholder="John Doe" 
            {...register('name', { required: 'Name is required' })} 
            error={errors.name} 
          />
          <Input 
            label="Phone Number" 
            placeholder="+91 9876543210" 
            {...register('phone', { required: 'Phone is required' })} 
            error={errors.phone} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Email Address" 
            type="email"
            placeholder="john@example.com" 
            {...register('email', { required: 'Email is required' })} 
            error={errors.email} 
          />
          <Input 
            label="Location/City" 
            placeholder="Mumbai" 
            {...register('location', { required: 'Location is required' })} 
            error={errors.location} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col w-full mb-4">
            <label className="mb-1 font-accent font-semibold text-black">State</label>
            <select 
              className="px-4 py-2 border border-gray-light focus:border-black outline-none rounded-btn"
              {...register('state', { required: 'State is required' })}
            >
              <option value="">Select State</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Delhi">Delhi</option>
              <option value="Other">Other</option>
            </select>
            {errors.state && <span className="text-red text-sm mt-1">{errors.state.message}</span>}
          </div>

          <div className="flex flex-col w-full mb-4">
            <label className="mb-1 font-accent font-semibold text-black">Connection Type</label>
            <select 
              className="px-4 py-2 border border-gray-light focus:border-black outline-none rounded-btn"
              {...register('connectionType', { required: 'Connection Type is required' })}
            >
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Average Monthly Bill (₹)" 
            type="number"
            placeholder="5000" 
            {...register('monthlyBill', { required: 'Monthly bill is required', min: 0 })} 
            error={errors.monthlyBill} 
          />
          <Input 
            label="Roof Area (sq ft) - Optional" 
            type="number"
            placeholder="1000" 
            {...register('roofArea')} 
          />
        </div>

        <div className="flex flex-col w-full mb-6">
          <label className="mb-1 font-accent font-semibold text-black">Phase</label>
          <select 
            className="px-4 py-2 border border-gray-light focus:border-black outline-none rounded-btn"
            {...register('phase')}
          >
            <option value="Single">Single Phase</option>
            <option value="Three">Three Phase</option>
          </select>
        </div>

        <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
          {isLoading ? 'Calculating...' : 'Generate Free Quotation'}
        </Button>
      </form>
    </div>
  );
};

export default QuotationForm;
