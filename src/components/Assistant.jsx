import { useEffect, useRef, useState } from 'react';
import { profile } from '../data/profile.js';

// L'assistant est présenté comme un notebook Jupyter : chaque question est une cellule
// "In [n]", chaque réponse une cellule "Out [n]".
export default function Assistant() {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const logRef = useRef(null);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  async function ask(text) {
    const question = text.trim();
    if (!question || loading) return;
    const next = [...messages, { role: 'user', content: question }];
    setMessages(next);
    setDraft('');
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'La réponse n’a pas pu être générée.');
      setMessages([...next, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      // On retire la question restée sans réponse pour garder un historique cohérent.
      setMessages(messages);
      setDraft(question);
      setError(err.message || 'Connexion impossible. Réessaie.');
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      ask(draft);
    }
  }

  const turns = Math.ceil(messages.length / 2);

  return (
    <section className="notebook" aria-label={`Assistant de ${profile.name}`}>
      <header className="notebook-bar">
        <span className="notebook-file">amayas.ipynb</span>
        {messages.length > 0 && (
          <button type="button" className="notebook-clear" onClick={() => { setMessages([]); setError(''); }}>
            Effacer l’historique
          </button>
        )}
      </header>

      <div className="notebook-log" ref={logRef} aria-live="polite">
        {messages.length === 0 && !loading && (
          <div className="cell">
            <span className="cell-tag out">Out [0]</span>
            <p className="cell-text">
              Je réponds à partir du parcours, des projets et des compétences d’Amayas. Choisissez une question ou
              écrivez la vôtre.
            </p>
          </div>
        )}

        {messages.map((m, i) => {
          const n = Math.floor(i / 2) + 1;
          const isUser = m.role === 'user';
          return (
            <div className={`cell ${isUser ? 'cell-in' : ''}`} key={i}>
              <span className={`cell-tag ${isUser ? 'in' : 'out'}`}>{isUser ? `In [${n}]` : `Out [${n}]`}</span>
              <p className="cell-text">{m.content}</p>
            </div>
          );
        })}

        {loading && (
          <div className="cell">
            <span className="cell-tag out">Out [*]</span>
            <p className="cell-text cell-running">Exécution en cours</p>
          </div>
        )}
      </div>

      {messages.length === 0 && (
        <ul className="suggestions">
          {profile.suggestions.map((s) => (
            <li key={s}>
              <button type="button" onClick={() => ask(s)} disabled={loading}>
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p className="notebook-error" role="alert">
          {error}
        </p>
      )}

      <form
        className="notebook-input"
        onSubmit={(e) => {
          e.preventDefault();
          ask(draft);
        }}
      >
        <label htmlFor="question" className="cell-tag in">
          In [{turns + 1}]
        </label>
        <textarea
          id="question"
          rows={2}
          value={draft}
          maxLength={1500}
          placeholder="Posez une question sur son parcours"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button type="submit" disabled={loading || !draft.trim()}>
          Envoyer
        </button>
      </form>
      <p className="notebook-hint">Entrée pour envoyer, Maj + Entrée pour aller à la ligne.</p>
    </section>
  );
}
