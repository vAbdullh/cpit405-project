import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { Home, Info, Users, LayoutDashboard, HandCoins, LogIn, LogOut, Menu, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

export default function Layout() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col texture-noise">
      <header className="border-b-4 border-foreground bg-background sticky top-0 z-40">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="text-2xl font-serif-display font-black uppercase tracking-tighter hover:italic transition-all">
            Split It Right
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-xs font-mono uppercase tracking-widest hover:underline underline-offset-4 transition-none">
              Home
            </Link>
            <Link to="/about" className="text-xs font-mono uppercase tracking-widest hover:underline underline-offset-4 transition-none">
              About
            </Link>
            <Link to="/team" className="text-xs font-mono uppercase tracking-widest hover:underline underline-offset-4 transition-none">
              Team
            </Link>

            {/* Protected Route Link */}
            {isAuthenticated && (
              <Link to="/app" className="text-xs font-mono uppercase tracking-widest hover:underline underline-offset-4 transition-none">
                app
              </Link>
            )}

            <div className="ml-4 pl-8 border-l-2 border-foreground">
              {isAuthenticated ? (
                <button
                  onClick={() => dispatch(logout())}
                  className="text-xs font-mono uppercase tracking-widest text-destructive hover:italic transition-none"
                >
                  Logout
                </button>
              ) : (
                <Link to="/auth" className="bg-foreground text-background px-6 py-2 text-xs font-mono uppercase tracking-widest hover:bg-background hover:text-foreground border border-foreground transition-none">
                  Login
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile Navigation Toggle */}
          <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger asChild>
              <button className="md:hidden p-2 text-foreground transition-none" aria-label="Toggle Menu">
                <Menu className="w-8 h-8 stroke-2" />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-[2px] z-50 animate-in fade-in duration-100" />
              <Dialog.Content className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-background border-l-4 border-foreground z-50 p-8 shadow-none flex flex-col animate-in slide-in-from-right duration-100">
                <div className="flex items-center justify-between mb-16">
                  <Dialog.Title className="text-2xl font-serif-display font-black uppercase tracking-tighter">
                    Menu
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button className="p-2 text-foreground transition-none" aria-label="Close Menu">
                      <X className="w-8 h-8 stroke-2" />
                    </button>
                  </Dialog.Close>
                </div>

                <nav className="flex flex-col gap-8">
                  <Link
                    to="/"
                    onClick={() => setIsOpen(false)}
                    className="text-4xl font-serif-display font-bold hover:italic transition-none"
                  >
                    Home
                  </Link>
                  <Link
                    to="/about"
                    onClick={() => setIsOpen(false)}
                    className="text-4xl font-serif-display font-bold hover:italic transition-none"
                  >
                    About
                  </Link>
                  <Link
                    to="/team"
                    onClick={() => setIsOpen(false)}
                    className="text-4xl font-serif-display font-bold hover:italic transition-none"
                  >
                    Team
                  </Link>

                  {isAuthenticated && (
                    <Link
                      to="/app"
                      onClick={() => setIsOpen(false)}
                      className="text-4xl font-serif-display font-bold hover:italic transition-none"
                    >
                      app
                    </Link>
                  )}

                  <div className="mt-8 pt-8 border-t-2 border-foreground">
                    {isAuthenticated ? (
                      <button
                        onClick={() => {
                          dispatch(logout());
                          setIsOpen(false);
                        }}
                        className="w-full text-left text-xl font-mono uppercase tracking-widest text-destructive hover:italic transition-none"
                      >
                        Logout
                      </button>
                    ) : (
                      <Link
                        to="/auth"
                        onClick={() => setIsOpen(false)}
                        className="inline-block bg-foreground text-background px-12 py-4 text-xl font-mono uppercase tracking-widest hover:bg-background hover:text-foreground border-2 border-foreground transition-none text-center"
                      >
                        Login
                      </Link>
                    )}
                  </div>
                </nav>

                <div className="mt-auto pt-8 font-mono text-[10px] uppercase tracking-[0.3em] opacity-40">
                  &copy; {new Date().getFullYear()} Split It Right / Est. 2026
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 lg:py-5">
        <Outlet />
      </main>

      <footer className="border-t-4 border-foreground bg-background py-16 mt-auto">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="text-3xl font-serif-display font-black uppercase tracking-tighter">
            Split It Right
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-60">
            &copy; {new Date().getFullYear()} All Rights Reserved / Split It Right
          </div>
        </div>
      </footer>
    </div>
  );
}
