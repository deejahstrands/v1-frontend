import { Metadata } from 'next';
import ConsultationClient from './consultation-client';
import { StructuredData, consultationServiceSchema } from '@/components/seo/structured-data';

export const metadata: Metadata = {
  title: 'Consultation | Book Wig Consultation',
  description: 'Get personalized expert advice for your perfect wig. Choose from in-studio, virtual, or home visit consultations. Includes ₦5,000 voucher toward your first purchase.',
  keywords: [
    'wig consultation',
    'hair consultation Nigeria',
    'wig expert advice',
    'virtual wig consultation',
    'in-studio consultation',
    'home visit consultation',
    'wig fitting',
    'hair specialist',
    'wig measurements',
    'personalized wig advice'
  ],
  openGraph: {
    title: 'Book Wig Consultation - Deejah Strands Expert Advice',
    description: 'Get personalized expert advice for your perfect wig. In-studio, virtual, or home visit options available.',
    url: 'https://deejahstrands.co/consultation',
    images: [
      {
        url: '/logo/logo-white.svg',
        width: 1200,
        height: 630,
        alt: 'Deejah Strands Wig Consultation',
      },
    ],
  },
  twitter: {
    title: 'Book Wig Consultation - Deejah Strands',
    description: 'Get personalized expert advice for your perfect wig. Professional consultation services available.',
  },
  alternates: {
    canonical: 'https://deejahstrands.co/consultation',
  },
};

export default function ConsultationPage() {
  return (
    <>
      <ConsultationClient />
      <StructuredData data={consultationServiceSchema} />
    </>
  );
}