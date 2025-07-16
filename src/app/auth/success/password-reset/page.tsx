'use client';

import { SuccessModal } from '@/components/auth/success-modal';
import { useRouter } from 'next/navigation';

export default function PasswordResetSuccessPage() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/auth/login');
  };

  return (
    <SuccessModal
      title="Password reset successfully"
      description="Your password has been changed successfully, proceed to login with your new password"
      buttonText="Continue"
      onContinue={handleContinue}
    />
  );
} 