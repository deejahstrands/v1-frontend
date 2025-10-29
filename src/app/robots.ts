import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/login/',
          '/register/',
          '/_next/',
          '/private/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/login/',
          '/register/',
          '/private/',
        ],
      }
    ],
    sitemap: 'https://deejahstrands.co/sitemap.xml',
    host: 'https://deejahstrands.co'
  }
}
