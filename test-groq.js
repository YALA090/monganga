import fetch from 'node-fetch';

async function testGroqAPI() {
  try {
    console.log('Envoi de la requête...');
    const response = await fetch('./index.html', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symptoms: "J'ai mal à la tête et de la fièvre",
        language: "fr"
      })
    });
    
    console.log('Statut de la réponse:', response.status);
    const text = await response.text();
    console.log('Réponse brute:', text);
    
    try {
      const data = JSON.parse(text);
      console.log('Réponse de l\'API:', data);
    } catch (parseError) {
      console.error('Erreur de parsing JSON:', parseError);
    }
  } catch (error) {
    console.error('Erreur de requête:', error);
  }
}

testGroqAPI();