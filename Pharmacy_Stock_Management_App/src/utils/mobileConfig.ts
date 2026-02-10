// Configuration pour l'intégration mobile
export const MOBILE_API_CONFIG = {
  // URLs possibles pour l'API mobile
  urls: [
    'http://localhost:5000/api/sales/mobile',     // Développement local
    'http://192.168.1.100:5000/api/sales/mobile', // Réseau local
    'http://10.0.2.2:5000/api/sales/mobile',      // Android emulator
    'http://localhost:3002/api/sales/mobile'      // Port alternatif
  ],
  
  // Timeout pour les requêtes (en millisecondes)
  timeout: 5000,
  
  // Nombre de tentatives
  maxRetries: 3
};

// Fonction utilitaire pour tester la connexion
export const testMobileConnection = async () => {
  console.log('🔄 Test de connexion aux APIs mobiles...');
  
  for (const url of MOBILE_API_CONFIG.urls) {
    try {
      console.log(`Testing: ${url}`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), MOBILE_API_CONFIG.timeout);
      
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          console.log(`✅ Connecté à: ${url}`);
          return { success: true, url, data: result.data };
        }
      }
    } catch (error) {
      console.log(`❌ Échec pour ${url}: ${error.message}`);
    }
  }
  
  console.log('❌ Aucune connexion établie');
  return { success: false, url: null, data: null };
};