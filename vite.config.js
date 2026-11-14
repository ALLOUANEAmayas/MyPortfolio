import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// En local, `npm run dev` sert aussi /api/chat avec la même fonction que Vercel,
// pour tester l'assistant sans rien déployer.
function devApi() {
  return {
    name: 'dev-api',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        let raw = '';
        for await (const chunk of req) raw += chunk;
        try {
          req.body = raw ? JSON.parse(raw) : {};
        } catch {
          req.body = null;
        }
        res.status = (code) => {
          res.statusCode = code;
          return res;
        };
        res.json = (obj) => {
          res.setHeader('content-type', 'application/json; charset=utf-8');
          res.end(JSON.stringify(obj));
        };
        try {
          const { default: handler } = await server.ssrLoadModule('/api/chat.js');
          await handler(req, res);
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Erreur interne du serveur de développement.' });
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Charge .env côté serveur uniquement (les variables sans préfixe VITE_ ne vont jamais dans le navigateur).
  const env = loadEnv(mode, process.cwd(), '');
  for (const key of ['ANTHROPIC_API_KEY', 'ANTHROPIC_MODEL']) {
    if (env[key] && !process.env[key]) process.env[key] = env[key];
  }
  return { plugins: [react(), devApi()] };
});
