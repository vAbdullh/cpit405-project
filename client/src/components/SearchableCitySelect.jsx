import React, { useState, useEffect, useRef } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Search, MapPin, Loader2, Check, X } from 'lucide-react';

export default function SearchableCitySelect({ value, onChange, placeholder = 'Search for a city...' }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(value || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const searchTimeoutRef = useRef(null);
  const activeRequestRef = useRef(null);

  // Sync internal search state when the outer value changes
  useEffect(() => {
    if (value !== undefined) {
      setSearch(value);
    }
  }, [value]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  const searchCities = (query) => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    // Cancel previous fetch if still running
    if (activeRequestRef.current) {
      activeRequestRef.current.abort();
    }

    const controller = new AbortController();
    activeRequestRef.current = controller;

    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=10&featuretype=settlement`, {
      signal: controller.signal
    })
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((data) => {
        const rawResults = data || [];
        // Format names to clean "City, Country" instead of redundant administrative hierarchies
        const formatted = rawResults.map((item) => {
          const fullName = item.display_name;
          const parts = fullName.split(',').map((p) => p.trim());
          let cleanName = fullName;
          
          if (parts.length >= 2) {
            const city = parts[0];
            const country = parts[parts.length - 1];
            
            // Remove postal codes or numbers from country/city if any
            const cleanCountry = country.replace(/\d+/g, '').trim();
            const cleanCity = city.replace(/\d+/g, '').trim();
            
            cleanName = `${cleanCity}, ${cleanCountry}`;
          }
          
          // Truncate to make sure it respects DB length limits
          if (cleanName.length > 95) {
            cleanName = cleanName.substring(0, 95) + '...';
          }

          return cleanName;
        });

        // Deduplicate
        const unique = Array.from(new Set(formatted));
        setResults(unique);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Error fetching cities:', err);
          setError('Failed to fetch cities.');
        }
      })
      .finally(() => {
        if (activeRequestRef.current === controller) {
          setLoading(false);
        }
      });
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    
    // Open popover as they type
    if (!open) {
      setOpen(true);
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchCities(val);
    }, 300);
  };

  const handleSelect = (cityName) => {
    onChange(cityName);
    setSearch(cityName);
    setOpen(false);
  };

  const handleClear = () => {
    setSearch('');
    onChange('');
    setResults([]);
    setOpen(false);
  };

  return (
    <div className="relative w-full">
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <div className="relative flex items-center w-full">
            <input
              type="text"
              className="w-full border border-border bg-background pl-9 pr-8 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              value={search}
              onChange={handleInputChange}
              onFocus={() => {
                if (search && search.trim().length >= 2 && results.length === 0) {
                  searchCities(search);
                }
                setOpen(true);
              }}
              placeholder={placeholder}
            />
            <div className="absolute left-3 text-muted-foreground pointer-events-none">
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <MapPin className="w-4 h-4" />
              )}
            </div>
            {search && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 text-muted-foreground hover:text-foreground cursor-pointer"
                title="Clear selection"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className="w-[var(--radix-popover-trigger-width)] bg-card border border-border p-0 z-50 shadow-md animate-in fade-in-50 duration-100"
            align="start"
            sideOffset={4}
            onOpenAutoFocus={(e) => e.preventDefault()} // Let user keep focus on input
          >
            {loading && results.length === 0 && (
              <div className="flex items-center justify-center gap-2 p-4 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin text-foreground" />
                Searching global cities...
              </div>
            )}

            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border-b border-border">
                {error}
              </div>
            )}

            {!loading && results.length === 0 && search.trim().length >= 2 && (
              <div className="p-4 text-sm text-muted-foreground text-center">
                No cities found for "{search}"
              </div>
            )}

            {!loading && search.trim().length < 2 && (
              <div className="p-3 text-xs text-muted-foreground text-center italic">
                Type at least 2 characters to search global cities...
              </div>
            )}

            {results.length > 0 && (
              <div className="max-h-60 overflow-y-auto divide-y divide-border/20">
                {results.map((city) => {
                  const isSelected = city === value;
                  return (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleSelect(city)}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors border-b border-border/20 last:border-b-0 flex items-center justify-between cursor-pointer ${
                        isSelected 
                          ? 'bg-primary text-primary-foreground font-medium' 
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <span className="truncate">{city}</span>
                      {isSelected && <Check className="w-4 h-4 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            )}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
