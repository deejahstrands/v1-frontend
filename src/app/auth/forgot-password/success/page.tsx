'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

function ForgotPasswordSuccessForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    // Get email from URL params or localStorage
    const emailFromParams = searchParams.get('email');
    const emailFromStorage = typeof window !== 'undefined' ? localStorage.getItem('forgot_password_email') : null;
    
    setEmail(emailFromParams || emailFromStorage || 'your email');
    
    // Clean up localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('forgot_password_email');
    }
  }, [searchParams]);

  const handleBackToLogin = () => {
    router.push('/auth/login');
  };

  const handleResendEmail = () => {
    // You can implement resend functionality here if needed
    router.push('/auth/forgot-password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7] px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Check Your Email
            </h1>
            <p className="text-sm text-gray-600">
              We&apos;ve sent a password reset link to
            </p>
            <p className="text-sm font-medium text-gray-900 mt-1">
              {email}
            </p>
          </div>

          {/* Instructions */}
          <div className="mb-8">
            <p className="text-xs text-gray-600 leading-relaxed">
              Click the link in the email to reset your password. The link will expire in 1 hour for security reasons.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleBackToLogin}
              className="w-full"
            >
              Back to Login
            </Button>
            
            <button
              type="button"
              onClick={handleResendEmail}
              className="w-full text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Didn&apos;t receive the email? Try again
            </button>
          </div>

          {/* Additional Help */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Can&apos;t find the email? Check your spam folder or{' '}
              <button
                type="button"
                onClick={handleResendEmail}
                className="text-gray-600 hover:text-gray-900 underline"
              >
                try a different email address
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7] px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <ForgotPasswordSuccessForm />
    </Suspense>
  );
} 