// Script de test pour l'intégration mobile
const testMobileIntegration = async () => {
  try {
    // URL de votre API mobile
    const MOBILE_API_URL = 'http://localhost:5000/api/sales/mobile';
    
    console.log('🔄 Test de connexion à l\'API mobile...');
    
    const response = await fetch(MOBILE_API_URL);
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Connexion réussie!');
      console.log(`📊 Ventes récupérées: ${result.count}`);
      console.log(`💰 Revenu total: ${result.totalRevenue} FCFA`);
      console.log('📦 Données:', result.data);
    } else {
      console.log('❌ Erreur API:', result.message);
    }
  } catch (error) {
    console.log('❌ Erreur de connexion:', error.message);
    console.log('💡 Assurez-vous que:');
    console.log('   1. Le serveur mobile tourne sur le port 5000');
    console.log('   2. L\'endpoint /api/sales/mobile existe');
    console.log('   3. CORS est configuré correctement');
  }
};

// Exécuter le test
testMobileIntegration();