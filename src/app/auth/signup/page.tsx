'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Formik, Form } from 'formik';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Button } from '@/components/ui/button';
import { signupSchema, type SignupFormData } from '@/lib/validations/auth';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/store/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function UserSignupPage() {
  const { toast } = useToast();
  const { signup, isLoading, clearError } = useAuth();
  const router = useRouter();

  // Clear error on component mount
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (values: SignupFormData, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      await signup({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      });
      
      // Store email in localStorage for resend functionality
      if (typeof window !== 'undefined') {
        localStorage.setItem('signup_email', values.email);
      }
      
      // Redirect to success page with email as query param
      router.push(`/auth/success/account-created?email=${encodeURIComponent(values.email)}`);
    } catch {
      toast.error("There was an error creating your account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Form Side */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 py-8 bg-white">
        <div className="w-full max-w-md mx-auto">
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-14 h-14 bg-[#C9A898] rounded-full flex items-center justify-center mb-4">
                <span className="text-white font-bold text-lg">DS</span>
              </div>
            </Link>
            <h2 className="text-2xl font-semibold text-center mb-1">Welcome to Deejah Strands</h2>
            <p className="text-gray-500 text-center mb-6">Enter your details below to setup your account.</p>
          </div>
          
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={signupSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting, handleChange, handleBlur, values }) => (
              <Form className="bg-[#F7F9FC] rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="firstName"
                    type="text"
                    label="First Name"
                    placeholder="Enter your first name"
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.firstName && errors.firstName ? errors.firstName : undefined}
                  />
                  
                  <Input
                    name="lastName"
                    type="text"
                    label="Last Name"
                    placeholder="Enter your last name"
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.lastName && errors.lastName ? errors.lastName : undefined}
                  />
                </div>
                
                <Input
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="Enter your email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && errors.email ? errors.email : undefined}
                />
                
                <PasswordInput
                  name="password"
                  label="Password"
                  placeholder="Create a password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && errors.password ? errors.password : undefined}
                />
                
                <PasswordInput
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : undefined}
                />
                
                <Button
                  type="submit"
                  className="w-full"
                  loading={isSubmitting || isLoading}
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting || isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </Form>
            )}
          </Formik>
          
          <div className="text-center text-sm mt-4">
            Already have an account? <a href="/auth/login" className="font-semibold underline">Sign In</a>
          </div>
        </div>
        <footer className="mt-8 text-xs text-gray-400 text-center w-full">
          Copyright &copy; {new Date().getFullYear()} Deejah Strands
        </footer>
      </div>
      
      {/* Right: Image Side (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 relative bg-[#F7F9FC] overflow-hidden">
        {/* Background pattern overlay */}
        <Image src="/pattern.svg" alt="Pattern" fill className="absolute inset-0 object-cover opacity-40 z-40" />
        {/* Main image card flush right */}
        <div className="relative z-10 w-full h-full flex items-center justify-end">
                      <div className="relative w-full h-full overflow-hidden flex items-end">
              <Image src="https://res.cloudinary.com/dhnanmyf3/image/upload/v1753709757/16_gappbe.jpg" alt="Signup Visual" fill className="object-cover w-full h-full" />
              {/* Dark overlay for better pattern visibility */}
              <div className="absolute inset-0 bg-black/30 z-10"></div>
              {/* Content overlays on image card */}
              <div className="absolute inset-0 z-20 p-6 flex flex-col justify-between">
              {/* Top content with stars */}
              <div className="flex items-center gap-2">
                <Image src="/stars.svg" alt="Stars" width={24} height={24} className="text-yellow-400" />
                <Image src="/stars.svg" alt="Stars" width={20} height={20} className="text-yellow-400" />
              </div>
              
              {/* Bottom content */}
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  Get the Hair You Deserve
                </h3>
                <p className="text-white text-sm md:text-base opacity-90">
                  Create your account to unlock exclusive access to luxury wigs, expert consultations, and effortless beauty tailored just for you.
                </p>
                
                {/* Rating section */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-white font-semibold">5.0</span>
                  <span className="text-white text-sm opacity-75">from 200+ reviews</span>
                </div>
                
                {/* Customer avatars */}
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 