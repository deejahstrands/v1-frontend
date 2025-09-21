'use client';

import { useState } from 'react';
import { MessageCircle, Calendar, Clock, CheckCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock data - replace with actual API call
const mockConsultations = [
  {
    id: '1',
    type: 'Hair Consultation',
    method: 'Virtual consultation',
    status: 'Completed',
    date: 'March 20, 2024 at 2:00 PM',
    duration: '30 minutes',
    location: null,
    notes: 'Discussed hair texture, styling preferences, and recommended products for curly hair care.'
  },
  {
    id: '2',
    type: 'Follow-up Consultation',
    method: 'In-person consultation',
    status: 'Upcoming',
    date: 'March 25, 2024 at 10:00 AM',
    duration: '45 minutes',
    location: 'Deejah Strands Studio, Victoria Island',
    notes: null
  }
];

export function ConsultationSection() {
  const [consultations, setConsultations] = useState(mockConsultations);

  // For testing - toggle between having consultations and empty state
  const toggleConsultations = () => {
    setConsultations(prev => prev.length > 0 ? [] : mockConsultations);
  };

  const handleBookConsultation = () => {
    // TODO: Open booking modal/form
    console.log('Book consultation');
  };

  const handleReschedule = (consultationId: string) => {
    // TODO: Open reschedule modal
    console.log('Reschedule consultation:', consultationId);
  };

  const handleCancel = (consultationId: string) => {
    setConsultations(prev => prev.filter(consultation => consultation.id !== consultationId));
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
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageCircle className="text-[#C9A898]" size={24} />
            <h1 className="text-2xl font-semibold text-gray-900">My Consultations</h1>
          </div>
          <div className="flex items-center space-x-2">
            {/* Test toggle button - remove in production */}
            <Button 
              onClick={toggleConsultations}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              {consultations.length > 0 ? 'Show Empty' : 'Show Consultations'}
            </Button>
            <Button 
              onClick={handleBookConsultation}
              className="bg-[#C9A898] hover:bg-[#b88b6d]"
            >
              <Plus size={16} className="mr-2" />
              Book Consultation
            </Button>
          </div>
        </div>
        <p className="text-gray-600 mt-2">Schedule and manage your hair consultations</p>
      </div>

      {/* Consultations Content */}
      <div className="space-y-4">
        {consultations.length > 0 ? (
          // Show consultations if user has any
          consultations.map((consultation) => (
            <div key={consultation.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    consultation.status === 'Completed' 
                      ? 'bg-[#C9A898] bg-opacity-10' 
                      : 'bg-blue-100'
                  }`}>
                    <MessageCircle 
                      size={20} 
                      className={consultation.status === 'Completed' ? 'text-[#C9A898]' : 'text-blue-600'} 
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{consultation.type}</h3>
                    <p className="text-sm text-gray-500">{consultation.method}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-sm rounded-full flex items-center ${
                  consultation.status === 'Completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {consultation.status === 'Completed' && <CheckCircle size={14} className="mr-1" />}
                  {consultation.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-gray-400" />
                  <span>{consultation.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock size={16} className="text-gray-400" />
                  <span>{consultation.duration}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                {consultation.notes && (
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Consultation Notes:</strong> {consultation.notes}
                  </p>
                )}
                {consultation.location && (
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Location:</strong> {consultation.location}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <button className="text-[#C9A898] hover:text-[#b88b6d] text-sm font-medium">
                    View Details
                  </button>
                  {consultation.status === 'Upcoming' && (
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReschedule(consultation.id)}
                      >
                        Reschedule
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleCancel(consultation.id)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          // Show empty state if user has no consultations
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No consultations yet</h3>
            <p className="text-gray-500 mb-6">Book a consultation to get personalized hair advice from our experts.</p>
            <Button 
              onClick={handleBookConsultation}
              className="bg-[#C9A898] hover:bg-[#b88b6d]"
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
