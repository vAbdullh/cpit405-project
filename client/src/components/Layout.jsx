import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { Home, Info, Users, LayoutDashboard, HandCoins, LogIn, LogOut } from 'lucide-react';

export default function Layout() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-primary flex items-center gap-2">
            <HandCoins className="w-6 h-6" />
            Split It Right
          </Link>

          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary flex items-center gap-2">
              <Home className="w-4 h-4" /> Home
            </Link>
            <Link to="/about" className="text-sm font-medium hover:text-primary flex items-center gap-2">
              <Info className="w-4 h-4" /> About
            </Link>
            <Link to="/team" className="text-sm font-medium hover:text-primary flex items-center gap-2">
              <Users className="w-4 h-4" /> Team
            </Link>

            {/* Protected Route Link */}
            <Link to="/dashboard" className="text-sm font-medium hover:text-primary flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>

            <div className="ml-4 border-l pl-4 border-border">
              {isAuthenticated ? (
                <button
                  onClick={() => dispatch(logout())}
                  className="flex items-center gap-2 text-sm font-medium text-destructive hover:text-destructive/80 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              ) : (
                <Link to="/auth" className="flex items-center gap-2 text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                  <LogIn className="w-4 h-4" /> Login
                </Link>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Outlet renders the matched child route */}
        <Outlet />
      </main>

      <footer className="border-t border-border bg-muted py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Split It Right. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
