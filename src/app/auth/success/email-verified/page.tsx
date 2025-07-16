'use client';

import { SuccessModal } from '@/components/auth/success-modal';
import { useRouter } from 'next/navigation';

export default function EmailVerifiedSuccessPage() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/');
  };

  return (
    <SuccessModal
      title="Email verified successfully"
      description="Your email has been verified successfully. You can now access all features of your account."
      buttonText="Continue"
      onContinue={handleContinue}
    />
  );
} 