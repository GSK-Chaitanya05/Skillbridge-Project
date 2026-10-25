import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { FarmManagement } from './components/FarmManagement';
import { CropMonitoring } from './components/CropMonitoring';
import { SoilHealthAnalysis } from './components/SoilHealthAnalysis';
import { WeatherPestAlerts } from './components/WeatherPestAlerts';
import { AgriMarketplace } from './components/AgriMarketplace';
import { ExpertConsultation } from './components/ExpertConsultation';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { api } from './services/api';
import { Farm, Crop, SoilTest, PestAlert, ResourceItem, Order, Consultation, ForumPost } from './types';

function AgriTechMain() {
  const { role } = useAuth();
  const { t } = useLanguage();

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Global State
  const [farms, setFarms] = useState<Farm[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [soilTests, setSoilTests] = useState<SoilTest[]>([]);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [pestAlerts, setPestAlerts] = useState<PestAlert[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Quick modals triggers
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [isSoilModalOpen, setIsSoilModalOpen] = useState(false);

  const loadAllData = async () => {
    try {
      const [
        farmsData,
        cropsData,
        soilData,
        weatherRes,
        pestData,
        resourceData,
        ordersData,
        consultData,
        forumData,
      ] = await Promise.all([
        api.getFarms(),
        api.getCrops(),
        api.getSoilTests(),
        api.getWeather(),
        api.getPestAlerts(),
        api.getResources(),
        api.getOrders(),
        api.getConsultations(),
        api.getForumPosts(),
      ]);

      setFarms(farmsData);
      setCrops(cropsData);
      setSoilTests(soilData);
      setWeatherData(weatherRes);
      setPestAlerts(pestData);
      setResources(resourceData);
      setOrders(ordersData);
      setConsultations(consultData);
      setForumPosts(forumData);
    } catch (err) {
      console.error('Error fetching data from API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handlers for Farms
  const handleAddFarm = async (farmData: Partial<Farm>) => {
    const created = await api.createFarm(farmData);
    setFarms((prev) => [...prev, created]);
  };

  const handleDeleteFarm = async (id: string) => {
    await api.deleteFarm(id);
    setFarms((prev) => prev.filter((f) => f.id !== id));
  };

  // Handlers for Crops
  const handleAddCrop = async (cropData: Partial<Crop>) => {
    const created = await api.createCrop(cropData);
    setCrops((prev) => [...prev, created]);
    // update farm active crops count locally
    setFarms((prev) =>
      prev.map((f) => (f.id === created.farmId ? { ...f, activeCropsCount: f.activeCropsCount + 1 } : f))
    );
  };

  const handleUpdateCrop = async (id: string, cropData: Partial<Crop>) => {
    const updated = await api.updateCrop(id, cropData);
    setCrops((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  const handleDeleteCrop = async (id: string) => {
    await api.deleteCrop(id);
    setCrops((prev) => prev.filter((c) => c.id !== id));
  };

  // Handlers for Soil
  const handleAddSoilTest = async (testData: Partial<SoilTest>) => {
    const created = await api.createSoilTest(testData);
    setSoilTests((prev) => [created, ...prev]);
  };

  // Handlers for Pest Alerts
  const handleAddPestAlert = async (alertData: Partial<PestAlert>) => {
    const created = await api.createPestAlert(alertData);
    setPestAlerts((prev) => [created, ...prev]);
  };

  // Handlers for Orders & Marketplace
  const handlePlaceOrder = async (orderData: Partial<Order>) => {
    const created = await api.createOrder(orderData);
    setOrders((prev) => [created, ...prev]);
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    const updated = await api.updateOrderStatus(orderId, status);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
  };

  const handleAddResource = async (resourceData: Partial<ResourceItem>) => {
    const created = await api.createResource(resourceData);
    setResources((prev) => [...prev, created]);
  };

  // Handlers for Consultations & Forum
  const handleAddConsultation = async (data: Partial<Consultation>) => {
    const created = await api.createConsultation(data);
    setConsultations((prev) => [created, ...prev]);
  };

  const handleReplyConsultation = async (
    id: string,
    reply: { senderName: string; senderRole: any; text: string; prescription?: string }
  ) => {
    const updated = await api.replyConsultation(id, reply);
    setConsultations((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  const handleAddForumPost = async (post: Partial<ForumPost>) => {
    const created = await api.createForumPost(post);
    setForumPosts((prev) => [created, ...prev]);
  };

  const handleReplyForumPost = async (
    id: string,
    reply: { authorName: string; authorRole: any; text: string }
  ) => {
    const updated = await api.replyForumPost(id, reply);
    setForumPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
  };

  const handleUpvoteForumPost = async (id: string) => {
    const updated = await api.upvoteForumPost(id, 'usr-farmer-1');
    setForumPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        onOpenAuthModal={() => setShowAuthModal(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 text-xs">
            <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
            <span>Synchronizing farm telemetry and agro-meteorological models...</span>
          </div>
        ) : (
          <>
            {currentTab === 'dashboard' && (
              <DashboardOverview
                farms={farms}
                crops={crops}
                soilTests={soilTests}
                pestAlerts={pestAlerts}
                weatherData={weatherData}
                onNavigate={(tab) => setCurrentTab(tab)}
                onOpenCropModal={() => setCurrentTab('farms')}
                onOpenSoilModal={() => setCurrentTab('soil')}
              />
            )}

            {currentTab === 'farms' && (
              <div className="space-y-8">
                <FarmManagement
                  farms={farms}
                  crops={crops}
                  onAddFarm={handleAddFarm}
                  onDeleteFarm={handleDeleteFarm}
                  onOpenCropModal={(farmId) => setCurrentTab('crops_view')}
                />
                <CropMonitoring
                  crops={crops}
                  farms={farms}
                  onAddCrop={handleAddCrop}
                  onUpdateCrop={handleUpdateCrop}
                  onDeleteCrop={handleDeleteCrop}
                />
              </div>
            )}

            {currentTab === 'crops_view' && (
              <CropMonitoring
                crops={crops}
                farms={farms}
                onAddCrop={handleAddCrop}
                onUpdateCrop={handleUpdateCrop}
                onDeleteCrop={handleDeleteCrop}
              />
            )}

            {currentTab === 'soil' && (
              <SoilHealthAnalysis
                soilTests={soilTests}
                farms={farms}
                onAddSoilTest={handleAddSoilTest}
              />
            )}

            {currentTab === 'weather' && (
              <WeatherPestAlerts
                weatherData={weatherData}
                pestAlerts={pestAlerts}
                onAddPestAlert={handleAddPestAlert}
              />
            )}

            {currentTab === 'marketplace' && (
              <AgriMarketplace
                resources={resources}
                orders={orders}
                onPlaceOrder={handlePlaceOrder}
                onAddResource={handleAddResource}
              />
            )}

            {currentTab === 'consultation' && (
              <ExpertConsultation
                consultations={consultations}
                forumPosts={forumPosts}
                onAddConsultation={handleAddConsultation}
                onReplyConsultation={handleReplyConsultation}
                onAddForumPost={handleAddForumPost}
                onReplyForumPost={handleReplyForumPost}
                onUpvoteForumPost={handleUpvoteForumPost}
              />
            )}

            {currentTab === 'admin' && (
              <AdminDashboard
                orders={orders}
                pestAlerts={pestAlerts}
                resources={resources}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onAddResource={handleAddResource}
              />
            )}
          </>
        )}
      </main>

      {/* Clean Footer adhering to Anti-Slop constitution */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-emerald-900">AgriTech</span>
            <span>·</span>
            <span>Smart Farming Management & Precision Agronomy System</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <span>NABARD & ICAR Standards</span>
            <span>·</span>
            <span>Multilingual Precision Ag 2026</span>
          </div>
        </div>
      </footer>

      {/* Auth & Demo Switcher Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AgriTechMain />
      </LanguageProvider>
    </AuthProvider>
  );
}
