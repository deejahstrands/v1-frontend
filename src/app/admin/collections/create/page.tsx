
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/common/button';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { Collection, collectionService } from '@/services/admin/collection.service';
import { AdminProduct, productService } from '@/services/admin';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { SearchInput } from '@/components/ui/search-input';
import { useDebounce } from '@/hooks/use-debounce';
import { ImageUpload } from '@/components/ui/image-upload';
import cloudinaryService from '@/services/cloudinary';
import Image from 'next/image';

export default function CreateCollectionPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode') || 'create';
    const collectionId = searchParams.get('id');

    // Collection management functions
    const createCollection = async (data: any) => {
        return await collectionService.createCollection(data);
    };

    const updateCollection = async (id: string, data: any) => {
        return await collectionService.updateCollection(id, data);
    };

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingCollection, setIsLoadingCollection] = useState(false);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'active' as 'active' | 'inactive',
        featured: false,
        thumbnail: '',
    });

    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [availableProducts, setAvailableProducts] = useState<AdminProduct[]>([]);
    const [, setCurrentCollection] = useState<Collection | null>(null);
    const [productsPage, setProductsPage] = useState(1);
    const [, setProductsTotalPages] = useState(1);
    const [hasMoreProducts, setHasMoreProducts] = useState(false);

    // Debounced search term
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // Load products function
    const loadProducts = useCallback(async (page: number = 1, search: string = '', append: boolean = false) => {
        setIsLoadingProducts(true);
        try {
            console.log('Loading products with params:', { page, search, append });
            const response = await productService.getProducts({
                page,
                limit: 10,
                search: search || undefined,
                visibility: 'published',
                status: 'available',
            });

            console.log('Products response:', response);

            if (append) {
                setAvailableProducts(prev => [...prev, ...response.data]);
            } else {
                setAvailableProducts(response.data);
            }

            setProductsTotalPages(response.meta.totalPages);
            setHasMoreProducts(response.meta.hasNext);
            setProductsPage(page);
        } catch (error) {
            console.error('Error loading products:', error);
            // Fallback to empty array if API fails
            if (!append) {
                setAvailableProducts([]);
            }
        } finally {
            setIsLoadingProducts(false);
        }
    }, []);

    // Load products on mount and when search changes
    useEffect(() => {
        loadProducts(1, debouncedSearchTerm, false);
    }, [debouncedSearchTerm, loadProducts]);

    // Load more products
    const loadMoreProducts = () => {
        if (hasMoreProducts && !isLoadingProducts) {
            loadProducts(productsPage + 1, debouncedSearchTerm, true);
        }
    };

    // Load collection data for edit mode
    useEffect(() => {
        const loadCollectionForEdit = async () => {
            if (mode === 'edit' && collectionId) {
                setIsLoadingCollection(true);
                try {
                    const response = await collectionService.getCollectionWithProducts(collectionId);
                    const collection = response.data;

                    setCurrentCollection(collection);
                    setFormData({
                        name: collection.name,
                        description: collection.description,
                        status: collection.status,
                        featured: collection.featured,
                        thumbnail: collection.thumbnail,
                    });

                    // Set selected products from the collection
                    if (collection.products && collection.products.length > 0) {
                        setSelectedProducts(collection.products.map(p => p.id));
                    }
                } catch (error) {
                    console.error('Error loading collection for edit:', error);
                    alert('Failed to load collection data. Please try again.');
                } finally {
                    setIsLoadingCollection(false);
                }
            }
        };

        loadCollectionForEdit();
    }, [mode, collectionId]);

    // Use availableProducts directly since filtering is done on the server
    const filteredProducts = availableProducts;

    // Handle form input changes
    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle image upload
    const handleImageUpload = async (file: File) => {
        setIsUploadingImage(true);
        try {
            const response = await cloudinaryService.uploadImage(file, 'collections');
            handleInputChange('thumbnail', response.secure_url);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setIsUploadingImage(false);
        }
    };

    // Handle product selection
    const handleProductToggle = (productId: string) => {
        setSelectedProducts(prev => {
            if (prev.includes(productId)) {
                return prev.filter(id => id !== productId);
            } else {
                return [...prev, productId];
            }
        });
    };

    // Handle select all products
    const handleSelectAll = () => {
        if (selectedProducts.length === filteredProducts.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(filteredProducts.map(p => p.id));
        }
    };

    // Handle remove product from selected
    const handleRemoveProduct = (productId: string) => {
        setSelectedProducts(prev => prev.filter(id => id !== productId));
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            alert('Please enter a collection name');
            return;
        }

        if (selectedProducts.length === 0) {
            alert('Please select at least one product');
            return;
        }

        setIsLoading(true);
        try {
            const submitData = {
                ...formData,
                products: selectedProducts,
            };

            let success = false;
            if (mode === 'edit' && collectionId) {
                const response = await updateCollection(collectionId, submitData);
                success = !!response;
            } else {
                const response = await createCollection(submitData);
                success = !!response;
            }

            if (success) {
                router.push('/admin/collections');
            }
        } catch (error) {
            console.error('Error saving collection:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Get selected products for display
    const selectedProductsList = availableProducts.filter(p => selectedProducts.includes(p.id));

    // Show loading state when loading collection for edit
    if (isLoadingCollection) {
        return (
            <div className="w-full mx-auto max-w-7xl px-4 py-6">
                <div className="flex items-center justify-center min-h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading collection data...</p>
                    </div>
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
                    <span className="text-gray-900 font-medium">
                        {mode === 'edit' ? 'Edit Collection' : 'Create New Collection'}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {mode === 'edit' ? 'Edit Collection' : 'Create New Collection'}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {mode === 'edit'
                                ? 'Update collection details and products'
                                : 'Create a new collection for your store'
                            }
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="tertiary"
                            onClick={() => router.push('/admin/collections')}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading || isUploadingImage || isLoadingCollection}
                            className="!bg-black text-white"
                        >
                            {isLoading ? 'Saving...' : isUploadingImage ? 'Uploading...' : isLoadingCollection ? 'Loading...' : 'Save'}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Collection Details */}
                <div className="space-y-6">
                    {/* Collection Thumbnail */}
                    <div>
                        <ImageUpload
                            label="Collection Thumbnail"
                            helperText="This will be displayed on the all product"
                            acceptedTypes="PNG, JPG"
                            maxDimensions="800x400px"
                            onFileSelect={(file) => {
                                if (file) {
                                    handleImageUpload(file);
                                }
                            }}
                            existingImage={formData.thumbnail}
                        />
                    </div>

                    {/* Collection Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Collection Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Enter collection name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Visibility Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Visibility Status
                        </label>
                        <Select
                            value={formData.status}
                            onChange={(value) => handleInputChange('status', value)}
                            options={[
                                { label: 'Active', value: 'active' },
                                { label: 'Inactive', value: 'inactive' },
                            ]}
                        />
                    </div>

                    {/* Feature Tag */}
                    <div className="flex items-center space-x-3">
                        <Checkbox
                            checked={formData.featured}
                            onCheckedChange={(checked) => handleInputChange('featured', checked)}
                        />
                        <label className="text-sm font-medium text-gray-700">
                            Feature Tag
                        </label>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description (Optional)
                        </label>
                        <p className="text-sm text-gray-500 mb-2">Write a short introduction.</p>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Enter Description"
                            rows={4}
                            maxLength={275}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            No more than 275 Characters
                        </p>
                    </div>
                </div>

                {/* Right Column - Product Assignment */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Assign Product</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Select which product you want under this collection
                        </p>

                        {/* Search Products */}
                        <div className="mb-4">
                            <SearchInput
                                placeholder="Search Product"
                                value={searchTerm}
                                onChange={setSearchTerm}
                            />
                        </div>

                        {/* Available Products */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-medium text-gray-900">Available Products</h4>
                                <button
                                    onClick={handleSelectAll}
                                    className="text-sm text-blue-600 hover:text-blue-800 curssor-pointer"
                                >
                                    Select all
                                </button>
                            </div>

                            <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
                                {isLoadingProducts && availableProducts.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500">Loading products...</div>
                                ) : filteredProducts.length > 0 ? (
                                    <div className="divide-y divide-gray-200">
                                        {filteredProducts.map((product) => (
                                            <div key={product.id} className="p-3 flex items-center space-x-3">
                                                <Checkbox
                                                    checked={selectedProducts.includes(product.id)}
                                                    onCheckedChange={() => handleProductToggle(product.id)}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {product.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        ₦{product.basePrice.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Load More Button */}
                                        {hasMoreProducts && (
                                            <div className="p-3 border-t border-gray-200">
                                                <button
                                                    onClick={loadMoreProducts}
                                                    disabled={isLoadingProducts}
                                                    className="w-full text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                                                >
                                                    {isLoadingProducts ? 'Loading more...' : 'Load More Products'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="p-4 text-center text-gray-500">No products found</div>
                                )}
                            </div>
                        </div>

                        {/* Selected Products */}
                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">Selected Products</h4>
                            <div className="border border-gray-200 rounded-lg min-h-32 p-4">
                                {selectedProductsList.length > 0 ? (
                                    <div className="space-y-2">
                                        {selectedProductsList.map((product) => (
                                            <div key={product.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                                                <div className="flex items-center space-x-3">
                                                    <Image
                                                        src={product.thumbnail}
                                                        alt={product.name}
                                                        width={32}
                                                        height={32}
                                                        className="w-8 h-8 rounded object-cover"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                                        <p className="text-xs text-gray-500">
                                                            ₦{product.basePrice.toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveProduct(product.id)}
                                                    className="text-gray-400 hover:text-red-600 cursor-pointer"
                                                >
                                                    <ImageIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 py-8">
                                        <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                        <p className="text-sm">No products selected</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                <Button
                    variant="tertiary"
                    onClick={() => router.push('/admin/collections')}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="!bg-black text-white"
                >
                    {isLoading ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </div>
    );
}
