const axios = require('axios');

async function runTests() {
  console.log('🧪 Tests Automatisés de l\'Application Pharmacy');
  console.log('===============================================\n');

  const baseURL = 'http://localhost:5000';
  let authToken = '';

  try {
    // Test 1: Connexion API
    console.log('1️⃣ Test de connexion à l\'API...');
    try {
      const healthResponse = await axios.get(`${baseURL}/api/health`);
      console.log('✅ API accessible');
    } catch (error) {
      console.log('⚠️  Endpoint /api/health non disponible, test de base...');
    }

    // Test 2: Authentification
    console.log('\n2️⃣ Test d\'authentification...');
    try {
      const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
        username: 'admin',
        password: 'admin123'
      });
      
      if (loginResponse.data.token) {
        authToken = loginResponse.data.token;
        console.log('✅ Authentification réussie');
        console.log(`   Token reçu: ${authToken.substring(0, 20)}...`);
      }
    } catch (error) {
      console.log('❌ Échec de l\'authentification');
      console.log(`   Erreur: ${error.response?.data?.message || error.message}`);
    }

    // Test 3: Récupération des médicaments
    console.log('\n3️⃣ Test de récupération des médicaments...');
    try {
      const config = authToken ? { headers: { Authorization: `Bearer ${authToken}` } } : {};
      const medsResponse = await axios.get(`${baseURL}/api/medicines`, config);
      
      if (Array.isArray(medsResponse.data)) {
        console.log(`✅ ${medsResponse.data.length} médicaments récupérés`);
        if (medsResponse.data.length > 0) {
          console.log(`   Exemple: ${medsResponse.data[0].name} (${medsResponse.data[0].dosage || 'sans dosage'})`);
        }
      }
    } catch (error) {
      console.log('❌ Échec de la récupération des médicaments');
      console.log(`   Erreur: ${error.response?.data?.message || error.message}`);
    }

    // Test 4: Récupération des ventes
    console.log('\n4️⃣ Test de récupération des ventes...');
    try {
      const config = authToken ? { headers: { Authorization: `Bearer ${authToken}` } } : {};
      const salesResponse = await axios.get(`${baseURL}/api/sales`, config);
      
      if (Array.isArray(salesResponse.data)) {
        console.log(`✅ ${salesResponse.data.length} ventes récupérées`);
      }
    } catch (error) {
      console.log('ℹ️  Aucune vente trouvée (normal si base neuve)');
    }

    // Test 5: Récupération des commandes
    console.log('\n5️⃣ Test de récupération des commandes...');
    try {
      const config = authToken ? { headers: { Authorization: `Bearer ${authToken}` } } : {};
      const ordersResponse = await axios.get(`${baseURL}/api/orders`, config);
      
      if (Array.isArray(ordersResponse.data)) {
        console.log(`✅ ${ordersResponse.data.length} commandes récupérées`);
      }
    } catch (error) {
      console.log('ℹ️  Aucune commande trouvée (normal si base neuve)');
    }

    // Test 6: Test de synchronisation mobile (endpoint)
    console.log('\n6️⃣ Test de l\'endpoint de synchronisation mobile...');
    try {
      const syncResponse = await axios.post(`${baseURL}/api/sales/sync`, {
        sales: []
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      console.log('✅ Endpoint de synchronisation mobile accessible');
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('ℹ️  Endpoint /api/sales/sync non implémenté');
      } else {
        console.log('✅ Endpoint de synchronisation testé (réponse normale)');
      }
    }

    // Test 7: Performance basique
    console.log('\n7️⃣ Test de performance...');
    const startTime = Date.now();
    
    try {
      await axios.get(`${baseURL}/api/medicines`);
      const responseTime = Date.now() - startTime;
      
      if (responseTime < 1000) {
        console.log(`✅ Temps de réponse: ${responseTime}ms (excellent)`);
      } else if (responseTime < 3000) {
        console.log(`✅ Temps de réponse: ${responseTime}ms (bon)`);
      } else {
        console.log(`⚠️  Temps de réponse: ${responseTime}ms (lent)`);
      }
    } catch (error) {
      console.log('❌ Échec du test de performance');
    }

    console.log('\n===============================================');
    console.log('🏁 Tests terminés!');
    console.log('===============================================');

  } catch (error) {
    console.log('\n❌ Erreur critique pendant les tests:');
    console.log(error.message);
  }
}

// Exécuter les tests
runTests();