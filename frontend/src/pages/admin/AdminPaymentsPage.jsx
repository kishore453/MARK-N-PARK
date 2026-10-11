import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import LoadingState from '../../components/common/LoadingState';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get('/admin/payments');
        if (res?.data) {
          setPayments(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin payments', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-graphite-800">
        <div>
          <span className="text-xs font-bold text-signal uppercase tracking-widest">
            FINANCIAL AUDIT
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-bone-50 tracking-tight mt-1">
            Payment Transactions & Gateway Logs
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Captured Razorpay order receipts, payment IDs, amounts, and settlement status
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Fetching payment ledger transactions..." />
      ) : (
        <div className="bg-graphite-900 border border-graphite-800 rounded-lg overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-graphite-850 border-b border-graphite-800 text-[10px] text-neutral-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-semibold">Payment ID</th>
                  <th className="py-3 px-4 font-semibold">Reservation Ref</th>
                  <th className="py-3 px-4 font-semibold">Razorpay Order ID</th>
                  <th className="py-3 px-4 font-semibold">Razorpay Payment ID</th>
                  <th className="py-3 px-4 font-semibold">Amount Captured</th>
                  <th className="py-3 px-4 font-semibold">Gateway Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-graphite-800">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-neutral-400">
                      No payment transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p.id} className="hover:bg-graphite-850/50">
                      <td className="py-3 px-4 font-mono font-bold text-bone-200">
                        #{p.id.substring(0, 8).toUpperCase()}
                      </td>
                      <td className="py-3 px-4 font-mono text-signal">
                        #{p.reservationId?.substring(0, 8).toUpperCase()}
                      </td>
                      <td className="py-3 px-4 font-mono text-neutral-300">
                        {p.razorpayOrderId}
                      </td>
                      <td className="py-3 px-4 font-mono text-neutral-300">
                        {p.razorpayPaymentId}
                      </td>
                      <td className="py-3 px-4 font-extrabold text-emerald-400 text-sm">
                        ₹{p.amount}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
