/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/common/button';
import { OrderStatusModal } from '@/components/admin/order-status-modal';
import { useSingleOrder } from '@/hooks/admin/use-single-order';
import { ArrowLeft, Edit, Package, User, MapPin, Clock } from 'lucide-react';
import Image from 'next/image';

// Move refs outside component to persist across re-renders
const loadedOrderIds = new Set<string>();

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;


  const {
    currentOrder,
    isLoading,
    isUpdating,
    error,
    clearError,
    loadOrder,
    updateOrderStatus,
  } = useSingleOrder();

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  // Load order on mount - prevent duplicate calls
  useEffect(() => {
    if (orderId && !loadedOrderIds.has(orderId)) {
      loadedOrderIds.add(orderId);
      loadOrder(orderId);
    }
  }, [orderId]);

  // Handle status update
  const handleStatusUpdate = () => {
    setIsStatusModalOpen(true);
  };

  // Handle confirm status update
  const handleConfirmStatusUpdate = async (newStatus: string) => {
    if (!currentOrder) return;

    try {
      const success = await updateOrderStatus(currentOrder.id, { status: newStatus as any });
      if (success) {
        setIsStatusModalOpen(false);
        // Reload the order to get updated data
        loadOrder(orderId);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Format currency
  const formatCurrency = (amount: string) => {
    const numAmount = parseInt(amount);
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(numAmount);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="w-full mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentOrder) {
    return (
      <div className="w-full mx-auto">
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Order Not Found</h3>
          <p className="text-gray-500 mb-4">
            {error || 'The order you are looking for does not exist.'}
          </p>
          <Button onClick={() => router.push('/admin/orders')}>
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto max-w-7xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="tertiary"
            onClick={() => router.push('/admin/orders')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold mb-1">Order Details</h1>
            <p className="text-gray-500 text-sm lg:text-base">Order ID: {currentOrder.orderId}</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentOrder.status)}`}>
              {currentOrder.status.charAt(0).toUpperCase() + currentOrder.status.slice(1)}
            </span>
            <Button
              onClick={handleStatusUpdate}
              className="flex items-center gap-2 w-full sm:w-auto"
              disabled={isUpdating}
            >
              <Edit className="w-4 h-4" />
              Update Status
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Order Information */}
        <div className="xl:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold">Customer Information</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-gray-900 font-medium">{currentOrder.user.firstName} {currentOrder.user.lastName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900 break-all">{currentOrder.user.email}</p>
              </div>
              {currentOrder.user.phone && (
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900">{currentOrder.user.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold">Order Items ({currentOrder.itemCount})</h2>
            </div>
            <div className="space-y-4">
              {currentOrder.items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {item.thumbnal && (
                      <Image
                        src={item.thumbnal}
                        alt={item.itemName}
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 mb-2">{item.itemName}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Quantity:</span>
                          <span className="ml-2 font-medium">{item.quantity}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Base Price:</span>
                          <span className="ml-2 font-medium">{formatCurrency(item.basePrice)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Total Price:</span>
                          <span className="ml-2 font-medium">{formatCurrency(item.totalPrice)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Type:</span>
                          <span className="ml-2 font-medium">{item.itemType}</span>
                        </div>
                      </div>

                      {/* Customizations */}
                      {item.customizations && item.customizations.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Customizations:</h4>
                          <div className="space-y-1">
                            {item.customizations.map((customization, idx) => (
                              <div key={idx} className="text-sm text-gray-600">
                                {customization.type}: {customization.option} (+{formatCurrency(customization.price?.toString() || '0')})
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Private Fitting */}
                      {item.privateFitting && item.privateFitting.name && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Private Fitting:</h4>
                          <div className="text-sm text-gray-600">
                            {item.privateFitting.name} (+{formatCurrency(item.privateFitting.price?.toString() || '0')})
                          </div>
                        </div>
                      )}

                      {/* Processing Time */}
                      {item.processingTime && item.processingTime.name && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Processing Time:</h4>
                          <div className="text-sm text-gray-600">
                            {item.processingTime.name} (+{formatCurrency(item.processingTime.price?.toString() || '0')})
                          </div>
                        </div>
                      )}

                      {/* Measurements */}
                      {item.measurements && Object.keys(item.measurements).length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Measurements:</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                            {item.measurements.earToEar && (
                              <div>Ear to Ear: {item.measurements.earToEar}</div>
                            )}
                            {item.measurements.headCircumference && (
                              <div>Head Circumference: {item.measurements.headCircumference}</div>
                            )}
                          </div>
                          {item.measurements.harlineImages && item.measurements.harlineImages.length > 0 && (
                            <div className="mt-2">
                              <h5 className="text-xs font-medium text-gray-600 mb-1">Hairline Images:</h5>
                              <div className="flex flex-wrap gap-2">
                                {item.measurements.harlineImages.map((image, idx) => (
                                  <Image
                                    key={idx}
                                    src={image}
                                    alt={`Hairline ${idx + 1}`}
                                    width={60}
                                    height={60}
                                    className="w-15 h-15 rounded object-cover"
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                          {item.measurements.wigStyleImages && item.measurements.wigStyleImages.length > 0 && (
                            <div className="mt-2">
                              <h5 className="text-xs font-medium text-gray-600 mb-1">Wig Style Images:</h5>
                              <div className="flex flex-wrap gap-2">
                                {item.measurements.wigStyleImages.map((image, idx) => (
                                  <Image
                                    key={idx}
                                    src={image}
                                    alt={`Wig Style ${idx + 1}`}
                                    width={60}
                                    height={60}
                                    className="w-15 h-15 rounded object-cover"
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Order ID:</span>
                <span className="font-mono text-sm break-all">{currentOrder.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Ref:</span>
                <span className="font-mono text-sm break-all">{currentOrder.paymentReference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Items:</span>
                <span className="font-medium">{currentOrder.itemCount}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                <span>Total Amount:</span>
                <span className="text-green-600">{formatCurrency(currentOrder.totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MapPin className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-lg font-semibold">Shipping Information</h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Address</label>
                <p className="text-gray-900 mt-1 text-sm leading-relaxed">{currentOrder.shippingAddress}</p>
              </div>
              {currentOrder.deliveryNote && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Delivery Note</label>
                  <p className="text-gray-900 mt-1 text-sm italic">&quot;{currentOrder.deliveryNote}&quot;</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold">Order Timeline</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">Order Created</p>
                  <p className="text-xs text-gray-500">
                    {new Date(currentOrder.createdAt).toLocaleString('en-US', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${currentOrder.status === 'processing' ||
                    currentOrder.status === 'shipped' ||
                    currentOrder.status === 'completed'
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
                  }`}></div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">Processing</p>
                  <p className="text-xs text-gray-500">
                    {currentOrder.status === 'processing' ||
                      currentOrder.status === 'shipped' ||
                      currentOrder.status === 'completed'
                      ? 'In Progress'
                      : 'Pending'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${currentOrder.status === 'shipped' ||
                    currentOrder.status === 'completed'
                    ? 'bg-purple-500'
                    : 'bg-gray-300'
                  }`}></div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">Shipped</p>
                  <p className="text-xs text-gray-500">
                    {currentOrder.status === 'shipped' ||
                      currentOrder.status === 'completed'
                      ? 'Completed'
                      : 'Pending'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${currentOrder.status === 'completed'
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                  }`}></div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">Delivered</p>
                  <p className="text-xs text-gray-500">
                    {currentOrder.status === 'completed'
                      ? 'Completed'
                      : 'Pending'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error handling */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={clearError}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Status Update Modal */}
      <OrderStatusModal
        open={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onConfirm={handleConfirmStatusUpdate}
        currentStatus={currentOrder.status}
        orderId={currentOrder.orderId}
        isLoading={isUpdating}
      />
    </div>
  );
}
