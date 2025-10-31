import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { ChatGroq } from '@langchain/groq';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents';
import { Client, PrivateKey } from '@hashgraph/sdk';
import { HederaLangchainToolkit, coreQueriesPlugin } from 'hedera-agent-kit';
import HederaStorage from './base-de-donnee/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const saltRounds = 10;
dotenv.config();

// Import de notre classe de stockage Hedera
let hederaStorage; // Sera initialisé après le démarrage du serveur

function createLLM() {
  if (process.env.GROQ_API_KEY) {
    return new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: 'mixtral-8x7b-32768',
    });
  }
  return null;
}

const app = express();

// Configuration de base
app.use(bodyParser.json());
app.use(cors());

// Middleware de logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  if (req.body) console.log('Body:', req.body);
  next();
});

// Routes API
app.get('/api/config', (req, res) => {
  console.log('GET /api/config called');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.json({ groqApiKey: process.env.GROQ_API_KEY });
});

// Route de diagnostic avec Hedera et Groq



app.post('/register', async (req, res) => {
  if (!hederaStorage) {
    return res.status(503).json({ error: 'Le service de stockage n\'est pas encore prêt. Veuillez réessayer dans quelques instants.' });
  }
  try {
    const userData = req.body;
    
    if (!userData.name || !userData.email || !userData.password) {
      return res.status(400).json({ error: 'Les champs nom, email et mot de passe sont requis' });
    }

    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    userData.id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    try {
      const userToStore = { ...userData, password: hashedPassword };
      const result = await hederaStorage.storeUser(userToStore);
      console.log('Utilisateur enregistré sur Hedera:', result);
      res.status(201).json({ success: true, userId: userData.id, message: 'Utilisateur enregistré avec succès'});
    } catch (storageError) {
      console.error('Erreur lors du stockage de l\\\'utilisateur sur Hedera:', storageError);
      res.status(500).json({ error: 'Erreur lors de l\\\'enregistrement sur Hedera', details: storageError.message });
    }
  } catch (error) {
    console.error('Erreur lors de l\\\'enregistrement de l\\\'utilisateur:', error);
    res.status(500).json({ error: 'Une erreur interne est survenue', details: error.message });
  }
});

