import { Metadata } from 'next';
import ShopClient from './shop-client';
import { StructuredData, storeSchema } from '@/components/seo/structured-data';

export const metadata: Metadata = {
  title: 'Shop | All Categories',
  description: 'Browse our complete collection of premium wigs, closures, frontals, and hair extensions. Find luxury hair pieces in all textures, lengths, and styles.',
  keywords: [
    'shop hair online',
    'buy wigs online Nigeria',
    'hair store',
    'wig shop',
    'closure shop',
    'frontal shop',
    'hair extensions shop',
    'premium hair store',
    'luxury wig store',
    'Nigerian hair shop',
    'raw hair shop',
    'virgin hair shop'
  ],
  openGraph: {
    title: 'Shop Premium Hair & Wigs - Deejah Strands',
    description: 'Browse our complete collection of premium wigs, closures, frontals, and hair extensions. Find luxury hair pieces in all textures, lengths, and styles.',
    url: 'https://deejahstrands.co/shop',
    images: [
      {
        url: '/logo/logo-white.svg',
        width: 1200,
        height: 630,
        alt: 'Deejah Strands Hair Shop',
      },
    ],
  },
  twitter: {
    title: 'Shop Premium Hair & Wigs - Deejah Strands',
    description: 'Browse our complete collection of premium wigs, closures, frontals, and hair extensions.',
  },
  alternates: {
    canonical: 'https://deejahstrands.co/shop',
  },
};

export default function ShopPage() {
  return (
    <>
      <ShopClient />
      <StructuredData data={storeSchema} />
    </>
  );
} 