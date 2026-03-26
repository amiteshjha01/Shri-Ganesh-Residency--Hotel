import { MetadataRoute } from 'next'
import { ROOMS } from '@/lib/constants'

const BASE_URL = 'https://shriganeshresidency.com' // Should be updated to actual domain

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = []

  // Static Pages
  const staticPages = ['', '/rooms', '/about', '/gallery', '/contact']

  // Add static pages
  staticPages.forEach((page) => {
    sitemapEntries.push({
      url: `${BASE_URL}${page}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: page === '' ? 1 : 0.8,
    })
  })

  // Add room detail pages
  ROOMS.forEach((room) => {
    sitemapEntries.push({
      url: `${BASE_URL}/rooms/${room.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    })
  })

  return sitemapEntries
}
