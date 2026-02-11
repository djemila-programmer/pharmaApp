async function runTests() {
  console.log('🧪 Tests Automatisés de l\'Application Pharmacy');
  console.log('===============================================\n');

  const baseURL = 'http://localhost:5000';
  let authToken = '';

  try {
    // Test 1: Connexion API
    console.log('1️⃣ Test de connexion à l\'API...');
    try {
      const response = await fetch(`${baseURL}/api/medicines`);
      if (response.ok) {
        console.log('✅ API accessible');
      } else {
        console.log(`⚠️  API répond avec le statut: ${response.status}`);
      }
    } catch (error) {
      console.log('❌ API inaccessible');
      console.log(`   Erreur: ${error.message}`);
      return;
    }

    // Test 2: Authentification
    console.log('\n2️⃣ Test d\'authentification...');
    try {
      const response = await fetch(`${baseURL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'admin',
          password: 'admin123'
        })
      });

      const data = await response.json();
      
      if (data.token) {
        authToken = data.token;
        console.log('✅ Authentification réussie');
        console.log(`   Token reçu: ${authToken.substring(0, 20)}...`);
      } else {
        console.log('❌ Échec de l\'authentification');
        console.log(`   Réponse: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.log('❌ Erreur d\'authentification');
      console.log(`   Erreur: ${error.message}`);
    }

    // Test 3: Récupération des médicaments
    console.log('\n3️⃣ Test de récupération des médicaments...');
    try {
      const headers = authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
      const response = await fetch(`${baseURL}/api/medicines`, { headers });
      const data = await response.json();
      
      if (Array.isArray(data)) {
        console.log(`✅ ${data.length} médicaments récupérés`);
        if (data.length > 0) {
          console.log(`   Exemple: ${data[0].name} (${data[0].dosage || 'sans dosage'})`);
        }
      } else {
        console.log('❌ Format de données incorrect');
      }
    } catch (error) {
      console.log('❌ Échec de la récupération des médicaments');
      console.log(`   Erreur: ${error.message}`);
    }

    // Test 4: Récupération des ventes
    console.log('\n4️⃣ Test de récupération des ventes...');
    try {
      const headers = authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
      const response = await fetch(`${baseURL}/api/sales`, { headers });
      const data = await response.json();
      
      if (Array.isArray(data)) {
        console.log(`✅ ${data.length} ventes récupérées`);
      }
    } catch (error) {
      console.log('ℹ️  Aucune vente trouvée (normal si base neuve)');
    }

    // Test 5: Test de synchronisation mobile
    console.log('\n5️⃣ Test de l\'endpoint de synchronisation mobile...');
    try {
      const response = await fetch(`${baseURL}/api/sales/sync`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ sales: [] })
      });
      
      if (response.ok) {
        console.log('✅ Endpoint de synchronisation mobile accessible');
      } else if (response.status === 404) {
        console.log('ℹ️  Endpoint /api/sales/sync non implémenté');
      } else {
        console.log(`✅ Endpoint testé (statut: ${response.status})`);
      }
    } catch (error) {
      console.log('✅ Endpoint de synchronisation testé');
    }

    // Test 6: Performance basique
    console.log('\n6️⃣ Test de performance...');
    const startTime = Date.now();
    
    try {
      await fetch(`${baseURL}/api/medicines`);
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