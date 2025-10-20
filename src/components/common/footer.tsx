'use client';

import { useEffect, useState } from 'react';
import Image from "next/image";
import { SectionContainer } from "./section-container";
import { Button } from "./button";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { HairTagsCloud } from "@/components/home/HairTagsCloud";
import { useCategories } from "@/store/use-categories";
import type { Category } from "@/types/category";

export function Footer() {
  const { categories, loading } = useCategories();
  const [randomCategories, setRandomCategories] = useState<Category[]>([]);

  // Select 2 random categories when categories are loaded
  useEffect(() => {
    if (categories.length > 0) {
      const shuffled = [...categories].sort(() => 0.5 - Math.random());
      setRandomCategories(shuffled.slice(0, 2));
    }
  }, [categories]);
  return (
    <footer className="w-full bg-[#161616] pt-10 pb-20 lg:pb-0">
      {/* Quick Info Cards */}
      <SectionContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-10">
          <Link href="/disclaimers" className="group rounded-2xl border border-[#FCFCFC]/15 bg-white/5 hover:bg-white/10 transition-colors p-5 flex flex-col gap-2">
            <div className="text-[#FCFCFC] font-semibold text-base">Disclaimers</div>
            <p className="text-[#FCFCFC]/80 text-xs">Important info on color, texture, length and readiness.</p>
            <span className="text-[#FCFCFC] text-xs mt-2 group-hover:underline">Read more →</span>
          </Link>
          <Link href="/shipping-info" className="group rounded-2xl border border-[#FCFCFC]/15 bg-white/5 hover:bg-white/10 transition-colors p-5 flex flex-col gap-2">
            <div className="text-[#FCFCFC] font-semibold text-base">Shipping Information</div>
            <p className="text-[#FCFCFC]/80 text-xs">Processing timelines, delivery windows and return policy.</p>
            <span className="text-[#FCFCFC] text-xs mt-2 group-hover:underline">Read more →</span>
          </Link>
        </div>
      </SectionContainer>
      <SectionContainer className="grid grid-cols-1 gap-8 text-[#FCFCFC] md:grid-cols-1 lg:grid-cols-10">
        {/* Logo and Contact */}
        <div className="col-span-1 lg:col-span-3">
          <div className="flex items-center gap-3 mb-4">
            <Image src="/logo/logo-footer.svg" alt="Deejah Strands Logo" width={40} height={40} />
            <span className="font-ethereal text-2xl font-semibold text-[#FCFCFC]">Deejah Strands</span>
          </div>
          <Link href="tel:09064296611" className="hover:underline text-xs flex items-center gap-2 mb-2">
            <Phone size={16} className="mr-2" /> 09064296611
          </Link>
          <Link href="mailto:deejahstrands@gmail.com" className="hover:underline text-xs flex items-center gap-2 mb-2">
            <Mail size={16} className="mr-2" /> deejahstrands@gmail.com
          </Link>
          <Link
            href="https://maps.google.com/?q=3 Otunba Olumide Osunsina Crescent, Lekki 106104"
            passHref
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-sm flex items-center gap-2"
          >
            <MapPin size={16} className="mr-2" /> 3 Otunba Olumide Osunsina Crescent, Lekki 106104
          </Link>
        </div>
        {/* Middle: Sitemap, Service, Socials (horizontal on lg, vertical on smaller) */}
        <div className="col-span-1 lg:col-span-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 md:mt-5 lg:mt-0">
            {/* Sitemap */}
            <div>
              <div className="font-semibold mb-4 text-sm">Site Map</div>
              <ul className="space-y-1 text-xs">
                <li className="mb-4"><Link href="/" className="hover:underline">Home</Link></li>
                <li className="mb-4"><Link href="/shop" className="hover:underline">Shop</Link></li>
                {loading ? (
                  // Show skeleton loading while categories are being fetched
                  <>
                    <li className="mb-4"><div className="h-4 bg-gray-600 rounded animate-pulse"></div></li>
                    <li className="mb-4"><div className="h-4 bg-gray-600 rounded animate-pulse"></div></li>
                  </>
                ) : randomCategories.length > 0 ? (
                  // Show random categories
                  randomCategories.map((category) => (
                    <li key={category.id} className="mb-4">
                      <Link
                        href={`/shop/category/${category.id}`}
                        className="hover:underline"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  // Fallback if no categories are available
                  <>
                    <li className="mb-4"><Link href="/shop" className="hover:underline">All Products</Link></li>
                    <li className="mb-4"><Link href="/collections" className="hover:underline">Browse Collection</Link></li>
                  </>
                )}
                <li className="mb-4"><Link href="/shop" className="hover:underline">All Categories</Link></li>
              </ul>
            </div>
            {/* Service */}
            <div>
              <div className="font-semibold mb-4 text-sm">Service</div>
              <ul className="space-y-1 text-xs">
                <li className="mb-4"><Link href="/consultation" className="hover:underline">Consultation</Link></li>
                <li className="mb-4"><Link href="/customizations" className="hover:underline">Custom Wigs</Link></li>
                <li className="mb-4"><Link href="/collections" className="hover:underline">Browse Collection</Link></li>
                <li className="mb-4"><Link href="/#deals" className="hover:underline">Deals</Link></li>
              </ul>
            </div>
            {/* Socials */}
            <div>
              <div className="font-semibold mb-4 text-sm">Socials</div>
              <ul className="space-y-1 text-xs">
                <li className="mb-4"><Link href="https://www.instagram.com/deejah_strands?igsh=MXRza3B6djVoejdjcw%3D%3D&utm_source=qr" passHref target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</Link></li>
                <li className="mb-4"><Link href="https://www.tiktok.com/@deejah.strands?_t=ZS-8zvHvQwU0er&_r=1" passHref target="_blank" rel="noopener noreferrer" className="hover:underline">Tiktok</Link></li>
              </ul>
            </div>
          </div>
        </div>
        {/* Subscribe */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-3">
          <div className="font-semibold mb-4 text-sm">Subscribe</div>
          <p className="text-xs mb-4">Enter your email below to be the first to know about new collections and product launches</p>
          <form className="flex gap-2 w-full" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your Email"
              className="flex-1 rounded-md px-3 py-2 bg-transparent border border-[#FCFCFC] text-[#FCFCFC] placeholder-[#FCFCFC] focus:outline-none text-sm"
              disabled
            />
            <Button type="submit" variant="tertiary" className="!bg-[#FCFCFC] !text-[#161616] min-w-[100px]">Subscribe</Button>
          </form>
        </div>
      </SectionContainer>
      <div className="mt-8 border-t border-[#FCFCFC]/10 pt-4 text-center text-xs text-[#FCFCFC] opacity-80">
        © 2025 Deejah Strands. All rights reserved.
      </div>

      <HairTagsCloud />
    </footer>
  );
} 