/** @jsxRuntime classic */
/** @jsx React.createElement */
/** @jsxFrag React.Fragment */

import React, { useState, useMemo, useCallback } from 'react';
import { supabase } from './supabaseClient';

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
  status: "2 ADVISORY ALLOCATIONS REMAINING",
  dispatchEmail: "operators@frstfame.com",
  directLine: "+1 (888) 412-FAME",
  tagline: "Autonomous Revenue Infrastructure & Acquisition Engineering for High-Growth Enterprises.",
  subhead: "Direct operator growth engineering for trade contractors, manufacturing, specialized healthcare, and premium B2B. Zero account managers. Zero vanity PDF summaries. 100% client-owned infrastructure."
};

const CAPABILITIES = [
  {
    id: "ppc",
    code: "SPEC-01",
    name: "Precision Paid Acquisition & Search Arbitrage",
    category: "Capital Deployment",
    goal: "Capture high-intent commercial searches across Google and Meta while systematically pruning broad-match ad spend bleed.",
    turnaround: "7 Business Days to Live In-Market Deployment",
    stack: ["Google Ads Core", "Server-Side Meta CAPI", "LinkedIn Campaign Studio", "Looker Financial Suite"],
    deliverables: [
      "Negative keyword harvesting protocol extracted from 240+ commercial queries",
      "Dynamic high-contrast creative iterations engineered for qualified commercial buyers",
      "Server-side Meta Conversions API (CAPI) redundancy protecting against ad-block degradation",
      "Instant commercial lead routing to executive WhatsApp, SMS, and CRM pipelines"
    ],
    benchmark: "3.8x – 5.2x Blended Enterprise ROAS"
  },
  {
    id: "seo",
    code: "SPEC-02",
    name: "High-Yield Organic Visibility & Map-Pack Authority",
    category: "Organic Search",
    goal: "Dominate Google Map 3-Pack rankings and transaction-oriented search queries that drive qualified inbound calls.",
    turnaround: "Initial momentum in 21 Days; Territory dominance in 75-90 Days",
    stack: ["Google Business Profile Core", "Ahrefs Enterprise", "Geo-Coordinates Schema", "BrightLocal Pro"],
    deliverables: [
      "GBP 3-Pack position capture backed by geo-tagged asset citation verification",
      "Directory accuracy synchronization across 65+ Tier-1 commercial registries",
      "Siloed commercial landing page architecture built for immediate conversion",
      "Sub-second Core Web Vitals optimization backed by structured entity schema"
    ],
    benchmark: "+165% Inbound Commercial Call Volume"
  },
  {
    id: "ai-auto",
    code: "SPEC-03",
    name: "24/7 Autonomous AI Qualification & Deal Routing",
    category: "Autonomous Systems",
    goal: "Qualify, vet, and book inbound enterprise prospects on WhatsApp and SMS within 45 seconds—before competitors pick up the phone.",
    turnaround: "Turnkey operational deployment in 10 Days",
    stack: ["Private LLM Orchestrator", "Meta WhatsApp Cloud API", "Twilio Enterprise", "HubSpot / GoHighLevel"],
    deliverables: [
      "Bespoke conversational triage agent custom-trained on your exact pricing & territory scopes",
      "Under-45-second inquiry response SLA operating 24 hours a day, 365 days a year",
      "Autonomous calendar booking dispatch coupled with two-way SMS confirmation",
      "Bi-directional synchronization into HubSpot, Salesforce, GoHighLevel, or secure data warehouses"
    ],
    benchmark: "< 45-Second Response SLA (24/7)"
  },
  {
    id: "web-dev",
    code: "SPEC-04",
    name: "High-Conversion Edge Web Architecture",
    category: "Digital Infrastructure",
    goal: "Engineered, ultra-low latency static web assets built with zero bloated plugins to convert qualified traffic into committed pipeline.",
    turnaround: "14 Days kickoff to global production launch",
    stack: ["Next.js", "Tailwind CSS", "Vercel Edge Network", "Cloudflare Enterprise DNS"],
    deliverables: [
      "Zero-bloat codebase scoring 99+ on Google Mobile PageSpeed performance indices",
      "Integrated multi-step prospect qualification forms and interactive unit-economics engines",
      "Frictionless booking architecture and enterprise payment processing integrations",
      "Continuous multivariate testing across primary value propositions and conversion anchors"
    ],
    benchmark: "4.2% – 7.8% Visit-to-Qualified Pipeline"
  },
  {
    id: "analytics",
    code: "SPEC-05",
    name: "Revenue Attribution & Unified Cash Ledgers",
    category: "Data Integrity",
    goal: "Connect ad spend directly to closed bank revenue so you know exactly which dollar produced each client.",
    turnaround: "Integrated and audited in 5 Days",
    stack: ["GA4 Server-Side Gateway", "Looker Studio", "CallRail Dynamic Routing", "Stripe Enterprise"],
    deliverables: [
      "Executive balance-sheet dashboard tracking Cost Per Acquired Customer (CAC)",
      "Dynamic call tracking with exact source attribution, keyword provenance, and call audio logs",
      "Server-side event tagging unaffected by browser cookie constraints or iOS updates",
      "Direct weekly reconciliation between paid acquisition spend and invoiced bank deposits"
    ],
    benchmark: "100% Attribution Transparency"
  },
  {
    id: "content",
    code: "SPEC-06",
    name: "Executive Positioning & Category Authority",
    category: "Authority Engineering",
    goal: "Transform proprietary domain expertise into high-trust positioning assets that compress enterprise sales cycles.",
    turnaround: "First editorial briefing sprint completed in 6 Days",
    stack: ["Figma Editorial Frameworks", "Loom Enterprise", "LinkedIn Executive Engine", "Descript"],
    deliverables: [
      "Weekly executive perspectives ghostwritten directly for the founder/CEO",
      "Quantitative case study dossiers highlighting audited unit-economics and ROI proof",
      "Short-form technical explainer scripts establishing market defensibility",
      "Sales enablement tear-sheets resolving prospect objections before discovery calls"
    ],
    benchmark: "4.8x Discovery Call Receptivity"
  },
  {
    id: "social-mgmt",
    code: "SPEC-07",
    name: "Multi-Channel Brand Distribution & Defense",
    category: "Strategic Distribution",
    goal: "Maintain commanding presence across primary commercial channels without pulling the CEO away from core operations.",
    turnaround: "Live editorial calendar published within 7 Days",
    stack: ["Buffer Enterprise", "Figma Design System", "Meta Business Suite", "YouTube Studio"],
    deliverables: [
      "3 high-impact commercial assets distributed weekly across LinkedIn, Meta, and YouTube",
      "Rapid prospect response protocol on inbound inquiries within 60 minutes",
      "Continuous competitor positioning surveillance and quarterly gap analyses",
      "Monthly attribution audits linking distribution volume directly to site pipeline"
    ],
    benchmark: "+310% Brand Footprint Growth"
  }
];

