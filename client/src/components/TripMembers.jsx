import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { UserMinus, UserPlus, Mail, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  getMembers,
  removeMember,
  getTripInvitations,
  inviteMember,
} from '../api/trips';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function StatusBadge({ status }) {
  const styles = {
    PENDING: 'border-amber-400 text-amber-600 bg-amber-50',
    ACCEPTED: 'border-green-500 text-green-700 bg-green-50',
    REJECTED: 'border-red-400 text-red-600 bg-red-50',
  };
  return (
    <span className={`text-xs border px-1.5 py-0.5 font-medium ${styles[status] ?? 'border-border text-muted-foreground'}`}>
      {status}
    </span>
  );
}

function RemoveMemberDialog({ member, tripId, onRemoved }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRemove = async () => {
    setLoading(true);
    try {
      await removeMember(tripId, member.userId);
      setOpen(false);
      onRemoved();
    } catch {
      // keep dialog open on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
          title="Remove member"
        >
          <UserMinus className="w-4 h-4" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm bg-card border border-border p-6 focus:outline-none">
          <Dialog.Title className="text-lg font-bold mb-2">Remove Member</Dialog.Title>
          <p className="text-sm text-muted-foreground mb-6">
            Remove <strong>{member.user?.name ?? member.userId}</strong> from this trip?
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleRemove}
              disabled={loading}
              className="flex-1 py-2 bg-destructive text-destructive-foreground font-medium border border-destructive hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Removing...' : 'Remove'}
            </button>
            <Dialog.Close asChild>
              <button className="flex-1 py-2 border border-border text-foreground hover:bg-muted transition-colors">
                Cancel
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function InviteForm({ tripId, onInvited }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setError('Enter a valid email address.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await inviteMember(tripId, trimmed);
      setEmail('');
      setSuccess(`Invitation sent to ${trimmed}.`);
      onInvited();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send invitation.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); setSuccess(''); }}
            placeholder="member@example.com"
            className="w-full border border-border bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground text-sm font-medium border border-primary hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          <UserPlus className="w-4 h-4" />
          {loading ? 'Sending...' : 'Invite'}
        </button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      {success && <p className="text-xs text-green-600">{success}</p>}
    </form>
  );
}

export default function TripMembers({ trip }) {
  const currentUser = useSelector((state) => state.auth.user);
  const isCreator = trip.creatorId === currentUser?.id;

  const [members, setMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingInvites, setLoadingInvites] = useState(true);

  const fetchMembers = useCallback(async () => {
    setLoadingMembers(true);
    try {
      const data = await getMembers(trip.id);
      setMembers(data.data ?? data);
    } catch {
      setMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  }, [trip.id]);

  const fetchInvitations = useCallback(async () => {
    if (!isCreator) return;
    setLoadingInvites(true);
    try {
      const data = await getTripInvitations(trip.id);
      setInvitations(data.data ?? data);
    } catch {
      setInvitations([]);
    } finally {
      setLoadingInvites(false);
    }
  }, [trip.id, isCreator]);

  useEffect(() => {
    fetchMembers();
    fetchInvitations();
  }, [fetchMembers, fetchInvitations]);

  const refresh = () => {
    fetchMembers();
    fetchInvitations();
  };

  return (
    <div className="space-y-6">
      {/* Members List */}
      <section>
        <h3 className="text-base font-semibold mb-3">Members</h3>
        {loadingMembers ? (
          <p className="text-sm text-muted-foreground">Loading members...</p>
        ) : members.length === 0 ? (
          <p className="text-sm text-muted-foreground">No members yet.</p>
        ) : (
          <ul className="divide-y divide-border border border-border">
            {members.map((m) => (
              <li key={m.userId} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{m.user?.name ?? `User ${m.userId}`}</p>
                  <p className="text-xs text-muted-foreground">{m.user?.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs border border-border px-1.5 py-0.5">{m.role}</span>
                  {isCreator && m.userId !== currentUser?.id && (
                    <RemoveMemberDialog member={m} tripId={trip.id} onRemoved={refresh} />
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Invite Section — creator only */}
      {isCreator && (
        <section>
          <h3 className="text-base font-semibold mb-3">Invite Member</h3>
          <InviteForm tripId={trip.id} onInvited={refresh} />
        </section>
      )}

      {/* Pending Invitations — creator only */}
      {isCreator && (
        <section>
          <h3 className="text-base font-semibold mb-3">Invitations</h3>
          {loadingInvites ? (
            <p className="text-sm text-muted-foreground">Loading invitations...</p>
          ) : invitations.length === 0 ? (
            <p className="text-sm text-muted-foreground">No invitations sent yet.</p>
          ) : (
            <ul className="divide-y divide-border border border-border">
              {invitations.map((inv) => (
                <li key={inv.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{inv.inviteeEmail}</p>
                    <p className="text-xs text-muted-foreground">
                      Sent by {inv.inviter?.name ?? 'you'}
                    </p>
                  </div>
                  <StatusBadge status={inv.status} />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
