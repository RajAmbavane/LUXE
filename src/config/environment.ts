// Environment configuration for API endpoints
export const config = {
  // API base URL - automatically detects development vs production
  apiBaseUrl: window.location.hostname === 'localhost' 
    ? 'http://localhost:8000' 
    : '', // Use relative URLs in production
  
  // Feature flags
  features: {
    realTimeProcessing: true,
    aiAnalysis: true,
    visualAnalysis: true,
  },
  
  // App metadata
  app: {
    name: 'LuxeResolve Intelligence',
    version: '1.0.0',
    description: 'AI-powered fraud detection for luxury marketplaces'
  }
};

// Helper function to build API URLs
export function apiUrl(endpoint: string): string {
  return `${config.apiBaseUrl}${endpoint}`;
}