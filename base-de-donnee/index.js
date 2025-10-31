const { Client, PrivateKey, TopicCreateTransaction, TopicMessageSubmitTransaction, TopicId } = require('@hashgraph/sdk');
require('dotenv').config();

// Configuration de la classe pour gérer le stockage de données sur Hedera
class HederaStorage {
  constructor() {
    // Vérification des variables d'environnement
    if (!process.env.HEDERA_ACCOUNT_ID || !process.env.HEDERA_PRIVATE_KEY) {
      throw new Error('Les variables d\'environnement HEDERA_ACCOUNT_ID et HEDERA_PRIVATE_KEY doivent être définies');
    }

    console.log("Initialisation du client Hedera avec les informations suivantes:");
    console.log("Account ID:", process.env.HEDERA_ACCOUNT_ID);
    console.log("Private Key (premiers caractères):", process.env.HEDERA_PRIVATE_KEY.substring(0, 5) + "...");

    try {
      // Initialisation du client Hedera (TestNet par défaut)
      this.client = Client.forTestnet().setOperator(
        process.env.HEDERA_ACCOUNT_ID,
        PrivateKey.fromStringECDSA(process.env.HEDERA_PRIVATE_KEY)
      );
      console.log("Client Hedera initialisé avec succès");
    } catch (error) {
      console.error("ERREUR lors de l'initialisation du client Hedera:", error);
      throw error;
    }

    // Stockage des IDs de topic pour différents types de données
    this.topics = {
      users: process.env.HEDERA_USERS_TOPIC_ID || null,
      consultations: process.env.HEDERA_CONSULTATIONS_TOPIC_ID || null,
      diagnoses: process.env.HEDERA_DIAGNOSES_TOPIC_ID || null
    };
    
    // Création immédiate des topics s'ils n'existent pas
    this.initializeTopics();
  }
  
  async initializeTopics() {
    console.log("Initialisation des topics Hedera...");
    try {
      for (const topicType of Object.keys(this.topics)) {
        if (!this.topics[topicType]) {
          console.log(`Création du topic ${topicType}...`);
          try {
            const topicId = await this.createTopic(topicType);
            this.topics[topicType] = topicId;
            console.log(`Topic ${topicType} créé avec succès: ${topicId}`);
          } catch (error) {
            console.error(`Erreur lors de la création du topic ${topicType}:`, error);
          }
        } else {
          console.log(`Topic ${topicType} déjà existant: ${this.topics[topicType]}`);
        }
      }
      console.log("Initialisation des topics terminée:", this.topics);
    } catch (error) {
      console.error("Erreur lors de l'initialisation des topics:", error);
    }
  }

