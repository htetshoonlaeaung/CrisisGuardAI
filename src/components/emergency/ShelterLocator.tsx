import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Phone, Users, Shield, CheckCircle, Search, Radio } from 'lucide-react';
import { EmergencyShelter, CrisisDomain } from '../../types';
import { api } from '../../services/api';

export const ShelterLocator: React.FC = () => {
  const [shelters, setShelters] = useState<EmergencyShelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [disasterFilter, setDisasterFilter] = useState<string>('all');
  const [radiusKm, setRadiusKm] = useState<number>(30);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number }>({
    lat: 16.8661,
    lon: 96.1951
  });
  const [locationStatus, setLocationStatus] = useState<string>('Default: Yangon Metro (Downtown)');

  useEffect(() => {
    loadShelters();
  }, [disasterFilter, radiusKm, userLocation]);

  const loadShelters = async () => {
    setLoading(true);
    try {
      const data = await api.getNearbyShelters(
        userLocation.lat,
        userLocation.lon,
        radiusKm,
        disasterFilter === 'all' ? undefined : disasterFilter
      );
      setShelters(data.shelters);
    } catch (err) {
      console.error('Failed to load shelters:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDetectLocation = () => {
    if ('geolocation' in navigator) {
      setLocationStatus('Acquiring GPS coordinates...');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude
          });
          setLocationStatus(`GPS Locked: (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
        },
        (err) => {
          setLocationStatus('GPS access denied. Using standard metropolitan reference.');
        },
        { timeout: 8000 }
      );
    }
  };

  return (
    <div id="shelter-locator-view" className="space-y-6">
      {/* Search and Filter Card */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/95 p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Emergency Shelter &amp; Safe Haven Locator</h2>
              <p className="text-xs text-neutral-400">Proximity-sorted evacuation complexes with real-time occupancy</p>
            </div>
          </div>

          <button
            id="detect-gps-btn"
            onClick={handleDetectLocation}
            className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold flex items-center gap-2 transition border border-neutral-700"
          >
            <Navigation className="w-4 h-4 text-emerald-400" />
            Detect Live GPS Location
          </button>
        </div>

        <div className="text-xs font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 px-3 py-1.5 rounded-lg mb-5 flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
          <span>Status: {locationStatus}</span>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-neutral-400 mb-1.5 uppercase">Emergency Specialization</label>
            <select
              id="shelter-domain-filter"
              value={disasterFilter}
              onChange={(e) => setDisasterFilter(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-semibold text-neutral-200 focus:outline-none focus:border-red-500"
            >
              <option value="all">All Safe Havens &amp; Havens</option>
              <option value="medical">Medical &amp; Trauma Shelters</option>
              <option value="natural_disaster">Flood &amp; Surge High-Ground</option>
              <option value="fire_hazard">Fire &amp; Hazmat Assembly Centers</option>
              <option value="road_accident">Transit &amp; Highway Relief Points</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-400 mb-1.5 uppercase">Search Radius: {radiusKm} km</label>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full accent-red-600 cursor-pointer"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={loadShelters}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition"
            >
              <Search className="w-3.5 h-3.5" /> Refresh Proximity
            </button>
          </div>
        </div>
      </div>

      {/* Shelter List */}
      {loading ? (
        <div className="p-8 text-center text-neutral-400 text-sm animate-pulse">
          Calculating Haversine geospatial proximity to open shelters...
        </div>
      ) : shelters.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400 text-sm">
          No open emergency shelters found within {radiusKm} km for this category. Expand search radius.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shelters.map((s) => {
            const occupancyPct = Math.round((s.current_occupancy / s.capacity) * 100);
            return (
              <div
                key={s.id}
                className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-5 flex flex-col justify-between hover:border-neutral-700 transition space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          OPEN &amp; ACTIVE
                        </span>
                        <span className="text-xs font-mono font-bold text-red-400">
                          {s.distance_km} km away
                        </span>
                      </div>
                      <h3 className="text-base font-black text-white mt-1.5">{s.name}</h3>
                      <p className="text-xs text-neutral-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        {s.address}
                      </p>
                    </div>
                  </div>

                  {/* Occupancy Bar */}
                  <div className="mt-4 bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                      <span className="text-neutral-400 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-neutral-500" /> Current Occupancy:
                      </span>
                      <span className={occupancyPct > 80 ? 'text-amber-400' : 'text-emerald-400'}>
                        {s.current_occupancy} / {s.capacity} ({occupancyPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          occupancyPct > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, occupancyPct)}%` }}
                      />
                    </div>
                  </div>

                  {/* Facilities Badges */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {s.facilities.map((fac, idx) => (
                      <span
                        key={idx}
                        className="bg-neutral-800/80 border border-neutral-700/60 text-neutral-300 text-[10px] font-medium px-2 py-0.5 rounded-md"
                      >
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t border-neutral-800/80">
                  <a
                    href={`tel:${s.contact_phone.replace(/\D/g, '')}`}
                    className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    Call: {s.contact_phone}
                  </a>
                  <a
                    href={`https://maps.google.com/?q=${s.latitude},${s.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Directions
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
