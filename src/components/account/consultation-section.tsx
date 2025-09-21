/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect } from 'react';
import { MessageCircle, Calendar, Clock, CheckCircle, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useConsultation } from '@/store/use-consultation';
import { useRouter } from 'next/navigation';

export function ConsultationSection() {
  const { 
    consultations, 
    consultationsLoading, 
    consultationsError, 
    fetchConsultations
  } = useConsultation();
  const router = useRouter();

  // Fetch consultations on mount
  useEffect(() => {
    fetchConsultations({ status: 'active' });
  }, []);

  const handleBookConsultation = () => {
    router.push('/consultation');
  };


  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
              onClick={() => fetchConsultations({ status: 'active' })}
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
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    consultation.status === 'completed' 
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
                  <button className="text-[#C9A898] hover:text-[#b88b6d] text-sm font-medium">
                    View Details
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
