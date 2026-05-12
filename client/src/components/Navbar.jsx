import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import {
  Home,
  Info,
  Users,
  Layoutapp,
  HandCoins,
  LogIn,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

export default function Navbar() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/about', label: 'About', icon: Info },
    { to: '/team', label: 'Team', icon: Users },
  ];

  if (isAuthenticated) {
    navLinks.push({ to: '/app', label: 'App', icon: Layoutapp });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-primary flex items-center gap-2">
          <HandCoins className="w-6 h-6" />
          <span className="hidden sm:inline-block">Split It Right</span>
          <span className="sm:hidden text-lg">SplitIt</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${isActive(link.to) ? 'text-primary' : 'text-muted-foreground'
                }`}
            >
              <link.icon className="w-4 h-4" /> {link.label}
            </Link>
          ))}

          <div className="ml-4 border-l pl-4 border-border flex items-center">
            {isAuthenticated ? (
              <button
                onClick={() => dispatch(logout())}
                className="flex items-center gap-2 text-sm font-medium text-destructive hover:text-destructive/80 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-2 text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                <LogIn className="w-4 h-4" /> Login
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden">
          <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger asChild>
              <button className="p-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                <Menu className="w-6 h-6" />
                <span className="sr-only">Toggle menu</span>
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
              <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-3/4 max-w-sm border-l bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8">
                    <Link
                      to="/"
                      className="text-xl font-bold text-primary flex items-center gap-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <HandCoins className="w-6 h-6" />
                      <span>Split It Right</span>
                    </Link>
                    <Dialog.Close asChild>
                      <button className="p-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                        <X className="w-6 h-6" />
                        <span className="sr-only">Close menu</span>
                      </button>
                    </Dialog.Close>
                  </div>

                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setIsOpen(false)}
                        className={`text-lg font-medium py-2 transition-colors hover:text-primary flex items-center gap-3 ${isActive(link.to) ? 'text-primary' : 'text-muted-foreground'
                          }`}
                      >
                        <link.icon className="w-5 h-5" /> {link.label}
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-auto pt-6 border-t border-border">
                    {isAuthenticated ? (
                      <button
                        onClick={() => {
                          dispatch(logout());
                          setIsOpen(false);
                        }}
                        className="flex w-full items-center gap-3 text-lg font-medium text-destructive hover:text-destructive/80 transition-colors py-2 cursor-pointer"
                      >
                        <LogOut className="w-5 h-5" /> Logout
                      </button>
                    ) : (
                      <Link
                        to="/auth"
                        onClick={() => setIsOpen(false)}
                        className="flex w-full items-center justify-center gap-2 text-lg font-medium bg-primary text-primary-foreground px-4 py-3 rounded-md hover:bg-primary/90 transition-colors"
                      >
                        <LogIn className="w-5 h-5" /> Login
                      </Link>
                    )}
                  </div>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
