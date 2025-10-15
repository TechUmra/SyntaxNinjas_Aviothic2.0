import FooterCTA from "./Components/footer-cta";
import Hero from "./Components/Hero";
import HowItWorks from "./Components/Howitworks";
import ImpactStats from "./Components/impact-stats";


import Partners from "./Components/Partners";


export default function HomePage() {
  return (
    <main>
      
      <Hero />
      <HowItWorks />
      <ImpactStats />
      <Partners />
      <FooterCTA />
    </main>
  )
}
