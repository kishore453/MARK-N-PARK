import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Shield, Trash2, Search } from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import LoadingState from '../../components/common/LoadingState';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      if (res?.data) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.patch(`/admin/users/${userId}/role?role=${newRole}`);
      await fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${name}"?`)) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      await fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.role?.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-graphite-800">
        <div>
          <span className="text-xs font-bold text-signal uppercase tracking-widest">
            ADMINISTRATION
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-bone-50 tracking-tight mt-1">
            User Accounts & Roles
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage authenticated seekers, property hosts, and platform administrators
          </p>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search by name, email or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-graphite-900 border border-graphite-800 rounded px-3 py-2 text-xs text-bone-50 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-signal"
          />
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading platform users registry..." />
      ) : (
        <div className="bg-graphite-900 border border-graphite-800 rounded-lg overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-graphite-850 border-b border-graphite-800 text-[10px] text-neutral-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-semibold">User / Name</th>
                  <th className="py-3 px-4 font-semibold">Email</th>
                  <th className="py-3 px-4 font-semibold">Phone</th>
                  <th className="py-3 px-4 font-semibold">Role</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-graphite-800">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-graphite-850/50">
                    <td className="py-3 px-4">
                      <div className="font-bold text-bone-50">{u.name}</div>
                      <div className="text-[10px] text-neutral-500 font-mono">ID: {u.id}</div>
                    </td>
                    <td className="py-3 px-4 text-neutral-300">{u.email}</td>
                    <td className="py-3 px-4 text-neutral-300">{u.phone || '—'}</td>
                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="bg-graphite-850 border border-graphite-750 text-bone-100 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-signal"
                      >
                        <option value="SEEKER">SEEKER</option>
                        <option value="HOST">HOST</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="p-1.5 text-neutral-400 hover:text-red-400 transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
