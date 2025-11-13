/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Calendar, Clock, CheckCircle, Plus, Loader2, ArrowLeft, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/store/use-auth';
import { useRouter, useSearchParams } from 'next/navigation';

export function ConsultationSection() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    consultations,
    consultationsLoading,
    consultationsError,
    getUserConsultations
  } = useAuth();

  const [selectedConsultationId, setSelectedConsultationId] = useState<string | null>(null);
  const [isLoadingConsultationDetails, setIsLoadingConsultationDetails] = useState(false);
  const hasFetchedRef = useRef(false);

  // Check for consultationId in URL on component mount
  useEffect(() => {
    const consultationIdFromUrl = searchParams.get('consultationId');
    if (consultationIdFromUrl) {
      setSelectedConsultationId(consultationIdFromUrl);
      handleViewDetails(consultationIdFromUrl);
    } else if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      getUserConsultations({ page: 1, limit: 5 });
    }
  }, [searchParams]);

  // Fetch consultations on component mount if no consultationId in URL
  useEffect(() => {
    if (!hasFetchedRef.current && !searchParams.get('consultationId')) {
      hasFetchedRef.current = true;
      getUserConsultations({ page: 1, limit: 5 });
    }
  }, []);

  const handleBookConsultation = () => {
    router.push('/consultation');
  };

  const handleViewDetails = async (consultationId: string) => {
    setIsLoadingConsultationDetails(true);
    setSelectedConsultationId(consultationId);

    // Update URL with query parameter
    router.push(`/account#consultation?consultationId=${consultationId}`);

    // Scroll to top when navigating to consultation details
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      // For now, we'll simulate loading since we don't have a specific consultation fetch method
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error fetching consultation details:', error);
    } finally {
      setIsLoadingConsultationDetails(false);
    }
  };

  const handleBackToList = () => {
    setSelectedConsultationId(null);
    setIsLoadingConsultationDetails(false);

    // Clear query parameter from URL
    router.push('/account#consultation');
  };


  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'TBD';
    // If the date string is already formatted (e.g., "Thursday, November 20, 2025"), return it as is
    // Otherwise, format it
    if (dateString.includes(',')) {
      return dateString;
    }
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: string) => {
    return `₦${parseInt(price).toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // If a consultation is selected, show consultation details or loading
  if (selectedConsultationId) {
    if (isLoadingConsultationDetails || consultationsLoading) {
      return (
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Home</span>
              <span>/</span>
              <span className="text-[#C9A898] font-medium">Consultation</span>
            </nav>
          </div>

          {/* Back Button */}
          <div className="mb-6">
            <Button
              onClick={handleBackToList}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <ArrowLeft size={16} />
              <span>Back to Consultations</span>
            </Button>
          </div>

          {/* Consultation Details Skeleton Loader */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="animate-pulse">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-gray-200 rounded"></div>
                      <div>
                        <div className="h-3 bg-gray-200 rounded w-12 mb-1"></div>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Find the selected consultation
    const selectedConsultation = consultations.find(c => c.id === selectedConsultationId);

    if (!selectedConsultation) {
      return (
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              onClick={handleBackToList}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <ArrowLeft size={16} />
              <span>Back to Consultations</span>
            </Button>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Consultation not found</h3>
            <p className="text-gray-500">The consultation you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Home</span>
            <span>/</span>
            <span className="text-[#C9A898] font-medium">Consultation</span>
          </nav>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={handleBackToList}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Back to Consultations</span>
          </Button>
        </div>

        {/* Consultation Details */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedConsultation.status === 'completed'
                ? 'bg-[#C9A898] bg-opacity-10'
                : 'bg-blue-100'
                }`}>
                <MessageCircle
                  size={24}
                  className={selectedConsultation.status === 'completed' ? 'text-[#C9A898]' : 'text-blue-600'}
                />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{selectedConsultation.consultationType.name}</h1>
                <p className="text-gray-500">Consultation Details</p>
              </div>
            </div>
            <span className={`px-3 py-1 text-sm rounded-full flex items-center w-fit ${getStatusColor(selectedConsultation.status)}`}>
              {selectedConsultation.status === 'completed' && <CheckCircle size={16} className="mr-1" />}
              {selectedConsultation.status.charAt(0).toUpperCase() + selectedConsultation.status.slice(1)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Calendar size={20} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{formatDate(selectedConsultation.date)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock size={20} className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium">{selectedConsultation.time || 'TBD'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-400 text-xl">₦</span>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium">{formatPrice(selectedConsultation.amount)}</p>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="mt-6 space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Consultation Type</h3>
              <p className="text-gray-600">{selectedConsultation.consultationType.name}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Status</h3>
              <p className="text-gray-600 capitalize">{selectedConsultation.status}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <span>Home</span>
          <span>/</span>
          <span className="text-[#C9A898] font-medium">Consultation</span>
        </nav>
      </div>

      {/* Section Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <MessageCircle className="text-[#C9A898]" size={24} />
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">My Consultations</h1>
              <p className="text-gray-600 text-sm sm:text-base">Schedule and manage your hair consultations</p>
            </div>
          </div>
          <Button
            onClick={handleBookConsultation}
            className="bg-[#C9A898] hover:bg-[#b88b6d] w-full sm:w-auto"
          >
            <Plus size={16} className="mr-2" />
            Book Consultation
          </Button>
        </div>
      </div>

      {/* Consultations Content */}
      <div className="space-y-4">
        {consultationsLoading ? (
          // Loading state
          <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#C9A898] mb-4" />
            <p className="text-gray-600 text-sm sm:text-base">Loading consultations...</p>
          </div>
        ) : consultationsError ? (
          // Error state
          <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
            <MessageCircle size={48} className="mx-auto text-red-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load consultations</h3>
            <p className="text-gray-500 mb-6 text-sm sm:text-base px-4">{consultationsError}</p>
            <Button
              onClick={() => getUserConsultations({ page: 1, limit: 5 })}
              className="bg-[#C9A898] hover:bg-[#b88b6d] w-full sm:w-auto"
            >
              Try Again
            </Button>
          </div>
        ) : consultations.length > 0 ? (
          // Show consultations if user has any
          consultations.map((consultation) => (
            <div key={consultation.id} className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${consultation.status === 'completed'
                    ? 'bg-[#C9A898] bg-opacity-10'
                    : 'bg-blue-100'
                    }`}>
                    <MessageCircle
                      size={20}
                      className={consultation.status === 'completed' ? 'text-[#C9A898]' : 'text-blue-600'}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base break-words">{consultation.consultationType.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Consultation</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs sm:text-sm rounded-full flex items-center w-fit ${getStatusColor(consultation.status)}`}>
                  {consultation.status === 'completed' && <CheckCircle size={14} className="mr-1" />}
                  {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-gray-400 flex-shrink-0" />
                  <span className="break-words">{formatDate(consultation.date)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock size={16} className="text-gray-400 flex-shrink-0" />
                  <span className="break-words">{consultation.time || 'TBD'}</span>
                </div>
                <div className="flex items-center space-x-2 sm:col-span-2 lg:col-span-1">
                  <span className="text-gray-400 flex-shrink-0">₦</span>
                  <span className="font-medium break-words">{formatPrice(consultation.amount)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleViewDetails(consultation.id)}
                    className="text-[#C9A898] hover:text-[#b88b6d] text-sm font-medium flex items-center space-x-1"
                  >
                    <Eye size={14} />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Show empty state if user has no consultations
          <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
            <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No consultations yet</h3>
            <p className="text-gray-500 mb-6 text-sm sm:text-base px-4">Book a consultation to get personalized hair advice from our experts.</p>
            <Button
              onClick={handleBookConsultation}
              className="bg-[#C9A898] hover:bg-[#b88b6d] w-full sm:w-auto"
            >
              <Plus size={16} className="mr-2" />
              Book Consultation
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
