/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Copy, MessageSquare } from "lucide-react";
import { Table, TableColumn } from "@/components/ui/table";
import { useSingleCustomer } from "@/hooks/admin/use-single-customer";
import { use, useState, useEffect } from "react";
import { CustomerDetailsSkeleton } from "@/components/admin/customer/customer-details-skeleton";
import { copyToClipboard } from "@/lib/utils";
import { Pagination } from "@/components/ui/pagination";
import { ConsultationStatusModal, type ConsultationStatus } from "@/components/admin/consultation/consultation-status-modal";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

const orderColumns: TableColumn<any>[] = [
    { label: "Order ID", accessor: "orderId" },
    { label: "Product", accessor: "product" },
    { label: "Total", accessor: "total" },
    {
        label: "Status",
        accessor: "status",
        render: (row) => (
            <span className={`px-2 py-1 rounded-full text-xs ${row.status === "Completed" ? "bg-green-100 text-green-700" :
                row.status === "Processing" ? "bg-orange-100 text-orange-700" :
                    "bg-gray-100 text-gray-700"
                }`}>
                {row.status}
            </span>
        )
    },
    { label: "Date", accessor: "date" },
];


export default function CustomerDetailsPage({ params }: Props) {
    const { id } = use(params);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [editingConsultation, setEditingConsultation] = useState<{ id: string; status: ConsultationStatus } | null>(null);

    // Pagination states
    const [consultationPage, setConsultationPage] = useState(1);
    const [ordersPage, setOrdersPage] = useState(1);
    const [addressPage, setAddressPage] = useState(1);


    const ITEMS_PER_PAGE = 6;

    const {
        currentCustomer,
        isLoading,
        error,
        loadCustomer,
        clearError,
    } = useSingleCustomer();

    // Load customer on mount
    useEffect(() => {
        if (id) {
            loadCustomer(id);
        }
    }, [id]); // Remove loadCustomer from dependencies to prevent unnecessary re-calls

    // If loading, show skeleton
    if (isLoading) {
        return <CustomerDetailsSkeleton />;
    }

    // If error, show error message
    if (error) {
        return (
            <div className="w-full mx-auto pb-5">
                <div className="flex flex-col items-center justify-center py-12">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Customer</h2>
                    <p className="text-gray-500 mb-4">{error}</p>
                    <button
                        onClick={() => {
                            clearError();
                            loadCustomer(id);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // If customer not found and not loading, show error message
    if (!currentCustomer && !isLoading) {
        return (
            <div className="w-full mx-auto pb-5">
                <div className="flex flex-col items-center justify-center py-12">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Customer Not Found</h2>
                    <p className="text-gray-500 mb-4">The customer you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                    <Link
                        href="/admin/customers"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Back to Customers
                    </Link>
                </div>
            </div>
        );
    }

    const user = currentCustomer!; // Non-null assertion since we've already checked for null above

    // Get initials from name
    const initials = `${user.firstName} ${user.lastName}`
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();

    // Pagination calculations
    function paginateData<T>(data: T[], page: number): T[] {
        const start = (page - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return data.slice(start, end);
    }

    // Transform data for display
    const consultationData = paginateData(
        (user.consultations || []).map(consultation => ({
            id: consultation.id,
            date: consultation.date,
            type: 'Hair Consultation',
            notes: consultation.customerNote,
            status: consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1),
            amount: `₦${parseInt(consultation.amount).toLocaleString()}`,
            time: consultation.time,
            duration: consultation.duration,
        })),
        consultationPage
    );
    const consultationPages = Math.ceil((user.consultations?.length || 0) / ITEMS_PER_PAGE);

    const orderData = paginateData(
        (user.orders || []).map(order => ({
            id: order.id,
            orderId: order.orderId,
            product: order.items.map(item => item.itemName).join(', '),
            total: `₦${parseInt(order.totalPrice).toLocaleString()}`,
            status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
            date: new Date(order.createdAt).toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            }),
        })),
        ordersPage
    );
    const orderPages = Math.ceil((user.orders?.length || 0) / ITEMS_PER_PAGE);

    const addressData = paginateData(
        (user.addresses || []).map(address => ({
            id: address.id,
            label: address.default ? 'Default Address' : 'Address',
            address: `${address.streetAddress}, ${address.city}, ${address.state}, ${address.country}`,
            isDefault: address.default,
            phone: address.phoneNumber,
            apartment: address.apartment,
        })),
        addressPage
    );
    const addressPages = Math.ceil((user.addresses?.length || 0) / ITEMS_PER_PAGE);

    const handleCopy = async (text: string, field: string) => {
        const success = await copyToClipboard(text);
        if (success) {
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        }
    };


    // Handle page changes
    const handleConsultationPageChange = (page: number) => {
        setConsultationPage(page);
    };

    const handleOrdersPageChange = (page: number) => {
        setOrdersPage(page);
    };

    const handleAddressPageChange = (page: number) => {
        setAddressPage(page);
    };

    const handleStatusChange = (newStatus: ConsultationStatus) => {
        // Here you would typically make an API call to update the status
        console.log('Updating consultation status:', {
            consultationId: editingConsultation?.id,
            newStatus
        });
        // For now, we'll just close the modal
        setEditingConsultation(null);
    };

    const consultationColumns: TableColumn<any>[] = [
        { label: "Date", accessor: "date" },
        { label: "Type", accessor: "type" },
        {
            label: "Status",
            accessor: "status",
            render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs ${row.status === "Completed" ? "bg-green-100 text-green-700" :
                        row.status === "Upcoming" ? "bg-orange-100 text-orange-700" :
                            row.status === "Cancelled" ? "bg-red-100 text-red-700" :
                                "bg-gray-100 text-gray-700"
                    }`}>
                    {row.status}
                </span>
            )
        },
        {
            label: "Action",
            accessor: "action",
            render: (row) => (
                <button
                    className="text-gray-500 hover:text-gray-700 text-sm underline cursor-pointer hover:underline-offset-4 transition-all"
                    onClick={() => setEditingConsultation({ id: row.id, status: row.status })}
                >
                    Edit
                </button>
            )
        }
    ];

    return (
        <div className="w-full mx-auto pb-5">
            {/* Breadcrumb */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm mb-6">
                <Link
                    href="/admin/customers"
                    className="text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-2 sm:mb-0"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Go Back</span>
                </Link>
                <div className="flex items-center gap-2">
                    <span className="text-gray-400 hidden sm:inline">•</span>
                    <span className="text-gray-500">Customer</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-900 font-semibold whitespace-nowrap">View Customer Details</span>
                </div>
            </div>

            <h1 className="text-2xl font-semibold mb-8">Customer Details</h1>

            {/* Add the modal */}
            {editingConsultation && (
                <ConsultationStatusModal
                    open={true}
                    onClose={() => setEditingConsultation(null)}
                    currentStatus={editingConsultation.status}
                    onStatusChange={handleStatusChange}
                />
            )}

            {/* Two-column grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Customer Info Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-4 xl:p-6 self-start">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xl font-medium mb-4">
                            {initials}
                        </div>
                        <h2 className="text-xl lg:text-lg xl:text-xl font-semibold">{user.firstName} {user.lastName}</h2>
                    </div>

                    <hr className="my-6 border-gray-100" />

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm lg:text-xs xl:text-base text-gray-500">Email</label>
                            <div className="flex items-center justify-between mt-1 text-xs lg:text-sm xl:text-base">
                                <p className="font-medium">{user.email}</p>
                                <button
                                    onClick={() => handleCopy(user.email, 'email')}
                                    className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
                                    title="Copy email"
                                >
                                    {copiedField === 'email' ? (
                                        <span className="text-green-500 text-xs">Copied!</span>
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                        {user.phone && (
                            <div>
                                <label className="text-sm lg:text-xs xl:text-base text-gray-500">Phone Number</label>
                                <div className="flex items-center justify-between mt-1 text-xs lg:text-sm xl:text-base">
                                    <p className="font-medium">{user.phone}</p>
                                    <button
                                        onClick={() => handleCopy(user.phone!, 'phone')}
                                        className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
                                        title="Copy phone number"
                                    >
                                        {copiedField === 'phone' ? (
                                            <span className="text-green-500 text-xs">Copied!</span>
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                        <div>
                            <label className="text-sm lg:text-xs xl:text-base text-gray-500">Total Spend</label>
                            <p className="font-medium text-xs lg:text-sm xl:text-base">₦{user.totalSpend.toLocaleString()}</p>
                        </div>
                        <div>
                            <label className="text-sm lg:text-xs xl:text-base text-gray-500">No of Orders</label>
                            <p className="font-medium">{user.totalOrders}</p>
                        </div>
                        <div>
                            <label className="text-sm lg:text-xs xl:text-base text-gray-500">Last Order Date</label>
                            <p className="font-medium text-xs lg:text-sm xl:text-base">
                                {user.lastOrderDate ? new Date(user.lastOrderDate).toLocaleDateString('en-US', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                }) : 'No orders yet'}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm lg:text-xs xl:text-base text-gray-500">Status</label>
                            <p className="font-medium text-xs lg:text-sm xl:text-base">
                                <span className={`px-2 py-1 rounded-full text-xs ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {user.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </p>
                        </div>
                    </div>

                    <hr className="my-6 border-gray-100" />

                    <div>
                        <h3 className="font-medium mb-3">Actions</h3>
                        <button className="w-full text-left px-2 py-2 rounded-lg hover:bg-gray-50 text-sm flex items-center justify-between group">
                            <span className="flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-gray-200 transition-colors">
                                    <MessageSquare className="w-4 h-4" />
                                </span>
                                Send an SMS / Email
                            </span>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </button>
                    </div>
                </div>

                {/* Tables Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Consultation Table */}
                    <div>
                        <Table
                            columns={consultationColumns}
                            data={consultationData}
                            emptyMessage="No consultations scheduled"
                            footerContent={
                                consultationPages > 1 && (
                                    <Pagination
                                        currentPage={consultationPage}
                                        totalPages={consultationPages}
                                        onPageChange={handleConsultationPageChange}
                                    />
                                )
                            }
                        >
                            <h2 className="text-xl font-semibold mb-4">Consultations</h2>
                        </Table>
                    </div>

                    {/* Orders Table */}
                    <div>
                        <Table
                            columns={orderColumns}
                            data={orderData}
                            emptyMessage="No orders placed yet"
                            footerContent={
                                orderPages > 1 && (
                                    <Pagination
                                        currentPage={ordersPage}
                                        totalPages={orderPages}
                                        onPageChange={handleOrdersPageChange}
                                    />
                                )
                            }
                        >
                            <h2 className="text-xl font-semibold mb-4">Orders</h2>
                        </Table>
                    </div>


                    {/* Address Section */}
                    <div>
                        <Table
                            columns={[
                                { label: "Label", accessor: "label" },
                                { label: "Address", accessor: "address" },
                                { label: "Phone", accessor: "phone" },
                                {
                                    label: "Default",
                                    accessor: "isDefault",
                                    render: (row) => (
                                        <span className={`px-2 py-1 rounded-full text-xs ${row.isDefault ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {row.isDefault ? 'Yes' : 'No'}
                                        </span>
                                    )
                                },
                            ]}
                            data={addressData}
                            emptyMessage="No addresses saved"
                            footerContent={
                                addressPages > 1 && (
                                    <Pagination
                                        currentPage={addressPage}
                                        totalPages={addressPages}
                                        onPageChange={handleAddressPageChange}
                                    />
                                )
                            }
                        >
                            <h2 className="text-xl font-semibold mb-4">Addresses</h2>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}