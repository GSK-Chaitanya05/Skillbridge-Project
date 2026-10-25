import React, { useState } from 'react';
import { Crop, Farm } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Plus, Calendar, Droplets, Activity, Trash2, Edit3, ArrowRight } from 'lucide-react';

interface CropMonitoringProps {
  crops: Crop[];
  farms: Farm[];
  onAddCrop: (crop: Partial<Crop>) => Promise<void>;
  onUpdateCrop: (id: string, data: Partial<Crop>) => Promise<void>;
  onDeleteCrop: (id: string) => Promise<void>;
}

export const CropMonitoring: React.FC<CropMonitoringProps> = ({
  crops,
  farms,
  onAddCrop,
  onUpdateCrop,
  onDeleteCrop,
}) => {
  const { t } = useLanguage();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);

  const [formData, setFormData] = useState({
    farmId: farms[0]?.id || '',
    cropName: '',
    variety: '',
    stage: 'Sowing' as Crop['stage'],
    sowingDate: new Date().toISOString().split('T')[0],
    expectedHarvestDate: '',
    acresPlanted: '2.5',
    notes: '',
  });

  const stages: Crop['stage'][] = [
    'Sowing',
    'Vegetative',
    'Flowering',
    'Pod/Grain Formation',
    'Ripening',
    'Harvesting',
  ];

  const handleStageChange = async (crop: Crop, newStage: Crop['stage']) => {
    const stagePercents: Record<Crop['stage'], number> = {
      Sowing: 10,
      Vegetative: 35,
      Flowering: 60,
      'Pod/Grain Formation': 75,
      Ripening: 90,
      Harvesting: 100,
    };
    await onUpdateCrop(crop.id, {
      stage: newStage,
      progressPercent: stagePercents[newStage],
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddCrop({
      farmId: formData.farmId,
      cropName: formData.cropName,
      variety: formData.variety || 'High-Yield Standard',
      stage: formData.stage,
      sowingDate: formData.sowingDate,
      expectedHarvestDate: formData.expectedHarvestDate || '2026-12-20',
      acresPlanted: parseFloat(formData.acresPlanted) || 1,
      notes: formData.notes,
    });
    setShowAddModal(false);
    setFormData({
      farmId: farms[0]?.id || '',
      cropName: '',
      variety: '',
      stage: 'Sowing',
      sowingDate: new Date().toISOString().split('T')[0],
      expectedHarvestDate: '',
      acresPlanted: '2.5',
      notes: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Visual Showcase Banner with generated image */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 text-white min-h-[160px] flex items-center p-6">
        <img
          src="/src/assets/images/crop_wheat_corn_1792925222743.jpg"
          alt="Healthy green agricultural field with drip lines"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Phenological Tracking & Vegetative Vigor
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
              Crop Monitoring & Phenology Stages
            </h1>
            <p className="text-xs text-slate-300 max-w-xl mt-1">
              Track growth stages from germination to maturity, monitor NDVI plant health indexes, and balance irrigation schedules.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors shrink-0 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addNewCrop')}</span>
          </button>
        </div>
      </div>

      {/* Crops List */}
      <div className="space-y-4">
        {crops.map((crop) => {
          const currentStageIndex = stages.indexOf(crop.stage);

          return (
            <div
              key={crop.id}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900">{crop.cropName}</h2>
                    <span className="text-xs text-slate-500">· {crop.variety}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-medium">
                      {crop.healthStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {crop.farmName} · <span className="font-mono tabular-nums">{crop.acresPlanted} Acres Planted</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Target Harvest:</span>
                    <p className="text-xs font-bold text-slate-900 font-mono tabular-nums">
                      {crop.expectedHarvestDate}
                    </p>
                  </div>

                  <button
                    onClick={() => onDeleteCrop(crop.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Delete Crop"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Phenology Stages Timeline */}
              <div className="py-4">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-medium text-slate-700">Growth Stage Progression</span>
                  <span className="font-mono tabular-nums font-semibold text-emerald-800">
                    Stage: {crop.stage} ({crop.progressPercent}%)
                  </span>
                </div>

                <div className="grid grid-cols-6 gap-1 sm:gap-2">
                  {stages.map((stg, idx) => {
                    const isDone = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;

                    return (
                      <button
                        key={stg}
                        onClick={() => handleStageChange(crop, stg)}
                        title={`Click to set stage to ${stg}`}
                        className={`text-left p-2 rounded-lg border text-[11px] transition-all ${
                          isCurrent
                            ? 'bg-emerald-800 text-white border-emerald-800 font-semibold shadow-xs'
                            : isDone
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                            : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="font-mono tabular-nums text-[10px] opacity-75">0{idx + 1}</div>
                        <div className="truncate">{stg}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Telemetry Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-blue-500" />
                    <span>Soil Moisture</span>
                  </span>
                  <p className="font-bold text-slate-900 font-mono tabular-nums mt-0.5">
                    {crop.soilMoisturePercent}%
                  </p>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    <span>NDVI Vigor Score</span>
                  </span>
                  <p className="font-bold text-slate-900 font-mono tabular-nums mt-0.5">
                    {crop.ndviScore} (High Canopy)
                  </p>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-500">Weekly Water Need</span>
                  <p className="font-bold text-slate-900 font-mono tabular-nums mt-0.5">
                    {crop.waterRequirementWeeklyLiters.toLocaleString()} Liters
                  </p>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-500">Pest Susceptibility</span>
                  <p className="font-bold text-slate-900 mt-0.5">
                    <span
                      className={`font-semibold ${
                        crop.pestRisk === 'High'
                          ? 'text-rose-600'
                          : crop.pestRisk === 'Moderate'
                          ? 'text-amber-600'
                          : 'text-emerald-700'
                      }`}
                    >
                      {crop.pestRisk} Risk
                    </span>
                  </p>
                </div>
              </div>

              {crop.notes && (
                <div className="mt-3 text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                  <span className="font-medium text-slate-900">Agronomic Notes:</span> {crop.notes}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Crop Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-1">{t('addNewCrop')}</h2>
            <p className="text-xs text-slate-500 mb-4">
              Enter crop variety and phenology parameters for real-time tracking.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Select Farm Plot</label>
                <select
                  value={formData.farmId}
                  onChange={(e) => setFormData({ ...formData, farmId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                >
                  {farms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.sizeAcres} Acres, {f.soilType})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Crop Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wheat, Chickpea, Cotton"
                    value={formData.cropName}
                    onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Seed Variety</label>
                  <input
                    type="text"
                    placeholder="e.g. HI-8759 Pusa Tejas"
                    value={formData.variety}
                    onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Acres Planted</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    required
                    value={formData.acresPlanted}
                    onChange={(e) => setFormData({ ...formData, acresPlanted: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Current Stage</label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                  >
                    {stages.map((stg) => (
                      <option key={stg} value={stg}>
                        {stg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Sowing Date</label>
                  <input
                    type="date"
                    required
                    value={formData.sowingDate}
                    onChange={(e) => setFormData({ ...formData, sowingDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Estimated Harvest</label>
                  <input
                    type="date"
                    required
                    value={formData.expectedHarvestDate}
                    onChange={(e) => setFormData({ ...formData, expectedHarvestDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Agronomic Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Treated seeds with bio-fungicide, installed yellow sticky traps"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-medium transition-colors"
                >
                  Register Crop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
