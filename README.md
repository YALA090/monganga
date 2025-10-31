#MONGANGA - Agent IA Médical 
 Description 
 MONGANGA est une application médicale basée sur l'intelligence artificielle qui utilise la blockchain Hedera pour sécuriser et authentifier les diagnostics et consultations médicales. Cette solution est particulièrement cruciale dans les zones de conflit où l'accès aux soins médicaux est limité et où l'intégrité des données médicales doit être préservée malgré l'instabilité infrastructurelle. 
 pitch deck :https://docs.google.com/presentation/d/14cXE1hrQcd4sVtSICvMEd8cI0MLpngHl9nwKu2woDVU/edit?usp=sharing
 Vidéo youtube: 
 Résumé de l'Intégration Hedera 
 Hedera Consensus Service (HCS) 
 Le HCS a été sélectionné pour stocker et valider les diagnostics médicaux et les consultations car il offre : 
 • 	 Un horodatage immuable et vérifiable des données médicales 
 • 	 Des frais de transaction prévisibles, essentiels pour une application médicale à budget contrôlé 
 • 	 Une haute disponibilité et fiabilité pour des données critiques de santé 
 • 	 La possibilité de créer des topics séparés pour différentes catégories de données (utilisateurs, consultations, diagnostics) 
 Hedera File Service (HFS) 
 Utilisé via HederaStorage pour stocker les dossiers médicaux car : 
 • 	 Il garantit l'intégrité et l'immuabilité des données médicales sensibles 
 • 	 Il permet un stockage décentralisé et sécurisé des informations confidentielles des patients 
 • 	 Il offre une piste d'audit vérifiable pour toutes les modifications apportées aux dossiers 
 • 	 Il résiste à la manipulation et à la falsification des données médicales 
 Hedera Agent Kit 
 Intégré avec LangChain pour : 
 • 	 Faciliter l'interaction entre l'IA médicale et la blockchain Hedera 
 • 	 Permettre des requêtes sécurisées et vérifiables sur les données médicales 
 • 	 Simplifier l'intégration des capacités d'IA avec les services Hedera 
 • 	 Offrir des plugins prêts à l'emploi pour les fonctionnalités courantes (comme coreQueriesPlugin) 
 Ces choix technologiques permettent à MONGANGA de fournir un service médical basé sur l'IA qui est à la fois sécurisé, transparent et conforme aux exigences de confidentialité des données médicales, tout en bénéficiant de la décentralisation et de l'immuabilité offertes par la technologie Hedera. 
 Types de Transactions 
 1. 	 TopicCreateTransaction 
 2. 	 TopicMessageSubmitTransaction 
 Instructions de Déploiement 
 Terminal 1 : Lancer le Backend 
 # Lance le serveur backend 
 node agent.js 
 Le backend sera disponible à l'adresse http://localhost:3000 
 Terminal 2 : Lancer le Frontend 
 # Lance l'interface utilisateur 
 npm run dev 
 Le frontend sera accessible à l'adresse http://localhost:3000 
 Diagramme d'Architecture 
 Le schéma ci-dessous illustre le flux de données entre les différents composants de l'application MONGANGA 
 graph TD 
     subgraph "Navigateur de l'Utilisateur" 
         A[Frontend - Interface Utilisateur] 
     end 
 
     subgraph "Serveur" 
         B[Backend - Node.js/Express] 
     end
 
     subgraph "Services Externes" 
         C[API Groq - Intelligence Artificielle] 
         D[Réseau Hedera - Testnet] 
     end 
 
     subgraph "Base de Données Décentralisée" 
         D1[Hedera Consensus Service] 
         D2[Hedera Mirror Node] 
     end 
 
     A -- 1. Envoi des symptômes (requête API) --> B 
     B -- 2. Requête de diagnostic --> C 
     C -- 3. Retourne le diagnostic --> B 
     B -- 4. Stocke la consultation (TopicMessageSubmitTransaction) --> D1 
     B -- 5. Stocke le diagnostic (TopicMessageSubmitTransaction) --> D1 
     B -- 6. Retourne le diagnostic à l'utilisateur --> A 
     A -- 7. Demande d'historique --> B 
     B -- 8. Récupère les messages (API REST) --> D2 
     D2 -- 9. Retourne l'historique --> B 
     B -- 10. Retourne l'historique au frontend --> A 
 IDs Hedera Déployés 
 • 	 HEDERA_USERS_TOPIC_ID = 0.0.7165678 
 • 	 HEDERA_CONSULTATIONS_TOPIC_ID = 0.0.7165679 
 • 	 HEDERA_DIAGNOSES_TOPIC_ID = 0.0.7165680