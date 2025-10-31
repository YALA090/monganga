const HederaStorage = require('./index');

// Exemple d'utilisation de la classe HederaStorage
async function main() {
  try {
    // Création d'une instance de HederaStorage
    const hederaStorage = new HederaStorage();
    
    // Exemple 1: Stockage des données d'un utilisateur
    const userData = {
      id: 'user123',
      name: 'John Doe',
      email: 'john@example.com',
      age: 35,
      gender: 'male',
      weight: 75
    };
    
    console.log('Stockage des données utilisateur...');
    const userResult = await hederaStorage.storeUser(userData);
    console.log('Résultat:', userResult);
    
    // Exemple 2: Stockage des données d'une consultation
    const consultationData = {
      id: 'cons456',
      userId: 'user123',
      date: new Date().toISOString(),
      symptoms: 'Fièvre, maux de tête, fatigue',
      notes: 'Le patient présente des symptômes depuis 3 jours'
    };
    
    console.log('\nStockage des données de consultation...');
    const consultationResult = await hederaStorage.storeConsultation(consultationData);
    console.log('Résultat:', consultationResult);
    
    // Exemple 3: Stockage d'un diagnostic
    const diagnosisData = {
      id: 'diag789',
      consultationId: 'cons456',
      userId: 'user123',
      diagnosis: 'Grippe saisonnière',
      recommendations: 'Repos, hydratation, paracétamol si nécessaire',
      severity: 'modérée'
    };
    
    console.log('\nStockage des données de diagnostic...');
    const diagnosisResult = await hederaStorage.storeDiagnosis(diagnosisData);
    console.log('Résultat:', diagnosisResult);

    // --- PARTIE 2: RÉCUPÉRATION DES DONNÉES ---
    console.log('\n--- Récupération des données depuis Hedera ---');

    // Attendre quelques secondes pour que les données soient disponibles sur le mirror node
    console.log('Attente de 10 secondes pour la propagation des données sur le mirror node...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Récupération de l'utilisateur par son ID
    console.log(`\nRécupération de l\'utilisateur avec l\'ID: ${userData.id}`);
    const retrievedUser = await hederaStorage.retrieveById('users', userData.id);
    console.log('Utilisateur récupéré:', retrievedUser);

    // Récupération de l'historique complet de l'utilisateur
    console.log(`\nRécupération de l\'historique pour l\'utilisateur avec l\'ID: ${userData.id}`);
    const userHistory = await Promise.all([
        hederaStorage.retrieveConsultationsByUserId(userData.id),
        hederaStorage.retrieveDiagnosesByUserId(userData.id)
    ]);
    console.log('Historique récupéré:', {
        consultations: userHistory[0],
        diagnoses: userHistory[1]
    });

  } catch (error) {
    console.error('Erreur dans le programme principal:', error);
  }
}

// Exécution du programme principal
main().then(() => {
  console.log('Programme terminé avec succès');
}).catch(error => {
  console.error('Erreur lors de l\'exécution du programme:', error);
});