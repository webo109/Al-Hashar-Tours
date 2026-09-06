import { useTranslations } from "next-intl";
import { BoardingPass } from "./BoardingPass";

// The boarding pass in its own band, right after the hero. The pass keeps
// id="booking" so the nav and the hero's Plan Your Journey link land here.
export function BookingBand() {
  const hero = useTranslations("Hero");
  const booking = useTranslations("Booking");
  return (
    <section id="plan" className="relative isolate bg-surface py-20 md:py-28">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
        style={{ background: "radial-gradient(55% 45% at 50% 0%, rgb(232 158 0 / 0.14), transparent 70%)" }}
      />
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <div className="mx-auto max-w-[720px] text-center">
          <h2 className="text-balance text-3xl font-medium leading-[1.08] tracking-tight text-fg md:text-5xl">
            {hero("subtext")}
          </h2>
          <p className="mt-3 text-[16px] text-fg/70">{booking("passSubtitle")}</p>
        </div>
        <div className="mx-auto mt-10 max-w-[720px]">
          <BoardingPass />
        </div>
      </div>
    </section>
  );
}