app.post('/login', async (req, res) => {
    if (!hederaStorage) {
        return res.status(503).json({ error: 'Le service de stockage n\'est pas encore prêt. Veuillez réessayer dans quelques instants.' });
    }
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    try {
        const user = await hederaStorage.retrieveUserByEmail(email);
        if (user && user.password && await bcrypt.compare(password, user.password)) {
            res.json({ success: true, userId: user.id });
        } else {
            res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }
    } catch (error) {
        console.error(`Erreur lors de la connexion pour l'email ${email}:`, error);
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
});

app.get('/user/:userId', async (req, res) => {
  if (!hederaStorage) {
    return res.status(503).json({ error: 'Le service de stockage n\'est pas encore prêt. Veuillez réessayer dans quelques instants.' });
  }
  const { userId } = req.params;

  try {
    const user = await hederaStorage.retrieveById('users', userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'utilisateur ${userId}:`, error);
    res.status(500).json({ error: 'Erreur lors de la récupération des données depuis Hedera' });
  }
});

app.get('/history/:userId', async (req, res) => {
  if (!hederaStorage) {
    return res.status(503).json({ error: 'Le service de stockage n\'est pas encore prêt. Veuillez réessayer dans quelques instants.' });
  }
  const { userId } = req.params;

  try {
    const [consultations, diagnoses] = await Promise.all([
      hederaStorage.retrieveConsultationsByUserId(userId),
      hederaStorage.retrieveDiagnosesByUserId(userId)
    ]);
    res.json({ consultations, diagnoses });
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'historique pour l'utilisateur ${userId}:`, error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique depuis Hedera' });
  }
});

// Routes API
app.post('/diagnose', async (req, res) => {
  console.log('POST /diagnose called');
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);

  // Toujours définir le type de contenu comme JSON
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (!hederaStorage) {
    console.log('Service de stockage non disponible');
    return res.status(503).json({ 
      error: 'Le service de stockage n\'est pas encore prêt. Veuillez réessayer dans quelques instants.',
      status: 'error'
    });
  }

  try {
    const { symptoms, language, userId } = req.body;

    if (!symptoms) {
      console.log('Symptômes manquants dans la requête');
      return res.status(400).json({
        error: 'Les symptômes sont requis',
        status: 'error'
      });
    }

    console.log('Création du LLM avec la clé API:', process.env.GROQ_API_KEY);
    const llm = createLLM();
    if (!llm) {
      console.log('Échec de la création du LLM');
      return res.status(500).json({
        error: 'Le service de diagnostic n\'est pas configuré correctement.',
        status: 'error'
      });
    }

    if (!process.env.HEDERA_ACCOUNT_ID || !process.env.HEDERA_PRIVATE_KEY) {
      return res.status(500).json({
        error: 'La configuration Hedera n\'est pas complète.',
        status: 'error'
      });
    }

    const client = Client.forTestnet().setOperator(
      process.env.HEDERA_ACCOUNT_ID,
      PrivateKey.fromStringECDSA(process.env.HEDERA_PRIVATE_KEY),
    );

    const hederaAgentToolkit = new HederaLangchainToolkit({
      client,
      configuration: {
        plugins: [coreQueriesPlugin]
      },
    });

    const translations = {
        fr: 'Vous êtes MONGANGA, un assistant médical utile propulsé par Hedera et Groq. Vous pouvez répondre à des questions sur des informations médicales et sur le réseau Hedera.',
        en: 'You are MONGANGA, a helpful medical assistant powered by Hedera and Groq. You can answer questions about medical information and the Hedera network.',
        sw: 'Wewe ni MONGANGA, msaidizi wa matibabu anayetumia Hedera na Groq. Unaweza kujibu maswali kuhusu taarifa za matibabu na mtandao wa Hedera.',
        ln: 'Ozali MONGANGA, mopesi na yo ya mayele ya monganga mpo na kosunga yo na ba consultations na yo. Okoki koyanola na mituna etali makambo ya monganga mpe ya réseau Hedera.'
    };

    const prompt = ChatPromptTemplate.fromMessages([
      ['system', translations[language] || translations.en],
      ['placeholder', '{chat_history}'],
      ['human', '{input}'],
      ['placeholder', '{agent_scratchpad}'],
    ]);

    const tools = hederaAgentToolkit.getTools();

    const agent = createToolCallingAgent({
      llm,
      tools,
      prompt,
    });

    const agentExecutor = new AgentExecutor({
      agent,
      tools,
    });

    console.log('Envoi de la requête à l\'API Groq avec les symptômes:', symptoms);
    const response = await agentExecutor.invoke({ input: symptoms });
    console.log('Réponse reçue de l\'API Groq:', response);
    
    if (userId) {
      try {
        const consultationId = `cons_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const consultationData = { id: consultationId, userId, symptoms, language };
        await hederaStorage.storeConsultation(consultationData);
        
        const diagnosisData = { id: `diag_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, consultationId, userId, diagnosis: response.output, language };
        await hederaStorage.storeDiagnosis(diagnosisData);
        
        console.log('Diagnostic stocké avec succès sur Hedera');
      } catch (storageError) {
        console.error('Erreur lors du stockage sur Hedera:', storageError);
      }
    }
    
    res.json({ diagnosis: response.output });
  } catch (error) {
    console.error('Erreur lors du diagnostic:', error);
    res.status(500).json({ 
      error: 'Une erreur est survenue lors du diagnostic',
      details: error.message,
      status: 'error'
    });
  }
});

// Servir les fichiers statiques spécifiques
app.use('/image', express.static(path.join(__dirname, 'image')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css')));

// Routes HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Servir les autres fichiers statiques
app.use(express.static(path.join(__dirname)));

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('Press Ctrl+C to quit.');

  // Initialisation asynchrone du stockage Hedera après le démarrage du serveur
  console.log('Initialisation du stockage Hedera...');
  try {
    hederaStorage = new HederaStorage();
    console.log('Stockage Hedera initialisé avec succès.');
    
    // Afficher les IDs des topics pour faciliter l'accès aux données sur l'explorateur Hedera
    setTimeout(() => {
      console.log('=== HEDERA TOPIC IDs ===');
      console.log('Users Topic ID:', hederaStorage.topics.users || 'Non créé');
      console.log('Consultations Topic ID:', hederaStorage.topics.consultations || 'Non créé');
      console.log('Diagnoses Topic ID:', hederaStorage.topics.diagnoses || 'Non créé');
      console.log('========================');
      console.log('Utilisez ces IDs sur https://hashscan.io/testnet pour voir les données stockées');
    }, 2000); // Attendre 2 secondes pour s'assurer que les topics sont initialisés
  } catch (error) {
    console.error('Erreur critique lors de l\'initialisation du stockage Hedera:', error.message);
    // Le serveur continue de fonctionner, mais les fonctionnalités de base de données seront indisponibles.
  }
});