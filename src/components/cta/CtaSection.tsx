"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FadeUp } from "./FadeUp";
import { PrimaryButton } from "./PrimaryButton";
import { CtaDashboardMock } from "./CtaDashboardMock";
import { useIsMobile } from "./useIsMobile";

export function CtaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const dashboardY = useTransform(scrollYProgress, [0, 1], ["100px", "-100px"]);
  const grassY = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? ["60px", "-30px"] : ["160px", "-160px"]
  );

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="relative w-full overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #0F1318 0%, #14191E 40%, #14191E 100%)",
      }}
    >
      <div className="relative z-20 mx-auto max-w-[1080px] px-4 pt-20 sm:px-6 sm:pt-28 md:pt-36">
        <div className="max-w-[440px]">
          <FadeUp delay={0}>
            <h2 className="text-3xl font-normal leading-[1.08] tracking-[-0.02em] text-white sm:text-4xl md:text-[2.75rem]">
              One honest conversation can change the trajectory of your career.
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="mt-6 max-w-[380px] text-base leading-[1.6] text-white/60 sm:text-lg">
              Connect with verified JBCN alumni who have walked the path you&apos;re on. From university applications to career decisions — get the guidance you need, when you need it.
            </p>
          </FadeUp>
          <FadeUp delay={0.2} className="mt-8">
            <PrimaryButton as="a" href="/browse">
              Start for free
            </PrimaryButton>
          </FadeUp>
        </div>
      </div>

      <motion.div
        style={{ y: dashboardY }}
        className="pointer-events-none absolute left-3 right-3 top-[320px] z-10 sm:left-auto sm:right-[-4%] sm:top-[280px] sm:w-[70%] md:right-[-6%] md:top-[260px] md:w-[65%] lg:right-[-8%] lg:top-[220px] lg:w-[60%]"
      >
        <CtaDashboardMock />
      </motion.div>

      <motion.img
        src="https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1780586778/cta-bg_mlwy5s.png"
        alt=""
        aria-hidden
        style={{ y: grassY }}
        className="pointer-events-none absolute bottom-[-20px] left-0 right-0 z-30 w-full select-none object-cover sm:bottom-[-60px] lg:bottom-[-100px]"
      />

      <div className="h-[480px] sm:h-[560px] md:h-[520px]" />
    </section>
  );
}
