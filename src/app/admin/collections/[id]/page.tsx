 
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/button';
import { ArrowLeft, Edit, Trash2, Package, Calendar, Tag } from 'lucide-react';
import { CollectionWithProducts } from '@/services/admin/collection.service';
import { collectionService } from '@/services/admin/collection.service';
import { ProductCard } from '@/components/admin/products/product-card';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import Image from 'next/image';

export default function CollectionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [collection, setCollection] = useState<CollectionWithProducts | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Load collection data
  useEffect(() => {
    const loadCollection = async () => {
      setIsLoading(true);
      try {
        const resolvedParams = await params;
        const response = await collectionService.getCollectionWithProducts(resolvedParams.id);
        setCollection(response.data);
      } catch (error) {
        console.error('Error loading collection:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCollection();
  }, [params]);

  // Handle delete
  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!collection) return;

    setIsDeleting(true);
    try {
      await collectionService.deleteCollection(collection.id);
      router.push('/admin/collections');
    } catch (error) {
      console.error('Error deleting collection:', error);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  // Handle edit
  const handleEdit = () => {
    router.push(`/admin/collections?mode=edit&id=${collection?.id}`);
  };

  if (isLoading) {
    return (
      <div className="w-full mx-auto max-w-7xl px-4 py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="bg-gray-200 rounded-lg h-48"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="w-full mx-auto max-w-7xl px-4 py-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Collection not found</h3>
          <p className="text-gray-500 mb-6">The collection you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push('/admin/collections')}>
            Back to Collections
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto max-w-7xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="tertiary"
            onClick={() => router.push('/admin/collections')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">Collection</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">Collection Details</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{collection.name}</h1>
            <p className="text-gray-600 mt-1">{collection.description}</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="tertiary"
              onClick={handleEdit}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Collection
            </Button>
            <Button
              variant="tertiary"
              onClick={handleDelete}
              className="flex items-center gap-2 text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Collection Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Collection Information</h2>
            
            {/* Collection Thumbnail */}
            <div className="mb-6">
              <Image
                src={collection.thumbnail}
                alt={collection.name}
                width={300}
                height={200}
                className="w-full h-48 rounded-lg object-cover"
              />
            </div>

            {/* Collection Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Products:</span>
                <span className="text-sm font-medium text-gray-900">{collection.noOfProducts}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  collection.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {collection.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Featured:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  collection.featured
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {collection.featured ? 'Yes' : 'No'}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Created:</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(collection.createdAt).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Products */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Products in Collection ({collection.products.length})
              </h2>
            </div>

            {collection.products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {collection.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      id: product.id,
                      name: product.name,
                      thumbnail: product.thumbnail,
                      basePrice: product.basePrice,
                      category: { id: '1', name: 'Collection Product' },
                      status: 'available' as const,
                      visibility: product.visibility,
                      customization: false,
                      featured: false,
                      createdAt: collection.createdAt,
                      deletedAt: null,
                      quantityAvailable: 0,
                    }}
                    onView={() => router.push(`/admin/products/${product.id}`)}
                    onEdit={() => router.push(`/admin/products?mode=edit&id=${product.id}`)}
                    onDelete={() => {}}
                    onAddToCollection={() => {}}
                    onChangeStatus={() => {}}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products in collection</h3>
                <p className="text-gray-500 mb-6">
                  This collection doesn&apos;t have any products yet.
                </p>
                <Button
                  onClick={handleEdit}
                  className="!bg-black text-white"
                >
                  Add Products
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Collection"
        message={`Are you sure you want to delete the collection "${collection.name}"?`}
        deletionItems={[
          "This action cannot be undone",
          "All collection data will be permanently removed",
          "Products will remain but will be removed from this collection"
        ]}
        type="delete"
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
}
