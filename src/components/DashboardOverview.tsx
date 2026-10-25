import React from 'react';
import { Farm, Crop, SoilTest, PestAlert } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Volume2, AlertTriangle, ArrowRight, Sun, Droplets, Wind, Plus, CheckCircle2 } from 'lucide-react';

interface DashboardOverviewProps {
  farms: Farm[];
  crops: Crop[];
  soilTests: SoilTest[];
  pestAlerts: PestAlert[];
  weatherData: any;
  onNavigate: (tab: string) => void;
  onOpenCropModal: () => void;
  onOpenSoilModal: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  farms,
  crops,
  soilTests,
  pestAlerts,
  weatherData,
  onNavigate,
  onOpenCropModal,
  onOpenSoilModal,
}) => {
  const { t, speak } = useLanguage();
  const { user } = useAuth();

  const totalAcres = farms.reduce((sum, f) => sum + f.sizeAcres, 0);
  const urgentAlert = pestAlerts.find(a => a.severity === 'Urgent') || pestAlerts[0];
  const latestSoil = soilTests[0];

  return (
    <div className="space-y-6">
      {/* Hero Visual Section */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 text-white min-h-[260px] flex flex-col justify-end p-6 sm:p-8">
        <img
          src="/src/assets/images/hero_agritech_field_1792925221112.jpg"
          alt="Modern precision agriculture farmland with crop rows"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

        <div className="relative z-10 max-w-3xl">
          <div className="text-xs font-semibold tracking-wider text-emerald-400 uppercase mb-1">
            {t('smartFarmingSuite')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            {t('welcomeBack')}, {user?.name || 'Farmer'}
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed max-w-2xl mb-4">
            Real-time agro-meteorological monitoring, soil nutrient intelligence, and certified biological pest management for optimal yield stability.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenCropModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-lg transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addNewCrop')}</span>
            </button>
            <button
              onClick={onOpenSoilModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-lg transition-colors backdrop-blur-xs border border-white/20"
            >
              <span>{t('logSoilTest')}</span>
            </button>
            <button
              onClick={() => onNavigate('marketplace')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-lg transition-colors backdrop-blur-xs border border-white/20"
            >
              <span>{t('agriStoreTitle')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Urgent Pest Alert Notification Bar */}
      {urgentAlert && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-800 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-900 tracking-wide uppercase">
                  {urgentAlert.severity} Advisory
                </span>
                <span className="text-xs text-amber-700">·</span>
                <span className="text-xs text-amber-800">{urgentAlert.region}</span>
              </div>
              <h2 className="text-sm font-semibold text-slate-900 mt-0.5">
                {urgentAlert.pestName} ({urgentAlert.affectedCrops.join(', ')})
              </h2>
              <p className="text-xs text-slate-700 mt-1 line-clamp-1">{urgentAlert.symptoms}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              onClick={() =>
                speak(
                  `Pest Alert: ${urgentAlert.pestName}. Symptoms: ${urgentAlert.symptoms}. Recommended action: ${urgentAlert.biologicalControl}`
                )
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-200/80 hover:bg-amber-200 text-amber-900 rounded-md text-xs font-medium transition-colors"
              title="Read advisory aloud"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{t('listenAudio')}</span>
            </button>
            <button
              onClick={() => onNavigate('weather')}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-50 text-amber-900 rounded-md text-xs font-medium transition-colors"
            >
              <span>View Treatment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Primary Telemetry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <span className="text-xs text-slate-500 font-medium">{t('monitoredFarms')}</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{farms.length}</span>
            <span className="text-xs text-slate-500 font-mono tabular-nums">{totalAcres} Total Acres</span>
          </div>
          <div className="mt-2 text-xs text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Optimal Drip Irrigation Active</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <span className="text-xs text-slate-500 font-medium">{t('activeCrops')}</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{crops.length}</span>
            <span className="text-xs text-slate-500">Across {farms.length} Farm Plots</span>
          </div>
          <div className="mt-2 text-xs text-slate-600 truncate">
            {crops.map(c => c.cropName).join(', ')}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <span className="text-xs text-slate-500 font-medium">{t('avgHealthScore')}</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-800 font-mono tabular-nums">85%</span>
            <span className="text-xs text-emerald-600 font-medium">NDVI 0.74</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">Vegetative Vigour High</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <span className="text-xs text-slate-500 font-medium">{t('soilStatus')}</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              pH {latestSoil ? latestSoil.ph : 7.2}
            </span>
            <span className="text-xs text-emerald-700 font-medium">
              {latestSoil ? latestSoil.rating : 'Optimal'}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            N: {latestSoil?.nitrogenKgPerHa || 310} · P: {latestSoil?.phosphorusKgPerHa || 34} · K: {latestSoil?.potassiumKgPerHa || 260} kg/ha
          </div>
        </div>
      </div>

      {/* 2-Column Split: Weather snapshot & Active Crops Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: 5-Day Agro-Weather Forecast */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">{t('weatherForecast')}</h2>
                <p className="text-xs text-slate-500">Malwa Agro-Climatic Zone</p>
              </div>
              <button
                onClick={() => onNavigate('weather')}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-medium"
              >
                Full Forecast →
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between bg-slate-50 rounded-lg p-3 border border-slate-100">
              <div className="flex items-center gap-3">
                <Sun className="w-8 h-8 text-amber-500" />
                <div>
                  <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                    {weatherData?.currentTemp || 31}°C
                  </div>
                  <div className="text-xs text-slate-500">Clear Sunshine · Wind 12 km/h</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-slate-700">Humidity 58%</div>
                <div className="text-xs text-emerald-700">Rain Risk: 5%</div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {(weatherData?.forecast || []).slice(0, 4).map((day: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-1.5 border-b border-slate-100 text-xs"
                >
                  <span className="font-medium text-slate-700 w-20">{day.dayName}</span>
                  <span className="text-slate-500">{day.condition}</span>
                  <div className="flex items-center gap-2 font-mono tabular-nums">
                    <span className="text-slate-900 font-medium">{day.tempMax}°</span>
                    <span className="text-slate-400">{day.tempMin}°</span>
                  </div>
                  <span className="text-emerald-700 font-mono tabular-nums w-12 text-right">
                    {day.rainProbabilityPercent}% rain
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 bg-emerald-50/50 p-2.5 rounded-lg">
            <span className="font-semibold text-emerald-900">Spraying Advisory:</span> Clear afternoon sky; safe window for bio-fertilizer fertigation.
          </div>
        </div>

        {/* Right Column: Crop Stage Progression & Phenology Tracking */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">{t('cropGrowthTimeline')}</h2>
              <p className="text-xs text-slate-500">Phenology stages, moisture status, and harvest countdown</p>
            </div>
            <button
              onClick={() => onNavigate('farms')}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-medium"
            >
              Manage Crops →
            </button>
          </div>

          <div className="space-y-4">
            {crops.map((crop) => (
              <div
                key={crop.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors bg-slate-50/40"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <span className="text-sm font-bold text-slate-900">{crop.cropName}</span>
                    <span className="text-xs text-slate-500 ml-2">({crop.variety})</span>
                    <div className="text-xs text-slate-500">
                      <span>{crop.farmName}</span>
                      <span className="mx-1">·</span>
                      <span className="font-mono tabular-nums">{crop.acresPlanted} Acres</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {crop.stage}
                    </span>
                    <span className="text-xs font-mono tabular-nums text-slate-600">
                      {crop.progressPercent}% Cycle
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 rounded-full h-2 mb-3 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all"
                    style={{ width: `${crop.progressPercent}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500">Sown Date:</span>
                    <p className="font-medium text-slate-800 font-mono tabular-nums">{crop.sowingDate}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Harvest Date:</span>
                    <p className="font-medium text-slate-800 font-mono tabular-nums">{crop.expectedHarvestDate}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Soil Moisture:</span>
                    <p className="font-medium text-slate-800 font-mono tabular-nums">{crop.soilMoisturePercent}%</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Weekly Water:</span>
                    <p className="font-medium text-slate-800 font-mono tabular-nums">
                      {crop.waterRequirementWeeklyLiters.toLocaleString()} L
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Row: Soil Health Recommendation & Certified Marketplace Callout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Soil Health Analysis Preview */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">{t('soilNutrientBalance')}</h2>
              <p className="text-xs text-slate-500">Latest test on {latestSoil?.testDate || 'Current Season'}</p>
            </div>
            <button
              onClick={() => onNavigate('soil')}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-medium"
            >
              View Full Lab Report →
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-xs text-slate-500 font-medium">Nitrogen (N)</span>
              <div className="text-lg font-bold text-slate-900 font-mono tabular-nums mt-1">
                {latestSoil?.nitrogenKgPerHa || 310}
              </div>
              <span className="text-[11px] text-emerald-700">Target: 280-560 kg/ha</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-xs text-slate-500 font-medium">Phosphorus (P)</span>
              <div className="text-lg font-bold text-slate-900 font-mono tabular-nums mt-1">
                {latestSoil?.phosphorusKgPerHa || 34}
              </div>
              <span className="text-[11px] text-emerald-700">Target: 23-56 kg/ha</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-xs text-slate-500 font-medium">Potassium (K)</span>
              <div className="text-lg font-bold text-slate-900 font-mono tabular-nums mt-1">
                {latestSoil?.potassiumKgPerHa || 260}
              </div>
              <span className="text-[11px] text-emerald-700">Target: 145-335 kg/ha</span>
            </div>
          </div>

          <div className="mt-4 bg-emerald-50/60 border border-emerald-100 rounded-lg p-3 text-xs">
            <span className="font-bold text-emerald-900">Lab Agronomist Advice:</span>
            <ul className="mt-1 list-disc list-inside space-y-1 text-slate-700">
              {(latestSoil?.recommendations || [
                'Maintain micro-irrigation scheduling to retain organic carbon moisture balance.',
              ]).map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick Consult & Marketplace Cards */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Expert Desk & Community</h2>
                <p className="text-xs text-slate-500">24/7 Agro-Consultation & Peer Knowledge</p>
              </div>
              <button
                onClick={() => onNavigate('consultation')}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-medium"
              >
                Open Forum →
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 mb-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Ask Certified Plant Pathologist</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Have crop yellowing or unusual insect attacks? Send symptoms directly to university extension scientists.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('consultation')}
                className="mt-2.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-xs font-medium transition-colors"
              >
                Submit Crop Query
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="text-xs font-bold text-slate-900">Government Subsidies & Certified Inputs</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Procure certified seeds, liquid bio-NPK cultures, and solar drip sets directly with Kisan Credit Card subsidies.
              </p>
              <button
                onClick={() => onNavigate('marketplace')}
                className="mt-2.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium transition-colors"
              >
                Explore Agri Store
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Current Agro Advisory Period: Rabi 2026</span>
            <span className="font-mono tabular-nums">2 Active Consultations</span>
          </div>
        </div>
      </div>
    </div>
  );
};
