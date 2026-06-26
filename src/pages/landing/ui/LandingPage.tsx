import Head from "next/head";

import { siteConfig } from "@/shared/config";

import { SiteHeader } from "@/widgets/site-header";
import { HeroSection } from "../sections/HeroSection";
import { FeaturesSection } from "../sections/FeaturesSection";
import { ProblemsSection } from "../sections/ProblemsSection";
import { TrustedSection } from "../sections/TrustedSection";
import { TestimonialsSection } from "../sections/TestimonialsSection";
import { PricingSection } from "../sections/PricingSection";
import { FinalCTASection } from "../sections/FinalCTASection";
import { FAQSection } from "../sections/FAQSection";
import { Footer } from "../sections/Footer";

const TITLE = "Bilimtrack — ваше заведение полностью цифровое за одну неделю";
const DESCRIPTION =
  "Цифровая платформа для учебных заведений: электронный журнал, расписание, геймификация, рейтинги. Подключим систему и обучим сотрудников за вас.";
const OG_IMAGE = `${siteConfig.url}/dashboard.png`;

/** `/` — the marketing landing page (ported from bilimtrack-landing). */
export function LandingPage() {
  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta content={DESCRIPTION} name="description" />
        <meta
          content="Bilimtrack, LMS, электронный журнал, рейтинг студентов, образование, система управления обучением, расписание, посещаемость, геймификация, учебное заведение, Кыргызстан, Бишкек"
          name="keywords"
        />
        <link href={siteConfig.url} rel="canonical" />

        {/* Open Graph */}
        <meta content="website" property="og:type" />
        <meta content={siteConfig.locale} property="og:locale" />
        <meta content={siteConfig.name} property="og:site_name" />
        <meta content={TITLE} property="og:title" />
        <meta content={DESCRIPTION} property="og:description" />
        <meta content={OG_IMAGE} property="og:image" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          content="Bilimtrack — система управления обучением"
          property="og:image:alt"
        />
        <meta content={siteConfig.url} property="og:url" />

        {/* Twitter */}
        <meta content="summary_large_image" name="twitter:card" />
        <meta content={TITLE} name="twitter:title" />
        <meta content={DESCRIPTION} name="twitter:description" />
        <meta content={OG_IMAGE} name="twitter:image" />
      </Head>

      <div className="landing-root min-h-screen">
        <SiteHeader activeHref="/#product" />
        <main>
          <HeroSection />
          <FeaturesSection />
          <ProblemsSection />
          <TrustedSection />
          <TestimonialsSection />
          <PricingSection />
          <FinalCTASection />
          <FAQSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
