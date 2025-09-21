/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import { Package, ShoppingBag, Eye, MapPin, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Pagination } from '@/components/ui/pagination';
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
    setFilter,
    setPage,
    clearError 
  } = useOrders();

  const [activeFilter, setActiveFilter] = useState<OrderFilter>('all');

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
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

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <span>Home</span>
          <span>/</span>
          <span className="text-[#C9A898] font-medium">My Orders</span>
        </nav>
      </div>

      {/* Section Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center space-x-3">
          <Package className="text-[#C9A898]" size={24} />
          <h1 className="text-2xl font-semibold text-gray-900">My Orders</h1>
        </div>
        <p className="text-gray-600 mt-2">Track and manage your orders</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleFilterChange(tab.id)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
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
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="animate-pulse">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : orders.length > 0 ? (
          // Show orders
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
              {/* Order Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#C9A898] bg-opacity-10 flex items-center justify-center">
                    <ShoppingBag size={20} className="text-[#C9A898]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Order #{order.orderId}</h3>
                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                <StatusBadge status={order.status} />
              </div>

              {/* Order Details */}
              <div className="space-y-3">
                {/* Items */}
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-[#C9A898] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{order.itemCount} item{order.itemCount > 1 ? 's' : ''}:</span> {getOrderItemsText(order.items)}
                    </p>
                  </div>
                </div>

                {/* Total Price */}
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Total:</span> {formatPrice(order.totalPrice)}
                    </p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="flex items-start space-x-2">
                  <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Shipping to:</span> {order.shippingAddress}
                    </p>
                  </div>
                </div>

                {/* Payment Reference */}
                <div className="flex items-start space-x-2">
                  <CreditCard size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Payment Ref:</span> {order.paymentReference}
                    </p>
                  </div>
                </div>

                {/* Delivery Note */}
                {order.deliveryNote && (
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Note:</span> {order.deliveryNote}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Actions */}
              <div className="flex items-center justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Eye size={16} />
                  <span>View Details</span>
                </Button>
              </div>
            </div>
          ))
        ) : (
          // Empty state
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">
              {activeFilter === 'all' 
                ? 'You currently have no orders. Check our collections to shop your favorite items.'
                : `No ${activeFilter} orders found.`
              }
            </p>
            {activeFilter === 'all' && (
              <Button className="bg-[#C9A898] hover:bg-[#b88b6d]">
                Start Shopping
              </Button>
            )}
          </div>
        )}

        {/* Pagination Info and Controls */}
        {meta && meta.totalItems > 0 && (
          <div className="mt-8">
            {/* Pagination Info */}
            <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
              <div>
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, meta.totalItems)} of {meta.totalItems} orders
              </div>
              <div>
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