/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Monitor, Folder, FileText, Globe, Mail, Minimize2, Square, X, 
  Plus, Trash, ChevronRight, CornerDownRight, Bold, Italic, Underline, 
  AlignLeft, AlignCenter, AlignRight, FileImage, Table, Type, HelpCircle, 
  Search, ArrowLeft, ArrowRight, RotateCw, Paperclip, Send, AlertTriangle, Check, Award
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SimulatedDesktopProps {
  exerciseId: string;
  instructions: string[];
  validationRule: string;
  onSuccess: (xpEarned: number) => void;
  onClose: () => void;
}

// Initial Simulated File Structure
interface MockFile {
  name: string;
  extension: ".docx" | ".pdf" | ".jpg" | ".zip" | ".txt";
  size: number; // in MB
  content?: string;
}

interface MockFolder {
  name: string;
  files: MockFile[];
  subfolders: { [key: string]: MockFolder };
}

export default function SimulatedDesktop({ exerciseId, instructions, validationRule, onSuccess, onClose }: SimulatedDesktopProps) {
  // Virtual Windows OS state
  const [powerOn, setPowerOn] = useState<boolean>(true);
  const [startMenuOpen, setStartMenuOpen] = useState<boolean>(false);
  const [activeWindow, setActiveWindow] = useState<"desktop" | "explorer" | "word" | "browser" | "email" | null>(null);

  // Multi-window and explorer navigation state
  const [openWindows, setOpenWindows] = useState<Record<string, boolean>>({
    explorer: false,
    word: false,
    browser: false,
    email: false,
  });
  const [minimizedWindows, setMinimizedWindows] = useState<Record<string, boolean>>({
    explorer: false,
    word: false,
    browser: false,
    email: false,
  });
  const [maximizedWindows, setMaximizedWindows] = useState<Record<string, boolean>>({
    explorer: false,
    word: false,
    browser: false,
    email: false,
  });
  const [windowZIndex, setWindowZIndex] = useState<string[]>(["explorer", "word", "browser", "email"]);
  const [folderPath, setFolderPath] = useState<string[]>(["C:"]);

  // Real-time Clock and Date
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Custom states for achievements
  const [xpPoints, setXpPoints] = useState<number>(0);
  const [successTriggered, setSuccessTriggered] = useState<boolean>(false);
  const [showInstructions, setShowInstructions] = useState<boolean>(true);

  // File System State
  const [fileSystem, setFileSystem] = useState<MockFolder>({
    name: "C:",
    files: [
      { name: "brouillon", extension: ".txt", size: 2, content: "Ceci est un fichier texte de brouillon pour s'entraîner à taper sur le clavier." },
      { name: "exercices_reseau", extension: ".pdf", size: 12, content: "Cours de MTIC - Niveau 7ème Année. Sujet: Les Réseaux Informatiques et l'Internet. Un réseau informatique permet de relier des ordinateurs entre eux pour partager des fichiers, des imprimantes et une connexion Internet. Le matériel requis comprend: câbles RJ45, Switch, Routeur et Modem." }
    ],
    subfolders: {
      "Documents": { name: "Documents", files: [], subfolders: {} },
      "Images": { name: "Images", files: [{ name: "photo_classe", extension: ".jpg", size: 4, content: "Photo souvenir de la classe de 7ème Année de l'Éducation de Base." }], subfolders: {} },
      "Cours_7eme": { name: "Cours_7eme", files: [
        { name: "composants_pc", extension: ".txt", size: 1, content: "Un ordinateur est composé d'une unité centrale, d'un écran, d'un clavier, d'une souris. Il existe des périphériques d'entrée (clavier, souris) et de sortie (écran, imprimante)." }
      ], subfolders: {} },
      "Bureau": {
        name: "Bureau",
        files: [
          { name: "consignes_bureau", extension: ".txt", size: 1, content: "Astuce : Faites un clic droit sur le bureau pour ouvrir le menu contextuel de Windows 11 !" }
        ],
        subfolders: {}
      }
    }
  });

  // Windows Desktop context menu, icon size, wallpapers, refresh and properties states
  const [iconSize, setIconSize] = useState<"small" | "medium" | "large">("medium");
  const [bgChoice, setBgChoice] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [systemInfoOpen, setSystemInfoOpen] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<"name" | "type">("name");
  const [explorerSortOrder, setExplorerSortOrder] = useState<"name" | "type">("name");
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    type: "desktop" | "icon" | "explorer-empty" | "explorer-item";
    targetData?: {
      type: "system" | "folder" | "file";
      key?: string;
      name: string;
      extension?: string;
      file?: MockFile;
    };
  }>({
    visible: false,
    x: 0,
    y: 0,
    type: "desktop"
  });

  const bgStyles = [
    "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950",
    "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/70 via-slate-950 to-slate-950",
    "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-950/70 via-slate-950 to-slate-950",
    "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-slate-950"
  ];

  const getIconSizeClass = () => {
    if (iconSize === "large") return "w-12 h-12";
    if (iconSize === "small") return "w-8 h-8";
    return "w-10 h-10";
  };

  const getIconContainerClass = () => {
    if (iconSize === "large") return "w-28 md:w-32";
    if (iconSize === "small") return "w-20 md:w-24";
    return "w-24 md:w-28";
  };

  useEffect(() => {
    const handleGlobalClick = () => {
      setContextMenu(prev => prev.visible ? { ...prev, visible: false } : prev);
    };
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  const handleUniversalContextMenu = (
    e: React.MouseEvent, 
    type: "desktop" | "icon" | "explorer-empty" | "explorer-item",
    targetData?: any
  ) => {
    e.preventDefault();
    e.stopPropagation();
    
    const canvas = document.getElementById("virtual-screen-canvas");
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setContextMenu({
      visible: true,
      x: Math.min(x, rect.width - 210),
      y: Math.min(y, rect.height - (type === "desktop" ? 350 : 250)),
      type,
      targetData
    });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  const handleCreateDesktopFolder = () => {
    const name = prompt("Nom du nouveau dossier :", "Nouveau Dossier");
    if (!name) return;
    setFileSystem(prev => {
      const updated = { ...prev };
      if (!updated.subfolders["Bureau"]) {
        updated.subfolders["Bureau"] = { name: "Bureau", files: [], subfolders: {} };
      }
      if (!updated.subfolders["Bureau"].subfolders) {
        updated.subfolders["Bureau"].subfolders = {};
      }
      updated.subfolders["Bureau"].subfolders[name] = {
        name,
        files: [],
        subfolders: {}
      };
      return updated;
    });
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  const handleCreateDesktopFile = () => {
    const name = prompt("Nom du fichier texte :", "nouveau_document");
    if (!name) return;
    setFileSystem(prev => {
      const updated = { ...prev };
      if (!updated.subfolders["Bureau"]) {
        updated.subfolders["Bureau"] = { name: "Bureau", files: [], subfolders: {} };
      }
      if (!updated.subfolders["Bureau"].files) {
        updated.subfolders["Bureau"].files = [];
      }
      updated.subfolders["Bureau"].files.push({
        name,
        extension: ".txt",
        size: 1,
        content: "Nouveau document créé depuis le Bureau."
      });
      return updated;
    });
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  const handleCreateFolderInExplorer = () => {
    const name = prompt("Nom du nouveau dossier :", "Nouveau Dossier");
    if (!name) return;
    setFileSystem(prev => {
      const updated = { ...prev };
      let current = updated;
      for (let i = 1; i < folderPath.length; i++) {
        const folderName = folderPath[i];
        if (current.subfolders && current.subfolders[folderName]) {
          current = current.subfolders[folderName];
        }
      }
      if (!current.subfolders) {
        current.subfolders = {};
      }
      current.subfolders[name] = {
        name,
        files: [],
        subfolders: {}
      };
      return updated;
    });
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  const handleCreateFileInExplorer = () => {
    const name = prompt("Nom du fichier texte (sans extension) :", "nouveau_document");
    if (!name) return;
    setFileSystem(prev => {
      const updated = { ...prev };
      let current = updated;
      for (let i = 1; i < folderPath.length; i++) {
        const folderName = folderPath[i];
        if (current.subfolders && current.subfolders[folderName]) {
          current = current.subfolders[folderName];
        }
      }
      if (!current.files) {
        current.files = [];
      }
      current.files.push({
        name,
        extension: ".txt",
        size: 1,
        content: "Nouveau document créé depuis l'Explorateur de Fichiers."
      });
      return updated;
    });
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  const handleRenameItemInExplorer = (oldName: string, isFolder: boolean) => {
    const newName = prompt("Entrez le nouveau nom :", oldName);
    if (!newName) return;
    setFileSystem(prev => {
      const updated = { ...prev };
      let current = updated;
      for (let i = 1; i < folderPath.length; i++) {
        const folderName = folderPath[i];
        if (current.subfolders && current.subfolders[folderName]) {
          current = current.subfolders[folderName];
        }
      }
      if (isFolder) {
        if (current.subfolders && current.subfolders[oldName]) {
          const folderNode = current.subfolders[oldName];
          folderNode.name = newName;
          current.subfolders[newName] = folderNode;
          delete current.subfolders[oldName];
        }
      } else {
        const file = current.files.find(f => f.name === oldName);
        if (file) {
          file.name = newName;
          if (newName.endsWith(".zip")) {
            file.extension = ".zip";
            file.name = newName.replace(".zip", "");
          } else if (newName.endsWith(".docx")) {
            file.extension = ".docx";
            file.name = newName.replace(".docx", "");
          } else if (newName.endsWith(".pdf")) {
            file.extension = ".pdf";
            file.name = newName.replace(".pdf", "");
          } else if (newName.endsWith(".txt")) {
            file.extension = ".txt";
            file.name = newName.replace(".txt", "");
          }
        }
      }
      return updated;
    });
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  const handleDeleteItemInExplorer = (name: string, isFolder: boolean) => {
    if (!confirm(`Voulez-vous vraiment supprimer ${name} ?`)) return;
    setFileSystem(prev => {
      const updated = { ...prev };
      let current = updated;
      for (let i = 1; i < folderPath.length; i++) {
        const folderName = folderPath[i];
        if (current.subfolders && current.subfolders[folderName]) {
          current = current.subfolders[folderName];
        }
      }
      if (isFolder) {
        if (current.subfolders) {
          delete current.subfolders[name];
        }
      } else {
        current.files = current.files.filter(f => f.name !== name);
      }
      return updated;
    });
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  const handleChangeBg = () => {
    setBgChoice(prev => (prev + 1) % bgStyles.length);
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  const handleSort = (type: "name" | "type") => {
    setSortOrder(type);
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  const handleSetIconSize = (size: "small" | "medium" | "large") => {
    setIconSize(size);
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  const [currentFolder, setCurrentFolder] = useState<string>("C:");
  const [newFolderName, setNewFolderName] = useState<string>("");
  const [selectedFileForEmail, setSelectedFileForEmail] = useState<MockFile | null>(null);

  // File Explorer extra features
  const [explorerSearch, setExplorerSearch] = useState<string>("");
  const [photoViewerOpen, setPhotoViewerOpen] = useState<boolean>(false);
  const [photoViewerFile, setPhotoViewerFile] = useState<MockFile | null>(null);

  // Simulated Word State
  const [wordText, setWordText] = useState<string>("");
  const [wordBold, setWordBold] = useState<boolean>(false);
  const [wordItalic, setWordItalic] = useState<boolean>(false);
  const [wordUnderline, setWordUnderline] = useState<boolean>(false);
  const [wordSize, setWordSize] = useState<number>(12);
  const [wordColor, setWordColor] = useState<string>("#ffffff");
  const [wordOrientation, setWordOrientation] = useState<"Portrait" | "Paysage">("Portrait");
  const [wordMargins, setWordMargins] = useState<"Normal" | "Étroit">("Normal");
  const [wordTableRows, setWordTableRows] = useState<number>(0);
  const [wordTableCols, setWordTableCols] = useState<number>(0);
  const [wordPrintPreview, setWordPrintPreview] = useState<boolean>(false);
  const [wordSavedAs, setWordSavedAs] = useState<string>("");

  // Simulated Browser State (Chrome-like with actual history/navigation simulation)
  const [browserUrl, setBrowserUrl] = useState<string>("goocongo.cd");
  const [browserSearchKeyword, setBrowserSearchKeyword] = useState<string>("");
  const [browserSearchSubmitted, setBrowserSearchSubmitted] = useState<boolean>(false);
  const [browserCurrentPage, setBrowserCurrentPage] = useState<"search" | "search_results" | "wikipedia" | "wikipedia_peripherals" | "ministere" | "pdf_viewer" | "error">("search");
  const [browserHistory, setBrowserHistory] = useState<Array<{url: string, page: "search" | "search_results" | "wikipedia" | "wikipedia_peripherals" | "ministere" | "pdf_viewer" | "error"}>>([
    { url: "goocongo.cd", page: "search" }
  ]);
  const [browserHistoryIndex, setBrowserHistoryIndex] = useState<number>(0);

  // Simulated Email State (Integrated folders, reading pane, attachment browser)
  const [emailTo, setEmailTo] = useState<string>("");
  const [emailSubject, setEmailSubject] = useState<string>("");
  const [emailBody, setEmailBody] = useState<string>("");
  const [showAttachmentSelector, setShowAttachmentSelector] = useState<boolean>(false);
  const [attachedFile, setAttachedFile] = useState<MockFile | null>(null);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [emailFolder, setEmailFolder] = useState<"inbox" | "sent" | "drafts" | "spam" | "read_email">("inbox");
  const [attachmentFolderPath, setAttachmentFolderPath] = useState<string[]>(["C:"]);

  // Structure of Inbox Emails
  interface EmailMessage {
    id: string;
    sender: string;
    subject: string;
    date: string;
    read: boolean;
    body: string;
    attachments?: MockFile[];
  }

  const [inboxEmails, setInboxEmails] = useState<EmailMessage[]>([
    {
      id: "1",
      sender: "professeur.mtic@ecolecongo.cd",
      subject: "[DEVOIR] Travail Pratique de Technologie (7ème)",
      date: "Aujourd'hui, 08h30",
      read: false,
      body: `Bonjour cher élève,

Pour valider le TP de Technologie de l'Information et de la Communication (MTIC) de la 7ème année, vous devez accomplir les étapes suivantes :

1. Ouvrez Microsoft Word depuis le Bureau ou le menu Démarrer.
2. Rédigez un court rapport, puis appliquez la mise en forme demandée (texte en GRAS, avec une taille de police d'au moins 16 pt).
3. Enregistrez le document sous le nom exact "presentation_word.docx" (il sera sauvegardé dans Documents de votre disque C:).
4. Ouvrez cette messagerie, puis cliquez sur "Nouveau message".
5. Saisissez mon adresse e-mail : professeur.mtic@ecolecongo.cd
6. Écrivez un sujet clair (ex: "Devoir de MTIC").
7. Cliquez sur "📎 Joindre un fichier" pour ouvrir le navigateur et sélectionnez le fichier "presentation_word.docx" que vous venez de créer (dans Documents).
8. Cliquez sur "Envoyer".

Dès que l'e-mail est reçu avec la bonne pièce jointe, l'exercice sera validé !

Bon travail,
Monsieur Malonga`
    },
    {
      id: "2",
      sender: "proviseur@ecolecongo.cd",
      subject: "Consignes d'usage du laboratoire informatique de l'école",
      date: "Hier, 15h12",
      read: true,
      body: `Chers élèves,

Le laboratoire d'informatique est un outil précieux. Vous devez respecter les règles suivantes :
- Ne mangez pas et ne buvez pas près des claviers.
- Éteignez proprement l'ordinateur par le menu Démarrer (Arrêter) à la fin de la séance de TP.
- Utilisez le moteur de recherche GooCongo pour trouver vos cours ou consulter l'encyclopédie Wikipédia.

Le Proviseur`
    }
  ]);

  const [sentEmails, setSentEmails] = useState<EmailMessage[]>([]);
  const [readingEmail, setReadingEmail] = useState<EmailMessage | null>(null);

  // Sync currentFolder name with path
  useEffect(() => {
    setCurrentFolder(folderPath[folderPath.length - 1]);
  }, [folderPath]);

  // Handle taskbar click (minimize/restore/focus/launch)
  const handleTaskbarClick = (appKey: string) => {
    const isOpen = openWindows[appKey];
    const isMinimized = minimizedWindows[appKey];
    const isFocused = activeWindow === appKey && !isMinimized && isOpen;

    if (!isOpen) {
      openApp(appKey);
    } else if (isFocused) {
      toggleMinimize(appKey);
    } else {
      if (isMinimized) {
        setMinimizedWindows(prev => ({ ...prev, [appKey]: false }));
      }
      focusApp(appKey);
    }
  };

  // Focus an application window and bring it to front
  const focusApp = (appKey: string) => {
    setWindowZIndex(prev => {
      const filtered = prev.filter(k => k !== appKey);
      return [...filtered, appKey];
    });
    setActiveWindow(appKey as any);
  };

  // Open an application
  const openApp = (appKey: string) => {
    setOpenWindows(prev => ({ ...prev, [appKey]: true }));
    setMinimizedWindows(prev => ({ ...prev, [appKey]: false }));
    focusApp(appKey);
  };

  // Toggle Minimize
  const toggleMinimize = (appKey: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMinimizedWindows(prev => {
      const isMinimized = !prev[appKey];
      if (!isMinimized) {
        focusApp(appKey);
      } else {
        const nextActive = windowZIndex
          .filter(k => k !== appKey && openWindows[k] && !minimizedWindows[k])
          .slice(-1)[0] || null;
        setActiveWindow(nextActive as any);
      }
      return { ...prev, [appKey]: isMinimized };
    });
  };

  // Toggle Maximize
  const toggleMaximize = (appKey: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMaximizedWindows(prev => ({ ...prev, [appKey]: !prev[appKey] }));
    focusApp(appKey);
  };

  // Close Application
  const closeApp = (appKey: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setOpenWindows(prev => ({ ...prev, [appKey]: false }));
    const nextActive = windowZIndex
      .filter(k => k !== appKey && openWindows[k] && !minimizedWindows[k])
      .slice(-1)[0] || null;
    setActiveWindow(nextActive as any);
  };

  // Helper to get current folder node in explorer
  const getCurrentFolderNode = (path: string[]): MockFolder => {
    let current = fileSystem;
    for (let i = 1; i < path.length; i++) {
      const folderName = path[i];
      if (current.subfolders && current.subfolders[folderName]) {
        current = current.subfolders[folderName];
      }
    }
    return current;
  };

  const currentFolderNode = getCurrentFolderNode(folderPath);

  // Real-time Exercise Goal Validation
  useEffect(() => {
    if (successTriggered) return;

    let isCompleted = false;

    if (validationRule === "system_info_opened") {
      // Check if user clicked and opened simulated system info
      if (activeWindow === "explorer" && currentFolder === "C:") {
        // Just browsing helps complete
        isCompleted = true;
      }
    } else if (validationRule === "pc_shutdown_clean") {
      // Shutdown properly through start menu
      if (!powerOn) {
        isCompleted = true;
      }
    } else if (validationRule === "window_manipulated") {
      // Open dossier and double click / interact
      if (activeWindow === "explorer") {
        isCompleted = true;
      }
    } else if (validationRule === "explorer_organization_done") {
      // Create 'Devoirs_Informatique' and move 'exercices_reseau.pdf' or rename 'brouillon.txt'
      const hasDevoirsFolder = fileSystem.subfolders["Devoirs_Informatique"] !== undefined;
      const fileRenamed = fileSystem.files.some(f => f.name === "devoir_final" && f.extension === ".docx") ||
                           fileSystem.subfolders["Documents"]?.files.some(f => f.name === "devoir_final");
      if (hasDevoirsFolder || fileRenamed) {
        isCompleted = true;
      }
    } else if (validationRule === "visited_congo_river_page") {
      // Search 'Fleuve congo longueur' and view wikipedia
      if (browserUrl.includes("wikipedia") && browserCurrentPage === "wikipedia") {
        isCompleted = true;
      }
    } else if (validationRule === "visited_institutional_edu_page") {
      // Visit ministere education
      if (browserUrl.includes("ministere-education") && browserCurrentPage === "ministere") {
        isCompleted = true;
      }
    } else if (validationRule === "correct_peripherals_keywords_searched") {
      // Search peripheriques
      if (browserSearchKeyword.toLowerCase().includes("peripherique") && browserSearchSubmitted) {
        isCompleted = true;
      }
    } else if (validationRule === "email_sent_to_teacher") {
      // Sent email to teacher
      if (emailSent && emailTo.includes("professeur.mtic")) {
        isCompleted = true;
      }
    } else if (validationRule === "email_sent_with_zip_attachment") {
      // Sent email with attachment
      if (emailSent && attachedFile && attachedFile.extension === ".zip") {
        isCompleted = true;
      }
    } else if (validationRule === "word_basic_styling_saved") {
      // Saved Word document styled in bold size 16
      if (wordSavedAs === "presentation_word.docx" && wordBold && wordSize >= 16) {
        isCompleted = true;
      }
    } else if (validationRule === "word_advanced_layout_completed") {
      // Horizontal orientation landscape, insert 3x3 table, view print preview
      if (wordOrientation === "Paysage" && wordTableRows >= 3 && wordPrintPreview) {
        isCompleted = true;
      }
    }

    if (isCompleted) {
      setSuccessTriggered(true);
      setXpPoints(100);
      onSuccess(100);
    }
  }, [
    activeWindow, currentFolder, powerOn, fileSystem, browserUrl, 
    browserCurrentPage, browserSearchKeyword, browserSearchSubmitted, 
    emailSent, emailTo, attachedFile, wordSavedAs, wordBold, wordSize, 
    wordOrientation, wordTableRows, wordPrintPreview, validationRule, successTriggered
  ]);

  // Handle mock Explorer Create Folder inside current directory path
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    setFileSystem(prev => {
      const updated = { ...prev };
      let current = updated;
      for (let i = 1; i < folderPath.length; i++) {
        const folderName = folderPath[i];
        if (current.subfolders && current.subfolders[folderName]) {
          current = current.subfolders[folderName];
        }
      }
      if (!current.subfolders) {
        current.subfolders = {};
      }
      current.subfolders[newFolderName] = {
        name: newFolderName,
        files: [],
        subfolders: {}
      };
      return updated;
    });
    setNewFolderName("");
  };

  // Create an empty text file in current folder
  const handleCreateTextFile = () => {
    setFileSystem(prev => {
      const updated = { ...prev };
      let current = updated;
      for (let i = 1; i < folderPath.length; i++) {
        const folderName = folderPath[i];
        if (current.subfolders && current.subfolders[folderName]) {
          current = current.subfolders[folderName];
        }
      }
      if (!current.files) {
        current.files = [];
      }
      const count = current.files.filter(f => f.name.startsWith("nouveau_fichier")).length;
      const fName = count === 0 ? "nouveau_fichier" : `nouveau_fichier_${count}`;
      current.files.push({
        name: fName,
        extension: ".txt",
        size: 1,
        content: "Double-cliquez pour éditer ce texte dans Word."
      });
      return updated;
    });
  };

  // Move files (simulate click of organize)
  const handleMoveFileToDocuments = (fileName: string) => {
    setFileSystem(prev => {
      const updated = { ...prev };
      
      // Find the file in the current directory path
      let current = updated;
      for (let i = 1; i < folderPath.length; i++) {
        const folderName = folderPath[i];
        if (current.subfolders && current.subfolders[folderName]) {
          current = current.subfolders[folderName];
        }
      }
      
      const fileIndex = current.files.findIndex(f => f.name === fileName);
      if (fileIndex !== -1) {
        const [file] = current.files.splice(fileIndex, 1);
        if (!updated.subfolders["Documents"].files) {
          updated.subfolders["Documents"].files = [];
        }
        updated.subfolders["Documents"].files.push(file);
      }
      return updated;
    });
  };

  // Rename a file in the current directory path
  const handleRenameFile = (oldName: string, newName: string) => {
    setFileSystem(prev => {
      const updated = { ...prev };
      
      // Find the file in the current directory path
      let current = updated;
      for (let i = 1; i < folderPath.length; i++) {
        const folderName = folderPath[i];
        if (current.subfolders && current.subfolders[folderName]) {
          current = current.subfolders[folderName];
        }
      }
      
      const file = current.files.find(f => f.name === oldName);
      if (file) {
        file.name = newName;
        if (newName.endsWith(".zip")) {
          file.extension = ".zip";
          file.name = newName.replace(".zip", "");
        } else if (newName.endsWith(".docx")) {
          file.extension = ".docx";
          file.name = newName.replace(".docx", "");
        } else if (newName.endsWith(".txt")) {
          file.extension = ".txt";
          file.name = newName.replace(".txt", "");
        } else {
          file.extension = ".docx"; // Convert to docx as instructed
        }
      }
      return updated;
    });
  };

  // Word Save
  const handleSaveWordDoc = () => {
    const customName = prompt("Enregistrer le document sous le nom :", wordSavedAs || "presentation_word.docx");
    if (!customName) return;

    const baseName = customName.replace(".docx", "");
    setWordSavedAs(baseName + ".docx");

    setFileSystem(prev => {
      const updated = { ...prev };
      if (!updated.subfolders["Documents"].files) {
        updated.subfolders["Documents"].files = [];
      }
      // Avoid duplicate filenames
      updated.subfolders["Documents"].files = updated.subfolders["Documents"].files.filter(f => f.name !== baseName);
      updated.subfolders["Documents"].files.push({
        name: baseName,
        extension: ".docx",
        size: 1,
        content: wordText
      });
      return updated;
    });
  };

  const triggerFileDownload = (file: MockFile) => {
    try {
      const blob = new Blob([file.content || "Fichier de simulation du Laboratoire Informatique."], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${file.name}${file.extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  // Open a file in its associated program and trigger a real local browser download
  const handleOpenFile = (file: MockFile) => {
    triggerFileDownload(file);
    if (file.extension === ".docx" || file.extension === ".txt") {
      setWordText(file.content || "");
      setWordSavedAs(file.name + file.extension);
      openApp("word");
    } else if (file.extension === ".pdf") {
      handleBrowserNavigateDirect("cours-reseau.cd/exercices_reseau.pdf");
      openApp("browser");
    } else if (file.extension === ".zip") {
      // Intelligently open email client and attach the file
      setAttachedFile({ name: file.name, extension: file.extension, size: file.size || 8 });
      setEmailTo("professeur.mtic@ecolecongo.cd");
      setEmailSubject(`Projet de Technologie - ${file.name}`);
      setEmailBody("Bonjour Monsieur,\n\nJe vous prie de bien vouloir trouver ci-joint mon fichier projet compressé pour validation.\n\nCordialement,\nÉlève de 7ème");
      openApp("email");
    }
  };

  // Browser navigation proxy (handles back / forward stack)
  const navigateBrowser = (url: string, page: "search" | "search_results" | "wikipedia" | "wikipedia_peripherals" | "ministere" | "pdf_viewer" | "error") => {
    setBrowserUrl(url);
    setBrowserCurrentPage(page);

    setBrowserHistory(prev => {
      const updatedHistory = prev.slice(0, browserHistoryIndex + 1);
      return [...updatedHistory, { url, page }];
    });
    setBrowserHistoryIndex(prev => prev + 1);
  };

  const handleBrowserBack = () => {
    if (browserHistoryIndex > 0) {
      const prevIdx = browserHistoryIndex - 1;
      setBrowserHistoryIndex(prevIdx);
      const item = browserHistory[prevIdx];
      setBrowserUrl(item.url);
      setBrowserCurrentPage(item.page);
    }
  };

  const handleBrowserForward = () => {
    if (browserHistoryIndex < browserHistory.length - 1) {
      const nextIdx = browserHistoryIndex + 1;
      setBrowserHistoryIndex(nextIdx);
      const item = browserHistory[nextIdx];
      setBrowserUrl(item.url);
      setBrowserCurrentPage(item.page);
    }
  };

  // Browser actions
  const handleBrowserSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!browserSearchKeyword.trim()) return;
    setBrowserSearchSubmitted(true);
    
    navigateBrowser(`goocongo.cd/search?q=${encodeURIComponent(browserSearchKeyword)}`, "search_results");
  };

  const handleBrowserNavigateDirect = (url: string) => {
    const cleanUrl = url.toLowerCase().trim();
    if (cleanUrl.includes("ministere") || cleanUrl.includes("education.gouv.cd")) {
      navigateBrowser("ministere-education.gouv.cd", "ministere");
    } else if (cleanUrl.includes("goocongo") || cleanUrl === "goocongo.cd") {
      navigateBrowser("goocongo.cd", "search");
    } else if (cleanUrl.includes("wikipedia.org/wiki/fleuve_congo") || (cleanUrl.includes("wikipedia") && cleanUrl.includes("congo"))) {
      navigateBrowser("wikipedia.org/wiki/Fleuve_Congo", "wikipedia");
    } else if (cleanUrl.includes("wikipedia") && cleanUrl.includes("peripherique")) {
      navigateBrowser("wikipedia.org/wiki/Peripherique_informatique", "wikipedia_peripherals");
    } else if (cleanUrl.includes("pdf") || cleanUrl.includes("reseau") || cleanUrl.includes("exercices_reseau")) {
      navigateBrowser("cours-reseau.cd/exercices_reseau.pdf", "pdf_viewer");
    } else {
      navigateBrowser(url, "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur z-50 flex items-center justify-center p-4 overflow-hidden font-sans">
      
      {/* Outer Lab Frame */}
      <div className="bg-slate-900 border border-slate-700 w-full max-w-6xl rounded-3xl h-[92vh] flex flex-col shadow-2xl relative">
        
        {/* Lab Top Header with Target Instructions */}
        <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-t-3xl shrink-0">
          <div>
            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 text-xs font-mono font-bold uppercase tracking-wide">
              🔬 TRAVAIL PRATIQUE MTIC (RDC)
            </span>
            <h3 className="text-base font-bold text-white mt-1">Laboratoire Virtuel Interactif</h3>
          </div>
          
          {/* Action Close */}
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors text-slate-300 md:order-last cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions Panel */}
        {(() => {
          const filteredInstructions = instructions.filter(inst => {
            const text = inst.toLowerCase();
            const shouldRemove = 
              text.includes("ouvrez l'explorateur") ||
              text.includes("ouvrez microsoft word") ||
              text.includes("ouvrez le traitement") ||
              text.includes("ouvrez l'éditeur") ||
              text.includes("ouvrez le client") ||
              text.includes("créez un nouveau message") ||
              text.includes("ouvrez le navigateur") ||
              text.includes("lancez le moteur") ||
              text.includes("double-cliquez") ||
              text.includes("allumez le système") ||
              text.includes("cliquez sur le bouton d'alimentation") ||
              text.includes("une fois sur le bureau, ouvrez le menu démarrer") ||
              text.includes("accédez au laboratoire de tri");
            return !shouldRemove;
          });

          if (filteredInstructions.length === 0) return null;

          return showInstructions ? (
            <div className="bg-indigo-950/40 px-6 py-3 border-b border-slate-800 flex items-start justify-between gap-3 shrink-0">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide font-mono">Consignes de l'exercice :</h4>
                  <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 mt-1">
                    {filteredInstructions.map((inst, idx) => (
                      <li key={idx}>{inst}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <button 
                id="toggle-instructions-btn"
                onClick={() => setShowInstructions(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1 shrink-0"
                title="Masquer les consignes"
              >
                <span>Masquer</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="bg-slate-900/60 px-6 py-1.5 border-b border-slate-800/80 flex items-center justify-between shrink-0">
              <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-indigo-500" />
                Consignes de l'exercice masquées
              </span>
              <button
                onClick={() => setShowInstructions(true)}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer"
              >
                Afficher les consignes
              </button>
            </div>
          );
        })()}

        {/* THE VIRTUAL MONITOR ENVIRONMENT */}
        <div className="flex-grow bg-slate-950 relative flex flex-col justify-between overflow-hidden">
          
          {/* If PC is turned off */}
          {!powerOn ? (
            <div className="absolute inset-0 bg-black z-40 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-emerald-400 animate-pulse">
                <Monitor className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-400 mb-2">Ordinateur Hors Tension</h3>
              <p className="text-slate-600 text-xs mb-6">L'extinction propre du système d'exploitation Windows a réussi.</p>
              <button 
                onClick={() => {
                  setPowerOn(true);
                  // Open explorer by default
                  setOpenWindows({
                    explorer: true,
                    word: false,
                    browser: false,
                    email: false,
                  });
                  setMinimizedWindows({
                    explorer: false,
                    word: false,
                    browser: false,
                    email: false,
                  });
                  focusApp("explorer");
                }}
                className="py-2 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 cursor-pointer"
              >
                Rallumer le PC virtuel
              </button>
            </div>
          ) : (
            <>
              {/* VIRTUAL SCREEN CANVAS */}
              <div 
                id="virtual-screen-canvas"
                onContextMenu={(e) => handleUniversalContextMenu(e, "desktop")}
                className={`flex-grow relative overflow-hidden ${bgStyles[bgChoice]} p-6 select-none transition-all duration-300 ${isRefreshing ? "brightness-50" : ""}`}
              >
                {isRefreshing && (
                  <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] z-50 flex items-center justify-center">
                    <div className="text-white text-xs font-bold font-mono animate-pulse bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-700/50 flex items-center gap-2">
                      <RotateCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                      <span>Actualisation du Bureau...</span>
                    </div>
                  </div>
                )}
                
                {/* Desktop Grid Icons - Beautiful, highly visible wrapping container */}
                <div className="flex flex-row md:flex-col flex-wrap gap-4 md:gap-6 justify-start max-w-full text-center relative z-10">
                  
                  {/* Icon Explorer */}
                  <div 
                    onClick={() => openApp("explorer")}
                    onContextMenu={(e) => handleUniversalContextMenu(e, "icon", { type: 'system', key: 'explorer', name: 'Explorateur de Fichiers' })}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/10 active:bg-white/20 cursor-pointer transition-all ${getIconContainerClass()} shrink-0 group`}
                  >
                    <div className="relative p-1 rounded-lg group-hover:scale-105 transition-all">
                      <Folder className={`${getIconSizeClass()} text-yellow-400 drop-shadow-md`} />
                    </div>
                    <span className="text-[10px] md:text-xs font-semibold text-white truncate w-full shadow-sm drop-shadow-md bg-slate-950/40 px-1 py-0.5 rounded">Explorateur de Fichiers</span>
                  </div>

                  {/* Icon Word */}
                  <div 
                    onClick={() => openApp("word")}
                    onContextMenu={(e) => handleUniversalContextMenu(e, "icon", { type: 'system', key: 'word', name: 'MS Word' })}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/10 active:bg-white/20 cursor-pointer transition-all ${getIconContainerClass()} shrink-0 group`}
                  >
                    <div className="relative p-1 rounded-lg group-hover:scale-105 transition-all">
                      <FileText className={`${getIconSizeClass()} text-blue-500 drop-shadow-md`} />
                    </div>
                    <span className="text-[10px] md:text-xs font-semibold text-white truncate w-full shadow-sm drop-shadow-md bg-slate-950/40 px-1 py-0.5 rounded">MS Word</span>
                  </div>

                  {/* Icon Web Browser */}
                  <div 
                    onClick={() => openApp("browser")}
                    onContextMenu={(e) => handleUniversalContextMenu(e, "icon", { type: 'system', key: 'browser', name: 'Navigateur' })}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/10 active:bg-white/20 cursor-pointer transition-all ${getIconContainerClass()} shrink-0 group`}
                  >
                    <div className="relative p-1 rounded-lg group-hover:scale-105 transition-all">
                      <Globe className={`${getIconSizeClass()} text-teal-400 drop-shadow-md`} />
                    </div>
                    <span className="text-[10px] md:text-xs font-semibold text-white truncate w-full shadow-sm drop-shadow-md bg-slate-950/40 px-1 py-0.5 rounded">Navigateur</span>
                  </div>

                  {/* Icon Email Client */}
                  <div 
                    onClick={() => openApp("email")}
                    onContextMenu={(e) => handleUniversalContextMenu(e, "icon", { type: 'system', key: 'email', name: 'Messagerie' })}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/10 active:bg-white/20 cursor-pointer transition-all ${getIconContainerClass()} shrink-0 group`}
                  >
                    <div className="relative p-1 rounded-lg group-hover:scale-105 transition-all">
                      <Mail className={`${getIconSizeClass()} text-indigo-400 drop-shadow-md`} />
                    </div>
                    <span className="text-[10px] md:text-xs font-semibold text-white truncate w-full shadow-sm drop-shadow-md bg-slate-950/40 px-1 py-0.5 rounded">Messagerie</span>
                  </div>

                  {/* Recycle Bin (Corbeille) */}
                  <div 
                    onContextMenu={(e) => handleUniversalContextMenu(e, "icon", { type: 'system', key: 'bin', name: 'Corbeille' })}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/10 cursor-pointer transition-all ${getIconContainerClass()} shrink-0 group`}
                  >
                    <div className="relative p-1 rounded-lg group-hover:scale-105 transition-all">
                      <Trash className={`${getIconSizeClass()} text-slate-400 drop-shadow-md`} />
                    </div>
                    <span className="text-[10px] md:text-xs font-semibold text-white truncate w-full shadow-sm drop-shadow-md bg-slate-950/40 px-1 py-0.5 rounded">Corbeille</span>
                  </div>

                  {/* Render Custom Folders on Desktop */}
                  {(() => {
                    const customFolders = Object.keys(fileSystem.subfolders["Bureau"]?.subfolders || {});
                    const sortedFolders = sortOrder === "name" 
                      ? [...customFolders].sort((a, b) => a.localeCompare(b))
                      : customFolders;

                    return sortedFolders.map(folderName => (
                      <div 
                        key={folderName}
                        onClick={() => {
                          setFolderPath(["C:", "Bureau", folderName]);
                          openApp("explorer");
                        }}
                        onContextMenu={(e) => handleUniversalContextMenu(e, "icon", { type: 'folder', name: folderName })}
                        className={`flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/10 active:bg-white/20 cursor-pointer transition-all ${getIconContainerClass()} shrink-0 group`}
                      >
                        <div className="relative p-1 rounded-lg group-hover:scale-105 transition-all">
                          <Folder className={`${getIconSizeClass()} text-yellow-500 drop-shadow-md`} />
                        </div>
                        <span className="text-[10px] md:text-xs font-semibold text-white truncate w-full shadow-sm drop-shadow-md bg-slate-950/40 px-1 py-0.5 rounded">{folderName}</span>
                      </div>
                    ));
                  })()}

                  {/* Render Custom Files on Desktop */}
                  {(() => {
                    const customFiles = fileSystem.subfolders["Bureau"]?.files || [];
                    const sortedFiles = [...customFiles].sort((a, b) => {
                      if (sortOrder === "name") {
                        return a.name.localeCompare(b.name);
                      }
                      return a.extension.localeCompare(b.extension);
                    });

                    return sortedFiles.map((file, idx) => (
                      <div 
                        key={idx}
                        onClick={() => handleOpenFile(file)}
                        onContextMenu={(e) => handleUniversalContextMenu(e, "icon", { type: 'file', name: file.name, extension: file.extension, file })}
                        className={`flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/10 active:bg-white/20 cursor-pointer transition-all ${getIconContainerClass()} shrink-0 group`}
                      >
                        <div className="relative p-1 rounded-lg group-hover:scale-105 transition-all">
                          <FileText className={`${getIconSizeClass()} drop-shadow-md ${file.extension === ".docx" ? "text-blue-400" : file.extension === ".pdf" ? "text-rose-400" : file.extension === ".zip" ? "text-amber-400" : "text-emerald-400"}`} />
                        </div>
                        <span className="text-[10px] md:text-xs font-semibold text-white truncate w-full shadow-sm drop-shadow-md bg-slate-950/40 px-1 py-0.5 rounded">{file.name}{file.extension}</span>
                      </div>
                    ));
                  })()}

                </div>

                {/* CUSTOM WINDOWS 11 CONTEXT MENU */}
                {contextMenu.visible && (
                  <div 
                    style={{ left: contextMenu.x, top: contextMenu.y }}
                    className="absolute bg-slate-900/95 border border-slate-700/80 rounded-xl py-1.5 w-52 shadow-2xl z-[100] text-xs text-slate-200 backdrop-blur-md select-none border-t border-slate-600/30 font-sans"
                    onClick={(e) => e.stopPropagation()}
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    {contextMenu.type === "desktop" ? (
                      <>
                        {/* Display Size Options */}
                        <div className="px-3 py-1 text-[9px] text-slate-500 font-bold uppercase tracking-wider">Affichage</div>
                        <button 
                          onClick={() => handleSetIconSize("large")}
                          className={`w-full text-left px-3 py-1 hover:bg-slate-850 flex items-center justify-between transition-colors ${iconSize === "large" ? "text-indigo-400 font-bold" : ""}`}
                        >
                          <span>Grandes icônes</span>
                          {iconSize === "large" && <Check className="w-3 h-3" />}
                        </button>
                        <button 
                          onClick={() => handleSetIconSize("medium")}
                          className={`w-full text-left px-3 py-1 hover:bg-slate-850 flex items-center justify-between transition-colors ${iconSize === "medium" ? "text-indigo-400 font-bold" : ""}`}
                        >
                          <span>Icônes moyennes</span>
                          {iconSize === "medium" && <Check className="w-3 h-3" />}
                        </button>
                        <button 
                          onClick={() => handleSetIconSize("small")}
                          className={`w-full text-left px-3 py-1 hover:bg-slate-850 flex items-center justify-between transition-colors ${iconSize === "small" ? "text-indigo-400 font-bold" : ""}`}
                        >
                          <span>Petites icônes</span>
                          {iconSize === "small" && <Check className="w-3 h-3" />}
                        </button>

                        <div className="border-t border-slate-800 my-1"></div>

                        {/* Sort order options */}
                        <div className="px-3 py-1 text-[9px] text-slate-500 font-bold uppercase tracking-wider">Trier par</div>
                        <button 
                          onClick={() => handleSort("name")}
                          className={`w-full text-left px-3 py-1 hover:bg-slate-850 flex items-center justify-between transition-colors ${sortOrder === "name" ? "text-indigo-400 font-bold" : ""}`}
                        >
                          <span>Nom</span>
                          {sortOrder === "name" && <Check className="w-3 h-3" />}
                        </button>
                        <button 
                          onClick={() => handleSort("type")}
                          className={`w-full text-left px-3 py-1 hover:bg-slate-850 flex items-center justify-between transition-colors ${sortOrder === "type" ? "text-indigo-400 font-bold" : ""}`}
                        >
                          <span>Type</span>
                          {sortOrder === "type" && <Check className="w-3 h-3" />}
                        </button>

                        <div className="border-t border-slate-800 my-1"></div>

                        {/* Actualiser option */}
                        <button 
                          onClick={handleRefresh}
                          className="w-full text-left px-3 py-1.5 hover:bg-slate-850 flex items-center gap-2 transition-colors text-slate-100"
                        >
                          <RotateCw className="w-3.5 h-3.5 text-slate-400" />
                          <span>Actualiser</span>
                        </button>

                        <div className="border-t border-slate-800 my-1"></div>

                        {/* Nouveau submenu */}
                        <div className="px-3 py-1 text-[9px] text-slate-500 font-bold uppercase tracking-wider">Nouveau</div>
                        <button 
                          onClick={handleCreateDesktopFolder}
                          className="w-full text-left px-3 py-1 hover:bg-slate-850 flex items-center gap-2 transition-colors text-slate-200"
                        >
                          <Folder className="w-3.5 h-3.5 text-yellow-500" />
                          <span>Dossier</span>
                        </button>
                        <button 
                          onClick={handleCreateDesktopFile}
                          className="w-full text-left px-3 py-1 hover:bg-slate-850 flex items-center gap-2 transition-colors text-slate-200"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-400" />
                          <span>Fichier texte</span>
                        </button>

                        <div className="border-t border-slate-800 my-1"></div>

                        {/* Background option */}
                        <button 
                          onClick={handleChangeBg}
                          className="w-full text-left px-3 py-1.5 hover:bg-slate-850 flex items-center gap-2 transition-colors text-slate-200"
                        >
                          <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Changer l'arrière-plan</span>
                        </button>

                        <button 
                          onClick={() => {
                            setSystemInfoOpen(true);
                            setContextMenu(prev => ({ ...prev, visible: false }));
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-slate-850 flex items-center gap-2 transition-colors text-slate-200"
                        >
                          <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Propriétés du Système</span>
                        </button>
                      </>
                    ) : contextMenu.type === "icon" ? (
                      <>
                        {/* Icon Options */}
                        <div className="px-3 py-1 text-[9px] text-slate-500 font-bold uppercase tracking-wider block truncate">{contextMenu.targetData?.name}</div>
                        
                        <button 
                          onClick={() => {
                            if (contextMenu.targetData?.type === "system") {
                              if (contextMenu.targetData.key) openApp(contextMenu.targetData.key);
                            } else if (contextMenu.targetData?.type === "folder") {
                              setFolderPath(["C:", "Bureau", contextMenu.targetData.name]);
                              openApp("explorer");
                            } else if (contextMenu.targetData?.type === "file" && contextMenu.targetData.file) {
                              handleOpenFile(contextMenu.targetData.file);
                            }
                            setContextMenu(prev => ({ ...prev, visible: false }));
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-slate-850 flex items-center gap-2 transition-colors text-slate-100 font-bold"
                        >
                          <Monitor className="w-3.5 h-3.5 text-slate-400" />
                          <span>Ouvrir</span>
                        </button>

                        {contextMenu.targetData?.type !== "system" && (
                          <>
                            <button 
                              onClick={() => {
                                const oldName = contextMenu.targetData?.name || "";
                                const isFolder = contextMenu.targetData?.type === "folder";
                                const newName = prompt(`Entrez le nouveau nom :`, oldName);
                                if (!newName) return;

                                setFileSystem(prev => {
                                  const updated = { ...prev };
                                  const bureau = updated.subfolders["Bureau"];
                                  if (bureau) {
                                    if (isFolder) {
                                      if (bureau.subfolders && bureau.subfolders[oldName]) {
                                        const folderNode = bureau.subfolders[oldName];
                                        folderNode.name = newName;
                                        bureau.subfolders[newName] = folderNode;
                                        delete bureau.subfolders[oldName];
                                      }
                                    } else {
                                      const file = bureau.files.find(f => f.name === oldName);
                                      if (file) {
                                        file.name = newName;
                                      }
                                    }
                                  }
                                  return updated;
                                });
                                setContextMenu(prev => ({ ...prev, visible: false }));
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-850 flex items-center gap-2 transition-colors text-slate-200"
                            >
                              <Type className="w-3.5 h-3.5 text-slate-400" />
                              <span>Renommer</span>
                            </button>

                            <button 
                              onClick={() => {
                                const name = contextMenu.targetData?.name || "";
                                const isFolder = contextMenu.targetData?.type === "folder";
                                if (confirm(`Voulez-vous vraiment supprimer ${name} ?`)) {
                                  setFileSystem(prev => {
                                    const updated = { ...prev };
                                    const bureau = updated.subfolders["Bureau"];
                                    if (bureau) {
                                      if (isFolder) {
                                        if (bureau.subfolders) {
                                          delete bureau.subfolders[name];
                                        }
                                      } else {
                                        bureau.files = bureau.files.filter(f => f.name !== name);
                                      }
                                    }
                                    return updated;
                                  });
                                }
                                setContextMenu(prev => ({ ...prev, visible: false }));
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-850 flex items-center gap-2 transition-colors text-rose-400 font-semibold"
                            >
                              <Trash className="w-3.5 h-3.5 text-rose-400" />
                              <span>Supprimer</span>
                            </button>
                          </>
                        )}

                        <div className="border-t border-slate-800 my-1"></div>

                        <button 
                          onClick={() => {
                            alert(`Propriétés de ${contextMenu.targetData?.name} :\nType : ${contextMenu.targetData?.type === 'system' ? 'Application Système' : contextMenu.targetData?.type === 'folder' ? 'Dossier de fichiers' : 'Fichier de données'}\nEmplacement : C:/Bureau`);
                            setContextMenu(prev => ({ ...prev, visible: false }));
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-slate-850 flex items-center gap-2 transition-colors text-slate-400"
                        >
                          <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                          <span>Propriétés</span>
                        </button>
                      </>
                    ) : contextMenu.type === "explorer-empty" ? (
                      <>
                        <div className="px-3 py-1 text-[9px] text-slate-500 font-bold uppercase tracking-wider">Explorateur de Fichiers</div>
                        
                        <div className="px-3 py-1 text-[9px] text-slate-500 font-bold uppercase tracking-wider">Nouveau</div>
                        <button 
                          onClick={handleCreateFolderInExplorer}
                          className="w-full text-left px-3 py-1 hover:bg-slate-850 flex items-center gap-2 transition-colors text-slate-200"
                        >
                          <Folder className="w-3.5 h-3.5 text-yellow-500" />
                          <span>Dossier</span>
                        </button>
                        <button 
                          onClick={handleCreateFileInExplorer}
                          className="w-full text-left px-3 py-1 hover:bg-slate-850 flex items-center gap-2 transition-colors text-slate-200"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-400" />
                          <span>Fichier texte</span>
                        </button>

                        <div className="border-t border-slate-800 my-1"></div>

                        <div className="px-3 py-1 text-[9px] text-slate-500 font-bold uppercase tracking-wider">Trier par</div>
                        <button 
                          onClick={() => { setExplorerSortOrder("name"); setContextMenu(prev => ({ ...prev, visible: false })); }}
                          className={`w-full text-left px-3 py-1 hover:bg-slate-850 flex items-center justify-between transition-colors ${explorerSortOrder === "name" ? "text-indigo-400 font-bold" : ""}`}
                        >
                          <span>Nom</span>
                          {explorerSortOrder === "name" && <Check className="w-3 h-3" />}
                        </button>
                        <button 
                          onClick={() => { setExplorerSortOrder("type"); setContextMenu(prev => ({ ...prev, visible: false })); }}
                          className={`w-full text-left px-3 py-1 hover:bg-slate-850 flex items-center justify-between transition-colors ${explorerSortOrder === "type" ? "text-indigo-400 font-bold" : ""}`}
                        >
                          <span>Type</span>
                          {explorerSortOrder === "type" && <Check className="w-3 h-3" />}
                        </button>

                        <div className="border-t border-slate-800 my-1"></div>

                        <button 
                          onClick={handleRefresh}
                          className="w-full text-left px-3 py-1.5 hover:bg-slate-850 flex items-center gap-2 transition-colors text-slate-100"
                        >
                          <RotateCw className="w-3.5 h-3.5 text-slate-400" />
                          <span>Actualiser la vue</span>
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Explorer Item Options */}
                        <div className="px-3 py-1 text-[9px] text-slate-500 font-bold uppercase tracking-wider block truncate">{contextMenu.targetData?.name}</div>
                        
                        <button 
                          onClick={() => {
                            if (contextMenu.targetData?.type === "folder") {
                              setFolderPath(prev => [...prev, contextMenu.targetData?.name]);
                            } else if (contextMenu.targetData?.type === "file" && contextMenu.targetData.file) {
                              handleOpenFile(contextMenu.targetData.file);
                            }
                            setContextMenu(prev => ({ ...prev, visible: false }));
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-slate-850 flex items-center gap-2 transition-colors text-slate-100 font-bold"
                        >
                          <Monitor className="w-3.5 h-3.5 text-slate-400" />
                          <span>Ouvrir</span>
                        </button>

                        <button 
                          onClick={() => handleRenameItemInExplorer(contextMenu.targetData?.name || "", contextMenu.targetData?.type === "folder")}
                          className="w-full text-left px-3 py-1.5 hover:bg-slate-850 flex items-center gap-2 transition-colors text-slate-200"
                        >
                          <Type className="w-3.5 h-3.5 text-slate-400" />
                          <span>Renommer</span>
                        </button>

                        <button 
                          onClick={() => handleDeleteItemInExplorer(contextMenu.targetData?.name || "", contextMenu.targetData?.type === "folder")}
                          className="w-full text-left px-3 py-1.5 hover:bg-slate-850 flex items-center gap-2 transition-colors text-rose-400 font-semibold"
                        >
                          <Trash className="w-3.5 h-3.5 text-rose-400" />
                          <span>Supprimer</span>
                        </button>

                        <div className="border-t border-slate-800 my-1"></div>

                        <button 
                          onClick={() => {
                            const p = ["C:", ...folderPath.slice(1)].join("/");
                            alert(`Propriétés de ${contextMenu.targetData?.name} :\nType : ${contextMenu.targetData?.type === 'folder' ? 'Dossier de fichiers' : 'Fichier de données'}\nEmplacement : ${p}`);
                            setContextMenu(prev => ({ ...prev, visible: false }));
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-slate-850 flex items-center gap-2 transition-colors text-slate-400"
                        >
                          <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                          <span>Propriétés</span>
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* SYSTEM PROPERTIES MODAL */}
                {systemInfoOpen && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute inset-x-6 top-12 bottom-20 md:inset-x-20 md:top-16 md:bottom-24 bg-slate-900/95 border border-indigo-500/40 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden backdrop-blur"
                  >
                    {/* Header */}
                    <div className="bg-slate-800 px-4 py-2.5 flex items-center justify-between border-b border-slate-750 shrink-0">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                        <Monitor className="w-4 h-4 text-indigo-400" />
                        <span>Propriétés Système - Windows 11</span>
                      </div>
                      <button 
                        onClick={() => setSystemInfoOpen(false)}
                        className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-grow overflow-auto p-6 space-y-6 text-xs text-slate-300">
                      <div>
                        <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-1 mb-3 flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-400" />
                          Spécifications de l'appareil
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
                          <div>
                            <span className="text-slate-500 block">Nom de l'appareil :</span>
                            <span className="text-slate-200 font-semibold font-mono text-[11px]">PC-Scolaire-RDC-07</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Processeur :</span>
                            <span className="text-slate-200 font-semibold text-[11px]">AMD Ryzen 5 • Éducation Numérique Edition</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Mémoire RAM installée :</span>
                            <span className="text-slate-200 font-semibold font-mono text-[11px]">8,00 Go (7,85 Go utilisables)</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Type du système :</span>
                            <span className="text-slate-200 font-semibold text-[11px]">Système d'exploitation 64 bits, processeur x64</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-1 mb-3 flex items-center gap-2">
                          <Award className="w-4 h-4 text-indigo-400" />
                          Spécifications de Windows
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
                          <div>
                            <span className="text-slate-500 block">Édition :</span>
                            <span className="text-slate-200 font-semibold text-[11px]">Windows 11 Éducation de Base RDC</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Version du cours :</span>
                            <span className="text-slate-200 font-semibold font-mono text-[11px]">2026.1 • Ministère de l'EPST (RDC)</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Matière associée :</span>
                            <span className="text-slate-200 font-semibold text-[11px]">Technologies de l'Information et de la Communication</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Licence de diffusion :</span>
                            <span className="text-slate-200 font-semibold text-emerald-400 text-[11px]">Officielle &amp; Gratuite pour les élèves</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-slate-950 border-t border-slate-850 shrink-0 text-right">
                      <button 
                        onClick={() => setSystemInfoOpen(false)}
                        className="py-1.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all text-xs"
                      >
                        Fermer les Propriétés
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ACTIVE APPLICATION WINDOWS (OVERLAPPING MULTI-WINDOW CONTAINER) */}
                <AnimatePresence>
                  {["explorer", "word", "browser", "email"].map((appKey) => {
                    const isOpen = openWindows[appKey];
                    const isMinimized = minimizedWindows[appKey];
                    const isMaximized = maximizedWindows[appKey];
                    const isFocused = activeWindow === appKey;
                    const zIndex = 20 + windowZIndex.indexOf(appKey);

                    if (!isOpen || isMinimized) return null;

                    // Staggered positioning offsets for each application
                    const boundsClass = {
                      explorer: "absolute left-[2%] top-[6%] w-[94%] h-[82%] md:left-[4%] md:top-[8%] md:w-[74%] md:h-[74%]",
                      word: "absolute left-[4%] top-[10%] w-[94%] h-[82%] md:left-[16%] md:top-[12%] md:w-[72%] md:h-[74%]",
                      browser: "absolute left-[6%] top-[14%] w-[94%] h-[82%] md:left-[10%] md:top-[6%] md:w-[76%] md:h-[76%]",
                      email: "absolute left-[8%] top-[8%] w-[94%] h-[82%] md:left-[20%] md:top-[10%] md:w-[70%] md:h-[74%]",
                    }[appKey] || "absolute inset-8";

                    return (
                      <motion.div
                        key={appKey}
                        initial={{ opacity: 0, scale: 0.95, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 12 }}
                        transition={{ duration: 0.15 }}
                        onClick={() => focusApp(appKey)}
                        style={{ zIndex }}
                        className={`${
                          isMaximized 
                            ? "absolute inset-0 md:inset-2 rounded-xl" 
                            : `${boundsClass} rounded-2xl`
                        } bg-slate-900 border ${
                          isFocused ? "border-indigo-500 shadow-indigo-500/10 shadow-2xl" : "border-slate-700 shadow-xl"
                        } flex flex-col overflow-hidden`}
                      >
                        {/* App Window Top Header */}
                        <div className={`px-4 py-2 flex items-center justify-between border-b shrink-0 ${
                          isFocused ? "bg-slate-800 border-indigo-500/30" : "bg-slate-850 border-slate-800"
                        }`}>
                          <div className="flex items-center gap-2">
                            {appKey === "explorer" && <Folder className="w-4 h-4 text-yellow-400" />}
                            {appKey === "word" && <FileText className="w-4 h-4 text-blue-500" />}
                            {appKey === "browser" && <Globe className="w-4 h-4 text-teal-400" />}
                            {appKey === "email" && <Mail className="w-4 h-4 text-indigo-400" />}
                            <span className={`text-xs font-bold capitalize ${isFocused ? "text-slate-200" : "text-slate-400"}`}>
                              {appKey === "explorer" && "Explorateur de Fichiers - Windows"}
                              {appKey === "word" && "Microsoft Word - [Traitement de texte]"}
                              {appKey === "browser" && "Navigateur Web - GooCongo Chrome"}
                              {appKey === "email" && "Messagerie Électronique - Webmail"}
                            </span>
                          </div>
                          {/* Control buttons */}
                          <div className="flex items-center gap-1.5">
                            <button 
                              onClick={(e) => toggleMinimize(appKey, e)} 
                              className="p-1 rounded hover:bg-slate-700 text-slate-400 cursor-pointer"
                              title="Réduire"
                            >
                              <Minimize2 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={(e) => toggleMaximize(appKey, e)} 
                              className="p-1 rounded hover:bg-slate-700 text-slate-400 cursor-pointer"
                              title={isMaximized ? "Restaurer" : "Agrandir"}
                            >
                              <Square className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={(e) => closeApp(appKey, e)}
                              className="p-1 rounded hover:bg-rose-600 hover:text-white text-slate-400 cursor-pointer"
                              title="Fermer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* WINDOW BODY DEPENDING ON APP */}
                        <div className="flex-grow overflow-auto p-4 bg-slate-950">
                          
                          {/* 1. FILE EXPLORATOR */}
                          {appKey === "explorer" && (
                            <div className="h-full flex flex-col md:flex-row gap-4">
                              {/* Left tree sidebar */}
                              <div className="w-full md:w-48 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 shrink-0 space-y-2">
                                <div className="font-bold text-[10px] text-slate-500 uppercase">Ce PC</div>
                                <button 
                                  onClick={() => setFolderPath(["C:"])}
                                  className={`w-full flex items-center gap-2 p-1.5 rounded transition-all text-left ${folderPath.length === 1 ? 'bg-indigo-600/30 text-white border border-indigo-500/20' : 'hover:bg-slate-800/80 text-slate-300'}`}
                                >
                                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${folderPath.length > 1 ? 'rotate-90' : ''}`} />
                                  <span className="font-semibold">C: (Disque Local)</span>
                                </button>
                                <div className="pl-4 space-y-1 text-slate-400">
                                  <button 
                                    onClick={() => setFolderPath(["C:", "Documents"])}
                                    className={`w-full flex items-center gap-1.5 p-1 rounded hover:text-slate-200 text-left transition-all text-xs ${folderPath[1] === "Documents" ? 'text-indigo-400 bg-slate-800/50' : 'text-slate-400'}`}
                                  >
                                    <CornerDownRight className="w-3.5 h-3.5" />
                                    <span>Documents</span>
                                  </button>
                                  <button 
                                    onClick={() => setFolderPath(["C:", "Images"])}
                                    className={`w-full flex items-center gap-1.5 p-1 rounded hover:text-slate-200 text-left transition-all text-xs ${folderPath[1] === "Images" ? 'text-indigo-400 bg-slate-800/50' : 'text-slate-400'}`}
                                  >
                                    <CornerDownRight className="w-3.5 h-3.5" />
                                    <span>Images</span>
                                  </button>
                                  <button 
                                    onClick={() => setFolderPath(["C:", "Cours_7eme"])}
                                    className={`w-full flex items-center gap-1.5 p-1 rounded hover:text-slate-200 text-left transition-all text-xs ${folderPath[1] === "Cours_7eme" ? 'text-indigo-400 bg-slate-800/50' : 'text-slate-400'}`}
                                  >
                                    <CornerDownRight className="w-3.5 h-3.5" />
                                    <span>Cours_7eme</span>
                                  </button>
                                  <button 
                                    onClick={() => setFolderPath(["C:", "Bureau"])}
                                    className={`w-full flex items-center gap-1.5 p-1 rounded hover:text-slate-200 text-left transition-all text-xs ${folderPath[1] === "Bureau" ? 'text-indigo-400 bg-slate-800/50' : 'text-slate-400'}`}
                                  >
                                    <CornerDownRight className="w-3.5 h-3.5" />
                                    <span>Bureau (Desktop)</span>
                                  </button>
                                </div>
                              </div>

                              {/* Right files list panel */}
                              <div className="flex-grow flex flex-col justify-between">
                                <div className="space-y-4">
                                  {/* Path & Navigation Header */}
                                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 gap-4 flex-wrap">
                                    <div className="flex items-center gap-2 text-xs">
                                      <button
                                        disabled={folderPath.length <= 1}
                                        onClick={() => setFolderPath(prev => prev.slice(0, -1))}
                                        className="p-1 rounded bg-slate-850 hover:bg-slate-800 text-slate-300 disabled:opacity-40 transition-colors cursor-pointer"
                                        title="Dossier parent"
                                      >
                                        <ArrowLeft className="w-4 h-4" />
                                      </button>
                                      <div className="flex items-center gap-1 text-slate-300 font-mono">
                                        {folderPath.map((folder, idx) => (
                                          <React.Fragment key={idx}>
                                            {idx > 0 && <span className="text-slate-600">/</span>}
                                            <button
                                              onClick={() => setFolderPath(folderPath.slice(0, idx + 1))}
                                              className={`hover:text-white font-bold transition-colors ${idx === folderPath.length - 1 ? "text-indigo-400 underline decoration-indigo-400" : ""}`}
                                            >
                                              {folder}
                                            </button>
                                          </React.Fragment>
                                        ))}
                                      </div>
                                    </div>

                                    <div className="flex gap-2 items-center">
                                      <input 
                                        type="text" 
                                        value={newFolderName}
                                        onChange={e => setNewFolderName(e.target.value)}
                                        placeholder="Nom dossier..."
                                        className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 w-28"
                                      />
                                      <button 
                                        onClick={handleCreateFolder}
                                        className="py-1 px-3 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                                      >
                                        <Plus className="w-3.5 h-3.5" /> + Dossier
                                      </button>
                                      <button 
                                        onClick={handleCreateTextFile}
                                        className="py-1 px-3 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                                        title="Créer un fichier texte vide"
                                      >
                                        <FileText className="w-3.5 h-3.5" /> + Fichier.txt
                                      </button>
                                    </div>
                                  </div>

                                  {/* Items Grid */}
                                  <div 
                                    onContextMenu={(e) => handleUniversalContextMenu(e, "explorer-empty")}
                                    className="grid grid-cols-2 sm:grid-cols-3 gap-3 min-h-[280px] p-2"
                                  >
                                    {/* Render nested subfolders of CURRENT folder path */}
                                    {(() => {
                                      const folderNames = Object.keys(currentFolderNode.subfolders || {});
                                      const sortedFolders = [...folderNames].sort((a, b) => a.localeCompare(b));
                                      return sortedFolders.map(folder => (
                                        <div 
                                          key={folder}
                                          onClick={() => setFolderPath(prev => [...prev, folder])}
                                          onContextMenu={(e) => handleUniversalContextMenu(e, "explorer-item", { type: 'folder', name: folder })}
                                          className="p-3 rounded-xl bg-slate-900/85 border border-slate-800 flex items-center gap-3 hover:border-yellow-500/60 hover:bg-slate-850/50 cursor-pointer transition-all"
                                        >
                                          <Folder className="w-8 h-8 text-yellow-500 shrink-0" />
                                          <div className="overflow-hidden">
                                            <span className="text-xs font-bold text-slate-200 block truncate">{folder}</span>
                                            <span className="text-[10px] text-slate-500">Dossier</span>
                                          </div>
                                        </div>
                                      ));
                                    })()}

                                    {/* Render nested files of CURRENT folder path */}
                                    {(() => {
                                      const filesList = currentFolderNode.files || [];
                                      const sortedFiles = [...filesList].sort((a, b) => {
                                        if (explorerSortOrder === "name") {
                                          return a.name.localeCompare(b.name);
                                        }
                                        return a.extension.localeCompare(b.extension);
                                      });
                                      return sortedFiles.map((file, idx) => (
                                        <div 
                                          key={idx}
                                          onClick={() => handleOpenFile(file)}
                                          onContextMenu={(e) => handleUniversalContextMenu(e, "explorer-item", { type: 'file', name: file.name, extension: file.extension, file })}
                                          className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-indigo-500/60 hover:bg-slate-850/50 cursor-pointer transition-all relative group"
                                        >
                                          <div className="flex items-center gap-3">
                                            <FileText className={`w-8 h-8 shrink-0 ${file.extension === ".docx" ? "text-blue-400" : file.extension === ".pdf" ? "text-rose-400" : file.extension === ".zip" ? "text-amber-400" : "text-emerald-400"}`} />
                                            <div className="overflow-hidden w-full">
                                              <span className="text-xs font-bold text-slate-200 block truncate" title={`${file.name}${file.extension}`}>{file.name}{file.extension}</span>
                                              <span className="text-[10px] text-slate-500 font-mono">{file.size} Ko • {file.extension.toUpperCase()}</span>
                                            </div>
                                          </div>
                                          
                                          {/* Interaction Actions */}
                                          <div className="flex gap-1.5 mt-3 pt-2 border-t border-slate-800/60 justify-end" onClick={e => e.stopPropagation()}>
                                            {folderPath.length === 1 && (
                                              <button 
                                                onClick={(e) => { e.stopPropagation(); handleMoveFileToDocuments(file.name); }}
                                                className="text-[9px] font-bold bg-slate-800 hover:bg-slate-750 text-slate-300 py-1 px-1.5 rounded cursor-pointer"
                                                title="Déplacer vers Documents"
                                              >
                                                Ranger
                                              </button>
                                            )}
                                            <button 
                                              onClick={(e) => { 
                                                e.stopPropagation(); 
                                                const newName = prompt("Entrez le nouveau nom de fichier (ex: devoir_final) :", file.name);
                                                if (newName) handleRenameFile(file.name, newName);
                                              }}
                                              className="text-[9px] font-bold bg-slate-800 hover:bg-slate-750 text-slate-300 py-1 px-1.5 rounded cursor-pointer"
                                            >
                                              Renommer
                                            </button>
                                            <button 
                                              onClick={(e) => { 
                                                e.stopPropagation(); 
                                                if (confirm(`Voulez-vous vraiment supprimer ${file.name}${file.extension} ?`)) {
                                                  setFileSystem(prev => {
                                                    const updated = {...prev};
                                                    let current = updated;
                                                    for (let i = 1; i < folderPath.length; i++) {
                                                      const folderName = folderPath[i];
                                                      if (current.subfolders && current.subfolders[folderName]) {
                                                        current = current.subfolders[folderName];
                                                      }
                                                    }
                                                    current.files = current.files.filter(f => f.name !== file.name);
                                                    return updated;
                                                  });
                                                }
                                              }}
                                              className="text-[9px] font-bold bg-rose-950/30 hover:bg-rose-900/40 text-rose-400 py-1 px-1.5 rounded cursor-pointer"
                                            >
                                              Suppr
                                            </button>
                                          </div>
                                        </div>
                                      ));
                                    })()}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 2. MS WORD SIMULATOR */}
                          {appKey === "word" && (
                            <div className="h-full flex flex-col">
                              {/* Word Ribbon */}
                              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 mb-4 flex flex-wrap items-center gap-4 shrink-0">
                                <div className="flex items-center gap-1 border-r border-slate-800 pr-4">
                                  <button 
                                    onClick={() => setWordBold(!wordBold)}
                                    className={`p-1.5 rounded ${wordBold ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
                                    title="Gras"
                                  >
                                    <Bold className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => setWordItalic(!wordItalic)}
                                    className={`p-1.5 rounded ${wordItalic ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
                                    title="Italique"
                                  >
                                    <Italic className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => setWordUnderline(!wordUnderline)}
                                    className={`p-1.5 rounded ${wordUnderline ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
                                    title="Souligné"
                                  >
                                    <Underline className="w-4 h-4" />
                                  </button>
                                </div>

                                {/* Fonts Size picker */}
                                <div className="flex items-center gap-2 border-r border-slate-800 pr-4">
                                  <span className="text-[10px] text-slate-500 font-bold uppercase font-mono">Taille</span>
                                  <select 
                                    value={wordSize}
                                    onChange={e => setWordSize(parseInt(e.target.value))}
                                    className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-xs text-slate-300 focus:outline-none"
                                  >
                                    <option value={11}>11 pt</option>
                                    <option value={12}>12 pt</option>
                                    <option value={14}>14 pt</option>
                                    <option value={16}>16 pt (Gros)</option>
                                    <option value={20}>20 pt (Grand)</option>
                                  </select>
                                </div>

                                {/* Orientation */}
                                <div className="flex items-center gap-2 border-r border-slate-800 pr-4">
                                  <span className="text-[10px] text-slate-500 font-bold uppercase font-mono">Sens</span>
                                  <div className="flex gap-1">
                                    {["Portrait", "Paysage"].map(o => (
                                      <button
                                        key={o}
                                        onClick={() => setWordOrientation(o as any)}
                                        className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                                          wordOrientation === o ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-slate-200'
                                        }`}
                                      >
                                        {o}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Tables Insertion */}
                                <div className="flex items-center gap-2 border-r border-slate-800 pr-4">
                                  <button 
                                    onClick={() => {
                                      setWordTableRows(3);
                                      setWordTableCols(3);
                                    }}
                                    className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-300 flex items-center gap-1 cursor-pointer"
                                  >
                                    <Table className="w-3.5 h-3.5 text-blue-400" />
                                    Tableau 3x3
                                  </button>
                                </div>

                                {/* Save & Print */}
                                <div className="flex items-center gap-2 ml-auto">
                                  <button 
                                    onClick={() => setWordPrintPreview(!wordPrintPreview)}
                                    className={`text-[10px] py-1 px-3 rounded font-bold transition-all cursor-pointer ${
                                      wordPrintPreview ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                    }`}
                                  >
                                    Aperçu Impression
                                  </button>
                                  <button 
                                    onClick={handleSaveWordDoc}
                                    className="text-[10px] py-1 px-3 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer"
                                  >
                                    Enregistrer le fichier
                                  </button>
                                </div>
                              </div>

                              {/* Word workspace */}
                              {wordPrintPreview ? (
                                <div className="flex-grow flex items-center justify-center p-4 bg-slate-900/60 rounded-xl border border-slate-800 overflow-auto animate-fadeIn">
                                  {/* Simulated Print Sheet */}
                                  <div 
                                    className={`bg-white text-slate-900 shadow-2xl p-8 overflow-auto transition-all duration-305 ${
                                      wordOrientation === "Paysage" ? "w-[500px] h-[350px]" : "w-[350px] h-[500px]"
                                    }`}
                                  >
                                    <div className="border-b border-slate-200 pb-2 mb-4 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                                      <span>Rapport de 7ème Année</span>
                                      <span>Fichier : {wordSavedAs || "Nouveau_Document"}</span>
                                    </div>
                                    <div style={{ 
                                      fontWeight: wordBold ? "bold" : "normal", 
                                      fontStyle: wordItalic ? "italic" : "normal",
                                      textDecoration: wordUnderline ? "underline" : "none",
                                      fontSize: `${wordSize}px`
                                    }}>
                                      {wordText || "Saisissez du texte dans l'éditeur pour voir le rendu sur la page blanche d'impression."}
                                    </div>

                                    {/* Table preview */}
                                    {wordTableRows > 0 && (
                                      <table className="w-full mt-4 border-collapse border border-slate-400 text-[11px]">
                                        <tbody>
                                          {[...Array(wordTableRows)].map((_, rIdx) => (
                                            <tr key={rIdx} className="border border-slate-400">
                                              {[...Array(wordTableCols)].map((_, cIdx) => (
                                                <td key={cIdx} className="border border-slate-400 p-2 text-center font-semibold">
                                                  {rIdx === 0 ? (cIdx === 0 ? 'Matière' : cIdx === 1 ? 'Prof' : 'Horaire') : `Cel ${rIdx},${cIdx}`}
                                                </td>
                                              ))}
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className="flex-grow flex flex-col">
                                  <textarea 
                                    value={wordText}
                                    onChange={e => setWordText(e.target.value)}
                                    placeholder="Écrivez votre texte ici comme sur Microsoft Word..."
                                    className="w-full flex-grow bg-slate-900 text-slate-200 border border-slate-800 rounded-xl p-4 text-sm focus:outline-none focus:border-indigo-500 resize-none font-sans"
                                    style={{
                                      fontWeight: wordBold ? "bold" : "normal",
                                      fontStyle: wordItalic ? "italic" : "normal",
                                      textDecoration: wordUnderline ? "underline" : "none"
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          )}

                          {/* 3. SIMULATED BROWSER */}
                          {appKey === "browser" && (
                            <div className="h-full flex flex-col">
                              {/* Browser controls bar */}
                              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 mb-4 flex items-center gap-3 shrink-0">
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button 
                                    onClick={handleBrowserBack} 
                                    disabled={browserHistoryIndex <= 0} 
                                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 disabled:opacity-30 cursor-pointer"
                                    title="Précédent"
                                  >
                                    <ArrowLeft className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={handleBrowserForward} 
                                    disabled={browserHistoryIndex >= browserHistory.length - 1} 
                                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 disabled:opacity-30 cursor-pointer"
                                    title="Suivant"
                                  >
                                    <ArrowRight className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleBrowserNavigateDirect(browserUrl)} 
                                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 cursor-pointer"
                                    title="Actualiser"
                                  >
                                    <RotateCw className="w-4 h-4" />
                                  </button>
                                </div>

                                {/* Address Bar */}
                                <div className="flex-grow flex items-center bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-300">
                                  <span className="text-slate-600 mr-1 select-none">https://</span>
                                  <input 
                                    type="text"
                                    value={browserUrl}
                                    onChange={e => setBrowserUrl(e.target.value)}
                                    onKeyDown={e => {
                                      if (e.key === 'Enter') handleBrowserNavigateDirect(browserUrl);
                                    }}
                                    className="flex-grow bg-transparent focus:outline-none text-indigo-300"
                                  />
                                </div>

                                <button 
                                  onClick={() => handleBrowserNavigateDirect(browserUrl)}
                                  className="bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg text-xs font-bold text-white shrink-0 cursor-pointer"
                                >
                                  Visiter
                                </button>
                              </div>

                              {/* Web Page View */}
                              <div className="flex-grow bg-white text-slate-900 rounded-xl border border-slate-200 overflow-auto flex flex-col">
                                
                                {/* Page A: Search Engine GooCongo */}
                                {browserCurrentPage === "search" && (
                                  <div className="max-w-xl mx-auto py-12 px-6 text-center space-y-6 my-auto">
                                    <h2 className="text-4xl font-black tracking-tight text-indigo-600 font-mono">
                                      Goo<span className="text-teal-500">Congo</span>
                                    </h2>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-bold">Moteur de recherche scolaire national • RDC</p>
                                    
                                    <form onSubmit={handleBrowserSearch} className="flex gap-2">
                                      <div className="relative flex-grow">
                                        <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                                        <input 
                                          type="text"
                                          value={browserSearchKeyword}
                                          onChange={e => setBrowserSearchKeyword(e.target.value)}
                                          placeholder="Que cherchez-vous ? (ex: fleuve congo, peripherique...)"
                                          className="w-full bg-slate-100 border border-slate-300 rounded-full pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-950 font-medium"
                                        />
                                      </div>
                                      <button 
                                        type="submit"
                                        className="py-3 px-6 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm cursor-pointer"
                                      >
                                        Rechercher
                                      </button>
                                    </form>
                                    <div className="text-[11px] text-slate-400">
                                      Recherches populaires: <span className="text-indigo-500 underline cursor-pointer font-bold" onClick={() => { setBrowserSearchKeyword("Fleuve Congo"); navigateBrowser("goocongo.cd/search?q=Fleuve%20Congo", "search_results"); }}>Fleuve Congo</span>, <span className="text-indigo-500 underline cursor-pointer font-bold" onClick={() => { setBrowserSearchKeyword("périphériques"); navigateBrowser("goocongo.cd/search?q=peripheriques", "search_results"); }}>périphériques</span>
                                    </div>
                                  </div>
                                )}

                                {/* Page B: GooCongo Search Results */}
                                {browserCurrentPage === "search_results" && (
                                  <div className="p-6 space-y-4 max-w-2xl text-left">
                                    <div className="text-xs text-slate-400 pb-2 border-b border-slate-100 flex items-center justify-between font-mono">
                                      <span>GooCongo Search Results</span>
                                      <span>Résultats pour "{browserSearchKeyword}"</span>
                                    </div>
                                    
                                    {/* Conditional Results based on search */}
                                    {browserSearchKeyword.toLowerCase().includes("congo") ? (
                                      <div className="space-y-6">
                                        <div className="p-2.5 rounded hover:bg-slate-50 transition-all text-left">
                                          <button 
                                            onClick={() => navigateBrowser("wikipedia.org/wiki/Fleuve_Congo", "wikipedia")}
                                            className="text-lg font-bold text-blue-700 hover:underline block text-left cursor-pointer"
                                          >
                                            Le Fleuve Congo — Wikipédia, l'encyclopédie libre
                                          </button>
                                          <span className="text-xs text-emerald-600 font-mono">https://wikipedia.org/wiki/Fleuve_Congo</span>
                                          <p className="text-xs text-slate-600 mt-1">
                                            Le Fleuve Congo est le deuxième plus grand fleuve du monde par son débit (après l'Amazone) et le deuxième plus long d'Afrique après le Nil. Sa longueur totale est d'environ 4 700 kilomètres.
                                          </p>
                                        </div>
                                        <div className="p-2.5 rounded hover:bg-slate-50 transition-all text-left">
                                          <button 
                                            onClick={() => navigateBrowser("ministere-education.gouv.cd", "ministere")}
                                            className="text-lg font-bold text-blue-700 hover:underline block text-left cursor-pointer"
                                          >
                                            Géographie de la RDC - Bassin hydrographique du Congo
                                          </button>
                                          <span className="text-xs text-emerald-600 font-mono">https://ministere-education.gouv.cd/geographie</span>
                                          <p className="text-xs text-slate-600 mt-1">
                                            Le bassin du Congo couvre près de 3,7 millions de kilomètres carrés. Ses ressources hydrauliques uniques représentent un potentiel majeur pour l'agriculture, la pêche et l'électricité de la République...
                                          </p>
                                        </div>
                                      </div>
                                    ) : browserSearchKeyword.toLowerCase().includes("peripherique") || browserSearchKeyword.toLowerCase().includes("clavier") || browserSearchKeyword.toLowerCase().includes("souris") || browserSearchKeyword.toLowerCase().includes("materiel") || browserSearchKeyword.toLowerCase().includes("imprimante") || browserSearchKeyword.toLowerCase().includes("ecran") ? (
                                      <div className="space-y-6">
                                        <div className="p-2.5 rounded hover:bg-slate-50 transition-all text-left">
                                          <button 
                                            onClick={() => navigateBrowser("wikipedia.org/wiki/Peripherique_informatique", "wikipedia_peripherals")}
                                            className="text-lg font-bold text-blue-700 hover:underline block text-left cursor-pointer"
                                          >
                                            Périphérique informatique — Wikipédia, l'encyclopédie libre
                                          </button>
                                          <span className="text-xs text-emerald-600 font-mono">https://wikipedia.org/wiki/Peripherique_informatique</span>
                                          <p className="text-xs text-slate-600 mt-1">
                                            En informatique, un périphérique est un dispositif connecté à un système de traitement de l'information pour lui apporter de nouvelles fonctions. Il existe des périphériques d'entrée (clavier, souris) et de sortie (écran, imprimante)...
                                          </p>
                                        </div>
                                        <div className="p-2.5 rounded hover:bg-slate-50 transition-all text-left">
                                          <button 
                                            onClick={() => navigateBrowser("cours-reseau.cd/exercices_reseau.pdf", "pdf_viewer")}
                                            className="text-lg font-bold text-blue-700 hover:underline block text-left cursor-pointer font-bold"
                                          >
                                            📄 [PDF] Cours de Technologie : Les périphériques d'entrée-sortie et Réseaux
                                          </button>
                                          <span className="text-xs text-emerald-600 font-mono">https://cours-reseau.cd/exercices_reseau.pdf</span>
                                          <p className="text-xs text-slate-600 mt-1">
                                            Télécharger le polycopié de cours de 7ème Année de l'Éducation de Base. Apprenez les composants d'un ordinateur, la connectique RJ45 et l'architecture Internet.
                                          </p>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="space-y-6">
                                        <div className="p-2.5 rounded hover:bg-slate-50 transition-all text-left">
                                          <button 
                                            onClick={() => navigateBrowser("wikipedia.org/wiki/Fleuve_Congo", "wikipedia")}
                                            className="text-lg font-bold text-blue-700 hover:underline block text-left cursor-pointer"
                                          >
                                            Résultat : "{browserSearchKeyword}" sur Wikipédia
                                          </button>
                                          <span className="text-xs text-emerald-600 font-mono">https://wikipedia.org</span>
                                          <p className="text-xs text-slate-600 mt-1">
                                            Consultez les notions de base scolaires (Fleuve Congo, matériel informatique, réseau RJ45) pour accomplir vos tâches d'apprentissage.
                                          </p>
                                        </div>
                                        <div className="p-2.5 rounded hover:bg-slate-50 transition-all text-left">
                                          <button 
                                            onClick={() => navigateBrowser("ministere-education.gouv.cd", "ministere")}
                                            className="text-lg font-bold text-blue-700 hover:underline block text-left cursor-pointer"
                                          >
                                            Cours en ligne du Ministère de l'Éducation Nationale RDC
                                          </button>
                                          <span className="text-xs text-emerald-600 font-mono">https://ministere-education.gouv.cd</span>
                                          <p className="text-xs text-slate-600 mt-1">
                                            Ressources éducatives numériques pour le programme de 7ème de l'Éducation de Base. Accédez aux cours interactifs.
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Page C: Wikipedia Congo River Article */}
                                {browserCurrentPage === "wikipedia" && (
                                  <div className="p-6 space-y-4 max-w-2xl text-left">
                                    <div className="border-b border-slate-200 pb-2 flex justify-between items-center text-xs text-slate-400 font-mono">
                                      <span>Wikipédia Encyclopédie</span>
                                      <span>Article : Fleuve Congo</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900">Le Fleuve Congo</h3>
                                    <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                                      <p>
                                        Le <strong>Fleuve Congo</strong> est le deuxième plus grand fleuve du monde par son débit (après l'Amazone) et le deuxième plus long d'Afrique après le Nil. Sa longueur totale est d'environ <strong>4 700 kilomètres</strong>.
                                      </p>
                                      <p>
                                        Il prend sa source dans les hauts plateaux de l'Afrique de l'Est et s'écoule principalement dans la République Démocratique du Congo, formant un gigantesque bassin hydrographique vital pour l'écosystème local.
                                      </p>
                                      <div className="bg-slate-50 border-l-4 border-indigo-500 p-3 rounded-r-lg text-xs mt-4">
                                        <strong>Fiche Technique Géographique :</strong>
                                        <ul className="list-disc list-inside mt-1.5 space-y-1">
                                          <li>Débit moyen : 41 800 m³/s</li>
                                          <li>Bassin versant : 3 700 000 km²</li>
                                          <li>Affluents principaux : Oubangui, Kasaï, Lualaba</li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Page D: Wikipedia Computer Peripherals Article */}
                                {browserCurrentPage === "wikipedia_peripherals" && (
                                  <div className="p-6 space-y-4 max-w-2xl text-left font-sans">
                                    <div className="border-b border-slate-200 pb-2 flex justify-between items-center text-xs text-slate-400 font-mono">
                                      <span>Wikipédia Encyclopédie</span>
                                      <span>Article : Périphérique informatique</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 font-sans">Périphérique informatique</h3>
                                    <div className="text-sm text-slate-700 leading-relaxed space-y-4 font-sans">
                                      <p>
                                        En informatique, un <strong>périphérique</strong> est un dispositif connecté à un système de traitement de l'information (comme un ordinateur) pour y ajouter des fonctionnalités ou pour lui permettre de communiquer avec l'extérieur.
                                      </p>
                                      
                                      <h4 className="font-bold text-slate-900 text-sm border-b pb-1">1. Périphériques d'Entrée</h4>
                                      <p className="text-xs pl-2">
                                        Ils servent à envoyer des données ou des commandes à l'unité centrale de l'ordinateur. Exemples : <strong>le clavier</strong> (pour saisir du texte), <strong>la souris</strong> (pour pointer et cliquer), le scanner, le microphone.
                                      </p>

                                      <h4 className="font-bold text-slate-900 text-sm border-b pb-1">2. Périphériques de Sortie</h4>
                                      <p className="text-xs pl-2">
                                        Ils permettent de restituer sous forme compréhensible pour l'homme les données traitées par l'ordinateur. Exemples : <strong>l'écran</strong> (affichage visuel), <strong>l'imprimante</strong> (sortie papier), les haut-parleurs.
                                      </p>

                                      <h4 className="font-bold text-slate-900 text-sm border-b pb-1">3. Périphériques d'Entrée-Sortie</h4>
                                      <p className="text-xs pl-2">
                                        Ils font les deux actions. Ils transmettent et reçoivent des données. Exemples : le disque dur externe, la clé USB (stockage), <strong>le modem et le routeur</strong> (permettant la communication réseau).
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {/* Page E: Ministère de l'Éducation Nationale */}
                                {browserCurrentPage === "ministere" && (
                                  <div className="p-6 space-y-4 max-w-2xl text-slate-800 text-left">
                                    <div className="bg-indigo-900 text-white p-4 rounded-xl flex items-center justify-between">
                                      <div className="font-extrabold tracking-tight text-left">Ministère de l'Éducation Nationale (EPST - RDC)</div>
                                      <span className="text-[10px] uppercase bg-white/20 px-2 py-0.5 rounded font-mono">Officiel</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 border-b pb-1 mt-4">Programmes scolaires informatiques (MTIC)</h3>
                                    <p className="text-sm">
                                      Le Ministère de l'Enseignement Primaire, Secondaire et Technique a validé le nouveau curriculum d'apprentissage des TIC pour la 7ème année de l'éducation de base. L'objectif est d'assurer la maîtrise de l'ordinateur, du clavier, du traitement de texte Word et de la recherche responsable sur Internet.
                                    </p>
                                    <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-xs space-y-1 text-left">
                                      <span className="font-bold text-indigo-950 block">Ressources recommandées pour le TP :</span>
                                      <p>Le moteur national GooCongo indexe les fiches de cours officielles pour faciliter les exercices pratiques des élèves en classe.</p>
                                    </div>
                                  </div>
                                )}

                                {/* Page F: PDF Document Viewer for exercices_reseau.pdf */}
                                {browserCurrentPage === "pdf_viewer" && (
                                  <div className="flex-grow flex bg-slate-800 flex-col overflow-hidden select-text">
                                    {/* PDF Viewer Mini Toolbar */}
                                    <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-750 text-xs text-slate-300 font-mono">
                                      <div className="flex items-center gap-2">
                                        <span className="bg-rose-600 text-white font-bold text-[10px] px-1 rounded uppercase">PDF</span>
                                        <span className="font-semibold text-slate-200">exercices_reseau.pdf</span>
                                      </div>
                                      <div className="flex items-center gap-4">
                                        <span>Page 1 / 1</span>
                                        <span>Zoom: 100%</span>
                                      </div>
                                    </div>
                                    {/* Center white canvas sheet */}
                                    <div className="flex-grow overflow-auto p-6 flex justify-center bg-slate-700">
                                      <div className="bg-white text-slate-900 p-8 w-[500px] shadow-2xl rounded border border-slate-300 space-y-6 text-left">
                                        <div className="text-center space-y-1 border-b border-slate-200 pb-4">
                                          <h4 className="text-[10px] uppercase tracking-wider font-bold text-slate-500">République Démocratique du Congo</h4>
                                          <h3 className="text-xs font-black text-indigo-950 uppercase">Cours de MTIC • Éducation de Base</h3>
                                          <div className="w-12 h-0.5 bg-indigo-600 mx-auto mt-2" />
                                        </div>
                                        
                                        <div className="space-y-4 text-[11px] leading-relaxed text-slate-800 text-left">
                                          <h2 className="text-xs font-bold text-indigo-900 border-l-4 border-indigo-600 pl-2">Sujet: Introduction aux Réseaux Informatiques et à l'Internet</h2>
                                          
                                          <p>
                                            Un <strong>réseau informatique</strong> est un ensemble d'équipements (ordinateurs, serveurs, imprimantes) reliés entre eux pour partager des données et des ressources.
                                          </p>

                                          <div className="space-y-2">
                                            <span className="font-bold text-slate-900 block">A. Le Matériel de connexion requis :</span>
                                            <ul className="list-style-none pl-1 space-y-1 text-left">
                                              <li>• <strong>La Carte réseau :</strong> Composant intégré qui permet d'échanger des signaux.</li>
                                              <li>• <strong>Le Câble RJ45 :</strong> Support physique de transmission du signal filaire.</li>
                                              <li>• <strong>Le Switch (Commutateur) :</strong> Boîtier intelligent qui relie les ordinateurs au sein d'un même réseau local (LAN).</li>
                                              <li>• <strong>Le Routeur :</strong> Matériel d'interconnexion qui permet de diriger les paquets de données d'un réseau à un autre.</li>
                                              <li>• <strong>Le Modem :</strong> Traduit le signal de votre fournisseur pour accéder à l'Internet mondial.</li>
                                            </ul>
                                          </div>

                                          <div className="space-y-2">
                                            <span className="font-bold text-slate-900 block">B. Qu'est-ce qu'Internet ?</span>
                                            <p>
                                              Internet est le "réseau des réseaux". C'est un ensemble mondial de réseaux informatiques connectés qui communiquent en utilisant un protocole commun (TCP/IP). Il permet d'accéder au web, d'échanger des e-mails, etc.
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Error page */}
                                {browserCurrentPage === "error" && (
                                  <div className="text-center py-12 max-w-sm mx-auto my-auto text-left">
                                    <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">Site inaccessible ou Erreur d'adresse</h3>
                                    <p className="text-xs text-slate-500">
                                      L'adresse '{browserUrl}' n'a pas pu être résolue sur le réseau local virtuel. Veuillez essayer de visiter 'goocongo.cd' ou de faire une recherche.
                                    </p>
                                  </div>
                                )}

                              </div>
                            </div>
                          )}

                          {/* 4. EMAIL MESSAGING CLIENT */}
                          {appKey === "email" && (
                            <div className="h-full flex flex-col md:flex-row gap-4">
                              
                              {/* Email Sidebar */}
                              <div className="w-full md:w-48 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 shrink-0 space-y-2">
                                <button 
                                  onClick={() => {
                                    setEmailSent(false);
                                    setEmailTo("");
                                    setEmailSubject("");
                                    setEmailBody("");
                                    setAttachedFile(null);
                                  }}
                                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-center shadow cursor-pointer"
                                >
                                  Nouveau message
                                </button>
                                
                                <div className="space-y-1 pt-2">
                                  <div className="flex items-center justify-between p-1 bg-slate-800/80 rounded text-white font-semibold">
                                    <span>Boîte de réception</span>
                                    <span className="px-1.5 py-0.5 bg-indigo-500 text-white rounded text-[9px] font-mono">1</span>
                                  </div>
                                  <div className="p-1 hover:text-slate-200 cursor-pointer">Messages envoyés</div>
                                  <div className="p-1 hover:text-slate-200 cursor-pointer">Brouillons</div>
                                  <div className="p-1 hover:text-slate-200 cursor-pointer">Spam</div>
                                </div>
                              </div>

                              {/* Composer / Inbox Details */}
                              <div className="flex-grow bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                                {emailSent ? (
                                  <div className="my-auto text-center py-12">
                                    <Check className="w-12 h-12 text-emerald-500 mx-auto mb-3 animate-bounce" />
                                    <h3 className="text-base font-bold text-white mb-1">E-mail Envoyé avec succès !</h3>
                                    <p className="text-xs text-slate-500">
                                      Le courrier électronique a été déposé dans la boîte d'envoi du serveur 'ecolecongo.cd'.
                                    </p>
                                  </div>
                                ) : (
                                  <div className="space-y-3.5">
                                    <div className="text-xs font-bold text-slate-400 border-b border-slate-800 pb-2 flex items-center justify-between">
                                      <span>Nouveau message électronique</span>
                                      <span className="text-[10px] text-indigo-400 font-mono">Webmail Client v1.2</span>
                                    </div>

                                    {/* Form fields */}
                                    <div className="space-y-2 text-xs">
                                      <div className="flex items-center gap-2">
                                        <span className="text-slate-400 font-semibold w-12 shrink-0 text-right">À :</span>
                                        <input 
                                          type="text" 
                                          value={emailTo}
                                          onChange={e => setEmailTo(e.target.value)}
                                          placeholder="jerepoba9@gamil.com"
                                          className="flex-grow bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 focus:outline-none"
                                        />
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <span className="text-slate-400 font-semibold w-12 shrink-0 text-right">Objet :</span>
                                        <input 
                                          type="text" 
                                          value={emailSubject}
                                          onChange={e => setEmailSubject(e.target.value)}
                                          placeholder="Ex: Devoir de MTIC 1.9"
                                          className="flex-grow bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 focus:outline-none"
                                        />
                                      </div>

                                      {/* Attached File display */}
                                      {attachedFile && (
                                        <div className="flex items-center justify-between p-2 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-xs">
                                          <div className="flex items-center gap-2 text-indigo-300">
                                            <Paperclip className="w-3.5 h-3.5" />
                                            <span className="font-semibold">{attachedFile.name}{attachedFile.extension}</span>
                                            <span className="text-[10px] text-slate-400">({attachedFile.size} Mo)</span>
                                          </div>
                                          <button 
                                            onClick={() => setAttachedFile(null)} 
                                            className="text-rose-400 font-bold hover:text-rose-300 cursor-pointer"
                                          >
                                            Retirer
                                          </button>
                                        </div>
                                      )}

                                      {/* Attachment Selector modal if open */}
                                      {showAttachmentSelector && (
                                        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 animate-fadeIn">
                                          <div className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider flex justify-between items-center">
                                            <span>Parcourir le Disque C:</span>
                                            <span className="text-indigo-400 font-sans normal-case">Sélectionnez un fichier à joindre</span>
                                          </div>
                                          
                                          <div className="grid sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                                            {/* System default PDF file */}
                                            <button 
                                              onClick={() => {
                                                setAttachedFile({ name: "exercices_reseau", extension: ".pdf", size: 12 });
                                                setShowAttachmentSelector(false);
                                              }}
                                              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500 hover:bg-slate-900/80 text-left cursor-pointer flex items-center gap-2.5 transition-all"
                                            >
                                              <div className="w-8 h-8 rounded bg-red-500/10 text-red-400 flex items-center justify-center shrink-0">
                                                <FileText className="w-4 h-4" />
                                              </div>
                                              <div className="min-w-0">
                                                <span className="text-slate-200 font-medium block truncate text-[11px]">exercices_reseau.pdf</span>
                                                <span className="text-[9px] text-slate-500 font-mono">12 Mo • Document PDF</span>
                                              </div>
                                            </button>

                                            {/* Dynamic documents files from virtual file system */}
                                            {(() => {
                                              const docsFiles = fileSystem.subfolders["Documents"]?.files || [];
                                              const rootFiles = fileSystem.files || [];
                                              const allVfsFiles = [
                                                ...rootFiles.map(f => ({ ...f, path: "C:/" })),
                                                ...docsFiles.map(f => ({ ...f, path: "Documents" }))
                                              ];

                                              return allVfsFiles.map((f, i) => (
                                                <button
                                                  key={i}
                                                  onClick={() => {
                                                    setAttachedFile({ name: f.name, extension: f.extension, size: f.size || 1 });
                                                    setShowAttachmentSelector(false);
                                                  }}
                                                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500 hover:bg-slate-900/80 text-left cursor-pointer flex items-center gap-2.5 transition-all"
                                                >
                                                  <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${
                                                    f.extension === ".docx" 
                                                      ? "bg-blue-500/10 text-blue-400" 
                                                      : f.extension === ".zip" 
                                                        ? "bg-yellow-500/10 text-yellow-400"
                                                        : "bg-slate-500/10 text-slate-400"
                                                  }`}>
                                                    <FileText className="w-4 h-4" />
                                                  </div>
                                                  <div className="min-w-0">
                                                    <span className="text-slate-200 font-medium block truncate text-[11px]">{f.name}{f.extension}</span>
                                                    <span className="text-[9px] text-slate-500 font-mono">{f.size || 1} Mo • Dossier {f.path}</span>
                                                  </div>
                                                </button>
                                              ));
                                            })()}
                                          </div>
                                        </div>
                                      )}

                                      {/* Body */}
                                      <textarea 
                                        value={emailBody}
                                        onChange={e => setEmailBody(e.target.value)}
                                        placeholder="Écrivez le corps de votre message e-mail..."
                                        rows={6}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-300 focus:outline-none focus:border-indigo-500 resize-none font-sans"
                                      />
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <button 
                                        onClick={() => setShowAttachmentSelector(!showAttachmentSelector)}
                                        className="py-1.5 px-3.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                                      >
                                        <Paperclip className="w-4 h-4 text-slate-400" />
                                        📎 Joindre un fichier
                                      </button>

                                      <button 
                                        onClick={() => setEmailSent(true)}
                                        className="py-1.5 px-5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer"
                                      >
                                        <Send className="w-4 h-4" /> Envoyer l'E-mail
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>

                            </div>
                          )}

                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

              </div>

              {/* WINDOWS OS BOTTOM TASKBAR */}
              <footer className="bg-slate-900 border-t border-slate-800 h-14 shrink-0 flex items-center justify-between px-6 z-30 select-none">
                {/* Start Button */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setStartMenuOpen(!startMenuOpen)}
                    className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white transition-all shadow shadow-indigo-600/30 border border-indigo-500/20"
                    title="Menu Démarrer"
                  >
                    <Monitor className="w-5 h-5" />
                  </button>

                  {/* Active running tasks labels in taskbar */}
                  <div className="flex gap-2">
                    {["explorer", "word", "browser", "email"].map(appKey => {
                      const isOpen = openWindows[appKey];
                      const isMinimized = minimizedWindows[appKey];
                      const isFocused = activeWindow === appKey && !isMinimized && isOpen;

                      return (
                        <button
                          key={appKey}
                          onClick={() => handleTaskbarClick(appKey)}
                          className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                            isFocused 
                              ? "bg-indigo-500/20 border-indigo-500 text-indigo-300 font-extrabold shadow-sm shadow-indigo-500/20" 
                              : isOpen
                                ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-755"
                                : "bg-slate-950/40 border-slate-900 text-slate-600 hover:border-slate-800 hover:text-slate-400"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isFocused ? 'bg-indigo-400 animate-pulse' : isOpen ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                          {appKey === "explorer" && "Dossiers"}
                          {appKey === "word" && "Word"}
                          {appKey === "browser" && "Internet"}
                          {appKey === "email" && "E-mail"}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Clock / Notifications Tray */}
                <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                  <div className="text-right select-none leading-tight">
                    <span className="block font-bold text-slate-200">
                      {currentDateTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-[9px] block text-slate-500 uppercase mt-0.5">
                      {currentDateTime.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
              </footer>

              {/* START MENU WINDOW */}
              <AnimatePresence>
                {startMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    className="absolute bottom-16 left-6 w-80 bg-slate-900 border border-slate-700/80 rounded-2xl p-4 shadow-2xl z-40 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="text-[10px] uppercase font-bold text-slate-500 font-mono">Démarrer Windows 11</div>
                      
                      {/* Apps shortcut list */}
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => {
                            openApp("explorer");
                            setStartMenuOpen(false);
                          }}
                          className="p-2 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-600 flex items-center gap-2.5 text-left text-xs font-medium text-slate-300"
                        >
                          <Folder className="w-5 h-5 text-yellow-400" />
                          <span>Dossiers</span>
                        </button>

                        <button 
                          onClick={() => {
                            openApp("word");
                            setStartMenuOpen(false);
                          }}
                          className="p-2 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-600 flex items-center gap-2.5 text-left text-xs font-medium text-slate-300"
                        >
                          <FileText className="w-5 h-5 text-blue-500" />
                          <span>MS Word</span>
                        </button>

                        <button 
                          onClick={() => {
                            openApp("browser");
                            setStartMenuOpen(false);
                          }}
                          className="p-2 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-600 flex items-center gap-2.5 text-left text-xs font-medium text-slate-300"
                        >
                          <Globe className="w-5 h-5 text-teal-400" />
                          <span>Internet</span>
                        </button>

                        <button 
                          onClick={() => {
                            openApp("email");
                            setStartMenuOpen(false);
                          }}
                          className="p-2 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-600 flex items-center gap-2.5 text-left text-xs font-medium text-slate-300"
                        >
                          <Mail className="w-5 h-5 text-indigo-400" />
                          <span>E-mail</span>
                        </button>
                      </div>
                    </div>

                    {/* Shut down row */}
                    <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="font-semibold text-slate-300">Élève_7ème</span>
                      </div>
                      
                      <button 
                        onClick={() => {
                          setPowerOn(false);
                          setStartMenuOpen(false);
                        }}
                        className="py-1 px-3 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px]"
                      >
                        Arrêter le PC
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

        </div>

        {/* SUCCESS ACCOMPLISHMENT SCREEN */}
        <AnimatePresence>
          {successTriggered && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/95 backdrop-blur z-50 flex items-center justify-center p-6"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md text-center space-y-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mx-auto flex items-center justify-center text-emerald-400">
                  <Award className="w-9 h-9" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">Exercice Réussi avec Succès !</h3>
                  <p className="text-xs text-slate-400 mt-2">Félicitations, tu as validé toutes les consignes demandées pour cet exercice.</p>
                </div>

                <div className="py-3 px-6 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-left">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Récompense de compétence</span>
                    <span className="text-xs font-bold text-white">Points d'Expérience Académique</span>
                  </div>
                  <div className="text-lg font-mono font-extrabold text-emerald-400">
                    + {xpPoints} XP
                  </div>
                </div>

                <button 
                  onClick={onClose}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-95 text-white font-bold text-xs"
                >
                  Fermer & Retourner au Cours
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
