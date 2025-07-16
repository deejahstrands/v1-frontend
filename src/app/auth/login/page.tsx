/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';
import { Formik, Form, Field } from 'formik';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Button } from '@/components/ui/button';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/store/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function UserLoginPage() {
  const { toast } = useToast();
  const { login, isLoading, clearError } = useAuth();
  const router = useRouter();

  // Clear error on component mount
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (values: LoginFormData, { setSubmitting }: any) => {
    try {
      await login({
        email: values.email,
        password: values.password,
      });
      
      toast({
        variant: "success",
        title: "Login Successful",
        description: "Welcome back! You have been successfully logged in.",
      });
      
      // Redirect to home page or dashboard
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.response?.data?.message || "Invalid email or password. Please try again.",
      });
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
            <Image src="/logo/auth-logo.svg" alt="Logo" width={56} height={56} className="mb-4" />
            <h2 className="text-2xl font-semibold text-center mb-1">Welcome back</h2>
            <p className="text-gray-500 text-center mb-6">Welcome back! Please enter your details.</p>
          </div>
          
          <Formik
            initialValues={{
              email: '',
              password: '',
              rememberMe: false,
            }}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting, handleChange, handleBlur, values }) => (
              <Form className="bg-[#F7F9FC] rounded-xl p-6 space-y-4">
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
                  placeholder="Enter your password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && errors.password ? errors.password : undefined}
                />
                
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2">
                    <Field
                      type="checkbox"
                      name="rememberMe"
                      className="rounded border-gray-300 text-[#C9A898] focus:ring-[#C9A898]"
                    />
                    Remember Me
                  </label>
                  <a href="/auth/forgot-password" className="text-gray-500 hover:underline">Forgot Password?</a>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  loading={isSubmitting || isLoading}
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting || isLoading ? 'Signing in...' : 'Continue'}
                </Button>
              </Form>
            )}
          </Formik>
          
          <div className="text-center text-sm mt-4">
            Don&apos;t have an account? <a href="/auth/signup" className="font-semibold underline">Sign Up</a>
          </div>
        </div>
        <footer className="mt-8 text-xs text-gray-400 text-center w-full">
          Copyright &copy; {new Date().getFullYear()} Deejah Strands
        </footer>
      </div>
      
      {/* Right: Image Side (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 py-12 pr-12 relative bg-[#F7F9FC] overflow-hidden">
        {/* Background pattern overlay */}
        <Image src="/images/background-pattern.svg" alt="Pattern" fill className="absolute inset-0 object-cover opacity-40 z-0" />
        {/* Main image card flush right */}
        <div className="relative z-10 w-full h-full flex items-center justify-end">
          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg flex items-end">
            <Image src="https://res.cloudinary.com/dwpetnbf1/image/upload/v1750945494/03_cqknsn.png" alt="Login Visual" fill className="object-cover w-full h-full" />
            {/* Caption overlays on image card */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-6 backdrop-blur-2xl bg-secondary/30 text-white text-sm md:text-base rounded-b-2xl">
              <p>Explore our curated collections, and get personalized hair recommendations — all in one place.<br />Because you deserve a hair experience as flawless as you are.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 