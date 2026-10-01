import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import SEOHead from '../../components/ui/SEOHead';
import Logo from '../../assets/Logo.png';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    
    if (success) {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SEOHead title="Admin Login | SPC Solar" description="SPC Solar Admin Portal Login" />
      
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-card shadow-card border border-gray-light border-t-4 border-t-red">
        <div className="flex flex-col items-center text-center">
          <img src={Logo} alt="SPC Solar Logo" className="h-16 w-auto object-contain" />
          <h2 className="mt-6 text-2xl font-heading text-gray">Admin Portal Login</h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <Input 
              label="Email address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@spcsolar.com"
            />
            <Input 
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div>
            <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
