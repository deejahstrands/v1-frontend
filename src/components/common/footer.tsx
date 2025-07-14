import Image from "next/image";
import { SectionContainer } from "./section-container";
import { Button } from "./button";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { HairTagsCloud } from "@/components/home/HairTagsCloud";

export function Footer() {
  return (
    <footer className="w-full bg-[#161616] pt-10 pb-20 lg:pb-0">
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
                <li className="mb-4"><Link href="/category/new-arrivals" className="hover:underline">New Arrivals</Link></li>
                <li className="mb-4"><Link href="/category/categories" className="hover:underline">Categories</Link></li>
              </ul>
            </div>
            {/* Service */}
            <div>
              <div className="font-semibold mb-4 text-sm">Service</div>
              <ul className="space-y-1 text-xs">
                <li className="mb-4"><Link href="/consultation" className="hover:underline">Consultation</Link></li>
                <li className="mb-4"><Link href="/custom-wigs" className="hover:underline">Custom Wigs</Link></li>
                <li className="mb-4"><Link href="/about" className="hover:underline">About Us</Link></li>
              </ul>
            </div>
            {/* Socials */}
            <div>
              <div className="font-semibold mb-4 text-sm">Socials</div>
              <ul className="space-y-1 text-xs">
                <li className="mb-4"><Link href="https://instagram.com/deejahstrands" passHref target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</Link></li>
                <li className="mb-4"><Link href="https://tiktok.com/@deejahstrands" passHref target="_blank" rel="noopener noreferrer" className="hover:underline">Tiktok</Link></li>
                <li className="mb-4"><Link href="https://pinterest.com/deejahstrands" passHref target="_blank" rel="noopener noreferrer" className="hover:underline">Pinterest</Link></li>
                <li className="mb-4"><Link href="https://x.com/deejahstrands" passHref target="_blank" rel="noopener noreferrer" className="hover:underline">X</Link></li>
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