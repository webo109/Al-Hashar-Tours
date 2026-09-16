"use client";

import { useState, type ReactNode } from "react";
import {
  Bell,
  CalendarBlank,
  ChartBar,
  ChatCircleDots,
  Envelope,
  Lightning,
  ListBullets,
  MagnifyingGlass,
  Phone,
  WhatsappLogo,
  X,
  Check,
  Sparkle,
  Storefront,
  InstagramLogo,
  Gear,
  CreditCard,
  AirplaneTilt,
} from "@phosphor-icons/react/dist/ssr";
import { LogoMark } from "@/components/brand/Logo";
import {
  business,
  consultant,
  pulse,
  requests,
  staff,
  today,
  triage,
  week,
  type Channel,
  type RequestRow,
  type Urgency,
} from "@/data/admin-mock";

type Tab = "today" | "week" | "requests" | "business";

const tabs: { key: Tab; label: string; Icon: typeof Lightning }[] = [
  { key: "today", label: "Today", Icon: Lightning },
  { key: "week", label: "Week", Icon: CalendarBlank },
  { key: "requests", label: "Requests", Icon: ListBullets },
  { key: "business", label: "Business", Icon: ChartBar },
];

const urgencyStyle: Record<Urgency, { dot: string; ring: string; label: string }> = {
  critical: { dot: "bg-[#b0361f]", ring: "border-[#b0361f]/35", label: "Critical" },
  watch: { dot: "bg-gold-700", ring: "border-gold/50", label: "Watch" },
  ok: { dot: "bg-[#2f7a5f]", ring: "border-[#2f7a5f]/30", label: "On track" },
};

const channelIcon: Record<Channel, typeof Phone> = {
  WhatsApp: WhatsappLogo,
  Email: Envelope,
  Phone: Phone,
  Branch: Storefront,
  Instagram: InstagramLogo,
  System: Gear,
  GDS: AirplaneTilt,
  Payment: CreditCard,
};

const byRef = (ref: string) => requests.find((r) => r.ref === ref) ?? null;

