import type { TourContent } from "@/data/tours";

export function Itinerary({ steps }: { steps: TourContent["itinerary"] }) {
  return (
    <ol className="relative ms-3 border-s border-gold/30 ps-8">
      {steps.map((step, i) => (
        <li key={`${step.label}-${i}`} className="relative pb-9 last:pb-0">
          <span
            aria-hidden
            className="absolute -start-[calc(2rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_0_4px_rgba(11,18,32,1)]"
          />
          <span className="block text-[12px] font-medium text-gold-300">{step.label}</span>
          <h3 className="mt-1 text-xl font-medium tracking-tight text-cream">{step.title}</h3>
          <p className="mt-2 max-w-[62ch] text-[15px] leading-relaxed text-cream/75">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}
