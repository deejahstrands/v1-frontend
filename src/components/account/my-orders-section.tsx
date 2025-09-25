/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect, useRef } from 'react';
import { Package, ShoppingBag, Eye, MapPin, CreditCard, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Pagination } from '@/components/ui/pagination';
import { OrderDetails } from '@/components/orders/order-details';
import { useOrders } from '@/store/use-orders';

type OrderFilter = 'all' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const filterTabs = [
  { id: 'all' as OrderFilter, label: 'All Orders' },
  { id: 'processing' as OrderFilter, label: 'Processing' },
  { id: 'shipped' as OrderFilter, label: 'Shipped' },
  { id: 'delivered' as OrderFilter, label: 'Delivered' },
];

export function MyOrdersSection() {
  const { 
    orders, 
    loading, 
    error, 
    currentPage,
    meta,
    fetchOrders, 
    fetchOrder,
    setFilter,
    setPage,
    setSelectedOrder,
    clearError 
  } = useOrders();

  const [activeFilter, setActiveFilter] = useState<OrderFilter>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isLoadingOrderDetails, setIsLoadingOrderDetails] = useState(false);
  const hasFetchedRef = useRef(false);

  // Fetch orders on component mount
  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchOrders();
    }
  }, []);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleFilterChange = (filter: OrderFilter) => {
    setActiveFilter(filter);
    setFilter(filter);
    
    // Fetch orders with the new filter (reset to page 1)
    const filters = filter === 'all' ? { page: 1 } : { status: filter, page: 1 };
    fetchOrders(filters);
  };

  const handlePageChange = (page: number) => {
    setPage(page);
    
    // Fetch orders with the new page
    const filters = activeFilter === 'all' ? { page } : { status: activeFilter, page };
    fetchOrders(filters);
  };


  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(numPrice);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getOrderItemsText = (items: { itemName: string }[]) => {
    if (items.length === 1) {
      return items[0].itemName;
    }
    if (items.length === 2) {
      return `${items[0].itemName} and ${items[1].itemName}`;
    }
    return `${items[0].itemName} and ${items.length - 1} other items`;
  };

  const handleViewDetails = async (orderId: string) => {
    setIsLoadingOrderDetails(true);
    setSelectedOrderId(orderId);
    
    // Scroll to top when navigating to order details
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    try {
      await fetchOrder(orderId);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setIsLoadingOrderDetails(false);
    }
  };

  const handleBackToList = () => {
    setSelectedOrderId(null);
    setIsLoadingOrderDetails(false);
    // Clear any selected order from the store to prevent stale data
    setSelectedOrder(null);
  };

  // If an order is selected, show order details or loading
  if (selectedOrderId) {
    if (isLoadingOrderDetails || loading) {
      return (
        <div className="max-w-4xl mx-auto px-4 sm:px-0">
          {/* Breadcrumb */}
          <div className="mb-4 sm:mb-6">
            <nav className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
              <span>Home</span>
              <span>/</span>
              <span className="text-[#C9A898] font-medium">My Orders</span>
            </nav>
          </div>

          {/* Back Button */}
          <div className="mb-4 sm:mb-6">
            <Button
              onClick={handleBackToList}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 text-xs sm:text-sm"
            >
              <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
              <span>Back to Orders</span>
            </Button>
          </div>

          {/* Order Details Skeleton Loader */}
          <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="animate-pulse">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <div className="h-6 sm:h-8 bg-gray-200 rounded w-48 sm:w-64 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-32 sm:w-40"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20 sm:w-24"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  {[1, 2, 3, 4].map((i) => (
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

            {/* Order Items Skeleton */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="space-y-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                            <div className="flex-1">
                              <div className="h-4 sm:h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                            <div>
                              <div className="h-4 sm:h-5 bg-gray-200 rounded w-20 mb-1"></div>
                              <div className="h-3 bg-gray-200 rounded w-16"></div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Shipping Info Skeleton */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-gray-200 rounded mt-0.5"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
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
    
    return (
      <OrderDetails 
        orderId={selectedOrderId} 
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-0">
      {/* Breadcrumb */}
      <div className="mb-4 sm:mb-6">
        <nav className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
          <span>Home</span>
          <span>/</span>
          <span className="text-[#C9A898] font-medium">My Orders</span>
        </nav>
      </div>

      {/* Section Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
        <div className="flex items-center space-x-3">
          <Package className="text-[#C9A898] w-5 h-5 sm:w-6 sm:h-6" />
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">My Orders</h1>
        </div>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">Track and manage your orders</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleFilterChange(tab.id)}
              className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeFilter === tab.id
                  ? 'bg-[#C9A898] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Orders Content */}
      <div className="space-y-4">
        {loading ? (
          // Loading state
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="animate-pulse">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                      <div className="min-w-0 flex-1">
                        <div className="h-3 sm:h-4 bg-gray-200 rounded w-24 sm:w-32 mb-2"></div>
                        <div className="h-2 sm:h-3 bg-gray-200 rounded w-16 sm:w-20"></div>
                      </div>
                    </div>
                    <div className="h-5 sm:h-6 bg-gray-200 rounded w-16 sm:w-20 self-end sm:self-start"></div>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-full sm:w-3/4"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 sm:w-1/2"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-5/6 sm:w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : orders.length > 0 ? (
          // Show orders
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#C9A898] bg-opacity-10 flex items-center justify-center flex-shrink-0">
                    <ShoppingBag size={20} className="text-[#C9A898]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base break-words">Order #{order.orderId}</h3>
                    <p className="text-xs sm:text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                <div className="flex justify-end sm:justify-start">
                  <StatusBadge status={order.status} />
                </div>
              </div>

              {/* Order Details */}
              <div className="space-y-3 sm:space-y-4">
                {/* Items */}
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="w-2 h-2 bg-[#C9A898] rounded-full mt-2 flex-shrink-0"></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-600 break-words">
                      <span className="font-medium">{order.itemCount} item{order.itemCount > 1 ? 's' : ''}:</span> {getOrderItemsText(order.items)}
                    </p>
                  </div>
                </div>

                {/* Total Price */}
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-600">
                      <span className="font-medium">Total:</span> <span className="font-semibold text-gray-900">{formatPrice(order.totalPrice)}</span>
                    </p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0 sm:w-4 sm:h-4" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-600 break-words">
                      <span className="font-medium">Shipping to:</span> {order.shippingAddress}
                    </p>
                  </div>
                </div>

                {/* Payment Reference */}
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <CreditCard size={14} className="text-gray-400 mt-0.5 flex-shrink-0 sm:w-4 sm:h-4" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-600 break-words">
                      <span className="font-medium">Payment Ref:</span> {order.paymentReference}
                    </p>
                  </div>
                </div>

                {/* Delivery Note */}
                {order.deliveryNote && order.deliveryNote.trim() && (
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-gray-600 break-words">
                        <span className="font-medium">Note:</span> {order.deliveryNote}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Actions */}
              <div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(order.id)}
                  className="flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-start text-xs sm:text-sm py-2.5 sm:py-2"
                >
                  <Eye size={14} className="sm:w-4 sm:h-4" />
                  <span>View Details</span>
                </Button>
              </div>
            </div>
          ))
        ) : (
          // Empty state
          <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
            <ShoppingBag size={40} className="mx-auto text-gray-300 mb-4 sm:w-12 sm:h-12" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6 text-sm sm:text-base px-4">
              {activeFilter === 'all' 
                ? 'You currently have no orders. Check our collections to shop your favorite items.'
                : `No ${activeFilter} orders found.`
              }
            </p>
            {activeFilter === 'all' && (
              <Button className="bg-[#C9A898] hover:bg-[#b88b6d] w-full sm:w-auto text-sm sm:text-base">
                Start Shopping
              </Button>
            )}
          </div>
        )}

        {/* Pagination Info and Controls */}
        {meta && meta.totalItems > 0 && (
          <div className="mt-6 sm:mt-8">
            {/* Pagination Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4 text-xs sm:text-sm text-gray-600">
              <div className="text-center sm:text-left">
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, meta.totalItems)} of {meta.totalItems} orders
              </div>
              <div className="text-center sm:text-right">
                Page {currentPage} of {meta.totalPages}
              </div>
            </div>

            {/* Pagination Controls */}
            {meta.totalPages > 1 && (
              <Pagination
                totalPages={meta.totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                className="justify-center"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}