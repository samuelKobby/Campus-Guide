import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Lock, User } from 'lucide-react';

export const PharmacyLogin: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Clear auth state when component mounts
  useEffect(() => {
    localStorage.removeItem('pharmacyId');
    localStorage.removeItem('pharmacyName');
    localStorage.removeItem('userRole');
    // Notify context of auth change
    window.dispatchEvent(new Event('pharmacyAuthChange'));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clear any existing auth data
      localStorage.removeItem('pharmacyId');
      localStorage.removeItem('pharmacyName');
      localStorage.removeItem('userRole');

      // Call our custom pharmacy auth function
      const { data, error: rpcError } = await supabase
        .rpc('pharmacy_user_auth', {
          username: credentials.username,
          password: credentials.password
        });

      if (rpcError) throw rpcError;

      if (!data.success) {
        throw new Error(data.message || 'Invalid username or password');
      }

      // Store pharmacy data
      localStorage.setItem('pharmacyId', data.user.pharmacy_id);
      localStorage.setItem('pharmacyName', data.user.pharmacy_name);
      localStorage.setItem('userRole', 'pharmacy');
      
      // Check if this is the first login (using the default password pattern)
      const isDefaultPassword = credentials.password.startsWith('Pharm') && credentials.password.endsWith('123');
      if (isDefaultPassword) {
        localStorage.setItem('requirePasswordChange', 'true');
      }

      // Dispatch custom event to notify context of auth change
      window.dispatchEvent(new Event('pharmacyAuthChange'));

      toast.success('Login successful!');
      
      // If using default password, redirect to password change page
      if (isDefaultPassword) {
        navigate('/pharmacy/change-password', { replace: true });
      } else {
        // Navigate to dashboard and prevent going back to login
        navigate('/pharmacy/dashboard', { replace: true });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pharm-login">
      <div className="pharm-login-overlay" />
      <div className="pharm-login-particles" />
      <div className="pharm-login-scanlines" />
      <div className="pharm-login-layout">
        <div className="pharm-login-content">
          <div className="pharm-login-logo">
            <img src="/images/1.png" alt="Campus Guide" className="pharm-login-logo-mark" />
            <div className="pharm-login-logo-text">
              <span className="pharm-login-brand">CampusGuide</span>
              <span className="pharm-login-tag">Pharmacy Portal</span>
            </div>
          </div>

          <div className="pharm-login-copy">
            <p className="pharm-login-overline">Pharmacy Access</p>
            <h1 className="pharm-login-title">Secure staff sign-in</h1>
            <p className="pharm-login-subtitle">Authenticate to manage inventory.</p>
          </div>

          <form className="pharm-login-form" onSubmit={handleSubmit}>
            <div className="pharm-login-field">
              <User className="pharm-login-icon" />
              <input
                id="username"
                name="username"
                type="text"
                required
                value={credentials.username}
                onChange={handleChange}
                className="pharm-login-input"
                placeholder="Username"
              />
            </div>

            <div className="pharm-login-field">
              <Lock className="pharm-login-icon" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={credentials.password}
                onChange={handleChange}
                className="pharm-login-input"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="pharm-login-eye"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="pharm-login-button"
            >
              {loading ? (
                <span className="pharm-login-button-inner">
                  <span className="pharm-login-spinner" />
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>

            <div className="pharm-login-links">
              <button type="button" className="pharm-login-forgot">Forgot password?</button>
              <button type="button" onClick={() => navigate('/')} className="pharm-login-back">Back to Home</button>
            </div>
          </form>

          <div className="pharm-login-note">
            <p>
              <span className="pharm-login-note-label">First time logging in?</span> Temporary password:
              <span className="pharm-login-note-code">Pharm[YourPharmacyName]123</span>
            </p>
            <p className="pharm-login-note-sub">You will be prompted to change this password after your first login.</p>
          </div>
          <p className="pharm-login-disclaimer">This is a secure area. Only authorized pharmacy staff may access this portal.</p>
        </div>
        <div className="pharm-login-spacer" />
      </div>
    </div>
  );
};

export default PharmacyLogin;
