'use client';

import { Formik, Form } from 'formik';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/use-auth';
import * as Yup from 'yup';

const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email address'),
});

type ForgotPasswordFormData = {
  email: string;
};

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { forgotPassword } = useAuth();

  const handleSubmit = async (values: ForgotPasswordFormData, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      await forgotPassword(values.email);
      
      // Store email for success page
      if (typeof window !== 'undefined') {
        localStorage.setItem('forgot_password_email', values.email);
      }
      
      // Redirect to success page
      router.push(`/auth/forgot-password/success?email=${encodeURIComponent(values.email)}`);
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { message?: string } } };
      const errorMessage = apiError?.response?.data?.message || "There was an error sending the reset email. Please try again.";
      
      toast({
        variant: "destructive",
        title: "Failed to Send",
        description: errorMessage,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7] px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Forgot Password?
            </h1>
            <p className="text-xs text-gray-600">
              Enter the email associated with your account. We will send you a link to reset your password.
            </p>
          </div>

          {/* Form */}
          <Formik
            initialValues={{
              email: '',
            }}
            validationSchema={forgotPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting, handleChange, handleBlur, values }) => (
              <Form className="space-y-6">
                <Input
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="Enter Email Address"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && errors.email ? errors.email : undefined}
                />
                
                <Button
                  type="submit"
                  className="w-full"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Continue'}
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