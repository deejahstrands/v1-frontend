/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Fragment, useState, useRef, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Search as SearchIcon, X, Package, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { debounce } from "lodash";
import { productsService } from "@/services/products";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search handler
  const debouncedSearchRef = useRef(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await productsService.searchProducts(query, { limit: 12 });
        setSearchResults(response.data || []);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400)
  );

  const handleSearchInput = (value: string) => {
    setSearchQuery(value);
    debouncedSearchRef.current(value);
  };

  // Clear search when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [isOpen]);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center sm:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative w-full transform bg-white shadow-xl transition-all sm:rounded-xl">
                <div className="px-4 py-3 sm:p-6">
                  {/* Search input */}
                  <div className="relative">
                    <SearchIcon className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => handleSearchInput(e.target.value)}
                      className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                      autoFocus
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-2 p-2 text-gray-400 hover:text-gray-500 cursor-pointer"
                      onClick={onClose}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Search results */}
                  <div className="mt-8">
                    {isSearching ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                        <span className="ml-2 text-sm text-gray-500">Searching...</span>
                      </div>
                    ) : searchQuery && searchResults.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Package className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-sm font-medium text-gray-900 mb-1">No products found</h3>
                        <p className="text-sm text-gray-500">Try searching with different keywords</p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <>
                        <h3 className="text-sm font-medium text-gray-500">Products ({searchResults.length})</h3>
                        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                          {searchResults.map((result) => (
                            <Link
                              key={result.id}
                              href={`/products/${result.id}`}
                              onClick={onClose}
                              className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow"
                            >
                              <div className="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none sm:h-48 relative">
                                <Image
                                  src={result.thumbnail || '/images/all.jpeg'}
                                  alt={result.name}
                                  width={300}
                                  height={400}
                                  className="h-full w-full object-cover object-center"
                                />
                              </div>
                              <div className="flex flex-1 flex-col space-y-2 p-4">
                                <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                                  {result.name}
                                </h3>
                                <p className="text-sm font-semibold text-primary">
                                  ₦{result.basePrice?.toLocaleString()}
                                </p>
                                {result.customization && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Customizable
                                  </span>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <SearchIcon className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-sm font-medium text-gray-900 mb-1">Start searching</h3>
                        <p className="text-sm text-gray-500">Type to find products</p>
                      </div>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 