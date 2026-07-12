"use client";

export function AlumNowHeroPreview() {
  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl"
      style={{ backgroundColor: "hsl(201 100% 13%)" }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />

      <div className="relative z-10 flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4">
        <span className="font-serif text-sm tracking-tight text-white sm:text-base md:text-lg">
          AlumNow<sup className="text-[0.5em]">&reg;</sup>
        </span>
        <nav className="hidden gap-4 text-[9px] text-white/60 md:flex lg:text-[10px]">
          <span className="text-white">Home</span>
          <span className="hover:text-white">Browse</span>
          <span className="hover:text-white">About</span>
          <span className="hover:text-white">For alumni</span>
          <span className="hover:text-white">Contact</span>
        </nav>
        <div className="liquid-glass rounded-full px-2.5 py-1 text-[9px] text-white sm:px-3 sm:text-[10px]">
          Find a mentor
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center px-3 pt-3 text-center sm:px-4 sm:pt-5 md:pt-7">
        <h1 className="animate-fade-rise max-w-[90%] font-serif text-lg font-normal leading-[0.95] tracking-[-0.03em] text-white sm:text-2xl md:text-3xl lg:text-4xl">
          Where <em className="not-italic text-white/55">ambition</em> meets <em className="not-italic text-white/55">guidance.</em>
        </h1>
        <p className="animate-fade-rise-delay mt-2 max-w-[80%] text-[9px] leading-relaxed text-white/60 sm:mt-3 sm:max-w-sm sm:text-[11px] md:mt-4 md:max-w-md md:text-xs">
          AlumNow connects you with verified JBCN alumni who have walked the path you&apos;re on. One honest conversation can change everything.
        </p>
        <div className="animate-fade-rise-delay-2 liquid-glass mt-3 rounded-full px-4 py-1.5 text-[9px] text-white sm:mt-4 sm:px-5 sm:py-2 sm:text-[10px] md:mt-5 md:px-6 md:py-2.5">
          Begin your journey
        </div>
      </div>

      <div className="flex-1" />
    </div>
  );
}
