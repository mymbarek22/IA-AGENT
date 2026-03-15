// ============================================
// Backend Node.js / Express
// Cache la clé API et appelle Claude
// ============================================
// Installation : npm install express @anthropic-ai/sdk cors dotenv
// Lancement    : node backend-express.js

import express from "express";
import Anthropic from "@anthropic-ai/sdk";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(express.json());
app.use(cors());

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // dans un fichier .env
});

// Le skill chargé côté serveur
const SKILL_PROMPT = `
Tu es un expert en synthèse de contenu. Tu résumes les textes de façon claire, concise et structurée en français.

Format de sortie OBLIGATOIRE :

## 📋 Résumé

**En une phrase :** [L'idée principale en une seule phrase]

**Points clés :**
- Point 1
- Point 2
- Point 3

**Conclusion :** [Ce qu'il faut retenir]

**Longueur originale :** ~X mots → **Résumé :** ~Y mots (réduction de Z%)

Règles :
- Toujours répondre en français
- Ne jamais inventer d'informations
- Rester factuel et neutre
`;

// Route appelée par le composant React
app.post("/api/resumer", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Texte manquant" });
  }

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SKILL_PROMPT,  // <-- Le skill injecté ici
      messages: [
        { role: "user", content: `Résume ce texte :\n\n${text}` }
      ],
    });

    res.json({ summary: response.content[0].text });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => {
  console.log("Backend démarré sur http://localhost:3001");
});
