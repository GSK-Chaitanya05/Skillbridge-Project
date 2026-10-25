import React, { useState } from 'react';
import { Farm, Crop } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Plus, MapPin, Droplets, Trash2, Edit2, CheckCircle2, AlertCircle } from 'lucide-react';

interface FarmManagementProps {
  farms: Farm[];
  crops: Crop[];
  onAddFarm: (farm: Partial<Farm>) => Promise<void>;
  onDeleteFarm: (id: string) => Promise<void>;
  onOpenCropModal: (farmId?: string) => void;
}

export const FarmManagement: React.FC<FarmManagementProps> = ({
  farms,
  crops,
  onAddFarm,
  onDeleteFarm,
  onOpenCropModal,
}) => {
  const { t } = useLanguage();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    district: 'Indore',
    state: 'Madhya Pradesh',
    sizeAcres: '5.0',
    soilType: 'Black' as Farm['soilType'],
    irrigationType: 'Drip Irrigation' as Farm['irrigationType'],
  });
  const [submitting, setSubmitting] = useState(false);
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onAddFarm({
        name: formData.name,
        district: formData.district,
        state: formData.state,
        location: `${formData.district}, ${formData.state}`,
        sizeAcres: parseFloat(formData.sizeAcres) || 1,
        soilType: formData.soilType,
        irrigationType: formData.irrigationType,
      });
      setShowAddModal(false);
      setFormData({
        name: '',
        district: 'Indore',
        state: 'Madhya Pradesh',
        sizeAcres: '5.0',
        soilType: 'Black',
        irrigationType: 'Drip Irrigation',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Farm Profile & Land Parcels</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage agricultural plots, soil classification, irrigation infrastructure, and crop allocations
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-medium transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addNewFarm')}</span>
        </button>
      </div>

      {/* Farms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {farms.map((farm) => {
          const farmCrops = crops.filter((c) => c.farmId === farm.id);
          const totalPlantedAcres = farmCrops.reduce((acc, c) => acc + c.acresPlanted, 0);

          return (
            <div
              key={farm.id}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">{farm.name}</h2>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{farm.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono tabular-nums font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md">
                      {farm.sizeAcres} Acres
                    </span>
                    <button
                      onClick={() => onDeleteFarm(farm.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete Farm Parcel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-slate-500 font-medium">Soil Classification:</span>
                    <p className="font-semibold text-slate-900 mt-0.5">{farm.soilType} Soil</p>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-slate-500 font-medium">Irrigation Method:</span>
                    <p className="font-semibold text-slate-900 mt-0.5 flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-blue-600" />
                      <span>{farm.irrigationType}</span>
                    </p>
                  </div>
                </div>

                {/* Crop status within this farm */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-700">Allocated Crops ({farmCrops.length})</span>
                    <span className="text-slate-500 font-mono tabular-nums">
                      {totalPlantedAcres} / {farm.sizeAcres} Acres Utilized
                    </span>
                  </div>

                  {farmCrops.length > 0 ? (
                    <div className="space-y-1.5">
                      {farmCrops.map((crop) => (
                        <div
                          key={crop.id}
                          className="flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded-lg text-xs"
                        >
                          <span className="font-medium text-slate-800">{crop.cropName}</span>
                          <span className="text-slate-500">{crop.stage}</span>
                          <span className="font-mono tabular-nums text-emerald-700 font-medium">
                            {crop.acresPlanted} ac
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic py-1">No crops currently assigned to this parcel.</p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Health Index: <strong className="text-emerald-700 font-mono tabular-nums">{farm.healthIndex}%</strong>
                </span>

                <button
                  onClick={() => onOpenCropModal(farm.id)}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-md text-xs font-medium transition-colors"
                >
                  + Add Crop to Plot
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Farm Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Add New Farm Plot</h2>
            <p className="text-xs text-slate-500 mb-4">
              Enter the farm parcel specifications for precision telemetry tracking.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Farm Plot Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Malwa South Horizon Plot"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Size (Acres)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    required
                    value={formData.sizeAcres}
                    onChange={(e) => setFormData({ ...formData, sizeAcres: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Soil Classification</label>
                  <select
                    value={formData.soilType}
                    onChange={(e) => setFormData({ ...formData, soilType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                  >
                    <option value="Black">Black (Regur)</option>
                    <option value="Alluvial">Alluvial</option>
                    <option value="Red & Yellow">Red & Yellow</option>
                    <option value="Sandy Loam">Sandy Loam</option>
                    <option value="Clay">Clay</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Irrigation System</label>
                <select
                  value={formData.irrigationType}
                  onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                >
                  <option value="Drip Irrigation">Drip Irrigation (Water-Efficient)</option>
                  <option value="Sprinkler">Sprinkler System</option>
                  <option value="Canal Flood">Canal Flood Irrigation</option>
                  <option value="Borewell">Borewell Tube-well</option>
                  <option value="Rainfed">Rainfed</option>
                </select>
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
                  disabled={submitting}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Farm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
