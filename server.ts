import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Farm, Crop, SoilTest, PestAlert, ResourceItem, Order, Consultation, ForumPost, WeatherDay } from './src/types/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'agritech_smart_farming_jwt_secret_2026';
const PORT = process.env.PORT || 3000;

// In-Memory Database store with MongoDB-like structure
interface DbUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  role: 'farmer' | 'expert' | 'admin';
  region: string;
  farmSizeAcres?: number;
  primaryCrops?: string[];
  avatarUrl?: string;
  specialization?: string;
}

interface DatabaseSchema {
  users: DbUser[];
  farms: Farm[];
  crops: Crop[];
  soilTests: SoilTest[];
  weatherForecast: WeatherDay[];
  pestAlerts: PestAlert[];
  resources: ResourceItem[];
  orders: Order[];
  consultations: Consultation[];
  forumPosts: ForumPost[];
}

const db: DatabaseSchema = {
  users: [
    {
      id: 'usr-farmer-1',
      name: 'Ramesh Patel',
      email: 'farmer@agritech.org',
      passwordHash: bcrypt.hashSync('farmer123', 8),
      phone: '+91 98250 14820',
      role: 'farmer' as const,
      region: 'Indore, Madhya Pradesh',
      farmSizeAcres: 12.5,
      primaryCrops: ['Soybean', 'Wheat', 'Chickpea'],
      avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80',
    },
    {
      id: 'usr-expert-1',
      name: 'Dr. Sunita Deshmukh',
      email: 'expert@agritech.org',
      passwordHash: bcrypt.hashSync('expert123', 8),
      phone: '+91 94220 88310',
      role: 'expert' as const,
      region: 'Central Agronomy Institute',
      specialization: 'Soil Chemistry & Plant Pathology',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    },
    {
      id: 'usr-admin-1',
      name: 'Admin Coordinator',
      email: 'admin@agritech.org',
      passwordHash: bcrypt.hashSync('admin123', 8),
      phone: '+91 98111 22334',
      role: 'admin' as const,
      region: 'AgriTech Central Command',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    },
  ] as DbUser[],

  farms: [
    {
      id: 'farm-01',
      userId: 'usr-farmer-1',
      name: 'Green Horizon Farm Unit 1',
      location: 'Sanwer Tehsil, Indore',
      district: 'Indore',
      state: 'Madhya Pradesh',
      sizeAcres: 7.5,
      soilType: 'Black',
      irrigationType: 'Drip Irrigation',
      createdAt: '2026-03-15T08:00:00Z',
      activeCropsCount: 2,
      healthIndex: 88,
    },
    {
      id: 'farm-02',
      userId: 'usr-farmer-1',
      name: 'Narmada Valley Plot 2',
      location: 'Dhar Road, Mhow Sector',
      district: 'Dhar',
      state: 'Madhya Pradesh',
      sizeAcres: 5.0,
      soilType: 'Alluvial',
      irrigationType: 'Sprinkler',
      createdAt: '2026-05-10T09:30:00Z',
      activeCropsCount: 1,
      healthIndex: 82,
    },
  ],

  crops: [
    {
      id: 'crop-01',
      farmId: 'farm-01',
      farmName: 'Green Horizon Farm Unit 1',
      cropName: 'Durum Wheat',
      variety: 'HI-8759 (Pusa Tejas)',
      stage: 'Flowering',
      progressPercent: 65,
      sowingDate: '2026-09-02',
      expectedHarvestDate: '2026-11-20',
      acresPlanted: 4.5,
      healthStatus: 'Excellent',
      soilMoisturePercent: 68,
      ndviScore: 0.78,
      waterRequirementWeeklyLiters: 18500,
      pestRisk: 'Low',
      notes: 'Flowering stage reached 4 days ahead of cycle. Soil nitrogen adequate.',
    },
    {
      id: 'crop-02',
      farmId: 'farm-01',
      farmName: 'Green Horizon Farm Unit 1',
      cropName: 'Chickpea (Chana)',
      variety: 'JG-11 Desi',
      stage: 'Pod/Grain Formation',
      progressPercent: 72,
      sowingDate: '2026-08-28',
      expectedHarvestDate: '2026-11-12',
      acresPlanted: 3.0,
      healthStatus: 'Good',
      soilMoisturePercent: 54,
      ndviScore: 0.71,
      waterRequirementWeeklyLiters: 11000,
      pestRisk: 'Moderate',
      notes: 'Pod borer traps installed. Preventive neem oil spray scheduled.',
    },
    {
      id: 'crop-03',
      farmId: 'farm-02',
      farmName: 'Narmada Valley Plot 2',
      cropName: 'Mustard (Sarson)',
      variety: 'Pusa Bold',
      stage: 'Vegetative',
      progressPercent: 42,
      sowingDate: '2026-09-20',
      expectedHarvestDate: '2026-12-15',
      acresPlanted: 5.0,
      healthStatus: 'Good',
      soilMoisturePercent: 62,
      ndviScore: 0.69,
      waterRequirementWeeklyLiters: 14000,
      pestRisk: 'Low',
      notes: 'Canopy coverage is strong with zero aphid presence.',
    },
  ],

  soilTests: [
    {
      id: 'soil-01',
      farmId: 'farm-01',
      farmName: 'Green Horizon Farm Unit 1',
      testDate: '2026-10-18',
      nitrogenKgPerHa: 310,
      phosphorusKgPerHa: 34,
      potassiumKgPerHa: 260,
      ph: 7.2,
      organicCarbonPercent: 0.74,
      moisturePercent: 68,
      electricalConductivity: 0.42,
      rating: 'Optimal',
      recommendations: [
        'Nitrogen and Potassium levels are in optimal zones for winter rabi crops.',
        'Maintain micro-irrigation scheduling to retain organic carbon moisture balance.',
        'Phosphorus application via single superphosphate (SSP) can boost root density by 14%.',
      ],
      recommendedFertilizer: {
        ureaKgPerAcre: 35,
        dapKgPerAcre: 20,
        mopKgPerAcre: 15,
        bioFertilizer: 'Trichoderma viride + Azotobacter bio-inoculant',
      },
    },
    {
      id: 'soil-02',
      farmId: 'farm-02',
      farmName: 'Narmada Valley Plot 2',
      testDate: '2026-10-10',
      nitrogenKgPerHa: 240,
      phosphorusKgPerHa: 18,
      potassiumKgPerHa: 195,
      ph: 6.6,
      organicCarbonPercent: 0.52,
      moisturePercent: 58,
      electricalConductivity: 0.38,
      rating: 'Moderately Deficient',
      recommendations: [
        'Available Phosphorus is below benchmark threshold (18 kg/ha vs 25 kg/ha target).',
        'Incorporate 2 tons/acre composted farmyard manure (FYM) before next crop rotation.',
        'Apply foliar zinc sulfate (0.5%) along with secondary micronutrient blend.',
      ],
      recommendedFertilizer: {
        ureaKgPerAcre: 45,
        dapKgPerAcre: 35,
        mopKgPerAcre: 25,
        bioFertilizer: 'Phosphate Solubilizing Bacteria (PSB) culture',
      },
    },
  ],

  weatherForecast: [
    {
      date: '2026-10-25',
      dayName: 'Today',
      tempMax: 31,
      tempMin: 19,
      humidityPercent: 58,
      rainProbabilityPercent: 5,
      windSpeedKmh: 12,
      uvIndex: 7,
      condition: 'Sunny',
      advisory: 'Clear sunny sky. Favorable window for foliar nutrient spraying and seed germination monitoring.',
    },
    {
      date: '2026-10-26',
      dayName: 'Monday',
      tempMax: 30,
      tempMin: 18,
      humidityPercent: 64,
      rainProbabilityPercent: 15,
      windSpeedKmh: 14,
      uvIndex: 6,
      condition: 'Partly Cloudy',
      advisory: 'Mild humidity increase. Good conditions for afternoon drip irrigation cycles.',
    },
    {
      date: '2026-10-27',
      dayName: 'Tuesday',
      tempMax: 29,
      tempMin: 18,
      humidityPercent: 78,
      rainProbabilityPercent: 60,
      windSpeedKmh: 20,
      uvIndex: 4,
      condition: 'Scattered Showers',
      advisory: 'High rain probability. Postpone all chemical insecticide spraying to prevent wash-off.',
    },
    {
      date: '2026-10-28',
      dayName: 'Wednesday',
      tempMax: 27,
      tempMin: 17,
      humidityPercent: 82,
      rainProbabilityPercent: 40,
      windSpeedKmh: 16,
      uvIndex: 5,
      condition: 'Heavy Rain',
      advisory: 'Ensure drainage channels around low-lying chickpea beds are unclogged.',
    },
    {
      date: '2026-10-29',
      dayName: 'Thursday',
      tempMax: 28,
      tempMin: 16,
      humidityPercent: 66,
      rainProbabilityPercent: 10,
      windSpeedKmh: 11,
      uvIndex: 7,
      condition: 'Sunny',
      advisory: 'Skies clearing. Inspect fields for fungal spores or soil saturation.',
    },
  ],

  pestAlerts: [
    {
      id: 'pest-01',
      pestName: 'Fall Armyworm (Spodoptera frugiperda)',
      affectedCrops: ['Maize', 'Sorghum', 'Sweet Corn'],
      severity: 'Urgent',
      region: 'Central Malwa District',
      symptoms: 'Pinholes on young leaves, whorl feeding damage with sawdust-like frass.',
      biologicalControl: 'Release Trichogramma pretiosum egg parasitoids (50,000/ha) or apply Bacillus thuringiensis (Bt).',
      chemicalControl: 'Foliar application of Chlorantraniliprole 18.5% SC @ 0.4 ml/liter in extreme infestation.',
      reportedDate: '2026-10-24',
      issuedBy: 'Krishi Vigyan Kendra Directorate',
    },
    {
      id: 'pest-02',
      pestName: 'Gram Pod Borer (Helicoverpa armigera)',
      affectedCrops: ['Chickpea (Chana)', 'Pigeonpea', 'Tomato'],
      severity: 'High',
      region: 'Narmada Valley Agro Zone',
      symptoms: 'Caterpillars bore holes into young developing pods and consume seed kernels.',
      biologicalControl: 'Install Pheromone traps @ 5 traps/acre. Spray 5% Neem Seed Kernel Extract (NSKE).',
      chemicalControl: 'Emamectin benzoate 5% SG @ 4g / 10L water during dusk hours.',
      reportedDate: '2026-10-22',
      issuedBy: 'State Agronomy Extension Cell',
    },
    {
      id: 'pest-03',
      pestName: 'Mustard Aphid (Lipaphis erysimi)',
      affectedCrops: ['Mustard', 'Rapeseed'],
      severity: 'Moderate',
      region: 'Regional Division Western Block',
      symptoms: 'Colonies on floral buds causing leaf curling and honeydew mold secretion.',
      biologicalControl: 'Encourage Ladybird beetles (Coccinellids). Spray diluted potassium soap solution.',
      chemicalControl: 'Dimethoate 30% EC @ 1.5 ml/liter if pest threshold exceeds 15 aphids/plant.',
      reportedDate: '2026-10-20',
      issuedBy: 'Dr. Sunita Deshmukh (AgriTech Expert)',
    },
  ],

  resources: [
    {
      id: 'res-01',
      title: 'Certified High-Yield Wheat Seeds (HI-8759)',
      category: 'Seeds',
      price: 1850,
      unit: '40 kg bag',
      rating: 4.8,
      reviewsCount: 142,
      inStock: true,
      stockCount: 85,
      brand: 'ICAR Certified Seeds',
      description: 'Drought-tolerant durum wheat variety with rust resistance and 52 quintals/hectare average yield potential.',
      dosageOrUsage: 'Seed rate: 100 kg/ha with seed treatment.',
      certifiedOrganic: false,
    },
    {
      id: 'res-02',
      title: 'Liquid Bio-NPK Consortium (Living Microbial Culture)',
      category: 'Organic Fertilizers',
      price: 620,
      unit: '1 Liter Bottle',
      rating: 4.9,
      reviewsCount: 219,
      inStock: true,
      stockCount: 120,
      brand: 'BioAgri Solutions',
      description: 'Triple-strain bio-fertilizer that fixes atmospheric Nitrogen, mobilizes Phosphorus, and solubilizes Potassium organically.',
      dosageOrUsage: 'Drip application: 1L per acre diluted in 200L water.',
      certifiedOrganic: true,
    },
    {
      id: 'res-03',
      title: 'Neem Azadirachtin 10,000 PPM Bio-Pesticide',
      category: 'Bio-Pesticides',
      price: 890,
      unit: '500 ml',
      rating: 4.7,
      reviewsCount: 94,
      inStock: true,
      stockCount: 65,
      brand: 'GreenShield Botanicals',
      description: 'Pure cold-pressed botanical insecticide repelling 200+ leaf-sucking pests without harming pollinators or honeybees.',
      dosageOrUsage: '2 ml to 3 ml per liter of water.',
      certifiedOrganic: true,
    },
    {
      id: 'res-04',
      title: 'Pressure-Compensating Inline Drip Kit (1 Acre Complete)',
      category: 'Micro-Irrigation',
      price: 14200,
      unit: 'Full Set',
      rating: 4.9,
      reviewsCount: 58,
      inStock: true,
      stockCount: 22,
      brand: 'AquaFlow AgriTech',
      description: 'Includes 16mm UV-resistant drip lateral, screen filter, venturi injector, flush valves, and connectors for 90% water saving.',
      dosageOrUsage: 'Ideal for row crops with 40cm emitter spacing.',
      certifiedOrganic: false,
    },
    {
      id: 'res-05',
      title: 'Rechargeable 16L Battery Knapsack Sprayer',
      category: 'Tools & Equipment',
      price: 3450,
      unit: 'Piece',
      rating: 4.6,
      reviewsCount: 178,
      inStock: true,
      stockCount: 40,
      brand: 'KisanShakti Tools',
      description: 'Dual-speed 12V 12Ah lithium battery pump with stainless steel telescopic lance and 4 interchangeable brass nozzles.',
      dosageOrUsage: 'Covers up to 25 tanks per single recharge.',
      certifiedOrganic: false,
    },
    {
      id: 'res-06',
      title: 'Granular Mycorrhizal Bio-Stimulant (VAM)',
      category: 'Organic Fertilizers',
      price: 780,
      unit: '4 kg pack',
      rating: 4.8,
      reviewsCount: 110,
      inStock: true,
      stockCount: 50,
      brand: 'RootRevive Soil Sciences',
      description: 'Symbiotic fungal inoculant expanding root surface area by 300% for enhanced moisture and phosphorus uptake.',
      dosageOrUsage: '4 kg per acre applied during basal fertilization.',
      certifiedOrganic: true,
    },
  ],

  orders: [
    {
      id: 'ord-1001',
      userId: 'usr-farmer-1',
      userName: 'Ramesh Patel',
      items: [
        {
          resourceId: 'res-02',
          title: 'Liquid Bio-NPK Consortium (Living Microbial Culture)',
          price: 620,
          quantity: 2,
          unit: '1 Liter Bottle',
        },
        {
          resourceId: 'res-03',
          title: 'Neem Azadirachtin 10,000 PPM Bio-Pesticide',
          price: 890,
          quantity: 1,
          unit: '500 ml',
        },
      ],
      totalAmount: 2130,
      shippingAddress: 'Village Sanwer, Dhar Road Post, Indore 453551',
      paymentMethod: 'Kisan Credit Card (KCC)' as const,
      paymentStatus: 'Paid' as const,
      status: 'In Transit' as const,
      createdAt: '2026-10-23T11:20:00Z',
      trackingNumber: 'AGRI-EXP-88921-IN',
    },
    {
      id: 'ord-1002',
      userId: 'usr-farmer-1',
      userName: 'Ramesh Patel',
      items: [
        {
          resourceId: 'res-05',
          title: 'Rechargeable 16L Battery Knapsack Sprayer',
          price: 3450,
          quantity: 1,
          unit: 'Piece',
        },
      ],
      totalAmount: 3450,
      shippingAddress: 'Village Sanwer, Dhar Road Post, Indore 453551',
      paymentMethod: 'UPI / Direct Bank' as const,
      paymentStatus: 'Paid' as const,
      status: 'Delivered' as const,
      createdAt: '2026-10-14T14:45:00Z',
      trackingNumber: 'AGRI-EXP-77210-IN',
    },
  ],

  consultations: [
    {
      id: 'cons-01',
      farmerId: 'usr-farmer-1',
      farmerName: 'Ramesh Patel',
      cropName: 'Durum Wheat',
      subject: 'Yellowing of lower leaves during tillering stage',
      symptoms: 'Older leaves turning chlorotic from tip downwards. Recent soil test showed moderate nitrogen depletion in plot 2.',
      status: 'Prescription Provided' as const,
      createdAt: '2026-10-19T10:15:00Z',
      expertName: 'Dr. Sunita Deshmukh',
      expertPrescription: 'Classic mobile Nitrogen deficiency exacerbated by heavy irrigation. Apply top-dressing of 25 kg Urea per acre followed by light drip irrigation. Supplement with 0.5% Zinc sulphate foliar spray.',
      messages: [
        {
          id: 'msg-1',
          senderName: 'Ramesh Patel',
          senderRole: 'farmer' as const,
          text: 'Namaste Doctor, noticing pale yellow tips on lower wheat foliage after third irrigation. Should I apply fungicide or nitrogen?',
          createdAt: '2026-10-19T10:15:00Z',
        },
        {
          id: 'msg-2',
          senderName: 'Dr. Sunita Deshmukh',
          senderRole: 'expert' as const,
          text: 'This is nutrient chlorosis, not fungal rust. Apply the recommended Urea dosage immediately before stem elongation.',
          createdAt: '2026-10-19T16:30:00Z',
        },
      ],
    },
  ],

  forumPosts: [
    {
      id: 'forum-01',
      authorId: 'usr-farmer-1',
      authorName: 'Ramesh Patel',
      authorRole: 'farmer' as const,
      title: 'Best companion crops with Gram (Chickpea) to repel Pod Borer naturally?',
      content: 'Has anyone experimented with planting border rows of African Marigold or Coriander around Chickpea fields? Looking for organic trap crop experiences.',
      category: 'Organic Farming' as const,
      upvotes: 18,
      upvotedBy: ['usr-farmer-1'],
      createdAt: '2026-10-21T09:00:00Z',
      replies: [
        {
          id: 'rep-01',
          authorName: 'Dr. Sunita Deshmukh',
          authorRole: 'expert' as const,
          text: 'Excellent practice! Planting 1 row of Coriander every 10 rows of Chickpea attracts predatory wasps (Campoletis chlorideae) which feed on young borer larvae, reducing damage by up to 35%.',
          createdAt: '2026-10-21T11:40:00Z',
        },
        {
          id: 'rep-02',
          authorName: 'Balwinder Singh',
          authorRole: 'farmer' as const,
          text: 'We tried Marigold trap borders last season in Punjab, it worked great for trapping adult moths before they entered the main chickpea patch.',
          createdAt: '2026-10-22T08:15:00Z',
        },
      ],
    },
    {
      id: 'forum-02',
      authorId: 'usr-expert-1',
      authorName: 'Dr. Sunita Deshmukh',
      authorRole: 'expert' as const,
      title: 'Managing High Soil Salinity in Canal-Irrigated Areas: Key Steps',
      content: 'Due to repeated surface flooding without adequate sub-surface drainage, several farms are recording EC > 1.8 dS/m. Here is our step-by-step soil reclamation protocol.',
      category: 'Soil Management' as const,
      upvotes: 34,
      upvotedBy: [],
      createdAt: '2026-10-17T14:30:00Z',
      replies: [
        {
          id: 'rep-03',
          authorName: 'Ramesh Patel',
          authorRole: 'farmer' as const,
          text: 'Doctor, how much agricultural gypsum is recommended for black cotton soil with pH 8.3?',
          createdAt: '2026-10-18T10:05:00Z',
        },
      ],
    },
  ],
};

