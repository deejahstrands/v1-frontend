import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { DeejahStrandsCollectionSection } from "@/components/home/DeejahStrandsCollectionSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { ConsultationCtaSection } from "@/components/home/ConsultationCtaSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import DealsSection from "@/components/home/DealsSection";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | Deejah Strands',
  description: 'Experience the finest raw and virgin hair — flawlessly customized for your look, lifestyle, and legacy. Shop premium wigs, closures, frontals, and bundles with free consultation.',
  keywords: [
    'luxury hair Nigeria',
    'virgin hair wigs',
    'custom hair units',
    'HD lace wigs',
    'closure wigs',
    'frontal wigs',
    'hair customization',
    'premium hair extensions',
    'raw hair bundles',
    'Nigerian hair brand'
  ],
  openGraph: {
    title: 'Deejah Strands - Luxury Hair That Speaks For You',
    description: 'Experience the finest raw and virgin hair — flawlessly customized for your look, lifestyle, and legacy.',
    url: 'https://deejahstrands.co',
    images: [
      {
        url: '/logo/logo-white.svg',
        width: 1200,
        height: 630,
        alt: 'Deejah Strands - Luxury Hair Collection',
      },
    ],
  },
  twitter: {
    title: 'Deejah Strands - Luxury Hair That Speaks For You',
    description: 'Experience the finest raw and virgin hair — flawlessly customized for your look, lifestyle, and legacy.',
  },
  alternates: {
    canonical: 'https://deejahstrands.co',
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <DeejahStrandsCollectionSection />
      <CategoriesSection />
      <TestimonialsSection />
      <DealsSection />
      <ConsultationCtaSection />
    </>
  );
}
