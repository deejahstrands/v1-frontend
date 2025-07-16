'use client';

import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function ForgotPasswordSuccessForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    // Try to get email from URL params first, then localStorage
    const emailFromParams = searchParams.get('email');
    const emailFromStorage = typeof window !== 'undefined' ? localStorage.getItem('forgot_password_email') : null;
    
    if (emailFromParams) {
      setUserEmail(emailFromParams);
    } else if (emailFromStorage) {
      setUserEmail(emailFromStorage);
    }
  }, [searchParams]);

  const handleBackToLogin = () => {
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7] px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Success Icon */}
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Check Your Email
            </h1>
            <p className="text-sm text-gray-600">
              We&apos;ve sent a password reset link to your email address.
            </p>
          </div>

          {/* Email Display */}
          {userEmail && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Email sent to:</p>
              <p className="text-sm font-medium text-gray-900">{userEmail}</p>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              What to do next:
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Check your email inbox</li>
              <li>• Click the password reset link</li>
              <li>• Create a new password</li>
              <li>• Sign in with your new password</li>
            </ul>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleBackToLogin}
            className="w-full"
          >
            Back to Login
          </Button>

          {/* Additional Help */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              Didn&apos;t receive the email? Check your spam folder.
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