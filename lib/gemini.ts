import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialisation de l'API
const getGenAI = () => {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("La clé API Google n'est pas configurée (GOOGLE_API_KEY manquante)");
  }
  return new GoogleGenerativeAI(apiKey);
};

export async function generateDataWithGemini(structure: any, count: number, type: 'SIMPLE' | 'RELATIONAL' | 'GRAPHQL' = 'SIMPLE'): Promise<any[]> {
  // Validation des entrées
  if (count < 1 || count > 100) {
    throw new Error("Le nombre d'éléments doit être entre 1 et 100");
  }

  if (!structure || typeof structure !== 'object') {
    throw new Error("La structure doit être un objet valide");
  }

  const genAI = getGenAI();
  
  // Utilisation du modèle recommandé
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-pro-latest",
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2000,
    }
  });

  let prompt = '';

  if (type === 'SIMPLE') {
    prompt = `Génère exactement ${count} éléments de données JSON réalistes basés sur cette structure :
${JSON.stringify(structure, null, 2)}

Instructions strictes :
1. Retourne UNIQUEMENT un tableau JSON valide
2. Chaque élément doit strictement respecter la structure fournie, mais SANS inclure la définition des types (pas de champ "fields")
3. Les données doivent être **réalistes**, **variées** et **cohérentes**
4. Formats obligatoires :
   - Dates : "YYYY-MM-DD"
   - Emails : format "prenom.nom@domaine.com"
   - Nombres : valeurs réalistes selon le champ
   - Noms/prénoms : prénoms et noms français réalistes
   - Titres, rôles : intitulés professionnels français réalistes

5. Correspondances automatiques de champs :
   - "name", "names", "nom", "noms", "fullName", "full_name", "nom_complet" : génère un nom complet au format "Prénom Nom"
   - "prenom", "firstname", "first_name" : génère un prénom français réaliste
   - "nom", "lastname", "last_name" : génère un nom de famille français réaliste
   - "email", "courriel" : génère un email valide au format "prenom.nom@domaine.com"
   - "title", "titre", "profession", "job" : génère un titre ou métier en français

Exemple de format attendu (sans le champ fields) :
[
  {
    "id": 123,
    "age": 35,
    "title": "Ingénieur logiciel"
  },
  {
    "id": 456,
    "age": 28,
    "title": "Chef de projet marketing"
  }
]`;
  } else if (type === 'RELATIONAL') {
    prompt = `Génère des données relationnelles JSON réalistes basées sur cette structure :
${JSON.stringify(structure, null, 2)}

Instructions strictes :
1. Retourne UNIQUEMENT un objet JSON avec des tableaux pour chaque entité
2. Les relations entre entités doivent être cohérentes (ex: userId dans posts doit correspondre à un id existant dans users)
3. Génère environ ${count} éléments par entité
4. Les données doivent être **réalistes**, **variées** et **cohérentes**
5. Formats obligatoires :
   - Dates : "YYYY-MM-DD"
   - Emails : format "prenom.nom@domaine.com"
   - Nombres : valeurs réalistes selon le champ
   - Noms/prénoms : prénoms et noms français réalistes
   - Titres, rôles : intitulés professionnels français réalistes

Format de réponse attendu :
{
  "entite1": [
    { /* premier élément */ },
    { /* deuxième élément */ }
  ],
  "entite2": [
    { /* premier élément */ },
    { /* deuxième élément */ }
  ]
}`;
  } else if (type === 'GRAPHQL') {
    prompt = `Génère des données GraphQL JSON réalistes basées sur cette structure :
${JSON.stringify(structure, null, 2)}

Instructions strictes :
1. Retourne UNIQUEMENT un objet JSON avec une propriété "data" contenant les données
2. Les relations entre types doivent être cohérentes
3. Génère environ ${count} éléments par type
4. Les données doivent être **réalistes**, **variées** et **cohérentes**
5. Formats obligatoires :
   - Dates : "YYYY-MM-DD"
   - Emails : format "prenom.nom@domaine.com"
   - Nombres : valeurs réalistes selon le champ
   - Noms/prénoms : prénoms et noms français réalistes
   - Titres, rôles : intitulés professionnels français réalistes

Format de réponse attendu :
{
  "data": {
    "type1": [
      { /* premier élément */ },
      { /* deuxième élément */ }
    ],
    "type2": [
      { /* premier élément */ },
      { /* deuxième élément */ }
    ]
  }
}`;
  }

  console.log("Envoi de la requête à Gemini...");
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("Réponse brute de Gemini:", text);

    // Nettoyage robuste de la réponse
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```|(\[\s*{[\s\S]*?}\s*\]|{\s*"[\s\S]*?"\s*})/);
    const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[2]) : text;
    const cleanedText = jsonString.trim();

    console.log("JSON nettoyé:", cleanedText);

    const data = JSON.parse(cleanedText);
    
    if (type === 'SIMPLE' && !Array.isArray(data)) {
      throw new Error("La réponse n'est pas un tableau JSON valide");
    }

    if (type === 'RELATIONAL' && typeof data !== 'object') {
      throw new Error("La réponse n'est pas un objet JSON valide");
    }

    if (type === 'GRAPHQL' && (!data.data || typeof data.data !== 'object')) {
      throw new Error("La réponse n'est pas un objet GraphQL valide");
    }

    return data;
  } catch (error: any) {
    console.error("Erreur détaillée:", error);
    
    if (error.message.includes("API key not valid")) {
      throw new Error("Clé API Google invalide. Vérifiez votre configuration.");
    }
    
    if (error.message.includes("model not found")) {
      throw new Error("Modèle Gemini non trouvé. Essayez 'gemini-pro' ou 'gemini-1.5-pro-latest'");
    }
    
    throw new Error(`Erreur Gemini: ${error.message}`);
  }
}