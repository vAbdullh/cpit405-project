import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Users, Wallet, ArrowRight } from 'lucide-react';

export default function Home() {
  const features = [
    {
      title: "Shared Expenses",
      description: "Track bills and shared costs with friends in real-time.",
      icon: <Users size={24} strokeWidth={1} />,
    },
    {
      title: "Smart Settlements",
      description: "Optimized suggestions to settle debts with minimum transfers.",
      icon: <Zap size={24} strokeWidth={1} />,
    },
    {
      title: "Secure & Private",
      description: "Your financial data is encrypted and never shared.",
      icon: <ShieldCheck size={24} strokeWidth={1} />,
    },
    {
      title: "Expense History",
      description: "Keep a clear record of all group spending.",
      icon: <Wallet size={24} strokeWidth={1} />,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-24 md:py-32 border-b-8 border-foreground">
        <div className="max-w-6xl mx-auto" data-aos="fade-up">
          <div className="mb-8 flex items-center gap-4">
            <div className="w-4 h-4 bg-foreground" />
            <span className="font-mono text-xs uppercase tracking-[0.5em]">System v1.0 / 2026</span>
          </div>
          <h1 className="text-[5vw] md:text-[6.5rem] font-serif-display font-black uppercase tracking-tighter leading-[0.85] mb-12">
            Track.<br />
            Settle.<br />
            <span className="italic">Split.</span>
          </h1>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
            <p className="text-xl md:text-2xl font-serif-body leading-tight max-w-2xl">
              A minimalist framework for collective financial precision. 
              Eliminate ambiguity in shared expenses.
            </p>
            <Link 
              to="/auth" 
              className="bg-foreground text-background px-10 py-5 text-lg font-mono uppercase tracking-widest hover:bg-background hover:text-foreground border-2 border-foreground transition-none flex items-center gap-4 group"
            >
              Initialize <ArrowRight className="group-hover:translate-x-2 transition-transform duration-100" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-16" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-serif-display font-bold uppercase tracking-tight">Features</h2>
            <div className="hidden md:block h-px flex-1 mx-12 bg-foreground/20" />
            <span className="font-mono text-xs uppercase tracking-widest opacity-40">01 — 04</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-2 border-foreground" data-aos="fade-up">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="p-10 border-foreground border-r-2 last:border-r-0 border-b-2 md:border-b-0 group hover:bg-foreground hover:text-background transition-colors duration-100"
              >
                <div className="mb-10 group-hover:rotate-12 transition-transform duration-100">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-serif-display font-bold mb-4">{feature.title}</h3>
                <p className="font-serif-body text-base leading-relaxed opacity-60 group-hover:opacity-100">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inverted Stats Section */}
      <section className="py-32 bg-foreground text-background texture-lines relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            <div data-aos="zoom-in" data-aos-delay="0">
              <div className="text-6xl md:text-7xl font-serif-display font-black mb-2">10k+</div>
              <div className="font-mono text-xs uppercase tracking-[0.4em] opacity-60">Active Users</div>
            </div>
            <div data-aos="zoom-in" data-aos-delay="100">
              <div className="text-6xl md:text-7xl font-serif-display font-black mb-2">$2M</div>
              <div className="font-mono text-xs uppercase tracking-[0.4em] opacity-60">Split Monthly</div>
            </div>
            <div data-aos="zoom-in" data-aos-delay="200">
              <div className="text-6xl md:text-7xl font-serif-display font-black mb-2">99.9%</div>
              <div className="font-mono text-xs uppercase tracking-[0.4em] opacity-60">Precision</div>
            </div>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-serif-display font-black opacity-[0.03] select-none">
          TRUST
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 border-t-8 border-foreground">
        <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
          <div className="inline-block p-4 border-2 border-foreground mb-10">
            <div className="w-10 h-10 bg-foreground" />
          </div>
          <h2 className="text-5xl md:text-6xl font-serif-display font-bold mb-10">Join the Collective.</h2>
          <Link 
            to="/auth" 
            className="text-xl md:text-2xl font-serif-display italic border-b-2 border-foreground hover:border-b-4 transition-all"
          >
            Create your account today &rarr;
          </Link>
          
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-12 font-mono text-[10px] uppercase tracking-[0.5em] opacity-20">
            <div>STARK</div>
            <div>AUSTERE</div>
            <div>REFINED</div>
            <div>ELITE</div>
          </div>
        </div>
      </section>
    </div>
  );
}
