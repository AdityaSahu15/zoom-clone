'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created! Welcome aboard 🎉');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        {/* Card Container */}
        <div className="bg-white border border-gray-200 rounded-[20px] shadow-sm p-10 flex flex-col items-stretch select-none">
          
          {/* Zoom Workplace Branding */}
          <div className="flex items-center justify-center gap-1.5 mb-8 select-none">
            <span className="text-[#0E71EB] text-4xl font-extrabold tracking-tighter">zoom</span>
            <span className="bg-[#0E71EB] text-white text-[9px] uppercase font-bold tracking-widest px-1 py-0.5 rounded-[3px] mt-2">workplace</span>
          </div>

          <h2 className="text-xl font-bold text-center text-[#232333] mb-6">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                id="register-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0E71EB] focus:ring-1 focus:ring-[#0E71EB] transition-colors"
                autoComplete="name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Name@company.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0E71EB] focus:ring-1 focus:ring-[#0E71EB] transition-colors"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0E71EB] focus:ring-1 focus:ring-[#0E71EB] transition-colors"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-[#0E71EB] hover:bg-[#005BCC] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Redirect to signin */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <span>Already have an account? </span>
            <Link href="/login" className="text-[#0E71EB] font-bold hover:underline">
              Sign In
            </Link>
          </div>

          <p className="text-center text-[10px] text-gray-400 mt-6 leading-relaxed">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>

        </div>
      </div>
    </div>
  );
}