const FLUFF_VS_STANDARD = [
  {
    category: "Operator Assignment",
    fluff: "Senior pitch executives disappear post-signature; your account is delegated to a junior associate managing 16 accounts.",
    frstfame: "Direct access to senior growth operators and technical architects on dedicated Slack/WhatsApp channels with a <2h SLA."
  },
  {
    category: "IP & Account Ownership",
    fluff: "Agencies configure campaigns in proprietary accounts, taking your data and negative keyword lists hostage if you leave.",
    frstfame: "100% client sovereignty. All ad accounts, domain DNS, analytics properties, and code repos remain your property from day one."
  },
  {
    category: "Executive Reporting",
    fluff: "Dense 40-page automated PDF reports loaded with vanity vanity metrics such as 'impressions', 'reach', and 'clicks'.",
    frstfame: "Weekly 1-page cash ledger displaying qualified pipeline volume, cost per closed contract, and net recognized revenue."
  },
  {
    category: "Speed-to-Lead Protocol",
    fluff: "Inbound leads sit in an unmonitored inbox for 24-48 hours until someone manually dispatches an email.",
    frstfame: "Autonomous conversational AI engages every lead via SMS and WhatsApp in under 45 seconds, booking consultations directly."
  },
  {
    category: "Contractual Alignment",
    fluff: "Mandatory 6- to 12-month lock-in retainers with punitive 60-day cancellation penalties regardless of delivery.",
    frstfame: "Initial 90-day execution sprint to build the infrastructure, followed by flexible 30-day rolling performance sprints."
  }
];

const PRICING_PLANS = [
  {
    id: "sprint",
    name: "Funnel Re-Engineering Sprint",
    badge: "30-DAY ONE-OFF SPRINT",
    price: "$2,450",
    cadence: "Fixed Capital Allocation / Zero Lock-in",
    desc: "For established businesses with active traffic or ad spend suffering from high drop-off, negative keyword bleed, or poor conversion.",
    features: [
      "Comprehensive PPC audit and aggressive negative keyword harvest scrub",
      "Bespoke Next.js high-conversion landing page replacement",
      "Google Business Profile Map 3-Pack overhaul & local schema integration",
      "Under-45-second AI WhatsApp & SMS triage system installation",
      "GA4 server-side attribution and conversion tracking configuration",
      "30 days of post-deployment performance stabilization & tuning"
    ],
    popular: false,
    cta: "Initiate Re-Engineering Sprint"
  },
  {
    id: "acquisition",
    name: "Autonomous Growth Engine",
    badge: "CORE PARTNERSHIP MODEL",
    price: "$1,850",
    cadence: "per month / Rolling 30-Day Terms",
    desc: "Our flagship operational engagement. Full-stack management of paid acquisition, local search authority, and autonomous lead capture.",
    features: [
      "Complete Google Ads & Meta Paid Social performance execution",
      "Weekly bid calibration and continuous negative keyword harvesting",
      "Continuous Local Map 3-Pack authority maintenance and directory syncing",
      "24/7 AI Lead Qualification system hosting, monitoring, and tuning",
      "Weekly 1-page executive cash ledger and net revenue attribution memo",
      "Continuous A/B multivariate headline and conversion hook split-testing",
      "Dedicated direct Slack & WhatsApp operator channel (< 2h response SLA)"
    ],
    popular: true,
    cta: "Deploy Autonomous Growth Engine"
  },
  {
    id: "enterprise",
    name: "Enterprise Market Dominance",
    badge: "BESPOKE SME ECOSYSTEM",
    price: "$3,400",
    cadence: "per month / Rolling 30-Day Terms",
    desc: "Engineered for multi-location or high-velocity enterprises requiring customized data architectures, multi-network media, and automated quoting.",
    features: [
      "All components of Autonomous Growth Engine included",
      "Omni-channel paid media orchestration (Google, Meta, YouTube, LinkedIn)",
      "Custom multi-agent AI pipeline workflows (Instant Quote Generator & CRM)",
      "Multi-territory local SEO architecture (covers up to 4 commercial markets)",
      "Executive thought-leadership ghostwriting and authority video scripts",
      "Dedicated senior growth engineer on direct standby for internal meetings"
    ],
    popular: false,
    cta: "Request Enterprise Consultation"
  }
];

