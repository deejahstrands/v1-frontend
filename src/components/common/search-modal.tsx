"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Search as SearchIcon, X } from "lucide-react";
import Image from "next/image";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // TODO: Replace with actual search results
  const searchResults = [
    { id: 1, title: "Natural Hair Extension", price: "$199.99", image: "/dummy/product1.jpg" },
    { id: 2, title: "Synthetic Wig", price: "$99.99", image: "/dummy/product2.jpg" },
    { id: 3, title: "Hair Care Kit", price: "$49.99", image: "/dummy/product3.jpg" },
  ];

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
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-2 p-2 text-gray-400 hover:text-gray-500"
                      onClick={onClose}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Search results */}
                  <div className="mt-8">
                    <h3 className="text-sm font-medium text-gray-500">Products</h3>
                    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                      {searchResults.map((result) => (
                        <div
                          key={result.id}
                          className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
                        >
                          <div className="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none sm:h-48 relative">
                            <Image
                              src={result.image}
                              alt={result.title}
                              width={300}
                              height={400}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                          <div className="flex flex-1 flex-col space-y-2 p-4">
                            <h3 className="text-sm font-medium text-gray-900">
                              <a href="#">
                                <span aria-hidden="true" className="absolute inset-0" />
                                {result.title}
                              </a>
                            </h3>
                            <p className="text-sm text-gray-500">{result.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
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