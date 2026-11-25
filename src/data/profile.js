// Source unique de vérité : le site ET l'assistant IA lisent ce fichier.
// Pour mettre à jour le portfolio, modifie uniquement ici.
// Règle : rien d'autre que le contenu du CV. Aucun montant en euros sur Pokawa (données confidentielles).

export const profile = {
  name: 'Amayas Allouane',
  initials: 'AA',
  title: 'Alternant Data Analyst / Data Engineer',
  tagline: 'Python, SQL, ETL, Analyse de données',
  location: 'Cesson (77), Île-de-France',
  email: 'allouaneamayas02@gmail.com',
  linkedin: 'https://www.linkedin.com/in/amayas-allouane',
  github: 'https://github.com/ALLOUANEAmayas',

  search:
    "Recherche une alternance Data Analyst / Data Engineer dès décembre 2026, au rythme de 3 semaines en entreprise et 1 semaine à l'école, mobile en Île-de-France, dans le cadre du Mastère Data & IA à HETIC.",

  about: [
    "Étudiant en Mastère Data & IA à HETIC, après un Bachelor Informatique obtenu en 2026 à l'Institut GoldenCollar.",
    "Je construis des pipelines ETL en Python et SQL : sur les données réelles d'un restaurant Pokawa pendant mon stage DataPulse, et sur les données immobilières publiques DVF. Je développe aussi des outils internes utilisés chaque semaine par une équipe de 10 personnes.",
    "Hors écran : professeur de Vovinam Việt Võ Đạo, plusieurs fois champion de France et d'Afrique. La rigueur de l'entraînement, je l'applique à mes données.",
  ],

  // Ordre chronologique inverse.
  experiences: [
    {
      period: 'Juin – sept. 2026',
      role: 'Stage Data Analyst',
      company: 'Pokawa',
      place: 'Cesson',
      label: 'Projet DataPulse',
      bullets: [
        'Pipeline ETL en Python/Pandas croisant deux sources réelles (caisse Zelty, gestion des stocks Adoria), validé par recoupement avec les clôtures de caisse ; détection des journées anormales (méthode 2σ).',
        'Analyse du CA par canal de vente : la livraison et la commande en ligne représentent plus des trois quarts des encaissements ; dépendance aux plateformes signalée à la direction.',
        "Calcul du food cost (30,9 %) et mise en évidence d'une démarque inconnue d'environ 17 % du coût matière (norme : 2 à 5 %) ; causes identifiées (surdosage des protéines, erreurs d'inventaire) et recommandations chiffrées ; rapport présenté en soutenance.",
      ],
      highlights: [
        { value: '30,9 %', label: 'food cost calculé' },
        { value: '≈ 17 %', label: 'de démarque inconnue sur le coût matière (norme : 2 à 5 %)' },
        { value: '> 3/4', label: 'des encaissements via la livraison et la commande en ligne' },
      ],
      stack: ['Python', 'Pandas', 'Excel', 'Zelty', 'Adoria'],
    },
    {
      period: 'Depuis sept. 2025',
      role: "Référent technique et développeur d'outils internes",
      company: 'Pokawa',
      place: 'Cesson',
      bullets: [
        'Outils internes en JavaScript utilisés chaque semaine par une équipe de 10 personnes : plannings hebdomadaires et fiches de paie mensuelles générés automatiquement en PDF.',
      ],
      stack: ['JavaScript', 'jsPDF', 'HTML/CSS'],
    },
    {
      period: '2025',
      role: 'Développeur web freelance',
      company: 'Soroka Agency ApS',
      place: 'agence maritime au Danemark',
      url: 'https://soroka.dk',
      bullets: [
        "Conception, développement et mise en ligne du site de l'agence (soroka.dk) : pages de services portuaires et d'ingénierie, carte interactive des ports, design responsive.",
        'Optimisation des temps de chargement (compression des vidéos et des images).',
      ],
      stack: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap 5'],
    },
  ],

  projects: [
    {
      name: 'Pipeline ETL sur les données immobilières DVF',
      kind: 'Projet data',
      summary:
        'Pipeline ETL sur les données immobilières DVF (data.gouv.fr, environ 500 000 lignes) : extraction, nettoyage, agrégations et modélisation en base relationnelle.',
      stack: ['Python', 'Pandas', 'NumPy', 'PostgreSQL', 'DBeaver'],
    },
  ],

  skills: [
    { group: 'Langages', items: ['Python', 'SQL', 'Java', 'PHP', 'C', 'JavaScript', 'HTML/CSS'] },
    { group: 'Data & IA', items: ['Pandas', 'NumPy', 'Scikit-learn', 'Analyse de données', 'Data visualization'] },
    {
      group: 'Data engineering',
      items: ['ETL', 'Pipelines de données', 'Nettoyage et modélisation de données', 'SQL analytique', 'Data Quality'],
    },
    { group: 'Bases de données', items: ['PostgreSQL', 'MySQL', 'Modélisation MCD'] },
    {
      group: 'Business Intelligence',
      items: ['Excel', 'Tableaux de bord', 'Reporting', 'Indicateurs métier (CA, food cost, démarque)'],
    },
    { group: 'Outils', items: ['Git/GitHub', 'Linux', 'Bash', 'Jupyter', 'DBeaver', 'VS Code'] },
  ],

  // Ordre chronologique inverse.
  education: [
    { period: '2026 – 2028', title: 'Mastère Data & IA (Bac+5)', place: 'HETIC, Paris' },
    { period: 'Diplômé en 2026', title: 'Bachelor Informatique (Bac+3)', place: 'Institut GoldenCollar, Paris' },
    { period: '2023 – 2024', title: 'L1 Informatique', place: 'Université Sorbonne Paris Nord, Villetaneuse' },
    {
      period: '2022',
      title: 'Baccalauréat général (Mathématiques, Physique-Chimie)',
      place: 'Lycée international Alexandre Dumas, Alger',
    },
  ],

  certifications: [
    'Google Data Analytics Professional Certificate, Coursera (en cours)',
    'Google Business Intelligence Professional Certificate, Coursera (à venir)',
  ],

  languages: [
    'Français (courant)',
    'Anglais (B1, lecture de documentation technique)',
    'Arabe (courant)',
    'Kabyle (langue maternelle)',
  ],

  suggestions: [
    "Qu'a-t-il fait pendant son stage DataPulse ?",
    'Quelles technologies maîtrise-t-il ?',
    "Qu'a-t-il réalisé pour Soroka Agency ?",
    "Quel type d'alternance cherche-t-il ?",
    'Quel est son parcours de formation ?',
    'Comment le contacter ?',
  ],
};
