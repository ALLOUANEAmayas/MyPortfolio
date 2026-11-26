// Fonction serveur (Vercel) : c'est elle qui appelle l'API Claude.
// La clé ANTHROPIC_API_KEY reste ici, côté serveur, et n'arrive jamais dans le navigateur.
import { buildSystemPrompt } from '../lib/prompt.js';

const MAX_MESSAGES = 20; // longueur maximale de l'historique envoyé
const MAX_CHARS = 1500; // taille maximale d'un message
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 20; // requêtes par adresse IP sur la fenêtre

// Limite simple en mémoire : freine les abus, sans prétendre être infaillible.
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

function cleanMessages(input) {
  if (!Array.isArray(input) || input.length === 0) return null;
  const out = [];
  for (const m of input.slice(-MAX_MESSAGES)) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant')) return null;
    if (typeof m.content !== 'string' || !m.content.trim()) return null;
    out.push({ role: m.role, content: m.content.slice(0, MAX_CHARS) });
  }
  // L'API attend que la conversation commence et se termine par un message du visiteur.
  while (out.length && out[0].role !== 'user') out.shift();
  if (!out.length || out[out.length - 1].role !== 'user') return null;
  return out;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée.' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "L'assistant n'est pas configuré : ajoute ANTHROPIC_API_KEY dans le fichier .env.",
    });
  }

  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'inconnu')
    .split(',')[0]
    .trim();
  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'Trop de questions en peu de temps. Réessaie dans quelques minutes.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = null;
    }
  }
  const messages = cleanMessages(body?.messages);
  if (!messages) {
    return res.status(400).json({ error: 'Question invalide.' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        system: buildSystemPrompt(),
        messages,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Erreur API Claude :', response.status, data?.error?.message);
      const error =
        response.status === 401
          ? 'Clé API refusée : vérifie ANTHROPIC_API_KEY.'
          : "L'assistant est momentanément indisponible. Réessaie dans un instant.";
      return res.status(502).json({ error });
    }

    const reply = (data.content || [])
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      // L'interface affiche du texte brut : on retire le Markdown éventuel (gras, titres).
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/^#{1,6}\s+/gm, '')
      .trim();

    return res.status(200).json({ reply: reply || "Je n'ai pas de réponse à cette question." });
  } catch (err) {
    console.error('Appel API impossible :', err);
    return res.status(502).json({ error: "Impossible de joindre l'assistant. Vérifie la connexion et réessaie." });
  }
}
