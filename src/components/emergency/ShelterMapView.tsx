import React, { useState, useEffect } from 'react';
import { EmergencyShelter, CrisisDomain } from '../../types';
import { api } from '../../services/api';
import { HapticButton } from '../ui/HapticButton';
import { useTheme } from '../../context/ThemeContext';
import { MapPin, Phone, Users, Navigation, CheckCircle2, XCircle, Search } from 'lucide-react';

interface ShelterMapViewProps {
  initialDomain?: CrisisDomain;
}

export const ShelterMapView: React.FC<ShelterMapViewProps> = ({ initialDomain }) => {
  const { isLight } = useTheme();
  const [shelters, setShelters] = useState<EmergencyShelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>(initialDomain || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number }>({
    lat: 16.8661,
    lon: 96.1951,
  });

  const fetchShelters = async () => {
    setLoading(true);
    try {
      const data = await api.getNearbyShelters(
        userCoords.lat,
        userCoords.lon,
        50,
        selectedFilter === 'all' ? undefined : selectedFilter
      );
      setShelters(data.shelters || []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        },
        () => {
          // Default SF
        }
      );
    }
  }, []);

  useEffect(() => {
    fetchShelters();
  }, [selectedFilter, userCoords]);

  const filteredShelters = shelters.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q) ||
      s.facilities.some((f) => f.toLowerCase().includes(q))
    );
  });

  const filters = [
    { id: 'all', label: 'All Shelters' },
    { id: 'medical', label: 'Medical & Trauma' },
    { id: 'natural_disaster', label: 'Flood & Storm' },
    { id: 'fire_hazard', label: 'Fire & Hazmat' },
    { id: 'road_accident', label: 'Transit & Crash' },
  ];

  return (
    <div id="shelter-map-view" className="space-y-5">
      {/* Header & Filter Controls */}
      <div
        className={`rounded-2xl border p-4 md:p-6 shadow-xl backdrop-blur-md space-y-4 ${
          isLight
            ? 'bg-white border-zinc-200 text-zinc-900 shadow-zinc-200/50'
            : 'border-[#2A2A2A] bg-[#111111] text-zinc-100'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className={`w-5 h-5 ${isLight ? 'text-amber-700' : 'text-[#FFAB00]'}`} />
              <h2 className={`text-lg md:text-xl font-extrabold tracking-tight ${isLight ? 'text-zinc-950' : 'text-white'}`}>
                Verified Emergency Shelters &amp; Relief Hubs
              </h2>
            </div>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              Live capacity monitoring &amp; Haversine geo-distance calculation from your coordinates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs font-mono ${
                isLight
                  ? 'bg-zinc-100 border-zinc-300 text-zinc-800'
                  : 'bg-[#1A1A1A] border-[#2A2A2A] text-[#FFAB00]'
              }`}
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-500" />
              <span>{userCoords.lat.toFixed(4)}, {userCoords.lon.toFixed(4)}</span>
            </span>
          </div>
        </div>

        {/* Filter Pills with Haptic Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((f) => {
            const isSel = selectedFilter === f.id;
            return (
              <HapticButton
                key={f.id}
                variant={isSel ? (isLight ? 'primary' : 'amber') : 'secondary'}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border ${
                  isSel
                    ? isLight
                      ? 'bg-zinc-900 text-white font-bold border-zinc-900'
                      : 'font-bold'
                    : isLight
                    ? 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200'
                    : 'text-zinc-400'
                }`}
              >
                {f.label}
              </HapticButton>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search shelters by name, neighborhood, or facilities (e.g. oxygen, trauma, burn center)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full border text-xs md:text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none font-sans ${
              isLight
                ? 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:border-amber-600'
                : 'bg-[#090909] border-[#2A2A2A] text-zinc-200 focus:border-[#FFAB00]'
            }`}
          />
        </div>
      </div>

      {/* Shelter List */}
      {loading ? (
        <div
          className={`p-12 text-center text-xs font-mono rounded-2xl border ${
            isLight
              ? 'border-zinc-200 bg-white text-zinc-500'
              : 'border-[#2A2A2A] bg-[#111111] text-zinc-500'
          }`}
        >
          Scanning geospatial database for nearest verified emergency shelters...
        </div>
      ) : filteredShelters.length === 0 ? (
        <div
          className={`p-12 text-center text-xs font-mono rounded-2xl border ${
            isLight
              ? 'border-zinc-200 bg-white text-zinc-500'
              : 'border-[#2A2A2A] bg-[#111111] text-zinc-500'
          }`}
        >
          No active emergency shelters found matching your current criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredShelters.map((shelter) => {
            const occupancyPercent = Math.round((shelter.current_occupancy / shelter.capacity) * 100);
            const isFull = occupancyPercent >= 95;

            return (
              <div
                key={shelter.id}
                id={`shelter-card-${shelter.id}`}
                className={`rounded-2xl border p-4 md:p-5 shadow-lg flex flex-col justify-between space-y-4 transition-all ${
                  isLight
                    ? 'bg-white border-zinc-200 text-zinc-900 hover:border-amber-500 shadow-zinc-200/50'
                    : 'border-[#2A2A2A] bg-[#111111] hover:border-[#FFAB00]/50'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`font-extrabold text-sm md:text-base leading-snug ${isLight ? 'text-zinc-950' : 'text-zinc-100'}`}>
                          {shelter.name}
                        </h3>
                      </div>
                      <p className={`text-xs font-mono mt-0.5 ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>{shelter.address}</p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {isFull ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-100 text-red-700 border border-red-300">
                          <XCircle className="w-3 h-3" /> FULL
                        </span>
                      ) : (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          isLight
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-[rgba(255,171,0,0.15)] text-[#FFAB00] border border-[rgba(255,171,0,0.35)]'
                        }`}>
                          <CheckCircle2 className="w-3 h-3" /> OPEN
                        </span>
                      )}

                      {shelter.distance_km !== undefined && (
                        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                          isLight
                            ? 'text-amber-900 bg-amber-50 border-amber-200'
                            : 'text-[#FFAB00] bg-[rgba(255,171,0,0.10)] border-[rgba(255,171,0,0.30)]'
                        }`}>
                          {shelter.distance_km} km away
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Capacity Bar */}
                  <div className="space-y-1.5 mt-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className={`flex items-center gap-1 ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                        <Users className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Occupancy Capacity</span>
                      </span>
                      <span className={`font-semibold ${isLight ? 'text-zinc-900' : 'text-zinc-200'}`}>
                        {shelter.current_occupancy} / {shelter.capacity} ({occupancyPercent}%)
                      </span>
                    </div>
                    <div className={`w-full h-2 rounded-full overflow-hidden border ${isLight ? 'bg-zinc-200 border-zinc-300' : 'bg-[#090909] border-[#2A2A2A]'}`}>
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          occupancyPercent > 90
                            ? 'bg-red-500'
                            : occupancyPercent > 70
                            ? 'bg-amber-500'
                            : isLight ? 'bg-amber-600' : 'bg-[#FFAB00]'
                        }`}
                        style={{ width: `${Math.min(occupancyPercent, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Facilities list */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {shelter.facilities.map((fac, i) => (
                      <span
                        key={i}
                        className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                          isLight
                            ? 'bg-zinc-100 text-zinc-700 border-zinc-200'
                            : 'bg-[#1A1A1A] text-zinc-400 border-[#2A2A2A]'
                        }`}
                      >
                        ✓ {fac}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className={`flex items-center gap-2 pt-3 border-t ${isLight ? 'border-zinc-200' : 'border-[#2A2A2A]'}`}>
                  <a
                    href={`tel:${shelter.contact_phone}`}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer hbtn ${
                      isLight
                        ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border-zinc-300'
                        : 'bg-[#1A1A1A] hover:bg-[#2A2A2A] text-zinc-200 border-[#2A2A2A] hover:border-[#FFAB00]'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Call {shelter.contact_phone}</span>
                  </a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${shelter.latitude},${shelter.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className={`py-2 px-3.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer hbtn ${
                      isLight
                        ? 'bg-zinc-900 hover:bg-black text-white'
                        : 'skeuo-btn-amber text-zinc-950 font-bold'
                    }`}
                  >
                    <Navigation className={`w-3.5 h-3.5 ${isLight ? 'fill-white text-white' : 'fill-zinc-950 text-zinc-950'}`} />
                    <span>Route</span>
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
