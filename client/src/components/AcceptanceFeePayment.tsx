
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AcceptanceFeePaymentProps {
  applicationId: string;
  amount: number;
}

export default function AcceptanceFeePayment({ applicationId, amount }: AcceptanceFeePaymentProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/applications/${applicationId}/acceptance-fee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }

      const data = await response.json();
      setSuccess(true);
      
      // Redirect to student upgrade after successful payment
      router.push(`/application/upgrade?id=${applicationId}`);
    } catch (err) {
      setError('Failed to process payment. Please try again.');
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold">Acceptance Fee Payment</h2>
      
      <div className="border-t border-b py-4">
        <div className="flex justify-between items-center">
          <span>Acceptance Fee:</span>
          <span className="font-medium" data-testid="payment-amount">
            ₦{amount.toLocaleString()}
          </span>
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm" role="alert">
          {error}
        </div>
      )}

      {success ? (
        <div className="text-green-600" data-testid="payment-success">
          Payment successful! Redirecting to student profile setup...
        </div>
      ) : (
        <button
          onClick={handlePayment}
          disabled={loading}
          data-testid="pay-button"
          className={`w-full py-2 px-4 rounded-md text-white font-medium 
            ${loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      )}
    </div>
  );
}
