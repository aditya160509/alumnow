import { HeroSection } from "./_components/HeroSection";
import { SecondSection } from "./_components/SecondSection";
import { SectionBridge } from "./_components/SectionBridge";
import { SocialProofSection } from "./_components/SocialProofSection";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <SectionBridge />
      <SecondSection />
      <SocialProofSection />
      <Footer />
    </div>
  );
}
