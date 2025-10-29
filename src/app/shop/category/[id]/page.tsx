import { Metadata } from 'next';
import CategoryClient from './category-client';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  // You could fetch category data here for dynamic metadata
  // For now, we'll use static metadata with category-specific info
  
  return {
    title: 'Hair Category - Premium Wigs & Extensions',
    description: 'Browse our premium hair category featuring luxury wigs, closures, frontals, and hair extensions. Find the perfect hair piece for your style.',
    keywords: [
      'hair category',
      'wigs by category',
      'hair extensions category',
      'closure wigs',
      'frontal wigs',
      'straight hair',
      'curly hair',
      'wavy hair',
      'raw hair bundles',
      'premium hair category'
    ],
    openGraph: {
      title: 'Hair Category - Deejah Strands Premium Collection',
      description: 'Browse our premium hair category featuring luxury wigs, closures, frontals, and hair extensions.',
      url: `https://deejahstrands.co/shop/category/${id}`,
      images: [
        {
          url: '/logo/logo-white.svg',
          width: 1200,
          height: 630,
          alt: 'Deejah Strands Hair Category',
        },
      ],
    },
    twitter: {
      title: 'Hair Category - Deejah Strands Premium Collection',
      description: 'Browse our premium hair category featuring luxury wigs, closures, frontals, and hair extensions.',
    },
    alternates: {
      canonical: `https://deejahstrands.co/shop/category/${id}`,
    },
  };
}


export default function CategoryPage({ params }: Props) {
  return <CategoryClient params={params} />;
}

