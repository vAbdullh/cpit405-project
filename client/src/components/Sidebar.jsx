import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, LayoutDashboard, HandCoins, LogOut, Map, Mail, User } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { Link, useLocation } from 'react-router-dom';

const SIDEBAR_LINKS = [
  {
    label: 'Overview',
    path: '/app',
    icon: LayoutDashboard,
  },
  {
    label: 'Trips',
    path: '/app/trips',
    icon: Map,
  },
  {
    label: 'Invitations',
    path: '/app/invitations',
    icon: Mail,
  },
];

const SidebarContent = ({ className = "" }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  return (
    <div className={`flex flex-col h-full bg-card border-r border-border ${className}`}>
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <HandCoins className="w-8 h-8" />
          <span>Split It Right</span>
        </Link>
      </div>

      <div className="flex-1 px-4 py-2">
        <div className="space-y-1">
          {SIDEBAR_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.path === '/app'
                ? location.pathname === '/app'
                : location.pathname.startsWith(link.path);

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                  ? 'bg-accent/50 text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                <span className="font-medium capitalize">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-border flex flex-col gap-1">
        <Link
          to="/app/account"
          className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
            location.pathname === '/app/account'
              ? 'bg-accent/50 text-accent-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          <User className={`w-5 h-5 ${location.pathname === '/app/account' ? 'text-primary' : ''}`} />
          <span className="font-medium">Account</span>
        </Link>
        <button
          onClick={() => dispatch(logout())}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default function Sidebar({ open, setOpen }) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 lg:hidden" />
          <Dialog.Content className="fixed inset-y-0 left-0 w-72 h-full z-50 lg:hidden focus:outline-none">
            <SidebarContent className="relative">
              <Dialog.Close className="absolute top-4 right-4 p-2 rounded-md text-muted-foreground hover:bg-accent transition-colors focus:outline-none">
                <X className="w-5 h-5" />
                <span className="sr-only">Close</span>
              </Dialog.Close>
            </SidebarContent>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
