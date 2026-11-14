# Portfolio d'Amayas Allouane

Site React (Vite) avec un assistant IA en page d'accueil. L'assistant répond aux questions des visiteurs
sur le parcours d'Amayas en appelant l'API Claude depuis une fonction serveur.

## Lancer le site en local

Il faut Node.js 18 ou plus récent.

```bash
npm install
cp .env.example .env      # puis colle ta clé dans .env
npm run dev
```

Le site s'ouvre sur http://localhost:5173. L'assistant fonctionne aussi en local.

## La clé API

- Crée une clé sur https://console.anthropic.com puis colle-la dans `.env` : `ANTHROPIC_API_KEY=sk-ant-...`
- La clé est lue uniquement par `api/chat.js`, côté serveur. Elle n'est jamais envoyée au navigateur.
- Ne renomme pas la variable avec le préfixe `VITE_` : elle deviendrait visible par tous les visiteurs.
- Le fichier `.env` est ignoré par Git. Ne le publie jamais.

## Mettre en ligne sur Vercel

1. Pousse le dossier sur GitHub (sans `.env`).
2. Sur vercel.com : New Project, importe le dépôt. Vercel détecte Vite tout seul.
3. Dans Settings > Environment Variables, ajoute `ANTHROPIC_API_KEY` avec ta clé, puis redéploie.

## Modifier le contenu

Tout le contenu est dans `src/data/profile.js` : textes, compétences, projets, parcours, questions suggérées.
Le site et l'assistant lisent le même fichier, donc une modification met les deux à jour.

## Organisation

| Fichier | Rôle |
| --- | --- |
| `src/data/profile.js` | Les informations d'Amayas |
| `src/App.jsx` | Les sections de la page |
| `src/components/Assistant.jsx` | L'interface de l'assistant |
| `src/styles.css` | Le style |
| `api/chat.js` | Fonction serveur qui appelle l'API Claude |
| `lib/prompt.js` | Les consignes données à l'assistant |

## Protection contre les abus

`api/chat.js` limite la taille des messages, la longueur de l'historique et le nombre de requêtes par adresse IP
(20 par 10 minutes). Pense aussi à fixer un plafond de dépense mensuel dans la console Anthropic.
