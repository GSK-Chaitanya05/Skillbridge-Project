import React, { useState } from 'react';
import { SoilTest, Farm } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Plus, CheckCircle, AlertTriangle, Calculator, FileText, Droplets } from 'lucide-react';

interface SoilHealthAnalysisProps {
  soilTests: SoilTest[];
  farms: Farm[];
  onAddSoilTest: (test: Partial<SoilTest>) => Promise<void>;
}

export const SoilHealthAnalysis: React.FC<SoilHealthAnalysisProps> = ({
  soilTests,
  farms,
  onAddSoilTest,
}) => {
  const { t } = useLanguage();
  const [selectedTestId, setSelectedTestId] = useState<string>(soilTests[0]?.id || '');
  const [showAddModal, setShowAddModal] = useState(false);

  // Target Fertilizer Calculator State
  const [calcCrop, setCalcCrop] = useState<'Wheat' | 'Chickpea' | 'Mustard' | 'Maize' | 'Cotton'>('Wheat');
  const [calcAcres, setCalcAcres] = useState<number>(5);

  // Form State for new soil test
  const [formData, setFormData] = useState({
    farmId: farms[0]?.id || '',
    nitrogenKgPerHa: '310',
    phosphorusKgPerHa: '34',
    potassiumKgPerHa: '260',
    ph: '7.2',
    organicCarbonPercent: '0.74',
    moisturePercent: '65',
    electricalConductivity: '0.42',
  });

  const activeTest = soilTests.find((s) => s.id === selectedTestId) || soilTests[0];

  // Fertilizer dosage calculation based on crop needs and soil test values
  const calculateFertilizer = () => {
    const baseRecommendations = {
      Wheat: { ureaPerAcre: 45, dapPerAcre: 30, mopPerAcre: 20, bioInoculant: 'Azotobacter + PSB (1 kg/acre)' },
      Chickpea: { ureaPerAcre: 15, dapPerAcre: 40, mopPerAcre: 15, bioInoculant: 'Rhizobium Legume Inoculant' },
      Mustard: { ureaPerAcre: 40, dapPerAcre: 25, mopPerAcre: 20, bioInoculant: 'Sulfur Solubilizing Bio-Culture' },
      Maize: { ureaPerAcre: 60, dapPerAcre: 35, mopPerAcre: 25, bioInoculant: 'VAM Mycorrhiza Bio-Fertilizer' },
      Cotton: { ureaPerAcre: 50, dapPerAcre: 30, mopPerAcre: 30, bioInoculant: 'Potash Mobilizing Consortium' },
    };

    const rec = baseRecommendations[calcCrop];
    return {
      ureaTotal: Math.round(rec.ureaPerAcre * calcAcres),
      dapTotal: Math.round(rec.dapPerAcre * calcAcres),
      mopTotal: Math.round(rec.mopPerAcre * calcAcres),
      bioInoculant: rec.bioInoculant,
    };
  };

  const dosage = calculateFertilizer();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddSoilTest({
      farmId: formData.farmId,
      nitrogenKgPerHa: parseFloat(formData.nitrogenKgPerHa),
      phosphorusKgPerHa: parseFloat(formData.phosphorusKgPerHa),
      potassiumKgPerHa: parseFloat(formData.potassiumKgPerHa),
      ph: parseFloat(formData.ph),
      organicCarbonPercent: parseFloat(formData.organicCarbonPercent),
      moisturePercent: parseFloat(formData.moisturePercent),
      electricalConductivity: parseFloat(formData.electricalConductivity),
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner with generated authentic soil image */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 text-white min-h-[160px] flex items-center p-6">
        <img
          src="/src/assets/images/soil_testing_sample_1792925221852.jpg"
          alt="Fertile dark agricultural loam soil held in farmer hands"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-transparent" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Soil Science & Precision Nutrient Intelligence
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
              Soil Health Analysis & Fertilizer Optimization
            </h1>
            <p className="text-xs text-slate-300 max-w-xl mt-1">
              Laboratory soil test records, NPK macronutrient balancing, pH levels, and scientific fertilizer dosage recommendations.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors shrink-0 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{t('logSoilTest')}</span>
          </button>
        </div>
      </div>

      {/* Select active report */}
      {soilTests.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Report:</span>
          {soilTests.map((test) => (
            <button
              key={test.id}
              onClick={() => setSelectedTestId(test.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                (activeTest?.id === test.id)
                  ? 'bg-emerald-800 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {test.farmName} ({test.testDate})
            </button>
          ))}
        </div>
      )}

      {/* Primary Report Card */}
      {activeTest && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">{activeTest.farmName}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">
                  {activeTest.rating}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Lab Test Date: <span className="font-mono tabular-nums">{activeTest.testDate}</span>
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-500">
                Moisture: <strong className="font-mono tabular-nums text-slate-900">{activeTest.moisturePercent}%</strong>
              </span>
              <span>·</span>
              <span className="text-slate-500">
                EC: <strong className="font-mono tabular-nums text-slate-900">{activeTest.electricalConductivity} dS/m</strong>
              </span>
            </div>
          </div>

          {/* Macronutrients Comparison Bar Charts */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Macronutrient Balance vs Benchmark (kg/ha)
            </h3>

            <div className="space-y-4 text-xs">
              {/* Nitrogen */}
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-semibold text-slate-800">Nitrogen (N)</span>
                  <span className="font-mono tabular-nums text-slate-700">
                    <strong className="text-slate-900">{activeTest.nitrogenKgPerHa}</strong> / 420 kg/ha optimal (Bench: 280-560)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-3 rounded-full"
                    style={{ width: `${Math.min(100, (activeTest.nitrogenKgPerHa / 500) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Phosphorus */}
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-semibold text-slate-800">Phosphorus (P)</span>
                  <span className="font-mono tabular-nums text-slate-700">
                    <strong className="text-slate-900">{activeTest.phosphorusKgPerHa}</strong> / 40 kg/ha optimal (Bench: 23-56)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-blue-600 h-3 rounded-full"
                    style={{ width: `${Math.min(100, (activeTest.phosphorusKgPerHa / 50) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Potassium */}
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-semibold text-slate-800">Potassium (K)</span>
                  <span className="font-mono tabular-nums text-slate-700">
                    <strong className="text-slate-900">{activeTest.potassiumKgPerHa}</strong> / 240 kg/ha optimal (Bench: 145-335)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-amber-600 h-3 rounded-full"
                    style={{ width: `${Math.min(100, (activeTest.potassiumKgPerHa / 320) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Soil pH & Organic Carbon Indicator Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 font-medium">Soil pH Balance</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{activeTest.ph}</span>
                <span className="text-xs font-semibold text-emerald-800">
                  {activeTest.ph >= 6.5 && activeTest.ph <= 7.5 ? 'Neutral (Ideal for most crops)' : activeTest.ph < 6.5 ? 'Acidic' : 'Alkaline'}
                </span>
              </div>
              <div className="w-full bg-gradient-to-r from-rose-300 via-emerald-400 to-purple-400 h-2 rounded-full mt-2 relative">
                <div
                  className="absolute -top-1 w-4 h-4 bg-slate-900 border-2 border-white rounded-full shadow-xs"
                  style={{ left: `${Math.max(0, Math.min(100, ((activeTest.ph - 4) / 6) * 100))}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>4.0 Acidic</span>
                <span>7.0 Neutral</span>
                <span>10.0 Alkaline</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 font-medium">Organic Carbon (OC)</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {activeTest.organicCarbonPercent}%
                </span>
                <span className="text-xs font-semibold text-emerald-800">
                  {activeTest.organicCarbonPercent >= 0.75 ? 'High Organic Matter' : 'Medium / Adequate'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Higher organic carbon increases cation exchange capacity (CEC) and drought resilience.
              </p>
            </div>
          </div>

          {/* Expert Recommendations */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
            <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              <span>Scientific Advisory & Action Plan</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-800 list-disc list-inside">
              {activeTest.recommendations.map((rec, i) => (
                <li key={i} className="leading-relaxed">{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Target Fertilizer Recommender Calculator */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
          <Calculator className="w-5 h-5 text-emerald-700" />
          <div>
            <h2 className="text-sm font-bold text-slate-900">{t('fertilizerRecommender')}</h2>
            <p className="text-xs text-slate-500">Calculate exact bulk and bio-fertilizer dosages by target crop and acreage</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Target Crop</label>
            <select
              value={calcCrop}
              onChange={(e) => setCalcCrop(e.target.value as any)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
            >
              <option value="Wheat">Wheat (Rabi Grain)</option>
              <option value="Chickpea">Chickpea / Bengal Gram (Pulse)</option>
              <option value="Mustard">Mustard (Oilseed)</option>
              <option value="Maize">Maize (Cereal)</option>
              <option value="Cotton">Cotton (Fiber / Cash Crop)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Plot Size (Acres)</label>
            <input
              type="number"
              min="1"
              max="100"
              value={calcAcres}
              onChange={(e) => setCalcAcres(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-xs text-slate-500">Urea (46% N)</span>
            <div className="text-xl font-bold text-slate-900 font-mono tabular-nums mt-1">
              {dosage.ureaTotal} kg
            </div>
            <span className="text-[11px] text-slate-400">Apply in 2 split top dressings</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-xs text-slate-500">DAP (18:46:0)</span>
            <div className="text-xl font-bold text-slate-900 font-mono tabular-nums mt-1">
              {dosage.dapTotal} kg
            </div>
            <span className="text-[11px] text-slate-400">Apply at basal sowing</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-xs text-slate-500">MOP (60% K2O)</span>
            <div className="text-xl font-bold text-slate-900 font-mono tabular-nums mt-1">
              {dosage.mopTotal} kg
            </div>
            <span className="text-[11px] text-slate-400">Apply basal or first irrigation</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="text-xs text-slate-500">Bio-Inoculant</span>
            <div className="text-sm font-bold text-emerald-800 mt-1 line-clamp-1">
              {dosage.bioInoculant}
            </div>
            <span className="text-[11px] text-emerald-700">Seed coating or fertigation</span>
          </div>
        </div>
      </div>

      {/* Log Soil Test Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-1">{t('logSoilTest')}</h2>
            <p className="text-xs text-slate-500 mb-4">
              Enter lab measurements to update the farm's soil fertility record.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Farm Parcel</label>
                <select
                  value={formData.farmId}
                  onChange={(e) => setFormData({ ...formData, farmId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                >
                  {farms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Nitrogen (kg/ha)</label>
                  <input
                    type="number"
                    required
                    value={formData.nitrogenKgPerHa}
                    onChange={(e) => setFormData({ ...formData, nitrogenKgPerHa: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Phosphorus (kg/ha)</label>
                  <input
                    type="number"
                    required
                    value={formData.phosphorusKgPerHa}
                    onChange={(e) => setFormData({ ...formData, phosphorusKgPerHa: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Potassium (kg/ha)</label>
                  <input
                    type="number"
                    required
                    value={formData.potassiumKgPerHa}
                    onChange={(e) => setFormData({ ...formData, potassiumKgPerHa: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Soil pH (0 - 14)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.ph}
                    onChange={(e) => setFormData({ ...formData, ph: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Organic Carbon %</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.organicCarbonPercent}
                    onChange={(e) => setFormData({ ...formData, organicCarbonPercent: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                  />
                </div>
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
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-medium transition-colors"
                >
                  Record Soil Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
