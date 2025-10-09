import React, { useState } from "react";
import {
  Check,
  X,
  Sparkles,
  Crown,
  Calendar,
  Info,
  ShieldCheck,
} from "lucide-react";
import Seo from "./Seo";
import { SITE_URL } from "../../config/seo";

/*
  Pricing UI – fixed & interactive
  -------------------------------------------------
  - Cards only show purple ring when hovered OR selected
  - Keyboard accessible (role="radiogroup" / role="radio")
  - Updated copy to reflect: Free = unlimited practice, BUT modules/AI/insights locked.
  - Removed Pro Annual plan
*/

// Visual demo helpers (no external state)
const perks = {
  free: [
    "Unlimited practice questions",
    "Review last 5 mistakes (once/day)",
    "Basic progress (overall + last 7 days)",
    "Modules locked (blurred)",
    "Chat taster: 3 turns/day (30s cooldown)",
  ],
  pro: [
    "Unlock modules (content + quizzes)",
    "Unlimited questions & mocks",
    "Smart rotation (wrongs + SR)",
    "Dashboard Review Mistakes (10/20)",
    "Full insights + Mastered badges",
    "Unlimited AI coaching (no cooldown)",
  ],
};

const Badge: React.FC<{ className?: string; children: React.ReactNode }> = ({
  children,
  className = "",
}) => (
  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${className}`}>
    {children}
  </span>
);

const Feature: React.FC<{ ok?: boolean; children: React.ReactNode }> = ({
  ok = true,
  children,
}) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      className={`flex items-start gap-2 text-sm rounded-md px-1 transition ${hover ? "bg-indigo-50" : ""}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {ok ? (
        <Check
          className={`mt-0.5 h-4 w-4 transition ${hover ? "text-indigo-700" : ""}`}
        />
      ) : (
        <X className="mt-0.5 h-4 w-4 opacity-40" />
      )}
      <span className={ok ? "" : "opacity-60 line-through"}>{children}</span>
    </div>
  );
};

function HoverTeaser({ items = [] as string[] }) {
  if (!items?.length) return null;
  return (
    <div className="absolute top-4 right-4 z-10 hidden group-hover:flex">
      <div className="rounded-lg border bg-white/95 shadow-md backdrop-blur p-3 text-xs w-64">
        <p className="font-semibold mb-1">What’s inside:</p>
        <ul className="space-y-1 list-disc pl-4">
          {items.slice(0, 3).map((t) => (
            <li key={t} className="text-gray-700">
              {t}
            </li>
          ))}
        </ul>
        {items.length > 3 && (
          <p className="mt-2 text-[11px] text-gray-500">…and more</p>
        )}
      </div>
    </div>
  );
}

function GuaranteeTooltip() {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex items-center">
      <span
        className="underline decoration-dotted underline-offset-2 cursor-help"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        Terms & Conditions apply
      </span>
      {open && (
        <div className="absolute left-0 top-6 z-20 w-80 rounded-lg border bg-white shadow-lg p-3 text-xs text-gray-700">
          <p className="font-semibold mb-1">
            Pass First Time – key terms (preview)
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Active Pro subscription at exam date</li>
            <li>Minimum study activity completed (e.g., 7 days usage)</li>
            <li>Proof of first attempt result within 14 days</li>
            <li>Refund applies to subscription fee only</li>
          </ul>
          <p className="mt-2 text-[11px]">
            See full details on the Terms page.
          </p>
        </div>
      )}
    </span>
  );
}

