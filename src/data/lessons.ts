/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lesson } from "../types";

export const lessonsData: Lesson[] = [
  {
    id: "mtic_1_1",
    title: "MTIC 1.1 — Concepts généraux de l’informatique",
    level: "7ème Année",
    category: "Concepts de Base",
    imageUrl: "/assets/images/concepts_generaux_1782869778465.jpg",
    objectives: [
      "Donner une définition simple de l’informatique.",
      "Différencier données et information par un exemple.",
      "Nommer au moins quatre composants matériels et expliquer leur fonction.",
      "Expliquer ce qu’est un système d’exploitation et citer un exemple.",
      "Énoncer trois règles simples pour une utilisation sûre et responsable des TIC."
    ],
    contentSections: [
      {
        title: "1. Introduction",
        body: "L’informatique est la science et la technique qui permettent de traiter automatiquement des informations à l’aide d’ordinateurs. Elle est présente dans la plupart des activités quotidiennes (études, communication, travail)."
      },
      {
        title: "2. Données et information",
        body: "Il est crucial de faire la distinction entre ces deux notions de base :",
        bullets: [
          "Données : faits bruts non organisés, sans signification immédiate (nombres, textes isolés, images brutes).",
          "Information : données traitées, organisées et interprétées qui ont un sens utile et compréhensible.",
          "Exemple : Une liste de notes d'élèves représente des données. La moyenne calculée de la classe représente l'information."
        ]
      },
      {
        title: "3. Matériel (Hardware)",
        body: "Le matériel (Hardware) désigne tous les éléments physiques, palpables et visibles de l’ordinateur :",
        bullets: [
          "Unité centrale (boîtier) : contient le cerveau de la machine, notamment le processeur (CPU), la mémoire vive (RAM) et le disque de stockage.",
          "Écran (moniteur) : permet d'afficher les images, vidéos et textes.",
          "Clavier : sert à saisir du texte, des chiffres et des commandes.",
          "Souris : outil de pointage pour cliquer et naviguer.",
          "Stockage : disque dur/SSD interne, clé USB, carte mémoire, ou concept de stockage en ligne (le Cloud)."
        ]
      },
      {
        title: "4. Logiciels (Software)",
        body: "Le logiciel (Software) représente la partie intangible, invisible et logique de l'ordinateur. Ce sont les instructions et les codes :",
        bullets: [
          "Système d’exploitation (OS) : Le logiciel de base indispensable qui gère le matériel et permet de lancer les autres programmes (ex: Windows, Android, Linux).",
          "Applications / Programmes : Logiciels conçus pour réaliser des tâches spécifiques (traitement de texte Word, navigateurs Web, jeux, antivirus)."
        ]
      },
      {
        title: "5. Bonnes pratiques et sécurité de base",
        body: "Pour utiliser l'informatique de façon responsable :",
        bullets: [
          "Ne jamais partager ses mots de passe et choisir des mots de passe forts.",
          "Sauvegarder régulièrement ses fichiers importants sur une clé USB ou dans le Cloud.",
          "Ne pas ouvrir de liens ou fichiers provenant d'inconnus.",
          "Protéger physiquement le matériel (l'éloigner de l'eau, de la poussière et l'éteindre correctement)."
        ]
      }
    ],
    summary: [
      "L'informatique est le traitement automatique de l'information.",
      "Le matériel (hardware) est physique; le logiciel (software) est virtuel.",
      "Le système d'exploitation gère la communication entre le matériel et l'utilisateur.",
      "La sécurité exige des mots de passe robustes et des sauvegardes régulières."
    ],
    videos: [
      { id: "v1_1_yt1", title: "Introduction à l'informatique", type: "youtube", url: "https://www.youtube.com/embed/KrI2DPnNZOk?list=PLZpzLuUp9qXzfbmO683R6JRlseAUqJsEo" },
      { id: "v1_1_yt2", title: "Comprendre le Hardware et Software", type: "youtube", url: "https://www.youtube.com/embed/snpAbc94C7s" }
    ],
    exercises: [
      {
        id: "ex_1_1_1",
        title: "Exploration du Bureau et Matériel",
        description: "Explorez le bureau informatique simulé pour identifier les éléments matériels d'un ordinateur.",
        type: "desktop",
        instructions: [
          "Allumez le système simulé en cliquant sur le bouton de démarrage.",
          "Ouvrez l'icône 'Informations Système' sur le Bureau.",
          "Identifiez la taille de la RAM et le modèle du Processeur pour valider l'exercice."
        ],
        validationRule: "system_info_opened"
      }
    ],
    quiz: {
      questions: [
        {
          id: "q_1_1_1",
          question: "Qu'est-ce que l'informatique ?",
          options: [
            "La science du traitement automatique de l'information",
            "L'art de fabriquer des écrans et des téléviseurs",
            "La vente de matériel de bureau uniquement",
            "La programmation de jeux vidéo exclusivement"
          ],
          correctIndex: 0,
          explanation: "L'informatique vient de la contraction de 'INFORmation' et 'autoMATIQUE'. C'est la science du traitement automatique de l'information par ordinateur."
        },
        {
          id: "q_1_1_2",
          question: "Quelle est la différence fondamentale entre donnée et information ?",
          options: [
            "L'information est brute alors que la donnée est le résultat d'un traitement",
            "La donnée est brute et sans sens immédiat, tandis que l'information est traitée et utile",
            "Il n'y a aucune différence, ce sont des synonymes parfaits",
            "La donnée est toujours sous forme d'image et l'information sous forme de texte"
          ],
          correctIndex: 1,
          explanation: "Les données sont des faits bruts non organisés (ex: une note d'examen). L'information est le résultat du traitement de ces données, leur donnant un sens utile (ex: la moyenne générale)."
        },
        {
          id: "q_1_1_3",
          question: "Parmi les éléments suivants, lequel fait partie du 'Software' (logiciel) ?",
          options: [
            "Le microprocesseur (CPU)",
            "Le disque dur externe",
            "Le système d'exploitation Windows",
            "Le clavier USB"
          ],
          correctIndex: 2,
          explanation: "Le 'Software' désigne la partie immatérielle (les programmes et codes), tandis que le 'Hardware' désigne le matériel physique. Windows est un logiciel de base (système d'exploitation), donc du Software."
        }
      ],
      passingScore: 70
    },
    resources: [
      { title: "Fiche d'accompagnement MTIC 1.1", type: "pdf", size: "1.2 MB", downloadUrl: "#" },
      { title: "Glossaire des termes informatiques de base", type: "word", size: "450 KB", downloadUrl: "#" }
    ]
  },
  {
    id: "mtic_1_2",
    title: "MTIC 1.2 — Présentation de l’ordinateur",
    level: "7ème Année",
    category: "Concepts de Base",
    imageUrl: "/assets/images/presentation_pc_1782869790193.jpg",
    objectives: [
      "Définir ce qu’est un ordinateur.",
      "Expliquer le rôle principal d'un ordinateur.",
      "Distinguer les parties Hardware et Software de l’ordinateur.",
      "Identifier l'importance de l'ordinateur dans l'éducation."
    ],
    contentSections: [
      {
        title: "1. Définition",
        body: "L’ordinateur est une machine électronique programmable capable de recevoir des données, de les traiter automatiquement selon des instructions pré-enregistrées (programmes), puis de produire des résultats. Il communique avec le monde extérieur grâce à des périphériques."
      },
      {
        title: "2. Rôle de l’ordinateur",
        body: "L'ordinateur est conçu pour quatre fonctions fondamentales :",
        bullets: [
          "Traiter l'information : effectuer des calculs ultra-rapides et exécuter des opérations complexes.",
          "Stocker les données : conserver de gros volumes de textes, images, vidéos, et bases de données.",
          "Communiquer : échanger avec d’autres appareils ou utilisateurs à travers des réseaux comme Internet.",
          "Faciliter le travail et l'apprentissage : rédaction, recherche, conception d'applications."
        ]
      },
      {
        title: "3. Matériel et Logiciel",
        body: "Tout ordinateur fonctionne sur un binôme indissociable :",
        bullets: [
          "Le Hardware : la carrosserie et les organes physiques (disque dur, carte mère, RAM, écran, clavier).",
          "Le Software : l'esprit et l'intelligence (système d'exploitation, applications, fichiers)."
        ]
      }
    ],
    summary: [
      "L'ordinateur traite des données d'entrée pour produire des résultats en sortie.",
      "Il se compose de matériel physique (hardware) et d'applications immatérielles (software).",
      "Il est omniprésent dans les écoles, les bureaux et la vie sociale moderne."
    ],
    videos: [
      { id: "v1_2_yt", title: "Présentation de l'ordinateur", type: "youtube", url: "https://www.youtube.com/embed/85XUJXHbjBo" }
    ],
    exercises: [
      {
        id: "ex_1_2_1",
        title: "Simulateur de Démarrage PC",
        description: "Apprenez à allumer et éteindre un ordinateur correctement dans l'interface Windows simulée.",
        type: "desktop",
        instructions: [
          "Cliquez sur le bouton d'alimentation virtuel pour lancer le système.",
          "Une fois sur le bureau, ouvrez le Menu Démarrer (logo en bas à gauche).",
          "Sélectionner l'option 'Arrêter le système' pour simuler une extinction propre."
        ],
        validationRule: "pc_shutdown_clean"
      }
    ],
    quiz: {
      questions: [
        {
          id: "q_1_2_1",
          question: "Quelle est la principale fonction de l'unité centrale ?",
          options: [
            "Afficher les images et le texte",
            "Assurer le traitement et le calcul des informations",
            "Imprimer des documents papier",
            "Permettre uniquement de saisir du texte au clavier"
          ],
          correctIndex: 1,
          explanation: "L'unité centrale abrite le microprocesseur (cerveau de la machine) et la mémoire vive. Son rôle principal est d'assurer le traitement et le calcul des informations reçues."
        }
      ],
      passingScore: 70
    },
    resources: [
      { title: "Présentation PowerPoint de l'ordinateur", type: "powerpoint", size: "2.4 MB", downloadUrl: "#" }
    ]
  },
  {
    id: "mtic_1_3",
    title: "MTIC 1.3 — Les périphériques de base",
    level: "7ème Année",
    category: "Périphériques",
    imageUrl: "/assets/images/peripheriques_pc_1782869805433.jpg",
    objectives: [
      "Définir un périphérique.",
      "Classer les périphériques selon leur fonction (entrée, sortie, stockage, communication).",
      "Donner des exemples précis pour chaque catégorie.",
      "Expliquer l'importance des périphériques dans l'utilisation quotidienne."
    ],
    contentSections: [
      {
        title: "1. Définition",
        body: "Les périphériques sont des appareils matériels connectés à l’unité centrale de l'ordinateur. Ils permettent à l'utilisateur de communiquer avec la machine pour y entrer des données, en sortir des résultats, stocker des fichiers ou échanger avec d'autres ordinateurs."
      },
      {
        title: "2. Les Périphériques d’Entrée",
        body: "Ils servent à envoyer des informations (textes, commandes, sons, images) vers l’ordinateur :",
        bullets: [
          "Le clavier : Saisie de caractères et commandes.",
          "La souris : Pointage, clics et navigation.",
          "Le scanner : Numérisation de documents papier.",
          "La webcam & le microphone : Captures d'images, vidéos et sons."
        ]
      },
      {
        title: "3. Les Périphériques de Sortie",
        body: "Ils reçoivent les résultats traités par l'ordinateur pour les restituer à l'utilisateur :",
        bullets: [
          "L’écran (moniteur) : Affichage visuel.",
          "L'imprimante : Impression papier.",
          "Les haut-parleurs & écouteurs : Diffusion sonore.",
          "Le projecteur : Projection d'images sur grand écran."
        ]
      },
      {
        title: "4. Les Périphériques de Stockage",
        body: "Ils servent à enregistrer et à conserver durablement les données numériques :",
        bullets: [
          "Le disque dur (HDD) & le disque SSD : Stockage interne ou externe de grande capacité.",
          "La clé USB : Support mobile pratique de taille moyenne.",
          "La carte mémoire : Utilisée fréquemment dans les smartphones et caméras.",
          "Le CD ou DVD : Disques optiques (de moins en moins utilisés)."
        ]
      },
      {
        title: "5. Les Périphériques de Communication",
        body: "Ils permettent d'échanger des données entre l'ordinateur et d'autres machines sur un réseau :",
        bullets: [
          "La carte réseau / Wi-Fi : Connexion au réseau local et Internet.",
          "Le modem : Module de transmission ADSL ou fibre.",
          "L'adaptateur Bluetooth : Communication sans fil de courte portée."
        ]
      }
    ],
    summary: [
      "Les périphériques connectent l'humain à l'unité centrale.",
      "Entrée = envoie des données (clavier, souris).",
      "Sortie = reçoit les données (écran, imprimante, son).",
      "Stockage = enregistre les données (clé USB, SSD).",
      "Communication = connecte au réseau (Wi-Fi, Bluetooth)."
    ],
    videos: [
      { id: "v1_3_yt", title: "Les périphériques de base", type: "youtube", url: "https://www.youtube.com/embed/oRL1TdYHqfo" }
    ],
    exercises: [
      {
        id: "ex_1_3_1",
        title: "Tri Interactif des Périphériques",
        description: "Classer différents appareils dans les colonnes d'Entrée, de Sortie ou de Stockage.",
        type: "desktop",
        instructions: [
          "Accédez au laboratoire de Tri dans le volet d'exercices.",
          "Glissez-déposez le Clavier dans Entrée, l'Imprimante dans Sortie, et la Clé USB dans Stockage.",
          "Cliquez sur Valider le Tri pour obtenir vos points d'expérience."
        ],
        validationRule: "peripherals_sorted_correctly"
      }
    ],
    quiz: {
      questions: [
        {
          id: "q_1_3_1",
          question: "Quel périphérique permet à la fois d'écouter de la musique et de faire du son ?",
          options: [
            "L'imprimante",
            "Les haut-parleurs (Sortie)",
            "Le scanner (Entrée)",
            "Le clavier numérique"
          ],
          correctIndex: 1,
          explanation: "Les haut-parleurs reçoivent des signaux audio de l'ordinateur et les diffusent sous forme d'ondes sonores (sortie audio)."
        },
        {
          id: "q_1_3_2",
          question: "La clé USB est classée dans quelle catégorie de périphériques ?",
          options: [
            "Périphérique d'entrée",
            "Périphérique de communication",
            "Périphérique de stockage",
            "Périphérique de sortie"
          ],
          correctIndex: 2,
          explanation: "La clé USB sert à sauvegarder, transporter et conserver des données informatiques. C'est donc un périphérique de stockage."
        }
      ],
      passingScore: 70
    },
    resources: [
      { title: "Schéma d'architecture de l'ordinateur et périphériques", type: "pdf", size: "890 KB", downloadUrl: "#" }
    ]
  },
  {
    id: "mtic_1_4",
    title: "MTIC 1.4 — Fondamentaux de Windows",
    level: "7ème Année",
    category: "Windows",
    imageUrl: "/assets/images/bureau_windows_1782869815396.jpg",
    objectives: [
      "Expliquer le rôle de Windows comme système d’exploitation.",
      "Identifier les éléments de l’interface graphique (Bureau, Icônes, Barre des tâches, Menu Démarrer).",
      "Manipuler des fenêtres (réduire, agrandir, déplacer, fermer).",
      "Énumérer les bonnes pratiques d'extinction de l'ordinateur."
    ],
    contentSections: [
      {
        title: "1. Définition et rôle de Windows",
        body: "Windows est un système d’exploitation (Operating System). C'est le programme de base indispensable qui s'installe sur l'ordinateur. Sans lui, les composants matériels ne sauraient pas comment communiquer entre eux, et vous ne pourriez lancer aucune application."
      },
      {
        title: "2. Les éléments clés de l'Interface Graphique (IHM)",
        body: "Windows offre un bureau convivial constitué de plusieurs objets graphiques :",
        bullets: [
          "Le Bureau : L'écran principal sur lequel reposent vos dossiers et raccourcis. C'est votre table de travail virtuelle.",
          "Les Icônes : Des petites images symbolisant un programme (navigateur, dossier, fichier). Un double-clic les ouvre.",
          "La Barre des tâches : Bandeau horizontal (souvent en bas de l'écran) affichant les programmes ouverts, l'heure, la connexion Wi-Fi et les icônes de notifications.",
          "Le Menu Démarrer : Point d'accès universel pour lancer des programmes, chercher des fichiers, configurer des paramètres et éteindre correctement l'appareil."
        ]
      },
      {
        title: "3. La manipulation des fenêtres",
        body: "Chaque programme s'ouvre dans un rectangle appelé 'fenêtre'. Une fenêtre possède trois boutons de contrôle dans son coin supérieur droit :",
        bullets: [
          "Réduire (le trait '-') : Masque la fenêtre dans la barre des tâches sans fermer le programme.",
          "Agrandir (le carré '⬜') : Étire la fenêtre pour qu'elle occupe tout l'écran.",
          "Fermer (la croix '❌') : Quitte définitivement le programme."
        ]
      },
      {
        title: "4. Bonnes pratiques d'utilisation",
        body: "Il est vital de ne pas couper le courant brutalement pour éviter d'endommager les disques durs. Pour éteindre, allez toujours dans le Menu Démarrer -> Marche/Arrêt -> Arrêter."
      }
    ],
    summary: [
      "Windows est l'interface entre l'utilisateur et le matériel physique.",
      "Le bureau, les icônes, et la barre des tâches forment l'IHM standard.",
      "Les fenêtres s'organisent avec Réduire, Agrandir, Fermer.",
      "Éteindre proprement protège les données d'une corruption de fichiers."
    ],
    videos: [
      { id: "v1_4_yt", title: "Fondamentaux de Windows", type: "youtube", url: "https://www.youtube.com/embed/MDWD1Ad3a-w" }
    ],
    exercises: [
      {
        id: "ex_1_4_1",
        title: "Maîtrise de l'Interface Graphique",
        description: "Apprenez à manipuler les fenêtres de Windows sur un bureau virtuel interactif.",
        type: "desktop",
        instructions: [
          "Double-cliquez sur l'icône 'Dossier Scolaire' pour ouvrir sa fenêtre.",
          "Glissez la fenêtre par sa barre de titre pour la déplacer au centre de l'écran.",
          "Cliquez sur le bouton Agrandir, puis fermez-la avec la croix rouge pour terminer."
        ],
        validationRule: "window_manipulated"
      }
    ],
    quiz: {
      questions: [
        {
          id: "q_1_4_1",
          question: "Quel bouton dans le coin supérieur droit d'une fenêtre permet de la masquer temporairement sans fermer le logiciel ?",
          options: [
            "La croix rouge (Fermer)",
            "Le carré (Agrandir)",
            "Le trait horizontal (Réduire)",
            "La flèche de retour"
          ],
          correctIndex: 2,
          explanation: "Le bouton Réduire (matérialisé par un tiret ou trait horizontal) place la fenêtre dans la barre des tâches en la masquant de l'écran, mais maintient l'application active."
        },
        {
          id: "q_1_4_2",
          question: "Pourquoi est-il interdit d'éteindre un ordinateur en débranchant directement la prise de courant ?",
          options: [
            "L'écran risque de changer de couleur",
            "Cela peut endommager physiquement le disque dur et corrompre les fichiers système",
            "La souris risque de ne plus fonctionner",
            "C'est uniquement pour économiser l'électricité"
          ],
          correctIndex: 1,
          explanation: "Débrancher brusquement empêche le système d'exploitation de sauvegarder les fichiers en cours et de parquer les têtes de lecture du disque, ce qui peut détruire des données."
        }
      ],
      passingScore: 70
    },
    resources: [
      { title: "Tutoriel illustré : Raccourcis Windows indispensables", type: "pdf", size: "1.1 MB", downloadUrl: "#" }
    ]
  },
  {
    id: "mtic_1_5",
    title: "MTIC 1.5 — Fichiers et répertoires",
    level: "7ème Année",
    category: "Fichiers et Dossiers",
    imageUrl: "/assets/images/fichiers_dossiers_1782869833971.jpg",
    objectives: [
      "Définir un fichier et un répertoire (dossier).",
      "Comprendre le rôle des extensions de fichiers (.docx, .pdf, .jpg, .mp3, etc.).",
      "Réaliser des opérations courantes : créer, renommer, déplacer, copier et supprimer.",
      "Expliquer la structure d'arborescence informatique."
    ],
    contentSections: [
      {
        title: "1. Définitions clés",
        body: "Pour bien s'organiser sur un ordinateur :"
      },
      {
        title: "Fichier",
        body: "C'est un ensemble de données numériques stockées sous un nom unique. Un fichier peut être un texte, une image, un son, ou un programme."
      },
      {
        title: "Répertoire (ou Dossier)",
        body: "C'est un classeur virtuel servant à regrouper et organiser des fichiers ou d'autres dossiers (sous-dossiers)."
      },
      {
        title: "2. Les types et extensions de fichiers",
        body: "L’extension de fichier est composée de 3 ou 4 lettres précédées d'un point à la fin du nom. Elle indique au système avec quel logiciel ouvrir le fichier :",
        bullets: [
          ".docx : Document de traitement de texte (Microsoft Word).",
          ".pdf : Document portable lisible sur tout appareil sans déformation.",
          ".jpg / .png : Images et photographies numériques.",
          ".mp3 / .wav : Fichiers audio et musique.",
          ".mp4 / .avi : Fichiers vidéo.",
          ".zip / .rar : Dossiers compressés pour réduire le poids d'envoi."
        ]
      },
      {
        title: "3. L'arborescence",
        body: "C'est l'organisation hiérarchique des dossiers. Elle ressemble aux branches d'un arbre. Par exemple, le disque principal (C:) contient le dossier 'Cours_7eme', qui contient le sous-dossier 'Informatique', qui à son tour abrite le fichier 'Leçon5.docx'."
      }
    ],
    summary: [
      "Un fichier contient des données; un dossier organise ces fichiers.",
      "L'extension (.pdf, .docx) définit la nature du fichier et le logiciel associé.",
      "L'arborescence est une structure de rangement en cascade.",
      "Opérations fondamentales : Copier (dupliquer) et Déplacer (changer d'adresse)."
    ],
    videos: [
      { id: "v1_5_yt", title: "Fichiers et répertoires", type: "youtube", url: "https://www.youtube.com/embed/EowZr8jEbWI" }
    ],
    exercises: [
      {
        id: "ex_1_5_1",
        title: "Organisation de Dossiers",
        description: "Manipulez l'explorateur de fichiers pour ranger proprement des fichiers scolaires éparpillés.",
        type: "explorer",
        instructions: [
          "Ouvrez l'explorateur de fichiers virtuel.",
          "Créez un nouveau dossier nommé 'Devoirs_Informatique'.",
          "Déplacez-y le fichier 'exercices_reseau.pdf' depuis le dossier temporaire.",
          "Renommez le fichier 'brouillon.txt' en 'devoir_final.docx'."
        ],
        validationRule: "explorer_organization_done"
      }
    ],
    quiz: {
      questions: [
        {
          id: "q_1_5_1",
          question: "Quelle extension désigne un document de traitement de texte modifiable ?",
          options: [
            ".mp3",
            ".docx",
            ".png",
            ".zip"
          ],
          correctIndex: 1,
          explanation: "L'extension .docx est utilisée par défaut par Microsoft Word pour enregistrer ses fichiers de traitement de texte modifiables."
        },
        {
          id: "q_1_5_2",
          question: "Quelle est la différence entre copier et déplacer un fichier ?",
          options: [
            "Copier supprime l'original, déplacer le conserve",
            "Copier crée un double à un nouvel endroit tout en gardant l'original, déplacer change simplement l'adresse de l'original sans le dupliquer",
            "Déplacer change l'extension du fichier, copier ne fait rien",
            "Il n'y a pas de différence, les deux opérations font exactement la même chose"
          ],
          correctIndex: 1,
          explanation: "Copier (Copier-Coller) duplique le fichier : vous obtenez 2 fichiers identiques. Déplacer (Couper-Coller) déplace le fichier d'origine : vous n'avez qu'un seul fichier à l'arrivée."
        }
      ],
      passingScore: 70
    },
    resources: [
      { title: "Exercice d'application : Créer son arborescence de cours", type: "word", size: "320 KB", downloadUrl: "#" }
    ]
  },
  {
    id: "mtic_1_6",
    title: "MTIC 1.6 — Aperçus et utilisation de l’Internet",
    level: "7ème Année",
    category: "Internet",
    imageUrl: "/assets/images/navigateur_web_1782869846121.jpg",
    objectives: [
      "Définir l’Internet comme un réseau mondial.",
      "Expliquer le rôle des navigateurs et des moteurs de recherche.",
      "Identifier les services clés d'Internet (Web, Courriel, Visioconférence).",
      "Prendre conscience des avantages et des dangers du Web."
    ],
    contentSections: [
      {
        title: "1. Définition",
        body: "L’Internet est un réseau informatique mondial géant qui interconnecte des millions d’ordinateurs, de téléphones et de serveurs à travers le globe. Il permet un échange instantané de données (textes, images, musiques, programmes, communications)."
      },
      {
        title: "2. Les principaux services d'Internet",
        body: "Internet n'est pas qu'un outil de recherche. C'est un ensemble de services applicatifs :",
        bullets: [
          "Le World Wide Web (Web ou WWW) : Le système de pages web reliées par des liens hypertextes.",
          "La Messagerie Électronique (E-mail) : Envoi de courriers écrits et documents de manière asynchrone.",
          "La Visioconférence & VoIP : Appels vidéo et audio en direct (ex: Teams, Zoom, WhatsApp).",
          "Le Cloud Computing : Stockage et calcul sur des serveurs distants."
        ]
      },
      {
        title: "3. Le Navigateur Web",
        body: "C'est le logiciel installé sur votre machine qui sait traduire les langages de programmation des sites web (HTML/CSS) pour afficher des pages interactives agréables. Exemples : Google Chrome, Mozilla Firefox, Microsoft Edge, Safari."
      },
      {
        title: "4. Avantages et Dangers",
        body: "D'un côté, Internet offre un accès instantané au savoir mondial, facilite la communication et l'apprentissage à distance. D'un autre côté, il comporte des risques importants : fausses informations (Fake News), virus, arnaques financières, harcèlement, et addiction aux écrans."
      }
    ],
    summary: [
      "Internet est l'infrastructure physique; le Web est un service d'accès aux pages.",
      "Le navigateur est l'outil logiciel pour visiter les sites.",
      "Il faut croiser ses sources pour éviter d'être trompé par de fausses informations."
    ],
    videos: [
      { id: "v1_6_yt", title: "Aperçu et utilisation de l'Internet", type: "youtube", url: "https://www.youtube.com/embed/-2TDDyjClBI" }
    ],
    exercises: [
      {
        id: "ex_1_6_1",
        title: "Simulateur de Navigation",
        description: "Utilisez un navigateur web simulé pour rechercher une information historique sur le Fleuve Congo.",
        type: "browser",
        instructions: [
          "Ouvrez le navigateur web simulé.",
          "Saisissez l'adresse de recherche 'goocongo.cd' dans la barre d'adresse.",
          "Tapez les mots-clés 'Fleuve Congo longueur' dans le moteur de recherche.",
          "Cliquez sur le premier lien de résultat de Wikipédia pour relever l'information."
        ],
        validationRule: "visited_congo_river_page"
      }
    ],
    quiz: {
      questions: [
        {
          id: "q_1_6_1",
          question: "Qu'est-ce que l'Internet ?",
          options: [
            "Une marque d'ordinateur portable très puissante",
            "Un réseau mondial reliant des millions d'appareils pour s'échanger des données",
            "Un logiciel de traitement de texte fourni avec Windows",
            "Un synonyme parfait de Google"
          ],
          correctIndex: 1,
          explanation: "Internet est la contraction d'INTERconnected NETworks (réseaux interconnectés). C'est le réseau physique mondial reliant des terminaux informatiques."
        }
      ],
      passingScore: 70
    },
    resources: [
      { title: "Guide de sensibilisation aux dangers d'Internet pour les élèves", type: "pdf", size: "1.5 MB", downloadUrl: "#" }
    ]
  },
  {
    id: "mtic_1_7",
    title: "MTIC 1.7 — Sites internet et catégories",
    level: "7ème Année",
    category: "Internet",
    imageUrl: "/assets/images/url_navigation_1782869857882.jpg",
    objectives: [
      "Définir un site internet et une adresse URL.",
      "Analyser l'anatomie de base d'un site web.",
      "Distinguer les différentes catégories de sites internet selon leurs rôles."
    ],
    contentSections: [
      {
        title: "1. Définition et URL",
        body: "Un site internet est un ensemble de pages web interconnectées, stockées sur un serveur, et accessibles via une adresse URL unique (Uniform Resource Locator). Exemple d'URL : https://www.eduquepsp.cd."
      },
      {
        title: "2. Les grandes catégories de sites web",
        body: "On classe les sites en fonction de leur objectif éditorial ou commercial :",
        bullets: [
          "Sites d'Information : Portails de journaux et médias délivrant des articles d'actualité (ex: Radio Okapi).",
          "Sites Éducatifs : Fournissent des cours, quiz et ressources scolaires (ex: notre plateforme actuelle, Khan Academy).",
          "Sites Commerciaux (E-commerce) : Conçus pour acheter ou vendre des produits et services en ligne.",
          "Sites de Communication : Réseaux sociaux (Facebook, LinkedIn) et forums de discussion.",
          "Sites Institutionnels : Portails officiels de ministères, d'écoles ou d'organisations internationales (ex: site du Ministère de l'Éducation)."
        ]
      },
      {
        title: "3. Structure type d'une page d'un site",
        body: "Généralement, on retrouve une En-tête (Header) contenant le logo et le menu de navigation, le Corps de page (Main) affichant le contenu principal, et le Pied de page (Footer) affichant les contacts et mentions légales."
      }
    ],
    summary: [
      "Chaque site web possède une adresse réseau appelée URL.",
      "Un site est composé de pages d'accueil, de pages internes et de liens hypertextes.",
      "Les sites officiels d'organismes se repèrent souvent par des extensions comme .gouv ou .org."
    ],
    videos: [
      { id: "v1_7_yt", title: "Sites Internet et catégories", type: "youtube", url: "https://www.youtube.com/embed/miiqZ9sBw-k" }
    ],
    exercises: [
      {
        id: "ex_1_7_1",
        title: "Identification d'URL Institutionnelle",
        description: "Utilisez le navigateur simulé pour visiter et valider le site officiel d'une institution publique.",
        type: "browser",
        instructions: [
          "Tapez l'adresse 'https://www.ministere-education.gouv.cd' dans la barre URL.",
          "Explorez la page d'accueil pour trouver le nom du ministre actuel.",
          "Cliquez sur l'onglet 'Ressources' pour valider votre parcours pédagogique."
        ],
        validationRule: "visited_institutional_edu_page"
      }
    ],
    quiz: {
      questions: [
        {
          id: "q_1_7_1",
          question: "Que signifie le sigle URL ?",
          options: [
            "User Resource Locator",
            "Uniform Resource Locator",
            "Universal Registry Line",
            "United Network Link"
          ],
          correctIndex: 1,
          explanation: "URL signifie Uniform Resource Locator (Localisateur Uniforme de Ressource). C'est l'adresse web précise permettant de localiser une page sur le réseau."
        },
        {
          id: "q_1_7_2",
          question: "Un site web qui vend des uniformes et des cahiers scolaires en ligne appartient à quelle catégorie ?",
          options: [
            "Site institutionnel",
            "Site commercial (E-commerce)",
            "Site d'actualités",
            "Site de messagerie instantanée"
          ],
          correctIndex: 1,
          explanation: "Puisqu'il propose des produits à l'achat et à la vente avec un système de transaction, c'est un site commercial."
        }
      ],
      passingScore: 70
    },
    resources: [
      { title: "Exercices d'analyse d'URLs et de domaines de confiance", type: "pdf", size: "580 KB", downloadUrl: "#" }
    ]
  },
  {
    id: "mtic_1_8",
    title: "MTIC 1.8 — Navigateurs internet et moteurs de recherche",
    level: "7ème Année",
    category: "Internet",
    imageUrl: "/assets/images/recherche_web_1782869869925.jpg",
    objectives: [
      "Distinguer clairement un navigateur internet d'un moteur de recherche.",
      "Expliquer le fonctionnement d'un moteur de recherche.",
      "Choisir et utiliser des mots-clés performants lors d'une recherche."
    ],
    contentSections: [
      {
        title: "1. La distinction fondamentale",
        body: "C'est l'erreur la plus fréquente des débutants en informatique :",
        bullets: [
          "Le Navigateur : C'est le LOGICIEL installé sur l'ordinateur qui sert de véhicule pour aller sur le réseau (ex: Google Chrome, Firefox). Sans navigateur, on ne peut ouvrir aucune page web.",
          "Le Moteur de recherche : C'est un SITE WEB spécialisé qui sert d'index géant pour chercher des informations parmi des milliards de pages existantes (ex: Google, Bing, Yahoo). On ouvre le moteur de recherche À L'INTÉRIEUR du navigateur."
        ]
      },
      {
        title: "2. Comment fonctionne la recherche ?",
        body: "Pour trouver un sujet, on écrit des 'mots-clés' (les mots les plus importants du sujet, sans phrases complexes) dans la zone de saisie du moteur de recherche. Le moteur renvoie une liste de résultats triés par pertinence (les 'snippets')."
      },
      {
        title: "3. Exemple de formulation",
        body: "Pour faire une recherche sur les lions du parc de la Garamba :",
        bullets: [
          "Mauvaise formulation : 'S'il vous plaît je voudrais voir des articles sur les lions qui vivent dans le parc de la Garamba au Congo.'",
          "Bonne formulation (mots-clés) : 'lions parc Garamba RDC'"
        ]
      }
    ],
    summary: [
      "Le navigateur est le logiciel d'accès; le moteur est un outil de recherche web.",
      "On accède au moteur de recherche via le navigateur.",
      "Des mots-clés précis et concis garantissent de meilleurs résultats."
    ],
    videos: [
      { id: "v1_8_yt", title: "Navigateurs Internet et moteurs de recherche", type: "youtube", url: "https://www.youtube.com/embed/iaO-IpqSZa" }
    ],
    exercises: [
      {
        id: "ex_1_8_1",
        title: "Comparaison Pratique",
        description: "Expérimentez l'utilisation de mots-clés dans notre moteur de recherche simulé.",
        type: "browser",
        instructions: [
          "Lancez le moteur de recherche simulé.",
          "Recherchez 'peripheriques entree informatique'.",
          "Sélectionnez le résultat qui définit le clavier et la souris.",
          "Enregistrez la page dans vos favoris virtuels."
        ],
        validationRule: "correct_peripherals_keywords_searched"
      }
    ],
    quiz: {
      questions: [
        {
          id: "q_1_8_1",
          question: "Laquelle de ces propositions décrit un navigateur internet ?",
          options: [
            "Un site web qui recherche des images",
            "Un logiciel installé sur l'appareil pour afficher des pages web",
            "Un câble physique reliant l'ordinateur à la box Internet",
            "Une boîte aux lettres électronique"
          ],
          correctIndex: 1,
          explanation: "Le navigateur est le logiciel client (comme Firefox, Chrome ou Edge) qui exécute les codes des sites pour restituer l'interface visuelle des pages web."
        }
      ],
      passingScore: 70
    },
    resources: [
      { title: "Fiche d'exercice : Formuler des requêtes de recherche", type: "pdf", size: "430 KB", downloadUrl: "#" }
    ]
  },
  {
    id: "mtic_1_9",
    title: "MTIC 1.9 — Messagerie électronique",
    level: "7ème Année",
    category: "Messagerie",
    imageUrl: "/assets/images/messagerie_email_1782869887751.jpg",
    objectives: [
      "Définir la messagerie électronique (e-mail).",
      "Comprendre la structure d'une adresse de messagerie électronique.",
      "Identifier les champs obligatoires pour l'envoi d'un courriel (Destinataire, Objet, Message)."
    ],
    contentSections: [
      {
        title: "1. Définition",
        body: "La messagerie électronique (e-mail ou courriel) est un service d'Internet permettant de transmettre des messages textuels et des documents à un ou plusieurs destinataires de manière presque instantanée, sans que l'interlocuteur ait besoin d'être connecté au même moment."
      },
      {
        title: "2. Structure d’une adresse e-mail",
        body: "Une adresse électronique est normalisée, unique au monde et ne contient aucun espace ni accent :",
        bullets: [
          "nom.prenom@ecolecongo.cd",
          "nom.prenom : L'identifiant de l'utilisateur (le pseudonyme ou nom).",
          "@ (arobase) : Symbole universel de séparation signifiant 'chez' (at en anglais).",
          "ecolecongo.cd : Le domaine ou serveur qui héberge la boîte aux lettres."
        ]
      },
      {
        title: "3. Composer un e-mail",
        body: "Pour rédiger un message, il faut renseigner trois champs principaux :",
        bullets: [
          "À (To) : L'adresse de messagerie exacte du destinataire principal.",
          "Objet (Subject) : Le titre résumé du message. Très important pour donner envie de lire (ex: 'Rendu du devoir d'informatique').",
          "Le Corps de message : Le texte explicatif écrit de manière polie (Formule de politesse + contenu + signature)."
        ]
      }
    ],
    summary: [
      "L'e-mail est asynchrone (pas besoin que le destinataire soit en ligne).",
      "L'arobase (@) est obligatoire dans toute adresse de messagerie électronique.",
      "L'Objet doit être court et décrire fidèlement le but du courrier.",
      "La politesse est requise lors des échanges formels."
    ],
    videos: [
      { id: "v1_9_yt", title: "Messagerie électronique", type: "youtube", url: "https://www.youtube.com/embed/M-Nep-tceAs" }
    ],
    exercises: [
      {
        id: "ex_1_9_1",
        title: "Rédaction d'un Premier E-mail",
        description: "Envoyez un e-mail formel de rendu de travail à votre enseignant virtuel.",
        type: "email",
        instructions: [
          "Ouvrez le client de messagerie simulé.",
          "Cliquez sur 'Nouveau message'.",
          "Entrez l'adresse de l'enseignant : 'professeur.mtic@ecolecongo.cd'.",
          "Renseignez l'objet : 'Devoir MTIC 1.9'.",
          "Rédigez un message respectueux et cliquez sur 'Envoyer'."
        ],
        validationRule: "email_sent_to_teacher"
      }
    ],
    quiz: {
      questions: [
        {
          id: "q_1_9_1",
          question: "Quel caractère spécial sépare obligatoirement l'utilisateur du domaine dans une adresse e-mail ?",
          options: [
            "Le symbole hashtag (#)",
            "Le point d'interrogation (?)",
            "L'arobase (@)",
            "Le pourcentage (%)"
          ],
          correctIndex: 2,
          explanation: "L'arobase (@) est le séparateur standard historique obligatoire pour indiquer sur quel serveur est hébergée l'adresse de l'utilisateur."
        }
      ],
      passingScore: 70
    },
    resources: [
      { title: "Modèles d'e-mails professionnels et scolaires", type: "pdf", size: "720 KB", downloadUrl: "#" }
    ]
  },
  {
    id: "mtic_1_10",
    title: "MTIC 1.10 — Les pièces jointes",
    level: "7ème Année",
    category: "Messagerie",
    imageUrl: "/assets/images/email_attachment_1782869899240.jpg",
    objectives: [
      "Définir ce qu'est une pièce jointe et reconnaître son symbole universel (📎).",
      "Identifier les limites d'envoi (poids maximal d'un courriel).",
      "Appliquer les règles de sécurité relatives aux fichiers joints."
    ],
    contentSections: [
      {
        title: "1. Concept et Symbole",
        body: "Une pièce jointe (attachment) est un fichier informatique (devoir Word, photo d'illustration, tableau Excel, fichier PDF, archive ZIP) qui est attaché à un e-mail pour être envoyé au destinataire en même temps que le texte. Le bouton pour joindre un fichier est symbolisé partout par un trombone (📎)."
      },
      {
        title: "2. Limites de poids d'envoi",
        body: "Les services de messagerie ont une limite technique stricte de poids par envoi (généralement entre 20 et 25 Mo). Si un fichier est trop lourd (comme une longue vidéo HD), l'e-mail sera rejeté.",
        bullets: [
          "Alternative : Héberger le fichier dans le Cloud (Google Drive, OneDrive) et envoyer uniquement le lien d'accès partagé."
        ]
      },
      {
        title: "3. Nommage correct des fichiers",
        body: "Avant d'attacher un fichier, donnez-lui un nom clair et explicite plutôt que 'sans_titre.pdf' :",
        bullets: [
          "Exemple recommandé : 'Devoir_Informatique_Mubala_Jean.pdf'"
        ]
      },
      {
        title: "4. Vigilance et Sécurité Numérique",
        body: "C'est par les pièces jointes que se propagent la majorité des virus (malwares) dans le monde. Règles d'or :",
        bullets: [
          "Ne JAMAIS ouvrir une pièce jointe provenant d'un expéditeur inconnu.",
          "Méfiez-vous des fichiers se terminant par des extensions exécutables : .exe, .bat, .scr, .msi (ce sont des programmes qui s'exécutent automatiquement et peuvent infecter la machine)."
        ]
      }
    ],
    summary: [
      "Le trombone 📎 représente l'action de joindre un fichier.",
      "La limite de poids standard d'une pièce jointe est de 25 Mo.",
      "Les extensions exécutables (.exe) sont extrêmement dangereuses dans un e-mail."
    ],
    videos: [
      { id: "v1_10_yt", title: "Les pièces jointes", type: "youtube", url: "https://www.youtube.com/embed/UnZ_McitiwE" }
    ],
    exercises: [
      {
        id: "ex_1_10_1",
        title: "Envoi d'un Devoir avec Pièce Jointe",
        description: "Envoyez votre projet d'informatique compressé en pièce jointe tout en respectant la limite de taille.",
        type: "email",
        instructions: [
          "Créez un nouveau message dans le client e-mail.",
          "Destinataire : 'professeur.mtic@ecolecongo.cd'. Objet : 'Devoir Pièce Jointe'.",
          "Cliquez sur l'icône de Trombone (📎).",
          "Sélectionnez le fichier 'projet_final.zip' (vérifiez qu'il fait moins de 25 Mo) et validez son envoi."
        ],
        validationRule: "email_sent_with_zip_attachment"
      }
    ],
    quiz: {
      questions: [
        {
          id: "q_1_10_1",
          question: "Quelle est la limite de taille de fichier couramment acceptée pour une pièce jointe par e-mail ?",
          options: [
            "1 Go (Gigaoctet)",
            "Généralement entre 20 et 25 Mo (Mégaoctets)",
            "Pas de limite, on peut envoyer n'importe quelle taille",
            "Seulement 10 Ko (Kilooctets)"
          ],
          correctIndex: 1,
          explanation: "La majorité des serveurs de messagerie (Gmail, Outlook) limitent l'envoi de pièces jointes à 25 Mo pour éviter de saturer les réseaux."
        },
        {
          id: "q_1_10_2",
          question: "Que devez-vous faire si vous recevez un e-mail d'un inconnu avec une pièce jointe nommée 'cadeau.exe' ?",
          options: [
            "Double-cliquer dessus immédiatement pour voir le cadeau",
            "Le transférer à tous ses camarades de classe",
            "Ne pas l'ouvrir, supprimer le message et vider la corbeille",
            "Changer uniquement le nom du fichier en .docx"
          ],
          correctIndex: 2,
          explanation: "Un fichier d'un expéditeur inconnu avec l'extension exécutable '.exe' est très probablement un virus informatique dangereux. Il faut le supprimer sans l'ouvrir."
        }
      ],
      passingScore: 70
    },
    resources: [
      { title: "Exercice : Compresser et renommer des documents", type: "zip", size: "3.4 MB", downloadUrl: "#" }
    ]
  },
  {
    id: "mtic_1_11",
    title: "MTIC 1.11 — Aperçu et notions de MS Word",
    level: "7ème Année",
    category: "Traitement de Texte",
    imageUrl: "/assets/images/traitement_texte_1782869910839.jpg",
    objectives: [
      "Définir l'utilité de Microsoft Word.",
      "Identifier les principales zones de l'interface (Ruban, Page, Curseur, Zoom).",
      "Saisir du texte et appliquer une mise en forme de base (Gras, Italique, Souligné, Tailles)."
    ],
    contentSections: [
      {
        title: "1. Introduction",
        body: "Microsoft Word est un logiciel de traitement de texte (Word Processor). Son but est de vous permettre de saisir, corriger, mettre en page, enregistrer et imprimer des documents écrits (lettres, rapports de recherche, devoirs scolaires, CV)."
      },
      {
        title: "2. L'interface de Word",
        body: "Quand vous ouvrez Word, vous êtes face à une page blanche virtuelle. Les zones clés sont :",
        bullets: [
          "La Barre de titre : Affiche le nom actuel du document (ex: 'Document1').",
          "Le Ruban : Large bande en haut contenant des onglets (Accueil, Insertion, Mise en page) abritant tous les boutons d'outils.",
          "La Page blanche : L'espace de saisie de texte.",
          "Le Curseur clignotant : Barre verticale noire clignotante indiquant l'endroit exact où les lettres vont apparaître au clavier.",
          "La Barre d'état (en bas) : Affiche le nombre de pages écrites et de mots."
        ]
      },
      {
        title: "3. Saisie de base et mise en forme",
        body: "Pour écrire, tapez simplement. Word gère automatiquement le retour à la ligne. Utilisez la touche 'Entrée' uniquement pour changer de paragraphe.",
        bullets: [
          "Gras (G ou Ctrl+G) : Épaissit les lettres pour attirer l'attention (ex: les titres).",
          "Italique (I ou Ctrl+I) : Incline les lettres vers la droite (ex: citation, mots étrangers).",
          "Souligné (S ou Ctrl+U) : Tire un trait sous les mots."
        ]
      },
      {
        title: "4. Raccourcis indispensables",
        body: "Word enregistre vos documents. Il faut sauvegarder régulièrement (Enregistrer sous au premier enregistrement pour choisir l'adresse et le nom du fichier) :",
        bullets: [
          "Ctrl+S : Enregistrer le document.",
          "Ctrl+C / Ctrl+V : Copier et coller du texte sélectionné."
        ]
      }
    ],
    summary: [
      "Word sert à créer et mettre en forme des documents écrits.",
      "Le ruban regroupe l'essentiel des fonctionnalités par onglet.",
      "Le curseur clignotant détermine la zone d'écriture active.",
      "Gras (G), Italique (I) et Souligné (S) sont les styles de caractères de base."
    ],
    videos: [
      { id: "v1_11_yt", title: "Aperçu et notions élémentaires de Microsoft Word", type: "youtube", url: "https://www.youtube.com/embed/zbZ4GYt8i_0" }
    ],
    exercises: [
      {
        id: "ex_1_11_1",
        title: "Saisie et Style de Caractère",
        description: "Rédigez une courte phrase de présentation et mettez-la en forme dans le traitement de texte simulé.",
        type: "word",
        instructions: [
          "Ouvrez le traitement de texte Word simulé.",
          "Saisissez la phrase : 'J'apprends l'informatique en 7ème année.'",
          "Sélectionnez le texte saisi.",
          "Appliquez le style Gras et changez la taille de la police en 16 points.",
          "Sauvegardez le document sous le nom 'presentation_word.docx'."
        ],
        validationRule: "word_basic_styling_saved"
      }
    ],
    quiz: {
      questions: [
        {
          id: "q_1_11_1",
          question: "Quel onglet du ruban de Microsoft Word contient les boutons de police Gras (G), Italique (I) et Souligné (S) ?",
          options: [
            "L'onglet Insertion",
            "L'onglet Accueil",
            "L'onglet Mise en page",
            "L'onglet Affichage"
          ],
          correctIndex: 1,
          explanation: "L'onglet Accueil contient les groupes Presse-papiers, Police (Gras, Italique, Souligné, couleur) et Paragraphe (alignements, puces)."
        }
      ],
      passingScore: 70
    },
    resources: [
      { title: "Fiche mémo des principaux raccourcis clavier Word", type: "pdf", size: "310 KB", downloadUrl: "#" }
    ]
  },
  {
    id: "mtic_1_12",
    title: "MTIC 1.12 — Traitement d’un texte avec MS Word",
    level: "7ème Année",
    category: "Traitement de Texte",
    imageUrl: "/assets/images/text_replace_1782869923709.jpg",
    objectives: [
      "Appliquer des techniques de mise en forme avancée du texte (exposant, indice, surlignage).",
      "Régler les marges d'un document et son orientation (Portrait ou Paysage).",
      "Insérer des tableaux, des images locales et des formes géométriques."
    ],
    contentSections: [
      {
        title: "1. Formats avancés de caractères",
        body: "Pour aller plus loin dans la mise en page, Word permet de modifier le comportement des lettres :",
        bullets: [
          "L'exposant : Place un texte en petit au-dessus de la ligne standard (ex: 2ème se note 2, ou X²).",
          "L'indice : Place le texte en petit sous la ligne (ex: la formule de l'eau se note H₂O).",
          "Le changement de casse : Permet de transformer d'un clic un texte sélectionné de minuscules en MAJUSCULES.",
          "Le surlignage : Équivalent d'un feutre stabilo virtuel jaune ou vert pour faire ressortir une phrase."
        ]
      },
      {
        title: "2. Disposition et Mise en page (Onglet Disposition)",
        body: "Avant d'imprimer, configurez la feuille :",
        bullets: [
          "Les Marges : L'espace blanc laissé vide autour des quatre bords de la page (normal, étroit, large). Des marges étroites permettent de faire tenir plus de texte sur une seule page.",
          "L'Orientation : Choisissez le sens de la page : Portrait (vertical, idéal pour les lettres) ou Paysage (horizontal, idéal pour les grands tableaux ou diplômes)."
        ]
      },
      {
        title: "3. Insertion d'éléments graphiques (Onglet Insertion)",
        body: "Un document tout en texte peut être ennuyeux. Vous pouvez insérer :",
        bullets: [
          "Images : Insérer une photo depuis votre disque dur et ajuster son habillage pour que le texte coule harmonieusement autour.",
          "Formes géométriques : Dessiner des flèches, cercles, rectangles ou bulles de texte explicatives.",
          "Tableaux : Organiser des données en lignes et colonnes pour faire des plannings ou des classements scolaires."
        ]
      }
    ],
    summary: [
      "L'indice et l'exposant permettent de rédiger des formules scientifiques ou des notations.",
      "Orientation Portrait = page debout; Orientation Paysage = page couchée.",
      "Les tableaux et images s'insèrent depuis l'onglet Insertion."
    ],
    videos: [
      { id: "v1_12_yt", title: "Traitement d'un texte avec MS Word", type: "youtube", url: "https://www.youtube.com/embed/8XEOMVpL5LY" }
    ],
    exercises: [
      {
        id: "ex_1_12_1",
        title: "Mise en Page et Insertion d'Images",
        description: "Insérez un tableau et configurez l'orientation de votre document en Paysage.",
        type: "word",
        instructions: [
          "Ouvrez l'éditeur Word simulé.",
          "Basculez l'orientation de la page sur 'Paysage'.",
          "Allez sur le bouton d'insertion et créez un tableau de 3 lignes et 3 colonnes.",
          "Remplissez la première ligne avec les titres : 'Matière', 'Professeur', 'Horaire'.",
          "Visualisez l'Aperçu avant impression pour confirmer le rendu horizontal."
        ],
        validationRule: "word_advanced_layout_completed"
      }
    ],
    quiz: {
      questions: [
        {
          id: "q_1_12_1",
          question: "Comment appelle-t-on le mode d'orientation d'une page Word qui se présente à l'horizontale ?",
          options: [
            "Le mode Portrait",
            "Le mode Paysage",
            "Le mode Panorama",
            "Le mode Aligné"
          ],
          correctIndex: 1,
          explanation: "L'orientation Paysage positionne la feuille à l'horizontale (comme un tableau de peinture), tandis que le mode Portrait positionne la feuille à la verticale (debout)."
        },
        {
          id: "q_1_12_2",
          question: "Pour insérer un tableau ou une photo de vacances dans votre document Word, dans quel onglet du ruban devez-vous cliquer ?",
          options: [
            "Accueil",
            "Insertion",
            "Affichage",
            "Révision"
          ],
          correctIndex: 1,
          explanation: "L'onglet Insertion est dédié à l'ajout d'éléments externes dans le document (images, tableaux, formes, numéros de page, liens)."
        }
      ],
      passingScore: 70
    },
    resources: [
      { title: "Exercice dirigé : Créer son emploi du temps en tableau Word", type: "word", size: "540 KB", downloadUrl: "#" }
    ]
  }
];

export const badgesList = [
  { id: "badge_welcome", title: "Premiers Pas", description: "Créer un compte et se connecter sur la plateforme.", iconName: "UserCheck", xpRequired: 50, category: "Général" },
  { id: "badge_explorer", title: "Explorateur Systèmes", description: "Terminer les exercices pratiques de Windows et Fichiers.", iconName: "FolderOpen", xpRequired: 150, category: "Pratique" },
  { id: "badge_webmaster", title: "Citoyen d'Internet", description: "Terminer toutes les leçons concernant Internet et le Web.", iconName: "Globe", xpRequired: 300, category: "Internet" },
  { id: "badge_writer", title: "Rédacteur en Chef", description: "Maîtriser les cours de traitement de texte MS Word.", iconName: "FileText", xpRequired: 450, category: "Bureautique" },
  { id: "badge_perfect", title: "Savoir Absolu", description: "Obtenir 100% de réussite à 3 quiz consécutifs.", iconName: "Trophy", xpRequired: 600, category: "Quiz" }
];
