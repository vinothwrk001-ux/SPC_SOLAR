import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import SEOHead from '../../components/ui/SEOHead';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const QuotationPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (data) => {
    setIsLoading(true);
    
    // Construct WhatsApp message
    const message = `Hello SPC Solar! I am interested in a Solar Installation. Here are my details:
    
*Name:* ${data.name}
*Phone:* ${data.phone}
*Location:* ${data.location}, ${data.state}
*Connection Type:* ${data.connectionType}
*Avg Monthly Bill:* ₹${data.monthlyBill}

Please get back to me with a quotation.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "919025462326"; // Removed the + and spaces as per wa.me requirements
    
    // Open WhatsApp URL
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");
    
    setIsLoading(false);
  };

  return (
    <div className="bg-bg min-h-screen pb-20">
      <SEOHead 
        title="Get a Solar Quote | SPC Solar" 
        description="Request a free solar panel installation quote. Quick and easy submission directly to our WhatsApp."
      />
      
      <div className="bg-black py-16 text-center border-b-4 border-red">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-heading text-white mb-4">REQUEST A QUOTE</h1>
          <p className="text-gray-light font-body text-lg">
            Fill in your details below and we will get back to you immediately on WhatsApp with a customized solar proposal.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white p-8 rounded-card shadow-card border border-gray-light">
          <h2 className="text-2xl font-heading mb-6 border-b border-gray-light pb-4">YOUR DETAILS</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Location/City" 
                placeholder="Mumbai" 
                {...register('location', { required: 'Location is required' })} 
                error={errors.location} 
              />
              
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
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Other">Other</option>
                </select>
                {errors.state && <span className="text-red text-sm mt-1">{errors.state.message}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <Input 
                label="Average Monthly Bill (₹)" 
                type="number"
                placeholder="5000" 
                {...register('monthlyBill', { required: 'Monthly bill is required', min: 0 })} 
                error={errors.monthlyBill} 
              />
            </div>

            <Button type="submit" variant="primary" className="w-full h-12 text-lg" disabled={isLoading}>
              {isLoading ? 'Connecting...' : 'Submit via WhatsApp'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuotationPage;
