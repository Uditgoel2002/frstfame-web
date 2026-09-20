/** @jsxRuntime classic */
/** @jsx React.createElement */
/** @jsxFrag React.Fragment */

import React, { useState, useMemo, useEffect, useCallback } from 'react';

// Guarantee element compatibility across React runtimes
if (typeof Symbol !== 'undefined' && Symbol.for) {
  const origSymbolFor = Symbol.for.bind(Symbol);
  Symbol.for = function (key) {
    if (key === 'react.transitional.element') {
      return origSymbolFor('react.element');
    }
    return origSymbolFor(key);
  };
}

const AGENCY_DATA = {
  name: "frstfame",
  code: "FRST-OPS-2026",
  status: "2 CAPACITY SLOTS OPEN FOR THIS QUARTER",
  dispatchEmail: "operators@frstfame.com",
  directLine: "+1 (888) 412-FAME",
  tagline: "Digital Infrastructure & Revenue Engineering for SMEs Who Hate Agency Fluff.",
  subhead: "Direct operator growth engineering for trade contractors, manufacturing, B2B services, and specialized clinics. No junior account reps. No vanity PDF reports. 100% SME asset ownership."
};

const CAPABILITIES = [
  {
    id: "ppc",
    code: "SPEC-01",
    name: "Performance PPC & Search Arbitrage",
    category: "Paid Acquisition",
    goal: "Capture ready-to-buy commercial search queries on Google and Meta while eliminating broad-match ad spend leakage.",
    turnaround: "7 Business Days to First Live Click",
    stack: ["Google Ads Engine", "Meta CAPI (Server-Side)", "LinkedIn Campaign Manager", "Looker Studio"],
    deliverables: [
      "Negative keyword harvesting lists built from 240+ commercial search queries",
      "Dynamic creative variations (high-contrast statics + pain-point video hooks)",
      "Server-side Meta Conversions API (CAPI) redundancy bypass for ad-blockers",
      "Direct conversion capture routing to WhatsApp, SMS, and sales inbox"
    ],
    benchmark: "3.4x – 4.9x Target Blended ROAS"
  },
  {
    id: "seo",
    code: "SPEC-02",
    name: "High-Intent Local & National SEO",
    category: "Organic Visibility",
    goal: "Lock down Google Map 3-Pack rankings and buyer-intent commercial searches that generate inbound phone inquiries.",
    turnaround: "Initial momentum in 30 Days; Map Pack dominance in 75-90 Days",
    stack: ["Google Business Profile", "Ahrefs Commercial Suite", "Geo-Coordinates Schema", "BrightLocal"],
    deliverables: [
      "GBP 3-Pack rank capture with localized geo-tagged photo citation assets",
      "NAP consistency scrubbing across 65+ tier-1 business directories",
      "Commercial service landing page siloing (zero informational fluff)",
      "Sub-second Core Web Vitals optimization and local structured schema"
    ],
    benchmark: "+160% High-Intent Inbound Call Lift"
  },
  {
    id: "ai-auto",
    code: "SPEC-03",
    name: "24/7 AI Lead Qualification & CRM Automation",
    category: "Autonomous Systems",
    goal: "Engage, qualify, and book inbound prospects on WhatsApp/SMS within 45 seconds before they contact competitors.",
    turnaround: "Turnkey operational deployment in 10 Days",
    stack: ["Custom LLM Orchestrator", "Twilio / Meta WhatsApp Cloud API", "Make.com Webhooks", "HubSpot / GoHighLevel"],
    deliverables: [
      "Bespoke conversational triage agent tuned specifically on your business services",
      "Under-60-second inbound inquiry response SLA 24/7/365",
      "Automated calendar booking link dispatch with SMS confirmation reminders",
      "Bi-directional sync into HubSpot, GoHighLevel, Pipedrive, or Google Sheets"
    ],
    benchmark: "< 45-Second Response Time (24/7)"
  },
  {
    id: "web-dev",
    code: "SPEC-04",
    name: "High-Conversion Web Architecture",
    category: "Web & CRO",
    goal: "Bespoke, lightning-fast static web assets built with zero bloated plugins to convert visitors into booked pipeline.",
    turnaround: "14 Days kickoff to live production deployment",
    stack: ["Next.js", "Tailwind CSS", "Vercel Edge CDN", "Cloudflare DNS"],
    deliverables: [
      "Zero-bloat responsive web codebase scoring 98+ on Google PageSpeed Mobile",
      "Integrated multi-step lead qualification forms and dynamic calculators",
      "Friction-free calendar booking and payment processing integration",
      "A/B split-testing framework on hero headlines and primary conversion hooks"
    ],
    benchmark: "3.8% – 7.2% Visit-to-Qualified Lead Rate"
  },
  {
    id: "analytics",
    code: "SPEC-05",
    name: "Data Attribution & Live Revenue Dashboards",
    category: "Data Infrastructure",
    goal: "Bridge the gap between ad spend and banked revenue so you know exactly which campaigns generated actual sales.",
    turnaround: "Connected and verified in 5 Days",
    stack: ["GA4 Server-Side Tagging", "Looker Studio", "CallRail Attribution", "Stripe / QuickBooks"],
    deliverables: [
      "Custom unified financial dashboard tracking Cost Per Customer (not just CPL)",
      "Dynamic call tracking with exact source, keyword, and audio recording capture",
      "Server-side event tagging immune to browser cookie restrictions",
      "Direct reconciliation between marketing spend and closed invoice ledger"
    ],
    benchmark: "100% Attribution Transparency"
  },
  {
    id: "content",
    code: "SPEC-06",
    name: "Content Strategy & Founder Authority",
    category: "Social & Authority",
    goal: "Turn your real-world trade or technical expertise into high-trust positioning assets that shorten sales cycles.",
    turnaround: "First editorial asset sprint delivered in 6 Days",
    stack: ["Figma Editorial Kits", "Loom Asset Capture", "LinkedIn Creator Engine", "Descript"],
    deliverables: [
      "Ghostwritten weekly executive LinkedIn positioning memos for the founder",
      "Customer case study tear-sheets highlighting real ROI metrics and proof",
      "Short-form technical explainer video scripts that establish deep domain trust",
      "Sales enablement one-pagers for your sales team to overcome prospect objections"
    ],
    benchmark: "4.5x Sales Conversation Receptivity"
  },
  {
    id: "social-mgmt",
    code: "SPEC-07",
    name: "Multi-Channel Social Management",
    category: "Organic Distribution",
    goal: "Maintain active, high-credibility distribution across relevant channels without pulling the founder away from operations.",
    turnaround: "Live publishing schedule within 7 Days",
    stack: ["Buffer / Publer", "Figma Design System", "Meta Business Suite", "YouTube Shorts"],
    deliverables: [
      "3 curated commercial posts per week across Meta, LinkedIn, and YouTube",
      "Proactive response handling on all inbound direct messages within 90 minutes",
      "Competitor positioning monitoring and quarterly trend gap teardown",
      "Monthly cross-channel attribution reporting linked to site visits"
    ],
    benchmark: "+280% High-Trust Brand Footprint"
  }
];

