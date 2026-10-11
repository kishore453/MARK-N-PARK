import React from 'react';
import { User, Mail, Phone, Shield, Calendar, Clock, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div>
        <span className="text-xs font-bold text-signal uppercase tracking-widest">
          ACCOUNT SETTINGS
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-bone-50 tracking-tight mt-1">
          User Profile
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Identity credentials, active permissions and marketplace profile
        </p>
      </div>

      <div className="bg-graphite-900 border border-graphite-800 rounded-lg p-6 space-y-6 shadow-xl">
        {/* User Card */}
        <div className="flex items-center gap-4 pb-6 border-b border-graphite-800">
          <div className="w-16 h-16 rounded-full bg-signal text-white font-extrabold text-2xl flex items-center justify-center shadow-lg">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-bone-50">{user.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2.5 py-0.5 rounded bg-graphite-800 border border-graphite-700 text-signal font-bold uppercase tracking-wider">
                {user.role}
              </span>
              <span className="text-xs text-neutral-400 font-mono">ID: {user.id}</span>
            </div>
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-graphite-850 rounded border border-graphite-750 space-y-1">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-signal" /> Verified Email Address
            </span>
            <p className="text-sm font-semibold text-bone-100">{user.email}</p>
          </div>

          <div className="p-4 bg-graphite-850 rounded border border-graphite-750 space-y-1">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-signal" /> Registered Phone
            </span>
            <p className="text-sm font-semibold text-bone-100">{user.phone || 'Not provided'}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-graphite-800 flex justify-end">
          <Button variant="outline" size="sm" icon={LogOut} onClick={logout}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
