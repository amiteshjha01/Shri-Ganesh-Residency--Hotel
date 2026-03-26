import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ScrollToTop from '@/components/scroll-to-top'
import WhatsAppButton from '@/components/whatsapp-button'

import { getDictionary } from '@/lib/i18n/get-dictionary'

export default async function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const dictionary = await getDictionary('en')
  
  return (
    <>
      <Navbar dictionary={dictionary} />
      {children}
      <Footer dictionary={dictionary} />
      <ScrollToTop />
      <WhatsAppButton />
    </>
  )
}
