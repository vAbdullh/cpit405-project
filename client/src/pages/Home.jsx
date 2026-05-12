import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto text-center space-y-8">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
        Welcome to Our App
      </h1>
      <p className="text-xl text-muted-foreground">
        This is a placeholder for the Home page. We've set up React Router, Redux, Tailwind CSS v4, and Radix UI primitives.
      </p>

      {/* Example of a Radix UI Component (Dialog) */}
      <div className="p-8 bg-card rounded-lg border shadow-sm mt-8">
        <h2 className="text-2xl font-bold mb-4">Radix UI Example</h2>
        <p className="text-muted-foreground mb-6">Below is an accessible Dialog (Modal) built with Radix UI.</p>

        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors">
              Open Radix Dialog
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
              <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
                  Welcome to Radix UI
                </Dialog.Title>
                <Dialog.Description className="text-sm text-muted-foreground">
                  This dialog is completely accessible. You can navigate it with your keyboard.
                </Dialog.Description>
              </div>
              <div className="py-4">
                <p>This demonstrates how to integrate Radix UI primitives with Tailwind CSS for styling.</p>
              </div>
              <div className="flex justify-end">
                <Dialog.Close asChild>
                  <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md font-medium hover:bg-secondary/80">
                    Close Dialog
                  </button>
                </Dialog.Close>
              </div>
              <Dialog.Close asChild>
                <button
                  className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
}
