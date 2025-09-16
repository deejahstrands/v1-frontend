import { Metadata } from 'next';
import CustomizationClient from './customization-client';
import { StructuredData, customizationServiceSchema } from '@/components/seo/structured-data';

export const metadata: Metadata = {
  title: 'Custom Wig Design - Make It Yours',
  description: 'Design your perfect custom wig with premium options. Choose hair type, texture, length, color, and construction. Create a bespoke unit uniquely yours.',
  keywords: [
    'custom wig design',
    'bespoke wig',
    'personalized wig',
    'wig customization',
    'custom hair unit',
    'made to order wig',
    'wig builder',
    'custom lace wig',
    'personalized hair',
    'wig design tool',
    'custom closure',
    'custom frontal',
    'hair customization Nigeria'
  ],
  openGraph: {
    title: 'Custom Wig Design - Make It Yours | Deejah Strands',
    description: 'Design your perfect custom wig with premium options. Choose every detail to create a bespoke unit uniquely yours.',
    url: 'https://deejahstrands.co/customization',
    images: [
      {
        url: '/logo/logo-white.svg',
        width: 1200,
        height: 630,
        alt: 'Deejah Strands Custom Wig Design',
      },
    ],
  },
  twitter: {
    title: 'Custom Wig Design - Make It Yours | Deejah Strands',
    description: 'Design your perfect custom wig with premium options. Create a bespoke unit uniquely yours.',
  },
  alternates: {
    canonical: 'https://deejahstrands.co/customization',
  },
};

export default function CustomizationPage() {
  return (
    <>
      <CustomizationClient />
      <StructuredData data={customizationServiceSchema} />
    </>
  );
}