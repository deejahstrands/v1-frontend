'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/store/use-auth';

interface ApiError {
  response?: {
    data?: {
      message?: string;
      name?: string;
    };
  };
}

function AccountCreatedSuccessForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { resendVerification } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    // Try to get email from URL params first, then localStorage
    const emailFromParams = searchParams.get('email');
    const emailFromStorage = typeof window !== 'undefined' ? localStorage.getItem('signup_email') : null;
    
    if (emailFromParams) {
      setUserEmail(emailFromParams);
    } else if (emailFromStorage) {
      setUserEmail(emailFromStorage);
    }
  }, [searchParams]);

  const handleContinue = () => {
    router.push('/');
  };

  const handleResendEmail = async () => {
    if (!userEmail) {
      toast({
        variant: "destructive",
        title: "Email Not Found",
        description: "Unable to find your email address. Please try signing up again.",
      });
      return;
    }

    setIsResending(true);
    try {
      await resendVerification(userEmail);
      
      toast({
        variant: "success",
        title: "Email Sent",
        description: "Verification email has been resent to your inbox.",
      });
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = apiError?.response?.data?.message || "There was an error sending the email. Please try again.";
      
      // Handle specific error cases
      if (apiError?.response?.data?.name === 'UserAlreadyVerifiedError') {
        toast({
          variant: "destructive",
          title: "Already Verified",
          description: "Your email is already verified. You can now log in to your account.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to Resend",
          description: errorMessage,
        });
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Content Side */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 py-8 bg-white">
        <div className="w-full max-w-md mx-auto text-center">
          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <Image 
              src="/check.svg" 
              alt="Success" 
              width={40} 
              height={40} 
              className="text-green-600"
            />
          </div>
          
          {/* Content */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Account Created Successfully!
          </h1>
          
          <p className="text-gray-600 mb-8 text-lg">
            Welcome to Deejah Strands! Your account has been created successfully.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Verify Your Email
            </h3>
            <p className="text-blue-700 mb-4">
              We&apos;ve sent a verification email to your inbox. Please check your email and click the verification link to complete your account setup.
            </p>
            <Button
              onClick={handleResendEmail}
              disabled={isResending}
              variant="outline"
              className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              {isResending ? 'Sending...' : 'Resend Verification Email'}
            </Button>
          </div>
          
          <div className="space-y-4">
            <Button
              onClick={handleContinue}
              className="w-full bg-[#C9A898] hover:bg-[#b88b6d] text-white"
            >
              Continue to Home
            </Button>
            
            <p className="text-sm text-gray-500">
              Didn&apos;t receive the email? Check your spam folder or try resending.
            </p>
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
            <Image src="https://res.cloudinary.com/dwpetnbf1/image/upload/v1750945539/16_nbayoa.jpg" alt="Success Visual" fill className="object-cover w-full h-full" />
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
                  Welcome to the Family!
                </h3>
                <p className="text-white text-sm md:text-base opacity-90">
                  Your account is ready. Verify your email to unlock exclusive access to luxury wigs, expert consultations, and personalized beauty solutions.
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

export default function AccountCreatedSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AccountCreatedSuccessForm />
    </Suspense>
  );
} 