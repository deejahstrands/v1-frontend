'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    ArrowLeft,
    Package,
    Calendar,
    MapPin,
    CreditCard,
    Star,
    StarHalf,
    MessageSquare,
    Loader2,
    Ruler,
    Settings,
    Clock,
    Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { ReviewModal } from './review-modal';
import { useOrders } from '@/store/use-orders';
import { type OrderItem, type ReviewData } from '@/services/orders';


interface OrderDetailsProps {
    orderId: string;
    onBack?: () => void;
}

export function OrderDetails({ orderId, onBack }: OrderDetailsProps) {
    const router = useRouter();
    const {
        selectedOrder: order,
        loading,
        error,
        fetchOrder,
        addReview,
        clearError
    } = useOrders();

    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);

    // No need to fetch here since MyOrdersSection already handles the fetching

    // Clear errors when component unmounts
    useEffect(() => {
        return () => {
            clearError();
        };
    }, [clearError]);

    const handleReviewSuccess = async (itemId: string, reviewData: ReviewData) => {
        await addReview(itemId, reviewData);
    };

    const handleAddReview = (item: OrderItem) => {
        setSelectedItem(item);
        setReviewModalOpen(true);
    };

    // Helper function to check if an object has meaningful content
    const hasContent = (obj: unknown): boolean => {
        return Boolean(obj && typeof obj === 'object' && obj !== null && Object.keys(obj).length > 0);
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
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderStars = (rating: string | null) => {
        if (!rating || rating === 'null' || rating === 'undefined') return null;

        const numRating = parseFloat(rating);
        if (isNaN(numRating)) return null;

        const fullStars = Math.floor(numRating);
        const hasHalfStar = numRating % 1 !== 0;

        return (
            <div className="flex items-center space-x-1">
                {[...Array(fullStars)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
                {hasHalfStar && <StarHalf size={16} className="text-yellow-400 fill-yellow-400" />}
                <span className="text-sm text-gray-600 ml-1">{rating}</span>
            </div>
        );
    };

  if (loading || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-0">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 text-center">
          <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin mx-auto text-[#C9A898] mb-4" />
          <p className="text-gray-600 text-sm sm:text-base">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Additional safety check - ensure the order matches the requested orderId
  if (order.id !== orderId) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-0">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 text-center">
          <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin mx-auto text-[#C9A898] mb-4" />
          <p className="text-gray-600 text-sm sm:text-base">Loading order details...</p>
        </div>
      </div>
    );
  }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-0">
                <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 text-center">
                    <Package size={40} className="mx-auto text-red-300 mb-4 sm:w-12 sm:h-12" />
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Failed to load order</h3>
                    <p className="text-gray-500 mb-6 text-sm sm:text-base px-4">{error}</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                        <Button
                            onClick={() => onBack ? onBack() : router.back()}
                            variant="outline"
                            className="w-full sm:w-auto"
                        >
                            <ArrowLeft size={14} className="mr-2 sm:w-4 sm:h-4" />
                            Go Back
                        </Button>
                        <Button
                            onClick={() => fetchOrder(orderId)}
                            className="bg-[#C9A898] hover:bg-[#b88b6d] w-full sm:w-auto"
                        >
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-0">
            {/* Breadcrumb */}
            <div className="mb-4 sm:mb-6">
                <nav className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
                    <span>Home</span>
                    <span>/</span>
                    <button
                        onClick={() => onBack ? onBack() : router.push('/account/orders')}
                        className="text-gray-500 hover:text-[#C9A898]"
                    >
                        My Orders
                    </button>
                    <span>/</span>
                    <span className="text-[#C9A898] font-medium">Order Details</span>
                </nav>
            </div>

            {/* Back Button */}
            <div className="mb-4 sm:mb-6">
                <Button
                    onClick={() => onBack ? onBack() : router.back()}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2 text-xs sm:text-sm"
                >
                    <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
                    <span>Back to Orders</span>
                </Button>
            </div>

            {/* Order Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="min-w-0 flex-1">
                        <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-2 break-words">
                            Order #{order.orderId}
                        </h1>
                        <p className="text-gray-600 text-sm sm:text-base">
                            Placed on {formatDate(order.createdAt)}
                        </p>
                    </div>
                    <div className="flex justify-end sm:justify-start">
                        <StatusBadge status={order.status} />
                    </div>
                </div>

                {/* Order Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <Package size={16} className="text-[#C9A898] sm:w-5 sm:h-5 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-gray-600">Items</p>
                            <p className="font-medium text-sm sm:text-base">{order.itemCount}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <CreditCard size={16} className="text-[#C9A898] sm:w-5 sm:h-5 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-gray-600">Total</p>
                            <p className="font-medium text-sm sm:text-base break-words">{formatPrice(order.totalPrice)}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <MapPin size={16} className="text-[#C9A898] sm:w-5 sm:h-5 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-gray-600">Status</p>
                            <p className="font-medium text-sm sm:text-base capitalize">{order.status}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <Calendar size={16} className="text-[#C9A898] sm:w-5 sm:h-5 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-gray-600">Reference</p>
                            <p className="font-medium text-sm sm:text-base break-words">{order.paymentReference}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Order Items</h2>
                <div className="space-y-4 sm:space-y-6">
                    {order.items.map((item) => (
                        <div key={item.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-gray-50 sm:bg-white">
                            {/* Mobile-first layout */}
                            <div className="space-y-3">
                                {/* Header with image and basic info */}
                                <div className="flex items-start space-x-3">
                                    {/* Item Image */}
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                        {item.product?.thumbnail ? (
                                            <Image
                                                src={item.product.thumbnail}
                                                alt={item.itemName}
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package size={20} className="text-gray-400 sm:w-6 sm:h-6" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Item basic info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 text-base sm:text-lg break-words leading-tight">{item.itemName}</h3>
                                        <p className="text-sm sm:text-base text-gray-600 capitalize mt-1">
                                            {item.itemType} • Qty: {item.quantity}
                                        </p>
                                        <div className="mt-2">
                                            <p className="font-bold text-gray-900 text-lg sm:text-xl">{formatPrice(item.totalPrice)}</p>
                                            <p className="text-sm text-gray-500">Base: {formatPrice(item.basePrice)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Measurements */}
                                {hasContent(item.measurements) && (
                                    <div className="bg-white sm:bg-gray-50 rounded-lg p-3 border border-gray-100">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <Ruler size={16} className="text-[#C9A898]" />
                                            <span className="text-sm font-semibold text-gray-800">Measurements</span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2 text-sm text-gray-700">
                                            {item.measurements && typeof item.measurements === 'object' && 'earToEar' in item.measurements && item.measurements.earToEar && (
                                                <div className="flex justify-between py-1">
                                                    <span className="text-gray-600">Ear to Ear:</span>
                                                    <span className="font-medium">{item.measurements.earToEar}cm</span>
                                                </div>
                                            )}
                                            {item.measurements && typeof item.measurements === 'object' && 'headCircumference' in item.measurements && item.measurements.headCircumference && (
                                                <div className="flex justify-between py-1">
                                                    <span className="text-gray-600">Head Circumference:</span>
                                                    <span className="font-medium">{item.measurements.headCircumference}cm</span>
                                                </div>
                                            )}
                                            {item.measurements && typeof item.measurements === 'object' && 'harlineImages' in item.measurements && item.measurements.harlineImages && item.measurements.harlineImages.length > 0 && (
                                                <div className="flex justify-between py-1">
                                                    <span className="text-gray-600">Hairline Images:</span>
                                                    <span className="font-medium">{item.measurements.harlineImages.length} uploaded</span>
                                                </div>
                                            )}
                                            {item.measurements && typeof item.measurements === 'object' && 'wigStyleImages' in item.measurements && item.measurements.wigStyleImages && item.measurements.wigStyleImages.length > 0 && (
                                                <div className="flex justify-between py-1">
                                                    <span className="text-gray-600">Style Images:</span>
                                                    <span className="font-medium">{item.measurements.wigStyleImages.length} uploaded</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Customizations */}
                                {item.customizations && Array.isArray(item.customizations) && item.customizations.length > 0 && (
                                    <div className="bg-white sm:bg-gray-50 rounded-lg p-3 border border-gray-100">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <Settings size={16} className="text-[#C9A898]" />
                                            <span className="text-sm font-semibold text-gray-800">Customizations</span>
                                        </div>
                                        <div className="space-y-2">
                                            {item.customizations.map((custom, idx) => (
                                                <div key={idx} className="flex justify-between items-center py-1">
                                                    <div className="flex-1">
                                                        <span className="text-sm text-gray-600 capitalize">{custom.type}:</span>
                                                        <span className="text-sm font-medium text-gray-800 ml-1">{custom.option}</span>
                                                    </div>
                                                    <span className="text-sm font-semibold text-[#C9A898]">
                                                        +{formatPrice(custom.price?.toString() || '0')}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Additional Services */}
                                {(item.privateFitting?.name || item.processingTime?.name) && (
                                    <div className="bg-white sm:bg-gray-50 rounded-lg p-3 border border-gray-100">
                                        <div className="space-y-2">
                                            {item.privateFitting && item.privateFitting.name && item.privateFitting.price && (
                                                <div className="flex justify-between items-center py-1">
                                                    <div className="flex items-center space-x-2">
                                                        <Home size={14} className="text-[#C9A898] flex-shrink-0" />
                                                        <span className="text-sm text-gray-700">{item.privateFitting.name}</span>
                                                    </div>
                                                    <span className="text-sm font-semibold text-[#C9A898]">
                                                        +{formatPrice(item.privateFitting.price.toString())}
                                                    </span>
                                                </div>
                                            )}
                                            {item.processingTime && item.processingTime.name && item.processingTime.price && (
                                                <div className="flex justify-between items-center py-1">
                                                    <div className="flex items-center space-x-2">
                                                        <Clock size={14} className="text-[#C9A898] flex-shrink-0" />
                                                        <span className="text-sm text-gray-700">{item.processingTime.name}</span>
                                                    </div>
                                                    <span className="text-sm font-semibold text-[#C9A898]">
                                                        +{formatPrice(item.processingTime.price.toString())}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Review Section */}
                                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                                    {item.review && item.rating ? (
                                        <div>
                                            <div className="flex flex-col gap-2 mb-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-semibold text-gray-800">Your Review</span>
                                                    {renderStars(item.rating)}
                                                </div>
                                            </div>
                                            <div className="bg-white rounded-lg p-3 border border-blue-200">
                                                <p className="text-sm text-gray-700 italic leading-relaxed">&ldquo;{item.review}&rdquo;</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-2">
                                            <p className="text-sm text-gray-600 mb-3">Share your experience with this item</p>
                                            <Button
                                                size="sm"
                                                onClick={() => handleAddReview(item)}
                                                className="bg-[#C9A898] hover:bg-[#b88b6d] text-white w-full sm:w-auto"
                                            >
                                                <MessageSquare size={14} className="mr-2" />
                                                <span>Add Review</span>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Shipping Information</h2>
                <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                        <MapPin size={16} className="text-[#C9A898] mt-0.5 sm:w-5 sm:h-5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 text-sm sm:text-base">Delivery Address</p>
                            <p className="text-gray-600 text-xs sm:text-sm break-words">{order.shippingAddress}</p>
                        </div>
                    </div>

                    {order.deliveryNote && order.deliveryNote.trim() && (
                        <div className="flex items-start space-x-2 sm:space-x-3">
                            <MessageSquare size={16} className="text-[#C9A898] mt-0.5 sm:w-5 sm:h-5 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-900 text-sm sm:text-base">Delivery Note</p>
                                <p className="text-gray-600 text-xs sm:text-sm break-words">&ldquo;{order.deliveryNote}&rdquo;</p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-start space-x-2 sm:space-x-3">
                        <CreditCard size={16} className="text-[#C9A898] mt-0.5 sm:w-5 sm:h-5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 text-sm sm:text-base">Payment Reference</p>
                            <p className="text-gray-600 text-xs sm:text-sm break-words">{order.paymentReference}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            {selectedItem && (
                <ReviewModal
                    open={reviewModalOpen}
                    onClose={() => {
                        setReviewModalOpen(false);
                        setSelectedItem(null);
                    }}
                    orderItem={selectedItem}
                    onSuccess={handleReviewSuccess}
                />
            )}
        </div>
    );
}
