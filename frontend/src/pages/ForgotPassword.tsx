import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/authServices';
import { Mail, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const response = await forgotPassword(email);
      setMessage(response.data.message);
      toast.success('Request sent!');
    } catch (error) {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Forgot Password</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email to receive a password reset link.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!message ? (
            <>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div>
                  <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center p-4 bg-emerald-50 text-emerald-800 rounded-lg">
              <p>{message}</p>
            </div>
          )}
        </form>
        <div className="text-center">
          <p className="text-sm">
            <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
              ← Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;