const FLUFF_VS_STANDARD = [
  {
    category: "Team Assignment",
    fluff: "Senior pitch team disappears after contract signing; account assigned to a 22-year-old junior intern juggling 14 accounts.",
    frstfame: "Direct access to senior growth operators and engineers on dedicated Slack/WhatsApp with sub-2 hour SLA."
  },
  {
    category: "Asset & IP Ownership",
    fluff: "Agency sets up campaigns inside their proprietary agency ad accounts, holding your data hostage if you cancel.",
    frstfame: "100% client-owned. Everything is built directly inside your Google, Meta, and Cloudflare accounts from day one."
  },
  {
    category: "Reporting & Truth",
    fluff: "45-page automated PDF monthly reports filled with vanity graphs like 'impressions', 'reach', and 'clicks'.",
    frstfame: "Weekly 1-page cash ledger showing qualified pipeline, cost-per-closed-deal, and net revenue generated."
  },
  {
    category: "Lead Follow-up Velocity",
    fluff: "Leads sit in an unmonitored spreadsheet for 48 hours until someone remembers to forward them manually.",
    frstfame: "Automated 24/7 AI lead qualification bot engages inbound prospects on WhatsApp/SMS in under 45 seconds."
  },
  {
    category: "Contract Structure",
    fluff: "Mandatory 6-to-12 month lock-in retainers with painful 60-day cancellation notices regardless of performance.",
    frstfame: "Initial 90-day execution sprint to build the machine, transitioning to 30-day rolling performance sprints."
  }
];

const PRICING_PLANS = [
  {
    id: "sprint",
    name: "Funnel Repair & Launch Sprint",
    stamp: "[ 30-DAY ONE-OFF SPRINT ]",
    price: "$2,450",
    cadence: "Single Investment / Zero Retainer",
    desc: "Designed for SMEs with an existing website or ad account that is leaking money and converting poorly.",
    features: [
      "Full PPC keyword audit & negative harvest scrub",
      "Next.js high-converting landing page replacement",
      "Google Business Profile 3-Pack overhaul & schema",
      "Under-60s AI WhatsApp lead responder integration",
      "GA4 server-side attribution tracking setup",
      "30 days of post-launch stabilization & tuning"
    ],
    popular: false,
    cta: "Book Funnel Repair Sprint"
  },
  {
    id: "acquisition",
    name: "Acquisition & Performance Engine",
    stamp: "[ CORE OPERATOR MODEL ]",
    price: "$1,850",
    cadence: "per month / Rolling 30-Day Terms",
    desc: "Our primary flagship engagement. Full-stack management of paid traffic, organic visibility, and conversion pipelines.",
    features: [
      "Complete Google Ads & Meta Paid Social management",
      "Weekly bid optimization & negative keyword harvesting",
      "Local 3-Pack SEO maintenance & citation distribution",
      "24/7 AI Lead Qualifier bot hosting & prompt tuning",
      "Weekly 1-page financial cash ledger attribution memo",
      "Continuous A/B headline & landing page split-testing",
      "Direct WhatsApp / Slack operator channel (<2h SLA)"
    ],
    popular: true,
    cta: "Deploy Acquisition Engine"
  },
  {
    id: "enterprise",
    name: "Scale & Custom AI Infrastructure",
    stamp: "[ BESPOKE SME ECOSYSTEM ]",
    price: "$3,400",
    cadence: "per month / Rolling 30-Day Terms",
    desc: "For multi-location or high-volume SMEs requiring custom webhook integrations, multi-channel ads, and dedicated sales automation.",
    features: [
      "Everything in Acquisition Engine included",
      "Omni-channel PPC (Google, Meta, YouTube, LinkedIn)",
      "Custom multi-agent AI workflows (Quote Generator & CRM)",
      "Multi-location local SEO architecture (up to 4 territories)",
      "Executive founder authority ghostwriting & video scripts",
      "Dedicated senior growth engineer on instant call standby"
    ],
    popular: false,
    cta: "Deploy Scale & AI Infrastructure"
  }
];

const FAQS = [
  {
    question: "Do you lock us into a 6 or 12-month agency contract?",
    answer: "Never. We believe long lock-in retainers protect lazy agencies. We begin with a 90-day execution ramp to build the infrastructure and establish a steady lead flow. After that, we operate on flexible 30-day rolling sprints. You stay because the pipeline generates revenue, not because a lawyer told you to."
  },
  {
    question: "Who owns the ad accounts, creative assets, and code?",
    answer: "You do, 100%. We configure every Google Ads, Meta Business Manager, GA4 property, and web domain directly under your company's accounts. If you ever decide to part ways, you retain every keyword list, customer audience, and piece of code we built. We never hold your assets hostage."
  },
  {
    question: "How does the 24/7 AI Lead Qualification bot actually work?",
    answer: "When an inbound prospect fills out a form, clicks a WhatsApp button, or sends an SMS, our custom AI agent engages them within 45 seconds. It asks 2 to 3 pre-qualifying questions (e.g., project scope, budget range, timeline) and provides immediate answers based on your service parameters. Once qualified, it sends your live calendar link to book a consultation."
  },
  {
    question: "What minimum ad spend is required to see real results?",
    answer: "For most SME niches (trades, manufacturing, local services), we recommend a minimum monthly platform ad spend of $1,200 to $2,500. This provides enough data volume for Google and Meta's algorithms to exit the learning phase rapidly and deliver predictable lead volume."
  },
  {
    question: "How quickly do we see measurable lead flow?",
    answer: "PPC campaigns and the 24/7 AI triage funnel go live within 7 to 10 days of kickoff. You will typically see your first inbound qualified leads in week two. SEO and Google Map Pack rankings compound steadily over 60 to 90 days."
  }
];

