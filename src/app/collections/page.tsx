import { Metadata } from 'next';
import CollectionsClient from './collections-client';

export const metadata: Metadata = {
  title: 'Collections | Deejah Strands',
  description: 'Explore our featured collection of premium wigs, closures, and hair extensions. Handpicked luxury hair pieces crafted for elegance and style.',
  keywords: [
    'featured hair collection',
    'premium wig collection',
    'luxury hair bundles',
    'curated hair pieces',
    'best selling wigs',
    'top rated hair extensions',
    'featured closures',
    'premium frontals',
    'collection hair Nigeria'
  ],
  openGraph: {
    title: 'Featured Collections - Deejah Strands Premium Hair',
    description: 'Explore our featured collection of premium wigs, closures, and hair extensions. Handpicked luxury hair pieces crafted for elegance and style.',
    url: 'https://deejahstrands.co/collections',
    images: [
      {
        url: '/logo/logo-white.svg',
        width: 1200,
        height: 630,
        alt: 'Deejah Strands Featured Collections',
      },
    ],
  },
  twitter: {
    title: 'Featured Collections - Deejah Strands Premium Hair',
    description: 'Explore our featured collection of premium wigs, closures, and hair extensions.',
  },
  alternates: {
    canonical: 'https://deejahstrands.co/collections',
  },
};

export default function CollectionsPage() {
  return <CollectionsClient />;
} 