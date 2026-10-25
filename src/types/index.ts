export type UserRole = 'farmer' | 'expert' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  region: string;
  farmSizeAcres?: number;
  primaryCrops?: string[];
  avatarUrl?: string;
  specialization?: string; // for expert
}

export interface Farm {
  id: string;
  userId: string;
  name: string;
  location: string;
  district: string;
  state: string;
  sizeAcres: number;
  soilType: 'Alluvial' | 'Black' | 'Red & Yellow' | 'Laterite' | 'Sandy Loam' | 'Clay';
  irrigationType: 'Drip Irrigation' | 'Sprinkler' | 'Canal Flood' | 'Rainfed' | 'Borewell';
  createdAt: string;
  activeCropsCount: number;
  healthIndex: number; // 0-100
}

export interface Crop {
  id: string;
  farmId: string;
  farmName: string;
  cropName: string;
  variety: string;
  stage: 'Sowing' | 'Vegetative' | 'Flowering' | 'Pod/Grain Formation' | 'Ripening' | 'Harvesting';
  progressPercent: number;
  sowingDate: string;
  expectedHarvestDate: string;
  acresPlanted: number;
  healthStatus: 'Excellent' | 'Good' | 'Needs Attention' | 'Critical';
  soilMoisturePercent: number;
  ndviScore: number; // 0.0 - 1.0 Normalized Difference Vegetation Index
  waterRequirementWeeklyLiters: number;
  pestRisk: 'Low' | 'Moderate' | 'High';
  notes?: string;
}

export interface SoilTest {
  id: string;
  farmId: string;
  farmName: string;
  testDate: string;
  nitrogenKgPerHa: number; // standard optimal: 280-560
  phosphorusKgPerHa: number; // standard optimal: 23-56
  potassiumKgPerHa: number; // standard optimal: 145-335
  ph: number; // 5.5 - 8.5
  organicCarbonPercent: number; // 0.4 - 1.2%
  moisturePercent: number;
  electricalConductivity: number; // dS/m
  rating: 'Optimal' | 'Moderately Deficient' | 'Severely Deficient' | 'Excessive';
  recommendations: string[];
  recommendedFertilizer: {
    ureaKgPerAcre: number;
    dapKgPerAcre: number;
    mopKgPerAcre: number;
    bioFertilizer: string;
  };
}

export interface WeatherDay {
  date: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  humidityPercent: number;
  rainProbabilityPercent: number;
  windSpeedKmh: number;
  uvIndex: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Scattered Showers' | 'Heavy Rain' | 'Windy';
  advisory: string;
}

export interface PestAlert {
  id: string;
  pestName: string;
  affectedCrops: string[];
  severity: 'Urgent' | 'High' | 'Moderate' | 'Low';
  region: string;
  symptoms: string;
  biologicalControl: string;
  chemicalControl: string;
  reportedDate: string;
  issuedBy: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  category: 'Seeds' | 'Organic Fertilizers' | 'Bio-Pesticides' | 'Micro-Irrigation' | 'Tools & Equipment';
  price: number;
  unit: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  brand: string;
  description: string;
  dosageOrUsage?: string;
  certifiedOrganic?: boolean;
}

export interface OrderItem {
  resourceId: string;
  title: string;
  price: number;
  quantity: number;
  unit: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: 'Kisan Credit Card (KCC)' | 'UPI / Direct Bank' | 'Cash on Delivery';
  paymentStatus: 'Paid' | 'Pending';
  status: 'Order Placed' | 'Confirmed' | 'Dispatched' | 'In Transit' | 'Out for Delivery' | 'Delivered';
  createdAt: string;
  trackingNumber: string;
}

export interface ConsultationMessage {
  id: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  createdAt: string;
}

export interface Consultation {
  id: string;
  farmerId: string;
  farmerName: string;
  cropName: string;
  subject: string;
  symptoms: string;
  status: 'Open' | 'Under Review' | 'Prescription Provided' | 'Closed';
  createdAt: string;
  expertName?: string;
  expertPrescription?: string;
  messages: ConsultationMessage[];
}

export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  title: string;
  content: string;
  category: 'Crop Diseases' | 'Soil Management' | 'Irrigation Hacks' | 'Govt Subsidies' | 'Organic Farming';
  upvotes: number;
  upvotedBy: string[];
  createdAt: string;
  replies: {
    id: string;
    authorName: string;
    authorRole: UserRole;
    text: string;
    createdAt: string;
  }[];
}