function IndustrialBadge({ text, yellow = false, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider font-black px-2.5 py-0.5 border ${
        yellow
          ? "bg-yellow-400 text-zinc-950 border-zinc-950 shadow-[2px_2px_0px_#18181b]"
          : "bg-zinc-200 text-zinc-800 border-zinc-400 shadow-[1px_1px_0px_#71717a]"
      } ${className}`}
    >
      {text}
    </span>
  );
}

function SectionStamp({ tag, title, subtitle }) {
  return (
    <div className="mb-12 max-w-3xl">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="w-2.5 h-2.5 bg-yellow-400 border border-zinc-950 inline-block shadow-[1px_1px_0px_#18181b]"></span>
        <span className="font-mono text-xs uppercase tracking-widest text-zinc-600 font-bold">
          [ {tag} ]
        </span>
      </div>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight font-sans">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3.5 text-zinc-700 text-sm sm:text-base leading-relaxed font-sans">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function Navbar({ onOpenAudit, onOpenBooking }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-zinc-100/95 backdrop-blur-md border-b-2 border-zinc-950">
      {/* Pilot alert line */}
      <div className="bg-zinc-950 text-zinc-300 text-[11px] font-mono py-1.5 px-4 flex items-center justify-between border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping"></span>
          <span className="font-bold text-yellow-400 tracking-wider">
            [ SYSTEM STATUS: {AGENCY_DATA.status} ]
          </span>
        </div>
        <div className="hidden md:flex items-center gap-5 text-zinc-400">
          <span>OPERATOR SLA: &lt; 2H</span>
          <span className="text-zinc-600">|</span>
          <span className="text-yellow-400 font-semibold">{AGENCY_DATA.directLine}</span>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-yellow-400 border-2 border-zinc-950 shadow-[3px_3px_0px_#18181b] flex items-center justify-center font-mono font-black text-xl text-zinc-950 group-hover:bg-yellow-300 transition-colors">
              f
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-xl font-black tracking-tighter text-zinc-950">
                frstfame
              </span>
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase -mt-1 font-bold">
                SME REVENUE ENGINE
              </span>
            </div>
          </a>
        </div>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-7 font-mono text-xs font-bold uppercase tracking-wider text-zinc-800">
          <a href="#capabilities" className="hover:text-zinc-950 hover:underline decoration-yellow-400 decoration-2 underline-offset-4 transition-all">Capabilities</a>
          <a href="#standard" className="hover:text-zinc-950 hover:underline decoration-yellow-400 decoration-2 underline-offset-4 transition-all">The Standard</a>
          <a href="#simulator" className="hover:text-zinc-950 hover:underline decoration-yellow-400 decoration-2 underline-offset-4 transition-all">ROI Engine</a>
          <a href="#funnel" className="hover:text-zinc-950 hover:underline decoration-yellow-400 decoration-2 underline-offset-4 transition-all">AI Funnel</a>
          <a href="#pricing" className="hover:text-zinc-950 hover:underline decoration-yellow-400 decoration-2 underline-offset-4 transition-all">Sprints</a>
          <a href="#teardown" className="hover:text-zinc-950 hover:underline decoration-yellow-400 decoration-2 underline-offset-4 transition-all">Audit</a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenBooking}
            className="hidden sm:inline-flex items-center font-mono text-xs uppercase font-bold text-zinc-900 hover:text-zinc-950 px-3.5 py-2.5 border-2 border-zinc-950 bg-white shadow-[2px_2px_0px_#18181b] hover:bg-zinc-50 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
          >
            [ Schedule 15m Call ]
          </button>

          <button
            onClick={onOpenAudit}
            className="inline-flex items-center justify-center px-4 py-2.5 font-mono text-xs uppercase font-black tracking-wider text-zinc-950 bg-yellow-400 hover:bg-yellow-300 border-2 border-zinc-950 shadow-[3px_3px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            Request 48h Audit &rarr;
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 border-2 border-zinc-950 bg-white text-zinc-950 shadow-[2px_2px_0px_#18181b]"
            aria-label="Toggle Navigation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t-2 border-zinc-950 bg-zinc-200 p-4 space-y-2 font-mono text-xs uppercase font-bold text-zinc-900">
          <a href="#capabilities" onClick={() => setMobileOpen(false)} className="block py-2.5 px-3 bg-white border border-zinc-300 shadow-[2px_2px_0px_#71717a]">&bull; Capabilities Spec Sheet</a>
          <a href="#standard" onClick={() => setMobileOpen(false)} className="block py-2.5 px-3 bg-white border border-zinc-300 shadow-[2px_2px_0px_#71717a]">&bull; Fluff vs Standard</a>
          <a href="#simulator" onClick={() => setMobileOpen(false)} className="block py-2.5 px-3 bg-white border border-zinc-300 shadow-[2px_2px_0px_#71717a]">&bull; ROI Calculator</a>
          <a href="#funnel" onClick={() => setMobileOpen(false)} className="block py-2.5 px-3 bg-white border border-zinc-300 shadow-[2px_2px_0px_#71717a]">&bull; AI Funnel Simulator</a>
          <a href="#pricing" onClick={() => setMobileOpen(false)} className="block py-2.5 px-3 bg-white border border-zinc-300 shadow-[2px_2px_0px_#71717a]">&bull; Transparent Sprints</a>
          <a href="#teardown" onClick={() => setMobileOpen(false)} className="block py-2.5 px-3 bg-white border border-zinc-300 shadow-[2px_2px_0px_#71717a]">&bull; 48-Hour Teardown</a>
        </div>
      )}
    </header>
  );
}

function HeroSection({ onOpenAudit, onOpenBooking }) {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 bg-zinc-100 border-b-2 border-zinc-950 overflow-hidden">
      {/* Tactile grid pattern */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[radial-gradient(#18181b_1px,transparent_1px)] [background-size:18px_18px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-wrap items-center gap-2.5 mb-6">
          <IndustrialBadge text="SPEC № 2026 // DIRECT OPERATOR COHORT" yellow={true} />
          <span className="font-mono text-xs font-bold text-zinc-500">
            [ SPRINT CYCLES FOR SMES $500K - $10M ]
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-zinc-950 tracking-tight leading-[1.05] max-w-5xl font-sans">
          Digital Infrastructure & Revenue Engineering for SMEs{" "}
          <span className="bg-yellow-400 px-2 py-0.5 border-2 border-zinc-950 shadow-[4px_4px_0px_#18181b] inline-block mt-1">
            Who Hate Agency Fluff.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-zinc-700 max-w-3xl leading-relaxed font-sans font-medium">
          {AGENCY_DATA.subhead}
        </p>

        {/* Live CTA button cluster */}
        <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <button
            onClick={onOpenAudit}
            className="px-8 py-4 font-mono text-xs uppercase tracking-widest font-black text-zinc-950 bg-yellow-400 hover:bg-yellow-300 border-2 border-zinc-950 shadow-[4px_4px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-3"
          >
            <span>Claim 48-Hour Digital Teardown</span>
            <span>&rarr;</span>
          </button>

          <a
            href="#simulator"
            className="px-6 py-4 font-mono text-xs uppercase tracking-widest font-bold text-zinc-950 bg-white hover:bg-zinc-50 border-2 border-zinc-950 shadow-[3px_3px_0px_#18181b] transition-all flex items-center justify-center gap-2"
          >
            <span>Launch Live ROI Calculator &darr;</span>
          </a>
        </div>

        {/* Tactile real-world KPI chips */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border-2 border-zinc-950 p-5 shadow-[3px_3px_0px_#18181b]">
            <div className="font-mono text-[10px] uppercase font-bold text-zinc-500">[ BENCHMARK 01 ]</div>
            <div className="text-3xl font-black text-zinc-950 font-mono mt-1">3.8x</div>
            <div className="text-xs text-zinc-700 font-sans mt-1 font-semibold">Average 90-Day Blended ROAS</div>
          </div>

          <div className="bg-white border-2 border-zinc-950 p-5 shadow-[3px_3px_0px_#18181b]">
            <div className="font-mono text-[10px] uppercase font-bold text-zinc-500">[ BENCHMARK 02 ]</div>
            <div className="text-3xl font-black text-zinc-950 font-mono mt-1">&lt; 45 Sec</div>
            <div className="text-xs text-zinc-700 font-sans mt-1 font-semibold">Automated AI Lead Triage SLA</div>
          </div>

          <div className="bg-white border-2 border-zinc-950 p-5 shadow-[3px_3px_0px_#18181b]">
            <div className="font-mono text-[10px] uppercase font-bold text-zinc-500">[ BENCHMARK 03 ]</div>
            <div className="text-3xl font-black text-yellow-500 font-mono mt-1">100%</div>
            <div className="text-xs text-zinc-700 font-sans mt-1 font-semibold">Client-Owned Ad Accounts & Code</div>
          </div>

          <div className="bg-white border-2 border-zinc-950 p-5 shadow-[3px_3px_0px_#18181b]">
            <div className="font-mono text-[10px] uppercase font-bold text-zinc-500">[ BENCHMARK 04 ]</div>
            <div className="text-3xl font-black text-zinc-950 font-mono mt-1">0 Days</div>
            <div className="text-xs text-zinc-700 font-sans mt-1 font-semibold">Lock-In Retainer Penalties</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ComparisonMatrix() {
  return (
    <section id="standard" className="py-20 bg-zinc-200 border-b-2 border-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionStamp
          tag="OPERATIONAL REALITY CHECK"
          title="The Traditional Agency Fluff vs. The frstfame Standard."
          subtitle="Most SMEs have paid $3,000 to $5,000 a month to an agency that sent confusing graphs once every 30 days. Here is our operational contrast."
        />

        <div className="border-2 border-zinc-950 bg-white shadow-[6px_6px_0px_#18181b]">
          {/* Table Header */}
          <div className="grid grid-cols-1 md:grid-cols-12 bg-zinc-950 text-zinc-100 font-mono text-xs uppercase tracking-wider py-4 px-6 font-bold">
            <div className="md:col-span-3 text-zinc-400">OPERATIONAL AXIS</div>
            <div className="md:col-span-4 text-zinc-400 flex items-center gap-1.5">
              <span className="text-red-400 font-black">&times;</span>
              <span>TRADITIONAL AGENCY FLUFF</span>
            </div>
            <div className="md:col-span-5 text-yellow-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-yellow-400 inline-block"></span>
              <span>THE FRSTFAME STANDARD</span>
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y-2 divide-zinc-200">
            {FLUFF_VS_STANDARD.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 p-6 gap-4 md:gap-6 hover:bg-yellow-50/60 transition-colors items-start"
              >
                <div className="md:col-span-3">
                  <span className="font-mono text-xs uppercase text-zinc-400 font-bold block mb-1">
                    [ PROTOCOL 0{idx + 1} ]
                  </span>
                  <span className="font-sans font-black text-zinc-950 text-base">
                    {row.category}
                  </span>
                </div>

                <div className="md:col-span-4 text-xs sm:text-sm text-zinc-600 font-sans leading-relaxed border-l-2 md:border-l-0 pl-3 md:pl-0 border-zinc-300">
                  <span className="md:hidden font-mono text-[10px] text-zinc-500 font-bold block mb-1">
                    TYPICAL AGENCY:
                  </span>
                  {row.fluff}
                </div>

                <div className="md:col-span-5 text-xs sm:text-sm text-zinc-950 font-sans font-semibold leading-relaxed border-l-2 md:border-l-0 pl-3 md:pl-0 border-yellow-400 bg-yellow-100/30 p-2 md:p-0">
                  <span className="md:hidden font-mono text-[10px] text-yellow-700 font-bold block mb-1">
                    FRSTFAME:
                  </span>
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-500 font-black shrink-0">&bull;</span>
                    <span>{row.frstfame}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CapabilitiesSheet({ onOpenAudit }) {
  const [activeTab, setActiveTab] = useState("ppc");

  const current = useMemo(() => {
    return CAPABILITIES.find(c => c.id === activeTab) || CAPABILITIES[0];
  }, [activeTab]);

  return (
    <section id="capabilities" className="py-20 bg-zinc-100 border-b-2 border-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionStamp
          tag="ENGINEERING SPECIFICATION SHEET"
          title="7 Modular SME Growth Capabilities."
          subtitle="Click through our operational modules below to review granular deliverables, technology stacks, and target performance benchmarks."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Selector Navigation */}
          <div className="lg:col-span-5 space-y-2.5">
            {CAPABILITIES.map((cap) => {
              const active = cap.id === activeTab;
              return (
                <button
                  key={cap.id}
                  onClick={() => setActiveTab(cap.id)}
                  className={`w-full text-left p-4 border-2 transition-all flex items-center justify-between ${
                    active
                      ? "bg-yellow-400 border-zinc-950 shadow-[4px_4px_0px_#18181b] translate-x-1"
                      : "bg-white border-zinc-400 hover:border-zinc-950 hover:bg-zinc-50"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-black uppercase text-zinc-950 bg-zinc-200 px-1.5 py-0.5 border border-zinc-400">
                        {cap.code}
                      </span>
                      <span className="font-mono text-[11px] text-zinc-600 font-bold uppercase tracking-wider">
                        {cap.category}
                      </span>
                    </div>
                    <div className="font-black text-zinc-950 text-base mt-1.5 font-sans">
                      {cap.name}
                    </div>
                  </div>

                  <span className="font-mono text-xs font-black text-zinc-950">
                    {active ? "[LOADED]" : "INSPECT"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detailed Spec Sheet */}
          <div className="lg:col-span-7 bg-white border-2 border-zinc-950 p-6 sm:p-8 shadow-[6px_6px_0px_#18181b]">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b-2 border-zinc-200">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-yellow-400 border border-zinc-950"></span>
                <span className="font-mono text-xs font-black uppercase text-zinc-950">
                  {current.code} // ENGINEERING SPEC
                </span>
              </div>
              <IndustrialBadge text={current.benchmark} yellow={true} />
            </div>

            <div className="mt-6">
              <h3 className="text-2xl font-black text-zinc-950 font-sans">
                {current.name}
              </h3>
              <p className="mt-3 text-zinc-700 text-sm sm:text-base leading-relaxed font-sans">
                {current.goal}
              </p>
            </div>

            {/* Tech Stack Chips */}
            <div className="mt-6 p-4 bg-zinc-100 border-2 border-zinc-300">
              <span className="font-mono text-[11px] uppercase font-bold text-zinc-500 block mb-2">
                OPERATIONAL INFRASTRUCTURE & TOOLS:
              </span>
              <div className="flex flex-wrap gap-2">
                {current.stack.map((item, i) => (
                  <span
                    key={i}
                    className="font-mono text-xs bg-white text-zinc-900 border border-zinc-400 px-2.5 py-1 font-semibold"
                  >
                    #{item}
                  </span>
                ))}
              </div>
            </div>

            {/* Deliverables Checklist */}
            <div className="mt-6">
              <span className="font-mono text-xs uppercase tracking-wider font-black text-zinc-950 block mb-3">
                [ TANGIBLE SYSTEM DELIVERABLES ]
              </span>
              <ul className="space-y-3">
                {current.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-800">
                    <span className="w-4 h-4 bg-yellow-400 border border-zinc-950 flex items-center justify-center font-mono text-[10px] font-black shrink-0 mt-0.5 shadow-[1px_1px_0px_#18181b]">
                      ✓
                    </span>
                    <span className="font-sans font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer info & CTA */}
            <div className="mt-8 pt-6 border-t-2 border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[10px] uppercase text-zinc-500 block">SLA TURNAROUND</span>
                <span className="font-mono text-xs font-bold text-zinc-950">{current.turnaround}</span>
              </div>

              <button
                onClick={onOpenAudit}
                className="px-6 py-3 font-mono text-xs uppercase tracking-widest font-black text-zinc-950 bg-yellow-400 hover:bg-yellow-300 border-2 border-zinc-950 shadow-[3px_3px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
              >
                Inquire on this module &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RoiSimulator({ onOpenAudit }) {
  const [spend, setSpend] = useState(3500);
  const [dealValue, setDealValue] = useState(1800);
  const [traffic, setTraffic] = useState(3200);
  const [convRate, setConvRate] = useState(2.5);

  const metrics = useMemo(() => {
    const rawLeads = Math.round((traffic * (convRate / 100)) + (spend / 52));
    const leads = Math.max(6, rawLeads);
    const closeRate = 0.24;
    const closedDeals = Math.max(1, Math.round(leads * closeRate));
    const projectedLift = closedDeals * dealValue;
    const preventedWaste = Math.round(spend * 0.28);
    const hoursSaved = Math.min(32, Math.max(6, Math.round(6 + (leads * 0.35))));
    const calculatedRoas = (projectedLift / spend).toFixed(1);

    return {
      leads,
      closedDeals,
      projectedLift,
      preventedWaste,
      hoursSaved,
      roas: Math.max(1.8, parseFloat(calculatedRoas))
    };
  }, [spend, dealValue, traffic, convRate]);

  return (
    <section id="simulator" className="py-20 bg-zinc-200 border-b-2 border-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionStamp
          tag="MATHEMATICAL UNIT ECONOMICS"
          title="Interactive SME Growth & ROI Simulator."
          subtitle="Adjust the operational parameters below to model potential pipeline revenue, ad spend saved from negative keyword pruning, and weekly hours reclaimed with AI triage."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Controls column */}
          <div className="lg:col-span-6 bg-white border-2 border-zinc-950 p-6 sm:p-8 shadow-[6px_6px_0px_#18181b] space-y-6">
            <div className="flex items-center justify-between pb-3 border-b-2 border-zinc-200">
              <span className="font-mono text-xs uppercase font-black text-zinc-950">
                [ INPUT YOUR CURRENT METRICS ]
              </span>
              <IndustrialBadge text="USD CALCULATOR" />
            </div>

            {/* Slider 1: Ad Spend */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label className="font-mono text-xs uppercase font-bold text-zinc-800">
                  Monthly Platform Ad Spend (Google & Meta)
                </label>
                <span className="font-mono font-black text-lg text-zinc-950 bg-yellow-400 px-2.5 py-0.5 border-2 border-zinc-950 shadow-[2px_2px_0px_#18181b]">
                  ${spend.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="20000"
                step="250"
                value={spend}
                onChange={(e) => setSpend(Number(e.target.value))}
                className="w-full h-2.5 bg-zinc-300 appearance-none cursor-pointer accent-yellow-400 border border-zinc-950"
              />
              <div className="flex justify-between font-mono text-[10px] text-zinc-500 mt-1">
                <span>$500</span>
                <span>$20,000</span>
              </div>
            </div>

            {/* Slider 2: Deal Value */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label className="font-mono text-xs uppercase font-bold text-zinc-800">
                  Average Customer / Contract Value
                </label>
                <span className="font-mono font-black text-lg text-zinc-950 bg-zinc-100 px-2.5 py-0.5 border border-zinc-400">
                  ${dealValue.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={dealValue}
                onChange={(e) => setDealValue(Number(e.target.value))}
                className="w-full h-2.5 bg-zinc-300 appearance-none cursor-pointer accent-zinc-950 border border-zinc-950"
              />
              <div className="flex justify-between font-mono text-[10px] text-zinc-500 mt-1">
                <span>$100</span>
                <span>$10,000</span>
              </div>
            </div>

            {/* Slider 3: Traffic */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label className="font-mono text-xs uppercase font-bold text-zinc-800">
                  Current Monthly Website Traffic
                </label>
                <span className="font-mono font-black text-lg text-zinc-950 bg-zinc-100 px-2.5 py-0.5 border border-zinc-400">
                  {traffic.toLocaleString()} visits
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={traffic}
                onChange={(e) => setTraffic(Number(e.target.value))}
                className="w-full h-2.5 bg-zinc-300 appearance-none cursor-pointer accent-zinc-950 border border-zinc-950"
              />
              <div className="flex justify-between font-mono text-[10px] text-zinc-500 mt-1">
                <span>500</span>
                <span>50,000</span>
              </div>
            </div>

            {/* Slider 4: Conversion Rate */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label className="font-mono text-xs uppercase font-bold text-zinc-800">
                  Current Lead Conversion Rate
                </label>
                <span className="font-mono font-black text-lg text-zinc-950 bg-zinc-100 px-2.5 py-0.5 border border-zinc-400">
                  {convRate}%
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.1"
                value={convRate}
                onChange={(e) => setConvRate(Number(e.target.value))}
                className="w-full h-2.5 bg-zinc-300 appearance-none cursor-pointer accent-yellow-400 border border-zinc-950"
              />
              <div className="flex justify-between font-mono text-[10px] text-zinc-500 mt-1">
                <span>0.5%</span>
                <span>5.0%</span>
              </div>
            </div>
          </div>

          {/* Results column */}
          <div className="lg:col-span-6 bg-zinc-950 text-white border-2 border-zinc-950 p-6 sm:p-8 shadow-[6px_6px_0px_#71717a] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-6">
                <span className="font-mono text-xs uppercase font-bold text-yellow-400">
                  [ CONSERVATIVE 90-DAY PROJECTIONS ]
                </span>
                <span className="font-mono text-xs bg-yellow-400 text-zinc-950 font-black px-2 py-0.5 border border-zinc-950">
                  PROJECTED ROAS: {metrics.roas}x
                </span>
              </div>

              {/* 2x2 readout grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-zinc-900 border-2 border-zinc-800 p-4">
                  <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider block">
                    MONTHLY QUALIFIED LEADS
                  </span>
                  <div className="text-3xl font-black font-mono text-white mt-1">
                    {metrics.leads}
                  </div>
                  <span className="text-[11px] text-zinc-400 mt-0.5 block">Estimated high-intent inquiries</span>
                </div>

                <div className="bg-zinc-900 border-2 border-zinc-800 p-4">
                  <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider block">
                    ESTIMATED CLOSED DEALS
                  </span>
                  <div className="text-3xl font-black font-mono text-yellow-400 mt-1">
                    {metrics.closedDeals}
                  </div>
                  <span className="text-[11px] text-zinc-400 mt-0.5 block">Based on ~24% qualified close</span>
                </div>
              </div>

              {/* Cash ledger specs */}
              <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-3 mb-6 font-mono text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="text-zinc-400">Projected Pipeline Revenue Lift:</span>
                  <span className="font-black text-lg text-yellow-400">
                    +${metrics.projectedLift.toLocaleString()} / mo
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="text-zinc-400">Wasted Ad Spend Prevented:</span>
                  <span className="font-bold text-zinc-200">
                    ~${metrics.preventedWaste.toLocaleString()} / mo
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Staff Hours Saved with AI Triage:</span>
                  <span className="font-bold text-yellow-400">
                    ~{metrics.hoursSaved} Hours / week
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenAudit}
              className="w-full py-4 font-mono text-xs uppercase tracking-widest font-black text-zinc-950 bg-yellow-400 hover:bg-yellow-300 border-2 border-zinc-950 shadow-[3px_3px_0px_#ffffff] transition-all flex items-center justify-center gap-2"
            >
              <span>Validate These Projections In Your Teardown</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function AiFunnelSimulator() {
  const [activeStep, setActiveStep] = useState(0);
  const [simulating, setSimulating] = useState(false);

  const steps = [
    {
      num: "01",
      title: "Commercial Traffic Capture",
      tag: "SEARCH & SOCIAL",
      desc: "Buyer searches 'commercial hvac maintenance' on Google. Lands on a sub-second, conversion-engineered page.",
      status: "Visitor triggers capture form at 14:02:11"
    },
    {
      num: "02",
      title: "AI WhatsApp/SMS Triage",
      tag: "<45s RESPONSE SLA",
      desc: "Autonomous conversational bot reaches out to the lead via WhatsApp and SMS in 38 seconds. Asks 2 qualifying scope questions.",
      status: "AI validates commercial budget & postal territory"
    },
    {
      num: "03",
      title: "Self-Serve Calendar Slot",
      tag: "FRICTIONLESS BOOKING",
      desc: "AI passes meeting link directly into chat. Lead picks Thursday 10:30 AM without back-and-forth email tags.",
      status: "Calendar booked & SMS reminder scheduled"
    },
    {
      num: "04",
      title: "CRM & Sales Webhook Sync",
      tag: "ZERO DATA ENTRY",
      desc: "Full transcript, qualification score, and Google ad attribution string pushed directly to HubSpot / Slack.",
      status: "Sales representative alerted on Slack with full context"
    }
  ];

  const handleRunSimulation = () => {
    if (simulating) return;
    setSimulating(true);
    setActiveStep(0);

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current < steps.length) {
        setActiveStep(current);
      } else {
        clearInterval(interval);
        setSimulating(false);
      }
    }, 1800);
  };

  return (
    <section id="funnel" className="py-20 bg-zinc-100 border-b-2 border-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionStamp
          tag="AUTONOMOUS REVENUE INFRASTRUCTURE"
          title="24/7 Inbound Lead Funnel Simulator."
          subtitle="See how our integrated performance marketing and conversational AI stack captures, qualifies, and books prospects while your sales reps are on the road."
        />

        <div className="border-2 border-zinc-950 bg-white shadow-[6px_6px_0px_#18181b] p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b-2 border-zinc-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-yellow-400 border border-zinc-950"></span>
              <span className="font-mono text-xs font-black uppercase text-zinc-950">
                PIPELINE STATE: {simulating ? "SIMULATION RUNNING..." : "READY TO EXECUTE"}
              </span>
            </div>

            <button
              onClick={handleRunSimulation}
              disabled={simulating}
              className={`px-5 py-2.5 font-mono text-xs uppercase tracking-wider font-black border-2 border-zinc-950 transition-all ${
                simulating
                  ? "bg-zinc-300 text-zinc-600 cursor-not-allowed"
                  : "bg-yellow-400 text-zinc-950 hover:bg-yellow-300 shadow-[3px_3px_0px_#18181b]"
              }`}
            >
              {simulating ? "Processing Sequence..." : "Run Live Inbound Simulation ▶"}
            </button>
          </div>

          {/* 4 Pipeline Stages */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            {steps.map((s, idx) => {
              const isCurrent = activeStep === idx;
              const isPast = activeStep > idx;

              return (
                <div
                  key={s.num}
                  onClick={() => !simulating && setActiveStep(idx)}
                  className={`p-5 border-2 transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-yellow-400 border-zinc-950 shadow-[4px_4px_0px_#18181b] scale-[1.02]"
                      : isPast
                      ? "bg-zinc-100 border-zinc-950 opacity-90"
                      : "bg-white border-zinc-300 hover:border-zinc-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-black text-zinc-950">
                      STEP {s.num}
                    </span>
                    <span className="font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 bg-white border border-zinc-950">
                      {s.tag}
                    </span>
                  </div>

                  <h4 className="font-bold font-sans text-base text-zinc-950 mt-2">
                    {s.title}
                  </h4>
                  <p className="text-xs text-zinc-700 font-sans mt-2 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Live Terminal Log / Output Box */}
          <div className="mt-8 bg-zinc-950 text-zinc-300 p-5 border-2 border-zinc-950 font-mono text-xs shadow-[4px_4px_0px_#71717a]">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-3 text-[11px] text-zinc-500">
              <span>SIMULATED LOG: STEP {steps[activeStep].num} // {steps[activeStep].tag}</span>
              <span className="text-yellow-400 font-bold">LATENCY: 38 SECONDS</span>
            </div>
            <div className="space-y-1.5">
              <p className="text-yellow-400 font-bold">&gt; {steps[activeStep].status}</p>
              {activeStep === 0 && (
                <p className="text-zinc-400">&gt; Query: "commercial hvac contractor north warehouse" | UTM: google_cpc_commercial</p>
              )}
              {activeStep === 1 && (
                <p className="text-zinc-400">&gt; WhatsApp Bot: "Hi Dave, received your warehouse spec sheet. Are you needing 3-phase cooling by Q2?"</p>
              )}
              {activeStep === 2 && (
                <p className="text-zinc-400">&gt; Cal.com webhook dispatched: Dave booked Senior Engineer Site Assessment for Thursday 10:30 AM.</p>
              )}
              {activeStep === 3 && (
                <p className="text-zinc-400">&gt; HubSpot Deal created: "Dave - Commercial Warehouse ($18,500 Scope)" | Slack #inbound pinged.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingSection({ onOpenBooking, onOpenAudit }) {
  return (
    <section id="pricing" className="py-20 bg-zinc-200 border-b-2 border-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionStamp
          tag="TRANSPARENT ENGAGEMENT MODELS"
          title="Zero Retainer Fluff. Sprint-Based Delivery."
          subtitle="We don't do vague hours or 12-month lock-in contracts. Choose between an immediate one-off repair sprint or rolling monthly growth execution."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`p-6 sm:p-8 border-2 flex flex-col justify-between transition-all ${
                plan.popular
                  ? "bg-yellow-400 border-zinc-950 shadow-[6px_6px_0px_#18181b] relative lg:-translate-y-2"
                  : "bg-white border-zinc-950 shadow-[4px_4px_0px_#18181b]"
              }`}
            >
              <div>
                {plan.popular && (
                  <div className="mb-4">
                    <span className="font-mono text-[10px] uppercase font-black px-2 py-0.5 bg-zinc-950 text-yellow-400 border border-zinc-950">
                      ★ MOST REQUESTED SME OPERATOR RETAINER
                    </span>
                  </div>
                )}

                <span className="font-mono text-xs font-bold text-zinc-600 block">
                  {plan.stamp}
                </span>

                <h3 className="text-2xl font-black text-zinc-950 font-sans mt-1">
                  {plan.name}
                </h3>

                <p className="text-xs text-zinc-700 font-sans mt-2 leading-relaxed">
                  {plan.desc}
                </p>

                <div className="mt-6 pt-4 border-t-2 border-zinc-950/20">
                  <div className="font-mono text-4xl font-black text-zinc-950">
                    {plan.price}
                  </div>
                  <div className="font-mono text-xs text-zinc-700 mt-1 font-bold">
                    {plan.cadence}
                  </div>
                </div>

                <div className="mt-6 space-y-2.5">
                  <span className="font-mono text-[11px] uppercase font-bold text-zinc-800 block">
                    INCLUDED SPECIFICATIONS:
                  </span>
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-900 font-sans font-medium">
                      <span className="w-4 h-4 bg-zinc-950 text-yellow-400 flex items-center justify-center font-mono text-[10px] font-black shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t-2 border-zinc-950/20">
                <button
                  onClick={plan.popular ? onOpenAudit : onOpenBooking}
                  className={`w-full py-3.5 font-mono text-xs uppercase tracking-widest font-black border-2 border-zinc-950 transition-all ${
                    plan.popular
                      ? "bg-zinc-950 text-yellow-400 hover:bg-zinc-900 shadow-[3px_3px_0px_#ffffff]"
                      : "bg-yellow-400 text-zinc-950 hover:bg-yellow-300 shadow-[3px_3px_0px_#18181b]"
                  }`}
                >
                  {plan.cta} &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeardownSection() {
  const [businessName, setBusinessName] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [bottleneck, setBottleneck] = useState("ppc_waste");
  const [submitted, setSubmitted] = useState(false);

  const bottleneckNotes = {
    ppc_waste: {
      tag: "PAID MEDIA LEAKAGE",
      note: "High probability of negative-keyword leakage and untracked form spam inflating your Cost Per Acquisition (CPA) by 25-40%."
    },
    seo_invisible: {
      tag: "LOCAL VISIBILITY GAP",
      note: "Your business is likely missing localized geo-coordinate schema and has inconsistent citation signals causing Google Map Pack suppression."
    },
    slow_site: {
      tag: "CONVERSION FRICTION",
      note: "Bloated CMS plugins and heavy third-party tracking scripts pushing mobile load times past 3.5 seconds, causing 50%+ bounce rate."
    },
    slow_leads: {
      tag: "LEAD DECAY WINDOW",
      note: "Inbound leads cooling down over hours of delay. Qualifying within 60 seconds increases contact-to-booking rates by 391%."
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!businessName || !website || !email) return;
    setSubmitted(true);
  };

  return (
    <section id="teardown" className="py-20 bg-zinc-100 border-b-2 border-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionStamp
          tag="ZERO COST / ZERO PRESSURE"
          title="Request Your 48-Hour Digital Teardown."
          subtitle="Tell us your primary business bottleneck. We will manually inspect your search footprint, landing pages, and lead pipeline, then record a private 10-minute video teardown."
        />

        <div className="border-2 border-zinc-950 bg-white shadow-[6px_6px_0px_#18181b] p-6 sm:p-10 max-w-4xl mx-auto">
          {submitted ? (
            <div className="text-center py-10">
              <div className="w-14 h-14 bg-yellow-400 border-2 border-zinc-950 shadow-[3px_3px_0px_#18181b] flex items-center justify-center font-mono text-2xl font-black text-zinc-950 mx-auto mb-4">
                ✓
              </div>
              <h3 className="text-2xl font-black text-zinc-950 font-sans">
                Teardown Ticket Queued Successfully.
              </h3>
              <p className="text-sm text-zinc-700 font-sans mt-2 max-w-md mx-auto">
                Our growth engineering team is inspecting <strong>{website}</strong>. You will receive a private 10-minute Loom teardown video at <strong>{email}</strong> within 48 business hours.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setSubmitted(false)}
                  className="font-mono text-xs uppercase font-bold text-zinc-900 underline"
                >
                  Submit another website audit &rarr;
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="font-mono text-xs uppercase font-bold text-zinc-900 block mb-2">
                    Company / Trade Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Industrial Solutions"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full p-3.5 bg-zinc-100 border-2 border-zinc-400 focus:border-zinc-950 font-mono text-xs text-zinc-950 outline-none"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs uppercase font-bold text-zinc-900 block mb-2">
                    Current Website URL *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://apexindustrial.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full p-3.5 bg-zinc-100 border-2 border-zinc-400 focus:border-zinc-950 font-mono text-xs text-zinc-950 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-xs uppercase font-bold text-zinc-900 block mb-2">
                  Founder / Operator Email (For Private Video Delivery) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="founder@apexindustrial.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3.5 bg-zinc-100 border-2 border-zinc-400 focus:border-zinc-950 font-mono text-xs text-zinc-950 outline-none"
                />
              </div>

              {/* Primary Bottleneck Selector */}
              <div>
                <label className="font-mono text-xs uppercase font-bold text-zinc-900 block mb-2">
                  Select Your Primary Growth Bottleneck
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: "ppc_waste", label: "High Ad Spend / Low Lead Volume" },
                    { key: "seo_invisible", label: "Invisible on Google Maps & Local Search" },
                    { key: "slow_site", label: "Slow Website / Low Form Conversion" },
                    { key: "slow_leads", label: "Leads Going Cold / Slow Follow-up" }
                  ].map((b) => (
                    <button
                      type="button"
                      key={b.key}
                      onClick={() => setBottleneck(b.key)}
                      className={`p-3 text-left border-2 font-mono text-xs transition-all ${
                        bottleneck === b.key
                          ? "bg-yellow-400 text-zinc-950 border-zinc-950 font-black shadow-[3px_3px_0px_#18181b]"
                          : "bg-white text-zinc-800 border-zinc-300 hover:border-zinc-950 font-medium"
                      }`}
                    >
                      {bottleneck === b.key ? "▶ " : "○ "} {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Live Diagnostic Preview */}
              <div className="p-4 bg-zinc-100 border-2 border-zinc-950 font-mono text-xs text-zinc-800">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 bg-yellow-400 border border-zinc-950"></span>
                  <span className="font-bold text-zinc-950 uppercase">
                    PRE-DIAGNOSTIC NOTE: {bottleneckNotes[bottleneck].tag}
                  </span>
                </div>
                <p className="text-zinc-600 font-sans text-xs">
                  {bottleneckNotes[bottleneck].note}
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-4 font-mono text-xs uppercase tracking-widest font-black text-zinc-950 bg-yellow-400 hover:bg-yellow-300 border-2 border-zinc-950 shadow-[4px_4px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              >
                Dispatch Teardown Request (Guaranteed 48h Response) &rarr;
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="faq" className="py-20 bg-zinc-200 border-b-2 border-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionStamp
          tag="CLARIFYING QUESTIONS"
          title="Direct Answers for SME Founders."
          subtitle="Straightforward answers about operational contracts, ad account ownership, tool costs, and day-to-day communication."
        />

        <div className="border-2 border-zinc-950 bg-white shadow-[6px_6px_0px_#18181b] divide-y-2 divide-zinc-200">
          {FAQS.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={i} className="p-6">
                <button
                  onClick={() => setOpenIdx(isOpen ? -1 : i)}
                  className="w-full text-left flex items-center justify-between gap-4 group"
                >
                  <span className="font-sans font-black text-lg text-zinc-950 group-hover:text-yellow-600 transition-colors">
                    {faq.question}
                  </span>
                  <span className="font-mono text-sm font-black px-2 py-0.5 bg-zinc-100 border border-zinc-950">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="mt-4 pt-4 border-t border-zinc-200 text-sm text-zinc-700 leading-relaxed font-sans font-medium">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BookingModal({ isOpen, onClose }) {
  const [selectedDay, setSelectedDay] = useState("Tuesday");
  const [selectedTime, setSelectedTime] = useState("11:30 AM");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const times = ["09:30 AM", "11:30 AM", "02:00 PM", "04:15 PM"];

  const handleBooking = (e) => {
    e.preventDefault();
    if (!name || !email) return;
    setConfirmed(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
      <div className="bg-white border-2 border-zinc-950 p-6 sm:p-8 max-w-lg w-full shadow-[8px_8px_0px_#facc15] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 border-2 border-zinc-950 bg-zinc-100 flex items-center justify-center font-mono font-black text-sm hover:bg-yellow-400 transition-colors"
        >
          ✕
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 bg-yellow-400 border border-zinc-950"></span>
          <span className="font-mono text-xs uppercase font-bold text-zinc-600">
            [ 15-MINUTE OPERATOR STRATEGY SLOT ]
          </span>
        </div>

        <h3 className="text-2xl font-black text-zinc-950 font-sans">
          Schedule Growth Assessment
        </h3>

        {confirmed ? (
          <div className="mt-6 p-6 bg-yellow-50 border-2 border-zinc-950 text-center">
            <div className="w-12 h-12 bg-yellow-400 border-2 border-zinc-950 shadow-[2px_2px_0px_#18181b] flex items-center justify-center font-mono font-black text-xl mx-auto mb-3">
              ✓
            </div>
            <h4 className="font-black text-lg text-zinc-950">
              Strategy Call Confirmed!
            </h4>
            <p className="text-xs text-zinc-700 mt-2 font-sans">
              Confirmed for <strong>{selectedDay} at {selectedTime}</strong>. A calendar invite with Google Meet link has been dispatched to <strong>{email}</strong>.
            </p>
            <button
              onClick={() => {
                setConfirmed(false);
                onClose();
              }}
              className="mt-6 px-6 py-2.5 bg-zinc-950 text-yellow-400 font-mono text-xs uppercase font-black"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleBooking} className="mt-6 space-y-4">
            {/* Day selector */}
            <div>
              <label className="font-mono text-[11px] uppercase font-bold text-zinc-700 block mb-1.5">
                1. Select Preferred Day
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {days.map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setSelectedDay(d)}
                    className={`py-2 text-center font-mono text-[11px] border-2 uppercase font-bold transition-all ${
                      selectedDay === d
                        ? "bg-yellow-400 border-zinc-950 text-zinc-950 shadow-[2px_2px_0px_#18181b]"
                        : "bg-zinc-100 border-zinc-300 text-zinc-700 hover:border-zinc-950"
                    }`}
                  >
                    {d.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Time selector */}
            <div>
              <label className="font-mono text-[11px] uppercase font-bold text-zinc-700 block mb-1.5">
                2. Select Time Window (EST)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {times.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`py-2 text-center font-mono text-xs border-2 font-bold transition-all ${
                      selectedTime === t
                        ? "bg-yellow-400 border-zinc-950 text-zinc-950 shadow-[2px_2px_0px_#18181b]"
                        : "bg-zinc-100 border-zinc-300 text-zinc-700 hover:border-zinc-950"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Form fields */}
            <div>
              <label className="font-mono text-[11px] uppercase font-bold text-zinc-700 block mb-1">
                Your Name & Company
              </label>
              <input
                type="text"
                required
                placeholder="Marcus Vance, Apex HVAC"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-zinc-100 border-2 border-zinc-300 focus:border-zinc-950 font-mono text-xs outline-none"
              />
            </div>

            <div>
              <label className="font-mono text-[11px] uppercase font-bold text-zinc-700 block mb-1">
                Direct Work Email
              </label>
              <input
                type="email"
                required
                placeholder="marcus@apexhvac.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 bg-zinc-100 border-2 border-zinc-300 focus:border-zinc-950 font-mono text-xs outline-none"
              />
            </div>

            <div>
              <label className="font-mono text-[11px] uppercase font-bold text-zinc-700 block mb-1">
                Mobile Number (For Calendar SMS Confirmation)
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 019-2834"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 bg-zinc-100 border-2 border-zinc-300 focus:border-zinc-950 font-mono text-xs outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-3.5 font-mono text-xs uppercase tracking-widest font-black text-zinc-950 bg-yellow-400 hover:bg-yellow-300 border-2 border-zinc-950 shadow-[3px_3px_0px_#18181b] transition-all"
            >
              Lock In Slot: {selectedDay} at {selectedTime} &rarr;
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Footer({ onOpenAudit, onOpenBooking }) {
  return (
    <footer className="bg-zinc-950 text-white border-t-2 border-zinc-950 pt-16 pb-12 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-zinc-800">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-400 border-2 border-zinc-950 shadow-[2px_2px_0px_#ffffff] flex items-center justify-center font-black text-zinc-950 text-base">
                f
              </div>
              <span className="text-xl font-black tracking-tighter text-white">
                frstfame
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans max-w-sm">
              {AGENCY_DATA.tagline} Direct operator execution for trade contractors, manufacturing, B2B services, and specialized clinics.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
              <span className="text-[11px] text-yellow-400 font-bold uppercase">
                {AGENCY_DATA.status}
              </span>
            </div>
          </div>

          <div className="md:col-span-3 space-y-2 text-xs">
            <span className="font-bold text-yellow-400 uppercase tracking-wider block mb-3">
              [ QUICK JUMP ]
            </span>
            <a href="#capabilities" className="block text-zinc-400 hover:text-white transition-colors">&gt; Capabilities Spec</a>
            <a href="#standard" className="block text-zinc-400 hover:text-white transition-colors">&gt; Fluff vs Standard</a>
            <a href="#simulator" className="block text-zinc-400 hover:text-white transition-colors">&gt; ROI Simulator</a>
            <a href="#funnel" className="block text-zinc-400 hover:text-white transition-colors">&gt; AI Lead Funnel</a>
            <a href="#pricing" className="block text-zinc-400 hover:text-white transition-colors">&gt; Pricing & Sprints</a>
          </div>

          <div className="md:col-span-4 space-y-3 text-xs">
            <span className="font-bold text-yellow-400 uppercase tracking-wider block mb-3">
              [ DIRECT OPERATOR DISPATCH ]
            </span>
            <div className="text-zinc-400">
              EMAIL: <span className="text-white font-bold">{AGENCY_DATA.dispatchEmail}</span>
            </div>
            <div className="text-zinc-400">
              PHONE: <span className="text-white font-bold">{AGENCY_DATA.directLine}</span>
            </div>
            <div className="pt-2">
              <button
                onClick={onOpenAudit}
                className="px-4 py-2.5 bg-yellow-400 text-zinc-950 font-black uppercase text-[11px] border-2 border-zinc-950 shadow-[2px_2px_0px_#ffffff] hover:bg-yellow-300 transition-colors"
              >
                Claim 48h Digital Teardown &rarr;
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} frstfame Agency Operations. All SME client IP & ad accounts remain 100% client property.
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>NO LOCK-IN TERMS</span>
            <span>&bull;</span>
            <span>VERIFIED ZERO-FLUFF</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [auditModalOpen, setAuditModalOpen] = useState(false);

  const handleOpenAudit = useCallback(() => {
    setAuditModalOpen(true);
  }, []);

  const handleCloseAudit = useCallback(() => {
    setAuditModalOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 font-sans selection:bg-yellow-400 selection:text-zinc-950 antialiased">
      {/* Navigation */}
      <Navbar
        onOpenAudit={handleOpenAudit}
        onOpenBooking={handleOpenAudit}
      />

      {/* Hero Section */}
      <HeroSection
        onOpenAudit={handleOpenAudit}
        onOpenBooking={handleOpenAudit}
      />

      {/* Fluff vs Standard Comparison */}
      <ComparisonMatrix />

      {/* Capabilities Spec Sheet (7 Services) */}
      <CapabilitiesSheet onOpenAudit={handleOpenAudit} />

      {/* Mathematical ROI & Growth Simulator */}
      <RoiSimulator onOpenAudit={handleOpenAudit} />

      {/* 24/7 AI Lead Funnel Simulator */}
      <AiFunnelSimulator />

      {/* Transparent Sprint Pricing */}
      <PricingSection
        onOpenBooking={handleOpenAudit}
        onOpenAudit={handleOpenAudit}
      />

      {/* Dynamic 48-Hour Teardown Form */}
      <TeardownSection />

      {/* Clarifying FAQ Accordion */}
      <FaqSection />

      {/* Industrial Footer */}
      <Footer
        onOpenAudit={handleOpenAudit}
        onOpenBooking={handleOpenAudit}
      />

      {/* Interactive Booking / Teardown Modal */}
      <BookingModal
        isOpen={auditModalOpen}
        onClose={handleCloseAudit}
      />
    </div>
  );
}