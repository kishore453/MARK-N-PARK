import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else if (user.role === 'HOST') {
        navigate('/host', { replace: true });
      } else {
        navigate('/search', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-graphite-900 border border-graphite-800 p-8 rounded-lg shadow-xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-signal rounded shadow-sm text-white font-extrabold text-xl">
            M
          </div>
          <h2 className="text-2xl font-extrabold text-bone-50 tracking-tight">
            Sign In to MARK N PARK
          </h2>
          <p className="text-xs text-neutral-400">
            Access your reservations, parking zones, and marketplace activity
          </p>
        </div>

        {/* Demo Fast-Fill Bar */}
        <div className="bg-graphite-850 p-3 rounded border border-graphite-750">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-signal" /> Quick Demo Credentials:
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => fillCredentials('seeker@marknpark.com', 'Seeker@12345')}
              className="text-[11px] px-2 py-1 bg-graphite-800 hover:bg-graphite-700 text-bone-200 rounded border border-graphite-700 transition-colors"
            >
              Seeker
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('host@marknpark.com', 'Host@12345')}
              className="text-[11px] px-2 py-1 bg-graphite-800 hover:bg-graphite-700 text-bone-200 rounded border border-graphite-700 transition-colors"
            >
              Host
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('admin@marknpark.com', 'Admin@12345')}
              className="text-[11px] px-2 py-1 bg-graphite-800 hover:bg-graphite-700 text-bone-200 rounded border border-graphite-700 transition-colors"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800/60 rounded text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full"
            loading={loading}
            icon={ArrowRight}
          >
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-graphite-800">
          <p className="text-xs text-neutral-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-signal hover:underline font-semibold">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
