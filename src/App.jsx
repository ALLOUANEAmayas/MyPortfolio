import { useEffect, useState } from 'react';
import Assistant from './components/Assistant.jsx';
import { profile } from './data/profile.js';

const nav = [
  ['accueil', 'Accueil'],
  ['a-propos', 'À propos'],
  ['projets', 'Projets'],
  ['parcours', 'Parcours'],
  ['contact', 'Contact'],
];

const icons = {
  sun: 'M12 4V2m0 20v-2m8-8h2M2 12h2m13.66-5.66 1.41-1.41M4.93 19.07l1.41-1.41m0-11.32L4.93 4.93m14.14 14.14-1.41-1.41M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  moon: 'M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  mail: 'M3 6.5h18v11H3zm0 .5 9 6.5L21 7',
  copy: 'M9 9h11v11H9zM5 15H4V4h11v1',
  check: 'm5 12.5 4.5 4.5L19 7.5',
};

function Icon({ name, size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={icons[name]} />
    </svg>
  );
}

function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('theme', next);
    } catch {
      // Stockage indisponible (navigation privée) : le choix vaut pour la session.
    }
    setTheme(next);
  }
  return [theme, toggle];
}

// Surligne dans la navigation la section actuellement à l'écran.
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

// Fait apparaître en douceur les éléments marqués data-reveal quand ils entrent à l'écran.
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

const sectionIds = nav.map(([id]) => id);

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const active = useActiveSection(sectionIds);
  const [copied, setCopied] = useState(false);
  useReveal();

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  }

  return (
    <>
      <a className="skip" href="#contenu">
        Aller au contenu
      </a>

      <header className="topbar">
        <div className="topbar-inner">
          <a className="brand" href="#accueil" aria-label={profile.name}>
            <span className="brand-mark">{profile.initials}</span>
            <span className="brand-name">{profile.name}</span>
          </a>
          <nav aria-label="Navigation principale">
            <ul>
              {nav.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} aria-current={active === id ? 'true' : undefined}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <button
            type="button"
            className="icon-button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Passer au thème clair' : 'Passer au thème sombre'}
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
          </button>
          <a className="button" href={`mailto:${profile.email}`}>
            Me contacter
          </a>
        </div>
      </header>

      <main id="contenu">
        <section className="hero" id="accueil">
          <div className="hero-copy">
            <div className="identity">
              <img src="/amayas.jpg" alt={`Portrait de ${profile.name}`} width="56" height="56" />
              <div>
                <p className="identity-name">{profile.name}</p>
                <p className="identity-role">{profile.title}</p>
              </div>
            </div>
            <h1>
              Interrogez mon parcours comme une <em>base de données</em>.
            </h1>
            <p className="hero-lead">
              Je suis {profile.name}, futur {profile.title.toLowerCase()}. Mon assistant IA connaît mes projets, mes
              compétences et mon parcours : posez-lui vos questions.
            </p>
            <p className="hero-search">
              <span className="pulse" aria-hidden="true" />
              {profile.search}
            </p>
            <div className="hero-actions">
              <a className="button button-large" href="#projets">
                Voir les projets <Icon name="arrow" />
              </a>
              <a className="button button-large button-ghost" href={profile.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a className="button button-large button-ghost" href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
            <p className="hero-location">{profile.location}</p>
          </div>
          <Assistant />
        </section>

        <section className="block" id="a-propos">
          <header className="block-head" data-reveal>
            <p className="eyebrow">01</p>
            <h2>À propos</h2>
          </header>
          <div className="about-grid">
            <div className="about-text" data-reveal>
              {profile.about.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
            <dl className="skills" data-reveal>
              {[...profile.skills, { group: 'Langues', items: profile.languages }].map((s) => (
                <div key={s.group}>
                  <dt>{s.group}</dt>
                  <dd>
                    <ul className="chips">
                      {s.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="block" id="projets">
          <header className="block-head" data-reveal>
            <p className="eyebrow">02</p>
            <h2>Projets</h2>
          </header>
          <ul className="projects">
            {profile.projects.map((p) => (
              <li key={p.name} data-reveal>
                <p className="project-kind">{p.kind}</p>
                <h3>{p.name}</h3>
                <p className="project-summary">{p.summary}</p>
                <ul className="chips" aria-label="Technologies">
                  {p.stack.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        <section className="block" id="parcours">
          <header className="block-head" data-reveal>
            <p className="eyebrow">03</p>
            <h2>Parcours</h2>
          </header>
          <ol className="path">
            {profile.path.map((step) => (
              <li key={step.title} data-reveal>
                <p className="path-period">{step.period}</p>
                <div>
                  <h3>{step.title}</h3>
                  <p className="path-place">{step.place}</p>
                  {step.detail && <p>{step.detail}</p>}
                </div>
              </li>
            ))}
          </ol>
          <h3 className="sub" data-reveal>
            Certifications
          </h3>
          <ul className="certs" data-reveal>
            {profile.certifications.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>

        <section className="block" id="contact">
          <div className="contact" data-reveal>
            <h2>Travaillons ensemble</h2>
            <p>
              Une alternance en data à pourvoir, ou une question sur un projet ? Écrivez-moi, je réponds rapidement.
            </p>
            <div className="contact-actions">
              <a className="button button-large button-amber" href={`mailto:${profile.email}`}>
                <Icon name="mail" /> {profile.email}
              </a>
              <button type="button" className="button button-large button-outline" onClick={copyEmail}>
                <Icon name={copied ? 'check' : 'copy'} />
                <span aria-live="polite">{copied ? 'Adresse copiée' : 'Copier l’adresse'}</span>
              </button>
            </div>
            <div className="contact-links">
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a href={profile.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>
          Conçu et réalisé par {profile.name}, {new Date().getFullYear()}.
        </p>
        <a href="#accueil">Haut de page</a>
      </footer>
    </>
  );
}