const FAQS = [
  {
    question: "Do you require 6- or 12-month lock-in contracts?",
    answer: "No. Multi-month lock-in retainers reward agency complacency. We conduct an initial 90-day execution sprint to build your acquisition infrastructure, configure server-side tracking, and stabilize lead flow. After that, we transition to rolling 30-day performance sprints. You remain our client because the pipeline generates clear profit, not because of legal coercion."
  },
  {
    question: "Who owns the ad accounts, creative assets, and code?",
    answer: "You own 100% of your assets. We build everything inside your Google Ads manager, Meta Business Suite, GA4 properties, and hosting accounts from day one. If you ever pause our engagement, every keyword list, converted audience, custom landing page, and attribution script remains permanently in your possession."
  },
  {
    question: "How does the autonomous 24/7 AI Lead Qualification system function?",
    answer: "The moment a prospect completes an inquiry form, taps a WhatsApp link, or sends an SMS, our proprietary AI agent initiates conversation in under 45 seconds. It poses 2 to 3 pre-qualifying diagnostic questions (e.g. project budget, timeline, scope) and answers operational queries using parameters you establish. Once qualified, it sends your direct calendar link to secure an appointment."
  },
  {
    question: "What minimum ad budget is necessary to generate reliable results?",
    answer: "For most commercial service providers, contractors, and specialized clinics, we suggest an ad budget of $1,200 to $2,500/month. This volume allows Google and Meta's predictive bidding algorithms to exit the machine-learning phase quickly and deliver consistent cost-per-acquisition metrics."
  },
  {
    question: "What is the timeline to first measurable commercial inquiries?",
    answer: "PPC search campaigns and your autonomous AI responder go live within 7 to 10 days of kickoff. Most partners see their first qualified commercial inquiries by the second week. Local Map 3-Pack authority and organic positioning steadily compound over 60 to 90 days."
  }
];

