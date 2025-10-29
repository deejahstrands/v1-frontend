/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Formik, Form, Field } from 'formik';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/store/use-auth';
import { useRouter } from 'next/navigation';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  onSuccess?: () => void;
}

export function LoginModal({ 
  open, 
  onClose, 
  title = "Login Required",
  onSuccess 
}: LoginModalProps) {
  const { toast } = useToast();
  const { login, isLoading, clearError } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: LoginFormData, { setSubmitting }: any) => {
    try {
      setIsSubmitting(true);
      clearError();
      
      await login({
        email: values.email,
        password: values.password,
      });
      
      toast.success("Welcome back! You have been successfully logged in.");
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Close the modal
      onClose();
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  const handleSignUpClick = () => {
    onClose();
    router.push('/auth/signup');
  };

  const handleForgotPasswordClick = () => {
    onClose();
    router.push('/auth/forgot-password');
  };

  return (
    <Modal open={open} onClose={onClose} size="md">
      <div className="p-6 lg:p-16">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <Image 
            src="/logo/auth-logo.svg" 
            alt="Logo" 
            width={48} 
            height={48} 
            className="mb-3" 
          />
          <h2 className="text-xl font-semibold text-center mb-1">{title}</h2>
          <p className="text-gray-500 text-center text-sm">Enter your details below</p>
        </div>
        
        {/* Form */}
        <Formik
          initialValues={{
            email: '',
            password: '',
            rememberMe: false,
          }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, handleChange, handleBlur, values }) => (
            <Form className="space-y-4">
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
                <button
                  type="button"
                  onClick={handleForgotPasswordClick}
                  className="text-gray-500 hover:underline"
                >
                  Forgot Password?
                </button>
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
        
        {/* Footer */}
        <div className="text-center text-sm mt-4">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={handleSignUpClick}
            className="font-semibold underline text-[#C9A898] hover:text-[#b88b6d]"
          >
            Sign Up
          </button>
        </div>
      </div>
    </Modal>
  );
} 