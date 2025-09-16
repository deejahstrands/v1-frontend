import Script from 'next/script';

interface StructuredDataProps {
  data: object;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}

// Common structured data schemas
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Deejah Strands",
  description: "Premium luxury hair and wig brand specializing in raw and virgin hair extensions, custom wigs, closures, and frontals.",
  url: "https://deejahstrands.co",
  logo: "https://deejahstrands.co/logo/logo-white.svg",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+234-906-429-6611",
    contactType: "customer service",
    email: "deejahstrands@gmail.com"
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "3 Otunba Olumide Osunsina Crescent",
    addressLocality: "Lekki",
    postalCode: "106104",
    addressCountry: "NG"
  },
  sameAs: [
    "https://instagram.com/deejahstrands",
    "https://tiktok.com/@deejahstrands",
    "https://pinterest.com/deejahstrands",
    "https://twitter.com/deejahstrands"
  ]
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Deejah Strands",
  description: "Premium luxury hair and wig brand specializing in raw and virgin hair extensions, custom wigs, closures, and frontals.",
  url: "https://deejahstrands.co",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://deejahstrands.co/shop?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

export const storeSchema = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "Deejah Strands",
  description: "Premium luxury hair and wig store specializing in raw and virgin hair extensions, custom wigs, closures, and frontals.",
  url: "https://deejahstrands.co/shop",
  image: "https://deejahstrands.co/logo/logo-white.svg",
  telephone: "+234-906-429-6611",
  email: "deejahstrands@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "3 Otunba Olumide Osunsina Crescent",
    addressLocality: "Lekki",
    postalCode: "106104",
    addressCountry: "NG"
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "6.4474",
    longitude: "3.5889"
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday", 
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      opens: "09:00",
      closes: "18:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "10:00",
      closes: "16:00"
    }
  ],
  priceRange: "₦₦₦",
  paymentAccepted: ["Cash", "Credit Card", "Bank Transfer"],
  currenciesAccepted: "NGN"
};

export const consultationServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Wig Consultation Service",
  description: "Professional wig consultation services including in-studio, virtual, and home visit options. Get personalized expert advice for your perfect wig.",
  provider: {
    "@type": "Organization",
    name: "Deejah Strands"
  },
  serviceType: "Hair Consultation",
  areaServed: {
    "@type": "Country",
    name: "Nigeria"
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Wig Consultation Options",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "In Studio Consultation",
          description: "Visit our Lagos studio for a personalized consultation experience"
        },
        price: "15000",
        priceCurrency: "NGN"
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Virtual Consultation",
          description: "Get expert advice from the comfort of your home via video call"
        },
        price: "10000",
        priceCurrency: "NGN"
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Private Home Visit",
          description: "We come to you for a private consultation at your location"
        },
        price: "25000",
        priceCurrency: "NGN"
      }
    ]
  }
};

export const customizationServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Custom Wig Design Service",
  description: "Design your perfect custom wig with premium options. Choose hair type, texture, length, color, and construction to create a bespoke unit uniquely yours.",
  provider: {
    "@type": "Organization",
    name: "Deejah Strands"
  },
  serviceType: "Custom Wig Manufacturing",
  areaServed: {
    "@type": "Country",
    name: "Nigeria"
  },
  offers: {
    "@type": "Offer",
    itemOffered: {
      "@type": "Product",
      name: "Custom Wig",
      description: "Bespoke wig crafted to your specifications"
    },
    availability: "https://schema.org/InStock"
  }
};
