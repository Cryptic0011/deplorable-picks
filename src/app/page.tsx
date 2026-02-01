import { Hero } from '@/components/sections/Hero'
import { Features } from '@/components/sections/Features'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { Pricing } from '@/components/sections/Pricing'
import { Reviews } from '@/components/sections/Reviews'
import { WinningSlips } from '@/components/sections/WinningSlips'
import { FAQ } from '@/components/sections/FAQ'

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <WinningSlips />
      <Pricing />
      <Reviews />
      <FAQ />
    </>
  )
}
