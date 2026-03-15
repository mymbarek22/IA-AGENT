// ============================================
// Composant React - Skill "resumer-texte"
// Usage : <SkillResumer />
// ============================================

import { useState } from "react";

// Le contenu du SKILL.md devient un system prompt
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

export default function SkillResumer() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function resumer() {
    if (!text.trim()) return;

    setLoading(true);
    setError("");
    setResult("");

    try {
      // En React, appelle ton propre backend — pas l'API directement
      // Exemple avec un backend Express/Node.js sur /api/resumer
      const response = await fetch("/api/resumer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erreur serveur");
      setResult(data.summary);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: "0 20px" }}>
      <h1>Résumé de Texte</h1>
      <p style={{ color: "#888", marginBottom: 24 }}>
        Skill: <code>resumer-texte</code>
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Colle ton texte ici..."
        rows={8}
        style={{ width: "100%", padding: 12, fontSize: 15, borderRadius: 8 }}
      />

      <button
        onClick={resumer}
        disabled={loading || !text.trim()}
        style={{ marginTop: 12, padding: "10px 24px", fontSize: 16 }}
      >
        {loading ? "Analyse en cours..." : "Résumer"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: 16 }}>{error}</p>
      )}

      {result && (
        <div style={{
          marginTop: 24,
          padding: 20,
          background: "#f8fafc",
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          whiteSpace: "pre-wrap",
          lineHeight: 1.7
        }}>
          {result}
        </div>
      )}
    </div>
  );
}
