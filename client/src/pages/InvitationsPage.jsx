import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Check, X } from 'lucide-react';
import { getPendingInvitations, acceptInvitation, rejectInvitation } from '../api/trips';

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

function InvitationCard({ invitation, onAction }) {
  const [loading, setLoading] = useState(null); // 'accept' | 'reject' | null

  const handle = async (action) => {
    setLoading(action);
    try {
      if (action === 'accept') {
        await acceptInvitation(invitation.id);
      } else {
        await rejectInvitation(invitation.id);
      }
      onAction();
    } catch {
      // silently keep the card; parent refetch will reflect actual state
    } finally {
      setLoading(null);
    }
  };

  const isPending = invitation.status === 'PENDING';
  const createdAt = new Date(invitation.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <div className="border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold truncate">
              {invitation.trip?.title ?? `Trip #${invitation.tripId}`}
            </h3>
            <StatusBadge status={invitation.status} />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {invitation.trip?.city && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {invitation.trip.city}
              </span>
            )}
            <span>Invited by <strong>{invitation.inviter?.name ?? 'someone'}</strong></span>
            <span>{createdAt}</span>
          </div>
        </div>

        {isPending && (
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => handle('accept')}
              disabled={loading !== null}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-green-500 text-green-700 bg-green-50 hover:bg-green-100 transition-colors disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              {loading === 'accept' ? 'Accepting...' : 'Accept'}
            </button>
            <button
              onClick={() => handle('reject')}
              disabled={loading !== null}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-red-400 text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              <X className="w-3.5 h-3.5" />
              {loading === 'reject' ? 'Rejecting...' : 'Reject'}
            </button>
          </div>
        )}

        {!isPending && invitation.status === 'ACCEPTED' && (
          <Link
            to={`/app/trips/${invitation.tripId}`}
            className="text-sm text-primary underline underline-offset-2 hover:opacity-70 transition-opacity shrink-0"
          >
            View Trip
          </Link>
        )}
      </div>
    </div>
  );
}

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchInvitations = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getPendingInvitations();
      setInvitations(data.data ?? data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load invitations.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  const pending = invitations.filter((i) => i.status === 'PENDING');
  const resolved = invitations.filter((i) => i.status !== 'PENDING');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Invitations</h2>
        {!loading && (
          <span className="text-sm text-muted-foreground">{pending.length} pending</span>
        )}
      </div>

      {loading && (
        <div className="text-center py-16 text-muted-foreground">Loading invitations...</div>
      )}

      {error && (
        <div className="border border-destructive/50 bg-destructive/10 text-destructive px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && invitations.length === 0 && (
        <div className="text-center py-16 border border-dashed border-border text-muted-foreground">
          No invitations yet.
        </div>
      )}

      {!loading && pending.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Pending</h3>
          {pending.map((inv) => (
            <InvitationCard key={inv.id} invitation={inv} onAction={fetchInvitations} />
          ))}
        </section>
      )}

      {!loading && resolved.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Past</h3>
          {resolved.map((inv) => (
            <InvitationCard key={inv.id} invitation={inv} onAction={fetchInvitations} />
          ))}
        </section>
      )}
    </div>
  );
}
