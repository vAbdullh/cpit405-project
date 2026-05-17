import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar } from 'lucide-react';
import { getTrip } from '../api/trips';
import TripMembers from '../components/TripMembers';

export default function TripDetails() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrip = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getTrip(tripId);
        setTrip(data.data ?? data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load trip.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [tripId]);

  if (loading) {
    return (
      <div className="text-center py-20 text-muted-foreground">Loading trip...</div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link to="/app/trips" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Trips
        </Link>
        <div className="border border-destructive/50 bg-destructive/10 text-destructive px-4 py-3 text-sm">
          {error}
        </div>
      </div>
    );
  }

  const createdAt = trip?.createdAt
    ? new Date(trip.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/app/trips"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Trips
        </Link>

        <div className="border border-border bg-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{trip.title}</h2>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {trip.city}
                </span>
                {createdAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {createdAt}
                  </span>
                )}
              </div>
              {trip.description && (
                <p className="mt-3 text-sm text-muted-foreground max-w-xl">{trip.description}</p>
              )}
            </div>
            <span className="border border-border px-2 py-1 text-sm font-mono">{trip.baseCurrency}</span>
          </div>
        </div>
      </div>

      {/* Members Panel */}
      <div className="border border-border bg-card p-6">
        <TripMembers trip={trip} />
      </div>
    </div>
  );
}
