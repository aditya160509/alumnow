import testimonials from "@/data/testimonials.json";
import { Star } from "lucide-react";

export function TestimonialsSection() {
  return (
    <section className="bg-primary-dark px-6 py-24 text-white sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col justify-between gap-5 border-t border-white/15 pt-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-accent">From the community</p>
            <h2 className="mt-4 max-w-3xl font-serif text-5xl leading-[.92] tracking-tight sm:text-6xl">A useful conversation stays with you.</h2>
          </div>
          <p className="max-w-[30ch] text-sm leading-6 text-white/55">Short, focused conversations. The kind you remember when it is time to decide.</p>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-[1.2fr_.8fr_.8fr]">
          {testimonials.map((testimonial, index) => {
            const quoteClass = index === 0 ? "mt-16 text-2xl leading-9 sm:text-3xl" : "mt-10 text-lg leading-7";
            return (
              <article key={testimonial.id} className={`liquid-glass rounded-2xl p-6 ${index === 0 ? "md:row-span-2 md:p-8" : ""}`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={testimonial.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-white">{testimonial.authorName}</p>
                      <p className="text-xs text-white/50">{testimonial.authorRole}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 text-accent" aria-label={`${testimonial.rating} out of 5 stars`}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={13} fill={star <= testimonial.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                </div>
                <p className={`${quoteClass} text-white/85`}>&ldquo;{testimonial.quote}&rdquo;</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
