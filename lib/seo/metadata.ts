import { Metadata } from 'next'
import { HOTEL_INFO } from '@/lib/constants'

interface MetadataProps {
  title?: string
  description?: string
  image?: string
  noIndex?: boolean
}

export function constructMetadata({
  title,
  description = HOTEL_INFO.description,
  image = '/og-image.jpg',
  noIndex = false,
}: MetadataProps = {}): Metadata {
  const fullTitle = title 
    ? `${title} | ${HOTEL_INFO.name}` 
    : `${HOTEL_INFO.name} | ${HOTEL_INFO.tagline}`

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      images: [
        {
          url: image,
        },
      ],
      type: 'website',
      siteName: HOTEL_INFO.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@shriganeshresidency',
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    metadataBase: new URL('https://shriganeshresidency.com'),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  }
}
