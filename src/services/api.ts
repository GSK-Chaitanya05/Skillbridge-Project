import { Farm, Crop, SoilTest, PestAlert, ResourceItem, Order, Consultation, ForumPost } from '../types';

const getHeaders = () => {
  const token = localStorage.getItem('agritech_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Farms
  getFarms: async (): Promise<Farm[]> => {
    const res = await fetch('/api/farms', { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch farms');
    return res.json();
  },
  createFarm: async (farmData: Partial<Farm>): Promise<Farm> => {
    const res = await fetch('/api/farms', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(farmData),
    });
    if (!res.ok) throw new Error('Failed to create farm');
    return res.json();
  },
  deleteFarm: async (id: string): Promise<void> => {
    const res = await fetch(`/api/farms/${id}`, { method: 'DELETE', headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to delete farm');
  },

  // Crops
  getCrops: async (): Promise<Crop[]> => {
    const res = await fetch('/api/crops', { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch crops');
    return res.json();
  },
  createCrop: async (cropData: Partial<Crop>): Promise<Crop> => {
    const res = await fetch('/api/crops', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(cropData),
    });
    if (!res.ok) throw new Error('Failed to create crop');
    return res.json();
  },
  updateCrop: async (id: string, cropData: Partial<Crop>): Promise<Crop> => {
    const res = await fetch(`/api/crops/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(cropData),
    });
    if (!res.ok) throw new Error('Failed to update crop');
    return res.json();
  },
  deleteCrop: async (id: string): Promise<void> => {
    const res = await fetch(`/api/crops/${id}`, { method: 'DELETE', headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to delete crop');
  },

  // Soil
  getSoilTests: async (): Promise<SoilTest[]> => {
    const res = await fetch('/api/soil', { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch soil tests');
    return res.json();
  },
  createSoilTest: async (testData: Partial<SoilTest>): Promise<SoilTest> => {
    const res = await fetch('/api/soil', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(testData),
    });
    if (!res.ok) throw new Error('Failed to log soil test');
    return res.json();
  },

  // Weather & Alerts
  getWeather: async (): Promise<any> => {
    const res = await fetch('/api/weather', { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch weather');
    return res.json();
  },
  getPestAlerts: async (): Promise<PestAlert[]> => {
    const res = await fetch('/api/pest-alerts', { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch pest alerts');
    return res.json();
  },
  createPestAlert: async (alertData: Partial<PestAlert>): Promise<PestAlert> => {
    const res = await fetch('/api/pest-alerts', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(alertData),
    });
    if (!res.ok) throw new Error('Failed to broadcast pest alert');
    return res.json();
  },

  // Marketplace & Resources
  getResources: async (): Promise<ResourceItem[]> => {
    const res = await fetch('/api/resources', { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch resources');
    return res.json();
  },
  createResource: async (resourceData: Partial<ResourceItem>): Promise<ResourceItem> => {
    const res = await fetch('/api/resources', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(resourceData),
    });
    if (!res.ok) throw new Error('Failed to create resource item');
    return res.json();
  },

  // Orders
  getOrders: async (): Promise<Order[]> => {
    const res = await fetch('/api/orders', { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },
  createOrder: async (orderData: Partial<Order>): Promise<Order> => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData),
    });
    if (!res.ok) throw new Error('Failed to create order');
    return res.json();
  },
  updateOrderStatus: async (id: string, status: string): Promise<Order> => {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update order status');
    return res.json();
  },

  // Consultations
  getConsultations: async (): Promise<Consultation[]> => {
    const res = await fetch('/api/consultations', { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch consultations');
    return res.json();
  },
  createConsultation: async (data: Partial<Consultation>): Promise<Consultation> => {
    const res = await fetch('/api/consultations', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create consultation');
    return res.json();
  },
  replyConsultation: async (id: string, replyData: { senderName: string; senderRole: string; text: string; prescription?: string }): Promise<Consultation> => {
    const res = await fetch(`/api/consultations/${id}/reply`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(replyData),
    });
    if (!res.ok) throw new Error('Failed to send consultation reply');
    return res.json();
  },

  // Forum
  getForumPosts: async (): Promise<ForumPost[]> => {
    const res = await fetch('/api/forum', { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch forum posts');
    return res.json();
  },
  createForumPost: async (postData: Partial<ForumPost>): Promise<ForumPost> => {
    const res = await fetch('/api/forum', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(postData),
    });
    if (!res.ok) throw new Error('Failed to create forum post');
    return res.json();
  },
  replyForumPost: async (id: string, replyData: { authorName: string; authorRole: string; text: string }): Promise<ForumPost> => {
    const res = await fetch(`/api/forum/${id}/reply`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(replyData),
    });
    if (!res.ok) throw new Error('Failed to reply to post');
    return res.json();
  },
  upvoteForumPost: async (id: string, userId: string): Promise<ForumPost> => {
    const res = await fetch(`/api/forum/${id}/upvote`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) throw new Error('Failed to upvote post');
    return res.json();
  },

  // Admin stats
  getAdminStats: async (): Promise<any> => {
    const res = await fetch('/api/admin/stats', { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch admin statistics');
    return res.json();
  },
};
