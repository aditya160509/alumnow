"use client";
import { useEffect, useRef } from "react";
import Hls from "hls.js";

const stream = "https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8";

export function PathSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let hls: Hls | undefined;
    if (video.canPlayType("application/vnd.apple.mpegurl")) video.src = stream;
    else if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: false });
      hls.loadSource(stream);
      hls.attachMedia(video);
    }
    return () => hls?.destroy();
  }, []);

  return (
    <section id="path" className="relative isolate min-h-[100dvh] overflow-hidden bg-primary-dark text-white">
      <video ref={videoRef} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover opacity-90" aria-hidden="true" />
      <div className="absolute inset-0 bg-primary-dark/20" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary-dark via-primary-dark/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-primary-dark via-primary-dark/50 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-[1500px] flex-col justify-center px-6 sm:px-10 lg:px-16">
        <div className="max-w-3xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[.18em] text-accent sm:text-sm">The AlumNow approach</p>
          <h2 className="font-serif text-5xl leading-[.94] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.5rem]">
            One honest conversation <span className="text-accent">can change everything.</span>
          </h2>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            No complicated process. Just the right person, the right question, and enough space to think clearly.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="https://calendly.com" target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-primary-dark transition hover:bg-accent-light">Book a 30-minute session</a>
            <a href="#how-it-works" className="inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-6 text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/5">Learn more</a>
          </div>
        </div>
      </div>
    </section>
  );
}
