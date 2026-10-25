import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'es' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    appName: 'AgriTech',
    appSubtitle: 'Smart Farming Management System',
    navDashboard: 'Dashboard',
    navFarms: 'Farms & Crops',
    navSoil: 'Soil Health',
    navWeatherPests: 'Weather & Alerts',
    navMarketplace: 'Marketplace',
    navConsultation: 'Expert & Forum',
    navAdmin: 'Admin Console',
    quickRoleFarmer: 'Farmer Mode',
    quickRoleExpert: 'Expert Mode',
    quickRoleAdmin: 'Admin Mode',
    welcomeBack: 'Welcome back',
    smartFarmingSuite: 'Precision Agronomy & Smart Field Management',
    monitoredFarms: 'Monitored Farms',
    activeCrops: 'Active Crops',
    avgHealthScore: 'Crop Health Index',
    soilStatus: 'Soil Fertility Status',
    urgentPestAlert: 'Urgent Pest Warning in Your Region',
    listenAudio: 'Listen to Advisory',
    stopAudio: 'Stop Audio',
    weatherForecast: '5-Day Agro Weather Forecast',
    todayWeather: 'Today Weather',
    rainfallProb: 'Rainfall Probability',
    humidity: 'Humidity',
    wind: 'Wind',
    cropGrowthTimeline: 'Crop Growth & Phenology Stages',
    soilNutrientBalance: 'Macronutrient (N-P-K) Balance',
    fertilizerRecommender: 'Target Fertilizer Calculator',
    consultExpertTitle: 'Consult Certified Agronomist',
    communityForumTitle: 'Farmers Community Knowledge Exchange',
    agriStoreTitle: 'Certified Farm Inputs & Equipment',
    addToCart: 'Add to Cart',
    cartTotal: 'Cart Total',
    checkout: 'Checkout with Kisan Credit Card / UPI',
    ordersHistory: 'My Orders & Real-time Tracking',
    logSoilTest: 'Log Soil Test Report',
    addNewCrop: 'Register New Crop',
    addNewFarm: 'Add Farm Plot',
    broadcastAlert: 'Broadcast Pest Alert',
    logout: 'Sign Out',
    signIn: 'Sign In / Register',
    demoAccounts: 'Instant Demo Login',
    farmerRole: 'Farmer',
    expertRole: 'Agronomist',
    adminRole: 'Administrator',
  },
  hi: {
    appName: 'एग्री-टेक',
    appSubtitle: 'स्मार्ट कृषि प्रबंधन प्रणाली',
    navDashboard: 'डैशबोर्ड',
    navFarms: 'खेत और फसलें',
    navSoil: 'मृदा स्वास्थ्य',
    navWeatherPests: 'मौसम व कीट अलर्ट',
    navMarketplace: 'कृषि बाज़ार',
    navConsultation: 'विशेषज्ञ व मंच',
    navAdmin: 'प्रशासक पैनल',
    quickRoleFarmer: 'किसान मोड',
    quickRoleExpert: 'कृषि विशेषज्ञ',
    quickRoleAdmin: 'प्रशासक मोड',
    welcomeBack: 'स्वागत है',
    smartFarmingSuite: 'सटीक कृषि और आधुनिक खेत प्रबंधन',
    monitoredFarms: 'पंजीकृत खेत',
    activeCrops: 'सक्रिय फसलें',
    avgHealthScore: 'फसल स्वास्थ्य सूचकांक',
    soilStatus: 'मिट्टी की उर्वरता स्थिति',
    urgentPestAlert: 'आपके क्षेत्र में कीट चेतावनी',
    listenAudio: 'सलाह सुनें (ऑडियो)',
    stopAudio: 'आवाज रोकें',
    weatherForecast: '5 दिवसीय मौसम पूर्वानुमान',
    todayWeather: 'आज का मौसम',
    rainfallProb: 'बारिश की संभावना',
    humidity: 'आर्द्रता (नमी)',
    wind: 'हवा की गति',
    cropGrowthTimeline: 'फसल विकास व अवस्था',
    soilNutrientBalance: 'पोषक तत्व (N-P-K) संतुलन',
    fertilizerRecommender: 'उर्वरक खुराक कैलकुलेटर',
    consultExpertTitle: 'प्रमाणित कृषि विशेषज्ञ से परामर्श',
    communityForumTitle: 'किसान समुदाय ज्ञान साझा मंच',
    agriStoreTitle: 'प्रमाणित बीज, खाद व उपकरण',
    addToCart: 'कार्ट में जोड़ें',
    cartTotal: 'कुल राशि',
    checkout: 'किसान क्रेडिट कार्ड / UPI से भुगतान करें',
    ordersHistory: 'मेरे ऑर्डर और ट्रैकिंग',
    logSoilTest: 'मृदा परीक्षण रिपोर्ट दर्ज करें',
    addNewCrop: 'नई फसल जोड़ें',
    addNewFarm: 'नया खेत जोड़ें',
    broadcastAlert: 'कीट चेतावनी जारी करें',
    logout: 'लॉग आउट',
    signIn: 'लॉग इन / पंजीकरण',
    demoAccounts: 'त्वरित डेमो लॉगिन',
    farmerRole: 'किसान',
    expertRole: 'कृषि विशेषज्ञ',
    adminRole: 'प्रशासक',
  },
  es: {
    appName: 'AgriTech',
    appSubtitle: 'Sistema de Gestión Agrícola Inteligente',
    navDashboard: 'Panel Principal',
    navFarms: 'Fincas y Cultivos',
    navSoil: 'Salud del Suelo',
    navWeatherPests: 'Clima y Plagas',
    navMarketplace: 'Mercado Agrícola',
    navConsultation: 'Expertos y Foro',
    navAdmin: 'Consola Admin',
    quickRoleFarmer: 'Modo Agricultor',
    quickRoleExpert: 'Modo Agrónomo',
    quickRoleAdmin: 'Modo Administrador',
    welcomeBack: 'Bienvenido de nuevo',
    smartFarmingSuite: 'Agronomía de Precisión y Gestión de Campo',
    monitoredFarms: 'Fincas Monitoreadas',
    activeCrops: 'Cultivos Activos',
    avgHealthScore: 'Índice de Salud de Cultivos',
    soilStatus: 'Fertilidad del Suelo',
    urgentPestAlert: 'Alerta Urgente de Plagas en su Región',
    listenAudio: 'Escuchar Asesoría',
    stopAudio: 'Detener Audio',
    weatherForecast: 'Pronóstico Agroclimático a 5 Días',
    todayWeather: 'Clima de Hoy',
    rainfallProb: 'Probabilidad de Lluvia',
    humidity: 'Humedad',
    wind: 'Viento',
    cropGrowthTimeline: 'Etapas de Crecimiento del Cultivo',
    soilNutrientBalance: 'Equilibrio de Macronutrientes (N-P-K)',
    fertilizerRecommender: 'Calculadora de Dosis de Fertilizante',
    consultExpertTitle: 'Consultar Agrónomo Certificado',
    communityForumTitle: 'Foro Comunitario de Productores',
    agriStoreTitle: 'Insumos y Equipos Certificados',
    addToCart: 'Añadir al Carrito',
    cartTotal: 'Total del Carrito',
    checkout: 'Pagar con Tarjeta Agrícola o Transferencia',
    ordersHistory: 'Mis Pedidos y Rastreo',
    logSoilTest: 'Registrar Análisis de Suelo',
    addNewCrop: 'Registrar Nuevo Cultivo',
    addNewFarm: 'Agregar Finca',
    broadcastAlert: 'Emitir Alerta Fitosanitaria',
    logout: 'Cerrar Sesión',
    signIn: 'Iniciar Sesión / Registro',
    demoAccounts: 'Acceso Rápido Demo',
    farmerRole: 'Agricultor',
    expertRole: 'Agrónomo',
    adminRole: 'Administrador',
  },
  mr: {
    appName: 'ॲग्री-टेक',
    appSubtitle: 'स्मार्ट शेती व्यवस्थापन प्रणाली',
    navDashboard: 'डॅशबोर्ड',
    navFarms: 'शेत व पिके',
    navSoil: 'माती आरोग्य',
    navWeatherPests: 'हवामान व कीड इशारा',
    navMarketplace: 'कृषी बाजार',
    navConsultation: 'तज्ज्ञ व मंच',
    navAdmin: 'प्रशासक पॅनेल',
    quickRoleFarmer: 'शेतकरी मोड',
    quickRoleExpert: 'कृषी तज्ज्ञ',
    quickRoleAdmin: 'प्रशासक मोड',
    welcomeBack: 'स्वागत आहे',
    smartFarmingSuite: 'अचूक शेती आणि आधुनिक पीक व्यवस्थापन',
    monitoredFarms: 'नोंदणीकृत शेतजमीन',
    activeCrops: 'सक्रिय पिके',
    avgHealthScore: 'पीक आरोग्य निर्देशांक',
    soilStatus: 'मातीची सुपिकता स्थिती',
    urgentPestAlert: 'आपल्या भागात कीड-रोग इशारा',
    listenAudio: 'कृषी सल्ला ऐका (ऑडिओ)',
    stopAudio: 'आवाज बंद करा',
    weatherForecast: '५ दिवसांचा हवामान अंदाज',
    todayWeather: 'आजचे हवामान',
    rainfallProb: 'पावसाची शक्यता',
    humidity: 'हवेतील आर्द्रता',
    wind: 'वाऱ्याचा वेग',
    cropGrowthTimeline: 'पीक वाढ व अवस्था',
    soilNutrientBalance: 'खत घटक (N-P-K) समतोल',
    fertilizerRecommender: 'खत प्रमाण गणकयंत्र',
    consultExpertTitle: 'प्रमाणित कृषी तज्ज्ञांशी सल्लामसलत',
    communityForumTitle: 'शेतकरी समुदाय ज्ञान देवाणघेवाण मंच',
    agriStoreTitle: 'प्रमाणित बियाणे, खते व उपकरणे',
    addToCart: 'खरेदी टोपलीत टाका',
    cartTotal: 'एकूण रक्कम',
    checkout: 'किसान क्रेडिट कार्ड / UPI द्वारे देयक',
    ordersHistory: 'माझे ऑर्डर्स व ट्रॅकिंग',
    logSoilTest: 'माती परीक्षण अहवाल नोंदवा',
    addNewCrop: 'नवीन पीक जोडा',
    addNewFarm: 'नवीन शेत जोडा',
    broadcastAlert: 'कीड इशारा जारी करा',
    logout: 'बाहेर पडा',
    signIn: 'लॉग इन / नोंदणी',
    demoAccounts: 'त्वरित डेमो प्रवेश',
    farmerRole: 'शेतकरी',
    expertRole: 'कृषी तज्ज्ञ',
    adminRole: 'प्रशासक',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
  speak: () => {},
  stopSpeaking: () => {},
  isSpeaking: false,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('agritech_lang') as Language) || 'en';
  });
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('agritech_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (language === 'hi') utterance.lang = 'hi-IN';
    else if (language === 'es') utterance.lang = 'es-ES';
    else if (language === 'mr') utterance.lang = 'mr-IN';
    else utterance.lang = 'en-US';

    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, speak, stopSpeaking, isSpeaking }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
