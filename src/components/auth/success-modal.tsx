'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface SuccessModalProps {
  title: string;
  description: string;
  buttonText?: string;
  onContinue?: () => void;
  showIcon?: boolean;
}

export function SuccessModal({ 
  title, 
  description, 
  buttonText = "Continue", 
  onContinue,
  showIcon = true 
}: SuccessModalProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {showIcon && (
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
            <Image 
              src="/check.svg" 
              alt="Success" 
              width={32} 
              height={32} 
              className="text-green-600"
            />
          </div>
        )}
        
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {title}
        </h2>
        
        <p className="text-gray-600 mb-8">
          {description}
        </p>
        
        <Button
          onClick={onContinue}
          className="w-full bg-[#C9A898] hover:bg-[#b88b6d] text-white"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
} 