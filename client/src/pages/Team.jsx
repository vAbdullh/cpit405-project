import React from 'react';
import * as Avatar from '@radix-ui/react-avatar';

import { SquareArrowOutUpRight } from 'lucide-react';
export default function Team() {
  const teamMembers = [
    { name: 'Abdullah Alhalawani', role: 'Product Manager', fallback: 'AA', github: 'vAbdullh' },
    { name: 'Meshal Alqahtani', role: 'Backend Developer', fallback: 'MA', github: 'Meshal-Alqahtani' },
    { name: 'Rayan Alshehri', role: 'Frontend Developer', fallback: 'RA', github: 'RayanNight' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Our Team</h1>
      <p className="text-muted-foreground mb-8">
        Meet the people behind this awesome application. (This page uses Radix UI Avatar primitive).
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member, idx) => (
          <div key={idx} className="flex flex-col items-center justify-center space-y-4 p-6 bg-card border rounded-lg shadow-sm">
            <Avatar.Root className="flex h-16 w-16 select-none items-center justify-center overflow-hidden rounded-full align-middle bg-secondary">
              <Avatar.Image
                className="h-full w-full rounded-[inherit] object-cover"
                src={member.github ? `https://github.com/${member.github}.png` : undefined}
                alt={member.name}
              />
              <Avatar.Fallback
                className="text-primary font-medium flex h-full w-full items-center justify-center bg-muted text-[15px]"
                delayMs={600}
              >
                {member.fallback}
              </Avatar.Fallback>
            </Avatar.Root>
            <div className="text-center">
              <p className="text-lg font-semibold leading-none">{member.name}</p>
              <p className="text-sm text-muted-foreground mt-1">{member.role}</p>
              <a
                href={`https://github.com/${member.github}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                @{member.github}
                <SquareArrowOutUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
