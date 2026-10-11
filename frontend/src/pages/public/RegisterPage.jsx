import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Mail, User, Phone, ArrowRight, ShieldCheck, Compass } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [role, setRole] = useState('SEEKER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'HOST') {
      setRole('HOST');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await register({ name, email, password, role, phone });
      if (user.role === 'HOST') {
        navigate('/host', { replace: true });
      } else {
        navigate('/search', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please check the provided information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 bg-graphite-900 border border-graphite-800 p-8 rounded-lg shadow-xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-signal rounded shadow-sm text-white font-extrabold text-xl">
            M
          </div>
          <h2 className="text-2xl font-extrabold text-bone-50 tracking-tight">
            Create your Account
          </h2>
          <p className="text-xs text-neutral-400">
            Join MARK N PARK as a parking seeker or hosting partner
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-graphite-950 rounded border border-graphite-800">
          <button
            type="button"
            onClick={() => setRole('SEEKER')}
            className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded transition-colors ${
              role === 'SEEKER'
                ? 'bg-signal text-white shadow-sm'
                : 'text-neutral-400 hover:text-bone-100'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Parking Seeker
          </button>
          <button
            type="button"
            onClick={() => setRole('HOST')}
            className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded transition-colors ${
              role === 'HOST'
                ? 'bg-signal text-white shadow-sm'
                : 'text-neutral-400 hover:text-bone-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Parking Host
          </button>
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
            label="Full Name"
            type="text"
            icon={User}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />

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
            label="Password (min 6 characters)"
            type="password"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
            autoComplete="new-password"
          />

          <Input
            label="Phone Number"
            type="tel"
            icon={Phone}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              loading={loading}
              icon={ArrowRight}
            >
              Register as {role === 'HOST' ? 'Host' : 'Seeker'}
            </Button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-graphite-800">
          <p className="text-xs text-neutral-400">
            Already have an account?{' '}
            <Link to="/login" className="text-signal hover:underline font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
