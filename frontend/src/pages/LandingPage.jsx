import CTASection from "../components/landing/CTASection";
import HeroSection from "../components/landing/HeroSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import TestimoniSection from "../components/landing/TestimoniSection";
import StatsSection from "../components/landing/StatsSection";

function LandingPage() {
  return (
    <div>
      <HeroSection />
      <HowItWorksSection />
      <StatsSection />
      <TestimoniSection />
      <CTASection />
    </div>
  );
}

export default LandingPage