import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MapPin, Plus, Trash2, Users } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { getTrips, createTrip, deleteTrip } from '../api/trips';
import SearchableCitySelect from '../components/SearchableCitySelect';

const CURRENCIES = ['SAR', 'USD', 'EUR', 'GBP'];

function CreateTripDialog({ onCreated }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', city: '', baseCurrency: 'SAR' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.city.trim()) {
      setError('Title and city are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await createTrip(form);
      setForm({ title: '', description: '', city: '', baseCurrency: 'SAR' });
      setOpen(false);
      onCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create trip.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium border border-primary hover:opacity-80 transition-opacity">
          <Plus className="w-4 h-4" />
          New Trip
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-card border border-border p-6 focus:outline-none">
          <Dialog.Title className="text-xl font-bold mb-4">Create New Trip</Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Summer trip to Riyadh"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City *</label>
              <SearchableCitySelect
                value={form.city}
                onChange={(city) => setForm({ ...form, city })}
                placeholder="Search Riyadh, Tokyo, London..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Optional description..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Base Currency</label>
              <select
                className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                value={form.baseCurrency}
                onChange={(e) => setForm({ ...form, baseCurrency: e.target.value })}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 bg-primary text-primary-foreground font-medium border border-primary hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Trip'}
              </button>
              <Dialog.Close asChild>
                <button type="button" className="flex-1 py-2 border border-border text-foreground hover:bg-muted transition-colors">
                  Cancel
                </button>
              </Dialog.Close>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function DeleteTripDialog({ trip, onDeleted }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteTrip(trip.id);
      setOpen(false);
      onDeleted();
    } catch {
      // keep open on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          onClick={(e) => e.preventDefault()}
          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
          title="Delete trip"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm bg-card border border-border p-6 focus:outline-none">
          <Dialog.Title className="text-lg font-bold mb-2">Delete Trip</Dialog.Title>
          <p className="text-sm text-muted-foreground mb-6">
            Are you sure you want to delete <strong>"{trip.title}"</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 py-2 bg-destructive text-destructive-foreground font-medium border border-destructive hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Deleting...' : 'Delete'}
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

export default function TripsPage() {
  const user = useSelector((state) => state.auth.user);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTrips = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getTrips();
      setTrips(data.data ?? data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load trips.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">My Trips</h2>
        <CreateTripDialog onCreated={fetchTrips} />
      </div>

      {loading && (
        <div className="text-center py-16 text-muted-foreground">Loading trips...</div>
      )}

      {error && (
        <div className="border border-destructive/50 bg-destructive/10 text-destructive px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && trips.length === 0 && (
        <div className="text-center py-16 border border-dashed border-border">
          <MapPin className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No trips yet. Create your first trip!</p>
        </div>
      )}

      {!loading && trips.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {trips.map((trip) => {
            const isCreator = trip.creatorId === user?.id;
            return (
              <Link
                key={trip.id}
                to={`/app/trips/${trip.id}`}
                className="group block border border-border bg-card hover:bg-muted transition-colors"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                        {trip.title}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>{trip.city}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-xs border border-border px-1.5 py-0.5 font-mono">
                        {trip.baseCurrency}
                      </span>
                      {isCreator && (
                        <DeleteTripDialog trip={trip} onDeleted={fetchTrips} />
                      )}
                    </div>
                  </div>

                  {trip.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {trip.description}
                    </p>
                  )}

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="w-3.5 h-3.5" />
                    <span>{trip.members?.length ?? 0} member{trip.members?.length !== 1 ? 's' : ''}</span>
                    {isCreator && (
                      <span className="ml-auto border border-border px-1.5 py-0.5">Creator</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
