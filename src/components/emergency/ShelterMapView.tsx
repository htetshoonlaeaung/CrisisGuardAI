import React, { useState, useEffect } from 'react';
import { EmergencyShelter, CrisisDomain } from '../../types';
import { api } from '../../services/api';
import { HapticButton } from '../ui/HapticButton';
import { useLanguage } from '../../context/LanguageContext';
import { MapPin, Phone, Users, Navigation, CheckCircle2, XCircle, Search } from 'lucide-react';

interface ShelterMapViewProps {
  initialDomain?: CrisisDomain;
}

export const ShelterMapView: React.FC<ShelterMapViewProps> = ({ initialDomain }) => {
  const { t } = useLanguage();
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
    { id: 'all', labelKey: 'shelters.all' },
    { id: 'medical', labelKey: 'shelters.medical' },
    { id: 'natural_disaster', labelKey: 'shelters.natural_disaster' },
    { id: 'fire_hazard', labelKey: 'shelters.fire_hazard' },
    { id: 'road_accident', labelKey: 'shelters.road_accident' },
  ];

  return (
    <div id="shelter-map-view" className="space-y-5 text-slate-900">
      {/* Header & Filter Controls */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-slate-950">
                {t('shelters.title')}
              </h2>
            </div>
            <p className="text-xs mt-0.5 text-slate-600">
              {t('shelters.desc')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs font-mono bg-slate-100 border-slate-200 text-slate-700 font-semibold shadow-2xs">
              <Navigation className="w-3.5 h-3.5 text-emerald-600" />
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
                variant={isSel ? 'blue' : 'secondary'}
                skeuomorphic={false}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isSel
                    ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                {t(f.labelKey)}
              </HapticButton>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('shelters.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-slate-300 bg-white text-xs md:text-sm rounded-xl pl-10 pr-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 font-sans shadow-2xs"
          />
        </div>
      </div>

      {/* Shelter List */}
      {loading ? (
        <div className="p-12 text-center text-xs font-mono rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm">
          {t('shelters.loading')}
        </div>
      ) : filteredShelters.length === 0 ? (
        <div className="p-12 text-center text-xs font-mono rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm">
          {t('shelters.empty')}
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
                className="rounded-2xl border border-slate-200 bg-white hover:border-blue-300 p-4 md:p-5 shadow-sm flex flex-col justify-between space-y-4 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm md:text-base leading-snug text-slate-950">
                          {shelter.name}
                        </h3>
                      </div>
                      <p className="text-xs font-mono mt-0.5 text-slate-600">{shelter.address}</p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {isFull ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-100 text-red-700 border border-red-300">
                          <XCircle className="w-3 h-3" /> {t('shelters.full')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3" /> {t('shelters.open')}
                        </span>
                      )}

                      {shelter.distance_km !== undefined && (
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded border text-blue-900 bg-blue-50 border-blue-200 shadow-2xs">
                          {t('shelters.away', { distance: shelter.distance_km })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Capacity Bar */}
                  <div className="space-y-1.5 mt-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="flex items-center gap-1 text-slate-600">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{t('shelters.occupancy')}</span>
                      </span>
                      <span className="font-semibold text-slate-900">
                        {shelter.current_occupancy} / {shelter.capacity} ({occupancyPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden border bg-slate-200 border-slate-300">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          occupancyPercent > 90
                            ? 'bg-red-500'
                            : occupancyPercent > 70
                            ? 'bg-amber-500'
                            : 'bg-blue-600'
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
                        className="text-[11px] font-mono px-2 py-0.5 rounded border bg-slate-100 text-slate-700 border-slate-200"
                      >
                        ✓ {fac}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-200">
                  <a
                    href={`tel:${shelter.contact_phone}`}
                    className="flex-1 py-2 px-3 rounded-xl border border-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer hbtn bg-slate-100 hover:bg-slate-200 text-slate-800"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t('shelters.call', { phone: shelter.contact_phone })}</span>
                  </a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${shelter.latitude},${shelter.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer hbtn bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Navigation className="w-3.5 h-3.5 fill-white text-white" />
                    <span>{t('shelters.route')}</span>
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