  /**
   * Crée un nouveau topic sur Hedera pour stocker un type spécifique de données
   * @param {string} topicType - Type de données (users, consultations, diagnoses)
   * @param {string} memo - Description du topic
   * @returns {Promise<string>} - ID du topic créé
   */
  async createTopic(topicType, memo) {
    try {
      // Création d'un nouveau topic
      const transaction = new TopicCreateTransaction()
        .setSubmitKey(PrivateKey.fromStringECDSA(process.env.HEDERA_PRIVATE_KEY))
        .setTopicMemo(memo || `MONGANGA ${topicType} data`);

      // Exécution de la transaction
      const txResponse = await transaction.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);
      const topicId = receipt.topicId.toString();

      // Mise à jour du topic ID dans l'instance
      this.topics[topicType] = topicId;
      
      console.log(`Topic créé pour ${topicType}: ${topicId}`);
      return topicId;
    } catch (error) {
      console.error(`Erreur lors de la création du topic pour ${topicType}:`, error);
      throw error;
    }
  }

  /**
   * Stocke des données sur un topic Hedera
   * @param {string} topicType - Type de données (users, consultations, diagnoses)
   * @param {Object} data - Données à stocker
   * @returns {Promise<object>} - Résultat de la transaction
   */
  async storeData(topicType, data) {
    try {
      console.log(`Tentative de stockage de données pour ${topicType}...`);
      console.log(`État actuel du topic ${topicType}:`, this.topics[topicType]);
      
      // Vérification que le topic existe
      if (!this.topics[topicType]) {
        console.log(`Le topic ${topicType} n'existe pas encore, création en cours...`);
        try {
          this.topics[topicType] = await this.createTopic(topicType);
          console.log(`Nouveau topic ${topicType} créé avec ID:`, this.topics[topicType]);
        } catch (topicError) {
          console.error(`ERREUR lors de la création du topic ${topicType}:`, topicError);
          throw topicError;
        }
      }

      // Préparation des données (avec timestamp)
      const dataToStore = {
        ...data,
        timestamp: new Date().toISOString(),
        type: topicType
      };

      // Conversion en JSON
      const message = JSON.stringify(dataToStore);
      console.log(`Message préparé pour ${topicType}:`, message.substring(0, 100) + '...');

      console.log(`Envoi du message au topic ${topicType} (ID: ${this.topics[topicType]})...`);
      // Envoi du message au topic
      const transaction = new TopicMessageSubmitTransaction()
        .setTopicId(TopicId.fromString(this.topics[topicType]))
        .setMessage(message);

      // Exécution de la transaction
      console.log(`Exécution de la transaction...`);
      const txResponse = await transaction.execute(this.client);
      console.log(`Transaction exécutée, récupération du reçu...`);
      const receipt = await txResponse.getReceipt(this.client);
      
      console.log(`Données stockées sur le topic ${topicType} avec succès`);
      return {
        success: true,
        topicId: this.topics[topicType],
        transactionId: txResponse.transactionId.toString(),
        data: dataToStore
      };
    } catch (error) {
      console.error(`Erreur lors du stockage des données sur ${topicType}:`, error);
      throw error;
    }
  }

  /**
   * Stocke les données d'un utilisateur
   * @param {Object} userData - Données de l'utilisateur
   * @returns {Promise<object>} - Résultat de la transaction
   */
  async storeUser(userData) {
    return this.storeData('users', userData);
  }

  /**
   * Stocke les données d'une consultation
   * @param {Object} consultationData - Données de la consultation
   * @returns {Promise<object>} - Résultat de la transaction
   */
  async storeConsultation(consultationData) {
    return this.storeData('consultations', consultationData);
  }

  /**
   * Stocke les données d'un diagnostic
   * @param {Object} diagnosisData - Données du diagnostic
   * @returns {Promise<object>} - Résultat de la transaction
   */
  async storeDiagnosis(diagnosisData) {
    return this.storeData('diagnoses', diagnosisData);
  }

  /**
   * Récupère les messages d'un topic via l'API du mirror node
   * @param {string} topicId - ID du topic
   * @returns {Promise<Array<Object>>} - Tableau des messages décodés
   */
  async retrieveMessagesFromTopic(topicId) {
    if (!topicId) {
      return [];
    }
    // Utilisation de l'API REST du mirror node de testnet
    const url = `https://testnet.mirrornode.hedera.com/api/v1/topics/${topicId}/messages`;
    try {
      // fetch est disponible globalement dans les versions récentes de Node.js
      const response = await fetch(url);
      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Mirror node API request failed with status ${response.status}: ${errorBody}`);
        throw new Error(`Mirror node API request failed with status ${response.status}`);
      }
      const data = await response.json();
      if (!data.messages || data.messages.length === 0) {
        return [];
      }
      // Les messages sont encodés en base64
      return data.messages.map(msg => {
        try {
          const decodedMessage = Buffer.from(msg.message, 'base64').toString('utf-8');
          return JSON.parse(decodedMessage);
        } catch (e) {
          console.error('Error parsing message:', msg);
          return null; // or handle error appropriately
        }
      }).filter(Boolean); // Filter out nulls from parsing errors
    } catch (error) {
      console.error(`Error retrieving messages from topic ${topicId}:`, error);
      throw error;
    }
  }

  /**
   * Récupère un enregistrement par son ID depuis un topic
   * @param {string} topicType - Type de données (users, consultations, diagnoses)
   * @param {string} id - ID de l'enregistrement
   * @returns {Promise<Object|null>} - L'enregistrement trouvé ou null
   */
  async retrieveById(topicType, id) {
    const topicId = this.topics[topicType];
    if (!topicId) {
      console.log(`Topic ID for '${topicType}' is not configured.`);
      return null;
    }
    const allMessages = await this.retrieveMessagesFromTopic(topicId);
    const message = allMessages.reverse().find(msg => msg.id === id); // Find latest
    return message || null;
  }

  /**
   * Récupère toutes les consultations d'un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<Array<Object>>} - Tableau des consultations
   */
  async retrieveConsultationsByUserId(userId) {
    const topicId = this.topics['consultations'];
    if (!topicId) {
      console.log(`Topic ID for 'consultations' is not configured.`);
      return [];
    }
    const allMessages = await this.retrieveMessagesFromTopic(topicId);
    return allMessages.filter(msg => msg.userId === userId);
  }

  /**
   * Récupère tous les diagnostics d'un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<Array<Object>>} - Tableau des diagnostics
   */
  async retrieveDiagnosesByUserId(userId) {
    const topicId = this.topics['diagnoses'];
    if (!topicId) {
      console.log(`Topic ID for 'diagnoses' is not configured.`);
      return [];
    }
    const allMessages = await this.retrieveMessagesFromTopic(topicId);
    return allMessages.filter(msg => msg.userId === userId);
  }

  /**
   * Récupère un utilisateur par son email
   * @param {string} email - Email de l'utilisateur
   * @returns {Promise<Object|null>} - L'utilisateur trouvé ou null
   */
  async retrieveUserByEmail(email) {
    const topicId = this.topics['users'];
    if (!topicId) {
      console.log(`Topic ID for 'users' is not configured.`);
      return null;
    }
    const allMessages = await this.retrieveMessagesFromTopic(topicId);
    const user = allMessages.reverse().find(msg => msg.email === email); // Find latest
    return user || null;
  }
}

module.exports = HederaStorage;