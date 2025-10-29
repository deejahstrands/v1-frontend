"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/common/button';
import { categoryService } from '@/services/admin/category.service';
import { CategoryModal } from '@/components/admin/categories';
import { ConfirmationModal } from '@/components/ui';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';



interface SingleCategoryResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  coverImage: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  noOfProducts: number;
  products?: {
    data: Array<{
      id: string;
      name: string;
      thumbnail?: string;
      basePrice: number;
      status: string;
      visibility: string;
      featured?: boolean;
      quantityAvailable: number;
    }>;
    meta: {
      page: number;
      limit: number | null;
      totalItems: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
      nextPage: number | null;
      prevPage: number | null;
    };
  };
}

export default function CategoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Extract the id from the Promise params
  const [categoryId, setCategoryId] = useState<string>('');
  const router = useRouter();
  const { toast } = useToast();
  const [category, setCategory] = useState<SingleCategoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedCategory, setSelectedCategory] = useState<SingleCategoryResponse | null>(null);

  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<SingleCategoryResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const resolvedParams = await params;
        setCategoryId(resolvedParams.id);
        const response = await categoryService.getCategory(resolvedParams.id);
        setCategory(response.data);
      } catch (err) {
        console.error('Error fetching category:', err);
        setError('Failed to fetch category details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [params]);

  const handleGoBack = () => {
    router.push('/admin/categories');
  };

  const handleEdit = () => {
    setModalMode('edit');
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleAddProduct = () => {
    // For now, just log the action since we don't have a product modal
    // TODO: Implement product creation modal or navigate to product creation page
    console.log('Add product to category:', category?.id);
    // You could navigate to a product creation page here:
    // router.push(`/admin/products/create?categoryId=${category?.id}`);
  };

  // Delete handlers
  const handleDeleteClick = () => {
    if (category) {
      setCategoryToDelete(category);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      setIsDeleting(true);
      await categoryService.deleteCategory(categoryToDelete.id);
      toast.success('Category deleted successfully!');
      router.push('/admin/categories');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category. Please try again.');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSaveCategory = async (categoryData: { name: string; coverImage: string; description: string; status: 'active' | 'inactive' }) => {
    try {
      if (modalMode === 'edit' && selectedCategory) {
        // For edit mode, only send the fields that actually changed
        const updateData: Partial<{ name: string; coverImage: string; description: string; status: 'active' | 'inactive' }> = {};

        if (categoryData.name !== selectedCategory.name) {
          updateData.name = categoryData.name;
        }

        if (categoryData.description !== selectedCategory.description) {
          updateData.description = categoryData.description;
        }

        if (categoryData.status !== selectedCategory.status) {
          updateData.status = categoryData.status;
        }

        if (categoryData.coverImage !== selectedCategory.coverImage) {
          updateData.coverImage = categoryData.coverImage;
        }

                // Only call update if there are actual changes
        if (Object.keys(updateData).length > 0) {
          await categoryService.updateCategory(selectedCategory.id, updateData);
        // Refresh the category data
        const response = await categoryService.getCategory(categoryId);
        setCategory(response.data);

        }
      }
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving category:', error);
      return Promise.reject(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading category...</p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Category Not Found</h1>
          <p className="text-gray-500 mb-4">{error || 'The category you\'re looking for doesn\'t exist.'}</p>
          <Button onClick={handleGoBack}>
            Back to Categories
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-2 lg:p-4">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <span>/</span>
          <span>Categories</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">{category.name}</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel - Category Details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Category Details</h2>

            {/* Category Image */}
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 rounded-lg overflow-hidden border-4 border-gray-100">
                <Image
                  src={category.coverImage}
                  alt={category.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Category Name */}
            <h3 className="text-xl font-bold text-gray-900 text-center mb-4">{category.name}</h3>

            {/* Description */}
            <div className="mb-4">
              <p className="text-gray-700 text-center">{category.description}</p>
            </div>

            {/* Status */}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${category.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
                }`}>
                {category.status}
              </span>
            </div>

            {/* Metadata */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Created:</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(category.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Updated:</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(category.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Products:</span>
                <span className="text-sm font-medium text-gray-900">
                  {category.products?.data?.length || 0}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                variant="primary"
                icon={<Edit className="w-4 h-4" />}
                onClick={handleEdit}
                className="w-full"
              >
                Edit Category
              </Button>
              <Button
                variant="primary"
                icon={<Plus className="w-4 h-4" />}
                onClick={handleAddProduct}
                className="w-full"
              >
                Add Product (Coming Soon)
              </Button>
              <Button
                variant="danger"
                icon={<Trash2 className="w-4 h-4" />}
                onClick={handleDeleteClick}
                className="w-full"
              >
                Delete Category
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel - Products */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Products in Category</h2>
            </div>

            {/* Products List */}
            {category.products?.data && category.products.data.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.products.data.map((product) => (
                  <div
                    key={product.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    {/* Product Image */}
                    <div className="w-full h-32 mb-3 rounded-lg overflow-hidden">
                      <Image
                        src={product.thumbnail || '/dummy/avatar.svg'}
                        alt={product.name}
                        width={200}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500 mb-1">
                        ₦{product.basePrice.toLocaleString()}
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          product.status === 'available' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.status}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          product.visibility === 'published' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.visibility}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Yet</h3>
                <p className="text-gray-500 mb-4">This category doesn&apos;t have any products yet.</p>
                <Button
                  variant="primary"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={handleAddProduct}
                >
                  Add First Product (Coming Soon)
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Modal */}
      <CategoryModal
        open={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        category={selectedCategory ? {
          id: selectedCategory.id,
          name: selectedCategory.name,
          coverImage: selectedCategory.coverImage,
          description: selectedCategory.description,
          status: selectedCategory.status,
          createdAt: selectedCategory.createdAt,
          updatedAt: selectedCategory.updatedAt,
          deletedAt: selectedCategory.deletedAt,
          noOfProducts: selectedCategory.products?.data?.length || 0
        } : undefined}
        onSave={handleSaveCategory}
      />

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
        type="delete"
        confirmText="Delete Category"
        isLoading={isDeleting}
      />
    </div>
  );
}
