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
    fluff: "Dense 40-page automated PDF reports loaded with vanity metrics such as 'impressions', 'reach', and 'clicks'.",
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

function CherryPill({ text, glowing = false, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-medium tracking-wide uppercase font-mono ${
        glowing
          ? "bg-[#7A1528]/10 text-[#7A1528] border border-[#7A1528]/25 shadow-[0_0_12px_rgba(122,21,40,0.1)]"
          : "bg-stone-200/60 text-stone-700 border border-stone-300"
      } ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${glowing ? "bg-[#7A1528] animate-pulse" : "bg-stone-400"}`} />
      {text}
    </span>
  );
}

function SectionHeading({ tag, title, subtitle }) {
  return (
    <div className="mb-16 max-w-3xl">
      <div className="flex items-center gap-2.5 mb-3">
        <span className="h-px w-6 bg-[#7A1528]" />
        <span className="text-xs uppercase tracking-[0.2em] font-mono text-[#7A1528] font-bold">
          {tag}
        </span>
      </div>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium tracking-tight text-[#1F1C1B]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-[#57534E] text-base sm:text-lg leading-relaxed font-sans">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function Navbar({ onOpenAudit, onOpenBooking }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-xl border-b border-[#E8E1D5]">
      {/* Executive Status Banner */}
      <div className="bg-[#1A080D] text-[#E8DCD9] text-[11px] py-1.5 px-4 sm:px-8 border-b border-[#2C0F17] flex items-center justify-between font-mono">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E54868] shadow-[0_0_8px_#E54868]" />
          <span className="tracking-wider">
            CAPACITY ALLOCATION: <span className="text-[#F5C2CB] font-bold">{AGENCY_DATA.status}</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[#C9B3B8]">
          <span>OPERATOR SLA: &lt; 2H</span>
          <span className="text-[#4E222C]">|</span>
          <span className="text-[#FDF2F4] hover:text-white transition-colors">{AGENCY_DATA.directLine}</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#7A1528] flex items-center justify-center font-mono font-bold text-lg text-[#FAF8F5] shadow-[0_4px_16px_rgba(122,21,40,0.25)] group-hover:scale-105 transition-transform duration-300">
            f
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-serif font-bold tracking-tight text-[#1F1C1B] group-hover:text-[#7A1528] transition-colors">
              frstfame
            </span>
            <span className="text-[10px] tracking-[0.2em] text-[#78716C] uppercase font-mono -mt-1 font-semibold">
              REVENUE ENGINE
            </span>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-wider font-mono text-[#57534E] font-medium">
          <a href="#capabilities" className="hover:text-[#7A1528] transition-colors">Capabilities</a>
          <a href="#standard" className="hover:text-[#7A1528] transition-colors">The Standard</a>
          <a href="#simulator" className="hover:text-[#7A1528] transition-colors">ROI Engine</a>
          <a href="#funnel" className="hover:text-[#7A1528] transition-colors">AI Funnel</a>
          <a href="#pricing" className="hover:text-[#7A1528] transition-colors">Sprints</a>
          <a href="#teardown" className="hover:text-[#7A1528] transition-colors">Audit</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenBooking}
            className="hidden sm:inline-flex items-center px-4 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider text-[#1F1C1B] hover:text-[#7A1528] bg-white border border-[#E8E1D5] shadow-sm hover:shadow transition-all"
          >
            Schedule 15m Call
          </button>

          <button
            onClick={onOpenAudit}
            className="px-5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold text-[#FAF8F5] bg-[#7A1528] hover:bg-[#631020] shadow-[0_4px_16px_rgba(122,21,40,0.25)] transition-all"
          >
            Request 48h Audit &rarr;
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2.5 rounded-lg bg-white border border-[#E8E1D5] text-[#1F1C1B]"
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
        <div className="lg:hidden bg-[#FAF8F5] border-t border-[#E8E1D5] px-4 py-6 space-y-3 font-mono text-xs uppercase text-[#57534E]">
          <a href="#capabilities" onClick={() => setMobileOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-stone-100">Capabilities Spec</a>
          <a href="#standard" onClick={() => setMobileOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-stone-100">Fluff vs Standard</a>
          <a href="#simulator" onClick={() => setMobileOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-stone-100">ROI Calculator</a>
          <a href="#funnel" onClick={() => setMobileOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-stone-100">AI Funnel</a>
          <a href="#pricing" onClick={() => setMobileOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-stone-100">Sprints &amp; Retainers</a>
          <a href="#teardown" onClick={() => setMobileOpen(false)} className="block py-2 px-3 rounded-lg text-[#7A1528] font-bold hover:bg-[#7A1528]/10">Request 48h Teardown</a>
        </div>
      )}
    </header>
  );
}

function HeroSection({ onOpenAudit, onOpenBooking }) {
  return (
    <section className="relative pt-20 pb-28 md:pt-32 md:pb-40 bg-[#FAF8F5] overflow-hidden border-b border-[#E8E1D5]">
      {/* Background Cherry Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[380px] bg-gradient-to-b from-[#7A1528]/8 via-[#7A1528]/2 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(122,21,40,0.03)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <CherryPill text="OPERATOR ALLIANCE // SPEC 2026" glowing={true} />
          <span className="text-xs font-mono text-[#78716C] font-semibold">
            ENTERPRISE REVENUE INFRASTRUCTURE
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-medium tracking-tight text-[#1F1C1B] leading-[1.12] max-w-5xl">
          Digital Infrastructure &amp; Revenue Engineering for SMEs{" "}
          <span className="italic text-[#7A1528] font-serif font-normal">
            Who Value Execution Over Agency Fluff.
          </span>
        </h1>

        <p className="mt-8 text-lg sm:text-xl text-[#57534E] max-w-3xl leading-relaxed font-sans">
          {AGENCY_DATA.subhead}
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <button
            onClick={onOpenAudit}
            className="px-8 py-4 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold text-[#FAF8F5] bg-[#7A1528] hover:bg-[#631020] shadow-[0_10px_25px_rgba(122,21,40,0.22)] transition-all flex items-center justify-center gap-3"
          >
            <span>Claim 48-Hour Digital Teardown</span>
            <span>&rarr;</span>
          </button>

          <a
            href="#simulator"
            className="px-8 py-4 rounded-xl font-mono text-xs uppercase tracking-wider font-medium text-[#1F1C1B] hover:text-[#7A1528] bg-white border border-[#E8E1D5] shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
          >
            <span>Launch Live ROI Calculator &darr;</span>
          </a>
        </div>

        {/* Executive Metric Cards */}
        <div className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-2xl bg-white border border-[#E8E1D5] shadow-sm hover:border-[#7A1528]/30 transition-colors">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#78716C] block font-semibold">Benchmark 01</span>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#1F1C1B] mt-2">3.8x</div>
            <span className="text-xs text-[#57534E] mt-2 block font-sans">Audited 90-Day Enterprise ROAS</span>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E8E1D5] shadow-sm hover:border-[#7A1528]/30 transition-colors">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#78716C] block font-semibold">Benchmark 02</span>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#7A1528] mt-2">&lt; 45s</div>
            <span className="text-xs text-[#57534E] mt-2 block font-sans">Autonomous AI Inbound Triage SLA</span>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E8E1D5] shadow-sm hover:border-[#7A1528]/30 transition-colors">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#78716C] block font-semibold">Benchmark 03</span>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#1F1C1B] mt-2">100%</div>
            <span className="text-xs text-[#57534E] mt-2 block font-sans">Client-Owned IP &amp; Code Sovereignty</span>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E8E1D5] shadow-sm hover:border-[#7A1528]/30 transition-colors">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#78716C] block font-semibold">Benchmark 04</span>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#1F1C1B] mt-2">0 Days</div>
            <span className="text-xs text-[#57534E] mt-2 block font-sans">Lock-In Retainer Penalties</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ComparisonMatrix() {
  return (
    <section id="standard" className="py-28 bg-[#F3EFEA] border-b border-[#E8E1D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="THE OPERATIONAL GAP"
          title="Traditional Agency Retainers vs. The frstfame Standard."
          subtitle="Most enterprises have spent $3,000 to $6,000 every month on agencies that delivered vanity PDF reports once every 30 days. Here is our direct contrast."
        />

        <div className="rounded-3xl border border-[#E8E1D5] bg-white overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 bg-[#FAF8F5] border-b border-[#E8E1D5] text-xs font-mono uppercase tracking-wider py-4 px-6 text-[#78716C] font-semibold">
            <div className="md:col-span-3">Operational Axis</div>
            <div className="md:col-span-4 text-stone-500 flex items-center gap-2">
              <span>✕ Traditional Agency Retainer</span>
            </div>
            <div className="md:col-span-5 text-[#7A1528] flex items-center gap-2">
              <span>✦ The frstfame Standard</span>
            </div>
          </div>

          <div className="divide-y divide-[#E8E1D5]">
            {FLUFF_VS_STANDARD.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 p-6 gap-4 md:gap-6 hover:bg-[#FAF8F5] transition-colors items-start"
              >
                <div className="md:col-span-3">
                  <span className="font-mono text-[10px] text-[#78716C] uppercase tracking-widest block mb-1 font-semibold">
                    PROTOCOL 0{idx + 1}
                  </span>
                  <span className="font-serif font-bold text-[#1F1C1B] text-base">
                    {row.category}
                  </span>
                </div>

                <div className="md:col-span-4 text-sm text-[#57534E] leading-relaxed">
                  {row.fluff}
                </div>

                <div className="md:col-span-5 text-sm text-[#1F1C1B] font-medium leading-relaxed bg-[#7A1528]/[0.04] p-4 rounded-xl border border-[#7A1528]/15">
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
    <section id="capabilities" className="py-28 bg-[#FAF8F5] border-b border-[#E8E1D5]">
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
                      ? "bg-white border-[#7A1528] text-[#1F1C1B] shadow-[0_4px_16px_rgba(122,21,40,0.08)] translate-x-1"
                      : "bg-[#F3EFEA]/60 border-[#E8E1D5] text-[#57534E] hover:bg-white hover:text-[#1F1C1B]"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-stone-200 text-stone-700 font-semibold">
                        {cap.code}
                      </span>
                      <span className="font-mono text-[11px] text-[#78716C] uppercase tracking-wide">
                        {cap.category}
                      </span>
                    </div>
                    <div className="text-base font-serif font-bold text-[#1F1C1B] mt-1.5">
                      {cap.name}
                    </div>
                  </div>

                  <span className="text-xs font-mono uppercase text-[#7A1528] font-bold">
                    {active ? "ACTIVE" : "INSPECT"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Spec Card */}
          <div className="lg:col-span-7 rounded-2xl bg-white border border-[#E8E1D5] p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E8E1D5]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#7A1528]" />
                <span className="font-mono text-xs uppercase tracking-wider text-[#57534E] font-semibold">
                  {current.code} // Granular Spec
                </span>
              </div>
              <CherryPill text={current.benchmark} glowing={true} />
            </div>

            <div className="mt-6">
              <h3 className="text-2xl font-serif font-bold text-[#1F1C1B]">
                {current.name}
              </h3>
              <p className="mt-3 text-[#57534E] text-sm leading-relaxed">
                {current.goal}
              </p>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E1D5]">
              <span className="font-mono text-[10px] uppercase text-[#78716C] block mb-2 tracking-wider font-semibold">
                Operational Tech Stack &amp; Gateway:
              </span>
              <div className="flex flex-wrap gap-2">
                {current.stack.map((item, i) => (
                  <span
                    key={i}
                    className="font-mono text-xs bg-white text-[#1F1C1B] border border-[#E8E1D5] px-3 py-1 rounded-md font-medium"
                  >
                    #{item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <span className="font-mono text-xs uppercase tracking-wider text-[#1F1C1B] block mb-3 font-bold">
                Tangible System Deliverables
              </span>
              <ul className="space-y-3">
                {current.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[#57534E]">
                    <span className="w-4 h-4 rounded-full bg-[#7A1528]/10 border border-[#7A1528]/30 flex items-center justify-center font-mono text-[10px] text-[#7A1528] shrink-0 mt-0.5 font-bold">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E8E1D5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[10px] uppercase text-[#78716C] block font-semibold">SLA Commitment</span>
                <span className="font-mono text-xs font-bold text-[#1F1C1B]">{current.turnaround}</span>
              </div>

              <button
                onClick={onOpenAudit}
                className="px-6 py-3 rounded-lg font-mono text-xs uppercase tracking-wider font-semibold text-[#FAF8F5] bg-[#7A1528] hover:bg-[#631020] transition-all"
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
    <section id="simulator" className="py-28 bg-[#F3EFEA] border-b border-[#E8E1D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="MATHEMATICAL UNIT ECONOMICS"
          title="Interactive Enterprise Growth &amp; ROI Simulator."
          subtitle="Calibrate your actual operational parameters below to model pipeline revenue potential, eliminated ad spend waste, and weekly hours saved through automated triage."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-6 rounded-2xl bg-white border border-[#E8E1D5] p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E1D5]">
              <span className="font-mono text-xs uppercase tracking-wider text-[#1F1C1B] font-bold">
                Input Metrics
              </span>
              <CherryPill text="USD ENGINE" />
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label className="text-xs uppercase font-mono text-[#57534E] font-semibold">
                  Monthly Ad Spend (Google &amp; Meta)
                </label>
                <span className="font-mono text-[#7A1528] font-bold text-lg">
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
                className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#7A1528]"
              />
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label className="text-xs uppercase font-mono text-[#57534E] font-semibold">
                  Average Deal / Contract Value
                </label>
                <span className="font-mono text-[#1F1C1B] font-bold text-lg">
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
                className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#7A1528]"
              />
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label className="text-xs uppercase font-mono text-[#57534E] font-semibold">
                  Current Monthly Visitors
                </label>
                <span className="font-mono text-[#1F1C1B] font-bold text-lg">
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
                className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#7A1528]"
              />
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label className="text-xs uppercase font-mono text-[#57534E] font-semibold">
                  Lead Conversion Rate
                </label>
                <span className="font-mono text-[#7A1528] font-bold text-lg">
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
                className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#7A1528]"
              />
            </div>
          </div>

          <div className="lg:col-span-6 rounded-2xl bg-[#1A080D] border border-[#2C0F17] p-8 flex flex-col justify-between text-[#FAF8F5] shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#2C0F17] mb-6">
                <span className="text-xs font-mono uppercase tracking-wider text-[#F5C2CB] font-semibold">
                  90-Day Conservative Forecast
                </span>
                <span className="text-xs font-mono bg-[#7A1528] text-white px-2.5 py-1 rounded-full font-bold">
                  ROAS: {metrics.roas}x
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-[#260C14] border border-[#3E1420]">
                  <span className="font-mono text-[10px] text-[#C9B3B8] uppercase tracking-wider block font-semibold">
                    Qualified Inquiries
                  </span>
                  <div className="text-3xl font-serif font-bold text-white mt-1">
                    {metrics.leads}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#260C14] border border-[#3E1420]">
                  <span className="font-mono text-[10px] text-[#C9B3B8] uppercase tracking-wider block font-semibold">
                    Closed Deals (~24%)
                  </span>
                  <div className="text-3xl font-serif font-bold text-[#F5C2CB] mt-1">
                    {metrics.closedDeals}
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#260C14] border border-[#3E1420] space-y-3 font-mono text-xs mb-6">
                <div className="flex justify-between items-center pb-2 border-b border-[#3E1420]">
                  <span className="text-[#C9B3B8]">Projected Pipeline Lift:</span>
                  <span className="font-bold text-base text-[#F5C2CB]">
                    +${metrics.projectedLift.toLocaleString()} / mo
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-[#3E1420]">
                  <span className="text-[#C9B3B8]">Prevented Ad Bleed:</span>
                  <span className="text-white font-medium">
                    ~${metrics.preventedWaste.toLocaleString()} / mo
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#C9B3B8]">Executive Hours Saved:</span>
                  <span className="text-[#F5C2CB] font-bold">
                    ~{metrics.hoursSaved} Hours / week
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenAudit}
              className="w-full py-4 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold text-[#1A080D] bg-[#FAF8F5] hover:bg-white transition-all flex items-center justify-center gap-2 shadow"
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
    <section id="funnel" className="py-28 bg-[#FAF8F5] border-b border-[#E8E1D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="AUTONOMOUS REVENUE SYSTEMS"
          title="24/7 Enterprise Inbound Funnel Simulator."
          subtitle="Watch our unified performance marketing and conversational AI stack capture, qualify, and book enterprise prospects while your executive team is off the clock."
        />

        <div className="rounded-3xl border border-[#E8E1D5] bg-white p-6 sm:p-10 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E8E1D5]">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#7A1528] animate-ping" />
              <span className="font-mono text-xs uppercase tracking-wider text-[#57534E] font-semibold">
                STATE: {simulating ? "SIMULATION EXECUTING..." : "SYSTEM IDLE // READY"}
              </span>
            </div>

            <button
              onClick={handleRunSimulation}
              disabled={simulating}
              className={`px-5 py-2.5 rounded-lg font-mono text-xs uppercase tracking-wider font-semibold transition-all ${
                simulating
                  ? "bg-stone-200 text-stone-500 cursor-not-allowed"
                  : "bg-[#7A1528] text-white hover:bg-[#631020] shadow-[0_4px_16px_rgba(122,21,40,0.2)]"
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
                      ? "bg-[#FAF8F5] border-[#7A1528] shadow-[0_4px_16px_rgba(122,21,40,0.08)]"
                      : "bg-white border-[#E8E1D5] hover:border-stone-400"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-[#7A1528]">
                      STEP {s.num}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-[#78716C] font-semibold">
                      {s.tag}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-[#1F1C1B] text-sm">
                    {s.title}
                  </h4>
                  <p className="text-xs text-[#57534E] mt-2 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-5 rounded-xl bg-[#1A080D] border border-[#2C0F17] font-mono text-xs text-[#E8DCD9]">
            <div className="flex items-center justify-between pb-3 border-b border-[#2C0F17] mb-3 text-[11px] text-[#C9B3B8]">
              <span>REAL-TIME TELEMETRY: STEP {steps[activeStep].num}</span>
              <span className="text-[#F5C2CB] font-bold">LATENCY: 38ms</span>
            </div>
            <p className="text-[#F5C2CB] font-medium">&gt; {steps[activeStep].status}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingSection({ onOpenBooking, onOpenAudit }) {
  return (
    <section id="pricing" className="py-28 bg-[#F3EFEA] border-b border-[#E8E1D5]">
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
                  ? "bg-white border-[#7A1528] shadow-[0_12px_32px_rgba(122,21,40,0.12)] relative -translate-y-1"
                  : "bg-white border-[#E8E1D5] hover:border-stone-400"
              }`}
            >
              <div>
                {plan.popular && (
                  <div className="mb-4">
                    <CherryPill text="MOST REQUESTED ENGAGEMENT" glowing={true} />
                  </div>
                )}

                <span className="font-mono text-xs uppercase tracking-wider text-[#78716C] block font-semibold">
                  {plan.badge}
                </span>

                <h3 className="text-2xl font-serif font-bold text-[#1F1C1B] mt-2">
                  {plan.name}
                </h3>

                <p className="text-xs text-[#57534E] mt-2 leading-relaxed">
                  {plan.desc}
                </p>

                <div className="mt-8 pt-6 border-t border-[#E8E1D5]">
                  <div className="text-4xl font-serif font-bold text-[#1F1C1B]">
                    {plan.price}
                  </div>
                  <div className="text-xs text-[#78716C] mt-1 font-mono font-semibold">
                    {plan.cadence}
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#78716C] block font-bold">
                    Deliverables Spec Sheet:
                  </span>
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs text-[#57534E]">
                      <span className="text-[#7A1528] shrink-0 mt-0.5 font-bold">✦</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E8E1D5]">
                <button
                  onClick={plan.popular ? onOpenAudit : onOpenBooking}
                  className={`w-full py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold transition-all ${
                    plan.popular
                      ? "bg-[#7A1528] text-[#FAF8F5] hover:bg-[#631020] shadow-[0_4px_16px_rgba(122,21,40,0.25)]"
                      : "bg-[#FAF8F5] text-[#1F1C1B] hover:bg-white border border-[#E8E1D5]"
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
    <section id="teardown" className="py-28 bg-[#FAF8F5] border-b border-[#E8E1D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="AUDITED MEMORANDUM"
          title="Claim Your 48-Hour Enterprise Teardown."
          subtitle="Submit your company information below. Our senior operators analyze ad waste, conversion friction, and organic visibility gaps before preparing a private executive action plan."
        />

        <div className="rounded-3xl border border-[#E8E1D5] bg-white p-8 sm:p-12 max-w-4xl mx-auto shadow-sm">
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 rounded-full bg-[#7A1528]/10 border border-[#7A1528]/30 flex items-center justify-center font-mono text-xl text-[#7A1528] mx-auto mb-4 font-bold">
                ✓
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#1F1C1B]">
                Teardown Audit Commissioned.
              </h3>
              <p className="mt-3 text-sm text-[#57534E] max-w-md mx-auto">
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
                className="mt-6 text-xs font-mono uppercase text-[#7A1528] hover:underline underline-offset-4 font-bold"
              >
                Submit another audit request &rarr;
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs uppercase font-mono text-[#57534E] block mb-2 font-semibold">
                    Company / Trade Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Apex Industrial Solutions"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E1D5] focus:border-[#7A1528] text-[#1F1C1B] font-mono text-xs outline-none transition-colors placeholder:text-stone-400"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-mono text-[#57534E] block mb-2 font-semibold">
                    Direct Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="founder@apexindustrial.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E1D5] focus:border-[#7A1528] text-[#1F1C1B] font-mono text-xs outline-none transition-colors placeholder:text-stone-400"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-mono text-[#57534E] block mb-2 font-semibold">
                    Website URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://apexindustrial.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E1D5] focus:border-[#7A1528] text-[#1F1C1B] font-mono text-xs outline-none transition-colors placeholder:text-stone-400"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-mono text-[#57534E] block mb-2 font-semibold">
                    Direct Phone / Mobile
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 019-2834"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E1D5] focus:border-[#7A1528] text-[#1F1C1B] font-mono text-xs outline-none transition-colors placeholder:text-stone-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs uppercase font-mono text-[#57534E] block mb-2 font-semibold">
                    Estimated Marketing Budget
                  </label>
                  <select
                    value={spend}
                    onChange={(e) => setSpend(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E1D5] focus:border-[#7A1528] text-[#1F1C1B] font-mono text-xs outline-none transition-colors"
                  >
                    <option value="Under $1,500 / mo">Under $1,500 / mo</option>
                    <option value="$1,500 - $3,500 / mo">$1,500 - $3,500 / mo</option>
                    <option value="$3,500 - $7,500 / mo">$3,500 - $7,500 / mo</option>
                    <option value="$7,500+ / mo">$7,500+ / mo</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs uppercase font-mono text-[#57534E] block mb-2 font-semibold">
                    Primary Operational Bottleneck
                  </label>
                  <select
                    value={bottleneck}
                    onChange={(e) => setBottleneck(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E1D5] focus:border-[#7A1528] text-[#1F1C1B] font-mono text-xs outline-none transition-colors"
                  >
                    <option value="ppc_waste">PPC &amp; Paid Media Spend Leakage</option>
                    <option value="seo_invisible">Poor Google Local 3-Pack Authority</option>
                    <option value="slow_site">High Bounce Rate / Low Conversion</option>
                    <option value="slow_leads">Slow Inbound Lead Follow-Up SLA</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#7A1528]/[0.05] border border-[#7A1528]/20 font-mono text-xs">
                <span className="text-[#7A1528] font-bold uppercase block mb-1">
                  [ Diagnostic Notice: {bottleneckNotes[bottleneck].tag} ]
                </span>
                <span className="text-[#57534E]">
                  {bottleneckNotes[bottleneck].note}
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-4 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold transition-all ${
                  submitting
                    ? "bg-stone-300 text-stone-600 cursor-not-allowed"
                    : "bg-[#7A1528] text-[#FAF8F5] hover:bg-[#631020] shadow-[0_4px_20px_rgba(122,21,40,0.25)]"
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
    <section id="faq" className="py-28 bg-[#F3EFEA] border-b border-[#E8E1D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="EXECUTIVE CLARITY"
          title="Direct Inquiries for Enterprise Leaders."
          subtitle="Candid answers regarding intellectual property, account custody, tooling investments, and operational cadence."
        />

        <div className="rounded-3xl border border-[#E8E1D5] bg-white divide-y divide-[#E8E1D5] overflow-hidden shadow-sm">
          {FAQS.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={i} className="p-6 sm:p-8">
                <button
                  onClick={() => setOpenIdx(isOpen ? -1 : i)}
                  className="w-full text-left flex items-center justify-between gap-4 group"
                >
                  <span className="font-serif font-bold text-lg text-[#1F1C1B] group-hover:text-[#7A1528] transition-colors">
                    {faq.question}
                  </span>
                  <span className="font-mono text-sm text-[#78716C] font-bold">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="mt-4 text-sm text-[#57534E] leading-relaxed font-sans">
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A080D]/70 backdrop-blur-md">
      <div className="bg-white border border-[#E8E1D5] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-[#57534E] hover:text-[#1F1C1B] transition-colors"
        >
          ✕
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7A1528]" />
          <span className="font-mono text-xs uppercase text-[#7A1528] font-bold">
            15-Minute Operator Strategy Slot
          </span>
        </div>

        <h3 className="text-2xl font-serif font-bold text-[#1F1C1B]">
          Schedule Growth Briefing
        </h3>

        {confirmed ? (
          <div className="mt-6 p-6 rounded-2xl bg-[#7A1528]/[0.05] border border-[#7A1528]/20 text-center">
            <div className="w-12 h-12 rounded-full bg-[#7A1528] text-white font-mono font-bold text-xl flex items-center justify-center mx-auto mb-3">
              ✓
            </div>
            <h4 className="font-serif font-bold text-lg text-[#1F1C1B]">
              Briefing Confirmed.
            </h4>
            <p className="text-xs text-[#57534E] mt-2">
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
              className="mt-6 px-6 py-2.5 rounded-lg bg-[#7A1528] text-[#FAF8F5] font-mono text-xs uppercase font-semibold hover:bg-[#631020]"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleBooking} className="mt-6 space-y-4">
            <div>
              <label className="font-mono text-[11px] uppercase text-[#57534E] block mb-2 font-semibold">
                1. Select Preferred Day
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {days.map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setSelectedDay(d)}
                    className={`py-2 rounded-lg text-center font-mono text-[11px] uppercase font-semibold border transition-all ${
                      selectedDay === d
                        ? "bg-[#7A1528] text-white border-[#7A1528]"
                        : "bg-[#FAF8F5] border-[#E8E1D5] text-[#57534E] hover:border-stone-400"
                    }`}
                  >
                    {d.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-mono text-[11px] uppercase text-[#57534E] block mb-2 font-semibold">
                2. Select Time Window (EST)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {times.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`py-2 rounded-lg text-center font-mono text-xs border font-semibold transition-all ${
                      selectedTime === t
                        ? "bg-[#7A1528] text-white border-[#7A1528]"
                        : "bg-[#FAF8F5] border-[#E8E1D5] text-[#57534E] hover:border-stone-400"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-mono text-[11px] uppercase text-[#57534E] block mb-1 font-semibold">
                Your Name &amp; Company *
              </label>
              <input
                type="text"
                required
                placeholder="Marcus Vance, Apex HVAC"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E1D5] text-[#1F1C1B] font-mono text-xs outline-none focus:border-[#7A1528]"
              />
            </div>

            <div>
              <label className="font-mono text-[11px] uppercase text-[#57534E] block mb-1 font-semibold">
                Direct Work Email *
              </label>
              <input
                type="email"
                required
                placeholder="marcus@apexhvac.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E1D5] text-[#1F1C1B] font-mono text-xs outline-none focus:border-[#7A1528]"
              />
            </div>

            <div>
              <label className="font-mono text-[11px] uppercase text-[#57534E] block mb-1 font-semibold">
                Mobile Number (For Calendar SMS)
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 019-2834"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E1D5] text-[#1F1C1B] font-mono text-xs outline-none focus:border-[#7A1528]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full mt-4 py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold transition-all ${
                submitting
                  ? "bg-stone-300 text-stone-600 cursor-not-allowed"
                  : "bg-[#7A1528] text-white hover:bg-[#631020] shadow-[0_4px_16px_rgba(122,21,40,0.25)]"
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
    <footer className="bg-[#1A080D] text-[#FAF8F5] border-t border-[#2C0F17] pt-20 pb-12 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-16 border-b border-[#2C0F17]">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#7A1528] border border-[#A3223D] flex items-center justify-center font-bold text-white text-sm">
                f
              </div>
              <span className="text-xl font-serif font-bold tracking-tight text-white">
                frstfame
              </span>
            </div>
            <p className="text-xs text-[#C9B3B8] leading-relaxed font-sans max-w-sm">
              {AGENCY_DATA.tagline} Direct operator execution for commercial contractors, specialized clinics, and scalable B2B.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="w-2 h-2 rounded-full bg-[#E54868] shadow-[0_0_6px_#E54868]" />
              <span className="text-[11px] text-[#F5C2CB] font-medium">
                {AGENCY_DATA.status}
              </span>
            </div>
          </div>

          <div className="md:col-span-3 space-y-2.5 text-xs text-[#C9B3B8]">
            <span className="font-semibold text-white uppercase tracking-wider block mb-3 font-mono">
              Directory
            </span>
            <a href="#capabilities" className="block hover:text-white transition-colors">&gt; Capabilities Spec</a>
            <a href="#standard" className="block hover:text-white transition-colors">&gt; The Standard</a>
            <a href="#simulator" className="block hover:text-white transition-colors">&gt; ROI Simulator</a>
            <a href="#funnel" className="block hover:text-white transition-colors">&gt; AI Inbound Funnel</a>
            <a href="#pricing" className="block hover:text-white transition-colors">&gt; Sprint Pricing</a>
          </div>

          <div className="md:col-span-4 space-y-3 text-xs text-[#C9B3B8]">
            <span className="font-semibold text-white uppercase tracking-wider block mb-3 font-mono">
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
                className="px-4 py-2.5 rounded-lg bg-[#7A1528] text-white font-semibold uppercase text-[11px] hover:bg-[#631020] transition-colors border border-[#A3223D]"
              >
                Claim 48h Digital Teardown &rarr;
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#A68F94] gap-4">
          <div>
            &copy; {new Date().getFullYear()} frstfame Operations. Client IP, ad accounts, and code repositories remain 100% client property.
          </div>
          <div className="flex items-center gap-4 text-[#C9B3B8]">
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
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F1C1B] font-sans selection:bg-[#7A1528] selection:text-[#FAF8F5] antialiased">
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