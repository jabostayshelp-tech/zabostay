import { HeroSection } from "@/components/home/hero-section";
import { RecommendationsSection } from "@/components/home/recommendations-section";
import { PromoSection } from "@/components/home/promo-section";
import { ReviewsSection } from "@/components/home/reviews-section";
import { FAQSection } from "@/components/home/faq-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <RecommendationsSection />
      <PromoSection />
      <ReviewsSection />
      <FAQSection />
    </>
  );
}
