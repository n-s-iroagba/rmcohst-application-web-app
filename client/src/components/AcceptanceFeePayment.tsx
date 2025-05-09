
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

interface AcceptanceFeePaymentProps {
  applicationId: string;
  amount: number;
}

export default function AcceptanceFeePayment({ applicationId, amount }: AcceptanceFeePaymentProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`/api/applications/${applicationId}/acceptance-fee`, {
        amount,
        paymentMethod: 'card',
        cardDetails
      }, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });

      if (response.data.status === 'paid') {
        router.push(`/application/upgrade?id=${applicationId}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .substr(0, 5);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Acceptance Fee Payment</h2>
      <div className="mb-6">
        <p className="text-gray-600">Amount to pay:</p>
        <p className="text-2xl font-bold">₦{amount.toLocaleString()}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Card Number</label>
          <input
            type="text"
            maxLength={19}
            value={cardDetails.number}
            onChange={(e) => setCardDetails(prev => ({
              ...prev,
              number: formatCardNumber(e.target.value)
            }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="1234 5678 9012 3456"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
            <input
              type="text"
              maxLength={5}
              value={cardDetails.expiry}
              onChange={(e) => setCardDetails(prev => ({
                ...prev,
                expiry: formatExpiry(e.target.value)
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="MM/YY"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">CVC</label>
            <input
              type="text"
              maxLength={3}
              value={cardDetails.cvc}
              onChange={(e) => setCardDetails(prev => ({
                ...prev,
                cvc: e.target.value.replace(/\D/g, '')
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="123"
              required
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          {loading ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              Processing...
            </>
          ) : (
            'Pay Now'
          )}
        </button>
      </form>
    </div>
  );
}
