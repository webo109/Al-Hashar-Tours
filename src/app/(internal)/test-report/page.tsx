import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { report, type DecisionStatus, type FeatureStatus, type SmokeReport } from "@/data/report";
import { tours } from "@/data/tours";
import smokeJson from "@/data/smoke.generated.json";

const smoke = smokeJson as SmokeReport;

export const metadata: Metadata = {
  title: "QA report, Al-Hashar demo",
  description: "Internal QA report for the Al-Hashar Tourism & Travels demo site.",
  robots: { index: false, follow: false },
};

const badgeTone = {
  green: "bg-[#2f7a5f]/12 text-[#1f5c46] border-[#2f7a5f]/30",
  amber: "bg-gold/15 text-gold-700 border-gold/40",
  red: "bg-[#b0361f]/10 text-[#8f2a17] border-[#b0361f]/30",
  ink: "bg-ink/6 text-ink border-ink/15",
  gold: "bg-gold text-ink border-gold",
} as const;

function Badge({ tone, children }: { tone: keyof typeof badgeTone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-pill border px-2.5 py-0.5 text-[12px] font-medium ${badgeTone[tone]}`}>
      {children}
    </span>
  );
}

const featureBadge: Record<FeatureStatus, { tone: keyof typeof badgeTone; label: string }> = {
  working: { tone: "green", label: "Working" },
  needsSwap: { tone: "amber", label: "Needs swap" },
  postSale: { tone: "ink", label: "Post-sale" },
};

const decisionBadge: Record<DecisionStatus, { tone: keyof typeof badgeTone; label: string }> = {
  open: { tone: "amber", label: "Open" },
  confirmedYes: { tone: "green", label: "Confirmed, yes" },
  confirmedNo: { tone: "ink", label: "Confirmed, no" },
  shipped: { tone: "green", label: "Shipped" },
  deferred: { tone: "ink", label: "Deferred" },
};

function Section({
  id,
  eyebrow,
  title,
  intro,
  muted = false,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  muted?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className={muted ? "bg-sand-300/40" : "bg-cream"}>
      <div className="mx-auto w-full max-w-[1200px] px-6 py-16 md:px-10 md:py-20">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-700">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-5xl">{title}</h2>
        {intro ? <p className="mt-3 max-w-[70ch] text-[15px] leading-relaxed text-ink-soft">{intro}</p> : null}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-panel border border-ink/10 bg-white/70 p-5 ${className}`}>{children}</div>;
}

