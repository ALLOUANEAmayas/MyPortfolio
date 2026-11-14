// Source unique de vérité : le site ET l'assistant IA lisent ce fichier.
// Pour mettre à jour le portfolio, modifie uniquement ici.

export const profile = {
  name: 'Amayas Allouane',
  initials: 'AA',
  title: 'Data Analyst / Data Engineer en alternance',
  location: 'Cesson (77), Île-de-France',
  email: 'allouaneamayas02@gmail.com',
  linkedin: 'https://www.linkedin.com/in/amayas-allouane',
  github: 'https://github.com/ALLOUANEAmayas',

  search:
    "Recherche une alternance en data (Data Analyst ou Data Engineer) dans le cadre du Mastère Big Data & Intelligence Artificielle à HETIC.",

  about: [
    "Étudiant en informatique orienté data et intelligence artificielle, admis en Mastère Big Data & IA à HETIC après un Bachelor Informatique.",
    "Je construis des pipelines de données en Python et SQL, je modélise en base relationnelle et je compare des modèles de machine learning supervisé. En parallèle, je développe des outils internes utilisés chaque semaine par une équipe de 10 personnes chez Pokawa.",
    "Hors écran : professeur de Vovinam Việt Võ Đạo, plusieurs fois champion de France et d'Afrique. La rigueur de l'entraînement, je l'applique à mes données.",
  ],

  skills: [
    { group: 'Langages', items: ['Python', 'SQL', 'Java', 'PHP', 'C', 'JavaScript', 'HTML/CSS'] },
    { group: 'Data & IA', items: ['Pandas', 'NumPy', 'Scikit-learn', 'Machine learning supervisé', 'Analyse de données'] },
    { group: 'Data engineering', items: ['ETL', 'Pipelines de données', 'Nettoyage de données', 'Modélisation', 'SQL analytique'] },
    { group: 'Bases de données', items: ['PostgreSQL', 'MySQL', 'Modélisation MCD', 'PDO'] },
    { group: 'Outils', items: ['Git / GitHub', 'Linux', 'Bash', 'Jupyter', 'DBeaver', 'VS Code'] },
  ],

  projects: [
    {
      name: 'Pipeline ETL sur les données immobilières DVF',
      kind: 'Data engineering',
      summary:
        "Pipeline ETL complet sur le jeu de données public DVF (data.gouv.fr, environ 500 000 lignes) : extraction, nettoyage, agrégations et modélisation en base relationnelle.",
      stack: ['Python', 'Pandas', 'NumPy', 'PostgreSQL', 'DBeaver'],
    },
    {
      name: 'Comparaison de méthodes de machine learning supervisé',
      kind: 'Machine learning',
      summary:
        "Implémentation et comparaison de 4 algorithmes d'apprentissage supervisé : régression linéaire, classification binaire, optimisation de la fonction de coût.",
      stack: ['Python', 'Scikit-learn'],
    },
    {
      name: 'Outils internes en production chez Pokawa',
      kind: 'Outils métier',
      summary:
        "Planning Manager (planning d'une équipe de 10, calcul des heures, export PDF) et générateur de fiches de paie en PDF. Utilisés chaque semaine en production.",
      stack: ['JavaScript', 'jsPDF', 'HTML/CSS'],
    },
    {
      name: 'Bibliothèque « La Fureur de Lire »',
      kind: 'Application web',
      summary:
        "Application web complète : 5 entités, modèle conceptuel de données, architecture MVC et pattern Singleton sur la connexion à la base.",
      stack: ['PHP (POO)', 'MySQL', 'MVC'],
    },
    {
      name: 'Parabox / Sokoban, module de persistance',
      kind: 'Projet collectif Java',
      summary:
        "Projet d'équipe sur 4 mois : conception du module de persistance (lecture et écriture des niveaux, sauvegarde de partie) avec le pattern Facade.",
      stack: ['Java', 'POO', 'Design patterns'],
    },
  ],

  // Ordre chronologique inverse : c'est une vraie séquence.
  path: [
    {
      period: '2026 – 2028',
      title: 'Mastère Big Data & Intelligence Artificielle',
      place: 'HETIC, Montreuil',
      detail: 'Admis. Formation en alternance.',
    },
    {
      period: 'Depuis sept. 2025',
      title: "Référent technique et développeur d'outils internes",
      place: 'Pokawa, Cesson',
      detail:
        "Conception et déploiement d'outils JavaScript en production : automatisation des plannings, génération de documents PDF, tableaux de bord. Coordination d'une équipe de 10 personnes.",
    },
    {
      period: '2022 – 2026',
      title: 'Bachelor Informatique (Bac+3)',
      place: 'Institut GoldenCollar, Paris',
      detail: '',
    },
    {
      period: '2023 – 2024',
      title: 'L1 Informatique',
      place: 'Université Sorbonne Paris Nord, Villetaneuse',
      detail: '',
    },
    {
      period: '2022',
      title: 'Baccalauréat général, Mathématiques et Physique-Chimie',
      place: 'Lycée international Alexandre Dumas, Alger',
      detail: '',
    },
  ],

  certifications: [
    'Google Data Analytics Professional Certificate, Coursera (en cours)',
    'Google Business Intelligence Professional Certificate, Coursera (à venir)',
    'Programmation Java, EPFL sur Coursera',
  ],

  languages: ['Français (courant)', 'Anglais (professionnel)', 'Arabe (courant)', 'Kabyle (langue maternelle)'],

  suggestions: [
    'Quels sont ses projets data ?',
    'Quelles technologies maîtrise-t-il ?',
    'Que fait-il chez Pokawa ?',
    'Quel type d’alternance cherche-t-il ?',
    'Quel est son parcours de formation ?',
    'Comment le contacter ?',
  ],
};
