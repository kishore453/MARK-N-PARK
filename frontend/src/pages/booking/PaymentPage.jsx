import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, CreditCard, ArrowRight, AlertTriangle, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';

export default function PaymentPage() {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  // Fetch reservation details
  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const res = await api.get(`/reservations/${reservationId}`);
        if (res?.data) {
          setReservation(res.data);
          // If already confirmed, redirect to confirmation page
          if (res.data.reservationStatus === 'CONFIRMED') {
            navigate(`/confirmation/${reservationId}`, { replace: true });
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to retrieve reservation details');
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [reservationId, navigate]);

  // Handle Razorpay Payment Flow
  const handleInitiatePayment = async () => {
    setError('');
    setProcessing(true);

    try {
      // 1. Create Order on Backend
      const orderRes = await api.post('/payments/create-order', { reservationId });
      const orderData = orderRes?.data;

      if (!orderData) {
        throw new Error('Failed to create payment order on server');
      }

      // Check if real Razorpay key or test sandbox
      const isTestSandbox = !orderData.keyId || orderData.keyId.includes('placeholder');

      if (isTestSandbox) {
        // Safe Test Simulation with Backend HMAC Signature Verification
        // Calls real backend endpoint: /api/payments/verify
        const verifyRes = await api.post('/payments/verify', {
          reservationId: orderData.reservationId,
          razorpayOrderId: orderData.orderId,
          razorpayPaymentId: 'pay_test_' + Date.now(),
          razorpaySignature: 'test_signature_valid',
        });

        if (verifyRes?.data) {
          navigate(`/confirmation/${reservationId}`);
        }
        return;
      }

      // 2. Load Razorpay JS SDK dynamically
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = () => reject(new Error('Razorpay SDK failed to load.'));
          document.body.appendChild(script);
        });
      }

      // 3. Open Razorpay Checkout Modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'MARK N PARK',
        description: '25% Advance Parking Reservation',
        order_id: orderData.orderId,
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone || '',
        },
        theme: {
          color: '#FF5A1F',
        },
        handler: async function (response) {
          try {
            // 4. Verify Signature strictly on Backend
            const verifyRes = await api.post('/payments/verify', {
              reservationId: orderData.reservationId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verifyRes?.data) {
              navigate(`/confirmation/${reservationId}`);
            }
          } catch (verifyErr) {
            setError(verifyErr.message || 'Payment signature verification failed on backend.');
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        setError(resp.error.description || 'Payment was declined or cancelled.');
        setProcessing(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.message || 'Payment initiation failed.');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <LoadingState message="Connecting to secure payment gateway..." />
      </div>
    );
  }

  if (error && !reservation) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <ErrorState message={error} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Step Header */}
      <div>
        <span className="text-xs font-bold text-signal uppercase tracking-widest">
          STEP 2 OF 3: ADVANCE PAYMENT
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-bone-50 tracking-tight mt-1">
          Lock In Your Reservation
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Complete the 25% advance deposit to secure your bay.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-800/80 rounded-lg flex items-start gap-3 text-xs text-red-200">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Reservation Receipt Card */}
      <div className="bg-graphite-900 border border-graphite-800 rounded-lg p-6 space-y-6 shadow-xl">
        {/* Spot Details */}
        <div className="space-y-1 pb-4 border-b border-graphite-800">
          <span className="text-[10px] font-bold text-signal uppercase tracking-wider">
            RESERVED ZONE
          </span>
          <h2 className="text-lg font-bold text-bone-50">{reservation.parkingZoneName}</h2>
          <p className="text-xs text-neutral-400">{reservation.parkingZoneAddress}, {reservation.parkingZoneCity}</p>
        </div>

        {/* Schedule & Vehicle */}
        <div className="grid grid-cols-2 gap-4 text-xs pb-4 border-b border-graphite-800">
          <div>
            <span className="text-neutral-400 block">Date & Time</span>
            <span className="font-semibold text-bone-100 block mt-0.5">
              {reservation.date} • {reservation.startTime} - {reservation.endTime}
            </span>
          </div>
          <div>
            <span className="text-neutral-400 block">Assigned Vehicle</span>
            <span className="font-semibold text-bone-100 block mt-0.5">
              {reservation.vehicleName} ({reservation.vehicleNumber})
            </span>
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-neutral-300">
            <span>Gross Parking Tariff</span>
            <span className="font-semibold text-bone-50">₹{reservation.totalAmount}</span>
          </div>

          <div className="p-4 bg-signal/15 border border-signal/30 rounded-md flex justify-between items-center text-signal">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider">25% Advance Amount Due Now</span>
              <p className="text-[11px] font-normal opacity-90 mt-0.5">Secured with Razorpay Test Mode</p>
            </div>
            <span className="text-2xl font-extrabold">₹{reservation.advanceAmount}</span>
          </div>

          <div className="p-3 bg-graphite-850 border border-graphite-750 rounded text-xs flex justify-between text-neutral-400">
            <span>75% Remaining Balance Due Upon Arrival</span>
            <span className="font-bold text-bone-200">₹{reservation.remainingAmount}</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          <Button
            variant="primary"
            size="lg"
            className="w-full text-base"
            loading={processing}
            icon={CreditCard}
            onClick={handleInitiatePayment}
          >
            Pay ₹{reservation.advanceAmount} via Razorpay
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 pt-1">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>256-bit encrypted • HMAC-SHA256 signature verification enforced</span>
        </div>
      </div>
    </div>
  );
}