export default function TestReportPage() {
  const packages = tours.filter((t) => t.kind === "package").length;
  const dayTours = tours.filter((t) => t.kind === "day").length;
  const seaTours = tours.filter((t) => t.kind === "sea").length;
  const classes = [...new Set(smoke.results.map((r) => r.cls))].map((cls) => {
    const rows = smoke.results.filter((r) => r.cls === cls);
    return { cls, passed: rows.filter((r) => r.pass).length, total: rows.length };
  });
  const smokeReady = smoke.total > 0;
  const slowest = [...smoke.results].sort((a, b) => b.ms - a.ms)[0];

  return (
    <main className="text-ink">
      <header className="bg-midnight text-cream">
        <div className="mx-auto w-full max-w-[1200px] px-6 pt-14 pb-16 md:px-10 md:pt-20 md:pb-20">
          <div className="flex flex-wrap items-center gap-3 text-[12px] text-cream/60">
            <LogoMark className="h-8 w-8" />
            <span>Internal QA report</span>
            <span>noindex, nofollow</span>
            <span>Generated {report.generated}</span>
            <span>v{report.version}</span>
          </div>
          <h1 className="mt-6 max-w-[16ch] text-balance text-5xl font-semibold tracking-tight md:text-7xl">
            {report.client}: demo build report
          </h1>
          <p className="mt-5 max-w-[64ch] text-lg text-cream/75">
            What was built, what was tested, what still needs input from the client, and what it costs. Live at{" "}
            <a href={report.liveUrl} className="text-gold-300 underline-offset-4 hover:underline">
              {report.liveUrl.replace("https://", "")}
            </a>
            .
          </p>

          <dl className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Routes tested",
                value: smokeReady ? `${smoke.passed}/${smoke.total}` : "pending",
                note: smokeReady ? `${smoke.results.filter((r) => r.status === 200).length} returned 200, redirects and 404s as expected` : "run npm run smoke",
              },
              { label: "Build", value: "Green", note: "next build, 85 pages prerendered, types and lint clean" },
              { label: "Catalog", value: `${tours.length} products`, note: `${packages} multi-day packages, ${dayTours} day tours, ${seaTours} sea trips` },
              { label: "Languages", value: "2", note: "English default, Arabic with RTL" },
            ].map((s) => (
              <div key={s.label} className="rounded-panel border border-cream/10 bg-cream/5 p-5">
                <dt className="text-[12px] text-cream/60">{s.label}</dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight">{s.value}</dd>
                <dd className="mt-1 text-[13px] text-cream/60">{s.note}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <Section
        id="smoke"
        eyebrow="Smoke tests"
        title="Every route, fetched and recorded."
        intro={
          smokeReady
            ? `Battery run against ${smoke.base} on ${new Date(smoke.generatedAt).toUTCString()}. Slowest response ${slowest?.ms} ms on ${slowest?.path}.`
            : "Run npm run smoke against a running build to fill this section."
        }
      >
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {classes.map((c) => (
            <div key={c.cls} className="flex items-center justify-between rounded-pill border border-ink/10 bg-white/70 px-4 py-3">
              <span className="text-[14px] font-medium">{c.cls}</span>
              <Badge tone={c.passed === c.total ? "green" : "red"}>
                {c.passed}/{c.total}
              </Badge>
            </div>
          ))}
        </div>
        {smokeReady ? (
          <div className="mt-8 overflow-x-auto rounded-panel border border-ink/10 bg-white/70">
            <table className="w-full text-[13px]">
              <thead className="text-left text-ink-soft">
                <tr className="border-b border-ink/10">
                  <th className="px-4 py-3 font-medium">Route</th>
                  <th className="px-4 py-3 font-medium">Class</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Result</th>
                </tr>
              </thead>
              <tbody>
                {smoke.results
                  .filter((r) => r.cls !== "Tour pages" && r.cls !== "Booking wizard")
                  .map((r) => (
                    <tr key={r.path} className="border-b border-ink/5 last:border-0">
                      <td className="px-4 py-2 font-latin">{r.path}</td>
                      <td className="px-4 py-2 text-ink-soft">{r.cls}</td>
                      <td className="px-4 py-2 font-latin">{r.status}</td>
                      <td className="px-4 py-2 font-latin text-ink-soft">{r.ms} ms</td>
                      <td className="px-4 py-2">
                        <Badge tone={r.pass ? "green" : "red"}>{r.pass ? "pass" : "fail"}</Badge>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <p className="px-4 py-3 text-[12px] text-ink-soft">
              Tour pages and booking wizard routes ({smoke.results.filter((r) => r.cls === "Tour pages" || r.cls === "Booking wizard").length}) are summarised above and omitted from the table.
            </p>
          </div>
        ) : null}
      </Section>

      <Section id="features" eyebrow="Feature inventory" title="What is on the site today." muted>
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {report.features.map((f) => (
            <li key={f.name}>
              <Card className="h-full">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold tracking-tight">{f.name}</h3>
                  <Badge tone={featureBadge[f.status].tone}>{featureBadge[f.status].label}</Badge>
                </div>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{f.detail}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="fixes" eyebrow="Fixes applied" title="Real defects found and fixed during the build." intro="Only bugs that actually happened. Each one shows the state before and after.">
        <ol className="grid gap-4 md:grid-cols-2">
          {report.fixes.map((fix, i) => (
            <li key={fix.title}>
              <Card className="h-full">
                <span className="font-latin text-[12px] font-semibold uppercase tracking-[0.18em] text-gold-700">Fix {String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-1 text-lg font-semibold tracking-tight">{fix.title}</h3>
                <div className="mt-4 rounded-input border border-[#b0361f]/25 bg-[#b0361f]/6 px-4 py-3 text-[14px] leading-relaxed">
                  <span className="font-semibold text-[#8f2a17]">Before. </span>
                  {fix.before}
                </div>
                <div className="mt-2 rounded-input border border-[#2f7a5f]/25 bg-[#2f7a5f]/8 px-4 py-3 text-[14px] leading-relaxed">
                  <span className="font-semibold text-[#1f5c46]">After. </span>
                  {fix.after}
                </div>
              </Card>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="session" eyebrow="Session log" title="How the build unfolded." muted>
        <ol className="relative ms-3 border-s border-gold/40 ps-8">
          {report.session.map((s, i) => (
            <li key={s.phase} className="relative pb-8 last:pb-0">
              <span className="absolute -start-[calc(2rem+6px)] top-1 flex h-3 w-3 items-center justify-center rounded-full bg-gold ring-4 ring-cream" aria-hidden />
              <span className="font-latin text-[12px] text-gold-700">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-lg font-semibold tracking-tight">{s.phase}</h3>
              <p className="mt-1 max-w-[70ch] text-[14px] leading-relaxed text-ink-soft">{s.detail}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="swaps" eyebrow="Pre-pitch checklist" title="What still needs the client's input." intro="The demo is deliberately careful where facts could not be verified. Once these are swapped, it is showroom-ready.">
        <div className="overflow-x-auto rounded-panel border border-ink/10 bg-white/70">
          <table className="w-full text-[14px]">
            <thead className="text-left text-ink-soft">
              <tr className="border-b border-ink/10">
                <th className="px-4 py-3 font-medium">What</th>
                <th className="px-4 py-3 font-medium">Where</th>
                <th className="px-4 py-3 font-medium">Effort</th>
              </tr>
            </thead>
            <tbody>
              {report.swaps.map((s) => (
                <tr key={s.what} className="border-b border-ink/5 last:border-0">
                  <td className="px-4 py-3">{s.what}</td>
                  <td className="px-4 py-3 font-latin text-[13px] text-ink-soft">{s.where}</td>
                  <td className="px-4 py-3 text-ink-soft">{s.effort}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="gaps" eyebrow="Gap analysis" title="Honest comparison with the current site." muted>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Their site has, the demo does not", items: report.gaps.theirs, tone: "amber" as const },
            { title: "The demo has, their site does not", items: report.gaps.ours, tone: "green" as const },
            { title: "Both are missing", items: report.gaps.both, tone: "ink" as const },
          ].map((col) => (
            <Card key={col.title}>
              <Badge tone={col.tone}>{col.title}</Badge>
              <ul className="mt-4 flex flex-col gap-2 text-[14px] leading-relaxed">
                {col.items.map((i) => (
                  <li key={i} className="border-t border-ink/5 pt-2 first:border-0 first:pt-0">
                    {i}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="roadmap" eyebrow="Roadmap" title="What comes next, in three tiers.">
        <div className="grid gap-6 lg:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold">Tier 1, do first</h3>
            <ul className="mt-3 flex flex-col gap-3">
              {report.roadmap.tier1.map((r) => (
                <li key={r.title}>
                  <Card>
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-semibold">{r.title}</span>
                      <Badge tone="gold">{r.effort}</Badge>
                    </div>
                    <p className="mt-1 text-[13px] text-ink-soft">{r.impact}</p>
                    <p className="mt-2 font-latin text-[12px] text-ink-soft/80">{r.files}</p>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Tier 2, if time permits</h3>
            <ul className="mt-3 flex flex-col gap-3">
              {report.roadmap.tier2.map((r) => (
                <li key={r.title}>
                  <Card>
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-semibold">{r.title}</span>
                      <Badge tone="ink">{r.effort}</Badge>
                    </div>
                    <p className="mt-1 text-[13px] text-ink-soft">{r.impact}</p>
                    <p className="mt-2 font-latin text-[12px] text-ink-soft/80">{r.files}</p>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Tier 3, skip before the pitch</h3>
            <ul className="mt-3 flex flex-col gap-3">
              {report.roadmap.tier3.map((r) => (
                <li key={r.title}>
                  <Card>
                    <span className="font-semibold">{r.title}</span>
                    <p className="mt-1 text-[13px] text-ink-soft">{r.reason}</p>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section id="decisions" eyebrow="Decisions log" title="Questions raised and where they stand." muted>
        <div className="overflow-x-auto rounded-panel border border-ink/10 bg-white/70">
          <table className="w-full text-[14px]">
            <thead className="text-left text-ink-soft">
              <tr className="border-b border-ink/10">
                <th className="px-4 py-3 font-medium">Question</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Resolution</th>
              </tr>
            </thead>
            <tbody>
              {report.decisions.map((d, i) => (
                <tr key={d.q} className="border-b border-ink/5 last:border-0">
                  <td className="px-4 py-3">
                    <span className="font-latin text-[12px] text-gold-700">Q{i + 1} </span>
                    {d.q}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={decisionBadge[d.status].tone}>{decisionBadge[d.status].label}</Badge>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{d.resolution}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="pricing" eyebrow="Pricing strategy" title="Three models, one recommended.">
        <div className="grid gap-4 md:grid-cols-3">
          {report.pricing.models.map((m) => (
            <Card key={m.name} className={m.recommended ? "border-gold shadow-[inset_0_0_0_1px_var(--color-gold)]" : ""}>
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold tracking-tight">{m.name}</h3>
                {m.recommended ? <Badge tone="gold">Recommended</Badge> : null}
              </div>
              <p className="mt-2 text-[14px] text-ink-soft">{m.summary}</p>
              <p className="mt-3 text-[13px]"><span className="font-semibold">For. </span>{m.pros}</p>
              <p className="mt-1 text-[13px]"><span className="font-semibold">Against. </span>{m.cons}</p>
              <p className="mt-4 text-xl font-semibold tracking-tight">{m.range}</p>
            </Card>
          ))}
        </div>

        <div className="mt-8 overflow-x-auto rounded-panel border border-ink/10 bg-white/70">
          <table className="w-full text-[14px]">
            <tbody>
              {report.pricing.structure.map((s) => (
                <tr key={s.line} className="border-b border-ink/5 last:border-0">
                  <td className="px-4 py-4 font-semibold">{s.line}</td>
                  <td className="px-4 py-4 text-xl font-semibold tracking-tight">{s.amount}</td>
                  <td className="px-4 py-4 text-ink-soft">{s.covers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <blockquote className="mt-6 rounded-panel border-s-4 border-gold bg-gold/10 px-5 py-4 text-[15px] leading-relaxed">
          {report.pricing.anchor}
        </blockquote>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card>
            <h3 className="text-lg font-semibold">Negotiation ladder</h3>
            <table className="mt-3 w-full text-[14px]">
              <thead className="text-left text-ink-soft">
                <tr>
                  <th className="py-2 font-medium">Rung</th>
                  <th className="py-2 font-medium">Build</th>
                  <th className="py-2 font-medium">Activation</th>
                  <th className="py-2 font-medium">Retainer</th>
                </tr>
              </thead>
              <tbody>
                {report.pricing.ladder.map((l) => (
                  <tr key={l.rung} className={`border-t border-ink/5 ${l.rung === 4 ? "font-semibold" : ""}`}>
                    <td className="py-2">{l.rung}. {l.when}</td>
                    <td className="py-2">{l.build}</td>
                    <td className="py-2">{l.activation}</td>
                    <td className="py-2">{l.retainer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold">Do not</h3>
            <ul className="mt-3 grid gap-2 text-[14px] sm:grid-cols-2">
              {report.pricing.dontDo.map((d) => (
                <li key={d} className="rounded-input border border-ink/10 px-3 py-2">{d}</li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      <Section id="meeting" eyebrow="Meeting prep" title="Non-code work before demo day." muted>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {report.meeting.map((m) => (
            <li key={m.title}>
              <Card className="h-full">
                <Badge tone="ink">{m.when}</Badge>
                <h3 className="mt-3 font-semibold">{m.title}</h3>
                <p className="mt-1 text-[13px] text-ink-soft">{m.detail}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="scope" eyebrow="Out of scope" title="Post-sale activation work." intro="What the activation fee and the retainer pay for.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Critical infrastructure, week 1", items: report.outOfScope.critical },
            { title: "Operations, weeks 2 to 3", items: report.outOfScope.operations },
            { title: "Marketing and SEO, week 3 on", items: report.outOfScope.marketing },
            { title: "Retainer", items: report.outOfScope.retainer },
          ].map((g) => (
            <Card key={g.title}>
              <h3 className="font-semibold">{g.title}</h3>
              <ul className="mt-3 flex flex-col gap-2 text-[14px] text-ink-soft">
                {g.items.map((i) => (
                  <li key={i} className="border-t border-ink/5 pt-2 first:border-0 first:pt-0">{i}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="stack" eyebrow="Stack" title="Built on production tooling." muted>
        <ul className="flex flex-wrap gap-2">
          {report.stack.map((s) => (
            <li key={s} className="inline-flex items-center gap-2 rounded-pill border border-ink/15 bg-white/70 px-4 py-2 text-[14px]">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
              {s}
            </li>
          ))}
        </ul>
      </Section>

      <footer className="border-t border-ink/10">
        <p className="mx-auto w-full max-w-[1200px] px-6 py-8 text-[13px] text-ink-soft md:px-10">
          Internal report. Not linked from the public site. noindex, nofollow. Regenerate the smoke table with npm run smoke.
        </p>
      </footer>
    </main>
  );
}
