import React, { useState } from 'react';
import { PestAlert, WeatherDay } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Sun,
  CloudRain,
  CloudSun,
  Wind,
  Droplets,
  AlertTriangle,
  Volume2,
  ShieldAlert,
  Plus,
  Bug,
  Leaf,
  FlaskConical,
} from 'lucide-react';

interface WeatherPestAlertsProps {
  weatherData: any;
  pestAlerts: PestAlert[];
  onAddPestAlert: (alert: Partial<PestAlert>) => Promise<void>;
}

export const WeatherPestAlerts: React.FC<WeatherPestAlertsProps> = ({
  weatherData,
  pestAlerts,
  onAddPestAlert,
}) => {
  const { t, speak } = useLanguage();
  const { role } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [newAlert, setNewAlert] = useState({
    pestName: '',
    affectedCrops: 'Wheat, Chickpea',
    severity: 'High' as PestAlert['severity'],
    region: 'Malwa Agro-Climatic Zone',
    symptoms: '',
    biologicalControl: '',
    chemicalControl: '',
  });

  const filteredAlerts = pestAlerts.filter((alert) => {
    const matchesSeverity = filterSeverity === 'all' || alert.severity.toLowerCase() === filterSeverity.toLowerCase();
    const matchesSearch =
      alert.pestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.affectedCrops.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      alert.region.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddPestAlert({
      pestName: newAlert.pestName,
      affectedCrops: newAlert.affectedCrops.split(',').map((c) => c.trim()),
      severity: newAlert.severity,
      region: newAlert.region,
      symptoms: newAlert.symptoms,
      biologicalControl: newAlert.biologicalControl,
      chemicalControl: newAlert.chemicalControl,
    });
    setShowAddModal(false);
    setNewAlert({
      pestName: '',
      affectedCrops: 'Wheat, Chickpea',
      severity: 'High',
      region: 'Malwa Agro-Climatic Zone',
      symptoms: '',
      biologicalControl: '',
      chemicalControl: '',
    });
  };

  const getWeatherIcon = (condition: string) => {
    if (condition.includes('Rain') || condition.includes('Showers')) {
      return <CloudRain className="w-8 h-8 text-blue-500" />;
    }
    if (condition.includes('Cloud')) {
      return <CloudSun className="w-8 h-8 text-amber-500" />;
    }
    return <Sun className="w-8 h-8 text-amber-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Agro-Meteorology & Pest Defense</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time weather parameters, predictive pest indices, and biological & chemical countermeasures
          </p>
        </div>

        {(role === 'expert' || role === 'admin') && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-medium transition-colors shrink-0"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{t('broadcastAlert')}</span>
          </button>
        )}
      </div>

      {/* 5-Day Agro Weather Forecast Cards */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2 mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">{t('weatherForecast')}</h2>
            <p className="text-xs text-slate-500">
              Location: {weatherData?.location || 'Central Agricultural Basin'}
            </p>
          </div>
          <div className="text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 font-mono tabular-nums">
            Wind: {weatherData?.windSpeed || '12 km/h NE'} · Air Quality: {weatherData?.airQualityIndex || 'Good'}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {(weatherData?.forecast || []).map((day: WeatherDay, idx: number) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex flex-col justify-between transition-colors ${
                idx === 0
                  ? 'bg-emerald-50/60 border-emerald-200'
                  : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-900">{day.dayName}</span>
                  <span className="text-[11px] text-slate-500 font-mono tabular-nums">{day.date.slice(5)}</span>
                </div>

                <div className="flex items-center justify-center py-2">
                  {getWeatherIcon(day.condition)}
                </div>

                <div className="text-center mb-2">
                  <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                    {day.tempMax}° / <span className="text-slate-400 font-normal">{day.tempMin}°C</span>
                  </div>
                  <div className="text-xs text-slate-600 font-medium">{day.condition}</div>
                </div>

                <div className="space-y-1 text-[11px] text-slate-600 border-t border-slate-200/60 pt-2 font-mono tabular-nums">
                  <div className="flex justify-between">
                    <span>Rain Prob:</span>
                    <strong className={day.rainProbabilityPercent > 40 ? 'text-blue-600' : 'text-slate-700'}>
                      {day.rainProbabilityPercent}%
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Humidity:</span>
                    <strong className="text-slate-700">{day.humidityPercent}%</strong>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60">
                <p className="text-[11px] text-slate-600 line-clamp-2 italic">{day.advisory}</p>
                <button
                  onClick={() => speak(`Advisory for ${day.dayName}: ${day.advisory}`)}
                  className="mt-1.5 w-full flex items-center justify-center gap-1 py-1 text-[10px] text-emerald-800 bg-white border border-emerald-200 hover:bg-emerald-50 rounded transition-colors"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>Listen</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pest Risk Index Engine Analysis */}
      <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Bug className="w-5 h-5 text-amber-800" />
          <h2 className="text-sm font-bold text-slate-900">Predictive Agro-Microclimate Pest Index</h2>
        </div>
        <p className="text-xs text-slate-700 mb-4 leading-relaxed">
          High relative humidity forecasted on Tuesday & Wednesday (78%–82%) combined with 28°C canopy temperature increases the risk threshold for <strong>Gram Pod Borer</strong> and <strong>Fungal Rust</strong>. Preventative bio-botanical sprays are advised prior to rainfall.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-3 rounded-lg border border-amber-200">
            <span className="font-semibold text-slate-800">Fungal Disease Susceptibility</span>
            <div className="text-rose-600 font-bold mt-1">High (Pre-Rain Spore Spread)</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Delay nitrogen foliar spraying until soils dry.</p>
          </div>

          <div className="bg-white p-3 rounded-lg border border-amber-200">
            <span className="font-semibold text-slate-800">Leaf Sucking Insects (Aphids)</span>
            <div className="text-amber-600 font-bold mt-1">Moderate Risk</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Inspect mustard flowering tips daily.</p>
          </div>

          <div className="bg-white p-3 rounded-lg border border-amber-200">
            <span className="font-semibold text-slate-800">Lepidopteran Borers (Armyworm)</span>
            <div className="text-rose-600 font-bold mt-1">Alert Issued (Check Whorls)</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Deploy pheromone lures and Trichogramma cards.</p>
          </div>
        </div>
      </div>

      {/* Pest Alerts Database & Filter */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Regional Pest Alerts & Treatment Protocols</h2>
            <p className="text-xs text-slate-500">Official warnings issued by university extension entomologists</p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search pest or crop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-emerald-600"
            />
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
              {['all', 'urgent', 'high', 'moderate'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-2.5 py-1 rounded font-medium capitalize transition-colors ${
                    filterSeverity === sev ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors bg-slate-50/30 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
                      alert.severity === 'Urgent'
                        ? 'bg-rose-100 text-rose-800'
                        : alert.severity === 'High'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {alert.severity} Severity
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{alert.pestName}</h3>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 font-mono tabular-nums">Reported: {alert.reportedDate}</span>
                  <button
                    onClick={() =>
                      speak(
                        `Pest: ${alert.pestName}. Symptoms: ${alert.symptoms}. Biological control: ${alert.biologicalControl}. Chemical control: ${alert.chemicalControl}`
                      )
                    }
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded transition-colors"
                    title="Audio readout"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Listen</span>
                  </button>
                </div>
              </div>

              <div className="text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Affected Crops:</span> {alert.affectedCrops.join(', ')} ·{' '}
                <span className="font-semibold text-slate-800">Agro Zone:</span> {alert.region}
              </div>

              <div className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-100">
                <strong className="text-slate-900">Symptoms & Damage:</strong> {alert.symptoms}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-emerald-50/70 p-3 rounded-lg border border-emerald-200">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                    <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Biological & Organic Control (Recommended)</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{alert.biologicalControl}</p>
                </div>

                <div className="bg-slate-100/70 p-3 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                    <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
                    <span>Emergency Chemical Guidance</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{alert.chemicalControl}</p>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 italic">
                Issued by: {alert.issuedBy}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Broadcast Alert Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Broadcast Urgent Pest Warning</h2>
            <p className="text-xs text-slate-500 mb-4">
              Publish an immediate phytosanitary notification to all registered farmers in the zone.
            </p>

            <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Pest / Disease Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yellow Rust (Puccinia striiformis)"
                    value={newAlert.pestName}
                    onChange={(e) => setNewAlert({ ...newAlert, pestName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Severity Level</label>
                  <select
                    value={newAlert.severity}
                    onChange={(e) => setNewAlert({ ...newAlert, severity: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                  >
                    <option value="Urgent">Urgent (Immediate Threat)</option>
                    <option value="High">High</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Affected Crops (comma separated)</label>
                  <input
                    type="text"
                    required
                    value={newAlert.affectedCrops}
                    onChange={(e) => setNewAlert({ ...newAlert, affectedCrops: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Target Region / Zone</label>
                  <input
                    type="text"
                    required
                    value={newAlert.region}
                    onChange={(e) => setNewAlert({ ...newAlert, region: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Diagnostic Symptoms</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Powdery yellow stripes along leaf veins, premature desiccation"
                  value={newAlert.symptoms}
                  onChange={(e) => setNewAlert({ ...newAlert, symptoms: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Biological / Cultural Control</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Apply Pseudomonas fluorescens @ 10g/L or release bio-parasitoids"
                  value={newAlert.biologicalControl}
                  onChange={(e) => setNewAlert({ ...newAlert, biologicalControl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Chemical Recommendation</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Propiconazole 25% EC @ 1 ml/L in severe outbreaks"
                  value={newAlert.chemicalControl}
                  onChange={(e) => setNewAlert({ ...newAlert, chemicalControl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg font-medium transition-colors"
                >
                  Issue Public Warning
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
