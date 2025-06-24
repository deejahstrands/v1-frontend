/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Copy, MessageSquare } from "lucide-react";
import { Table, TableColumn } from "@/components/ui/table";
import { useUsers } from "@/store/admin/use-users";
import { notFound } from "next/navigation";
import { use } from "react";
import { useEffect, useState } from "react";
import { CustomerDetailsSkeleton } from "@/components/admin/customer/customer-details-skeleton";
import { copyToClipboard } from "@/lib/utils";

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

const wishlistColumns: TableColumn<any>[] = [
    { label: "Product", accessor: "product" },
    { label: "Category", accessor: "category" },
    {
        label: "Status",
        accessor: "status",
        render: (row) => (
            <span className={`px-2 py-1 rounded-full text-xs ${row.status === "In Stock" ? "bg-green-100 text-green-700" :
                "bg-red-100 text-red-700"
                }`}>
                {row.status}
            </span>
        )
    },
    { label: "Date", accessor: "date" },
];

export default function CustomerDetailsPage({ params }: Props) {
    const { id } = use(params);
    const { users } = useUsers();
    const [isLoading, setIsLoading] = useState(true);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const user = users.find(u => u.id === id);

    useEffect(() => {
        // Simulate loading delay
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // If user not found, show 404
    if (!user) {
        notFound();
    }

    // Get initials from name
    const initials = user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();

    const handleCopy = async (text: string, field: string) => {
        const success = await copyToClipboard(text);
        if (success) {
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        }
    };

    if (isLoading) {
        return <CustomerDetailsSkeleton />;
    }

    return (
        <div className="w-full mx-auto">
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

            {/* Two-column grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Customer Info Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-4 xl:p-6">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xl font-medium mb-4">
                            {initials}
                        </div>
                        <h2 className="text-xl lg:text-lg xl:text-xl font-semibold">{user.name}</h2>
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
                        <div>
                            <label className="text-sm lg:text-xs xl:text-base text-gray-500">Phone Number</label>
                            <div className="flex items-center justify-between mt-1 text-xs lg:text-sm xl:text-base">
                                <p className="font-medium">{user.phone}</p>
                                <button
                                    onClick={() => handleCopy(user.phone, 'phone')}
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
                        <div>
                            <label className="text-sm lg:text-xs xl:text-base text-gray-500">Total Spend</label>
                            <p className="font-medium text-xs lg:text-sm xl:text-base">{user.totalSpend}</p>
                        </div>
                        <div>
                            <label className="text-sm lg:text-xs xl:text-base text-gray-500">No of Orders</label>
                            <p className="font-medium">{user.totalOrders}</p>
                        </div>
                        <div>
                            <label className="text-sm lg:text-xs xl:text-base text-gray-500">Last Order Date</label>
                            <p className="font-medium text-xs lg:text-sm xl:text-base">{user.lastOrder}</p>
                        </div>
                        <div>
                            <label className="text-sm lg:text-xs xl:text-base text-gray-500">Consultation Status</label>
                            <p className="font-medium text-xs lg:text-sm xl:text-base">{user.consultation}</p>
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
                    {/* Orders Table */}
                    <div>
                        <Table
                            columns={orderColumns}
                            data={user.orders}
                            emptyMessage="No orders placed yet"
                        >
                            <h2 className="text-xl font-semibold mb-4">Orders</h2>
                        </Table>
                    </div>

                    {/* Wishlist Table */}
                    <div>
                        <Table
                            columns={wishlistColumns}
                            data={user.wishlist}
                            emptyMessage="No items in wishlist"
                        >
                            <h2 className="text-xl font-semibold mb-4">Wishlist</h2>
                        </Table>
                    </div>

                    {/* Address Section */}
                    <div>
                        <Table
                            columns={[
                                { label: "Label", accessor: "label" },
                                { label: "Address", accessor: "address" },
                                {
                                    label: "Default",
                                    accessor: "isDefault",
                                    render: (row) => row.isDefault ? "Yes" : "No"
                                },
                            ]}
                            data={user.addresses}
                            emptyMessage="No addresses saved"
                        >
                            <h2 className="text-xl font-semibold mb-4">Address</h2>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}