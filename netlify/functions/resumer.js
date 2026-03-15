// Netlify Function - Proxy sécurisé vers l'API Claude
// La clé API est stockée dans les variables d'env Netlify (jamais exposée)

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

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { text } = JSON.parse(event.body || "{}");

  if (!text) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Texte manquant" }),
    };
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY, // variable Netlify
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SKILL_PROMPT,
      messages: [{ role: "user", content: `Résume ce texte :\n\n${text}` }],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      statusCode: response.status,
      body: JSON.stringify({ error: data.error?.message || "Erreur API" }),
    };
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ summary: data.content[0].text }),
  };
}
