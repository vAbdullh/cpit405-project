import React from 'react';

export default function About() {
  const TECH_STACK = [
    { label: "CORE", value: "React 19 / Vite" },
    { label: "STATE", value: "Redux Toolkit" },
    { label: "STYLE", value: "Tailwind v4" },
    { label: "LOGIC", value: "Prisma / Express" },
    { label: "VAULT", value: "PostgreSQL" },
    { label: "AUTH", value: "JWT / Bcrypt" }
  ];

  return (
    <div className="max-w-4xl mx-auto flex flex-col py-12">
      <div className="mb-8 flex items-center gap-4">
        <div className="w-4 h-4 bg-foreground" />
        <span className="font-mono text-xs uppercase tracking-[0.5em]" data-aos="fade-up">Folio / 001</span>
      </div>

      <h1 className="text-[5vw] font-serif-display font-black uppercase tracking-tighter leading-none mb-16" data-aos="fade-up">
        About<br />
        the <span className="italic underline underline-offset-8">System.</span>
      </h1>

      <section className="border-t-4 border-foreground py-20">
        <h2 className="font-mono text-xs uppercase tracking-[0.4em] mb-12 opacity-40" data-aos="fade-up">The Premise</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="font-serif-body text-xl leading-relaxed" data-aos="fade-up">
            <span className="float-left text-5xl font-black border-4 border-foreground px-4 py-2 mr-4 mb-2">T</span>
            racking shared expenses during group trips is inherently chaotic. The fragmentation of payments across hotels, logistics, and hospitality leads to a recursive cycle of forgotten debts and social friction.
          </div>
          <div className="font-serif-body text-xl leading-relaxed opacity-60" data-aos="fade-up">
            Ambiguity is the enemy of financial precision. We believe that clarity in collective spending is not just a utility, but a social necessity in the modern age of global mobility.
          </div>
        </div>
      </section>

      <section className="border-t-4 border-foreground py-20 bg-foreground text-background texture-lines px-8" data-aos="fade-up">
        <h2 className="font-mono text-xs uppercase tracking-[0.4em] mb-12 opacity-60">The Resolution</h2>
        <p className="font-serif-display text-2xl md:text-3xl leading-tight italic">
          "A unified framework for seamless synchronization. From invitation to final settlement, every transaction is accounted for with mathematical absolute."
        </p>
      </section>

      <section className="border-t-4 border-foreground py-20">
        <h2 className="font-mono text-xs uppercase tracking-[0.4em] mb-12 opacity-40" data-aos="fade-up">The Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-2 border-foreground">
          {TECH_STACK.map((item, index) => (
            <div key={index} className="p-8 border-foreground border-r-2 border-b-2 last:border-r-0 hover:bg-foreground hover:text-background transition-none" data-aos="fade-up" data-aos-delay={index * 100}>
              <div className="font-mono text-[10px] uppercase tracking-widest mb-4 opacity-40">{item.label}</div>
              <div className="text-xl font-serif-display font-bold uppercase tracking-tight">{item.value}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