// Express App Initialization
async function startServer() {
  const app = express();
  app.use(express.json());

  // JWT Helper functions
  const generateToken = (user: DbUser) => {
    return jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        region: user.region,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  };

  const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }
      (req as any).user = decoded;
      next();
    });
  };

  // --- AUTH ROUTES ---
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, password, phone, role = 'farmer', region, farmSizeAcres, primaryCrops } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const newUser: DbUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      passwordHash: bcrypt.hashSync(password, 8),
      phone: phone || '',
      role: (role === 'admin' || role === 'expert') ? role : 'farmer',
      region: region || 'Agronomy Zone',
      farmSizeAcres: farmSizeAcres ? Number(farmSizeAcres) : 5,
      primaryCrops: primaryCrops || ['Wheat', 'Chickpea'],
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
    };

    db.users.push(newUser);
    const token = generateToken(newUser);
    const { passwordHash, ...userProfile } = newUser;
    return res.status(201).json({ user: userProfile, token });
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password, demoRole } = req.body;

    // Fast demo login handling
    if (demoRole) {
      const demoUser = db.users.find(u => u.role === demoRole);
      if (demoUser) {
        const token = generateToken(demoUser);
        const { passwordHash, ...userProfile } = demoUser;
        return res.json({ user: userProfile, token });
      }
    }

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. User not found.' });
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials. Incorrect password.' });
    }

    const token = generateToken(user);
    const { passwordHash, ...userProfile } = user;
    return res.json({ user: userProfile, token });
  });

  app.get('/api/auth/me', authenticateToken, (req: Request, res: Response) => {
    const userPayload = (req as any).user;
    const user = db.users.find(u => u.id === userPayload.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { passwordHash, ...profile } = user;
    return res.json({ user: profile });
  });

  // --- FARMS ROUTES ---
  app.get('/api/farms', (req: Request, res: Response) => {
    return res.json(db.farms);
  });

  app.post('/api/farms', (req: Request, res: Response) => {
    const { name, location, district, state, sizeAcres, soilType, irrigationType } = req.body;
    if (!name || !sizeAcres) {
      return res.status(400).json({ error: 'Farm name and size in acres are required' });
    }
    const newFarm = {
      id: `farm-${Date.now()}`,
      userId: req.body.userId || 'usr-farmer-1',
      name,
      location: location || district || 'Agricultural District',
      district: district || 'Central District',
      state: state || 'Madhya Pradesh',
      sizeAcres: Number(sizeAcres),
      soilType: soilType || 'Black',
      irrigationType: irrigationType || 'Drip Irrigation',
      createdAt: new Date().toISOString(),
      activeCropsCount: 0,
      healthIndex: 85,
    };
    db.farms.push(newFarm);
    return res.status(201).json(newFarm);
  });

  app.put('/api/farms/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = db.farms.findIndex(f => f.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Farm not found' });
    }
    db.farms[index] = { ...db.farms[index], ...req.body, id };
    return res.json(db.farms[index]);
  });

  app.delete('/api/farms/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    db.farms = db.farms.filter(f => f.id !== id);
    return res.json({ success: true, message: 'Farm deleted' });
  });

  // --- CROPS ROUTES ---
  app.get('/api/crops', (req: Request, res: Response) => {
    return res.json(db.crops);
  });

  app.post('/api/crops', (req: Request, res: Response) => {
    const { farmId, cropName, variety, stage, sowingDate, expectedHarvestDate, acresPlanted } = req.body;
    if (!cropName || !farmId) {
      return res.status(400).json({ error: 'Crop name and farm ID are required' });
    }
    const farm = db.farms.find(f => f.id === farmId);
    const newCrop = {
      id: `crop-${Date.now()}`,
      farmId,
      farmName: farm ? farm.name : 'Primary Farm',
      cropName,
      variety: variety || 'Standard High-Yield',
      stage: stage || 'Sowing',
      progressPercent: stage === 'Sowing' ? 10 : 35,
      sowingDate: sowingDate || new Date().toISOString().split('T')[0],
      expectedHarvestDate: expectedHarvestDate || '2026-12-30',
      acresPlanted: Number(acresPlanted) || 2.0,
      healthStatus: 'Excellent' as const,
      soilMoisturePercent: 65,
      ndviScore: 0.75,
      waterRequirementWeeklyLiters: 12000,
      pestRisk: 'Low' as const,
      notes: req.body.notes || 'Crop planted as per seasonal calendar.',
    };
    db.crops.push(newCrop);
    if (farm) {
      farm.activeCropsCount += 1;
    }
    return res.status(201).json(newCrop);
  });

  app.put('/api/crops/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = db.crops.findIndex(c => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Crop not found' });
    }
    db.crops[index] = { ...db.crops[index], ...req.body, id };
    return res.json(db.crops[index]);
  });

  app.delete('/api/crops/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const crop = db.crops.find(c => c.id === id);
    if (crop) {
      const farm = db.farms.find(f => f.id === crop.farmId);
      if (farm && farm.activeCropsCount > 0) farm.activeCropsCount -= 1;
    }
    db.crops = db.crops.filter(c => c.id !== id);
    return res.json({ success: true, message: 'Crop record deleted' });
  });

  // --- SOIL HEALTH ANALYSIS ---
  app.get('/api/soil', (req: Request, res: Response) => {
    return res.json(db.soilTests);
  });

  app.post('/api/soil', (req: Request, res: Response) => {
    const { farmId, nitrogenKgPerHa, phosphorusKgPerHa, potassiumKgPerHa, ph, organicCarbonPercent } = req.body;
    const farm = db.farms.find(f => f.id === farmId);
    
    const n = Number(nitrogenKgPerHa) || 280;
    const p = Number(phosphorusKgPerHa) || 25;
    const k = Number(potassiumKgPerHa) || 200;
    const phVal = Number(ph) || 7.0;
    const oc = Number(organicCarbonPercent) || 0.6;

    let rating: 'Optimal' | 'Moderately Deficient' | 'Severely Deficient' | 'Excessive' = 'Optimal';
    const recs: string[] = [];

    if (n < 250) {
      rating = 'Moderately Deficient';
      recs.push(`Nitrogen level is low (${n} kg/ha). Apply split application of Urea with Azotobacter.`);
    }
    if (p < 20) {
      rating = 'Moderately Deficient';
      recs.push(`Phosphorus level is suboptimal (${p} kg/ha). Incorporate Single Super Phosphate (SSP) at root zone.`);
    }
    if (oc < 0.5) {
      rating = 'Moderately Deficient';
      recs.push(`Organic carbon is low (${oc}%). Add vermicompost or composted cow manure to enhance microbial activity.`);
    }
    if (phVal < 6.0) {
      recs.push(`Soil is moderately acidic (pH ${phVal}). Apply agricultural lime to buffer acidity.`);
    } else if (phVal > 8.0) {
      recs.push(`Soil is alkaline (pH ${phVal}). Incorporate agricultural gypsum or elemental sulfur.`);
    }
    if (recs.length === 0) {
      recs.push('All macronutrient levels are within target benchmarks for standard seasonal rotation.');
    }

    const newSoilTest = {
      id: `soil-${Date.now()}`,
      farmId: farmId || 'farm-01',
      farmName: farm ? farm.name : 'Farm Plot',
      testDate: new Date().toISOString().split('T')[0],
      nitrogenKgPerHa: n,
      phosphorusKgPerHa: p,
      potassiumKgPerHa: k,
      ph: phVal,
      organicCarbonPercent: oc,
      moisturePercent: req.body.moisturePercent ? Number(req.body.moisturePercent) : 62,
      electricalConductivity: req.body.electricalConductivity ? Number(req.body.electricalConductivity) : 0.4,
      rating,
      recommendations: recs,
      recommendedFertilizer: {
        ureaKgPerAcre: n < 280 ? 40 : 25,
        dapKgPerAcre: p < 25 ? 30 : 15,
        mopKgPerAcre: k < 200 ? 25 : 15,
        bioFertilizer: 'Phosphate Solubilizing Bacteria + Mycorrhiza',
      },
    };
    db.soilTests.unshift(newSoilTest);
    return res.status(201).json(newSoilTest);
  });

  // --- WEATHER & PEST FORECASTS ---
  app.get('/api/weather', (req: Request, res: Response) => {
    return res.json({
      location: 'Malwa Agro-Climatic Zone, Central India',
      currentTemp: 31,
      currentHumidity: 58,
      windSpeed: '12 km/h NE',
      airQualityIndex: 'Good (44)',
      forecast: db.weatherForecast,
    });
  });

  app.get('/api/pest-alerts', (req: Request, res: Response) => {
    return res.json(db.pestAlerts);
  });

  app.post('/api/pest-alerts', (req: Request, res: Response) => {
    const { pestName, affectedCrops, severity, region, symptoms, biologicalControl, chemicalControl } = req.body;
    if (!pestName || !affectedCrops) {
      return res.status(400).json({ error: 'Pest name and affected crops are required' });
    }
    const newAlert = {
      id: `pest-${Date.now()}`,
      pestName,
      affectedCrops: Array.isArray(affectedCrops) ? affectedCrops : [affectedCrops],
      severity: severity || 'High',
      region: region || 'All Regional Districts',
      symptoms: symptoms || 'Foliar or root damage observed in local surveys.',
      biologicalControl: biologicalControl || 'Release predatory bio-agents or apply neem botanical spray.',
      chemicalControl: chemicalControl || 'Contact agricultural extension office for regulated pesticide guidance.',
      reportedDate: new Date().toISOString().split('T')[0],
      issuedBy: req.body.issuedBy || 'AgriTech Central Command',
    };
    db.pestAlerts.unshift(newAlert);
    return res.status(201).json(newAlert);
  });

  // --- RESOURCES & MARKETPLACE ---
  app.get('/api/resources', (req: Request, res: Response) => {
    return res.json(db.resources);
  });

  app.post('/api/resources', (req: Request, res: Response) => {
    const { title, category, price, unit, brand, description, dosageOrUsage, certifiedOrganic, stockCount } = req.body;
    if (!title || !price || !category) {
      return res.status(400).json({ error: 'Title, category, and price are required' });
    }
    const newResource = {
      id: `res-${Date.now()}`,
      title,
      category,
      price: Number(price),
      unit: unit || 'Piece',
      rating: 5.0,
      reviewsCount: 1,
      inStock: true,
      stockCount: Number(stockCount) || 50,
      brand: brand || 'AgriTech Approved',
      description: description || 'Certified farm input.',
      dosageOrUsage: dosageOrUsage || '',
      certifiedOrganic: Boolean(certifiedOrganic),
    };
    db.resources.push(newResource);
    return res.status(201).json(newResource);
  });

  // --- ORDERS ---
  app.get('/api/orders', (req: Request, res: Response) => {
    return res.json(db.orders);
  });

  app.post('/api/orders', (req: Request, res: Response) => {
    const { items, totalAmount, shippingAddress, paymentMethod, userName, userId } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order items are required' });
    }
    const newOrder = {
      id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: userId || 'usr-farmer-1',
      userName: userName || 'Ramesh Patel',
      items,
      totalAmount: Number(totalAmount),
      shippingAddress: shippingAddress || 'Sanwer Rural Route, Indore MP',
      paymentMethod: paymentMethod || 'Kisan Credit Card (KCC)',
      paymentStatus: 'Paid' as const,
      status: 'Order Placed' as const,
      createdAt: new Date().toISOString(),
      trackingNumber: `AGRI-EXP-${Math.floor(10000 + Math.random() * 90000)}-IN`,
    };
    db.orders.unshift(newOrder);
    return res.status(201).json(newOrder);
  });

  app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const order = db.orders.find(o => o.id === id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    order.status = status;
    return res.json(order);
  });

  // --- EXPERT CONSULTATIONS ---
  app.get('/api/consultations', (req: Request, res: Response) => {
    return res.json(db.consultations);
  });

  app.post('/api/consultations', (req: Request, res: Response) => {
    const { farmerId, farmerName, cropName, subject, symptoms } = req.body;
    if (!cropName || !subject || !symptoms) {
      return res.status(400).json({ error: 'Crop name, subject, and symptoms are required' });
    }
    const newConsultation = {
      id: `cons-${Date.now()}`,
      farmerId: farmerId || 'usr-farmer-1',
      farmerName: farmerName || 'Ramesh Patel',
      cropName,
      subject,
      symptoms,
      status: 'Open' as const,
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderName: farmerName || 'Ramesh Patel',
          senderRole: 'farmer' as const,
          text: symptoms,
          createdAt: new Date().toISOString(),
        },
      ],
    };
    db.consultations.unshift(newConsultation);
    return res.status(201).json(newConsultation);
  });

  app.post('/api/consultations/:id/reply', (req: Request, res: Response) => {
    const { id } = req.params;
    const { senderName, senderRole, text, prescription } = req.body;
    const consultation = db.consultations.find(c => c.id === id);
    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }
    consultation.messages.push({
      id: `msg-${Date.now()}`,
      senderName: senderName || 'Agronomist',
      senderRole: senderRole || 'expert',
      text,
      createdAt: new Date().toISOString(),
    });
    if (prescription) {
      consultation.expertPrescription = prescription;
      consultation.expertName = senderName;
      consultation.status = 'Prescription Provided';
    }
    return res.json(consultation);
  });

  // --- FORUM & KNOWLEDGE SHARING ---
  app.get('/api/forum', (req: Request, res: Response) => {
    return res.json(db.forumPosts);
  });

  app.post('/api/forum', (req: Request, res: Response) => {
    const { title, content, category, authorName, authorRole, authorId } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    const newPost = {
      id: `forum-${Date.now()}`,
      authorId: authorId || 'usr-farmer-1',
      authorName: authorName || 'Farmer Ramesh',
      authorRole: authorRole || 'farmer',
      title,
      content,
      category: category || 'Organic Farming',
      upvotes: 1,
      upvotedBy: [authorId || 'usr-farmer-1'],
      createdAt: new Date().toISOString(),
      replies: [],
    };
    db.forumPosts.unshift(newPost);
    return res.status(201).json(newPost);
  });

  app.post('/api/forum/:id/reply', (req: Request, res: Response) => {
    const { id } = req.params;
    const { authorName, authorRole, text } = req.body;
    const post = db.forumPosts.find(p => p.id === id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const newReply = {
      id: `rep-${Date.now()}`,
      authorName: authorName || 'Community Member',
      authorRole: authorRole || 'farmer',
      text,
      createdAt: new Date().toISOString(),
    };
    post.replies.push(newReply);
    return res.json(post);
  });

  app.post('/api/forum/:id/upvote', (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId } = req.body;
    const post = db.forumPosts.find(p => p.id === id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const hasUpvoted = post.upvotedBy.includes(userId);
    if (hasUpvoted) {
      post.upvotes -= 1;
      post.upvotedBy = post.upvotedBy.filter(uid => uid !== userId);
    } else {
      post.upvotes += 1;
      post.upvotedBy.push(userId);
    }
    return res.json(post);
  });

  // --- ADMIN STATS ---
  app.get('/api/admin/stats', (req: Request, res: Response) => {
    const totalAcreage = db.farms.reduce((acc, f) => acc + f.sizeAcres, 0);
    const totalRevenue = db.orders.reduce((acc, o) => acc + o.totalAmount, 0);
    return res.json({
      totalFarmers: db.users.filter(u => u.role === 'farmer').length,
      totalExperts: db.users.filter(u => u.role === 'expert').length,
      totalFarms: db.farms.length,
      monitoredAcreage: totalAcreage,
      activeCrops: db.crops.length,
      activePestAlerts: db.pestAlerts.length,
      marketplaceOrdersCount: db.orders.length,
      marketplaceRevenue: totalRevenue,
      averageSoilHealthIndex: 85,
    });
  });

  // Integrate Vite dev middleware or serve production static files
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`AgriTech Express Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
