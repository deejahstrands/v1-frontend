'use client';

import { Formik, Form } from 'formik';
import { PasswordInput } from '@/components/ui/password-input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/store/use-auth';
import { useEffect, useState, Suspense } from 'react';
import * as Yup from 'yup';

const resetPasswordSchema = Yup.object({
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], "Passwords don't match"),
});

type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

function ResetPasswordForm() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword } = useAuth();
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    // Get token from URL parameters
    const tokenFromParams = searchParams.get('token');
    if (tokenFromParams) {
      setToken(tokenFromParams);
    } else {
      // If no token, redirect to forgot password page
      toast.error("This reset link is invalid or has expired. Please request a new password reset.");
      router.push('/auth/forgot-password');
    }
  }, [searchParams, router, toast]);

  const handleSubmit = async (values: ResetPasswordFormData, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    if (!token) {
      toast.error("Reset token is missing. Please request a new password reset.");
      return;
    }

    try {
      await resetPassword(token, values.password);
      
      toast.success("Your password has been successfully reset. You can now log in with your new password.");
      
      // Redirect to login page after successful reset
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { message?: string } } };
      const errorMessage = apiError?.response?.data?.message || "There was an error resetting your password. Please try again.";
      
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Don't render the form if there's no token
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7] px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7] px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Create a new password
            </h1>
            <p className="text-sm text-gray-600">
              Create a new password to continue. This password will be used to log into your account.
            </p>
          </div>

          {/* Form */}
          <Formik
            initialValues={{
              password: '',
              confirmPassword: '',
            }}
            validationSchema={resetPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting, handleChange, handleBlur, values }) => (
              <Form className="space-y-6">
                <PasswordInput
                  name="password"
                  label="Enter New Password"
                  placeholder="Enter your password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && errors.password ? errors.password : undefined}
                />
                
                <PasswordInput
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="Enter your password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : undefined}
                />
                
                <Button
                  type="submit"
                  className="w-full"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Resetting...' : 'Continue'}
                </Button>
              </Form>
            )}
          </Formik>

          {/* Back to login link */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => router.push('/auth/login')}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
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
      <ResetPasswordForm />
    </Suspense>
  );
} 