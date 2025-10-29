"use client";

import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { PriceInput } from '@/components/ui/price-input';
import { fittingService, PrivateFitting } from '@/services/admin/fitting.service';
import { processingTimeService, ProcessingTime } from '@/services/admin/processing-time.service';

interface DeliveryPreferenceProps {
  selectedFittings: string[];
  selectedProcessingTimes: string[];
  fittingPrices: Record<string, string>;
  processingTimePrices: Record<string, string>;
  onFittingChange: (fittingId: string, checked: boolean) => void;
  onProcessingTimeChange: (timeId: string, checked: boolean) => void;
  onFittingPriceChange: (fittingId: string, price: string) => void;
  onProcessingTimePriceChange: (timeId: string, price: string) => void;
}

export const ProductDeliveryPreference: React.FC<DeliveryPreferenceProps> = ({
  selectedFittings,
  selectedProcessingTimes,
  fittingPrices,
  processingTimePrices,
  onFittingChange,
  onProcessingTimeChange,
  onFittingPriceChange,
  onProcessingTimePriceChange
}) => {
  // State for API data
  const [fittings, setFittings] = useState<PrivateFitting[]>([]);
  const [processingTimes, setProcessingTimes] = useState<ProcessingTime[]>([]);
  const [isLoadingFittings, setIsLoadingFittings] = useState(false);
  const [isLoadingProcessingTimes, setIsLoadingProcessingTimes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load fittings and processing times
  useEffect(() => {
    const loadData = async () => {
      // Only load if we don't have data yet
      if (fittings.length > 0 && processingTimes.length > 0) return;
      
      try {
        setIsLoadingFittings(true);
        setIsLoadingProcessingTimes(true);
        setError(null);

        const [fittingsResponse, processingTimesResponse] = await Promise.all([
          fittingService.getFittings(),
          processingTimeService.getProcessingTimes()
        ]);

        setFittings(fittingsResponse.data);
        setProcessingTimes(processingTimesResponse.data);
      } catch (err) {
        console.error('Error loading delivery preferences:', err);
        setError('Failed to load delivery preferences');
      } finally {
        setIsLoadingFittings(false);
        setIsLoadingProcessingTimes(false);
      }
    };

    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Get price for a fitting
  const getFittingPrice = (fittingId: string) => {
    return fittingPrices[fittingId] || '';
  };

  // Get price for a processing time
  const getProcessingTimePrice = (timeId: string) => {
    return processingTimePrices[timeId] || '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delivery Preference</h3>
        <p className="text-sm text-gray-500">
          Choose how long this product takes to make and which fitting options are available to customers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Processing Times */}
        <div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Default Processing Time
            </h4>
            
            {isLoadingProcessingTimes ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Loading processing times...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">{error}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {processingTimes.map((time) => (
                  <div key={time.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Checkbox
                      id={time.id}
                      checked={selectedProcessingTimes.includes(time.id)}
                      onCheckedChange={(checked) => onProcessingTimeChange(time.id, checked)}
                      className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                    />
                    <div className="flex-1 min-w-0">
                      <label
                        htmlFor={time.id}
                        className="text-sm font-medium text-gray-900 cursor-pointer"
                      >
                        {time.label}
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        {time.timeRange}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Fitting Options */}
        <div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Fitting Options
            </h4>
            
            {isLoadingFittings ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Loading fitting options...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">{error}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {fittings.map((fitting) => (
                  <div key={fitting.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Checkbox
                      id={fitting.id}
                      checked={selectedFittings.includes(fitting.id)}
                      onCheckedChange={(checked) => onFittingChange(fitting.id, checked)}
                      className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                    />
                    <div className="flex-1 min-w-0">
                      <label
                        htmlFor={fitting.id}
                        className="text-sm font-medium text-gray-900 cursor-pointer"
                      >
                        {fitting.name}
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        {fitting.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Configure Options & Pricing */}
      {(selectedFittings.length > 0 || selectedProcessingTimes.length > 0) && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">
            Configure Options & Pricing
          </h4>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Processing Time Pricing */}
            {selectedProcessingTimes.length > 0 && (
              <div>
                <h5 className="text-md font-semibold text-gray-900 mb-4">Processing Time Pricing</h5>
                <div className="space-y-4">
                  {selectedProcessingTimes.map((timeId) => {
                    const time = processingTimes.find(t => t.id === timeId);
                    if (!time) return null;

                    return (
                      <div key={timeId} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 border border-gray-100 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <label className="text-sm font-medium text-gray-900">
                            {time.label}
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            {time.timeRange}
                          </p>
                        </div>
                        <div className="w-full sm:w-40 flex-shrink-0">
                          <PriceInput
                            value={getProcessingTimePrice(timeId)}
                            onChange={(price) => onProcessingTimePriceChange(timeId, price)}
                            placeholder="0"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Fitting Options Pricing */}
            {selectedFittings.length > 0 && (
              <div>
                <h5 className="text-md font-semibold text-gray-900 mb-4">Fitting Options Pricing</h5>
                <div className="space-y-4">
                  {selectedFittings.map((fittingId) => {
                    const fitting = fittings.find(f => f.id === fittingId);
                    if (!fitting) return null;

                    return (
                      <div key={fittingId} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 border border-gray-100 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <label className="text-sm font-medium text-gray-900">
                            {fitting.name}
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            {fitting.location}
                          </p>
                        </div>
                        <div className="w-full sm:w-40 flex-shrink-0">
                          <PriceInput
                            value={getFittingPrice(fittingId)}
                            onChange={(price) => onFittingPriceChange(fittingId, price)}
                            placeholder="0"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
