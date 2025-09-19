import { Metadata } from 'next';
import ProductClient from './product-client';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  return {
    title: 'Product Details - Premium Hair Products',
    description: 'View detailed information about our premium hair products including customizations, specifications, and pricing.',
    keywords: ['hair products', 'wigs', 'extensions', 'customization', 'premium hair'],
    authors: [{ name: 'Deejah Strands' }],
    openGraph: {
      title: 'Product Details - Deejah Strands',
      description: 'Premium hair products with customization options',
      url: `https://deejahstrands.co/products/${id}`,
      siteName: 'Deejah Strands',
      images: [
        {
          url: 'https://deejahstrands.co/images/logo-white.svg',
          width: 1200,
          height: 630,
          alt: 'Deejah Strands Logo',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Product Details - Deejah Strands',
      description: 'Premium hair products with customization options',
      images: ['https://deejahstrands.co/images/logo-white.svg'],
      creator: '@deejahstrands',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `https://deejahstrands.co/products/${id}`,
    },
  };
}

export default function ProductPage({ }: Props) {
  return <ProductClient />;
}
