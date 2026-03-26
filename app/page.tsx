import HeroSection from '@/components/hero-section'
import FeaturedRooms from '@/components/featured-rooms'
import AmenitiesSection from '@/components/amenities-section'
import Testimonials from '@/components/testimonials'
import GalleryPreview from '@/components/gallery-preview'
import LocationSection from '@/components/location-section'
import { constructMetadata } from '@/lib/seo/metadata'
import LayoutWrapper from './layout-wrapper'

export const metadata = constructMetadata()

import { getDictionary } from '@/lib/i18n/get-dictionary'

export default async function Home() {
  const dictionary = await getDictionary('en')
  
  return (
    <LayoutWrapper>
      <main>
        <HeroSection dictionary={dictionary} />
        <FeaturedRooms dictionary={dictionary} />
        <AmenitiesSection dictionary={dictionary} />
        <Testimonials dictionary={dictionary} />
        <GalleryPreview />
        <LocationSection />
      </main>
    </LayoutWrapper>
  )
}

