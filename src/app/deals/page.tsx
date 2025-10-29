import { Metadata } from 'next';
import DealsClient from './deals-client';

export const metadata: Metadata = {
  title: 'Deals & Discounts - Limited Time Offers',
  description: 'Discover the best deals on luxury wigs, bundles, and more. Enjoy exclusive discounts for a limited time only! Save on premium hair pieces.',
  keywords: [
    'hair deals',
    'wig discounts',
    'hair sale',
    'discounted wigs',
    'hair bundles sale',
    'limited time offers',
    'premium hair deals',
    'luxury wig sale',
    'hair extensions discount',
    'best hair deals Nigeria'
  ],
  openGraph: {
    title: 'Deals & Discounts - Deejah Strands Limited Offers',
    description: 'Discover the best deals on luxury wigs, bundles, and more. Exclusive discounts for a limited time only!',
    url: 'https://deejahstrands.co/deals',
    images: [
      {
        url: '/logo/logo-white.svg',
        width: 1200,
        height: 630,
        alt: 'Deejah Strands Deals & Discounts',
      },
    ],
  },
  twitter: {
    title: 'Deals & Discounts - Deejah Strands',
    description: 'Discover the best deals on luxury wigs and hair extensions. Limited time offers!',
  },
  alternates: {
    canonical: 'https://deejahstrands.co/deals',
  },
};

export default function DealsPage() {
  return <DealsClient />;
} 