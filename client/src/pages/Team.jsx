import React from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import { SquareArrowOutUpRight } from 'lucide-react';

export default function Team() {
  const teamMembers = [
    { name: 'Abdullah Alhalawani', role: 'Product Manager', fallback: 'AA', github: 'vAbdullh' },
    { name: 'Meshal Alqahtani', role: 'Backend Developer', fallback: 'MA', github: 'Meshal-Algahtani' },
    { name: 'Rayan Alshehri', role: 'Frontend Developer', fallback: 'RA', github: 'RayanNight' },
  ];

  return (
    <div className="max-w-6xl mx-auto py-2">
      <div className="mb-8 flex items-center gap-4">
        <div className="w-4 h-4 bg-foreground" />
        <span className="font-mono text-xs uppercase tracking-[0.5em]" data-aos="fade-up">Collective / 003</span>
      </div>

      <h1 className="text-[5vw] font-serif-display font-black uppercase tracking-tighter leading-none mb-16" data-aos="fade-up">
        The<br />
        <span className="italic underline underline-offset-8">Collective.</span>
      </h1>

      <div className="grid gap-0 lg:grid-cols-3 border-2 border-foreground" data-aos="fade-up">
        {teamMembers.map((member, idx) => (
          <div key={idx} className="aspect-square group border-foreground border-r-2 last:border-r-0 border-b-2 md:border-b-0 flex flex-col transition-none hover:bg-foreground hover:text-background">
            <div className="aspect-square overflow-hidden border-b-2 border-foreground">
              <Avatar.Root className="h-full w-full select-none">
                <Avatar.Image
                  className="h-full w-full object-cover aspect-square grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:scale-110"
                  src={member.github ? `https://github.com/${member.github}.png` : undefined}
                  alt={member.name}
                />
                <Avatar.Fallback
                  className="flex h-full w-full items-center justify-center bg-muted text-4xl font-serif-display font-bold group-hover:text-background"
                  delayMs={600}
                >
                  {member.fallback}
                </Avatar.Fallback>
              </Avatar.Root>
            </div>

            <div className="p-8 flex flex-col h-full">
              <p className="text-xl font-serif-display font-black uppercase tracking-tight mb-1">{member.name}</p>
              <p className="font-serif-body text-base opacity-60 mb-6">{member.role}</p>

              <div className="mt-auto pt-6 border-t border-foreground/20 group-hover:border-background/20">
                <a
                  href={`https://github.com/${member.github}`}
                  target="_blank"
                  className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-widest hover:italic transition-none"
                >
                  GITHUB: @{member.github}
                  <SquareArrowOutUpRight size={14} strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-32 p-12 border-4 border-foreground text-center texture-grid" data-aos="fade-up">
        <p className="text-xl font-serif-display italic leading-tight max-w-xl mx-auto">
          "Each member of our collective brings a unique perspective to the architecture of financial clarity."
        </p>
      </div>
    </div>
  );
}

