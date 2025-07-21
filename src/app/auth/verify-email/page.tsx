'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/store/use-auth';

function EmailVerificationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { verifyEmail } = useAuth();
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    const verifyEmailToken = async () => {
      if (!token) {
        setError('Invalid verification link. Please check your email for the correct link.');
        return;
      }

      try {
        await verifyEmail(token);
        setIsVerified(true);
        toast.success("Your email has been verified successfully. You can now access all features of your account.");
        
        // Redirect to success page after a short delay
        setTimeout(() => {
          router.push('/auth/success/email-verified');
        }, 2000);
      } catch (error: unknown) {
        const apiError = error as { response?: { data?: { message?: string } } };
        const errorMessage = apiError?.response?.data?.message || "Failed to verify email. Please try again.";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    };

    verifyEmailToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7] px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            {/* Error Icon */}
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Failed
            </h1>
            <p className="text-sm text-gray-600 mb-6">
              {error}
            </p>
            <button
              onClick={() => router.push('/auth/login')}
              className="w-full bg-[#C9A898] hover:bg-[#b88b6d] text-white py-2 px-4 rounded-lg font-medium"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7] px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            {/* Success Icon */}
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Email Verified Successfully!
            </h1>
            <p className="text-sm text-gray-600 mb-6">
              Your email has been verified successfully. Redirecting you to the home page...
            </p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#C9A898] mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7] px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9A898] mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Verifying Your Email
          </h1>
          <p className="text-sm text-gray-600">
            Please wait while we verify your email address...
          </p>
        </div>
      </div>
    </div>
  );
}

export default function EmailVerificationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7] px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9A898] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <EmailVerificationForm />
    </Suspense>
  );
} 