export function AdminPreview() {
  const [tab, setTab] = useState<Tab>("today");
  const [open, setOpen] = useState<RequestRow | null>(null);
  const [done, setDone] = useState<Record<string, string>>({});
  const [assigned, setAssigned] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [needsAttention, setNeedsAttention] = useState(false);

  function act(key: string, message: string) {
    setDone((d) => ({ ...d, [key]: message }));
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  }

  function assign(ref: string, name: string) {
    setAssigned((a) => ({ ...a, [ref]: name }));
    act(`assign-${ref}`, `${name} assigned to ${ref}`);
  }

  const filtered = requests.filter((r) => {
    if (needsAttention && r.urgency === "ok") return false;
    const q = query.trim().toLowerCase();
    return !q || [r.ref, r.customer, r.product, r.branch, r.status].join(" ").toLowerCase().includes(q);
  });

  return (
    <div className="min-h-[100dvh] bg-cream text-ink lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="flex items-center justify-between gap-3 bg-midnight px-4 py-3 text-cream lg:sticky lg:top-0 lg:h-[100dvh] lg:flex-col lg:items-stretch lg:justify-start lg:px-5 lg:py-6">
        <div className="flex items-center gap-3">
          <LogoMark className="h-9 w-9" />
          <div className="leading-tight">
            <div className="font-latin text-[13px] font-semibold uppercase tracking-[0.18em]">Al-Hashar</div>
            <div className="text-[11px] text-cream/55">Admin</div>
          </div>
        </div>
        <nav className="flex gap-1 lg:mt-8 lg:flex-col" aria-label="Dashboard">
          {tabs.map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              aria-current={tab === key ? "page" : undefined}
              className={`flex items-center gap-2.5 rounded-pill px-3.5 py-2.5 text-[14px] transition-colors ${
                tab === key ? "bg-gold text-ink" : "text-cream/75 hover:bg-cream/10 hover:text-cream"
              }`}
            >
              <Icon size={18} weight="fill" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </nav>
        <div className="hidden lg:mt-auto lg:block">
          <div className="rounded-panel border border-cream/10 p-4 text-[13px] text-cream/70">
            Sample data. Real intelligence, WhatsApp Business API and payments ship after activation.
          </div>
          <div className="mt-4 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-pill bg-gold font-latin text-[12px] font-semibold text-ink">{consultant.initials}</span>
            <div className="leading-tight">
              <div className="text-[14px]">{consultant.name}</div>
              <div className="text-[12px] text-cream/55">{consultant.role}</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 bg-cream/90 px-5 py-4 backdrop-blur-[6px] lg:sticky lg:top-0 lg:z-10 lg:px-8">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">{today.label}</h1>
            <p className="text-[13px] text-ink-soft">{today.time}, Ruwi branch view</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="relative flex h-10 w-10 items-center justify-center rounded-pill border border-ink/10 bg-white/70" aria-label="3 notifications">
              <Bell size={18} weight="fill" />
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-pill bg-[#b0361f] px-1 font-latin text-[10px] text-cream">3</span>
            </button>
            <span className="rounded-pill border border-ink/10 bg-white/70 px-3 py-2 text-[13px]">All branches</span>
          </div>
        </header>

        <PulseStrip />

        <div className="px-5 pb-24 pt-6 lg:px-8">
          {tab === "today" ? (
            <TodayView act={act} done={done} assigned={assigned} onAssign={assign} onOpen={(ref) => setOpen(byRef(ref))} />
          ) : null}
          {tab === "week" ? <WeekView onOpen={(ref) => setOpen(byRef(ref))} /> : null}
          {tab === "requests" ? (
            <RequestsView
              rows={filtered}
              query={query}
              onQuery={setQuery}
              needsAttention={needsAttention}
              onNeedsAttention={setNeedsAttention}
              onOpen={setOpen}
            />
          ) : null}
          {tab === "business" ? <BusinessView /> : null}
        </div>
      </div>

      {open ? (
        <Drawer request={open} assigned={assigned[open.ref]} onAssign={(name) => assign(open.ref, name)} onClose={() => setOpen(null)} act={act} done={done} />
      ) : null}

      {toast ? (
        <div role="status" className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-pill bg-midnight px-4 py-2.5 text-[14px] text-cream shadow-lift">
          <Check size={14} weight="bold" className="mr-2 inline text-gold-300" />
          {toast}
        </div>
      ) : null}
    </div>
  );
}

function PulseStrip() {
  const pct = Math.round((pulse.month.amount / pulse.month.goal) * 100);
  return (
    <div className="grid gap-4 border-b border-ink/10 bg-white/50 px-5 py-4 text-[13px] md:grid-cols-4 lg:px-8">
      <div>
        <div className="text-ink-soft">Today</div>
        <div className="mt-0.5 font-latin text-[15px] font-semibold">{pulse.today.confirmed} <span className="font-normal text-ink-soft">confirmed</span></div>
        <div className="text-ink-soft">{pulse.today.pending} pending, {pulse.today.atRisk} at risk</div>
      </div>
      <div>
        <div className="text-ink-soft">Week</div>
        <div className="mt-0.5 font-latin text-[15px] font-semibold">{pulse.week.amount}</div>
        <div className="text-[#1f5c46]">{pulse.week.delta}</div>
      </div>
      <div>
        <div className="text-ink-soft">September</div>
        <div className="mt-0.5 font-latin text-[15px] font-semibold">
          OMR {pulse.month.amount.toLocaleString("en-OM")} <span className="font-normal text-ink-soft">of {pulse.month.goal.toLocaleString("en-OM")}</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-pill bg-ink/10" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Month to goal">
          <div className="h-full rounded-pill bg-gold" style={{ width: `${pct}%` }} />
        </div>
        <div className="text-ink-soft">{pct}%, {pulse.month.daysLeft} days left</div>
      </div>
      <div>
        <div className="text-ink-soft">Pulse</div>
        <div className="mt-0.5 text-[#1f5c46]">{pulse.up}</div>
        <div className="text-[#8f2a17]">{pulse.down}</div>
      </div>
    </div>
  );
}

function Panel({ title, count, children, className = "" }: { title: string; count?: number; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-panel border border-ink/10 bg-white/70 ${className}`}>
      <header className="flex items-center justify-between border-b border-ink/10 px-5 py-3.5">
        <h2 className="text-[15px] font-semibold">{title}</h2>
        {count !== undefined ? <span className="font-latin text-[12px] text-ink-soft">{count}</span> : null}
      </header>
      <div className="p-3">{children}</div>
    </section>
  );
}

function ActionRow({
  urgency,
  title,
  detail,
  cta,
  doneMessage,
  onAct,
  onOpen,
}: {
  urgency: Urgency;
  title: string;
  detail: string;
  cta: string;
  doneMessage?: string;
  onAct: () => void;
  onOpen: () => void;
}) {
  const u = urgencyStyle[urgency];
  return (
    <div className={`flex flex-wrap items-center gap-3 rounded-input border ${u.ring} bg-white px-4 py-3`}>
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${u.dot}`} aria-label={u.label} />
      <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left">
        <div className="text-[14px] font-medium">{title}</div>
        <div className="text-[13px] text-ink-soft">{detail}</div>
      </button>
      {doneMessage ? (
        <span className="inline-flex items-center gap-1 text-[13px] text-[#1f5c46]">
          <Check size={14} weight="bold" /> {doneMessage}
        </span>
      ) : (
        <button type="button" onClick={onAct} className="rounded-pill bg-ink px-3.5 py-2 text-[13px] font-medium text-cream hover:bg-midnight-700">
          {cta}
        </button>
      )}
    </div>
  );
}

function TodayView({
  act,
  done,
  assigned,
  onAssign,
  onOpen,
}: {
  act: (key: string, message: string) => void;
  done: Record<string, string>;
  assigned: Record<string, string>;
  onAssign: (ref: string, name: string) => void;
  onOpen: (ref: string) => void;
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <div className="flex flex-col gap-5">
        <Panel title="Right now" count={triage.rightNow.length}>
          <div className="flex flex-col gap-2">
            {triage.rightNow.map((item) => {
              const key = `now-${item.ref}`;
              const isAssign = item.cta.startsWith("Assign");
              return (
                <ActionRow
                  key={key}
                  urgency={item.urgency}
                  title={item.title}
                  detail={isAssign && assigned[item.ref] ? `${assigned[item.ref]} assigned.` : item.detail}
                  cta={item.cta}
                  doneMessage={done[key] ?? (isAssign && assigned[item.ref] ? "Assigned" : undefined)}
                  onAct={() => (isAssign ? onAssign(item.ref, "Khalid") : act(key, `${item.cta}: ${item.title}`))}
                  onOpen={() => onOpen(item.ref)}
                />
              );
            })}
          </div>
        </Panel>

        <Panel title="Today's jobs" count={triage.todayJobs.length}>
          <ol className="flex flex-col gap-2">
            {triage.todayJobs.map((job) => (
              <li key={`${job.ref}-${job.time}`}>
                <button type="button" onClick={() => onOpen(job.ref)} className="flex w-full items-center gap-4 rounded-input px-3 py-2.5 text-left hover:bg-ink/4">
                  <span className="font-latin w-12 text-[13px] text-ink-soft">{job.time}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-medium">{job.title}</span>
                    <span className="block text-[13px] text-ink-soft">{job.detail}</span>
                  </span>
                  {job.done ? (
                    <Check size={16} weight="bold" className="text-[#2f7a5f]" aria-label="Underway" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-gold-700" aria-label="Pending" />
                  )}
                </button>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title="Pending action" count={triage.pending.length}>
          <div className="flex flex-col gap-2">
            {triage.pending.map((item) => {
              const key = `pending-${item.ref}-${item.cta}`;
              return (
                <ActionRow
                  key={key}
                  urgency="watch"
                  title={item.title}
                  detail={item.detail}
                  cta={item.cta}
                  doneMessage={done[key]}
                  onAct={() => act(key, `${item.cta}: ${item.title}`)}
                  onOpen={() => onOpen(item.ref)}
                />
              );
            })}
          </div>
        </Panel>
      </div>

      <div className="flex flex-col gap-5">
        <Panel title="Inbox" count={triage.inbox.length}>
          <ul className="flex flex-col gap-2">
            {triage.inbox.map((m) => {
              const Icon = channelIcon[m.channel];
              const key = `inbox-${m.ref}`;
              return (
                <li key={key} className="rounded-input border border-ink/10 bg-white p-4">
                  <div className="flex items-center gap-2 text-[13px] text-ink-soft">
                    <Icon size={16} weight="fill" />
                    <span className="font-medium text-ink">{m.from}</span>
                    <span className="font-latin rounded-pill border border-ink/15 px-1.5 text-[11px]">{m.lang}</span>
                    <span className="ml-auto">{m.ago}</span>
                  </div>
                  <p className="mt-2 text-[14px]" dir="auto">{m.text}</p>
                  <div className="mt-3 rounded-input bg-gold/10 px-3 py-2.5">
                    <div className="flex items-center gap-1.5 text-[12px] text-gold-700">
                      <Sparkle size={14} weight="fill" /> Draft in {m.lang}
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed" dir="auto">{m.draft}</p>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    {done[key] ? (
                      <span className="inline-flex items-center gap-1 text-[13px] text-[#1f5c46]"><Check size={14} weight="bold" /> Sent</span>
                    ) : (
                      <button type="button" onClick={() => act(key, `Reply sent to ${m.from}`)} className="rounded-pill bg-ink px-3.5 py-2 text-[13px] font-medium text-cream">
                        Send draft
                      </button>
                    )}
                    <button type="button" onClick={() => onOpen(m.ref)} className="text-[13px] text-ink-soft underline-offset-4 hover:underline">
                      Open request
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel title="Available now">
          <ul className="flex flex-col gap-1.5">
            {staff.map((s) => (
              <li key={s.name} className="flex items-center gap-3 rounded-input px-3 py-2">
                <span className={`h-2 w-2 rounded-full ${s.free ? "bg-[#2f7a5f]" : "bg-ink/25"}`} aria-label={s.free ? "Free" : "Busy"} />
                <span className="text-[14px] font-medium">{s.name}</span>
                <span className="text-[13px] text-ink-soft">{s.role}</span>
                <span className="ml-auto flex gap-1">
                  {s.tags.map((t) => (
                    <span key={t} className="font-latin rounded-pill border border-ink/10 px-1.5 text-[10px] text-ink-soft">{t}</span>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

function WeekView({ onOpen }: { onOpen: (ref: string) => void }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_260px]">
      <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-7">
        {week.map((d) => (
          <section key={d.date} className={`rounded-panel border bg-white/70 p-3 ${d.today ? "border-gold shadow-[inset_0_0_0_1px_var(--color-gold)]" : "border-ink/10"}`}>
            <header className="flex items-baseline justify-between">
              <span className="text-[14px] font-semibold">{d.day}</span>
              <span className="font-latin text-[12px] text-ink-soft">{d.date}</span>
            </header>
            <ul className="mt-3 flex flex-col gap-2">
              {d.items.map((it) => {
                const u = urgencyStyle[it.urgency];
                const inner = (
                  <>
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${u.dot}`} aria-label={u.label} />
                    <span className="min-w-0">
                      <span className="block text-[13px] font-medium leading-tight">{it.title}</span>
                      <span className="block text-[12px] text-ink-soft">{it.detail}</span>
                    </span>
                  </>
                );
                return (
                  <li key={it.title}>
                    {it.ref ? (
                      <button type="button" onClick={() => onOpen(it.ref!)} className={`flex w-full gap-2 rounded-input border ${u.ring} bg-white px-2.5 py-2 text-left hover:bg-ink/4`}>
                        {inner}
                      </button>
                    ) : (
                      <div className={`flex gap-2 rounded-input border ${u.ring} bg-white px-2.5 py-2`}>{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
            {d.hint ? <p className="mt-3 text-[12px] text-gold-700">{d.hint}</p> : null}
          </section>
        ))}
      </div>
      <Panel title="Vehicles and guides">
        <ul className="flex flex-col gap-1.5 text-[13px]">
          {["Land Cruiser 1, Salim, Thu", "Prado 1, Yousuf, Thu", "Land Cruiser 2, free Fri and Sat", "Coaster, Umrah transfer 12 Sep"].map((v) => (
            <li key={v} className="rounded-input border border-ink/10 px-3 py-2">{v}</li>
          ))}
        </ul>
        <p className="mt-3 px-1 text-[12px] text-ink-soft">Drag-and-drop assignment ships after activation.</p>
      </Panel>
    </div>
  );
}

function RequestsView({
  rows,
  query,
  onQuery,
  needsAttention,
  onNeedsAttention,
  onOpen,
}: {
  rows: RequestRow[];
  query: string;
  onQuery: (q: string) => void;
  needsAttention: boolean;
  onNeedsAttention: (v: boolean) => void;
  onOpen: (r: RequestRow) => void;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative flex-1 basis-64">
          <span className="sr-only">Search requests</span>
          <MagnifyingGlass size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Reference, name, product, branch"
            className="h-11 w-full rounded-pill border border-ink/15 bg-white pl-10 pr-4 text-[14px] focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/35"
          />
        </label>
        <button
          type="button"
          onClick={() => onNeedsAttention(!needsAttention)}
          aria-pressed={needsAttention}
          className={`rounded-pill border px-4 py-2.5 text-[13px] ${needsAttention ? "border-gold bg-gold text-ink" : "border-ink/15 bg-white"}`}
        >
          Needs my attention
        </button>
        <span className="font-latin text-[13px] text-ink-soft">{rows.length} of {requests.length}</span>
      </div>

      <div className="mt-4 overflow-x-auto rounded-panel border border-ink/10 bg-white/70">
        <table className="w-full text-[13px]">
          <thead className="text-left text-ink-soft">
            <tr className="border-b border-ink/10">
              <th className="px-4 py-3 font-medium">Reference</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Channel</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const u = urgencyStyle[r.urgency];
              const Icon = channelIcon[r.channel];
              return (
                <tr key={r.ref} onClick={() => onOpen(r)} className="cursor-pointer border-b border-ink/5 last:border-0 hover:bg-ink/4">
                  <td className="px-4 py-3 font-latin font-medium">{r.ref}</td>
                  <td className="px-4 py-3">
                    {r.customer}
                    {r.repeat ? <span className="ml-2 rounded-pill bg-gold/15 px-2 py-0.5 text-[11px] text-gold-700">Repeat</span> : null}
                    <span className="block text-[12px] text-ink-soft">{r.country}</span>
                  </td>
                  <td className="px-4 py-3">{r.product}</td>
                  <td className="px-4 py-3 text-ink-soft">{r.date}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${u.dot}`} aria-label={u.label} />
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-latin">{r.amount}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-ink-soft">
                      <Icon size={14} weight="fill" /> {r.channel}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[12px] text-ink-soft">Export and bulk actions live here, not on the home screen.</p>
    </div>
  );
}

function BusinessView() {
  const maxShare = Math.max(...business.channels.map((c) => c.share));
  const maxRevenue = Math.max(...business.revenueByProduct.map((p) => p.omr));
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel title="Requests by channel, last 30 days">
        <ul className="flex flex-col gap-2.5 px-2 py-1">
          {business.channels.map((c) => (
            <li key={c.name} className="group grid grid-cols-[88px_minmax(0,1fr)_44px] items-center gap-3 text-[13px]">
              <span>{c.name}</span>
              <span className="h-2.5 overflow-hidden rounded-pill bg-ink/6" aria-hidden>
                <span className="block h-full rounded-pill bg-gold transition-opacity group-hover:opacity-80" style={{ width: `${(c.share / maxShare) * 100}%` }} title={`${c.name}: ${c.share}%`} />
              </span>
              <span className="font-latin text-right text-ink-soft">{c.share}%</span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Revenue by product, last 30 days">
        <ul className="flex flex-col gap-2.5 px-2 py-1">
          {business.revenueByProduct.map((p) => (
            <li key={p.name} className="group grid grid-cols-[130px_minmax(0,1fr)_72px] items-center gap-3 text-[13px]">
              <span className="truncate">{p.name}</span>
              <span className="h-2.5 overflow-hidden rounded-pill bg-ink/6" aria-hidden>
                <span className="block h-full rounded-pill bg-gold transition-opacity group-hover:opacity-80" style={{ width: `${(p.omr / maxRevenue) * 100}%` }} title={`${p.name}: OMR ${p.omr.toLocaleString("en-OM")}`} />
              </span>
              <span className="font-latin text-right text-ink-soft">OMR {p.omr.toLocaleString("en-OM")}</span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="First response">
        <div className="grid grid-cols-3 gap-3 px-2 py-1 text-[13px]">
          <div>
            <div className="text-ink-soft">Median</div>
            <div className="font-latin text-2xl font-semibold">{business.responseTime.median}</div>
          </div>
          <div>
            <div className="text-ink-soft">Target</div>
            <div className="font-latin text-2xl font-semibold">{business.responseTime.target}</div>
          </div>
          <div>
            <div className="text-ink-soft">Within 2 hours</div>
            <div className="font-latin text-2xl font-semibold">{business.responseTime.within2h}</div>
          </div>
        </div>
      </Panel>

      <Panel title="Patterns">
        <ul className="flex flex-col gap-2 px-2 py-1 text-[14px] leading-relaxed">
          {business.insights.map((i) => (
            <li key={i} className="flex gap-2">
              <Sparkle size={16} weight="fill" className="mt-1 shrink-0 text-gold-700" />
              {i}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Margin by product, sample" className="lg:col-span-2">
        <table className="w-full text-[13px]">
          <thead className="text-left text-ink-soft">
            <tr>
              <th className="px-3 py-2 font-medium">Product</th>
              <th className="px-3 py-2 font-medium">Revenue</th>
              <th className="px-3 py-2 font-medium">Cost</th>
              <th className="px-3 py-2 font-medium">Margin</th>
            </tr>
          </thead>
          <tbody>
            {business.margin
              .map((m) => ({ ...m, pct: Math.round(((m.revenue - m.cost) / m.revenue) * 100) }))
              .sort((a, b) => b.pct - a.pct)
              .map((m) => (
                <tr key={m.product} className="border-t border-ink/5">
                  <td className="px-3 py-2">{m.product}</td>
                  <td className="px-3 py-2 font-latin">OMR {m.revenue.toLocaleString("en-OM")}</td>
                  <td className="px-3 py-2 font-latin text-ink-soft">OMR {m.cost.toLocaleString("en-OM")}</td>
                  <td className="px-3 py-2 font-latin font-medium">{m.pct}%</td>
                </tr>
              ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

function Drawer({
  request,
  assigned,
  onAssign,
  onClose,
  act,
  done,
}: {
  request: RequestRow;
  assigned?: string;
  onAssign: (name: string) => void;
  onClose: () => void;
  act: (key: string, message: string) => void;
  done: Record<string, string>;
}) {
  const [note, setNote] = useState("");
  const u = urgencyStyle[request.urgency];
  const guide = assigned ?? request.operations.guide ?? null;
  const replyKey = `reply-${request.ref}`;

  return (
    <div className="fixed inset-0 z-40 flex justify-end" role="dialog" aria-modal="true" aria-label={`Request ${request.ref}`}>
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-midnight/40" />
      <aside className="relative flex h-full w-full max-w-[520px] flex-col overflow-y-auto bg-cream shadow-panel">
        <header className="sticky top-0 flex items-start justify-between gap-3 border-b border-ink/10 bg-cream px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${u.dot}`} aria-label={u.label} />
              <span className="font-latin text-[12px] text-ink-soft">{request.ref}</span>
              {request.repeat ? <span className="rounded-pill bg-gold/15 px-2 py-0.5 text-[11px] text-gold-700">Repeat guest</span> : null}
            </div>
            <h2 className="mt-1 text-xl font-semibold tracking-tight">{request.customer}</h2>
            <p className="text-[13px] text-ink-soft">{request.country}, via {request.channel}, {request.branch} branch</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-pill hover:bg-ink/5" aria-label="Close">
            <X size={18} />
          </button>
        </header>

        <div className="flex flex-col gap-5 px-5 py-5">
          <div className="flex gap-2">
            <a href={`tel:${request.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 rounded-pill border border-ink/15 bg-white px-3 py-2 text-[13px]"><Phone size={15} /> Call</a>
            <a href={`https://api.whatsapp.com/send?phone=${request.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-pill border border-ink/15 bg-white px-3 py-2 text-[13px]"><WhatsappLogo size={15} /> WhatsApp</a>
            <a href={`mailto:${request.email}`} className="inline-flex items-center gap-1.5 rounded-pill border border-ink/15 bg-white px-3 py-2 text-[13px]"><Envelope size={15} /> Email</a>
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-panel border border-ink/10 bg-white p-4 text-[13px]">
            <dt className="text-ink-soft">Product</dt><dd>{request.product}</dd>
            <dt className="text-ink-soft">Date</dt><dd>{request.date}</dd>
            <dt className="text-ink-soft">Travellers</dt><dd>{request.travellers}</dd>
            <dt className="text-ink-soft">Amount</dt><dd className="font-latin">{request.amount}</dd>
            <dt className="text-ink-soft">Status</dt><dd>{request.status}</dd>
          </dl>

          <section className="rounded-panel border border-ink/10 bg-white p-4">
            <h3 className="text-[13px] font-semibold text-ink-soft">Operations</h3>
            <ul className="mt-2 flex flex-col gap-2 text-[13px]">
              {request.operations.hotel ? <li>Hotel: {request.operations.hotel}</li> : null}
              {request.operations.vehicle ? <li>Vehicle: {request.operations.vehicle}</li> : null}
              {"guide" in request.operations ? (
                <li className="flex flex-wrap items-center gap-2">
                  Driver guide: {guide ?? <span className="text-[#8f2a17]">unassigned</span>}
                  {!guide && request.operations.suggestion ? (
                    <button type="button" onClick={() => onAssign(request.operations.suggestion!.split(" ")[0])} className="inline-flex items-center gap-1.5 rounded-pill bg-gold/15 px-3 py-1 text-[12px] text-gold-700 hover:bg-gold/25">
                      <Sparkle size={12} weight="fill" /> Suggested: {request.operations.suggestion}
                    </button>
                  ) : null}
                </li>
              ) : null}
              {Object.keys(request.operations).length === 0 ? <li className="text-ink-soft">Nothing to assign.</li> : null}
            </ul>
          </section>

          {request.notes ? (
            <section className="rounded-panel border border-gold/40 bg-gold/10 p-4 text-[13px] leading-relaxed">
              <h3 className="font-semibold text-gold-700">Notes</h3>
              <p className="mt-1">{request.notes}</p>
            </section>
          ) : null}

          <section>
            <h3 className="text-[13px] font-semibold text-ink-soft">Customer story</h3>
            <ol className="mt-3 flex flex-col gap-3 border-l border-ink/10 pl-4">
              {request.timeline.map((e, i) => {
                const Icon = channelIcon[e.channel];
                return (
                  <li key={i} className="relative">
                    <span className="absolute -left-[21px] top-1 flex h-3 w-3 items-center justify-center rounded-full bg-gold ring-4 ring-cream" aria-hidden />
                    <div className="flex items-center gap-2 text-[12px] text-ink-soft">
                      <span className="font-latin">{e.at}</span>
                      <Icon size={13} weight="fill" />
                      <span>{e.channel}</span>
                    </div>
                    <p className="mt-0.5 text-[14px] leading-relaxed" dir="auto">{e.text}</p>
                  </li>
                );
              })}
            </ol>
          </section>

          <section className="rounded-panel border border-ink/10 bg-white p-4">
            <div className="flex items-center gap-1.5 text-[12px] text-gold-700">
              <ChatCircleDots size={14} weight="fill" /> Replies are translated into the language of the customer after activation
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Write a reply or an internal note"
              className="mt-2 w-full rounded-input border border-ink/15 bg-cream px-3 py-2 text-[14px] focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/35"
            />
            <div className="mt-2 flex items-center gap-2">
              {done[replyKey] ? (
                <span className="inline-flex items-center gap-1 text-[13px] text-[#1f5c46]"><Check size={14} weight="bold" /> Sent</span>
              ) : (
                <button type="button" onClick={() => { act(replyKey, `Reply sent to ${request.customer}`); setNote(""); }} className="rounded-pill bg-ink px-3.5 py-2 text-[13px] font-medium text-cream">
                  Send on {request.channel === "Email" ? "email" : "WhatsApp"}
                </button>
              )}
              <span className="text-[12px] text-ink-soft">Soft delete lives here, never on the home screen.</span>
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}