function LuxuryPill({ text, glowing = false, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide uppercase ${
        glowing
          ? "bg-amber-400/10 text-amber-300 border border-amber-400/25 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
          : "bg-white/[0.04] text-zinc-300 border border-white/[0.08]"
      } ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${glowing ? "bg-amber-400 animate-pulse" : "bg-zinc-400"}`} />
      {text}
    </span>
  );
}

function SectionHeading({ tag, title, subtitle }) {
  return (
    <div className="mb-16 max-w-3xl">
      <div className="flex items-center gap-2.5 mb-3">
        <span className="h-px w-6 bg-amber-400/60" />
        <span className="text-xs uppercase tracking-[0.2em] font-mono text-amber-300/90 font-semibold">
          {tag}
        </span>
      </div>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white font-sans">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-zinc-400 text-base sm:text-lg leading-relaxed font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function Navbar({ onOpenAudit, onOpenBooking }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/[0.08]">
      {/* Executive Status Banner */}
      <div className="bg-[#0e0f14] text-zinc-400 text-[11px] py-1.5 px-4 sm:px-8 border-b border-white/[0.06] flex items-center justify-between font-mono">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          <span className="text-zinc-200 tracking-wider font-medium">
            CAPACITY ALLOCATION: <span className="text-amber-300">{AGENCY_DATA.status}</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-zinc-400">
          <span>OPERATOR SLA: &lt; 2H</span>
          <span className="text-zinc-700">|</span>
          <span className="text-zinc-300 hover:text-white transition-colors">{AGENCY_DATA.directLine}</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-mono font-bold text-lg text-black shadow-[0_0_20px_rgba(245,158,11,0.25)] group-hover:scale-105 transition-transform duration-300">
            f
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white font-sans group-hover:text-amber-200 transition-colors">
              frstfame
            </span>
            <span className="text-[10px] tracking-[0.2em] text-zinc-400 uppercase font-mono -mt-1">
              REVENUE ENGINE
            </span>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-wider font-mono text-zinc-300">
          <a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a>
          <a href="#standard" className="hover:text-white transition-colors">The Standard</a>
          <a href="#simulator" className="hover:text-white transition-colors">ROI Engine</a>
          <a href="#funnel" className="hover:text-white transition-colors">AI Funnel</a>
          <a href="#pricing" className="hover:text-white transition-colors">Sprints</a>
          <a href="#teardown" className="hover:text-white transition-colors">Audit</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenBooking}
            className="hidden sm:inline-flex items-center px-4 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] transition-all"
          >
            Schedule 15m Call
          </button>

          <button
            onClick={onOpenAudit}
            className="px-5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold text-black bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:brightness-110 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all"
          >
            Request 48h Audit &rarr;
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-zinc-300"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-[#0e0f14] border-t border-white/[0.08] px-4 py-6 space-y-3 font-mono text-xs uppercase text-zinc-300">
          <a href="#capabilities" onClick={() => setMobileOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-white/[0.05]">Capabilities Spec</a>
          <a href="#standard" onClick={() => setMobileOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-white/[0.05]">Fluff vs Standard</a>
          <a href="#simulator" onClick={() => setMobileOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-white/[0.05]">ROI Calculator</a>
          <a href="#funnel" onClick={() => setMobileOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-white/[0.05]">AI Funnel</a>
          <a href="#pricing" onClick={() => setMobileOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-white/[0.05]">Sprints & Retainers</a>
          <a href="#teardown" onClick={() => setMobileOpen(false)} className="block py-2 px-3 rounded-lg text-amber-300 hover:bg-amber-400/10">Request 48h Teardown</a>
        </div>
      )}
    </header>
  );
}

function HeroSection({ onOpenAudit, onOpenBooking }) {
  return (
    <section className="relative pt-20 pb-28 md:pt-32 md:pb-40 bg-[#09090b] overflow-hidden border-b border-white/[0.08]">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-gradient-to-b from-amber-500/15 via-amber-500/5 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <LuxuryPill text="OPERATOR ALLIANCE // SPEC 2026" glowing={true} />
          <span className="text-xs font-mono text-zinc-400">
            ENTERPRISE REVENUE INFRASTRUCTURE
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-white leading-[1.08] max-w-5xl font-sans">
          Digital Infrastructure &amp; Revenue Engineering for SMEs{" "}
          <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent font-medium">
            Who Value Execution Over Agency Fluff.
          </span>
        </h1>

        <p className="mt-8 text-lg sm:text-xl text-zinc-400 max-w-3xl leading-relaxed font-normal">
          {AGENCY_DATA.subhead}
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <button
            onClick={onOpenAudit}
            className="px-8 py-4 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold text-black bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:brightness-110 shadow-[0_0_30px_rgba(245,158,11,0.25)] transition-all flex items-center justify-center gap-3"
          >
            <span>Claim 48-Hour Digital Teardown</span>
            <span>&rarr;</span>
          </button>

          <a
            href="#simulator"
            className="px-8 py-4 rounded-xl font-mono text-xs uppercase tracking-wider font-medium text-zinc-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] transition-all flex items-center justify-center gap-2"
          >
            <span>Launch Live ROI Calculator &darr;</span>
          </a>
        </div>

        {/* Executive KPI Cards */}
        <div className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-sm hover:border-white/[0.16] transition-colors">
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 block">Benchmark 01</span>
            <div className="text-3xl sm:text-4xl font-semibold text-white mt-2 font-mono">3.8x</div>
            <span className="text-xs text-zinc-400 mt-2 block font-sans">Audited 90-Day Enterprise ROAS</span>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-sm hover:border-white/[0.16] transition-colors">
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 block">Benchmark 02</span>
            <div className="text-3xl sm:text-4xl font-semibold text-amber-400 mt-2 font-mono">&lt; 45s</div>
            <span className="text-xs text-zinc-400 mt-2 block font-sans">Autonomous AI Inbound Triage SLA</span>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-sm hover:border-white/[0.16] transition-colors">
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 block">Benchmark 03</span>
            <div className="text-3xl sm:text-4xl font-semibold text-white mt-2 font-mono">100%</div>
            <span className="text-xs text-zinc-400 mt-2 block font-sans">Client-Owned IP &amp; Code Sovereignty</span>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-sm hover:border-white/[0.16] transition-colors">
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 block">Benchmark 04</span>
            <div className="text-3xl sm:text-4xl font-semibold text-white mt-2 font-mono">0 Days</div>
            <span className="text-xs text-zinc-400 mt-2 block font-sans">Lock-In Retainer Penalties</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ComparisonMatrix() {
  return (
    <section id="standard" className="py-28 bg-[#0c0d12] border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="THE OPERATIONAL GAP"
          title="Traditional Agency Retainers vs. The frstfame Standard."
          subtitle="Most enterprises have spent $3,000 to $6,000 every month on agencies that delivered vanity PDF reports once every 30 days. Here is our direct contrast."
        />

        <div className="rounded-3xl border border-white/[0.1] bg-[#09090b]/80 backdrop-blur-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="grid grid-cols-1 md:grid-cols-12 bg-white/[0.03] border-b border-white/[0.08] text-xs font-mono uppercase tracking-wider py-4 px-6 text-zinc-400">
            <div className="md:col-span-3">Operational Axis</div>
            <div className="md:col-span-4 text-rose-400/90 flex items-center gap-2">
              <span>✕ Traditional Agency Retainer</span>
            </div>
            <div className="md:col-span-5 text-amber-300 flex items-center gap-2">
              <span>✦ The frstfame Standard</span>
            </div>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {FLUFF_VS_STANDARD.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 p-6 gap-4 md:gap-6 hover:bg-white/[0.02] transition-colors items-start"
              >
                <div className="md:col-span-3">
                  <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest block mb-1">
                    PROTOCOL 0{idx + 1}
                  </span>
                  <span className="font-sans font-medium text-white text-base">
                    {row.category}
                  </span>
                </div>

                <div className="md:col-span-4 text-sm text-zinc-400 leading-relaxed">
                  {row.fluff}
                </div>

                <div className="md:col-span-5 text-sm text-zinc-200 font-medium leading-relaxed bg-amber-400/[0.03] p-4 rounded-xl border border-amber-400/10">
                  {row.frstfame}
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
    <section id="capabilities" className="py-28 bg-[#09090b] border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="ENGINEERING ARCHITECTURE"
          title="7 Modular Acquisition Capabilities."
          subtitle="Explore our operational modules below to audit granular system deliverables, software stacks, and target enterprise performance benchmarks."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Tab Selectors */}
          <div className="lg:col-span-5 space-y-2">
            {CAPABILITIES.map((cap) => {
              const active = cap.id === activeTab;
              return (
                <button
                  key={cap.id}
                  onClick={() => setActiveTab(cap.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                    active
                      ? "bg-white/[0.07] border-amber-400/40 text-white shadow-[0_0_25px_rgba(245,158,11,0.08)]"
                      : "bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-white/[0.06] text-zinc-300 font-medium">
                        {cap.code}
                      </span>
                      <span className="font-mono text-[11px] text-zinc-400 uppercase tracking-wide">
                        {cap.category}
                      </span>
                    </div>
                    <div className="text-base font-medium text-white mt-1.5 font-sans">
                      {cap.name}
                    </div>
                  </div>

                  <span className="text-xs font-mono uppercase text-amber-300/80">
                    {active ? "ACTIVE" : "INSPECT"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Spec Card */}
          <div className="lg:col-span-7 rounded-2xl bg-white/[0.02] border border-white/[0.1] p-8 backdrop-blur-xl shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="font-mono text-xs uppercase tracking-wider text-zinc-300">
                  {current.code} // Granular Spec
                </span>
              </div>
              <LuxuryPill text={current.benchmark} glowing={true} />
            </div>

            <div className="mt-6">
              <h3 className="text-2xl font-semibold text-white font-sans">
                {current.name}
              </h3>
              <p className="mt-3 text-zinc-400 text-sm leading-relaxed">
                {current.goal}
              </p>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="font-mono text-[10px] uppercase text-zinc-400 block mb-2 tracking-wider">
                Operational Tech Stack &amp; Gateway:
              </span>
              <div className="flex flex-wrap gap-2">
                {current.stack.map((item, i) => (
                  <span
                    key={i}
                    className="font-mono text-xs bg-white/[0.04] text-zinc-200 border border-white/[0.08] px-3 py-1 rounded-md"
                  >
                    #{item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <span className="font-mono text-xs uppercase tracking-wider text-zinc-300 block mb-3 font-semibold">
                Tangible System Deliverables
              </span>
              <ul className="space-y-3">
                {current.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-zinc-300">
                    <span className="w-4 h-4 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center font-mono text-[10px] text-amber-300 shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[10px] uppercase text-zinc-400 block">SLA Commitment</span>
                <span className="font-mono text-xs font-semibold text-white">{current.turnaround}</span>
              </div>

              <button
                onClick={onOpenAudit}
                className="px-6 py-3 rounded-lg font-mono text-xs uppercase tracking-wider font-semibold text-black bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:brightness-110 transition-all"
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
    <section id="simulator" className="py-28 bg-[#0c0d12] border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="MATHEMATICAL UNIT ECONOMICS"
          title="Interactive Enterprise Growth &amp; ROI Simulator."
          subtitle="Calibrate your actual operational parameters below to model pipeline revenue potential, eliminated ad spend waste, and weekly hours saved through automated triage."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-6 rounded-2xl bg-[#09090b] border border-white/[0.1] p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <span className="font-mono text-xs uppercase tracking-wider text-zinc-300">
                Input Metrics
              </span>
              <LuxuryPill text="USD ENGINE" />
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label className="text-xs uppercase font-mono text-zinc-300">
                  Monthly Ad Spend (Google &amp; Meta)
                </label>
                <span className="font-mono text-amber-300 font-semibold text-lg">
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
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label className="text-xs uppercase font-mono text-zinc-300">
                  Average Deal / Contract Value
                </label>
                <span className="font-mono text-white font-semibold text-lg">
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
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label className="text-xs uppercase font-mono text-zinc-300">
                  Current Monthly Visitors
                </label>
                <span className="font-mono text-white font-semibold text-lg">
                  {traffic.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={traffic}
                onChange={(e) => setTraffic(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label className="text-xs uppercase font-mono text-zinc-300">
                  Lead Conversion Rate
                </label>
                <span className="font-mono text-amber-300 font-semibold text-lg">
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
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>

          <div className="lg:col-span-6 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.1] p-8 flex flex-col justify-between backdrop-blur-xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-300">
                  90-Day Conservative Forecast
                </span>
                <span className="text-xs font-mono bg-amber-400/10 text-amber-300 border border-amber-400/20 px-2.5 py-1 rounded-full">
                  ROAS: {metrics.roas}x
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06]">
                  <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider block">
                    Qualified Inquiries
                  </span>
                  <div className="text-3xl font-semibold text-white mt-1 font-mono">
                    {metrics.leads}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06]">
                  <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider block">
                    Closed Deals (~24%)
                  </span>
                  <div className="text-3xl font-semibold text-amber-300 mt-1 font-mono">
                    {metrics.closedDeals}
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-black/40 border border-white/[0.06] space-y-3 font-mono text-xs mb-6">
                <div className="flex justify-between items-center pb-2 border-b border-white/[0.06]">
                  <span className="text-zinc-400">Projected Pipeline Lift:</span>
                  <span className="font-bold text-base text-amber-300">
                    +${metrics.projectedLift.toLocaleString()} / mo
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-white/[0.06]">
                  <span className="text-zinc-400">Prevented Ad Bleed:</span>
                  <span className="text-zinc-200">
                    ~${metrics.preventedWaste.toLocaleString()} / mo
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Executive Hours Saved:</span>
                  <span className="text-amber-300">
                    ~{metrics.hoursSaved} Hours / week
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenAudit}
              className="w-full py-4 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold text-black bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <span>Verify Projections in 48-Hour Audit</span>
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
      title: "Commercial Intent Acquisition",
      tag: "SEARCH & CAPI",
      desc: "Commercial prospect queries 'commercial hvac infrastructure' on Google. Lands on a sub-second, conversion-engineered page.",
      status: "Inquiry triggered at 14:02:11 UTC"
    },
    {
      num: "02",
      title: "Autonomous AI Qualification",
      tag: "< 45s SLA",
      desc: "Conversational AI initiates WhatsApp/SMS dialogue in 38 seconds, validating commercial project budget & postal territory.",
      status: "AI validates commercial budget & postal territory"
    },
    {
      num: "03",
      title: "Self-Serve Calendar Booking",
      tag: "FRICTIONLESS",
      desc: "AI presents live booking links directly inside conversation. Lead schedules assessment without email delays.",
      status: "Calendar booked & SMS reminder scheduled"
    },
    {
      num: "04",
      title: "Attributed CRM Synchronization",
      tag: "REAL-TIME",
      desc: "Complete transcript, UTM attribution, and lead profile pushed automatically into HubSpot, Slack, and your inbox.",
      status: "Senior operator alerted on Slack with full context"
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
    }, 1600);
  };

  return (
    <section id="funnel" className="py-28 bg-[#09090b] border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="AUTONOMOUS REVENUE SYSTEMS"
          title="24/7 Enterprise Inbound Funnel Simulator."
          subtitle="Watch our unified performance marketing and conversational AI stack capture, qualify, and book enterprise prospects while your executive team is off the clock."
        />

        <div className="rounded-3xl border border-white/[0.1] bg-[#0c0d12] p-6 sm:p-10 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono text-xs uppercase tracking-wider text-zinc-300">
                STATE: {simulating ? "SIMULATION EXECUTING..." : "SYSTEM IDLE // READY"}
              </span>
            </div>

            <button
              onClick={handleRunSimulation}
              disabled={simulating}
              className={`px-5 py-2.5 rounded-lg font-mono text-xs uppercase tracking-wider font-semibold transition-all ${
                simulating
                  ? "bg-white/[0.05] text-zinc-400 cursor-not-allowed"
                  : "bg-amber-400 text-black hover:bg-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
              }`}
            >
              {simulating ? "Running Stream..." : "Run Inbound Simulation ▶"}
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            {steps.map((s, idx) => {
              const isCurrent = activeStep === idx;
              return (
                <div
                  key={s.num}
                  onClick={() => !simulating && setActiveStep(idx)}
                  className={`p-5 rounded-xl border transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-white/[0.07] border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                      : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-amber-300">
                      STEP {s.num}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-zinc-400">
                      {s.tag}
                    </span>
                  </div>

                  <h4 className="font-medium text-white text-sm">
                    {s.title}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-5 rounded-xl bg-black/60 border border-white/[0.06] font-mono text-xs text-zinc-300">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3 text-[11px] text-zinc-400">
              <span>REAL-TIME TELEMETRY: STEP {steps[activeStep].num}</span>
              <span className="text-amber-300 font-semibold">LATENCY: 38ms</span>
            </div>
            <p className="text-amber-300 font-medium">&gt; {steps[activeStep].status}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingSection({ onOpenBooking, onOpenAudit }) {
  return (
    <section id="pricing" className="py-28 bg-[#0c0d12] border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="TRANSPARENT CAPITAL ALLOCATIONS"
          title="Zero Retainer Fluff. Sprint-Based Delivery."
          subtitle="We eliminate nebulous hourly billing and 12-month lock-in agreements. Choose between an immediate repair sprint or continuous monthly execution."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`p-8 rounded-3xl border flex flex-col justify-between transition-all ${
                plan.popular
                  ? "bg-gradient-to-b from-white/[0.06] to-white/[0.02] border-amber-400/40 shadow-[0_0_50px_rgba(245,158,11,0.1)] relative"
                  : "bg-white/[0.02] border-white/[0.08] hover:border-white/[0.14]"
              }`}
            >
              <div>
                {plan.popular && (
                  <div className="mb-4">
                    <LuxuryPill text="MOST REQUESTED ENGAGEMENT" glowing={true} />
                  </div>
                )}

                <span className="font-mono text-xs uppercase tracking-wider text-zinc-400 block">
                  {plan.badge}
                </span>

                <h3 className="text-2xl font-semibold text-white font-sans mt-2">
                  {plan.name}
                </h3>

                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  {plan.desc}
                </p>

                <div className="mt-8 pt-6 border-t border-white/[0.08]">
                  <div className="text-4xl font-semibold text-white font-mono">
                    {plan.price}
                  </div>
                  <div className="text-xs text-zinc-400 mt-1 font-mono">
                    {plan.cadence}
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block">
                    Deliverables Spec Sheet:
                  </span>
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs text-zinc-300">
                      <span className="text-amber-400 shrink-0 mt-0.5">✦</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.08]">
                <button
                  onClick={plan.popular ? onOpenAudit : onOpenBooking}
                  className={`w-full py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-black hover:brightness-110 shadow-[0_0_25px_rgba(245,158,11,0.2)]"
                      : "bg-white/[0.05] text-zinc-200 hover:bg-white/[0.08] border border-white/[0.1]"
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
  const [phone, setPhone] = useState("");
  const [spend, setSpend] = useState("$2,500 - $5,000 / mo");
  const [bottleneck, setBottleneck] = useState("ppc_waste");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const bottleneckNotes = {
    ppc_waste: {
      tag: "PAID MEDIA LEAKAGE",
      note: "High probability of negative-keyword leakage and unpruned search terms inflating your CPA by 25-40%."
    },
    seo_invisible: {
      tag: "MAP 3-PACK VISIBILITY GAP",
      note: "Inconsistent citation signals and missing geo-coordinate schema causing suppression on Google Local search."
    },
    slow_site: {
      tag: "CONVERSION FRICTION",
      note: "Bloated scripts pushing mobile load times beyond 3 seconds, triggering excessive bounce rates on qualified visitors."
    },
    slow_leads: {
      tag: "LEAD DECAY WINDOW",
      note: "Inbound prospects going cold due to delayed follow-up. Initiating contact in <45s increases bookings by 391%."
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    const payload = {
      name: businessName || null,
      email: email || null,
      website: website || null,
      phone: phone || null,
      service: `48h Teardown Audit [${bottleneck}]`,
      monthly_spend: spend || null,
    };

    try {
      const { error } = await supabase.from('leads').insert([payload]);

      if (error) {
        console.error('Supabase error:', error);
        alert('Could not dispatch request: ' + error.message);
        return;
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Network issue transmitting profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="teardown" className="py-28 bg-[#09090b] border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="AUDITED MEMORANDUM"
          title="Claim Your 48-Hour Enterprise Teardown."
          subtitle="Submit your company information below. Our senior operators analyze ad waste, conversion friction, and organic visibility gaps before preparing a private executive action plan."
        />

        <div className="rounded-3xl border border-white/[0.1] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-8 sm:p-12 max-w-4xl mx-auto backdrop-blur-2xl shadow-2xl">
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 rounded-full bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center font-mono text-xl text-emerald-400 mx-auto mb-4">
                ✓
              </div>
              <h3 className="text-2xl font-semibold text-white">
                Teardown Audit Commissioned.
              </h3>
              <p className="mt-3 text-sm text-zinc-400 max-w-md mx-auto">
                Our operator cohort has received your profile. We will inspect your digital infrastructure and transmit your private teardown memorandum within 48 hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setBusinessName("");
                  setWebsite("");
                  setEmail("");
                  setPhone("");
                }}
                className="mt-6 text-xs font-mono uppercase text-amber-300 hover:text-amber-200 underline underline-offset-4"
              >
                Submit another audit request &rarr;
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs uppercase font-mono text-zinc-400 block mb-2">
                    Company / Trade Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Apex Industrial Solutions"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-black/40 border border-white/[0.1] focus:border-amber-400/60 text-white font-mono text-xs outline-none transition-colors placeholder:text-zinc-600"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-mono text-zinc-400 block mb-2">
                    Direct Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="founder@apexindustrial.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-black/40 border border-white/[0.1] focus:border-amber-400/60 text-white font-mono text-xs outline-none transition-colors placeholder:text-zinc-600"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-mono text-zinc-400 block mb-2">
                    Website URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://apexindustrial.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-black/40 border border-white/[0.1] focus:border-amber-400/60 text-white font-mono text-xs outline-none transition-colors placeholder:text-zinc-600"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-mono text-zinc-400 block mb-2">
                    Direct Phone / Mobile
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 019-2834"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-black/40 border border-white/[0.1] focus:border-amber-400/60 text-white font-mono text-xs outline-none transition-colors placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs uppercase font-mono text-zinc-400 block mb-2">
                    Estimated Marketing Budget
                  </label>
                  <select
                    value={spend}
                    onChange={(e) => setSpend(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-[#12131a] border border-white/[0.1] focus:border-amber-400/60 text-white font-mono text-xs outline-none transition-colors"
                  >
                    <option value="Under $1,500 / mo">Under $1,500 / mo</option>
                    <option value="$1,500 - $3,500 / mo">$1,500 - $3,500 / mo</option>
                    <option value="$3,500 - $7,500 / mo">$3,500 - $7,500 / mo</option>
                    <option value="$7,500+ / mo">$7,500+ / mo</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs uppercase font-mono text-zinc-400 block mb-2">
                    Primary Operational Bottleneck
                  </label>
                  <select
                    value={bottleneck}
                    onChange={(e) => setBottleneck(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-[#12131a] border border-white/[0.1] focus:border-amber-400/60 text-white font-mono text-xs outline-none transition-colors"
                  >
                    <option value="ppc_waste">PPC &amp; Paid Media Spend Leakage</option>
                    <option value="seo_invisible">Poor Google Local 3-Pack Authority</option>
                    <option value="slow_site">High Bounce Rate / Low Conversion</option>
                    <option value="slow_leads">Slow Inbound Lead Follow-Up SLA</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-400/[0.04] border border-amber-400/20 font-mono text-xs">
                <span className="text-amber-300 font-medium uppercase block mb-1">
                  [ Diagnostic Notice: {bottleneckNotes[bottleneck].tag} ]
                </span>
                <span className="text-zinc-300">
                  {bottleneckNotes[bottleneck].note}
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-4 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold transition-all ${
                  submitting
                    ? "bg-white/[0.06] text-zinc-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-black hover:brightness-110 shadow-[0_0_30px_rgba(245,158,11,0.25)]"
                }`}
              >
                {submitting ? "Transmitting Profile..." : "Dispatch 48-Hour Teardown Request →"}
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
    <section id="faq" className="py-28 bg-[#0c0d12] border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="EXECUTIVE CLARITY"
          title="Direct Inquiries for Enterprise Leaders."
          subtitle="Candid answers regarding intellectual property, account custody, tooling investments, and operational cadence."
        />

        <div className="rounded-3xl border border-white/[0.1] bg-[#09090b] divide-y divide-white/[0.06] overflow-hidden shadow-2xl">
          {FAQS.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={i} className="p-6 sm:p-8">
                <button
                  onClick={() => setOpenIdx(isOpen ? -1 : i)}
                  className="w-full text-left flex items-center justify-between gap-4 group"
                >
                  <span className="font-sans font-medium text-lg text-white group-hover:text-amber-300 transition-colors">
                    {faq.question}
                  </span>
                  <span className="font-mono text-sm text-zinc-400">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="mt-4 text-sm text-zinc-400 leading-relaxed font-sans">
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
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const times = ["09:30 AM", "11:30 AM", "02:00 PM", "04:15 PM"];

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!name || !email) return;

    setSubmitting(true);
    const payload = {
      name,
      email,
      phone: phone || null,
      service: `15m Call - ${selectedDay} at ${selectedTime}`,
      website: null,
      monthly_spend: null
    };

    try {
      const { error } = await supabase.from('leads').insert([payload]);

      if (error) {
        console.error('Booking error:', error);
        alert('Could not confirm booking: ' + error.message);
        return;
      }

      setConfirmed(true);
    } catch (err) {
      console.error('Booking failed:', err);
      alert('Network issue scheduling call.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0c0d12] border border-white/[0.12] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-[0_0_60px_rgba(0,0,0,0.8)] relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.1] flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="font-mono text-xs uppercase text-amber-300/80">
            15-Minute Operator Strategy Slot
          </span>
        </div>

        <h3 className="text-2xl font-semibold text-white font-sans">
          Schedule Growth Briefing
        </h3>

        {confirmed ? (
          <div className="mt-6 p-6 rounded-2xl bg-amber-400/[0.04] border border-amber-400/20 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-400 text-black font-mono font-bold text-xl flex items-center justify-center mx-auto mb-3">
              ✓
            </div>
            <h4 className="font-medium text-lg text-white">
              Briefing Confirmed.
            </h4>
            <p className="text-xs text-zinc-400 mt-2">
              Reserved for <strong>{selectedDay} at {selectedTime}</strong>. A calendar invite has been sent to <strong>{email}</strong>.
            </p>
            <button
              onClick={() => {
                setConfirmed(false);
                setName("");
                setEmail("");
                setPhone("");
                onClose();
              }}
              className="mt-6 px-6 py-2.5 rounded-lg bg-white text-black font-mono text-xs uppercase font-semibold"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleBooking} className="mt-6 space-y-4">
            <div>
              <label className="font-mono text-[11px] uppercase text-zinc-400 block mb-2">
                1. Select Preferred Day
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {days.map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setSelectedDay(d)}
                    className={`py-2 rounded-lg text-center font-mono text-[11px] uppercase font-medium border transition-all ${
                      selectedDay === d
                        ? "bg-amber-400 text-black border-amber-400"
                        : "bg-white/[0.03] border-white/[0.08] text-zinc-300 hover:border-white/[0.2]"
                    }`}
                  >
                    {d.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-mono text-[11px] uppercase text-zinc-400 block mb-2">
                2. Select Time Window (EST)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {times.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`py-2 rounded-lg text-center font-mono text-xs border font-medium transition-all ${
                      selectedTime === t
                        ? "bg-amber-400 text-black border-amber-400"
                        : "bg-white/[0.03] border-white/[0.08] text-zinc-300 hover:border-white/[0.2]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-mono text-[11px] uppercase text-zinc-400 block mb-1">
                Your Name &amp; Company *
              </label>
              <input
                type="text"
                required
                placeholder="Marcus Vance, Apex HVAC"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-xl bg-black/40 border border-white/[0.1] text-white font-mono text-xs outline-none focus:border-amber-400/60"
              />
            </div>

            <div>
              <label className="font-mono text-[11px] uppercase text-zinc-400 block mb-1">
                Direct Work Email *
              </label>
              <input
                type="email"
                required
                placeholder="marcus@apexhvac.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl bg-black/40 border border-white/[0.1] text-white font-mono text-xs outline-none focus:border-amber-400/60"
              />
            </div>

            <div>
              <label className="font-mono text-[11px] uppercase text-zinc-400 block mb-1">
                Mobile Number (For Calendar SMS)
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 019-2834"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 rounded-xl bg-black/40 border border-white/[0.1] text-white font-mono text-xs outline-none focus:border-amber-400/60"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full mt-4 py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold transition-all ${
                submitting
                  ? "bg-white/[0.05] text-zinc-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-black hover:brightness-110 shadow-[0_0_25px_rgba(245,158,11,0.25)]"
              }`}
            >
              {submitting ? "Securing Slot..." : `Lock In Slot: ${selectedDay} at ${selectedTime} →`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Footer({ onOpenAudit, onOpenBooking }) {
  return (
    <footer className="bg-[#09090b] text-white border-t border-white/[0.08] pt-20 pb-12 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-16 border-b border-white/[0.08]">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-black text-sm">
                f
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                frstfame
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans max-w-sm">
              {AGENCY_DATA.tagline} Direct operator execution for commercial contractors, specialized clinics, and scalable B2B.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
              <span className="text-[11px] text-zinc-300 font-medium">
                {AGENCY_DATA.status}
              </span>
            </div>
          </div>

          <div className="md:col-span-3 space-y-2.5 text-xs text-zinc-400">
            <span className="font-semibold text-white uppercase tracking-wider block mb-3">
              Directory
            </span>
            <a href="#capabilities" className="block hover:text-white transition-colors">&gt; Capabilities Spec</a>
            <a href="#standard" className="block hover:text-white transition-colors">&gt; The Standard</a>
            <a href="#simulator" className="block hover:text-white transition-colors">&gt; ROI Simulator</a>
            <a href="#funnel" className="block hover:text-white transition-colors">&gt; AI Inbound Funnel</a>
            <a href="#pricing" className="block hover:text-white transition-colors">&gt; Sprint Pricing</a>
          </div>

          <div className="md:col-span-4 space-y-3 text-xs text-zinc-400">
            <span className="font-semibold text-white uppercase tracking-wider block mb-3">
              Direct Inquiries
            </span>
            <div>
              EMAIL: <span className="text-white font-medium">{AGENCY_DATA.dispatchEmail}</span>
            </div>
            <div>
              PHONE: <span className="text-white font-medium">{AGENCY_DATA.directLine}</span>
            </div>
            <div className="pt-2">
              <button
                onClick={onOpenAudit}
                className="px-4 py-2.5 rounded-lg bg-amber-400 text-black font-semibold uppercase text-[11px] hover:bg-amber-300 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.2)]"
              >
                Claim 48h Digital Teardown &rarr;
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-400 gap-4">
          <div>
            &copy; {new Date().getFullYear()} frstfame Operations. Client IP, ad accounts, and code repositories remain 100% client property.
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>NO LOCK-IN TERMS</span>
            <span>&bull;</span>
            <span>SOVEREIGN ASSET OWNERSHIP</span>
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
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-amber-400 selection:text-black antialiased">
      <Navbar
        onOpenAudit={handleOpenAudit}
        onOpenBooking={handleOpenAudit}
      />

      <HeroSection
        onOpenAudit={handleOpenAudit}
        onOpenBooking={handleOpenAudit}
      />

      <ComparisonMatrix />

      <CapabilitiesSheet onOpenAudit={handleOpenAudit} />

      <RoiSimulator onOpenAudit={handleOpenAudit} />

      <AiFunnelSimulator />

      <PricingSection
        onOpenBooking={handleOpenAudit}
        onOpenAudit={handleOpenAudit}
      />

      <TeardownSection />

      <FaqSection />

      <Footer
        onOpenAudit={handleOpenAudit}
        onOpenBooking={handleOpenAudit}
      />

      <BookingModal
        isOpen={auditModalOpen}
        onClose={handleCloseAudit}
      />
    </div>
  );
}