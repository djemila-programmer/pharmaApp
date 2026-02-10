const bcrypt = require('bcryptjs');

// Les mots de passe affichés sur votre page de login
const passwords = {
  admin: 'admin@123',
  pharmacien: 'pharma!456'
};

console.log('='.repeat(70));
console.log('GÉNÉRATION DE HASH BCRYPT - Pharmacy Management System');
console.log('='.repeat(70));
console.log('');

async function generateHashes() {
  for (const [user, password] of Object.entries(passwords)) {
    console.log(`👤 Utilisateur: ${user}`);
    console.log(`🔑 Mot de passe: ${password}`);
    
    const hash = await bcrypt.hash(password, 10);
    
    console.log(`🔐 Hash bcrypt: ${hash}`);
    console.log(`📏 Longueur: ${hash.length} caractères`);
    
    // Vérification immédiate
    const isValid = await bcrypt.compare(password, hash);
    console.log(`✅ Vérification: ${isValid ? 'OK ✓' : 'ERREUR ✗'}`);
    
    console.log('');
    console.log(`📝 Commande SQL pour ${user}:`);
    console.log(`UPDATE user SET password = '${hash}' WHERE username = '${user}';`);
    console.log('');
    console.log('-'.repeat(70));
    console.log('');
  }
  
  console.log('='.repeat(70));
  console.log('✅ HASH GÉNÉRÉS AVEC SUCCÈS!');
  console.log('');
  console.log('📋 PROCHAINES ÉTAPES:');
  console.log('1. Ouvrez phpMyAdmin');
  console.log('2. Sélectionnez la base de données "pharmacydb"');
  console.log('3. Cliquez sur l\'onglet "SQL"');
  console.log('4. Copiez-collez les commandes UPDATE ci-dessus');
  console.log('5. Cliquez sur "Exécuter"');
  console.log('6. Testez la connexion avec:');
  console.log('   - admin / admin@123');
  console.log('   - pharmacien / pharma!456');
  console.log('='.repeat(70));
}

generateHashes().catch(console.error);