function Card({
  title,
  price,
  cycle,
  children,
  highlight = false,
  badge,
  ctaLabel = "Choose plan",
  teaserItems = [] as string[],
  selected = false,
  onSelect = () => {},
}: {
  title: string;
  price: string;
  cycle: string;
  children: React.ReactNode;
  highlight?: boolean;
  badge?: string;
  ctaLabel?: string;
  teaserItems?: string[];
  selected?: boolean;
  onSelect?: () => void;
}) {
  const [hover, setHover] = useState(false);
  const active = hover || selected;
  return (
    <div
      className={`group relative rounded-2xl p-6 shadow-sm border bg-white transition transform ${
        active ? "-translate-y-0.5 shadow-xl ring-2 ring-indigo-500" : ""
      }`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      tabIndex={0}
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      {badge && (
        <div className="absolute -top-3 right-4">
          <Badge className="bg-indigo-600 text-white shadow">{badge}</Badge>
        </div>
      )}

      <HoverTeaser items={teaserItems} />

      <div className="flex items-center gap-2">
        {highlight ? (
          <Crown className="h-5 w-5" />
        ) : (
          <Sparkles className="h-5 w-5" />
        )}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="mt-4 flex items-end gap-2">
        <span className="text-4xl font-bold">{price}</span>
        <span className="pb-1 text-sm opacity-70">{cycle}</span>
      </div>
      {highlight && (
        <div className="mt-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md p-2">
          <p className="flex items-center gap-1 font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" /> Pass First Time Guarantee
          </p>
          <p className="mt-1 text-[11px] leading-snug text-emerald-800">
            Get a full refund if you don’t pass on your first attempt.{" "}
            <GuaranteeTooltip />.
          </p>
        </div>
      )}
      <div className="mt-4 space-y-2 text-gray-700">{children}</div>
      <button
        className={`mt-6 w-full rounded-xl px-4 py-2 font-semibold transition ${
          highlight
            ? "bg-indigo-600 text-white hover:bg-indigo-700"
            : "bg-gray-900 text-white hover:bg-black"
        }`}
      >
        {ctaLabel}
      </button>
      <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
        <Info className="h-3.5 w-3.5" /> Cancel anytime
      </p>
    </div>
  );
}

export default function PricingPlans() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-indigo-50 via-white to-white px-4 py-10">
      {/* SEO */}
      <Seo
        title="Membership Pricing – Driving Mastery"
        description="Start free; upgrade to unlock modules, insights, and unlimited AI coaching."
        url={`${SITE_URL}/pricing`}
      />
      <div className="mx-auto max-w-6xl">
        <header className="text-center">
          <Badge className="bg-indigo-100 text-indigo-700">
            Stage 1 · Theory Only
          </Badge>
          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
            Choose your plan
          </h1>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Start free, upgrade to unlock modules, full insights and unlimited
            AI coaching.
          </p>
        </header>

        {/* Guarantee banner */}
        <div className="mt-4 mx-auto max-w-2xl rounded-xl border bg-white/60 backdrop-blur p-3 flex items-center justify-center gap-2 text-sm text-emerald-800">
          <ShieldCheck className="h-4 w-4" />
          <span>
            <strong>Guarantee:</strong> Pass first time or get a full refund (
            <GuaranteeTooltip />)
          </span>
        </div>

        {/* Cards */}
        <div
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5"
          role="radiogroup"
          aria-label="Pricing plans"
        >
          {/* Free */}
          <Card
            title="Starter"
            price="£0"
            cycle="/ forever"
            badge="Great for trying"
            ctaLabel="Start free"
            teaserItems={perks.free}
            selected={selected === "free"}
            onSelect={() => setSelected("free")}
          >
            {perks.free.map((p) => (
              <Feature key={p}>{p}</Feature>
            ))}
            <div className="mt-4 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" /> Unlimited practice
              </div>
              <div className="mt-1">
                Modules & AI locked on Free. Upgrade for full access.
              </div>
            </div>
          </Card>

          {/* Pro Monthly */}
          <Card
            title="Pro"
            price="£9.99"
            cycle="/ month"
            highlight
            badge="Most popular"
            ctaLabel="Go Pro"
            teaserItems={perks.pro}
            selected={selected === "pro"}
            onSelect={() => setSelected("pro")}
          >
            {perks.pro.map((p) => (
              <Feature key={p}>{p}</Feature>
            ))}
            <div className="mt-4 rounded-lg bg-indigo-50 p-3 text-xs text-indigo-900">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" /> Everything unlocked
              </div>
              <div className="mt-1">
                Modules, insights, and unlimited AI coaching included.
              </div>
            </div>
          </Card>
        </div>

        {/* Comparison table */}
        <div className="mt-12 rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-semibold">Compare features</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-gray-500">
                  <th className="py-3">Feature</th>
                  <th className="py-3">Starter</th>
                  <th className="py-3">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr className="hover:bg-indigo-50/50 transition">
                  <td className="py-3">Practice questions</td>
                  <td className="py-3">Unlimited</td>
                  <td className="py-3">Unlimited</td>
                </tr>
                <tr className="hover:bg-indigo-50/50 transition">
                  <td className="py-3">Modules (content + quizzes)</td>
                  <td className="py-3">Locked</td>
                  <td className="py-3">Unlocked</td>
                </tr>
                <tr className="hover:bg-indigo-50/50 transition">
                  <td className="py-3">AI coaching (daily turns)</td>
                  <td className="py-3">3 / 30s cooldown</td>
                  <td className="py-3">Unlimited</td>
                </tr>
                <tr className="hover:bg-indigo-50/50 transition">
                  <td className="py-3">Review Mistakes</td>
                  <td className="py-3">Last 5 (once/day)</td>
                  <td className="py-3">10 or 20 (no limit)</td>
                </tr>
                <tr className="hover:bg-indigo-50/50 transition">
                  <td className="py-3">Insights & Mastery</td>
                  <td className="py-3">Basic (overall + 7 days)</td>
                  <td className="py-3">Full analytics</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Trust blurb */}
        <p className="mt-6 text-xs text-center text-gray-500">
          Prices are GBP. You can change or cancel anytime.
          <br />
          <strong>Pass First Time Guarantee:</strong> Full refund if you don’t
          pass on your first attempt — detailed Terms & Conditions apply.
        </p>
      </div>
    </div>
  );
}
