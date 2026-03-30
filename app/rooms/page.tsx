import RoomsContent from '@/components/rooms-content'
import { ROOMS } from '@/lib/constants'
import { constructMetadata } from '@/lib/seo/metadata'
import LayoutWrapper from '../layout-wrapper'
import { getDictionary } from '@/lib/i18n/get-dictionary'

export const metadata = constructMetadata({
  title: 'Our Rooms',
  description: 'Explore our range of luxury accommodations at Sri Ganesh Residency.',
})

async function getAvailableRooms() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/rooms`, { cache: 'no-store' });
    if (!res.ok) return ROOMS;
    const data = await res.json();
    
    // Filter ROOMS based on DB availability
    return ROOMS.filter(room => {
      const dbRoom = data.rooms?.find((r: any) => r.roomId === room.id.toString());
      return dbRoom ? dbRoom.availableRooms > 0 && dbRoom.isAvailable : true;
    });
  } catch (error) {
    return ROOMS;
  }
}

export default async function RoomsPage() {
  const dictionary = await getDictionary('en')
  const availableRooms = await getAvailableRooms()
  
  return (
    <LayoutWrapper>
      <RoomsContent rooms={availableRooms} dictionary={dictionary} />
    </LayoutWrapper>
  )
}
