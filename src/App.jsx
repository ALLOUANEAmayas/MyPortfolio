import Assistant from './components/Assistant.jsx';
import { profile } from './data/profile.js';

const nav = [
  ['#accueil', 'Accueil'],
  ['#a-propos', 'À propos'],
  ['#projets', 'Projets'],
  ['#parcours', 'Parcours'],
  ['#contact', 'Contact'],
];

export default function App() {
  return (
    <>
      <a className="skip" href="#contenu">
        Aller au contenu
      </a>

      <header className="topbar">
        <a className="brand" href="#accueil" aria-label={profile.name}>
          {profile.initials}
        </a>
        <nav aria-label="Navigation principale">
          <ul>
            {nav.map(([href, label]) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="button" href={`mailto:${profile.email}`}>
          Me contacter
        </a>
      </header>

      <main id="contenu">
        <section className="hero" id="accueil">
          <div className="hero-copy">
            <h1>Interrogez mon parcours comme une base de données.</h1>
            <p className="hero-lead">
              Je suis {profile.name}, futur {profile.title.toLowerCase()}. Mon assistant IA connaît mes projets, mes
              compétences et mon parcours : posez-lui vos questions.
            </p>
            <p className="hero-search">{profile.search}</p>
            <div className="hero-links">
              <a href={profile.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a href="#projets">Voir les projets</a>
            </div>
          </div>
          <Assistant />
        </section>

        <section className="block about" id="a-propos">
          <h2>À propos</h2>
          <div className="about-grid">
            <div className="about-text">
              <img src="/amayas.jpg" alt={`Portrait de ${profile.name}`} width="120" height="120" />
              {profile.about.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
            <dl className="skills">
              {profile.skills.map((s) => (
                <div key={s.group}>
                  <dt>{s.group}</dt>
                  <dd>{s.items.join(', ')}</dd>
                </div>
              ))}
              <div>
                <dt>Langues</dt>
                <dd>{profile.languages.join(', ')}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="block" id="projets">
          <h2>Projets</h2>
          <ul className="projects">
            {profile.projects.map((p) => (
              <li key={p.name}>
                <p className="project-kind">{p.kind}</p>
                <div>
                  <h3>{p.name}</h3>
                  <p>{p.summary}</p>
                  <ul className="stack" aria-label="Technologies">
                    {p.stack.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="block" id="parcours">
          <h2>Parcours</h2>
          <ol className="path">
            {profile.path.map((step) => (
              <li key={step.title}>
                <p className="path-period">{step.period}</p>
                <div>
                  <h3>{step.title}</h3>
                  <p className="path-place">{step.place}</p>
                  {step.detail && <p>{step.detail}</p>}
                </div>
              </li>
            ))}
          </ol>
          <h3 className="sub">Certifications</h3>
          <ul className="certs">
            {profile.certifications.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>

        <section className="block contact" id="contact">
          <h2>Travaillons ensemble</h2>
          <p>
            Une alternance en data à pourvoir, ou une question sur un projet ? Écrivez-moi, je réponds rapidement.
          </p>
          <a className="button button-large" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <div className="hero-links">
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>
          Conçu et réalisé par {profile.name}, {new Date().getFullYear()}.
        </p>
      </footer>
    </>
  );
}
