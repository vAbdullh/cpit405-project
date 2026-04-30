import React from 'react';

export default function About() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">About Us</h1>
      <div className="bg-muted p-6 rounded-lg mt-6 text-muted-foreground">
        <h2 className="text-xl font-semibold text-foreground mb-4">The Problem</h2>
        <p>
          Tracking shared expenses during group trips is confusing. Keeping tabs on who paid for hotels, dinners, and taxis often leads to forgotten debts, awkward conversations, and currency conversion headaches.
        </p>
      </div>

      <div className="bg-muted p-6 rounded-lg mt-6 text-muted-foreground">
        <h2 className="text-xl font-semibold text-foreground mb-4">The Solution</h2>
        <p>
          A web app to seamlessly track and settle group trip expenses. Users can create a trip room, invite friends, and log payments. The app handles live currency conversions and calculates the simplest way to settle all debts at the end of the trip.
        </p>
      </div>
      <div className="bg-muted p-6 rounded-lg mt-6">
        <h2 className="text-xl font-semibold mb-4">Tech Stack Highlights</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li><strong>Vite:</strong> Blazing fast development server and build tool.</li>
          <li><strong>React Router:</strong> Declarative routing for standard and protected pages.</li>
          <li><strong>Redux Toolkit:</strong> Predictable state management with an auth slice.</li>
          <li><strong>Tailwind CSS v4:</strong> Utility-first styling with Shadcn-like CSS variables.</li>
          <li><strong>Radix UI:</strong> Unstyled, accessible component primitives.</li>
          <li><strong>Axios:</strong> Pre-configured with interceptors to automatically handle Auth tokens.</li>
        </ul>
      </div>
    </div>
  );
}
