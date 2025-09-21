/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect } from 'react';
import { BannerSection } from '@/components/common/banner-section';
import { SectionContainer } from '@/components/common/section-container';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useConsultation } from '@/store/use-consultation';
import { useAuth } from '@/store/use-auth';
import { useRouter } from 'next/navigation';

export default function ConsultationClient() {
  const { 
    consultationTypes, 
    selectedConsultation, 
    setSelectedConsultation, 
    loading, 
    error, 
    fetchConsultationTypes,
    bookConsultation,
    isBooking,
    bookingError,
    clearBookingError
  } = useConsultation();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Fetch consultation types on mount
  useEffect(() => {
    fetchConsultationTypes({ status: 'active' });
  }, []);

  const handleBookConsultation = async () => {
    if (!selectedConsultation) return;

    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push('/auth/login?returnUrl=/consultation');
      return;
    }

    try {
      const callbackUrl = `${process.env.NEXT_PUBLIC_CHECKOUT_SUCCESS_URL}/consultation/success`;
      const cancelUrl = `${process.env.NEXT_PUBLIC_CHECKOUT_CANCEL_URL}/consultation/failed`;
      
      if (!callbackUrl || !cancelUrl) {
        throw new Error('Consultation URLs not configured');
      }

      await bookConsultation({
        consultationTypeId: selectedConsultation.id,
        callbackUrl,
        cancelUrl,
      });
    } catch (error) {
      console.error('Failed to book consultation:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Section */}
      <BannerSection
        title="BOOK YOUR WIG CONSULTATION"
        description="Get personalized expert advice tailored to your look, lifestyle, and legacy. In-studio, virtual, or from the comfort of your home."
        breadcrumb={
          <div className="text-xs text-white/80">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-2"> / </span>
            <span className="text-white">Consultation</span>
          </div>
        }
        bgImage="/images/banner.svg"
      />

      {/* Main Content */}
      <div className="py-12">
        <SectionContainer>
          {/* Main Content - Full Width */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.2
            }}
          >
            <div className="">
              <h2 className="text-2xl font-semibold text-[#344054] mb-4">
                NEW TO WIGS OR NOT SURE WHAT TO CHOOSE?
              </h2>
              
              <p className="text-gray-700 mb-6">
                Let us help you feel confident, beautiful, and informed.
              </p>
              
              <p className="text-gray-700 mb-6">
                At Deejah Strands, our consultations are designed to make your wig journey simple, stress-free, and perfectly tailored to your needs. Whether you&apos;re new to wigs, exploring new styles, or just need expert advice, we&apos;ve got you.
              </p>
              
              <p className="text-gray-700 mb-6">
                Consultations can be booked virtually or in-person at our Lagos Studio.
              </p>

              {/* What you'll get section */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-[#344054] mb-4">
                  During your 1-on-1 consultation, you&apos;ll receive:
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span>A personalized walk-through of our premium wig options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span>Accurate head measurements to ensure the perfect fit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span>A calm, supportive space to ask anything and feel seen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span>Transparent guidance on what works best for you — including pros & cons of materials, lace types, and wig construction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span>Advice on textures, lace types, lengths, densities, and styles that best suit your look and lifestyle</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span>An open Q&A session — no rush, just honest answers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span>An exclusive ₦5,000 voucher toward your first wig purchase</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Image and Consultation Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8">
            {/* Salon Image */}
            <motion.div 
              className="lg:col-span-7"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.4
              }}
            >
              <div className="">
                <Image
                  src="https://res.cloudinary.com/dhnanmyf3/image/upload/v1753709582/03_r5ltmy.png"
                  width={600}
                  height={400}
                  alt="Luxury Salon Interior"
                  className="w-full h-auto rounded-lg object-cover"
                />
              </div>
            </motion.div>

            {/* Right Column - Consultation Booking */}
            <motion.div 
              className="lg:col-span-5 space-y-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.6
              }}
            >
              {/* Consultation Type Selection */}
              <motion.div 
                className="bg-white rounded-xl p-6 border border-[#98A2B3] w-full max-w-md mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: 0.8
                }}
              >
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#344054] mb-2">
                    WIG CONSULTATION
                  </h3>
                  <p className="text-sm text-gray-600">
                    Choose your consultation type
                  </p>
                </div>

                {/* Consultation Type Tabs */}
                <div className="space-y-3">
                  {loading ? (
                    // Loading skeleton
                    <>
                      {[1, 2].map((i) => (
                        <div key={i} className="w-full p-4 rounded-lg border-2 border-gray-200 animate-pulse">
                          <div className="flex justify-between items-start mb-2">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                          </div>
                          <div className="h-3 bg-gray-200 rounded w-32"></div>
                        </div>
                      ))}
                    </>
                  ) : error ? (
                    <div className="text-center py-4">
                      <p className="text-red-600 text-sm">Failed to load consultation types</p>
                      <button 
                        onClick={() => fetchConsultationTypes({ status: 'active' })}
                        className="text-primary text-sm underline mt-2"
                      >
                        Try again
                      </button>
                    </div>
                  ) : consultationTypes.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-gray-500 text-sm">No consultation types available</p>
                    </div>
                  ) : (
                    consultationTypes.map((type) => {
                      const isSelected = selectedConsultation?.id === type.id;
                      const price = parseInt(type.price);
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setSelectedConsultation(type)}
                          className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left cursor-pointer ${
                            isSelected
                              ? 'border-[#C9A18A] bg-[#C9A18A] text-white'
                              : 'border-[#98A2B3] hover:border-[#C9A18A] hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-sm">{type.name}</span>
                            <span className="text-sm font-semibold">₦{price.toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-gray-600">
                            Professional {type.name.toLowerCase()} consultation
                          </p>
                        </button>
                      );
                    })
                  )}
                </div>

                {selectedConsultation && (
                  <div className="mt-4 p-3 bg-secondary/5 rounded-lg border border-secondary/20 cursor-pointer">
                    <div className="text-sm font-medium text-secondary">
                      Selected: {selectedConsultation.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      Price: ₦{parseInt(selectedConsultation.price).toLocaleString()}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Book Consultation Button */}
              {selectedConsultation && (
                <div className="w-full max-w-md mx-auto">
                  {/* Action Button */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleBookConsultation}
                      disabled={isBooking}
                      className="w-full flex-1 flex items-center justify-center gap-2 bg-[#C9A18A] hover:bg-[#b88b6d] text-white font-semibold rounded-lg py-3 text-base transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isBooking ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          Book Consultation - ₦{parseInt(selectedConsultation.price).toLocaleString()}
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Booking Error */}
                  {bookingError && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700 text-center">
                        {bookingError}
                      </p>
                      <button 
                        onClick={clearBookingError}
                        className="text-red-600 text-sm underline mt-2 block mx-auto"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}

                  {/* Booking Info */}
                  <div className="mt-4 text-xs text-gray-600 text-center">
                    {!isAuthenticated ? (
                      <span className="text-amber-600">
                        You need to be logged in to book a consultation
                      </span>
                    ) : (
                      "You'll be redirected to a secure payment page"
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </SectionContainer>
      </div>
    </div>
  );
}
