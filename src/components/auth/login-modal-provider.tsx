'use client';

import { LoginModal } from './login-modal';
import { useLoginModal } from '@/hooks/use-login-modal';

export function LoginModalProvider() {
  const { isOpen, title, onSuccess, closeModal } = useLoginModal();

  return (
    <LoginModal
      open={isOpen}
      onClose={closeModal}
      title={title}
      onSuccess={onSuccess}
    />
  );
} 