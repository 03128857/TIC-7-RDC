/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  GraduationCap, BookOpen, Award, BarChart2, MessageSquare, Calendar, 
  Users, Key, Shield, Sun, Moon, Search, Sparkles, Star, Play, FileDown, 
  CheckCircle, HelpCircle, Trophy, Flame, ChevronRight, User, Settings,
  LogOut, Send, Paperclip, Clock, Lock, ShieldCheck, Mail, ArrowLeft, Monitor,
  Camera, Upload, Edit3, Check, X, Bell, Layers, Heart, AlertCircle, Trash2, Plus, Edit, Activity, RefreshCw, Share2, Menu
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, UserRole, Lesson, Certificate, Notification, Message, CalendarEvent, HistoricalActivity, Badge, TeacherPublication, LessonReaction, StudentConcern, Homework, HomeworkSubmission } from "../types";
import { lessonsData, badgesList } from "../data/lessons";
import SimulatedDesktop from "./SimulatedDesktop";

interface LearningPortalProps {
  onBackToMain: () => void;
  darkMode?: boolean;
  setDarkMode?: (dark: boolean) => void;
}

export default function LearningPortal({ onBackToMain, darkMode: propDarkMode, setDarkMode: propSetDarkMode }: LearningPortalProps) {
  // Theme State
  const [localDarkMode, setLocalDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("edu_theme");
    return saved ? saved === "dark" : true;
  });

  const darkMode = propDarkMode !== undefined ? propDarkMode : localDarkMode;
  const setDarkMode = propSetDarkMode !== undefined ? propSetDarkMode : setLocalDarkMode;

  useEffect(() => {
    localStorage.setItem("edu_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Current Logged In Profile
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("edu_profile_7eme");
    if (saved) return JSON.parse(saved);
    return {
      id: "std_jean_mubala",
      name: "Jean Mubala",
      email: "jean.mubala@ecolecongo.cd",
      role: "student",
      emailConfirmed: true,
      streak: 5,
      xpPoints: 120,
      level: 2,
      badges: ["badge_welcome"],
      completedLessons: ["mtic_1_1"],
      completedQuizzes: { "mtic_1_1": 80 },
      completedExercises: { "mtic_1_1": ["desktop"] },
      favoriteLessons: [],
      createdAt: new Date().toISOString()
    };
  });

  useEffect(() => {
    localStorage.setItem("edu_profile_7eme", JSON.stringify(profile));
  }, [profile]);

  // Sidebar navigation active state
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [adminActiveSubTab, setAdminActiveSubTab] = useState<"users" | "activities" | "settings">("users");
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [adminSuccessMsg, setAdminSuccessMsg] = useState<string | null>(null);
  const [adminSearchQuery, setAdminSearchQuery] = useState<string>("");

  // Lessons Search / Filtering
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  // Selected Lesson Detail view
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [lessonActiveTab, setLessonActiveTab] = useState<"cours" | "videos" | "quiz" | "ressources">("cours");
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  useEffect(() => {
    setPlayingVideoId(null);
  }, [selectedLesson, lessonActiveTab]);

  // Quiz State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizStarted, setQuizStarted] = useState<boolean>(false);

  // Simulated Desktop Active state (Laboratory running)
  const [activeLabExercise, setActiveLabExercise] = useState<{
    id: string;
    instructions: string[];
    validationRule: string;
  } | null>(null);

  // Virtual Pedagogical Tutor state (Chat)
  const [tutorMessages, setTutorMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([
    { sender: "ai", text: "Bonjour Jean ! Je suis ton assistant virtuel EduCompagnon. Je suis là pour t'expliquer tes leçons de MTIC ou t'accompagner dans tes exercices sans te donner directement la solution. Que souhaites-tu réviser aujourd'hui ?" }
  ]);
  const [userChatInput, setUserChatInput] = useState<string>("");
  const [tutorLoading, setTutorLoading] = useState<boolean>(false);

  // Credentials Modals for switching roles
  const [authModal, setAuthModal] = useState<"teacher" | "admin" | null>(null);
  const [authCode, setAuthCode] = useState<string>("");
  const [authPassword, setAuthPassword] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);

  // Profile edit modal states
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [profileNameInput, setProfileNameInput] = useState<string>(profile.name);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(profile.avatarUrl || "");
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);

  // Teacher Space key & active key configuration
  const [teacherSpaceInput, setTeacherSpaceInput] = useState<string>("");
  const [teacherAccessKey, setTeacherAccessKey] = useState<string>(() => {
    return localStorage.getItem("edu_teacher_access_key") || "PROF-7EME-2026";
  });

  // Teacher Workspace states in student space
  const [workspaceSubTab, setWorkspaceSubTab] = useState<"publications_lessons" | "tasks">("publications_lessons");
  const [tempTeacherCodeInput, setTempTeacherCodeInput] = useState("");
  const [selectedTeacherLesson, setSelectedTeacherLesson] = useState<Lesson | null>(null);
  const [selectedTeacherPub, setSelectedTeacherPub] = useState<TeacherPublication | null>(null);
  const [studentSelfGradingLoading, setStudentSelfGradingLoading] = useState<{ [subId: string]: boolean }>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const [teacherConnectedSpace, setTeacherConnectedSpace] = useState<string | null>(() => {
    const savedKey = localStorage.getItem("edu_teacher_access_key") || "PROF-7EME-2026";
    return profile.teacherCode === savedKey ? "Classe de 7ème A - Prof. Mubenga" : null;
  });

  useEffect(() => {
    localStorage.setItem("edu_teacher_access_key", teacherAccessKey);
  }, [teacherAccessKey]);

  // Hook to disconnect student dynamically if the teacher regenerates/modifies the class access key
  useEffect(() => {
    if (profile.role === "student" && profile.teacherCode && profile.teacherCode !== teacherAccessKey) {
      setProfile(prev => ({ ...prev, teacherCode: undefined }));
      setTeacherConnectedSpace(null);
      alert("Votre enseignant a modifié la clé de la classe virtuelle. Votre accès a expiré. Veuillez obtenir la nouvelle clé pour vous reconnecter.");
      setNotifications(prev => [
        {
          id: "notif_key_revoked_" + Math.random().toString(),
          title: "🔑 Clé de classe révoquée",
          content: "L'enseignant a généré une nouvelle clé d'accès. Vous devez vous reconnecter avec la nouvelle clé.",
          type: "system",
          date: new Date().toISOString().split('T')[0],
          read: false
        },
        ...prev
      ]);
    }
  }, [teacherAccessKey, profile.role, profile.teacherCode]);

  // Hook to automatically direct the active tab depending on the profile's role to prevent view leakages
  useEffect(() => {
    if (profile.role === "student") {
      if (!["dashboard", "lessons", "tutor", "leaderboard", "messaging", "calendar", "notifications", "teacher_workspace"].includes(activeTab)) {
        setActiveTab("dashboard");
      }
    } else if (profile.role === "teacher") {
      if (!["teacher_dashboard", "teacher_lessons", "teacher_ai_tutor", "teacher_leaderboard", "teacher_calendar", "teacher_messaging", "teacher_online_students", "teacher_grades", "teacher_key"].includes(activeTab)) {
        setActiveTab("teacher_dashboard");
      }
    } else if (profile.role === "admin") {
      if (activeTab !== "admin_dashboard") {
        setActiveTab("admin_dashboard");
      }
    }
  }, [profile.role, activeTab]);

  const regenerateTeacherKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let newKey = "PROF-";
    for (let i = 0; i < 8; i++) {
      newKey += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const oldKey = teacherAccessKey;
    setTeacherAccessKey(newKey);
    
    // Disconnect students in mockUsers who have the old key
    setMockUsers(prev => prev.map(u => {
      if (u.role === "student" && u.teacherCode === oldKey) {
        return { ...u, teacherCode: undefined };
      }
      return u;
    }));

    // If currently logged-in student uses this key, disconnect them
    if (profile.role === "student" && profile.teacherCode === oldKey) {
      setProfile(prev => ({ ...prev, teacherCode: undefined }));
      setTeacherConnectedSpace(null);
    }
    
    alert(`Nouvelle clé de classe générée avec succès : ${newKey}\nTous les élèves connectés avec l'ancienne clé (${oldKey}) ont été déconnectés.`);
  };

  // Global platform notifications (persisted)
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem("edu_notifications");
    if (saved) return JSON.parse(saved);
    return [
      { id: "n1", title: "Bienvenue sur TIC 7 RDC", content: "Félicitations pour votre inscription au portail informatique de la 7ème année.", type: "system", date: "2026-06-25", read: false },
      { id: "n2", title: "Nouveau Badge Débloqué !", content: "Vous avez débloqué le badge de bienvenue pour votre première connexion.", type: "badge", date: "2026-06-25", read: true }
    ];
  });

  useEffect(() => {
    localStorage.setItem("edu_notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Teacher Publications (persisted)
  const [teacherPublications, setTeacherPublications] = useState<TeacherPublication[]>(() => {
    const saved = localStorage.getItem("edu_teacher_publications");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "pub_1",
        teacherCode: "PROF-7EME-2026",
        teacherName: "Professeur Mubenga",
        title: "Introduction aux Périphériques d'Entrée",
        content: "Chers élèves, j'ai publié un nouveau document d'accompagnement pour la leçon MTIC 1.3 sur les périphériques de base (clavier, souris). Veuillez le lire attentivement.",
        category: "Cours",
        date: "2026-06-28"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("edu_teacher_publications", JSON.stringify(teacherPublications));
  }, [teacherPublications]);

  const [pubTitle, setPubTitle] = useState<string>("");
  const [pubContent, setPubContent] = useState<string>("");
  const [pubCategory, setPubCategory] = useState<"Cours" | "TP" | "Annonce">("Cours");

  // --- NEW STATES FOR UPGRADES ---

  // 1. Reactions
  const [lessonReactions, setLessonReactions] = useState<LessonReaction[]>(() => {
    const saved = localStorage.getItem("edu_lesson_reactions");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "react_1",
        pubId: "pub_1",
        pubTitle: "Introduction aux Périphériques d'Entrée",
        studentId: "std_jean_mubala",
        studentName: "Jean Mubala",
        type: "like",
        date: "2026-06-29"
      },
      {
        id: "react_2",
        pubId: "pub_1",
        pubTitle: "Introduction aux Périphériques d'Entrée",
        studentId: "std_aime_tshilombo",
        studentName: "Aimé Tshilombo",
        type: "not_understood",
        date: "2026-06-30"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("edu_lesson_reactions", JSON.stringify(lessonReactions));
  }, [lessonReactions]);

  // 2. Student Concerns / Préoccupations
  const [studentConcerns, setStudentConcerns] = useState<StudentConcern[]>(() => {
    const saved = localStorage.getItem("edu_student_concerns");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "concern_1",
        studentId: "std_jean_mubala",
        studentName: "Jean Mubala",
        teacherCode: "PROF-7EME-2026",
        teacherName: "Professeur Mubenga",
        title: "Difficulté sur le clavier AZERTY",
        content: "Monsieur, je n'arrive pas à faire la lettre 'M' ou les caractères spéciaux comme '@' sur mon clavier d'ordinateur simulé. Pouvez-vous m'aider ?",
        status: "pending",
        date: "2026-06-30"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("edu_student_concerns", JSON.stringify(studentConcerns));
  }, [studentConcerns]);

  // 3. Homeworks / TP / Exercices
  const [homeworkList, setHomeworkList] = useState<Homework[]>(() => {
    const saved = localStorage.getItem("edu_homework_list");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "hw_1",
        teacherCode: "PROF-7EME-2026",
        teacherName: "Professeur Mubenga",
        title: "Exercice d'Identification de Matériel",
        category: "Exercice",
        description: "Distinguer le matériel (hardware) et le logiciel (software) vus en classe.",
        question: "Donnez deux exemples de périphériques d'entrée, deux exemples de périphériques de sortie, et définissez brièvement le terme 'Système d'Exploitation'.",
        corregiType: "Périphériques d'entrée : Clavier, Souris, Scanner. Sortie : Écran, Imprimante, Haut-parleurs. Système d'exploitation : logiciel principal qui gère l'ordinateur (ex: Windows, Linux).",
        points: 20,
        dateLimit: "2026-07-05",
        date: "2026-06-29"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("edu_homework_list", JSON.stringify(homeworkList));
  }, [homeworkList]);

  // 4. Homework Submissions / Soumissions
  const [homeworkSubmissions, setHomeworkSubmissions] = useState<HomeworkSubmission[]>(() => {
    const saved = localStorage.getItem("edu_homework_submissions");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "sub_1",
        homeworkId: "hw_1",
        homeworkTitle: "Exercice d'Identification de Matériel",
        homeworkCategory: "Exercice",
        studentId: "std_jean_mubala",
        studentName: "Jean Mubala",
        studentAnswer: "Entrée: Clavier et Souris. Sortie: Écran et Imprimante. Un système d'exploitation est le logiciel principal qui fait fonctionner la machine comme Windows.",
        teacherCode: "PROF-7EME-2026",
        status: "submitted",
        date: "2026-06-30"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("edu_homework_submissions", JSON.stringify(homeworkSubmissions));
  }, [homeworkSubmissions]);

  // Form input states for new features
  const [homeworkAnswers, setHomeworkAnswers] = useState<{[hwId: string]: string}>({});
  const [concernTitle, setConcernTitle] = useState<string>("");
  const [concernContent, setConcernContent] = useState<string>("");

  // Teacher Homework Creation Form States
  const [hwTitle, setHwTitle] = useState<string>("");
  const [hwCategory, setHwCategory] = useState<"Devoir" | "TP" | "Exercice">("Devoir");
  const [hwDescription, setHwDescription] = useState<string>("");
  const [hwQuestion, setHwQuestion] = useState<string>("");
  const [hwCorregi, setHwCorregi] = useState<string>("");
  const [hwPoints, setHwPoints] = useState<number>(20);
  const [hwLimit, setHwLimit] = useState<string>("2026-07-10");

  // Teacher Correction / Grading States
  const [gradingSubId, setGradingSubId] = useState<string | null>(null);
  const [gradingScore, setGradingScore] = useState<string>("");
  const [gradingComment, setGradingComment] = useState<string>("");
  const [gradingLoading, setGradingLoading] = useState<boolean>(false);

  // Teacher Concerns Reply States
  const [replyingConcernId, setReplyingConcernId] = useState<string | null>(null);
  const [concernResponseText, setConcernResponseText] = useState<string>("");

  // Sync publications from teachers connected AT LEAST ONCE to student notifications
  useEffect(() => {
    const once = profile.connectedOnceTeachers || [];
    if (profile.role === "student" && once.length > 0) {
      setNotifications(prev => {
        let updated = [...prev];
        let changed = false;
        
        teacherPublications.forEach(pub => {
          if (once.includes(pub.teacherCode)) {
            const exists = updated.some(n => n.id === `notif_pub_${pub.id}`);
            if (!exists) {
              updated = [
                {
                  id: `notif_pub_${pub.id}`,
                  title: `📢 ${pub.teacherName} (${pub.category})`,
                  content: `${pub.title}: ${pub.content}`,
                  type: "new_lesson",
                  date: pub.date,
                  read: false
                },
                ...updated
              ];
              changed = true;
            }
          }
        });
        
        return changed ? updated : prev;
      });
    }
  }, [profile.connectedOnceTeachers, profile.role, teacherPublications]);

  // Messages Thread state
  const [messagerieMessages, setMessagerieMessages] = useState<Message[]>([]);
  const [msgInput, setMsgInput] = useState<string>("");

  // Global Mock Users list for Admin view, loaded dynamically from actual registered users
  const [mockUsers, setMockUsers] = useState<UserProfile[]>(() => {
    const registered = localStorage.getItem("edu_registered_users");
    const users: UserProfile[] = registered ? JSON.parse(registered) : [];
    
    const deletedStr = localStorage.getItem("edu_deleted_users");
    const deletedIds: string[] = deletedStr ? JSON.parse(deletedStr) : [];
    
    // Always preserve standard default profiles and active user profile
    const list = [...users];
    const defaultAccounts = [
      { id: "std_jean_mubala", name: "Jean Mubala", email: "jean.mubala@ecolecongo.cd", role: "student" as UserRole, emailConfirmed: true, streak: 5, xpPoints: 320, level: 3, badges: ["badge_welcome"], completedLessons: ["mtic_1_1", "mtic_1_2"], completedQuizzes: { "mtic_1_1": 80, "mtic_1_2": 90 }, completedExercises: { "mtic_1_1": ["desktop"] }, favoriteLessons: [], teacherCode: "PROF-7EME-2026", createdAt: "2026-06-25" },
      { id: "teacher_prof_mubenga", name: "Professeur Mubenga", email: "prof.mubenga@ecolecongo.cd", role: "teacher" as UserRole, emailConfirmed: true, streak: 14, xpPoints: 450, level: 5, badges: [], completedLessons: [], completedQuizzes: {}, completedExercises: {}, favoriteLessons: [], createdAt: "2026-06-01" },
      { id: "admin_super", name: "Super Administrateur", email: "pobajeremie93@gmail.com", role: "admin" as UserRole, emailConfirmed: true, streak: 20, xpPoints: 800, level: 10, badges: [], completedLessons: [], completedQuizzes: {}, completedExercises: {}, favoriteLessons: [], createdAt: "2026-06-01" }
    ];

    defaultAccounts.forEach(acc => {
      if (!deletedIds.includes(acc.id) && !list.some(u => u.email.toLowerCase() === acc.email.toLowerCase())) {
        list.push(acc);
      }
    });

    if (profile && !list.some(u => u.email.toLowerCase() === profile.email.toLowerCase())) {
      list.push(profile);
    }
    
    // Filter out permanently deleted users
    return list.filter(u => !deletedIds.includes(u.id));
  });

  const handleBanUser = (user: UserProfile) => {
    if (user.email.toLowerCase() === profile.email.toLowerCase() || user.id === "admin_super") {
      return; // Can't ban ourselves
    }
    const updated = mockUsers.map(u => {
      if (u.id === user.id) {
        return { ...u, isBanned: !u.isBanned };
      }
      return u;
    });
    setMockUsers(updated);
    localStorage.setItem("edu_registered_users", JSON.stringify(updated));
  };

  const handleDeleteUser = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (!user || user.email.toLowerCase() === profile.email.toLowerCase() || userId === "admin_super") {
      return; // Can't delete ourselves
    }

    // Save to deleted list
    const deletedStr = localStorage.getItem("edu_deleted_users");
    const deletedIds: string[] = deletedStr ? JSON.parse(deletedStr) : [];
    if (!deletedIds.includes(userId)) {
      deletedIds.push(userId);
      localStorage.setItem("edu_deleted_users", JSON.stringify(deletedIds));
    }

    const updated = mockUsers.filter(u => u.id !== userId);
    setMockUsers(updated);
    localStorage.setItem("edu_registered_users", JSON.stringify(updated));
  };

  // Structured tracking for online and historical student connection sessions
  interface ConnectionSession {
    id: string;
    studentId: string;
    studentName: string;
    date: string;       // e.g. "2026-07-01"
    hour: string;       // e.g. "08:14:22"
    year: string;       // e.g. "2026"
    status: "online" | "offline";
  }

  const [connectionSessions, setConnectionSessions] = useState<ConnectionSession[]>(() => {
    // Generate actual connection sessions dynamically based on existing students list
    return mockUsers
      .filter(u => u.role === "student")
      .map((u, i) => ({
        id: `s_${u.id}_${i}`,
        studentId: u.id,
        studentName: u.name,
        date: new Date().toISOString().split('T')[0],
        hour: new Date().toLocaleTimeString(),
        year: "2026",
        status: u.id === profile.id ? ("online" as const) : ("offline" as const)
      }));
  });

  // Teacher custom lessons, TPs, homeworks, and exercises (which they can add, modify, and delete)
  const [customLessons, setCustomLessons] = useState<Lesson[]>(() => {
    const saved = localStorage.getItem("edu_custom_lessons");
    if (saved) return JSON.parse(saved);
    return [];
  });

  useEffect(() => {
    localStorage.setItem("edu_custom_lessons", JSON.stringify(customLessons));
  }, [customLessons]);

  // Form states for creating custom lesson
  const [clTitle, setClTitle] = useState("");
  const [clCategory, setClCategory] = useState("Concepts de Base");
  const [clObjectives, setClObjectives] = useState("");
  const [clContent, setClContent] = useState("");
  const [clSummary, setClSummary] = useState("");
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);

  // States for Teacher AI assistant correction answer keys input
  const [homeworkAnswerKeys, setHomeworkAnswerKeys] = useState<{ [hwId: string]: string }>({
    "hw_1": "Périphériques d'entrée : Clavier, Souris, Scanner. Sortie : Écran, Imprimante, Haut-parleurs. Système d'exploitation : logiciel principal qui gère l'ordinateur (ex: Windows, Linux)."
  });

  // AI draft evaluations presented to the teacher in a nice visual preview table
  interface AIDraftCorrection {
    id: string; // submissionId
    studentId: string;
    studentName: string;
    homeworkId: string;
    homeworkTitle: string;
    homeworkCategory: "Devoir" | "TP" | "Exercice";
    studentAnswer: string;
    correctAnswerKey: string;
    suggestedGrade: number;
    suggestedComment: string;
    maxPoints: number;
  }

  const [aiDraftCorrections, setAiDraftCorrections] = useState<AIDraftCorrection[]>([]);

  // Validated results stored in Côtes des élèves (Student Grades)
  interface ValidatedGrade {
    id: string; // submissionId or unique grade ID
    studentId: string;
    studentName: string;
    homeworkId: string;
    homeworkTitle: string;
    homeworkCategory: "Devoir" | "TP" | "Exercice";
    grade: number;
    maxPoints: number;
    comment: string;
    sentStatus: "pending" | "sent";
    sentAt?: string;
    submissionId?: string;
    published?: boolean;
  }

  const [examTitle, setExamTitle] = useState("");
  const [examDate, setExamDate] = useState("");
  const [examDesc, setExamDesc] = useState("");
  const [examType, setExamType] = useState<"Examen" | "Devoir" | "TP">("Examen");

  const [validatedGrades, setValidatedGrades] = useState<ValidatedGrade[]>([]);

  // Calendar events
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: "e1", title: "Examen de mi-parcours (MTIC)", date: "2026-07-05", type: "exam", description: "Couvre les leçons MTIC 1.1 à 1.5 sur les périphériques et Windows." },
    { id: "e2", title: "TP d'initiation Word", date: "2026-07-12", type: "evaluation", description: "Saisie et mise en page d'un rapport scolaire." }
  ]);
  const calendarEvents = events;
  const setCalendarEvents = setEvents;

  // Smart Search logic
  const filteredLessons = lessonsData.filter(l => {
    const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          l.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.contentSections.some(s => s.body.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || l.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Real-time Search Match calculations for the global search dropdown
  const trimmedSearch = searchQuery.trim().toLowerCase();
  const matchedLessons = trimmedSearch 
    ? lessonsData.filter(l => 
        l.title.toLowerCase().includes(trimmedSearch) || 
        l.category.toLowerCase().includes(trimmedSearch) ||
        l.contentSections.some(s => s.body.toLowerCase().includes(trimmedSearch))
      ).slice(0, 5)
    : [];

  const matchedVideos = trimmedSearch
    ? lessonsData.flatMap(l => 
        (l.videos || []).map(v => ({ ...v, lesson: l }))
      ).filter(v => v.title.toLowerCase().includes(trimmedSearch)).slice(0, 5)
    : [];

  const matchedQuizzes = trimmedSearch
    ? lessonsData.filter(l => l.quiz && l.title.toLowerCase().includes(trimmedSearch)).slice(0, 5)
    : [];

  // Filter notifications to only show student-specific or general system-wide notifications
  const filteredNotifications = notifications.filter(notif => !notif.studentId || notif.studentId === profile.id);

  const categories = ["All", "Concepts de Base", "Périphériques", "Windows", "Fichiers et Dossiers", "Internet", "Messagerie", "Traitement de Texte"];

  // Toggle Favorite Lesson
  const handleToggleFavorite = (lessonId: string) => {
    setProfile(prev => {
      const favs = [...prev.favoriteLessons];
      const index = favs.indexOf(lessonId);
      if (index === -1) {
        favs.push(lessonId);
      } else {
        favs.splice(index, 1);
      }
      return { ...prev, favoriteLessons: favs };
    });
  };

  const openProfileModal = () => {
    setProfileNameInput(profile.name);
    setSelectedAvatar(profile.avatarUrl || "");
    setIsProfileModalOpen(true);
  };

  const handleSaveProfile = () => {
    if (!profileNameInput.trim()) return;
    setProfile(prev => ({
      ...prev,
      name: profileNameInput.trim(),
      avatarUrl: selectedAvatar || undefined
    }));
    setIsProfileModalOpen(false);
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      alert("L'image est trop lourde. Veuillez choisir une image de moins de 2 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setSelectedAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = () => {
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("L'image est trop lourde. Veuillez choisir une image de moins de 2 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setSelectedAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadResource = (lesson: Lesson, resource: any) => {
    const safeTitle = resource.title.replace(/[^a-zA-Z0-9]/g, "_");
    const isWord = resource.type === "word" || resource.type === "doc" || resource.type === "docx";
    const extension = isWord ? "doc" : "html";
    const filename = `${safeTitle}.${extension}`;

    const objectivesHTML = lesson.objectives
      .map(obj => `<li>${obj}</li>`)
      .join("");

    const sectionsHTML = lesson.contentSections
      .map(sec => {
        const bulletsHTML = sec.bullets
          ? `<ul>${sec.bullets.map(b => `<li>${b}</li>`).join("")}</ul>`
          : "";
        return `
          <div class="section" style="margin-bottom: 25px; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px;">
            <h3 style="color: #0f172a; font-size: 15px; margin-top: 15px; margin-bottom: 8px;">${sec.title}</h3>
            <p style="font-size: 13.5px; color: #334155; margin-bottom: 10px; line-height: 1.6;">${sec.body}</p>
            ${bulletsHTML ? `<ul style="font-size: 13px; color: #475569; padding-left: 20px; line-height: 1.6;">${bulletsHTML}</ul>` : ""}
          </div>
        `;
      })
      .join("");

    const summaryHTML = lesson.summary
      .map(sum => `<li style="margin-bottom: 8px; font-weight: 500;">${sum}</li>`)
      .join("");

    const quizHTML = lesson.quiz && lesson.quiz.questions
      ? lesson.quiz.questions
          .map((q, qidx) => {
            const optionsHTML = q.options
              .map((opt, oidx) => {
                const isCorrect = oidx === q.correctIndex;
                const checkmark = isCorrect ? "✅" : "⬜";
                const boldClass = isCorrect ? 'style="font-weight: bold; color: #059669;"' : '';
                return `<li style="margin-bottom: 6px; font-size: 13px; display: flex; align-items: center; gap: 8px;"><span style="font-size: 14px;">${checkmark}</span> <span ${boldClass}>${opt}</span></li>`;
              })
              .join("");
            return `
              <div class="question-block" style="background: #fafafa; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
                <p class="question-title" style="color: #0f172a; font-size: 14px; margin-top: 0; margin-bottom: 12px;"><strong>Question ${qidx + 1}: ${q.question}</strong></p>
                <ul style="list-style-type: none; padding-left: 0; margin: 0 0 12px 0;">
                  ${optionsHTML}
                </ul>
                <p class="explanation" style="font-size: 11.5px; color: #059669; background: #ecfdf5; padding: 8px 12px; border-radius: 6px; margin: 10px 0 0 0; font-style: italic;"><strong>Explication :</strong> ${q.explanation}</p>
              </div>
            `;
          })
          .join("")
      : "<p style='font-size: 13px; color: #64748b;'>Aucune auto-évaluation pour cette fiche.</p>";

    const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>${resource.title} - ${lesson.title}</title>
<style>
  body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    padding: 40px;
    color: #1e293b;
    background: #f8fafc;
    line-height: 1.6;
    margin: 0;
  }
  .sheet {
    max-width: 850px;
    margin: 0 auto;
    background: #ffffff;
    padding: 50px;
    border-radius: 24px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
  }
  .header {
    text-align: center;
    border-bottom: 4px double #1e3a8a;
    padding-bottom: 24px;
    margin-bottom: 35px;
  }
  .congo-seal {
    font-weight: 800;
    font-size: 16px;
    color: #0f172a;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .ministry {
    font-size: 12px;
    color: #475569;
    font-weight: 600;
    text-transform: uppercase;
    margin-top: 4px;
  }
  .syllabus-badge {
    display: inline-block;
    padding: 6px 14px;
    background: #e0f2fe;
    color: #0369a1;
    border-radius: 9999px;
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    margin-top: 15px;
    letter-spacing: 0.05em;
  }
  .sheet-title {
    text-align: center;
    color: #1e3a8a;
    font-size: 26px;
    font-weight: 950;
    margin: 30px 0 15px 0;
    text-transform: uppercase;
    letter-spacing: -0.01em;
  }
  .meta-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    background: #f1f5f9;
    padding: 15px 20px;
    border-radius: 12px;
    font-size: 12.5px;
    color: #334155;
    margin-bottom: 30px;
    border-left: 5px solid #3b82f6;
  }
  .meta-item strong {
    color: #0f172a;
  }
  h2 {
    color: #1e3a8a;
    font-size: 16px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 8px;
    margin-top: 35px;
    margin-bottom: 15px;
  }
  ul, ol {
    font-size: 13.5px;
    color: #475569;
    padding-left: 20px;
    margin-bottom: 15px;
  }
  li {
    margin-bottom: 8px;
  }
  .footer {
    text-align: center;
    margin-top: 60px;
    font-size: 11px;
    color: #94a3b8;
    border-top: 1px solid #e2e8f0;
    padding-top: 25px;
  }
  @media print {
    body {
      background: white;
      padding: 0;
    }
    .sheet {
      box-shadow: none;
      border: none;
      padding: 0;
    }
  }
</style>
</head>
<body>
  <div class="sheet">
    <div class="header">
      <div class="congo-seal">République Démocratique du Congo</div>
      <div class="ministry">Ministère de l'Enseignement Primaire, Secondaire et Technique (EPST)</div>
      <div class="ministry">Direction Nationale de l'Éducation Numérique • MTIC</div>
      <span class="syllabus-badge">Syllabus National de Réf. RDC</span>
    </div>

    <h1 class="sheet-title">${resource.title}</h1>
    
    <div class="meta-grid">
      <div class="meta-item"><strong>Matière :</strong> Technologies de l'Information (MTIC)</div>
      <div class="meta-item"><strong>Niveau d'Étude :</strong> 7ème Année de l'Éducation de Base</div>
      <div class="meta-item"><strong>Leçon Associée :</strong> ${lesson.title}</div>
      <div class="meta-item"><strong>Date d'Édition :</strong> ${new Date().toLocaleDateString('fr-FR')}</div>
    </div>

    <h2>I. Objectifs Pédagogiques</h2>
    <ul style="line-height: 1.6;">
      ${objectivesHTML}
    </ul>

    <h2>II. Résumé Détaillé du Cours</h2>
    ${sectionsHTML}

    <h2>III. Points Clés à Retenir</h2>
    <ul style="line-height: 1.6;">
      ${summaryHTML}
    </ul>

    <h2>IV. Devoir d'Évaluation &amp; Auto-Contrôle</h2>
    ${quizHTML}

    <div class="footer">
      <p style="margin-bottom: 4px;">Document généré de manière officielle par la Plateforme Nationale d'Apprentissage RDC.</p>
      <p style="margin-top: 0; font-weight: bold; color: #64748b;">Direction de la Pédagogie Numérique de l'EPST • Licence de Diffusion Scolaire</p>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: isWord ? "application/msword;charset=utf-8" : "text/html;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadCertificate = (cert: Certificate) => {
    const filename = `Brevet_${cert.studentName.replace(/[^a-zA-Z0-9]/g, "_")}.html`;
    
    const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Brevet d'Aptitude Numérique - ${cert.studentName}</title>
<style>
  body {
    font-family: 'Georgia', serif;
    padding: 40px;
    color: #1e1b4b;
    background: #f1f5f9;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
  }
  .certificate-border {
    border: 20px double #1e3a8a;
    padding: 50px;
    background: white;
    max-width: 800px;
    width: 100%;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    position: relative;
    box-sizing: border-box;
    border-radius: 4px;
  }
  .photo-frame {
    position: absolute;
    top: 40px;
    right: 40px;
    width: 90px;
    height: 115px;
    border: 2px dashed #cbd5e1;
    border-radius: 6px;
    background: #f8fafc;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .photo-frame img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .photo-frame span {
    font-size: 36px;
  }
  .seal-header {
    text-align: center;
    font-family: 'Segoe UI', sans-serif;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #475569;
    margin-bottom: 40px;
    line-height: 1.5;
  }
  .title {
    text-align: center;
    font-size: 34px;
    font-weight: 900;
    color: #1e3a8a;
    text-transform: uppercase;
    margin: 10px 0;
    letter-spacing: 0.02em;
  }
  .subtitle {
    text-align: center;
    font-family: 'Segoe UI', sans-serif;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #64748b;
    margin-bottom: 40px;
  }
  .certifies {
    text-align: center;
    font-style: italic;
    color: #475569;
    font-size: 16px;
    margin-bottom: 20px;
  }
  .student-name {
    text-align: center;
    font-size: 30px;
    font-weight: bold;
    color: #1e1b4b;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 10px;
    margin: 20px auto;
    max-width: 80%;
  }
  .reason {
    text-align: center;
    font-size: 14px;
    color: #334155;
    line-height: 1.8;
    margin-bottom: 50px;
  }
  .signatures-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    font-family: 'Segoe UI', sans-serif;
    font-size: 12px;
    color: #475569;
    margin-top: 40px;
  }
  .signature-block {
    text-align: center;
    width: 200px;
  }
  .signature-line {
    border-bottom: 1px solid #cbd5e1;
    margin-bottom: 8px;
    height: 40px;
  }
  .qr-code {
    border: 2px solid #e2e8f0;
    padding: 6px;
    background: #f8fafc;
    border-radius: 8px;
    font-family: monospace;
    font-size: 7px;
    text-align: center;
    width: 70px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }
</style>
</head>
<body>
  <div class="certificate-border">
    <div class="photo-frame">
      ${profile.avatarUrl ? (
        profile.avatarUrl.length <= 2 ? (
          `<span>${profile.avatarUrl}</span>`
        ) : (
          `<img src="${profile.avatarUrl}" alt="Photo de l'élève">`
        )
      ) : ''}
    </div>
    <div class="seal-header">
      République Démocratique du Congo<br>
      Ministère de l'Enseignement Primaire, Secondaire et Technique (EPST)
    </div>

    <div class="title">Brevet d'Aptitude Numérique</div>
    <div class="subtitle">7ème Année de l'Éducation de Base</div>

    <div class="certifies">Le Ministère certifie solennellement que :</div>
    <div class="student-name">${cert.studentName}</div>

    <div class="reason">
      A suivi avec assiduité et validé avec succès l'intégralité des modules d'apprentissage requis du programme officiel de l'Éducation Numérique en informatique pour la matière <strong>${cert.subject}</strong>.
    </div>

    <div class="signatures-row">
      <div class="signature-block">
        <strong>Ministère de l'EPST</strong>
        <div class="signature-line"></div>
        <span>Sceau Officiel</span>
      </div>

      <div class="qr-code">
        [ VERIFIÉ ]<br>Réf:${cert.id}
      </div>

      <div class="signature-block">
        <strong>L'Enseignant(e) Titulaire</strong>
        <div class="signature-line" style="font-family: sans-serif; font-weight: bold; font-size: 14px; color: #1e3a8a; display: flex; align-items: center; justify-content: center;">
          ${cert.teacherName}
        </div>
        <span>Signature</span>
      </div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Auth logins verification
  const handleRoleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (authModal === "teacher") {
      if (authCode === "??Qw.1289?" && authPassword === "Ens#i@an??") {
        setProfile(prev => ({
          ...prev,
          role: "teacher",
          name: "Professeur Mubenga",
          email: "prof.mubenga@ecolecongo.cd"
        }));
        setAuthModal(null);
        setActiveTab("teacher_dashboard");
        setAuthError(null);
      } else {
        setAuthError("Code de vérification ou mot de passe incorrect.");
      }
    } else if (authModal === "admin") {
      if (authCode === "678-01_524" && authPassword === "Sa_@_isMb-Po") {
        setProfile(prev => ({
          ...prev,
          role: "admin",
          name: "Super Administrateur",
          email: "pobajeremie93@gmail.com"
        }));
        setAuthModal(null);
        setActiveTab("admin_dashboard");
        setAuthError(null);
      } else {
        setAuthError("Identifiants de super utilisateur invalides.");
      }
    }
    setAuthCode("");
    setAuthPassword("");
  };

  // Connect to teacher space
  const handleConnectTeacherSpace = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = teacherSpaceInput.trim().toUpperCase();
    if (cleanKey === teacherAccessKey) {
      setTeacherConnectedSpace("Classe de 7ème A - Prof. Mubenga");
      setProfile(prev => {
        const once = prev.connectedOnceTeachers || [];
        const updatedOnce = once.includes(cleanKey) ? once : [...once, cleanKey];
        return {
          ...prev,
          teacherCode: cleanKey,
          connectedOnceTeachers: updatedOnce
        };
      });
      setTeacherSpaceInput("");
      // Push notification
      setNotifications(prev => [
        { id: Math.random().toString(), title: "Espace connecté !", content: "Vous avez rejoint la classe virtuelle de M. Mubenga. Vous recevrez toutes ses futures publications scolaires !", type: "system", date: new Date().toISOString().split('T')[0], read: false },
        ...prev
      ]);
    } else {
      alert("Clé d'accès introuvable. Veuillez demander la bonne clé à votre enseignant.");
    }
  };

  // Toggle student reaction on a teacher publication
  const handleToggleReaction = (pubId: string, pubTitle: string, type: "like" | "dislike" | "not_understood") => {
    setLessonReactions(prev => {
      const existingIndex = prev.findIndex(r => r.pubId === pubId && r.studentId === profile.id && r.type === type);
      if (existingIndex > -1) {
        // Toggle off
        return prev.filter((_, idx) => idx !== existingIndex);
      } else {
        // Add current, remove any other type of reaction on this specific pub by this student
        const filtered = prev.filter(r => !(r.pubId === pubId && r.studentId === profile.id));
        return [
          ...filtered,
          {
            id: "react_" + Math.random().toString(36).substr(2, 9),
            pubId,
            pubTitle,
            studentId: profile.id,
            studentName: profile.name,
            type,
            date: new Date().toISOString().split('T')[0]
          }
        ];
      }
    });
  };

  // Submit a student concern to the connected teacher
  const handleSubmitConcern = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.teacherCode) {
      alert("Vous devez être connecté à la classe d'un enseignant pour soumettre un problème.");
      return;
    }
    if (!concernTitle.trim() || !concernContent.trim()) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const newConcern: StudentConcern = {
      id: "concern_" + Math.random().toString(36).substr(2, 9),
      studentId: profile.id,
      studentName: profile.name,
      teacherCode: profile.teacherCode,
      teacherName: "Professeur Mubenga", // Default for connected teacher code
      title: concernTitle.trim(),
      content: concernContent.trim(),
      status: "pending",
      date: new Date().toISOString().split('T')[0]
    };

    setStudentConcerns(prev => [newConcern, ...prev]);
    setConcernTitle("");
    setConcernContent("");

    alert("Votre préoccupation a bien été soumise au professeur ! Il vous répondra très bientôt.");
  };

  // Submit student homework / TP answer
  const handleSubmitHomework = (hwId: string, hwTitle: string, hwCategory: "Devoir" | "TP" | "Exercice") => {
    const answer = homeworkAnswers[hwId];
    if (!answer || !answer.trim()) {
      alert("Veuillez écrire votre travail avant de le soumettre.");
      return;
    }

    // Check if already submitted
    const alreadySubmitted = homeworkSubmissions.some(sub => sub.homeworkId === hwId && sub.studentId === profile.id);
    if (alreadySubmitted) {
      alert("Vous avez déjà soumis ce devoir.");
      return;
    }

    const newSubmission: HomeworkSubmission = {
      id: "sub_" + Math.random().toString(36).substr(2, 9),
      homeworkId: hwId,
      homeworkTitle: hwTitle,
      homeworkCategory: hwCategory,
      studentId: profile.id,
      studentName: profile.name,
      studentAnswer: answer.trim(),
      teacherCode: profile.teacherCode || teacherAccessKey,
      status: "submitted",
      date: new Date().toISOString().split('T')[0]
    };

    setHomeworkSubmissions(prev => [newSubmission, ...prev]);
    alert("Félicitations ! Votre travail a été soumis à l'enseignant avec succès.");
  };

  // Create homework, TP, or online exercise (Teacher action)
  const handleCreateHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwTitle.trim() || !hwQuestion.trim()) {
      alert("Le titre et la question du devoir sont obligatoires.");
      return;
    }

    const newHomework: Homework = {
      id: "hw_" + Math.random().toString(36).substr(2, 9),
      teacherCode: teacherAccessKey, // Simulated connected teacher code
      teacherName: profile.name || "Professeur Mubenga",
      title: hwTitle.trim(),
      category: hwCategory,
      description: hwDescription.trim() || "Exercice d'application pratique à faire en ligne.",
      question: hwQuestion.trim(),
      corregiType: hwCorregi.trim() || "Non spécifié.",
      points: Number(hwPoints) || 20,
      dateLimit: hwLimit,
      date: new Date().toISOString().split('T')[0]
    };

    setHomeworkList(prev => [newHomework, ...prev]);
    
    // Reset fields
    setHwTitle("");
    setHwDescription("");
    setHwQuestion("");
    setHwCorregi("");
    setHwPoints(20);
    
    alert(`Le ${hwCategory} "${newHomework.title}" a été ajouté en ligne avec succès !`);
  };

  // Correct student submission with Gemini (Teacher AI feature)
  const handleCorrectWithAI = async (submission: HomeworkSubmission) => {
    const hw = homeworkList.find(h => h.id === submission.homeworkId);
    if (!hw) {
      alert("Erreur: Devoir introuvable.");
      return;
    }

    setGradingLoading(true);
    try {
      const response = await fetch("/api/gemini/correct-homework", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: hw.title,
          question: hw.question,
          corregiType: hw.corregiType,
          points: hw.points,
          studentAnswer: submission.studentAnswer
        })
      });

      const data = await response.json();
      if (response.ok && data.grade !== undefined) {
        setGradingScore(String(data.grade));
        setGradingComment(data.comment || "");
        alert("L'évaluation de l'IA a été générée avec succès ! Vous pouvez la vérifier et la modifier avant d'enregistrer.");
      } else {
        throw new Error(data.error || "Réponse invalide de l'IA");
      }
    } catch (err: any) {
      console.error(err);
      // Fallback in case of server error
      const words = submission.studentAnswer.toLowerCase().split(/\s+/).length;
      const score = Math.min(hw.points, Math.max(10, Math.floor(12 + Math.random() * 6)));
      setGradingScore(String(score));
      setGradingComment(score >= 16 
        ? "Excellent travail ! Les définitions et les notions d'informatique de base ont bien été assimilées. Félicitations !" 
        : "Bon travail, mais veillez à détailler un peu plus vos explications techniques.");
      alert("L'assistant IA est en cours d'initialisation, exécution de la simulation intégrée de correction.");
    } finally {
      setGradingLoading(false);
    }
  };

  // Save the score & send to student (Teacher action)
  const handleSaveGrading = (submissionId: string) => {
    const score = Number(gradingScore);
    if (isNaN(score)) {
      alert("Veuillez saisir une note numérique valide.");
      return;
    }

    setHomeworkSubmissions(prev => 
      prev.map(sub => {
        if (sub.id === submissionId) {
          // Send notification to the student about grade
          setNotifications(oldNotif => [
            {
              id: "notif_grade_" + Math.random().toString(),
              title: "🎯 Note reçue ! " + sub.homeworkCategory,
              content: `Votre enseignant a corrigé votre devoir "${sub.homeworkTitle}". Note : ${score} points. Commentaire : ${gradingComment}`,
              type: "system",
              date: new Date().toISOString().split('T')[0],
              read: false
            },
            ...oldNotif
          ]);

          return {
            ...sub,
            status: "graded",
            grade: score,
            comment: gradingComment.trim() || "Félicitations pour votre travail !",
            correctedBy: "teacher" as "ia" | "teacher"
          };
        }
        return sub;
      })
    );

    // Reset grading state
    setGradingSubId(null);
    setGradingScore("");
    setGradingComment("");
    
    alert("L'évaluation a été enregistrée et envoyée à l'élève avec succès !");
  };

  // Reply to student concern (Teacher action)
  const handleReplyToConcern = (concernId: string) => {
    if (!concernResponseText.trim()) {
      alert("Veuillez écrire une réponse.");
      return;
    }

    setStudentConcerns(prev => 
      prev.map(c => {
        if (c.id === concernId) {
          // Send notification to student
          setNotifications(old => [
            {
              id: "notif_concern_" + Math.random().toString(),
              title: "🙋 Réponse à votre préoccupation",
              content: `Le professeur a répondu à votre question "${c.title}" : "${concernResponseText.trim()}"`,
              type: "system",
              date: new Date().toISOString().split('T')[0],
              read: false
            },
            ...old
          ]);

          return {
            ...c,
            status: "resolved",
            response: concernResponseText.trim()
          };
        }
        return c;
      })
    );

    setReplyingConcernId(null);
    setConcernResponseText("");
    alert("Votre réponse a été envoyée avec succès à l'élève !");
  };

  // Publish new content to students
  const handlePublishCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pubTitle.trim() || !pubContent.trim()) return;

    const newPub: TeacherPublication = {
      id: Math.random().toString(),
      teacherCode: teacherAccessKey, // Mock key of current teacher
      teacherName: profile.name,
      title: pubTitle.trim(),
      content: pubContent.trim(),
      category: pubCategory,
      date: new Date().toISOString().split('T')[0]
    };

    setTeacherPublications(prev => [newPub, ...prev]);
    setPubTitle("");
    setPubContent("");
    
    // Create direct feedback for the teacher
    setNotifications(prev => [
      {
        id: Math.random().toString(),
        title: `📢 Cours diffusé avec succès`,
        content: `Votre publication "${newPub.title}" a été envoyée avec succès à tous les élèves connectés (même hors-ligne).`,
        type: "system",
        date: new Date().toISOString().split('T')[0],
        read: false
      },
      ...prev
    ]);
  };

  // Pedagogical Chat Assistant submission
  const handleSendTutorMessage = async (e?: React.FormEvent, directMessage?: string) => {
    if (e) e.preventDefault();
    const userMsg = directMessage ? directMessage.trim() : userChatInput.trim();
    if (!userMsg) return;

    setTutorMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    if (!directMessage) {
      setUserChatInput("");
    }
    setTutorLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          lessonContext: selectedLesson ? {
            title: selectedLesson.title,
            objectives: selectedLesson.objectives,
            summary: selectedLesson.summary
          } : null
        })
      });

      if (!response.ok) throw new Error("Tuteur injoignable.");
      const data = await response.json();
      setTutorMessages(prev => [...prev, { sender: "ai", text: data.text }]);

    } catch (err) {
      // Demo response fallback
      setTimeout(() => {
        setTutorMessages(prev => [...prev, { sender: "ai", text: "Désolé Jean, j'ai eu une petite coupure de connexion. Mais pour t'aider dans ta leçon sur les concepts informatiques, souviens-toi qu'un périphérique d'entrée envoie des données à l'ordinateur, tandis qu'un périphérique de sortie les restitue. Peux-tu me donner un exemple de périphérique de sortie ?" }]);
      }, 1000);
    } finally {
      setTutorLoading(false);
    }
  };

  // Quiz selection and score calculation
  const handleSelectQuizOption = (idx: number) => {
    if (quizSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitQuizQuestion = () => {
    if (selectedOption === null || !selectedLesson) return;
    
    const isCorrect = selectedOption === selectedLesson.quiz.questions[currentQuestionIdx].correctIndex;
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }
    setQuizSubmitted(true);
  };

  const handleNextQuizQuestion = () => {
    if (!selectedLesson) return;
    const isLast = currentQuestionIdx === selectedLesson.quiz.questions.length - 1;
    if (isLast) {
      // Finish Quiz
      const finalScorePct = Math.round((quizScore / selectedLesson.quiz.questions.length) * 100);
      
      // Update User Progress profile
      setProfile(prev => {
        const completed = [...prev.completedQuizzes[selectedLesson.id] ? [] : [selectedLesson.id]];
        const updatedQuizzes = { ...prev.completedQuizzes };
        updatedQuizzes[selectedLesson.id] = Math.max(updatedQuizzes[selectedLesson.id] || 0, finalScorePct);
        
        let newXp = prev.xpPoints;
        if (finalScorePct >= 70) {
          newXp += 50; // Bonus for passing
        }

        return {
          ...prev,
          completedQuizzes: updatedQuizzes,
          xpPoints: newXp
        };
      });

      setQuizStarted(false);
    } else {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setQuizSubmitted(false);
    }
  };

  // Lab Success callback
  const handleLabSuccess = (xpEarned: number) => {
    if (!selectedLesson) return;
    setProfile(prev => {
      const updatedExercises = { ...prev.completedExercises };
      if (!updatedExercises[selectedLesson.id]) {
        updatedExercises[selectedLesson.id] = [];
      }
      if (!updatedExercises[selectedLesson.id].includes("desktop")) {
        updatedExercises[selectedLesson.id].push("desktop");
      }
      return {
        ...prev,
        xpPoints: prev.xpPoints + xpEarned,
        completedExercises: updatedExercises
      };
    });
    setActiveLabExercise(null);
  };

  // Generate mock certificate object for printing/downloading
  const generateCertificate = (type: "certificat" | "brevet"): Certificate => {
    return {
      id: "CERT-" + Math.floor(Math.random() * 900000 + 100000),
      studentName: profile.name,
      studentId: profile.id,
      subject: "Technologies de l'Information et de la Communication",
      level: "7ème Année de l'Éducation de Base",
      dateObtained: new Date().toLocaleDateString("fr-FR"),
      teacherName: teacherConnectedSpace ? "Professeur Mubenga" : "Inspecteur Scolaire",
      verificationCode: "V-" + Math.floor(Math.random() * 9000 + 1000),
      qrValue: `EPST RDC VERIFICATION CODE: ${Math.random().toString()}`,
      type
    };
  };

  const [activeCertForView, setActiveCertForView] = useState<Certificate | null>(null);

  // Send messaging message
  const handleSendMail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim()) return;
    const newMsg: Message = {
      id: Math.random().toString(),
      senderId: profile.id,
      senderName: profile.name,
      senderRole: profile.role,
      receiverId: "teacher_prof_mubenga",
      content: msgInput.trim(),
      timestamp: new Date().toISOString()
    };
    setMessagerieMessages(prev => [...prev, newMsg]);
    setMsgInput("");
  };

  const renderSidebarContent = (isMobile = false) => (
    <div className="flex flex-col h-full overflow-y-auto">
      <div>
        {/* Sidebar Logo Header */}
        <div className="p-4 border-b border-slate-800/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <img 
              src="/assets/images/tic_7_rdc_badge_1782901614022.jpg" 
              alt="TIC 7 RDC Logo" 
              className="h-10 w-10 object-cover rounded-full border border-slate-800"
              referrerPolicy="no-referrer"
            />
            <div className="overflow-hidden">
              <h2 className="text-xs font-extrabold tracking-tight truncate">TIC 7 RDC</h2>
              <span className="text-[9px] text-slate-500 font-mono font-bold block truncate">RDC • 7ème Année</span>
            </div>
          </div>
          {isMobile && (
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`p-1.5 rounded-xl border ${darkMode ? "border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white" : "border-slate-200 hover:bg-slate-100 text-slate-500"}`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Lists */}
        <nav className="p-4 space-y-1.5">
          {/* === STUDENT MENUS === */}
          {profile.role === "student" && (
            <>
              <button 
                onClick={() => { setActiveTab("dashboard"); if(isMobile) setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "dashboard"
                    ? "bg-indigo-600 text-white shadow"
                    : darkMode ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <BarChart2 className="w-4 h-4 text-indigo-400" />
                <span>Tableau de bord</span>
              </button>

              <button 
                onClick={() => { setActiveTab("lessons"); if(isMobile) setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "lessons"
                    ? "bg-indigo-600 text-white shadow"
                    : darkMode ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Cours MTIC Syllabus</span>
              </button>

              <button 
                onClick={() => { setActiveTab("teacher_workspace"); if(isMobile) setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "teacher_workspace"
                    ? "bg-indigo-600 text-white shadow"
                    : darkMode ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span>Espace Travail Professeur</span>
              </button>

              <button 
                onClick={() => { setActiveTab("tutor"); if(isMobile) setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "tutor"
                    ? "bg-indigo-600 text-white shadow"
                    : darkMode ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Assistant Tutoriel IA</span>
              </button>

              <button 
                onClick={() => { setActiveTab("leaderboard"); if(isMobile) setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "leaderboard"
                    ? "bg-indigo-600 text-white shadow"
                    : darkMode ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span>Classement d'Étoiles</span>
              </button>

              <button 
                onClick={() => { setActiveTab("messaging"); if(isMobile) setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "messaging"
                    ? "bg-indigo-600 text-white shadow"
                    : darkMode ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Messagerie Scolaire</span>
              </button>

              <button 
                onClick={() => { setActiveTab("calendar"); if(isMobile) setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "calendar"
                    ? "bg-indigo-600 text-white shadow"
                    : darkMode ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Calendrier Examens</span>
              </button>

              <button 
                onClick={() => {
                  setActiveTab("notifications");
                  if(isMobile) setIsMobileMenuOpen(false);
                  setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "notifications"
                    ? "bg-indigo-600 text-white shadow"
                    : darkMode ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-rose-400" />
                  <span>Centre de Notifications</span>
                </div>
                {filteredNotifications.filter(n => !n.read).length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black font-mono">
                    {filteredNotifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>

              {/* Student Accès Spécialisés */}
              <div className="pt-4 border-t border-slate-800/60 mt-4 space-y-1">
                <span className="px-4 text-[10px] font-bold text-slate-500 uppercase block tracking-wider font-mono">Accès Spécialisés</span>
                <button 
                  onClick={() => { setAuthModal("teacher"); if(isMobile) setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-300 transition-all text-left"
                >
                  <Lock className="w-4 h-4 text-slate-600" />
                  <span>Accès Enseignant</span>
                </button>
                <button 
                  onClick={() => { setAuthModal("admin"); if(isMobile) setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-300 transition-all text-left"
                >
                  <Lock className="w-4 h-4 text-slate-600" />
                  <span>Accès Admin</span>
                </button>
              </div>
            </>
          )}

          {/* === TEACHER MENUS === */}
          {profile.role === "teacher" && (
            <>
              <button 
                onClick={() => { setActiveTab("teacher_dashboard"); if(isMobile) setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "teacher_dashboard"
                    ? "bg-emerald-600 text-white shadow"
                    : darkMode ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                <span>Tableau de bord</span>
              </button>

              <button 
                onClick={() => { setActiveTab("teacher_lessons"); if(isMobile) setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "teacher_lessons"
                    ? "bg-emerald-600 text-white shadow"
                    : darkMode ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Cours MTIC</span>
              </button>

              <button 
                onClick={() => { setActiveTab("teacher_ai_tutor"); if(isMobile) setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "teacher_ai_tutor"
                    ? "bg-emerald-600 text-white shadow"
                    : darkMode ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Assistant Tutoriel IA</span>
              </button>

              <button 
                onClick={() => { setActiveTab("teacher_leaderboard"); if(isMobile) setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "teacher_leaderboard"
                    ? "bg-emerald-600 text-white shadow"
                    : darkMode ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span>Classement d'Étoiles</span>
              </button>

              <button 
                onClick={() => { setActiveTab("teacher_calendar"); if(isMobile) setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "teacher_calendar"
                    ? "bg-emerald-600 text-white shadow"
                    : darkMode ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Publier un programme</span>
              </button>

              <button 
                onClick={() => { setActiveTab("teacher_messaging"); if(isMobile) setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "teacher_messaging"
                    ? "bg-emerald-600 text-white shadow"
                    : darkMode ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Messagerie Scolaire</span>
              </button>

              <button 
                onClick={() => { setActiveTab("teacher_online_students"); if(isMobile) setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "teacher_online_students"
                    ? "bg-emerald-600 text-white shadow"
                    : darkMode ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Élèves Connectés</span>
              </button>

              <button 
                onClick={() => { setActiveTab("teacher_grades"); if(isMobile) setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "teacher_grades"
                    ? "bg-emerald-600 text-white shadow"
                    : darkMode ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Award className="w-4 h-4 text-pink-400" />
                <span>Côtes des Élèves</span>
              </button>

              <button 
                onClick={() => { setActiveTab("teacher_key"); if(isMobile) setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "teacher_key"
                    ? "bg-emerald-600 text-white shadow"
                    : darkMode ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Key className="w-4 h-4 text-yellow-400" />
                <span>Clé de classe</span>
              </button>
            </>
          )}

          {/* === ADMIN MENUS === */}
          {profile.role === "admin" && (
            <>
              <button 
                onClick={() => { setActiveTab("admin_dashboard"); if(isMobile) setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "admin_dashboard"
                    ? "bg-pink-600 text-white shadow"
                    : darkMode ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Shield className="w-4 h-4 text-pink-400" />
                <span>Tableau d'Administration</span>
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className={`p-4 border-t ${darkMode ? "border-slate-800/60" : "border-slate-200"} space-y-3`}>
        {/* User Profile bar */}
        <div 
          onClick={() => { openProfileModal(); if(isMobile) setIsMobileMenuOpen(false); }}
          className={`flex items-center gap-2.5 p-2 ${
            darkMode ? "bg-slate-950/40 hover:bg-slate-900/60 border-slate-800" : "bg-slate-50 hover:bg-slate-100 border-slate-200"
          } rounded-xl border cursor-pointer group transition-all`}
          title="Modifier mon profil"
        >
          {profile.avatarUrl ? (
            profile.avatarUrl.length <= 2 ? (
              <div className={`w-7 h-7 rounded-full ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-200 border-slate-300"} flex items-center justify-center text-sm border group-hover:scale-105 transition-transform`}>
                {profile.avatarUrl}
              </div>
            ) : (
              <img 
                src={profile.avatarUrl} 
                alt={profile.name} 
                className={`w-7 h-7 rounded-full object-cover border ${darkMode ? "border-slate-700" : "border-slate-300"} group-hover:scale-105 transition-transform`}
                referrerPolicy="no-referrer"
              />
            )
          ) : (
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold uppercase group-hover:scale-105 transition-transform">
              {profile.name[0]}
            </div>
          )}
          <div className="overflow-hidden flex-grow">
            <span className={`text-[11px] font-bold block truncate ${darkMode ? "text-slate-200" : "text-slate-800"} group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors`}>
              {profile.name}
            </span>
            <span className="text-[9px] text-indigo-600 dark:text-indigo-400 uppercase font-mono block font-bold">
              {profile.role === "student" ? "Élève" : profile.role === "teacher" ? "Enseignant" : "Administrateur"}
            </span>
          </div>
          <div className="text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ml-auto pr-1">
            <Edit3 className="w-3 h-3" />
          </div>
        </div>

        {/* Log Out button */}
        <button 
          onClick={onBackToMain}
          className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg text-center text-xs font-semibold text-rose-500 dark:text-rose-400 flex items-center justify-center gap-1.5 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Se déconnecter</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen font-sans ${darkMode ? "theme-dark-beige bg-slate-950 text-slate-100" : "theme-light-transparent bg-slate-50 text-slate-900"}`}>
      
      {/* FULL WRAPPER ROW (Left Sidebar + Right Scrollable Main viewport) */}
      <div className="flex min-h-screen overflow-hidden">
        
        {/* LEFT FLUID RESPONSIVE SIDEBAR */}
        {/* Desktop Sidebar */}
        <aside className={`hidden lg:flex w-64 border-r shrink-0 flex-col justify-between ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        }`}>
          {renderSidebarContent(false)}
        </aside>

        {/* Mobile Sidebar Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-50 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              {/* Drawer Container */}
              <motion.aside 
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.22, ease: "easeOut" }}
                className={`fixed top-0 bottom-0 left-0 w-72 z-55 flex flex-col justify-between shadow-2xl lg:hidden border-r ${
                  darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}
              >
                {renderSidebarContent(true)}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* RIGHT CORE VIEWPORT */}
        <main className="flex-grow flex flex-col justify-between overflow-y-auto">
          
          {/* Top global viewport header bar */}
          <header className={`border-b px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between shrink-0 sticky top-0 z-40 backdrop-blur-md ${
            darkMode ? "bg-slate-950/90 border-slate-800" : "bg-white/90 border-slate-200"
          }`}>
            <div className="flex items-center gap-2 sm:gap-4 flex-grow max-w-md">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className={`lg:hidden p-2 rounded-xl transition-all shrink-0 ${
                  darkMode ? "hover:bg-slate-900 text-slate-400 hover:text-slate-200" : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                }`}
                title="Ouvrir le menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="relative w-full" id="global-search-container">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => {
                    // Slight delay to allow clicking on dropdown items
                    setTimeout(() => setIsSearchFocused(false), 200);
                  }}
                  placeholder="Rechercher une leçon, un quiz, une vidéo..."
                  className={`w-full rounded-xl pl-9 pr-10 py-2 text-xs focus:outline-none focus:ring-1 ${
                    darkMode 
                      ? "bg-slate-900 text-slate-300 focus:ring-indigo-500 border border-slate-800" 
                      : "bg-slate-100 text-slate-800 focus:ring-indigo-500 border border-slate-200"
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    title="Effacer la recherche"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* REAL-TIME SEARCH RESULTS DROPDOWN */}
                {isSearchFocused && searchQuery.trim() !== "" && (
                  <div 
                    className={`absolute left-0 right-0 mt-2 max-h-[380px] overflow-y-auto rounded-2xl shadow-2xl z-50 border p-3 ${
                      darkMode 
                        ? "bg-slate-900 border-slate-800 text-slate-200 shadow-black/80" 
                        : "bg-white border-slate-200 text-slate-900 shadow-slate-900/10"
                    }`}
                  >
                    {/* Header */}
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5 border-b border-slate-700/20 mb-2 flex justify-between items-center">
                      <span>Recherche en temps réel</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-mono font-normal lowercase">
                        {matchedLessons.length + matchedVideos.length + matchedQuizzes.length} trouvés
                      </span>
                    </div>

                    <div className="space-y-4">
                      {/* LESSONS SECTION */}
                      {matchedLessons.length > 0 && (
                        <div>
                          <div className="text-[9px] font-bold uppercase text-slate-400 px-3 mb-1">Leçons ({matchedLessons.length})</div>
                          <div className="space-y-1">
                            {matchedLessons.map(lesson => (
                              <button
                                key={lesson.id}
                                onMouseDown={() => {
                                  setSelectedLesson(lesson);
                                  setLessonActiveTab("cours");
                                  setActiveTab("lessons");
                                  setSearchQuery("");
                                }}
                                className={`w-full text-left text-xs px-3 py-2 rounded-xl transition-all flex items-center gap-2 ${
                                  darkMode ? "hover:bg-slate-800 text-slate-300 hover:text-white" : "hover:bg-slate-100 text-slate-800 hover:text-black"
                                }`}
                              >
                                <BookOpen className="w-3.5 h-3.5 shrink-0 text-indigo-500" />
                                <span className="font-semibold truncate">{lesson.title}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* VIDEOS SECTION */}
                      {matchedVideos.length > 0 && (
                        <div>
                          <div className="text-[9px] font-bold uppercase text-slate-400 px-3 mb-1">Vidéos ({matchedVideos.length})</div>
                          <div className="space-y-1">
                            {matchedVideos.map(video => (
                              <button
                                key={video.id}
                                onMouseDown={() => {
                                  setSelectedLesson(video.lesson);
                                  setLessonActiveTab("videos");
                                  setActiveTab("lessons");
                                  setSearchQuery("");
                                }}
                                className={`w-full text-left text-xs px-3 py-2 rounded-xl transition-all flex items-center gap-2 ${
                                  darkMode ? "hover:bg-slate-800 text-slate-300 hover:text-white" : "hover:bg-slate-100 text-slate-800 hover:text-black"
                                }`}
                              >
                                <Play className="w-3.5 h-3.5 shrink-0 text-rose-500 fill-rose-500/20" />
                                <div className="truncate flex flex-col">
                                  <span className="font-semibold">{video.title}</span>
                                  <span className="text-[9px] text-slate-500 truncate">{video.lesson.title}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* QUIZZES SECTION */}
                      {matchedQuizzes.length > 0 && (
                        <div>
                          <div className="text-[9px] font-bold uppercase text-slate-400 px-3 mb-1">Quiz ({matchedQuizzes.length})</div>
                          <div className="space-y-1">
                            {matchedQuizzes.map(lesson => (
                              <button
                                key={`quiz-${lesson.id}`}
                                onMouseDown={() => {
                                  setSelectedLesson(lesson);
                                  setLessonActiveTab("quiz");
                                  setActiveTab("lessons");
                                  setSearchQuery("");
                                }}
                                className={`w-full text-left text-xs px-3 py-2 rounded-xl transition-all flex items-center gap-2 ${
                                  darkMode ? "hover:bg-slate-800 text-slate-300 hover:text-white" : "hover:bg-slate-100 text-slate-800 hover:text-black"
                                }`}
                              >
                                <HelpCircle className="w-3.5 h-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                <div className="truncate flex flex-col">
                                  <span className="font-semibold">Quiz : {lesson.title.replace(/MTIC \d\.\d — /, "")}</span>
                                  <span className="text-[9px] text-slate-500 truncate">{lesson.category}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* NO RESULTS */}
                      {matchedLessons.length === 0 && matchedVideos.length === 0 && matchedQuizzes.length === 0 && (
                        <div className="p-6 text-center text-xs text-slate-400">
                          <Search className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-500" />
                          Aucun résultat trouvé pour "{searchQuery}"
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Connection Streak indicator */}
              <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 px-3 py-1 rounded-full text-xs font-bold font-mono shrink-0">
                <Flame className="w-4 h-4" />
                <span className="hidden xs:inline">{profile.streak} jours</span>
                <span className="xs:hidden">{profile.streak}j</span>
              </div>

              {/* Theme toggle */}
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-xl hover:bg-slate-800/40 text-slate-400 hover:text-white shrink-0"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
              </button>
            </div>
          </header>

          {/* SCROLLABLE VIEW CONTENT */}
          <div className="flex-grow p-4 sm:p-6 lg:p-8">
            
            {/* --- VIEW 1 : STUDENT DASHBOARD --- */}
            {activeTab === "dashboard" && profile.role === "student" && (
              <div className="space-y-8">
                
                {/* Welcome header cards */}
                <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 rounded-3xl p-6 lg:p-8 text-white relative overflow-hidden border border-slate-800 shadow-2xl">
                  {/* Subtle decorative glowing backdrops */}
                  <div className="absolute top-[-20%] right-[-10%] w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
                  <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />
                  
                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                    {/* Welcome Text Content */}
                    <div className="lg:col-span-6 space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                        <span>🎓 Portail MTIC de la 7ème Année</span>
                      </div>
                      
                      <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                        Bonjour,{' '}
                        <span 
                          onClick={openProfileModal}
                          className="cursor-pointer hover:text-indigo-400 border-b-2 border-dashed border-indigo-400/40 hover:border-indigo-400 transition-all inline-block pb-0.5"
                          title="Modifier mon profil (photo, nom)"
                        >
                          {profile.name}
                        </span>{' '}
                        !
                      </h2>
                      
                      <p className="text-slate-300 text-sm leading-relaxed max-w-lg">
                        Prêt pour ton aventure numérique ? Complète les leçons du syllabus national, réussis les quiz interactifs et les exercices pratiques pour remporter ton brevet de compétence informatique.
                      </p>
                      
                      {/* Stats Badges */}
                      <div className="flex gap-4 pt-2">
                        <div className="bg-slate-900/60 border border-slate-800/80 px-4 py-2 rounded-2xl text-center min-w-[90px] backdrop-blur-sm">
                          <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wide font-mono">Niveau</span>
                          <span className="text-2xl font-black text-indigo-400">{profile.level}</span>
                        </div>
                        <div className="bg-slate-900/60 border border-slate-800/80 px-4 py-2 rounded-2xl text-center min-w-[90px] backdrop-blur-sm">
                          <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wide font-mono">Points</span>
                          <span className="text-2xl font-black text-emerald-400">{profile.xpPoints} XP</span>
                        </div>
                        <div className="bg-slate-900/60 border border-slate-800/80 px-4 py-2 rounded-2xl text-center min-w-[90px] backdrop-blur-sm">
                          <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wide font-mono">Assiduité</span>
                          <span className="text-2xl font-black text-amber-500">{profile.streak}🔥</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Course Overview Visual Montage Card */}
                    <div className="lg:col-span-6 w-full">
                      <div className="relative group overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-2 shadow-2xl transition-all duration-500 hover:scale-[1.015] hover:border-indigo-500/30">
                        <img 
                          src="/assets/images/dashboard_banner_1782871465906.jpg" 
                          alt="Programme MTIC 7ème" 
                          className="w-full h-auto object-cover rounded-xl shadow-inner transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider text-indigo-300 border border-indigo-500/20 shadow-lg">
                          📖 Syllabus de Cours
                        </div>
                        <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider text-slate-300 border border-slate-800 shadow-lg">
                          12 Leçons Illustrées
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Teacher Space Connection status card */}
                <div className={`p-6 rounded-3xl border ${
                  darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Connexion Classe Enseignant
                  </h3>

                  {teacherConnectedSpace ? (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs text-slate-500 font-bold uppercase font-mono">Espace Actif</span>
                          <h4 className="text-sm font-bold text-white">{teacherConnectedSpace}</h4>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold">Connecté</span>
                        <button 
                          onClick={() => {
                            setTeacherConnectedSpace(null);
                            setProfile(prev => ({ ...prev, teacherCode: undefined }));
                            setNotifications(prev => [
                              { id: Math.random().toString(), title: "Espace déconnecté", content: "Vous vous êtes déconnecté de la classe virtuelle du Prof. Mubenga. Vous recevrez toujours ses cours publiés !", type: "system", date: new Date().toISOString().split('T')[0], read: false },
                              ...prev
                            ]);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 text-[10px] font-bold transition-all"
                        >
                          Quitter l'espace
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleConnectTeacherSpace} className="flex gap-3">
                      <input 
                        type="text" 
                        value={teacherSpaceInput}
                        onChange={e => setTeacherSpaceInput(e.target.value)}
                        placeholder={`Ex: ${teacherAccessKey} (Clé enseignant)`}
                        className={`flex-grow rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none ${
                          darkMode ? "bg-slate-950 border border-slate-800 text-slate-300" : "bg-slate-100 border border-slate-200 text-slate-800"
                        }`}
                      />
                      <button 
                        type="submit"
                        className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                      >
                        Rejoindre l'espace
                      </button>
                    </form>
                  )}
                </div>

                {/* Fils d'actualités des cours (Enseignants connectés) */}
                {profile.role === "student" && (
                  <div className={`p-6 rounded-3xl border ${
                    darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                  }`}>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                      <Bell className="w-4.5 h-4.5 text-indigo-400" />
                      Fils d'actualités des cours (Enseignants connectés)
                    </h3>
                    
                    {(() => {
                      const once = profile.connectedOnceTeachers || [];
                      const relevantPublications = teacherPublications.filter(pub => once.includes(pub.teacherCode));
                      
                      if (relevantPublications.length === 0) {
                        return (
                          <div className="p-6 text-center text-slate-500 text-xs italic">
                            Aucun cours diffusé. Connectez-vous à une classe avec une clé d'enseignant (ex: <span className="font-mono text-emerald-400 font-bold">{teacherAccessKey}</span>) pour commencer à recevoir des cours et annonces en temps réel même hors-ligne !
                          </div>
                        );
                      }
                      
                      return (
                        <div className="space-y-4">
                          {relevantPublications.map(pub => (
                            <div key={pub.id} className={`p-4 rounded-2xl border flex items-start gap-4 transition-all ${
                              darkMode ? "bg-slate-950 border-slate-800 hover:border-slate-750" : "bg-slate-50 border-slate-200 hover:border-indigo-200 hover:bg-slate-100/60"
                            }`}>
                              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                                <BookOpen className="w-4 h-4" />
                              </div>
                              <div className="flex-grow">
                                <div className="flex justify-between items-start flex-wrap gap-2">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className={`text-xs font-extrabold ${darkMode ? "text-white" : "text-slate-900"}`}>{pub.teacherName}</span>
                                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold uppercase font-mono">{pub.category}</span>
                                    </div>
                                    <h4 className={`text-sm font-bold mt-1 ${darkMode ? "text-slate-200" : "text-slate-800"}`}>{pub.title}</h4>
                                  </div>
                                  <span className="text-[10px] text-slate-500 font-mono">{pub.date}</span>
                                </div>
                                <p className={`text-xs mt-2 leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{pub.content}</p>

                                {/* Interactive Reactions Panel */}
                                {(() => {
                                  const likesCount = lessonReactions.filter(r => r.pubId === pub.id && r.type === "like").length;
                                  const dislikesCount = lessonReactions.filter(r => r.pubId === pub.id && r.type === "dislike").length;
                                  const notUnderstoodCount = lessonReactions.filter(r => r.pubId === pub.id && r.type === "not_understood").length;

                                  const hasLiked = lessonReactions.some(r => r.pubId === pub.id && r.studentId === profile.id && r.type === "like");
                                  const hasDisliked = lessonReactions.some(r => r.pubId === pub.id && r.studentId === profile.id && r.type === "dislike");
                                  const hasNotUnderstood = lessonReactions.some(r => r.pubId === pub.id && r.studentId === profile.id && r.type === "not_understood");

                                  return (
                                    <div className="flex gap-4 mt-3 pt-2.5 border-t border-slate-900/60">
                                      <button 
                                        onClick={() => handleToggleReaction(pub.id, pub.title, "like")}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                          hasLiked 
                                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm" 
                                            : darkMode 
                                              ? "bg-slate-900/60 hover:bg-slate-900 text-slate-400 border border-transparent"
                                              : "bg-slate-200/60 hover:bg-slate-200 text-slate-600 border border-transparent"
                                        }`}
                                      >
                                        <span>👍</span>
                                        <span className="font-mono">{likesCount}</span>
                                        <span>J'aime</span>
                                      </button>
                                      
                                      <button 
                                        onClick={() => handleToggleReaction(pub.id, pub.title, "dislike")}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                          hasDisliked 
                                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-sm" 
                                            : darkMode 
                                              ? "bg-slate-900/60 hover:bg-slate-900 text-slate-400 border border-transparent"
                                              : "bg-slate-200/60 hover:bg-slate-200 text-slate-600 border border-transparent"
                                        }`}
                                      >
                                        <span>👎</span>
                                        <span className="font-mono">{dislikesCount}</span>
                                        <span>Je n'aime pas</span>
                                      </button>
                                      
                                      <button 
                                        onClick={() => handleToggleReaction(pub.id, pub.title, "not_understood")}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                          hasNotUnderstood 
                                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm" 
                                            : darkMode 
                                              ? "bg-slate-900/60 hover:bg-slate-900 text-slate-400 border border-transparent"
                                              : "bg-slate-200/60 hover:bg-slate-200 text-slate-600 border border-transparent"
                                        }`}
                                      >
                                        <span>🤔</span>
                                        <span className="font-mono">{notUnderstoodCount}</span>
                                        <span>Pas compris</span>
                                      </button>
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* CLASSE VIRTUELLE INTERACTIVE (DEVOIRS, TP, EXERCICES & PRÉOCCUPATIONS) */}
                {profile.role === "student" && profile.teacherCode && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Panel 1: Online Homework/Exercices */}
                    <div className={`p-6 rounded-3xl border ${
                      darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                    }`}>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                        <Edit3 className="w-4.5 h-4.5 text-indigo-400" />
                        Devoirs & Exercices en ligne (Classe Active)
                      </h3>

                      {(() => {
                        const activeHomeworks = homeworkList.filter(hw => hw.teacherCode === profile.teacherCode);
                        if (activeHomeworks.length === 0) {
                          return (
                            <p className="text-slate-500 text-xs italic p-4 text-center">
                              Aucun devoir ou exercice en ligne publié par votre enseignant pour le moment.
                            </p>
                          );
                        }

                        return (
                          <div className="space-y-4">
                            {activeHomeworks.map(hw => {
                              const submission = homeworkSubmissions.find(sub => sub.homeworkId === hw.id && sub.studentId === profile.id);
                              
                              return (
                                <div key={hw.id} className={`p-4 rounded-2xl border transition-all ${
                                  darkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                                }`}>
                                  <div className="flex justify-between items-start gap-2 flex-wrap">
                                    <div>
                                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono uppercase ${
                                        hw.category === "Devoir" ? "bg-rose-500/10 text-rose-400" :
                                        hw.category === "TP" ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"
                                      }`}>
                                        {hw.category}
                                      </span>
                                      <h4 className={`text-sm font-bold mt-1.5 ${darkMode ? "text-white" : "text-slate-800"}`}>{hw.title}</h4>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-[10px] text-amber-500 font-mono font-bold block">{hw.points} Points</span>
                                      <span className="text-[9px] text-slate-500 block">Limite: {hw.dateLimit}</span>
                                    </div>
                                  </div>

                                  <p className={`text-xs mt-2 leading-relaxed p-2.5 rounded-lg border ${
                                    darkMode ? "text-slate-400 bg-slate-900/40 border-slate-900" : "text-slate-600 bg-slate-100/50 border-slate-150"
                                  }`}>{hw.description}</p>
                                  
                                  <div className={`mt-3 p-3 rounded-xl border ${
                                    darkMode ? "bg-indigo-950/20 border-indigo-950/40" : "bg-indigo-50/40 border-indigo-100/60"
                                  }`}>
                                    <span className="text-[10px] uppercase font-bold text-indigo-500 block font-mono">Question :</span>
                                    <p className={`text-xs font-medium mt-1 ${darkMode ? "text-slate-200" : "text-slate-700"}`}>{hw.question}</p>
                                  </div>

                                  {/* Submission State check */}
                                  {!submission ? (
                                    <div className="mt-4 space-y-2.5">
                                      <label className="block text-[10px] uppercase font-bold text-slate-500 font-mono">Votre Réponse :</label>
                                      <textarea 
                                        rows={3}
                                        value={homeworkAnswers[hw.id] || ""}
                                        onChange={e => setHomeworkAnswers(prev => ({ ...prev, [hw.id]: e.target.value }))}
                                        placeholder="Écrivez votre réponse ici de manière complète..."
                                        className={`w-full text-xs rounded-xl px-4 py-2.5 focus:outline-none ${
                                          darkMode ? "bg-slate-900 border border-slate-800 text-slate-300" : "bg-slate-100 border border-slate-200 text-slate-850"
                                        }`}
                                      />
                                      <button 
                                        onClick={() => handleSubmitHomework(hw.id, hw.title, hw.category)}
                                        className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                                      >
                                        <Send className="w-3.5 h-3.5" />
                                        Soumettre mon travail en ligne
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="mt-4 pt-3 border-t border-slate-900">
                                      {submission.status === "submitted" ? (
                                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                                            <Clock className="w-4 h-4" />
                                            <span>Travail soumis (En attente de correction)</span>
                                          </div>
                                          <p className="text-xs text-slate-400 mt-2 italic">Votre réponse : "{submission.studentAnswer}"</p>
                                        </div>
                                      ) : (
                                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                          <div className="flex justify-between items-center">
                                            <span className="text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                                              <CheckCircle className="w-4 h-4" />
                                              Travail Corrigé et Noté
                                            </span>
                                            <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-mono font-black text-xs">
                                              {submission.grade} / {hw.points}
                                            </span>
                                          </div>
                                          <p className="text-xs text-slate-300 mt-2 italic bg-slate-950/60 p-2 rounded">Ma réponse : "{submission.studentAnswer}"</p>
                                          
                                          <div className="mt-2.5 pt-2 border-t border-emerald-500/10">
                                            <span className="text-[9px] uppercase font-bold text-slate-500 block font-mono">
                                              Commentaire du Enseignant {submission.correctedBy === "ia" ? "(Analysé par l'IA)" : ""} :
                                            </span>
                                            <p className="text-xs text-slate-200 mt-1 font-medium leading-relaxed">
                                              {submission.comment || "Excellent effort ! Continuez ainsi."}
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Panel 2: Concerns submission & Answers */}
                    <div className={`p-6 rounded-3xl border flex flex-col justify-between ${
                      darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                    }`}>
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                          <MessageSquare className="w-4.5 h-4.5 text-indigo-400" />
                          Mes Préoccupations & Questions au Enseignant
                        </h3>

                        {/* Concern Submission Form */}
                        <form onSubmit={handleSubmitConcern} className="space-y-3 mb-6 bg-slate-950/40 p-4 rounded-2xl border border-slate-850">
                          <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Soumettre une nouvelle question :</span>
                          <div>
                            <input 
                              type="text"
                              required
                              value={concernTitle}
                              onChange={e => setConcernTitle(e.target.value)}
                              placeholder="Objet de votre préoccupation (ex: Clavier, Réseau)"
                              className={`w-full text-xs rounded-xl px-4 py-2 focus:outline-none ${
                                darkMode ? "bg-slate-900 border border-slate-800 text-slate-300" : "bg-slate-100 border border-slate-200 text-slate-850"
                              }`}
                            />
                          </div>
                          <div>
                            <textarea 
                              required
                              rows={2}
                              value={concernContent}
                              onChange={e => setConcernContent(e.target.value)}
                              placeholder="Détaillez clairement votre question ou le souci rencontré..."
                              className={`w-full text-xs rounded-xl px-4 py-2 focus:outline-none ${
                                darkMode ? "bg-slate-900 border border-slate-800 text-slate-300" : "bg-slate-100 border border-slate-200 text-slate-850"
                              }`}
                            />
                          </div>
                          <button 
                            type="submit"
                            className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow"
                          >
                            Envoyer la préoccupation au Enseignant
                          </button>
                        </form>

                        {/* Submitted Concerns History */}
                        <div className="space-y-3">
                          <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Historique de vos requêtes :</h4>
                          {(() => {
                            const myConcerns = studentConcerns.filter(c => c.studentId === profile.id);
                            if (myConcerns.length === 0) {
                              return <p className="text-slate-500 text-xs italic">Vous n'avez soumis aucun problème.</p>;
                            }

                            return myConcerns.map(c => (
                              <div key={c.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-850">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-bold text-white">{c.title}</span>
                                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold font-mono uppercase ${
                                    c.status === "pending" ? "bg-amber-500/10 text-amber-400" : "bg-emerald-500/10 text-emerald-400"
                                  }`}>
                                    {c.status === "pending" ? "En attente" : "Résolu"}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">{c.content}</p>
                                
                                {c.response && (
                                  <div className="mt-2.5 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-xs">
                                    <span className="font-extrabold text-emerald-400 block text-[9px] uppercase font-mono">Réponse du Enseignant :</span>
                                    <p className="text-slate-300 mt-0.5">{c.response}</p>
                                  </div>
                                )}
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stats grid */}
                <div className="grid md:grid-cols-3 gap-6">
                  {/* XP Level up box */}
                  <div className={`p-6 rounded-3xl border flex flex-col justify-between ${
                    darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                  }`}>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide block">Série & Progression</span>
                      <h4 className="text-lg font-extrabold mt-1">Niveau Académique</h4>
                    </div>

                    <div className="my-4">
                      <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                        <span>XP actuel : {profile.xpPoints} XP</span>
                        <span>Objectif : {(profile.level + 1) * 200} XP</span>
                      </div>
                      <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                        <div 
                          className="bg-indigo-500 h-full transition-all duration-300"
                          style={{ width: `${Math.min((profile.xpPoints / ((profile.level + 1) * 200)) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quizzes succeeded */}
                  <div className={`p-6 rounded-3xl border flex flex-col justify-between ${
                    darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                  }`}>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide block">Évaluations</span>
                      <h4 className="text-lg font-extrabold mt-1">Quiz Validés</h4>
                    </div>
                    <div className="my-4 flex items-center justify-between">
                      <span className="text-3xl font-mono font-black text-indigo-400">
                        {Object.keys(profile.completedQuizzes).length} / 12
                      </span>
                      <span className="text-xs text-slate-500 font-bold uppercase">Syllabus RDC</span>
                    </div>
                  </div>

                  {/* Exercises completed */}
                  <div className={`p-6 rounded-3xl border flex flex-col justify-between ${
                    darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                  }`}>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide block">Manipulations</span>
                      <h4 className="text-lg font-extrabold mt-1">Travaux Pratiques</h4>
                    </div>
                    <div className="my-4 flex items-center justify-between">
                      <span className="text-3xl font-mono font-black text-indigo-400">
                        {Object.keys(profile.completedExercises).length} / 12
                      </span>
                      <span className="text-xs text-slate-500 font-bold uppercase">Labs Virtuels</span>
                    </div>
                  </div>
                </div>

                {/* Badges and Certifications Panel */}
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Badges Box */}
                  <div className={`p-6 rounded-3xl border ${
                    darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                  }`}>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      Mes Badges de Mérite scolaires
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                      {badgesList.map(badge => {
                        const isUnlocked = profile.xpPoints >= badge.xpRequired;
                        return (
                          <div 
                            key={badge.id}
                            className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                              isUnlocked 
                                ? "bg-slate-950/80 border-indigo-500/20 text-white" 
                                : "bg-slate-950/20 border-slate-800/40 opacity-40 text-slate-500"
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${
                              isUnlocked ? "bg-indigo-500/10 text-indigo-400" : "bg-slate-800 text-slate-600"
                            }`}>
                              <Trophy className="w-4 h-4" />
                            </div>
                            <div className="overflow-hidden">
                              <span className="text-xs font-bold block truncate">{badge.title}</span>
                              <span className="text-[9px] block text-slate-400 font-mono">Requis: {badge.xpRequired} XP</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Certifications Box */}
                  <div className={`p-6 rounded-3xl border ${
                    darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                  }`}>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-400" />
                      Certificats de Compétence Éducatifs (EPST)
                    </h3>

                    {profile.xpPoints >= 300 ? (
                      <div className="space-y-3">
                        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Award className="w-8 h-8 text-indigo-400" />
                            <div>
                              <h4 className="text-xs font-bold text-white">Brevet de Maîtrise des TIC 7ème</h4>
                              <p className="text-[10px] text-slate-500">Délivré par le Portail National d'Apprentissage</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setActiveCertForView(generateCertificate("brevet"))}
                            className="py-1.5 px-3 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px]"
                          >
                            Consulter / Imprimer
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500 text-xs">
                        <Lock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                        <p>Atteins 300 XP en terminant des leçons et des quiz pour débloquer ton Brevet officiel de réussite.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* --- VIEW: SPACE DE TRAVAIL PROFESSEUR --- */}
            {activeTab === "teacher_workspace" && profile.role === "student" && (
              <div className="space-y-6">
                {/* Header banner */}
                <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-950 rounded-3xl p-6 lg:p-8 text-white relative overflow-hidden border border-slate-800 shadow-2xl animate-fade-in">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <GraduationCap className="w-40 h-40" />
                  </div>
                  <div className="relative z-10">
                    <span className="text-[10px] text-emerald-400 font-mono font-bold block uppercase tracking-wider mb-1">
                      Salle de Classe Virtuelle & Travaux
                    </span>
                    <h3 className="text-xl lg:text-3xl font-black tracking-tight">
                      Espace de Travail Enseignant
                    </h3>
                    <p className="text-xs text-slate-300 mt-2 max-w-xl leading-relaxed">
                      Accédez aux cours personnalisés, travaux pratiques (TP), devoirs de maison et exercices en ligne publiés par votre enseignant. Travaillez en toute autonomie et recevez des corrections de l'enseignant ou de son assistant IA.
                    </p>
                  </div>
                </div>

                {!profile.teacherCode ? (
                  /* ONBOARDING: CONNECT TO CLASS */
                  <div className={`p-6 lg:p-8 rounded-3xl border transition-all ${
                    darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                  }`}>
                    <div className="max-w-md mx-auto text-center space-y-6 py-8">
                      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-900/15">
                        <Key className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">Rejoindre la classe virtuelle de votre Enseignant</h4>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                          Saisissez la clé d'accès unique fournie par votre professeur pour vous connecter, accéder aux devoirs, TP, cours et démarrer vos travaux scolaires.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={tempTeacherCodeInput}
                            onChange={e => setTempTeacherCodeInput(e.target.value)}
                            placeholder="Ex: PROF-XXXXXX"
                            className="flex-grow rounded-xl px-4 py-3 text-sm font-mono text-center focus:outline-none bg-slate-950 border border-slate-800 text-slate-200 focus:border-emerald-500"
                          />
                          <button 
                            onClick={() => {
                              const cleanKey = tempTeacherCodeInput.trim().toUpperCase();
                              if (cleanKey === teacherAccessKey) {
                                setTeacherConnectedSpace("Classe de 7ème A - Prof. Mubenga");
                                setProfile(prev => {
                                  const once = prev.connectedOnceTeachers || [];
                                  const updatedOnce = once.includes(cleanKey) ? once : [...once, cleanKey];
                                  return {
                                    ...prev,
                                    teacherCode: cleanKey,
                                    connectedOnceTeachers: updatedOnce
                                  };
                                });
                                setTempTeacherCodeInput("");
                                setNotifications(prev => [
                                  {
                                    id: "workspace_notif_" + Math.random(),
                                    title: "📚 Bienvenue dans votre classe !",
                                    content: "Vous avez rejoint avec succès l'Espace Professeur. Vos cours et devoirs sont synchronisés !",
                                    type: "system",
                                    date: new Date().toISOString().split('T')[0],
                                    read: false
                                  },
                                  ...prev
                                ]);
                              } else if (cleanKey.startsWith("PROF-") && cleanKey.length >= 8) {
                                setTeacherConnectedSpace("Classe Connectée (Clé Active)");
                                setProfile(prev => ({
                                  ...prev,
                                  teacherCode: cleanKey,
                                  connectedOnceTeachers: [...(prev.connectedOnceTeachers || []), cleanKey]
                                }));
                                setTempTeacherCodeInput("");
                              } else {
                                alert("Clé d'accès de classe invalide. Veuillez saisir la bonne clé (Ex: " + teacherAccessKey + ")");
                              }
                            }}
                            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md font-mono animate-pulse"
                          >
                            Rejoindre
                          </button>
                        </div>
                        
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 text-left">
                          <span className="text-[9px] font-mono font-black text-emerald-400 block uppercase mb-1">Mode Démonstration :</span>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            Pour tester instantanément la classe virtuelle en cours, utilisez la clé active de démonstration : 
                            <button 
                              onClick={() => setTempTeacherCodeInput(teacherAccessKey)}
                              className="mx-1.5 px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-bold font-mono text-[10px] select-all cursor-pointer"
                            >
                              {teacherAccessKey}
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* CLASS CONNECTED VIEW */
                  <div className="space-y-6">
                    {/* Active class banner bar */}
                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 font-bold uppercase font-mono block">Statut : Classe Active</span>
                          <h4 className="text-sm font-bold text-white">{teacherConnectedSpace || "Espace Classe Virtuelle"}</h4>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-slate-500 font-bold bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                          Code Professeur : {profile.teacherCode}
                        </span>
                        <button 
                          onClick={() => {
                            setTeacherConnectedSpace(null);
                            setProfile(prev => ({ ...prev, teacherCode: undefined }));
                          }}
                          className="text-[10px] font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/15 px-3 py-1.5 rounded-xl transition-all"
                        >
                          Quitter la classe
                        </button>
                      </div>
                    </div>

                    {/* Sub tabs: 1. Cours & Documents, 2. Devoirs & Travaux */}
                    <div className="flex border-b border-slate-850 gap-1 pb-px">
                      <button 
                        onClick={() => {
                          setWorkspaceSubTab("publications_lessons");
                          setSelectedTeacherLesson(null);
                          setSelectedTeacherPub(null);
                        }}
                        className={`px-5 py-3 text-xs font-bold transition-all relative ${
                          workspaceSubTab === "publications_lessons" 
                            ? "text-emerald-400 border-b-2 border-emerald-500" 
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        📚 Cours & Publications Enseignant
                      </button>
                      <button 
                        onClick={() => {
                          setWorkspaceSubTab("tasks");
                          setSelectedTeacherLesson(null);
                          setSelectedTeacherPub(null);
                        }}
                        className={`px-5 py-3 text-xs font-bold transition-all relative flex items-center gap-2 ${
                          workspaceSubTab === "tasks" 
                            ? "text-emerald-400 border-b-2 border-emerald-500" 
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        📝 Travaux, TP & Devoirs
                        {(() => {
                          const count = homeworkList.filter(hw => hw.teacherCode === profile.teacherCode).length;
                          const submittedCount = homeworkSubmissions.filter(sub => sub.teacherCode === profile.teacherCode && sub.studentId === profile.id).length;
                          const pending = count - submittedCount;
                          return pending > 0 ? (
                            <span className="bg-amber-500 text-slate-950 font-black font-mono px-1.5 py-0.5 text-[8px] rounded-full">
                              {pending}
                            </span>
                          ) : null;
                        })()}
                      </button>
                    </div>

                    {/* SUB-VIEW 1: COURS & PUBLICATIONS ENSEIGNANT */}
                    {workspaceSubTab === "publications_lessons" && (
                      <div className="space-y-6">
                        {selectedTeacherLesson ? (
                          /* Detailed Custom Lesson Reading View */
                          <div className={`p-6 lg:p-8 rounded-3xl border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                            <button 
                              onClick={() => setSelectedTeacherLesson(null)}
                              className="text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1.5 mb-6"
                            >
                              <ArrowLeft className="w-4 h-4" />
                              Retourner aux publications
                            </button>

                            <div className="border-b border-slate-800 pb-5 mb-6">
                              <span className="text-[9px] text-emerald-400 font-bold font-mono uppercase bg-emerald-500/10 px-2 py-0.5 rounded">Leçon Personnalisée</span>
                              <h3 className="text-2xl font-black text-white mt-2">{selectedTeacherLesson.title}</h3>
                              <span className="text-xs text-slate-400 mt-1 block">Catégorie : {selectedTeacherLesson.category} | Niveau : {selectedTeacherLesson.level}</span>
                            </div>

                            <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
                              {/* Objectives */}
                              {selectedTeacherLesson.objectives && selectedTeacherLesson.objectives.length > 0 && (
                                <div className="p-4 rounded-xl bg-slate-950 border border-slate-850">
                                  <h4 className="font-bold text-white mb-2 uppercase text-[10px] font-mono text-emerald-400">Objectifs d'apprentissage :</h4>
                                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                                    {selectedTeacherLesson.objectives.map((obj, index) => (
                                      <li key={index}>{obj}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Content sections */}
                              <div className="space-y-5">
                                {selectedTeacherLesson.contentSections?.map((sec, index) => (
                                  <div key={index} className="space-y-2">
                                    <h4 className="text-sm font-bold text-white border-l-2 border-emerald-500 pl-2.5">{sec.title}</h4>
                                    <p className="whitespace-pre-wrap">{sec.body}</p>
                                    {sec.bullets && (
                                      <ul className="list-disc list-inside pl-4 space-y-1">
                                        {sec.bullets.map((b, bIdx) => <li key={bIdx}>{b}</li>)}
                                      </ul>
                                    )}
                                  </div>
                                ))}
                              </div>

                              {/* Summary */}
                              {selectedTeacherLesson.summary && selectedTeacherLesson.summary.length > 0 && (
                                <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/15">
                                  <h4 className="font-bold text-indigo-300 mb-2 uppercase text-[10px] font-mono">En résumé / Ce qu'il faut retenir :</h4>
                                  <ul className="list-decimal list-inside space-y-1">
                                    {selectedTeacherLesson.summary.map((sum, index) => (
                                      <li key={index}>{sum}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : selectedTeacherPub ? (
                          /* Detailed Publication Reading View */
                          <div className={`p-6 lg:p-8 rounded-3xl border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                            <button 
                              onClick={() => setSelectedTeacherPub(null)}
                              className="text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1.5 mb-6"
                            >
                              <ArrowLeft className="w-4 h-4" />
                              Retourner aux publications
                            </button>

                            <div className="border-b border-slate-800 pb-5 mb-6">
                              <span className={`text-[9px] font-bold font-mono uppercase px-2 py-0.5 rounded ${
                                selectedTeacherPub.category === "Cours" ? "bg-emerald-500/10 text-emerald-400" :
                                selectedTeacherPub.category === "TP" ? "bg-cyan-500/10 text-cyan-400" : "bg-amber-500/10 text-amber-400"
                              }`}>
                                {selectedTeacherPub.category}
                              </span>
                              <h3 className="text-xl lg:text-2xl font-black text-white mt-2">{selectedTeacherPub.title}</h3>
                              <span className="text-xs text-slate-400 mt-1 block">Publié le {selectedTeacherPub.date} par {selectedTeacherPub.teacherName}</span>
                            </div>

                            <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-950/40 p-5 rounded-2xl border border-slate-850">
                              {selectedTeacherPub.content}
                            </p>

                            {/* Live Reaction Section */}
                            <div className="mt-6 pt-5 border-t border-slate-850/60 flex items-center gap-3">
                              <span className="text-xs text-slate-400 font-bold">Votre niveau de compréhension :</span>
                              {(() => {
                                const reacts = lessonReactions.filter(r => r.pubId === selectedTeacherPub.id);
                                const liked = reacts.some(r => r.studentId === profile.id && r.type === "like");
                                const notUnderstood = reacts.some(r => r.studentId === profile.id && r.type === "not_understood");

                                return (
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => handleToggleReaction(selectedTeacherPub.id, selectedTeacherPub.title, "like")}
                                      className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                                        liked ? "bg-emerald-600 text-white shadow" : "bg-slate-950 hover:bg-slate-900 text-slate-400 border border-slate-850"
                                      }`}
                                    >
                                      👍 J'aime ({reacts.filter(r => r.type === "like").length})
                                    </button>
                                    <button 
                                      onClick={() => handleToggleReaction(selectedTeacherPub.id, selectedTeacherPub.title, "not_understood")}
                                      className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                                        notUnderstood ? "bg-amber-600 text-white shadow" : "bg-slate-950 hover:bg-slate-900 text-slate-400 border border-slate-850"
                                      }`}
                                    >
                                      🤔 Pas compris ({reacts.filter(r => r.type === "not_understood").length})
                                    </button>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        ) : (
                          /* Publications lists */
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Main Feed: Publications from the connected teacher */}
                            <div className="lg:col-span-8 space-y-4">
                              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
                                <Activity className="w-4 h-4 text-emerald-400" />
                                Flux d'activités & Cours de la classe
                              </h4>

                              {(() => {
                                const pubs = teacherPublications.filter(p => p.teacherCode === profile.teacherCode);
                                if (pubs.length === 0) {
                                  return (
                                    <div className="p-8 rounded-3xl bg-slate-950 border border-slate-900 text-center text-xs space-y-2">
                                      <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
                                      <p className="text-slate-400 font-medium">Aucun cours ou annonce publié dans ce flux pour le moment.</p>
                                    </div>
                                  );
                                }

                                return (
                                  <div className="space-y-4">
                                    {pubs.map(pub => {
                                      const reactionsCount = lessonReactions.filter(r => r.pubId === pub.id && r.type === "like").length;
                                      const notUnderstoodCount = lessonReactions.filter(r => r.pubId === pub.id && r.type === "not_understood").length;
                                      return (
                                        <div 
                                          key={pub.id} 
                                          className={`p-5 rounded-2xl border transition-all cursor-pointer hover:scale-[1.005] duration-200 ${
                                            darkMode ? "bg-slate-900 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200 hover:border-slate-300"
                                          }`}
                                          onClick={() => setSelectedTeacherPub(pub)}
                                        >
                                          <div className="flex justify-between items-start gap-2">
                                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono uppercase ${
                                              pub.category === "Cours" ? "bg-emerald-500/10 text-emerald-400" :
                                              pub.category === "TP" ? "bg-cyan-500/10 text-cyan-400" : "bg-amber-500/10 text-amber-400"
                                            }`}>
                                              {pub.category}
                                            </span>
                                            <span className="text-[10px] text-slate-500 font-mono font-medium">{pub.date}</span>
                                          </div>
                                          <h5 className="text-sm font-bold text-white mt-2.5 group-hover:text-emerald-400 transition-colors">{pub.title}</h5>
                                          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">{pub.content}</p>
                                          
                                          <div className="mt-4 pt-3 border-t border-slate-850/60 flex items-center gap-3 text-[10px] font-mono text-slate-400">
                                            <span className="flex items-center gap-1">👍 {reactionsCount}</span>
                                            <span className="flex items-center gap-1">🤔 {notUnderstoodCount}</span>
                                            <span className="text-emerald-400 font-bold ml-auto flex items-center gap-0.5">
                                              Consulter le contenu →
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              })()}
                            </div>

                            {/* Right Feed: Custom teacher-designed supplementary syllabus lessons */}
                            <div className="lg:col-span-4 space-y-4">
                              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
                                <Layers className="w-4 h-4 text-emerald-400" />
                                Leçons personnalisées ({customLessons.length})
                              </h4>

                              {customLessons.length === 0 ? (
                                <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-850 text-center text-xs text-slate-500 italic">
                                  Aucun cours personnalisé de soutien mis en ligne.
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  {customLessons.map(lesson => (
                                    <div 
                                      key={lesson.id}
                                      onClick={() => setSelectedTeacherLesson(lesson)}
                                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                                        darkMode ? "bg-slate-950/60 border-slate-850 hover:bg-slate-900" : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                                      }`}
                                    >
                                      <span className="text-[9px] font-bold font-mono text-indigo-400 uppercase">{lesson.category}</span>
                                      <h6 className="text-xs font-bold text-white mt-1 leading-snug">{lesson.title}</h6>
                                      <span className="text-[10px] text-emerald-400 block mt-2 font-mono hover:underline">Lire le cours →</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* SUB-VIEW 2: DEVOIRS, TP & EXERCICES EN LIGNE */}
                    {workspaceSubTab === "tasks" && (
                      <div className="space-y-6">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
                          <Edit3 className="w-4 h-4 text-emerald-400" />
                          Toutes les tâches assignées par votre enseignant
                        </h4>

                        {(() => {
                          const activeHomeworks = homeworkList.filter(hw => hw.teacherCode === profile.teacherCode);
                          if (activeHomeworks.length === 0) {
                            return (
                              <div className="p-10 rounded-3xl bg-slate-950 border border-slate-900 text-center text-xs space-y-2">
                                <AlertCircle className="w-8 h-8 text-slate-600 mx-auto" />
                                <p className="text-slate-400 font-medium">Aucun travail, devoir ou exercice n'est assigné pour le moment.</p>
                              </div>
                            );
                          }

                          return (
                            <div className="grid grid-cols-1 gap-6">
                              {activeHomeworks.map(hw => {
                                const submission = homeworkSubmissions.find(sub => sub.homeworkId === hw.id && sub.studentId === profile.id);
                                const isSelfGrading = studentSelfGradingLoading[hw.id];

                                return (
                                  <div 
                                    key={hw.id} 
                                    className={`p-5 lg:p-6 rounded-2xl border transition-all ${
                                      submission?.status === "graded" 
                                        ? "bg-slate-950/40 border-slate-900 opacity-90" 
                                        : "bg-slate-900/40 border-slate-800"
                                    }`}
                                  >
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/60 pb-4 mb-4">
                                      <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className={`px-2.5 py-0.5 rounded text-[9px] font-mono font-black uppercase ${
                                            hw.category === "Devoir" ? "bg-rose-500/10 text-rose-400" :
                                            hw.category === "TP" ? "bg-cyan-500/10 text-cyan-400" : "bg-emerald-500/10 text-emerald-400"
                                          }`}>
                                            {hw.category}
                                          </span>
                                          <span className="text-[10px] text-amber-500 font-mono font-bold">{hw.points} Points maximum</span>
                                        </div>
                                        <h5 className="text-base font-extrabold text-white">{hw.title}</h5>
                                      </div>
                                      
                                      <div className="text-left md:text-right text-[10px] text-slate-400 space-y-0.5 font-mono">
                                        <div>Publié le : {hw.date}</div>
                                        <div className="text-rose-400 font-bold">À rendre avant : {hw.dateLimit}</div>
                                      </div>
                                    </div>

                                    {/* Task Instruction / description */}
                                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-850/80 mb-4">
                                      <span className="text-[9px] uppercase font-bold text-slate-500 font-mono block mb-1">Consigne de l'enseignant :</span>
                                      <p className="text-xs text-slate-300 leading-relaxed italic">"{hw.description}"</p>
                                    </div>

                                    {/* Exercise precise Question */}
                                    <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/10 mb-5">
                                      <span className="text-[9px] uppercase font-mono font-black text-indigo-400 block">Question à traiter :</span>
                                      <p className="text-xs text-slate-100 font-semibold mt-1 leading-relaxed">{hw.question}</p>
                                    </div>

                                    {/* Homework Interaction & Submissions check */}
                                    {!submission ? (
                                      /* STUDENT CAN WORK AND SUBMIT */
                                      <div className="space-y-4">
                                        <div>
                                          <label className="block text-[10px] uppercase font-bold text-slate-400 font-mono mb-2">Saisir votre travail ou réponse :</label>
                                          <textarea 
                                            rows={4}
                                            value={homeworkAnswers[hw.id] || ""}
                                            onChange={e => setHomeworkAnswers(prev => ({ ...prev, [hw.id]: e.target.value }))}
                                            placeholder="Tapez votre réponse détaillée ici. Veillez à soigner l'orthographe et à bien argumenter..."
                                            className="w-full text-xs rounded-xl px-4 py-3 bg-slate-950 border border-slate-850 text-slate-200 focus:outline-none focus:border-emerald-500"
                                          />
                                        </div>

                                        {/* Drag & Drop simulated attachment */}
                                        <div className="p-4 border border-dashed border-slate-800 rounded-xl bg-slate-950/40 text-center space-y-2">
                                          <Upload className="w-5 h-5 text-slate-500 mx-auto animate-bounce" />
                                          <div className="text-xs">
                                            <span className="text-slate-400 font-bold">Glissez-déposez</span> votre fichier de travail ou <span className="text-indigo-400 underline cursor-pointer">parcourez vos fichiers</span>
                                          </div>
                                          <div className="text-[9px] text-slate-600 font-mono uppercase">Formats acceptés : PDF, DOCX, TXT, PNG, Max 10 Mo</div>
                                        </div>

                                        <button 
                                          onClick={() => {
                                            const ans = homeworkAnswers[hw.id]?.trim();
                                            if (!ans) {
                                              alert("Veuillez d'abord rédiger votre réponse avant de soumettre !");
                                              return;
                                            }
                                            handleSubmitHomework(hw.id, hw.title, hw.category);
                                          }}
                                          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/20"
                                        >
                                          <Send className="w-4 h-4" />
                                          Renvoyer le travail fini chez le professeur
                                        </button>
                                      </div>
                                    ) : (
                                      /* DISPLAY SUBMISSION & CORRECTION STATUS */
                                      <div className="p-4 rounded-xl border bg-slate-950/80 space-y-3">
                                        <div className="flex justify-between items-center border-b border-slate-850 pb-2.5">
                                          <span className="text-[9px] uppercase font-mono font-bold text-slate-500">Votre Copie Soumise</span>
                                          <span className="text-[10px] text-slate-500 font-mono">Envoyé le {submission.date}</span>
                                        </div>
                                        <p className="text-xs text-slate-200 font-medium italic bg-slate-900/60 p-3 rounded-xl border border-slate-850 leading-relaxed">
                                          "{submission.studentAnswer}"
                                        </p>

                                        {submission.status === "submitted" ? (
                                          <div className="space-y-3 pt-2">
                                            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-center gap-2">
                                              <Clock className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
                                              <div>
                                                <h6 className="font-bold text-amber-400">Travail en cours d'évaluation par l'enseignant</h6>
                                                <p className="text-[11px] text-slate-400 mt-0.5">Le professeur Mubenga ou son assistant pédagogique IA corrigera votre copie sous peu.</p>
                                              </div>
                                            </div>

                                            {/* AI Student-triggered Instant Self-Correction Tool! */}
                                            <div className="p-4 rounded-xl bg-indigo-950/10 border border-indigo-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                              <div className="space-y-1">
                                                <h6 className="text-xs font-bold text-indigo-300 flex items-center gap-1">
                                                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                                                  Tester la correction automatique de l'IA immédiatement ?
                                                </h6>
                                                <p className="text-[10px] text-slate-400">Permettez à l'IA de l'enseignant de pré-corriger votre copie en temps réel.</p>
                                              </div>
                                              <button 
                                                disabled={isSelfGrading}
                                                onClick={async () => {
                                                  setStudentSelfGradingLoading(prev => ({ ...prev, [hw.id]: true }));
                                                  try {
                                                    const ideal = hw.corregiType?.toLowerCase() || "";
                                                    const ans = submission.studentAnswer.toLowerCase();
                                                    let calculatedScore = Math.floor(hw.points * 0.6);
                                                    let calculatedComment = "L'élève a fourni une réponse correcte mais incomplète.";

                                                    if (ans.length > 5 && ideal.split(" ").some(w => w.length > 3 && ans.includes(w))) {
                                                      calculatedScore = Math.floor(hw.points * 0.9);
                                                      calculatedComment = "Excellent travail ! La réponse contient les mots-clés demandés et correspond au corrigé type de la leçon.";
                                                    } else if (ans.length < 5) {
                                                      calculatedScore = Math.floor(hw.points * 0.2);
                                                      calculatedComment = "Réponse trop courte ou incomplète. Veuillez approfondir le concept.";
                                                    }

                                                    // Use real api call if available to correct
                                                    try {
                                                      const resp = await fetch("/api/gemini/correct-homework", {
                                                        method: "POST",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify({
                                                          title: hw.title,
                                                          question: hw.question,
                                                          corregiType: hw.corregiType,
                                                          points: hw.points,
                                                          studentAnswer: submission.studentAnswer
                                                        })
                                                      });
                                                      const data = await resp.json();
                                                      if (resp.ok && data.grade !== undefined) {
                                                        calculatedScore = data.grade;
                                                        calculatedComment = data.comment || calculatedComment;
                                                      }
                                                    } catch (e) {
                                                      console.log("Using local simulated AI model correction...");
                                                    }

                                                    // Update submission with grade
                                                    setHomeworkSubmissions(prev => prev.map(s => 
                                                      s.id === submission.id 
                                                        ? { ...s, status: "graded", grade: calculatedScore, comment: calculatedComment, correctedBy: "ia" } 
                                                        : s
                                                    ));

                                                    // Also write to validated grades
                                                    const newGrade: ValidatedGrade = {
                                                      id: "grd_" + Math.random().toString(36).substr(2, 9),
                                                      submissionId: submission.id,
                                                      studentId: submission.studentId,
                                                      studentName: submission.studentName,
                                                      homeworkId: hw.id,
                                                      homeworkTitle: hw.title,
                                                      homeworkCategory: hw.category,
                                                      grade: calculatedScore,
                                                      maxPoints: hw.points,
                                                      comment: calculatedComment,
                                                      sentStatus: "sent",
                                                      published: true
                                                    };
                                                    setValidatedGrades(prev => [...prev.filter(g => g.submissionId !== submission.id), newGrade]);

                                                    alert("L'assistant IA a corrigé votre copie ! Votre note a été publiée.");
                                                  } catch (err) {
                                                    console.error(err);
                                                  } finally {
                                                    setStudentSelfGradingLoading(prev => ({ ...prev, [hw.id]: false }));
                                                  }
                                                }}
                                                className="py-1.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-[10px] whitespace-nowrap self-stretch sm:self-auto flex items-center justify-center gap-1.5 transition-all shadow-md"
                                              >
                                                {isSelfGrading ? (
                                                  <>
                                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                                    IA Évalue...
                                                  </>
                                                ) : (
                                                  <>
                                                    <Sparkles className="w-3 h-3" />
                                                    Lancer la correction IA
                                                  </>
                                                )}
                                              </button>
                                            </div>
                                          </div>
                                        ) : (
                                          /* GRADED COPY */
                                          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                                            <div className="flex justify-between items-center border-b border-emerald-500/10 pb-2 mb-2">
                                              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                                                <CheckCircle className="w-4 h-4" />
                                                Correction Validée
                                              </span>
                                              <span className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-400 font-mono font-black text-sm">
                                                Note : {submission.grade} / {hw.points}
                                              </span>
                                            </div>
                                            <div className="space-y-1.5">
                                              <span className="text-[9px] uppercase font-mono font-bold text-slate-500 block">
                                                Commentaire pédagogique de l'évaluateur {submission.correctedBy === "ia" ? "(Automatisé par l'IA)" : "(Enseignant)"} :
                                              </span>
                                              <p className="text-slate-200 font-medium leading-relaxed italic">
                                                "{submission.comment || "Excellent effort de recherche, continuez ainsi !"}"
                                              </p>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* --- VIEW 2 : LESSONS LIST & SEARCH --- */}
            {activeTab === "lessons" && !selectedLesson && profile.role === "student" && (
              <div className="space-y-6">
                
                {/* Categories filtering bar */}
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedCategory === cat 
                          ? "bg-indigo-600 text-white" 
                          : darkMode ? "bg-slate-900 border-slate-850 hover:bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Syllabus lessons list */}
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredLessons.map(lesson => {
                    const isFav = profile.favoriteLessons.includes(lesson.id);
                    const score = profile.completedQuizzes[lesson.id];
                    return (
                      <div 
                        key={lesson.id}
                        className={`p-6 rounded-3xl border flex flex-col justify-between transition-all duration-300 relative group ${
                          darkMode ? "bg-slate-900 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                        }`}
                      >
                        {/* Favorite button */}
                        <button 
                          onClick={() => handleToggleFavorite(lesson.id)}
                          className={`absolute top-6 right-6 p-2 rounded-full border transition-all duration-300 shadow-md z-10 flex items-center justify-center ${
                            isFav 
                              ? darkMode
                                ? "bg-amber-400/10 border-amber-400/40 text-amber-400 hover:bg-amber-400/20 scale-110"
                                : "bg-amber-500/15 border-amber-500/40 text-amber-600 hover:bg-amber-500/25 scale-110"
                              : darkMode 
                                ? "bg-slate-950/80 border-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-900" 
                                : "bg-white/90 border-slate-200 text-slate-450 hover:text-amber-500 hover:bg-slate-50 shadow-sm"
                          }`}
                          title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
                        >
                          <Star className={`w-4.5 h-4.5 ${isFav ? (darkMode ? 'fill-amber-400 text-amber-400' : 'fill-amber-500 text-amber-500') : ''}`} />
                        </button>

                        <div>
                          {lesson.imageUrl && (
                            <div 
                              onClick={() => {
                                setSelectedLesson(lesson);
                                setLessonActiveTab("cours");
                              }}
                              className={`w-full aspect-[21/9] rounded-2xl overflow-hidden mb-4 border cursor-pointer relative ${
                                darkMode ? "border-slate-800/80" : "border-slate-100"
                              }`}
                            >
                              <img 
                                src={lesson.imageUrl} 
                                alt={lesson.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}
                          <span className={`text-[10px] font-mono font-bold block uppercase tracking-wider mb-2 ${
                            darkMode ? "text-indigo-400" : "text-indigo-600"
                          }`}>
                            Syllabus • {lesson.category}
                          </span>
                          <h3 
                            onClick={() => {
                              setSelectedLesson(lesson);
                              setLessonActiveTab("cours");
                            }}
                            className={`text-lg font-bold mb-2 cursor-pointer transition-colors ${
                              darkMode ? "text-white hover:text-indigo-400" : "text-slate-900 hover:text-indigo-650"
                            }`}
                          >
                            {lesson.title}
                          </h3>
                          <p className={`text-xs line-clamp-2 leading-relaxed mb-4 ${
                            darkMode ? "text-slate-400" : "text-slate-600"
                          }`}>
                            Objectifs: {lesson.objectives.join(" | ")}
                          </p>
                        </div>

                        {/* Lesson status bar */}
                        <div className={`flex items-center justify-between border-t pt-4 mt-4 ${
                          darkMode ? "border-slate-800/80" : "border-slate-100"
                        }`}>
                          <div className={`flex items-center gap-1.5 text-[10px] font-mono ${
                            darkMode ? "text-slate-500" : "text-slate-400"
                          }`}>
                            <Clock className="w-3.5 h-3.5" />
                            <span>Syllabus National</span>
                          </div>

                          <div className="flex gap-2">
                            {score !== undefined && (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[9px] font-mono border border-emerald-500/20">
                                Validé ({score}%)
                              </span>
                            )}
                            <button 
                              onClick={() => {
                                setSelectedLesson(lesson);
                                setLessonActiveTab("cours");
                              }}
                              className="py-1.5 px-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px]"
                            >
                              Ouvrir le cours
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* --- VIEW 3 : CHAT TUTOR (EDUCOMPAGNON) --- */}
            {activeTab === "tutor" && profile.role === "student" && (
              <div className={`h-[70vh] rounded-3xl border flex flex-col justify-between overflow-hidden ${
                darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
              }`}>
                {/* Chat Top Banner */}
                <div className={`p-4 border-b flex items-center justify-between shrink-0 ${
                  darkMode ? "bg-indigo-950/40 border-slate-800" : "bg-indigo-50/50 border-indigo-100"
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      darkMode ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-600/10 text-indigo-600"
                    }`}>
                      <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
                    </div>
                    <div>
                      <h3 className={`text-sm font-extrabold ${darkMode ? "text-white" : "text-slate-950"}`}>EduCompagnon AI Tutor</h3>
                      <p className={`text-[10px] ${darkMode ? "text-slate-500" : "text-slate-600"}`}>Enseignant Virtuel spécialisé en Informatique - 7ème Année RDC</p>
                    </div>
                  </div>
                </div>

                {/* Conversation Thread */}
                <div className={`flex-grow p-6 overflow-y-auto space-y-4 ${
                  darkMode ? "bg-slate-950" : "bg-slate-50"
                }`}>
                  {/* Tutorial Welcome Banner if no chat yet */}
                  {tutorMessages.length <= 1 && (
                    <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 mb-4 ${
                      darkMode 
                        ? "bg-indigo-950/20 border-indigo-500/10 text-slate-300" 
                        : "bg-indigo-50/60 border-indigo-200 text-indigo-950"
                    }`}>
                      <p className="font-bold text-[13px] text-indigo-500">👋 Apprendre les procédures avec l'IA</p>
                      <p>
                        Besoin de savoir comment faire une action sur l'ordinateur ? L'IA peut te donner la **procédure étape par étape** (avec des raccourcis clavier et astuces). Pose-lui simplement ta question en utilisant les boutons ci-dessous ou en écrivant ton propre texte !
                      </p>
                    </div>
                  )}

                  {tutorMessages.map((msg, idx) => (
                    <div 
                      key={idx}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-md rounded-2xl p-4 text-xs leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-indigo-600 text-white shadow-sm"
                          : darkMode
                            ? "bg-slate-900 border border-slate-800 text-slate-200"
                            : "bg-white border border-slate-200 text-slate-800 shadow-sm"
                      }`}>
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                      </div>
                    </div>
                  ))}
                  {tutorLoading && (
                    <div className="flex justify-start">
                      <div className={`rounded-2xl p-4 text-xs animate-pulse ${
                        darkMode ? "bg-slate-900 border border-slate-800 text-slate-400" : "bg-white border border-slate-200 text-slate-500 shadow-sm"
                      }`}>
                        EduCompagnon prépare tes étapes simples...
                      </div>
                    </div>
                  )}
                </div>

                {/* Suggestion & Input Panel */}
                <div className={`p-4 border-t flex flex-col gap-3 shrink-0 ${
                  darkMode ? "border-slate-800/85 bg-slate-900/60" : "border-slate-200 bg-slate-50"
                }`}>
                  {/* Quick-access procedure questions */}
                  <div className="flex flex-col gap-1.5">
                    <span className={`text-[10px] font-mono uppercase font-bold tracking-wider ${
                      darkMode ? "text-indigo-400" : "text-indigo-600"
                    }`}>
                      💡 Cliquer pour demander une procédure pratique :
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: "📁 Créer un dossier", query: "Donne-moi la procédure étape par étape pour créer un dossier sur le bureau." },
                        { label: "✏️ Renommer un fichier", query: "Quelle est la procédure pas à pas pour renommer un fichier ou dossier ?" },
                        { label: "📋 Copier-coller du texte", query: "Peux-tu m'expliquer la procédure pour copier et coller ?" },
                        { label: "🔌 Démarrer l'ordinateur", query: "Quelle est la procédure correcte pour allumer et démarrer un ordinateur ?" }
                      ].map((item, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSendTutorMessage(undefined, item.query)}
                          disabled={tutorLoading}
                          className={`text-[10px] font-medium px-2.5 py-1 rounded-full border transition-all duration-250 ${
                            darkMode
                              ? "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Chat input box */}
                  <form onSubmit={(e) => handleSendTutorMessage(e)} className="flex gap-3">
                    <input 
                      type="text" 
                      value={userChatInput}
                      onChange={e => setUserChatInput(e.target.value)}
                      placeholder="Pose ta question ou demande une procédure (ex: 'procédure pour...')"
                      className={`flex-grow border rounded-xl px-4 py-2.5 text-xs focus:outline-none ${
                        darkMode 
                          ? "bg-slate-950 border-slate-850 text-slate-300 focus:border-indigo-500" 
                          : "bg-white border-slate-250 text-slate-900 focus:border-indigo-600 shadow-inner"
                      }`}
                    />
                    <button 
                      type="submit"
                      disabled={tutorLoading}
                      className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* --- VIEW 4 : SINGLE LESSON DETAIL VIEW --- */}
            {selectedLesson && (
              <div className="space-y-6">
                
                {/* Header Back button */}
                <button 
                  onClick={() => setSelectedLesson(null)}
                  className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1.5 border border-slate-700"
                >
                  <ArrowLeft className="w-4 h-4" /> Retour aux cours
                </button>

                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Left Column: Lesson Content */}
                  <div className="flex-grow space-y-6 max-w-4xl">
                    
                    {/* Lesson Banner */}
                    <div className={`bg-gradient-to-br p-6 rounded-3xl border relative ${
                      darkMode 
                        ? "from-indigo-950/60 to-slate-900/80 border-indigo-500/10" 
                        : "from-indigo-50 to-indigo-100/50 border-indigo-200"
                    }`}>
                      <div className="pr-12">
                        <span className={`text-[10px] font-mono font-bold block uppercase mb-1 ${
                          darkMode ? "text-indigo-400" : "text-indigo-600"
                        }`}>
                          LEÇON DU PROGRAMME OFFICIEL RDC
                        </span>
                        <h2 className={`text-2xl font-extrabold mb-2 ${
                          darkMode ? "text-white" : "text-slate-900"
                        }`}>{selectedLesson.title}</h2>
                        <div className={`flex flex-wrap items-center gap-3 mt-4 text-[10px] font-mono ${
                          darkMode ? "text-slate-400" : "text-slate-500"
                        }`}>
                          <span className={`px-2.5 py-0.5 rounded font-bold uppercase border ${
                            darkMode ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-white border-indigo-200 text-indigo-700"
                          }`}>
                            {selectedLesson.category}
                          </span>
                          <span>Matière : Informatique MTIC</span>
                        </div>
                      </div>

                      {/* Favorite button inside active lesson header */}
                      <button 
                        onClick={() => handleToggleFavorite(selectedLesson.id)}
                        className={`absolute top-6 right-6 p-2.5 rounded-full border transition-all duration-300 shadow-md flex items-center justify-center ${
                          profile.favoriteLessons.includes(selectedLesson.id)
                            ? darkMode
                              ? "bg-amber-400/10 border-amber-400/40 text-amber-400 scale-110 shadow-amber-500/10" 
                              : "bg-amber-500/15 border-amber-500/40 text-amber-600 scale-110 shadow-amber-500/10" 
                            : darkMode 
                              ? "bg-slate-950/80 border-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-900" 
                              : "bg-white/95 border-slate-200 text-slate-450 hover:text-amber-500 hover:bg-slate-50"
                        }`}
                        title={profile.favoriteLessons.includes(selectedLesson.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                      >
                        <Star className={`w-5 h-5 ${profile.favoriteLessons.includes(selectedLesson.id) ? (darkMode ? 'fill-amber-400 text-amber-400' : 'fill-amber-500 text-amber-500') : ''}`} />
                      </button>
                    </div>

                    {/* Lesson Navigation Tabs */}
                    <div className="flex gap-2 border-b border-slate-800 pb-2">
                      {[
                        { id: "cours", name: "Cours Complet" },
                        { id: "videos", name: "Vidéos de la Leçon" },
                        { id: "quiz", name: "Quiz Interactif" },
                        { id: "ressources", name: "Fiches de téléchargement" }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setLessonActiveTab(tab.id as any)}
                          className={`px-4 py-2 text-xs font-bold transition-all rounded-lg ${
                            lessonActiveTab === tab.id 
                              ? "bg-indigo-600 text-white" 
                              : "text-slate-400 hover:bg-slate-900"
                          }`}
                        >
                          {tab.name}
                        </button>
                      ))}
                    </div>

                    {/* TAB CONTENTS */}
                    
                    {/* A. Cours */}
                    {lessonActiveTab === "cours" && (
                      <div className="space-y-6">
                        {/* Lesson Illustrative Image */}
                        {selectedLesson.imageUrl && (
                          <div className="border border-slate-800 bg-slate-900/40 p-2.5 rounded-3xl overflow-hidden space-y-2">
                            <img 
                              src={selectedLesson.imageUrl} 
                              alt={selectedLesson.title} 
                              className="w-full aspect-[16/9] object-cover rounded-2xl border border-slate-800/50"
                              referrerPolicy="no-referrer"
                            />
                            <p className="text-[10px] text-slate-400 font-mono text-center italic">
                              Schéma d'illustration : {selectedLesson.title}
                            </p>
                          </div>
                        )}

                        {/* Objectives card */}
                        <div className="bg-indigo-950/20 border border-indigo-800/20 p-6 rounded-2xl">
                          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono mb-3">
                            🎯 Objectifs de la Leçon (Points à maîtriser)
                          </h4>
                          <ul className="list-disc list-inside text-xs text-slate-300 space-y-2">
                            {selectedLesson.objectives.map((obj, i) => (
                              <li key={i}>{obj}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Curriculum Content Sections */}
                        <div className="space-y-6 text-slate-300 leading-relaxed text-xs">
                          {selectedLesson.contentSections.map((section, idx) => (
                            <div key={idx} className="space-y-3">
                              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-1">
                                {section.title}
                              </h3>
                              <p>{section.body}</p>
                              {section.bullets && (
                                <ul className="list-disc list-inside space-y-1.5 pl-4 text-slate-400">
                                  {section.bullets.map((b, i) => (
                                    <li key={i}>{b}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Practical simulation Exercise launcher */}
                        <div className="border border-slate-800 rounded-2xl p-6 bg-slate-900/60 mt-8 space-y-4">
                          <div className="flex items-center gap-3">
                            <Monitor className="w-10 h-10 text-indigo-400" />
                            <div>
                              <h4 className="text-sm font-bold text-white">Laboratoire Pratique Virtuel</h4>
                              <p className="text-[10px] text-slate-500">Mettez en pratique vos connaissances dans un environnement virtuel</p>
                            </div>
                          </div>
                          
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {selectedLesson.exercises[0].description}
                          </p>

                          <button 
                            onClick={() => {
                              setActiveLabExercise({
                                id: selectedLesson.exercises[0].id,
                                instructions: selectedLesson.exercises[0].instructions,
                                validationRule: selectedLesson.exercises[0].validationRule
                              });
                            }}
                            className="py-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
                          >
                            <Monitor className="w-4 h-4" /> Lancer l'exercice virtuel (+100 XP)
                          </button>
                        </div>
                      </div>
                    )}

                    {/* B. Videos */}
                    {lessonActiveTab === "videos" && (
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          {selectedLesson.videos.map(video => {
                            const isPlaying = playingVideoId === video.id;
                            const ytMatch = video.type === "youtube" ? video.url.match(/embed\/([^/?#]+)/) : null;
                            const ytId = ytMatch ? ytMatch[1] : null;
                            const thumbnailUrl = ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : null;

                            return (
                              <div 
                                key={video.id}
                                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-4 space-y-3 group"
                              >
                                <div className="bg-slate-950 aspect-video rounded-xl flex items-center justify-center text-slate-600 relative overflow-hidden">
                                  {isPlaying ? (
                                    video.type === "youtube" ? (
                                      <iframe 
                                        src={`${video.url}${video.url.includes('?') ? '&' : '?'}autoplay=1`}
                                        title={video.title} 
                                        className="w-full h-full rounded-xl absolute inset-0 border-0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                        allowFullScreen
                                        referrerPolicy="no-referrer"
                                      ></iframe>
                                    ) : (
                                      <video 
                                        src={video.url} 
                                        controls 
                                        autoPlay 
                                        className="w-full h-full rounded-xl absolute inset-0 bg-black"
                                      />
                                    )
                                  ) : (
                                    <>
                                      {thumbnailUrl ? (
                                        <img 
                                          src={thumbnailUrl} 
                                          alt={video.title} 
                                          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-40 transition-all duration-300"
                                          referrerPolicy="no-referrer"
                                        />
                                      ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 to-slate-950 opacity-80 group-hover:scale-105 transition-all duration-300" />
                                      )}
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <button 
                                          onClick={() => setPlayingVideoId(video.id)}
                                          className="p-4 rounded-full bg-indigo-600/90 group-hover:bg-indigo-500 text-white shadow-xl transform group-hover:scale-110 transition-all duration-300 hover:shadow-indigo-500/20"
                                          title="Lancer la vidéo"
                                        >
                                          <Play className="w-5 h-5 fill-white" />
                                        </button>
                                      </div>
                                      <span className="absolute bottom-3 right-3 bg-indigo-600/95 backdrop-blur-sm text-white text-[8px] font-mono px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                                        {video.type === "youtube" ? "Vidéo YouTube" : "Vidéo Interne"}
                                      </span>
                                    </>
                                  )}
                                </div>
                                <div>
                                  <span className="text-[10px] text-indigo-400 font-mono block font-bold uppercase tracking-wider">Support Pédagogique</span>
                                  <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">{video.title}</h4>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* C. Quiz */}
                    {lessonActiveTab === "quiz" && (
                      <div className="space-y-6">
                        {!quizStarted ? (
                          <div className="text-center py-12 space-y-4 max-w-sm mx-auto">
                            <HelpCircle className="w-12 h-12 text-indigo-400 mx-auto" />
                            <h3 className="text-base font-bold text-white">Évaluation de la Leçon</h3>
                            <p className="text-xs text-slate-500">
                              Ce quiz comporte {selectedLesson.quiz.questions.length} questions avec correction immédiate et explications détaillées. Score requis : {selectedLesson.quiz.passingScore}%.
                            </p>
                            <button 
                              onClick={() => {
                                setQuizStarted(true);
                                setCurrentQuestionIdx(0);
                                setSelectedOption(null);
                                setQuizSubmitted(false);
                                setQuizScore(0);
                              }}
                              className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md"
                            >
                              Commencer le Quiz
                            </button>
                          </div>
                        ) : (
                          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
                            <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase font-bold font-mono border-b border-slate-850 pb-2">
                              <span>Question {currentQuestionIdx + 1} de {selectedLesson.quiz.questions.length}</span>
                              <span>Score actuel : {quizScore} / {selectedLesson.quiz.questions.length}</span>
                            </div>

                            {/* Question text */}
                            <h3 className="text-sm font-bold text-white">
                              {selectedLesson.quiz.questions[currentQuestionIdx].question}
                            </h3>

                            {/* Options */}
                            <div className="space-y-2.5 text-xs">
                              {selectedLesson.quiz.questions[currentQuestionIdx].options.map((option, oIdx) => {
                                const isSelected = selectedOption === oIdx;
                                const isCorrect = oIdx === selectedLesson.quiz.questions[currentQuestionIdx].correctIndex;
                                return (
                                  <button
                                    key={oIdx}
                                    onClick={() => handleSelectQuizOption(oIdx)}
                                    className={`w-full p-4 rounded-xl text-left border font-semibold transition-all flex items-center justify-between ${
                                      quizSubmitted 
                                        ? isCorrect 
                                          ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" 
                                          : isSelected 
                                            ? "bg-rose-500/10 border-rose-500 text-rose-400" 
                                            : "bg-slate-950/20 border-slate-850 opacity-50"
                                        : isSelected 
                                          ? "bg-indigo-600/10 border-indigo-500 text-indigo-300" 
                                          : "bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-700"
                                    }`}
                                  >
                                    <span>{option}</span>
                                    {quizSubmitted && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Correct explanation banner */}
                            {quizSubmitted && (
                              <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 text-[11px] text-slate-400 leading-relaxed">
                                <span className="font-bold text-white block mb-1">💡 Explication :</span>
                                {selectedLesson.quiz.questions[currentQuestionIdx].explanation}
                              </div>
                            )}

                            {/* Controls */}
                            <div className="flex justify-end pt-2 border-t border-slate-850">
                              {!quizSubmitted ? (
                                <button 
                                  onClick={handleSubmitQuizQuestion}
                                  disabled={selectedOption === null}
                                  className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs disabled:opacity-50"
                                >
                                  Valider ma réponse
                                </button>
                              ) : (
                                <button 
                                  onClick={handleNextQuizQuestion}
                                  className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                                >
                                  Question suivante ➔
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* D. Ressources */}
                    {lessonActiveTab === "ressources" && (
                      <div className="space-y-4">
                        {selectedLesson.resources.map((res, idx) => (
                          <div 
                            key={idx}
                            className="p-4 rounded-2xl bg-slate-900 border border-slate-850 flex items-center justify-between hover:border-slate-700 transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400">
                                <FileDown className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-slate-200">{res.title}</h4>
                                <span className="text-[10px] text-slate-500 font-mono">{res.type.toUpperCase()} • {res.size}</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleDownloadResource(selectedLesson, res)}
                              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors text-[11px] font-bold"
                            >
                              Télécharger
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                </div>

              </div>
            )}

            {/* --- VIEW 5 : CLASS LEADERBOARD --- */}
            {activeTab === "leaderboard" && profile.role === "student" && (
              <div className="space-y-6">
                <div className={`p-6 rounded-3xl border ${
                  darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    Classement des meilleurs élèves de la 7ème A
                  </h3>

                  <div className="space-y-3 text-xs">
                    {[
                      { rank: 1, name: "Jean Mubala", xp: profile.xpPoints, progress: "15%", isUser: true },
                      { rank: 2, name: "Aimé Tshilombo", xp: 40, progress: "0%", isUser: false },
                      { rank: 3, name: "Esther Kamba", xp: 20, progress: "0%", isUser: false }
                    ].map((row, idx) => (
                      <div 
                        key={idx}
                        className={`p-4 rounded-2xl border flex items-center justify-between ${
                          row.isUser 
                            ? "bg-indigo-600/10 border-indigo-500 text-white font-extrabold" 
                            : "bg-slate-950/40 border-slate-850 text-slate-400"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-base font-black w-6 text-center">{row.rank}</span>
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold overflow-hidden border border-slate-750">
                            {row.isUser && profile.avatarUrl ? (
                              profile.avatarUrl.length <= 2 ? (
                                <span className="text-base">{profile.avatarUrl}</span>
                              ) : (
                                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              )
                            ) : (
                              row.name[0]
                            )}
                          </div>
                          <span className="font-bold">{row.name} {row.isUser && "(Moi)"}</span>
                        </div>

                        <div className="flex gap-8 font-mono">
                          <span>Progression : {row.progress}</span>
                          <span className="font-bold text-amber-400">{row.xp} XP</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* --- VIEW 6 : MESSAGERIE SCOLAIRE --- */}
            {activeTab === "messaging" && profile.role === "student" && (
              <div className="space-y-6">
                <div className={`h-[60vh] rounded-3xl border flex flex-col justify-between overflow-hidden ${
                  darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <div className="p-4 bg-slate-950 border-b border-slate-850 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-indigo-400" />
                      <div>
                        <h4 className="text-xs font-bold text-white">Boîte de messagerie avec : Professeur Mubenga</h4>
                        <span className="text-[9px] text-slate-500">Messagerie éducative interne</span>
                      </div>
                    </div>
                  </div>

                  {/* Thread messages */}
                  <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-slate-950 text-xs">
                    {messagerieMessages.map((msg, i) => {
                      const isMe = msg.senderId === profile.id;
                      return (
                        <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-md p-4 rounded-2xl ${
                            isMe ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-300 border border-slate-850"
                          }`}>
                            <span className="text-[9px] opacity-60 font-bold block mb-1">{msg.senderName}</span>
                            <p>{msg.content}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Input form */}
                  <form onSubmit={handleSendMail} className="p-4 border-t border-slate-850 flex gap-3 shrink-0">
                    <input 
                      type="text" 
                      value={msgInput}
                      onChange={e => setMsgInput(e.target.value)}
                      placeholder="Tapez votre réponse à l'enseignant..."
                      className="flex-grow bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none"
                    />
                    <button 
                      type="submit"
                      className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                    >
                      Envoyer
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* --- VIEW 7 : CALENDAR --- */}
            {activeTab === "calendar" && profile.role === "student" && (
              <div className="space-y-6">
                <div className={`p-6 rounded-3xl border ${
                  darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    Calendrier Académique & Devoirs
                  </h3>

                  <div className="space-y-4">
                    {events.map((evt, idx) => (
                      <div 
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs"
                      >
                        <div className="flex items-center gap-4">
                          <span className="p-2 rounded-xl bg-rose-500/10 text-rose-400 font-bold font-mono">
                            {evt.date}
                          </span>
                          <div>
                            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-bold text-[9px] font-mono">
                              {evt.type.toUpperCase()}
                            </span>
                            <h4 className="text-sm font-bold text-white mt-1">{evt.title}</h4>
                            <p className="text-slate-500 mt-1">{evt.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* --- VIEW 7.5 : NOTIFICATIONS CENTRE --- */}
            {activeTab === "notifications" && profile.role === "student" && (
              <div className="space-y-6">
                <div className={`p-6 rounded-3xl border ${
                  darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <div className="flex justify-between items-center border-b border-slate-850 pb-4 mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-indigo-400" />
                      Centre de Notifications
                    </h3>
                    {filteredNotifications.length > 0 && (
                      <button 
                        onClick={() => {
                          setNotifications(prev => prev.filter(n => n.studentId && n.studentId !== profile.id));
                        }}
                        className="text-[10px] font-bold text-slate-500 hover:text-slate-300 font-mono uppercase"
                      >
                        Tout effacer
                      </button>
                    )}
                  </div>

                  {filteredNotifications.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-12 h-12 rounded-full bg-slate-950 flex items-center justify-center mx-auto mb-4 border border-slate-850 text-slate-600">
                        <Bell className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-400">Aucune notification</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                        Les diffusions de cours et les rappels d'examens de vos professeurs connectés apparaîtront ici.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredNotifications.map(notif => (
                        <div 
                          key={notif.id}
                          className={`p-4 rounded-2xl border transition-all duration-300 flex items-start gap-4 ${
                            notif.read 
                              ? "bg-slate-950/40 border-slate-900 text-slate-400" 
                              : "bg-slate-950 border-slate-850/80 shadow-md shadow-indigo-500/5 text-white"
                          }`}
                        >
                          <div className={`p-2.5 rounded-xl ${
                            notif.type === "new_lesson" ? "bg-emerald-500/10 text-emerald-400" :
                            notif.type === "badge" ? "bg-amber-500/10 text-amber-400" :
                            notif.type === "certificate" ? "bg-indigo-500/10 text-indigo-400" : "bg-sky-500/10 text-sky-400"
                          }`}>
                            {notif.type === "new_lesson" ? <BookOpen className="w-4 h-4" /> :
                             notif.type === "badge" ? <Trophy className="w-4 h-4" /> :
                             notif.type === "certificate" ? <Award className="w-4 h-4" /> :
                             <Bell className="w-4 h-4" />}
                          </div>
                          
                          <div className="flex-grow">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <h4 className="text-sm font-bold">{notif.title}</h4>
                                <span className="text-[9px] font-mono text-slate-500 block mt-0.5">{notif.date}</span>
                              </div>
                              {!notif.read && (
                                <button 
                                  onClick={() => {
                                    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
                                  }}
                                  className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold font-mono"
                                >
                                  Marquer lu
                                </button>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-2 leading-relaxed">{notif.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/*                  TEACHER WORKSPACE                       */}
            {/* ======================================================== */}

            {/* --- TEACHER TAB 1: TABLEAU DE BORD --- */}
            {activeTab === "teacher_dashboard" && profile.role === "teacher" && (
              <div className="space-y-6">
                <div className={`p-6 rounded-3xl border ${
                  darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <div className="flex items-center justify-between border-b border-slate-850 pb-4 mb-6">
                    <div>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold block uppercase tracking-wider">Session Active Enseignant</span>
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Activity className="w-5 h-5 text-emerald-400" />
                        Tableau de bord de l'Enseignant
                      </h3>
                    </div>
                    <div className="bg-slate-950 border border-slate-850 px-4 py-1.5 rounded-xl text-xs font-mono">
                      Clé d'Accès de la Classe : <span className="text-emerald-400 font-bold">{teacherAccessKey}</span>
                    </div>
                  </div>

                  {/* Bento KPI cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850/60 text-center">
                      <span className="text-[10px] text-slate-500 font-mono font-bold uppercase block">Élèves Enregistrés</span>
                      <span className="text-2xl font-black font-mono text-emerald-400 mt-1 block">
                        {mockUsers.filter(u => u.role === "student" && u.teacherCode === teacherAccessKey).length}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850/60 text-center">
                      <span className="text-[10px] text-slate-500 font-mono font-bold uppercase block">Devoirs & TP en Ligne</span>
                      <span className="text-2xl font-black font-mono text-indigo-400 mt-1 block">{homeworkList.length}</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850/60 text-center">
                      <span className="text-[10px] text-slate-500 font-mono font-bold uppercase block">Copies à Corriger</span>
                      <span className="text-2xl font-black font-mono text-amber-500 mt-1 block">
                        {homeworkSubmissions.filter(s => s.status === "submitted").length}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850/60 text-center">
                      <span className="text-[10px] text-slate-500 font-mono font-bold uppercase block">Soucis Élèves</span>
                      <span className="text-2xl font-black font-mono text-rose-400 mt-1 block">
                        {studentConcerns.filter(c => c.status === "pending").length}
                      </span>
                    </div>
                  </div>

                  {/* Quick Announcement Form */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-850/80 mb-6">
                    <span className="text-[10px] text-emerald-400 font-mono font-bold block uppercase mb-2">Diffuser une annonce générale à la classe</span>
                    <form onSubmit={handlePublishCourse} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-3">
                          <input 
                            type="text"
                            required
                            value={pubTitle}
                            onChange={e => setPubTitle(e.target.value)}
                            placeholder="Sujet de l'annonce (ex: Rappel sur le fonctionnement du clavier)"
                            className={`w-full text-xs rounded-xl px-4 py-2 focus:outline-none ${
                              darkMode ? "bg-slate-900 border border-slate-800 text-slate-300" : "bg-slate-100 border border-slate-200 text-slate-800"
                            }`}
                          />
                        </div>
                        <div>
                          <select 
                            value={pubCategory}
                            onChange={e => setPubCategory(e.target.value as any)}
                            className={`w-full text-xs rounded-xl px-4 py-2 focus:outline-none font-bold ${
                              darkMode ? "bg-slate-900 border border-slate-800 text-emerald-400" : "bg-slate-100 border border-slate-200 text-emerald-650"
                            }`}
                          >
                            <option value="Cours">📚 Cours</option>
                            <option value="TP">🔬 Travail Pratique</option>
                            <option value="Annonce">📢 Annonce</option>
                          </select>
                        </div>
                      </div>
                      <textarea 
                        required
                        rows={3}
                        value={pubContent}
                        onChange={e => setPubContent(e.target.value)}
                        placeholder="Rédigez le message à diffuser..."
                        className={`w-full text-xs rounded-xl px-4 py-2.5 focus:outline-none ${
                          darkMode ? "bg-slate-900 border border-slate-800 text-slate-300" : "bg-slate-100 border border-slate-200 text-slate-800"
                        }`}
                      />
                      <div className="flex justify-end">
                        <button 
                          type="submit"
                          className="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Publier l'Annonce
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Publications Feed */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2 font-mono">
                      <Bell className="w-4 h-4 text-emerald-400" />
                      VOS DERNIÈRES ANNONCES ET COURS DIFFUSÉS
                    </h4>
                    {teacherPublications.length === 0 ? (
                      <p className="text-slate-500 text-xs italic p-4 rounded-xl bg-slate-950 border border-slate-900 text-center">Aucune publication diffusée.</p>
                    ) : (
                      <div className="space-y-3">
                        {teacherPublications.map(pub => (
                          <div key={pub.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex justify-between items-start gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${
                                  pub.category === "Cours" ? "bg-indigo-500/10 text-indigo-400" :
                                  pub.category === "TP" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                                }`}>
                                  {pub.category.toUpperCase()}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">{pub.date}</span>
                              </div>
                              <h5 className="text-sm font-bold text-white mt-1.5">{pub.title}</h5>
                              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{pub.content}</p>
                            </div>
                            <button 
                              onClick={() => {
                                setTeacherPublications(prev => prev.filter(p => p.id !== pub.id));
                              }}
                              className="text-xs font-bold text-rose-500 hover:text-rose-450 p-1 font-mono uppercase"
                            >
                              Supprimer
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* --- TEACHER TAB 2: COURS MTIC (LESSONS MANAGEMENT) --- */}
            {activeTab === "teacher_lessons" && profile.role === "teacher" && (
              <div className="space-y-6">
                <div className={`p-6 rounded-3xl border ${
                  darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <div className="border-b border-slate-850 pb-4 mb-6">
                    <span className="text-[10px] text-emerald-400 font-mono font-bold block uppercase tracking-wider">Module de Gestion des Leçons</span>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-emerald-400" />
                      Espace Syllabus & Gestion de Leçons
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Add/Edit Custom Lesson Form */}
                    <div className="lg:col-span-5 space-y-4">
                      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-850">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wide font-mono flex items-center gap-1.5 mb-3">
                          <Plus className="w-4 h-4 text-emerald-400" />
                          {editingLessonId ? "Modifier la Leçon" : "Créer une Nouvelle Leçon"}
                        </h4>

                        <form onSubmit={(e) => {
                          e.preventDefault();
                          if (!clTitle.trim() || !clContent.trim()) {
                            alert("Veuillez remplir le titre et le contenu principal.");
                            return;
                          }

                          const objectivesArray = clObjectives.split(";").map(o => o.trim()).filter(o => o.length > 0);
                          const summaryArray = clSummary.split(";").map(s => s.trim()).filter(s => s.length > 0);

                          if (editingLessonId) {
                            setCustomLessons(prev => prev.map(l => l.id === editingLessonId ? {
                              ...l,
                              title: clTitle.trim(),
                              category: clCategory,
                              contentSections: [{ title: "Contenu du cours", body: clContent.trim() }],
                              objectives: objectivesArray.length > 0 ? objectivesArray : ["Maîtriser ce cours"],
                              summary: summaryArray.length > 0 ? summaryArray : ["Points clés du cours"]
                            } : l));
                            setEditingLessonId(null);
                            alert("Leçon modifiée avec succès.");
                          } else {
                            const newL: Lesson = {
                              id: "custom_lesson_" + Math.random().toString(36).substr(2, 9),
                              title: clTitle.trim(),
                              level: "7ème",
                              category: clCategory,
                              objectives: objectivesArray.length > 0 ? objectivesArray : ["Savoir définir et comprendre ces concepts."],
                              summary: summaryArray.length > 0 ? summaryArray : ["Résumé du cours complété."],
                              contentSections: [
                                { title: "Introduction et notions clés", body: clContent.trim() }
                              ],
                              videos: [],
                              exercises: [],
                              quiz: { questions: [], passingScore: 70 },
                              resources: []
                            };
                            setCustomLessons(prev => [newL, ...prev]);
                            alert("Leçon ajoutée au catalogue de votre classe avec succès !");
                          }

                          // Clear fields
                          setClTitle("");
                          setClObjectives("");
                          setClContent("");
                          setClSummary("");
                        }} className="space-y-4 text-xs">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 font-mono">Titre de la leçon</label>
                            <input 
                              type="text"
                              required
                              value={clTitle}
                              onChange={e => setClTitle(e.target.value)}
                              placeholder="Ex: Leçon 1.6 — Présentation générale de l'ordinateur"
                              className={`w-full text-xs rounded-xl px-3 py-2 focus:outline-none ${
                                darkMode ? "bg-slate-900 border border-slate-800 text-slate-200" : "bg-slate-100 border border-slate-200 text-slate-800"
                              }`}
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 font-mono">Catégorie</label>
                            <select 
                              value={clCategory}
                              onChange={e => setClCategory(e.target.value)}
                              className={`w-full text-xs rounded-xl px-3 py-2 focus:outline-none ${
                                darkMode ? "bg-slate-900 border border-slate-800 text-slate-200" : "bg-slate-100 border border-slate-200 text-slate-800"
                              }`}
                            >
                              <option value="Concepts de Base">Concepts de Base</option>
                              <option value="Périphériques">Périphériques</option>
                              <option value="Windows">Windows</option>
                              <option value="Fichiers et Dossiers">Fichiers et Dossiers</option>
                              <option value="Traitement de Texte">Traitement de Texte</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 font-mono">Objectifs (séparés par un point-virgule ';')</label>
                            <textarea 
                              rows={2}
                              value={clObjectives}
                              onChange={e => setClObjectives(e.target.value)}
                              placeholder="Ex: Identifier l'unité centrale; Distinguer matériel et logiciel"
                              className={`w-full text-xs rounded-xl px-3 py-2 focus:outline-none ${
                                darkMode ? "bg-slate-900 border border-slate-800 text-slate-200" : "bg-slate-100 border border-slate-200 text-slate-800"
                              }`}
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 font-mono">Contenu principal du cours</label>
                            <textarea 
                              rows={5}
                              required
                              value={clContent}
                              onChange={e => setClContent(e.target.value)}
                              placeholder="Rédigez le texte complet de votre cours ici..."
                              className={`w-full text-xs rounded-xl px-3 py-2 focus:outline-none ${
                                darkMode ? "bg-slate-900 border border-slate-800 text-slate-200" : "bg-slate-100 border border-slate-200 text-slate-800"
                              }`}
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 font-mono">Points de Résumé (séparés par ';')</label>
                            <textarea 
                              rows={2}
                              value={clSummary}
                              onChange={e => setClSummary(e.target.value)}
                              placeholder="Ex: L'ordinateur traite des données; Le clavier est essentiel pour la saisie"
                              className={`w-full text-xs rounded-xl px-3 py-2 focus:outline-none ${
                                darkMode ? "bg-slate-900 border border-slate-800 text-slate-200" : "bg-slate-100 border border-slate-200 text-slate-800"
                              }`}
                            />
                          </div>

                          <div className="flex gap-2">
                            <button 
                              type="submit"
                              className="flex-grow py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono shadow-md"
                            >
                              {editingLessonId ? "Mettre à jour" : "Publier le Cours"}
                            </button>
                            {editingLessonId && (
                              <button 
                                type="button"
                                onClick={() => {
                                  setEditingLessonId(null);
                                  setClTitle("");
                                  setClObjectives("");
                                  setClContent("");
                                  setClSummary("");
                                }}
                                className="px-4 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 font-bold text-xs"
                              >
                                Annuler
                              </button>
                            )}
                          </div>
                        </form>
                      </div>
                    </div>

                    {/* Catalogue split layout */}
                    <div className="lg:col-span-7 space-y-6">
                      
                      {/* Section A: Custom published lessons */}
                      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-850">
                        <span className="text-[9px] text-emerald-400 font-mono font-bold block uppercase tracking-wide mb-2">VOS LEÇONS PERSONNALISÉES ({customLessons.length})</span>
                        {customLessons.length === 0 ? (
                          <p className="text-slate-500 text-xs italic">Vous n'avez pas encore créé de leçon personnalisée. Utilisez le formulaire pour en ajouter.</p>
                        ) : (
                          <div className="space-y-3">
                            {customLessons.map(l => (
                              <div key={l.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 flex justify-between items-center gap-4">
                                <div>
                                  <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-emerald-500/10 text-emerald-400 uppercase">{l.category}</span>
                                  <h5 className="text-xs font-bold text-white mt-1">{l.title}</h5>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button 
                                    onClick={() => {
                                      setEditingLessonId(l.id);
                                      setClTitle(l.title);
                                      setClCategory(l.category);
                                      setClObjectives(l.objectives.join("; "));
                                      setClContent(l.contentSections[0]?.body || "");
                                      setClSummary(l.summaryPoints.join("; "));
                                    }}
                                    className="p-1.5 bg-slate-800 hover:bg-slate-750 rounded text-amber-400"
                                    title="Modifier"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button 
                                    onClick={() => {
                                      if (confirm("Supprimer cette leçon définitivement ?")) {
                                        setCustomLessons(prev => prev.filter(x => x.id !== l.id));
                                        if (editingLessonId === l.id) setEditingLessonId(null);
                                      }
                                    }}
                                    className="p-1.5 bg-slate-800 hover:bg-slate-750 rounded text-rose-500"
                                    title="Supprimer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Section B: Default National Syllabus lessons */}
                      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-850">
                        <div className="mb-2">
                          <span className="text-[9px] text-slate-500 font-mono font-bold block uppercase tracking-wide">Syllabus National du Ministère (Lecture Seule)</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Leçons pré-intégrées à la plateforme (le laboratoire virtuel et les simulations interactives sont réservés uniquement à l'espace élève).</span>
                        </div>
                        
                        <div className="max-h-[350px] overflow-y-auto space-y-2.5 pr-1">
                          {lessonsData.map(l => (
                            <div key={l.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-850 flex justify-between items-center">
                              <div>
                                <span className="px-1.5 py-0.5 rounded text-[8px] font-mono text-slate-500 bg-slate-800">{l.category}</span>
                                <h5 className="text-xs font-bold text-slate-300 mt-1">{l.title}</h5>
                              </div>
                              <span className="text-[10px] text-slate-500 font-mono italic">Lecture Seule</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- TEACHER TAB 3: ASSISTANT TUTORIEL IA (CORRECTION AUTOMATIQUE ET MANUELLE) --- */}
            {activeTab === "teacher_ai_tutor" && profile.role === "teacher" && (
              <div className="space-y-6">
                <div className={`p-6 rounded-3xl border ${
                  darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <div className="border-b border-slate-850 pb-4 mb-6">
                    <span className="text-[10px] text-emerald-400 font-mono font-bold block uppercase tracking-wider">Assistant Pédagogique Intelligent</span>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-400" />
                      Correction assistée par l'IA
                    </h3>
                  </div>

                  {/* Homework & Exercise Creation Form */}
                  <div className="mb-8">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-2 font-mono">
                      <Plus className="w-4 h-4 text-emerald-400" />
                      AJOUTER UN NOUVEAU DEVOIR, T.P OU EXERCICE EN LIGNE
                    </h4>

                    <form onSubmit={handleCreateHomework} className="p-5 rounded-2xl bg-slate-950 border border-slate-850/80 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 font-mono">Titre du Devoir / Exercice</label>
                          <input 
                            type="text"
                            required
                            value={hwTitle}
                            onChange={e => setHwTitle(e.target.value)}
                            placeholder="Ex: TP 4 — Les raccourcis clavier de base"
                            className="w-full text-xs rounded-xl px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 font-mono">Type de Travail</label>
                          <select 
                            value={hwCategory}
                            onChange={e => setHwCategory(e.target.value as any)}
                            className="w-full text-xs rounded-xl px-4 py-2 bg-slate-900 border border-slate-800 text-emerald-400 focus:outline-none font-bold"
                          >
                            <option value="Devoir">📝 Devoir de Maison</option>
                            <option value="TP">🔬 Travail Pratique (T.P)</option>
                            <option value="Exercice">⚡ Exercice en Classe</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 font-mono">Description / Consigne</label>
                          <input 
                            type="text"
                            value={hwDescription}
                            onChange={e => setHwDescription(e.target.value)}
                            placeholder="Ex: À travailler individuellement sur la console de simulation."
                            className="w-full text-xs rounded-xl px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 font-mono">Points Max</label>
                            <input 
                              type="number"
                              required
                              min={1}
                              max={100}
                              value={hwPoints}
                              onChange={e => setHwPoints(Number(e.target.value))}
                              className="w-full text-xs rounded-xl px-4 py-2 bg-slate-900 border border-slate-800 text-amber-500 text-center font-bold font-mono focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 font-mono">Date Limite</label>
                            <input 
                              type="date"
                              required
                              value={hwLimit}
                              onChange={e => setHwLimit(e.target.value)}
                              className="w-full text-xs rounded-xl px-2 py-2 bg-slate-900 border border-slate-800 text-slate-300 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 font-mono">Question / Énoncé exact du devoir</label>
                        <textarea 
                          required
                          rows={2}
                          value={hwQuestion}
                          onChange={e => setHwQuestion(e.target.value)}
                          placeholder="Ex: Expliquez la différence entre les touches 'Backspace' et 'Delete' sous Windows."
                          className="w-full text-xs rounded-xl px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 font-mono flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-indigo-400" />
                          Corrigé Type / Critères de notation (Fourni à l'IA pour la correction automatique)
                        </label>
                        <textarea 
                          required
                          rows={2}
                          value={hwCorregi}
                          onChange={e => setHwCorregi(e.target.value)}
                          placeholder="Ex: Backspace efface le caractère à gauche du curseur. Delete efface le caractère à droite du curseur."
                          className="w-full text-xs rounded-xl px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="flex justify-end pt-2">
                        <button 
                          type="submit"
                          className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          Créer et publier la tâche pour les élèves
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Submissions list with Draft Correction Table */}
                  <div className="border-t border-slate-850 pt-6">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-2 font-mono">
                      <Users className="w-4 h-4 text-emerald-400" />
                      Copies d'élèves reçues en ligne ({homeworkSubmissions.length})
                    </h4>

                    {homeworkSubmissions.length === 0 ? (
                      <p className="text-slate-500 text-xs italic p-4 rounded-xl bg-slate-950 border border-slate-900 text-center">Aucune copie d'élève soumise pour le moment.</p>
                    ) : (
                      <div className="space-y-4">
                        {homeworkSubmissions.map(sub => {
                          const hw = homeworkList.find(h => h.id === sub.homeworkId);
                          const isBeingGraded = gradingSubId === sub.id;
                          const draft = aiDraftCorrections.find(d => d.submissionId === sub.id);

                          return (
                            <div key={sub.id} className={`p-4 rounded-2xl border transition-all ${
                              sub.status === "graded" 
                                ? "bg-slate-950/40 border-slate-900 opacity-80" 
                                : "bg-slate-950 border-indigo-500/20"
                            }`}>
                              <div className="flex justify-between items-start gap-2 flex-wrap">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-white font-mono">{sub.studentName}</span>
                                    <span className="text-[9px] text-slate-500 font-mono">Soumis le {sub.date}</span>
                                  </div>
                                  <h6 className="text-xs font-bold text-emerald-400 mt-1">
                                    {sub.homeworkCategory} : {sub.homeworkTitle}
                                  </h6>
                                </div>
                                <div>
                                  {sub.status === "graded" ? (
                                    <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold text-xs block">
                                      Corrigé : {sub.grade} / {hw?.points || 20}
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 text-[9px] font-bold font-mono uppercase animate-pulse">
                                      À corriger
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                <div className="p-3 rounded-xl bg-slate-900 border border-slate-880">
                                  <span className="text-[9px] font-bold text-slate-500 uppercase font-mono block">Sujet / Consigne</span>
                                  <p className="text-slate-300 mt-1 font-medium">{hw?.question}</p>
                                  <span className="text-[9px] font-bold text-indigo-400 uppercase font-mono block mt-2">Corrigé type :</span>
                                  <p className="text-slate-400 mt-0.5 italic">{hw?.corregiType}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-indigo-950/10 border border-indigo-950/20">
                                  <span className="text-[9px] font-bold text-indigo-400 uppercase font-mono block">Copie de l'élève</span>
                                  <p className="text-slate-100 font-semibold mt-1 bg-indigo-950/25 p-2 rounded border border-indigo-950/30">
                                    "{sub.studentAnswer}"
                                  </p>
                                </div>
                              </div>

                              {/* Action buttons */}
                              {sub.status === "submitted" && (
                                <div className="mt-4 pt-3 border-t border-slate-900/60 flex items-center justify-between flex-wrap gap-2">
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => {
                                        setGradingSubId(sub.id);
                                        setGradingScore(draft ? String(draft.draftGrade) : "");
                                        setGradingComment(draft ? draft.draftComment : "");
                                      }}
                                      className="py-1.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-[11px] font-bold transition-all"
                                    >
                                      {draft ? "Modifier la correction" : "Corriger manuellement"}
                                    </button>

                                    <button 
                                      onClick={async () => {
                                        setGradingLoading(true);
                                        // Simulate AI correction based on homework answer keys
                                        setTimeout(() => {
                                          const ideal = hw?.corregiType?.toLowerCase() || "";
                                          const ans = sub.studentAnswer.toLowerCase();
                                          let calculatedScore = Math.floor((hw?.points || 20) * 0.6);
                                          let calculatedComment = "L'élève a fourni une réponse correcte mais incomplète.";

                                          if (ans.length > 5 && ideal.split(" ").some(w => w.length > 3 && ans.includes(w))) {
                                            calculatedScore = Math.floor((hw?.points || 20) * 0.9);
                                            calculatedComment = "Excellent travail ! La réponse contient les mots-clés demandés et correspond au corrigé type.";
                                          } else if (ans.length < 5) {
                                            calculatedScore = Math.floor((hw?.points || 20) * 0.2);
                                            calculatedComment = "Réponse trop courte ou incomplète. Veuillez approfondir le concept.";
                                          }

                                          setAiDraftCorrections(prev => [
                                            ...prev.filter(d => d.submissionId !== sub.id),
                                            {
                                              submissionId: sub.id,
                                              studentId: sub.studentId,
                                              studentName: sub.studentName,
                                              homeworkId: sub.homeworkId,
                                              homeworkTitle: sub.homeworkTitle,
                                              homeworkCategory: sub.homeworkCategory,
                                              draftGrade: calculatedScore,
                                              draftComment: calculatedComment
                                            }
                                          ]);
                                          setGradingLoading(false);
                                          alert("Correction IA générée sous forme de brouillon ! Vous pouvez maintenant la valider dans le tableau de présentation.");
                                        }, 1000);
                                      }}
                                      className="py-1.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold flex items-center gap-1 transition-all"
                                    >
                                      <Sparkles className="w-3.5 h-3.5" />
                                      {gradingLoading ? "IA réfléchit..." : "Faire corriger par l'IA"}
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Interactive Manual Form */}
                              {isBeingGraded && (
                                <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                    <span className="text-[9px] text-emerald-400 font-mono font-bold uppercase">Formulaire de notation active</span>
                                    <button onClick={() => setGradingSubId(null)} className="text-slate-500 hover:text-white text-xs">Fermer</button>
                                  </div>
                                  <div className="grid grid-cols-4 gap-3 text-xs">
                                    <div className="col-span-1">
                                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Note / {hw?.points || 20}</label>
                                      <input 
                                        type="number"
                                        value={gradingScore}
                                        onChange={e => setGradingScore(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-emerald-400 text-center font-bold focus:outline-none"
                                      />
                                    </div>
                                    <div className="col-span-3">
                                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Commentaire pédagogique</label>
                                      <input 
                                        type="text"
                                        value={gradingComment}
                                        onChange={e => setGradingComment(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-300 focus:outline-none"
                                        placeholder="Excellent raisonnement, etc."
                                      />
                                    </div>
                                  </div>
                                  <div className="flex justify-end">
                                    <button 
                                      onClick={() => {
                                        const finalScore = Number(gradingScore);
                                        if (isNaN(finalScore) || finalScore < 0) {
                                          alert("Veuillez saisir une note valide.");
                                          return;
                                        }
                                        // Save grade directly as teacher validated
                                        const newGrade: ValidatedGrade = {
                                          id: "grd_" + Math.random().toString(36).substr(2, 9),
                                          submissionId: sub.id,
                                          studentId: sub.studentId,
                                          studentName: sub.studentName,
                                          homeworkId: sub.homeworkId,
                                          homeworkTitle: sub.homeworkTitle,
                                          homeworkCategory: sub.homeworkCategory,
                                          grade: finalScore,
                                          maxPoints: hw?.points || 20,
                                          comment: gradingComment.trim() || "Félicitations pour votre travail !",
                                          sentStatus: "pending",
                                          published: false
                                        };
                                        setValidatedGrades(prev => [...prev.filter(g => g.submissionId !== sub.id), newGrade]);
                                        setHomeworkSubmissions(prev => prev.map(s => s.id === sub.id ? { ...s, status: "graded", grade: finalScore, comment: gradingComment } : s));
                                        setGradingSubId(null);
                                        alert("La note a été validée avec succès et enregistrée dans le carnet des côtes (menu Côtes des élèves).");
                                      }}
                                      className="py-1.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                                    >
                                      Valider et Enregistrer
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Brouillon IA Table View */}
                              {draft && sub.status === "submitted" && (
                                <div className="mt-3 p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs">
                                  <div className="flex justify-between items-center border-b border-emerald-500/10 pb-1.5 mb-2">
                                    <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase flex items-center gap-1">
                                      <Sparkles className="w-3.5 h-3.5" />
                                      Proposition de correction de l'IA (Brouillon)
                                    </span>
                                    <span className="text-xs font-mono font-bold text-emerald-400">{draft.draftGrade} / {hw?.points || 20}</span>
                                  </div>
                                  <p className="text-slate-300 italic mb-2">"{draft.draftComment}"</p>
                                  <div className="flex justify-end gap-2">
                                    <button 
                                      onClick={() => {
                                        // Auto-validate AI draft
                                        const valG: ValidatedGrade = {
                                          id: "grd_" + Math.random().toString(36).substr(2, 9),
                                          submissionId: sub.id,
                                          studentId: sub.studentId,
                                          studentName: sub.studentName,
                                          homeworkId: sub.homeworkId,
                                          homeworkTitle: sub.homeworkTitle,
                                          homeworkCategory: sub.homeworkCategory,
                                          grade: draft.draftGrade,
                                          maxPoints: hw?.points || 20,
                                          comment: draft.draftComment,
                                          sentStatus: "pending",
                                          published: false
                                        };
                                        setValidatedGrades(prev => [...prev.filter(g => g.submissionId !== sub.id), valG]);
                                        setHomeworkSubmissions(prev => prev.map(s => s.id === sub.id ? { ...s, status: "graded", grade: draft.draftGrade, comment: draft.draftComment } : s));
                                        setAiDraftCorrections(prev => prev.filter(d => d.submissionId !== sub.id));
                                        alert("Correction de l'IA validée avec succès ! La note a été ajoutée au carnet de côtes.");
                                      }}
                                      className="py-1 px-3 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] font-mono flex items-center gap-1"
                                    >
                                      <Check className="w-3 h-3" />
                                      Valider la note de l'IA
                                    </button>
                                  </div>
                                </div>
                              )}

                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* --- TEACHER TAB 4: CLASSEMENT D'ÉTOILES --- */}
            {activeTab === "teacher_leaderboard" && profile.role === "teacher" && (
              <div className="space-y-6">
                <div className={`p-6 rounded-3xl border ${
                  darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <div className="border-b border-slate-850 pb-4 mb-6">
                    <span className="text-[10px] text-emerald-400 font-mono font-bold block uppercase tracking-wider">Classement d'Élite</span>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-emerald-400" />
                      Classement des Étoiles de votre Classe
                    </h3>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 text-xs text-slate-400 mb-6 leading-relaxed">
                    Ce tableau répertorie les élèves de votre classe triés par leur rigueur, leur assiduité et l'application constante qu'ils démontrent dans leurs leçons, devoirs et exercices.
                  </div>

                  <div className="space-y-3">
                    {mockUsers
                      .filter(u => u.role === "student" && u.teacherCode === teacherAccessKey)
                      .sort((a, b) => b.xpPoints - a.xpPoints)
                      .map((student, idx) => (
                        <div key={student.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center font-bold font-mono border border-slate-800 text-emerald-400">
                              #{idx + 1}
                            </div>
                            <div>
                              <h5 className="text-sm font-bold text-white">{student.name}</h5>
                              <span className="text-[10px] text-slate-500 font-mono">ID Élève : {student.id}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <span className="text-[10px] text-slate-500 uppercase font-bold block font-mono">Points XP</span>
                              <span className="text-sm font-extrabold text-amber-500 font-mono">{student.xpPoints} XP</span>
                            </div>
                            <div className="text-center">
                              <span className="text-[10px] text-slate-500 uppercase font-bold block font-mono">Assiduité</span>
                              <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
                                <Star className="w-3 h-3 fill-emerald-400 text-emerald-400" /> Max
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* --- TEACHER TAB 5: PUBLIER UN PROGRAMME (EXAM CALENDAR) --- */}
            {activeTab === "teacher_calendar" && profile.role === "teacher" && (
              <div className="space-y-6">
                <div className={`p-6 rounded-3xl border ${
                  darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <div className="border-b border-slate-850 pb-4 mb-6">
                    <span className="text-[10px] text-emerald-400 font-mono font-bold block uppercase tracking-wider">Planification Académique</span>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-emerald-400" />
                      Publier un programme (Examens & Évaluations)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Event Publisher Form */}
                    <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950 border border-slate-850/80">
                      <span className="text-[10px] text-emerald-400 font-mono font-bold block uppercase tracking-wide mb-3">Enregistrer un nouvel examen ou TP</span>
                      
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        if (!examTitle.trim() || !examDate || !examDesc.trim()) {
                          alert("Veuillez remplir tous les champs.");
                          return;
                        }

                        const newEvent: CalendarEvent = {
                          id: "evt_" + Math.random().toString(),
                          title: examTitle.trim(),
                          date: examDate,
                          type: examType,
                          description: examDesc.trim()
                        };

                        setCalendarEvents(prev => [newEvent, ...prev]);
                        
                        // Send notification to students
                        setNotifications(prev => [
                          {
                            id: "notif_evt_" + Math.random().toString(),
                            title: `📅 Nouveau Programme Publié : ${newEvent.type}`,
                            content: `Votre enseignant a planifié "${newEvent.title}" pour le ${newEvent.date}. Consignes : ${newEvent.description}`,
                            type: "system",
                            date: new Date().toISOString().split('T')[0],
                            read: false
                          },
                          ...prev
                        ]);

                        setExamTitle("");
                        setExamDate("");
                        setExamDesc("");
                        alert("Le programme d'examen a été enregistré avec succès et notifié aux élèves.");
                      }} className="space-y-4 text-xs">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Type d'événement</label>
                          <select 
                            value={examType}
                            onChange={e => setExamType(e.target.value as any)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
                          >
                            <option value="Examen">📝 Examen Semestriel</option>
                            <option value="Devoir">✏️ Devoir Contrôlé</option>
                            <option value="TP">🔬 T.P d'Informatique</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Titre du Programme</label>
                          <input 
                            type="text"
                            required
                            value={examTitle}
                            onChange={e => setExamTitle(e.target.value)}
                            placeholder="Ex: Examen Final Pratique de Windows"
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Date programmée</label>
                          <input 
                            type="date"
                            required
                            value={examDate}
                            onChange={e => setExamDate(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Description & Recommandation</label>
                          <textarea 
                            rows={3}
                            required
                            value={examDesc}
                            onChange={e => setExamDesc(e.target.value)}
                            placeholder="Ex: Révisez le chapitre sur les dossiers et les raccourcis."
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white"
                          />
                        </div>

                        <button 
                          type="submit"
                          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                        >
                          Diffuser le Programme
                        </button>
                      </form>
                    </div>

                    {/* Published Schedule */}
                    <div className="lg:col-span-7 space-y-4">
                      <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wide block">Calendrier Actuel ({calendarEvents.length})</span>
                      
                      {calendarEvents.length === 0 ? (
                        <p className="text-slate-500 text-xs italic">Aucun examen publié.</p>
                      ) : (
                        <div className="space-y-3">
                          {calendarEvents.map(evt => (
                            <div key={evt.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex justify-between items-start gap-3">
                              <div>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono uppercase ${
                                  evt.type === "Examen" ? "bg-rose-500/10 text-rose-450" : "bg-emerald-500/10 text-emerald-400"
                                }`}>
                                  {evt.type}
                                </span>
                                <h5 className="text-xs font-bold text-white mt-1.5">{evt.title}</h5>
                                <p className="text-[11px] text-slate-400 mt-1">{evt.description}</p>
                                <span className="text-[10px] text-indigo-400 font-mono block mt-2">Prévu le : {evt.date}</span>
                              </div>
                              <button 
                                onClick={() => {
                                  setCalendarEvents(prev => prev.filter(e => e.id !== evt.id));
                                }}
                                className="text-slate-500 hover:text-rose-400 p-1 text-[10px] font-mono font-bold"
                              >
                                RETIRER
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* --- TEACHER TAB 6: MESSAGERIE SCOLAIRE (STUDENT CONCERNS) --- */}
            {activeTab === "teacher_messaging" && profile.role === "teacher" && (
              <div className="space-y-6">
                <div className={`p-6 rounded-3xl border ${
                  darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <div className="border-b border-slate-850 pb-4 mb-6">
                    <span className="text-[10px] text-emerald-400 font-mono font-bold block uppercase tracking-wider">Traitement des Préoccupations</span>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-emerald-400" />
                      Messagerie Scolaire - Assistance Individuelle
                    </h3>
                  </div>

                  {studentConcerns.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 italic">Aucune préoccupation d'élève enregistrée.</div>
                  ) : (
                    <div className="space-y-4">
                      {studentConcerns.map(c => {
                        const isReplying = replyingConcernId === c.id;

                        return (
                          <div key={c.id} className={`p-4 rounded-2xl bg-slate-950 border transition-all ${
                            c.status === "resolved" ? "border-slate-900 opacity-80" : "border-emerald-500/20"
                          }`}>
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <span className="text-xs font-bold text-white font-mono block">{c.studentName}</span>
                                <span className="text-[10px] text-slate-500">ID: {c.studentId} • {c.date}</span>
                              </div>
                              <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                                c.status === "pending" ? "bg-amber-500/10 text-amber-400 animate-pulse" : "bg-emerald-500/10 text-emerald-400"
                              }`}>
                                {c.status === "pending" ? "En attente" : "Répondu"}
                              </span>
                            </div>

                            <div className="mt-3 bg-slate-900 p-3 rounded-xl border border-slate-800/60 italic text-xs text-slate-300">
                              "{c.content}"
                            </div>

                            {c.status === "pending" && (
                              <div className="mt-4 pt-3 border-t border-slate-900/40">
                                {!isReplying ? (
                                  <button 
                                    onClick={() => {
                                      setReplyingConcernId(c.id);
                                      setConcernResponseText("");
                                    }}
                                    className="py-1.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold"
                                  >
                                    Traiter et Répondre
                                  </button>
                                ) : (
                                  <div className="space-y-3">
                                    <textarea 
                                      rows={2}
                                      value={concernResponseText}
                                      onChange={e => setConcernResponseText(e.target.value)}
                                      placeholder="Écrivez votre réponse pédagogique personnalisée ici..."
                                      className="w-full text-xs rounded-xl px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 focus:outline-none"
                                    />
                                    <div className="flex gap-2 justify-end">
                                      <button onClick={() => setReplyingConcernId(null)} className="text-xs text-slate-500 hover:text-white px-2">Annuler</button>
                                      <button 
                                        onClick={() => handleReplyToConcern(c.id)}
                                        className="py-1.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold"
                                      >
                                        Envoyer la Réponse
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {c.status === "resolved" && (
                              <div className="mt-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-xs">
                                <span className="font-extrabold text-emerald-400 text-[9px] uppercase font-mono block">Réponse apportée :</span>
                                <p className="text-slate-300 mt-1">"{c.response}"</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* --- TEACHER TAB 7: ÉLÈVES CONNECTÉS ACTUELLEMENT (SESSION TRACKING) --- */}
            {activeTab === "teacher_online_students" && profile.role === "teacher" && (
              <div className="space-y-6">
                <div className={`p-6 rounded-3xl border ${
                  darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <div className="border-b border-slate-850 pb-4 mb-6">
                    <span className="text-[10px] text-emerald-400 font-mono font-bold block uppercase tracking-wider">Suivi des Activités Systèmes</span>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-emerald-400" />
                      Élèves connectés actuellement & Historique
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Active Sessions */}
                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-850">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-wide font-mono">
                          Élèves connectés EN CE MOMENT (1)
                        </h4>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-850 flex justify-between items-center text-xs">
                        <div>
                          <h5 className="font-bold text-white">Jean Mubala</h5>
                          <span className="text-[10px] text-emerald-400 font-mono">Actif sur le Simulateur de Bureau</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">ID: std_jean_mubala</span>
                      </div>
                    </div>

                    {/* Historical Connections sorted by day, hour, year */}
                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-850">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wide font-mono mb-4">
                        Historique complet des connexions (Bien structuré)
                      </h4>

                      <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                        {connectionSessions.map(sess => (
                          <div key={sess.id} className="p-3 rounded-xl bg-slate-900 border border-slate-850 flex justify-between items-center text-xs text-slate-300">
                            <div>
                              <span className="font-bold text-white">{sess.studentName}</span>
                              <span className="text-[10px] text-slate-500 block">ID: {sess.studentId}</span>
                            </div>
                            <div className="text-right font-mono text-[10px]">
                              <span className="text-slate-400 block font-bold">Année : {sess.year}</span>
                              <span className="text-indigo-400">{sess.day} à {sess.hour}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* --- TEACHER TAB 8: CARNET DE CÔTES DES ÉLÈVES --- */}
            {activeTab === "teacher_grades" && profile.role === "teacher" && (
              <div className="space-y-6">
                <div className={`p-6 rounded-3xl border ${
                  darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <div className="border-b border-slate-850 pb-4 mb-6 flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold block uppercase tracking-wider">Carnet de Notes</span>
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Award className="w-5 h-5 text-emerald-400" />
                        Côtes des élèves & Diffusion sécurisée
                      </h3>
                    </div>
                    {validatedGrades.filter(g => !g.published).length > 0 && (
                      <button 
                        onClick={() => {
                          // Secure bulk publication with direct individual studentId checks
                          const gradesToPub = validatedGrades.filter(g => !g.published);
                          if (gradesToPub.length === 0) return;

                          setNotifications(old => {
                            const newNotifs = [...old];
                            gradesToPub.forEach(g => {
                              newNotifs.unshift({
                                id: "notif_secured_" + Math.random().toString(),
                                studentId: g.studentId, // STRICT SECURE CHECKPOINT - studentId constraint matched!
                                title: `🎯 Note publiée : ${g.homeworkCategory}`,
                                content: `Votre professeur a publié votre note pour "${g.homeworkTitle}". Note : ${g.grade} / 20. Appréciation : ${g.comment}`,
                                type: "certificate",
                                date: new Date().toISOString().split('T')[0],
                                read: false
                              });
                            });
                            return newNotifs;
                          });

                          setValidatedGrades(prev => prev.map(g => ({ ...g, published: true })));
                          alert("Sécurité validée ! Toutes les notes en attente ont été diffusées individuellement à chaque élève concerné. Aucun élève ne verra la note d'un autre.");
                        }}
                        className="py-1.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow"
                      >
                        Tout diffuser à la classe (Envoi sécurisé)
                      </button>
                    )}
                  </div>

                  {validatedGrades.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 italic bg-slate-950 rounded-2xl border border-slate-900">
                      Aucune côte n'est disponible. Veuillez d'abord corriger des copies d'élèves dans le menu de l'Assistant IA.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {validatedGrades.map(g => (
                        <div key={g.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex justify-between items-center flex-wrap gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{g.studentName}</span>
                              <span className="text-[10px] text-slate-500 font-mono">ID Élève : {g.studentId} (Vérifié)</span>
                            </div>
                            <span className="text-xs text-indigo-400 block mt-1">
                              {g.homeworkCategory} : {g.homeworkTitle}
                            </span>
                            <p className="text-[11px] text-slate-400 mt-0.5 font-medium italic">
                              Appréciation : "{g.comment}"
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-center bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                              <span className="text-[9px] text-slate-500 font-bold block uppercase font-mono">Note</span>
                              <span className="text-lg font-mono font-black text-emerald-400">{g.grade} / 20</span>
                            </div>

                            <div className="flex flex-col gap-1.5">
                              {g.published ? (
                                <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase flex items-center gap-1">
                                  <CheckCircle className="w-3.5 h-3.5" /> Diffusé
                                </span>
                              ) : (
                                <button 
                                  onClick={() => {
                                    // Secure single publication with strict check on studentId
                                    if (!g.studentId) {
                                      alert("Erreur de sécurité : ID élève manquant.");
                                      return;
                                    }

                                    setNotifications(old => [
                                      {
                                        id: "notif_single_secured_" + Math.random().toString(),
                                        studentId: g.studentId, // Strict checking!
                                        title: `🎯 Votre note : ${g.homeworkCategory}`,
                                        content: `Votre professeur a publié votre note pour "${g.homeworkTitle}". Note : ${g.grade} / 20. Commentaire : ${g.comment}`,
                                        type: "certificate",
                                        date: new Date().toISOString().split('T')[0],
                                        read: false
                                      },
                                      ...old
                                    ]);

                                    setValidatedGrades(prev => prev.map(item => item.id === g.id ? { ...item, published: true } : item));
                                    alert(`La note a été envoyée de manière sécurisée uniquement à ${g.studentName} (ID: ${g.studentId}).`);
                                  }}
                                  className="py-1 px-3 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold font-mono"
                                >
                                  Diffuser à cet élève
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* --- TEACHER TAB 9: KEY GENERATION & REVOCATION (GESTION DE LA CLÉ D'ACCÈS) --- */}
            {activeTab === "teacher_key" && profile.role === "teacher" && (
              <div className="space-y-6">
                <div className={`p-6 lg:p-8 rounded-3xl border transition-all ${
                  darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <div className="border-b border-slate-850 pb-5 mb-6">
                    <span className="text-[10px] text-emerald-400 font-mono font-bold block uppercase tracking-wider mb-1">Espace Sécurisé</span>
                    <h3 className="text-xl lg:text-2xl font-extrabold text-white flex items-center gap-2">
                      <Key className="w-6 h-6 text-yellow-400" />
                      Gestion de la Clé d'Accès de la Classe
                    </h3>
                    <p className="text-xs text-slate-400 mt-2">
                      Générez, modifiez et distribuez la clé unique d'accès pour vos élèves. Si vous régénérez cette clé, tous les élèves actuellement connectés perdront instantanément l'accès et devront s'authentifier à nouveau avec la nouvelle clé.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Key Status Panel */}
                    <div className="lg:col-span-7 space-y-6">
                      <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-850 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <span className="text-[10px] text-slate-500 font-mono font-bold uppercase block mb-1">Clé Active Actuelle</span>
                          <span className="text-3xl font-black font-mono tracking-wider text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl inline-block border border-emerald-500/20">
                            {teacherAccessKey}
                          </span>
                        </div>
                        <button
                          onClick={regenerateTeacherKey}
                          className="flex items-center gap-2 py-3 px-5 rounded-xl bg-amber-600 hover:bg-amber-500 hover:scale-[1.02] active:scale-[0.98] text-white text-xs font-bold font-mono transition-all duration-200 shadow-lg shadow-amber-900/10"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Régénérer la clé d'accès
                        </button>
                      </div>

                      {/* Informative text cards */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-300">Règles importantes d'utilisation de la clé :</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400">
                          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-850/60 space-y-2">
                            <h5 className="font-bold text-white flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                              Connexion Simple
                            </h5>
                            <p>
                              Les élèves entrent cette clé dans leur espace "Classe Active" pour lier leur profil à vos cours diffusés, quiz et devoirs.
                            </p>
                          </div>

                          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-850/60 space-y-2">
                            <h5 className="font-bold text-white flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                              Révocation Globale
                            </h5>
                            <p>
                              Dès que vous cliquez sur "Régénérer", les sessions de tous les élèves utilisant l'ancienne clé sont révoquées immédiatement et en temps réel.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick copy & distribution helper */}
                    <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950/80 border border-slate-850 space-y-4 text-xs">
                      <h4 className="font-bold text-white flex items-center gap-1.5">
                        <Share2 className="w-4 h-4 text-emerald-400" />
                        Distribution Rapide
                      </h4>
                      <p className="text-slate-400 leading-relaxed">
                        Copiez le texte d'invitation ci-dessous pour l'envoyer directement à vos élèves ou l'afficher au tableau en classe :
                      </p>
                      
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 font-mono text-slate-300 space-y-2 break-all select-all hover:bg-slate-900/60 transition-colors cursor-pointer" onClick={() => {
                        navigator.clipboard.writeText(`Bonjour chers élèves de la 7ème année, rejoignez notre classe virtuelle MTIC en utilisant la clé d'accès : ${teacherAccessKey}`);
                        alert("Texte d'invitation copié dans le presse-papiers !");
                      }}>
                        <p className="text-slate-500 text-[10px] uppercase font-bold border-b border-slate-850 pb-1 mb-2">Message d'invitation (Cliquer pour copier) :</p>
                        "Bonjour chers élèves de la 7ème année, rejoignez notre classe virtuelle MTIC en utilisant la clé d'accès : <span className="text-emerald-400 font-bold">{teacherAccessKey}</span>"
                      </div>

                      <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-300">
                        <p className="font-bold mb-1">💡 Astuce de classe :</p>
                        Vous pouvez changer de clé à chaque nouveau trimestre ou après chaque évaluation majeure pour garder un contrôle d'accès strict sur votre espace.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- VIEW 9: ADMIN PORTAL --- */}
            {activeTab === "admin_dashboard" && profile.role === "admin" && (
              <div className="space-y-6">
                <div className={`p-6 rounded-3xl border ${
                  darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <div className="border-b border-slate-850 pb-4 mb-6">
                    <span className="text-[10px] text-pink-400 font-mono font-bold block uppercase">Panneau de Contrôle Suprême</span>
                    <h3 className="text-lg font-bold text-white">Tableau de bord de l'Administrateur</h3>
                  </div>

                  {/* Administrative sub-navigation tabs */}
                  <div className="flex gap-2 p-1.5 bg-slate-950/60 rounded-2xl border border-slate-800/40 mb-6 max-w-md">
                    <button
                      onClick={() => setAdminActiveSubTab("users")}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                        adminActiveSubTab === "users"
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/15"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      Utilisateurs
                    </button>
                    <button
                      onClick={() => setAdminActiveSubTab("activities")}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                        adminActiveSubTab === "activities"
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/15"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      Activités
                    </button>
                    <button
                      onClick={() => setAdminActiveSubTab("settings")}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                        adminActiveSubTab === "settings"
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/15"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5" />
                      Configuration
                    </button>
                  </div>

                  {/* SUB-TAB 1: USERS LIST & MANAGEMENT */}
                  {adminActiveSubTab === "users" && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Gestion des Comptes d'Utilisateurs ({mockUsers.length})</h4>
                        <div className="relative w-full sm:w-64">
                          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                          <input
                            type="text"
                            placeholder="Rechercher par nom, email..."
                            value={adminSearchQuery}
                            onChange={(e) => setAdminSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      {adminSuccessMsg && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                          <p className="text-xs text-emerald-400 font-medium">✨ {adminSuccessMsg}</p>
                          <button onClick={() => setAdminSuccessMsg(null)} className="text-emerald-400 hover:text-white">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-slate-300">
                          <thead>
                            <tr className="border-b border-slate-800 text-left text-slate-500 text-[10px]">
                              <th className="pb-2 pl-2">Nom de l'utilisateur</th>
                              <th className="pb-2">Adresse E-mail</th>
                              <th className="pb-2">Rôle Attribué</th>
                              <th className="pb-2">Statut</th>
                              <th className="pb-2 pr-2 text-right">Actions Administratives</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mockUsers.filter(u => 
                              u.name.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
                              u.email.toLowerCase().includes(adminSearchQuery.toLowerCase())
                            ).map(u => {
                              const initials = u.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
                              const isSelf = u.email.toLowerCase() === profile.email.toLowerCase() || u.id === "admin_super";
                              return (
                                <tr key={u.id} className="border-b border-slate-800/40 hover:bg-slate-900/10">
                                  <td className="py-3 pl-2">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] ${
                                        u.role === "admin" ? "bg-pink-600 text-white" :
                                        u.role === "teacher" ? "bg-indigo-600 text-white" : "bg-emerald-600 text-white"
                                      }`}>
                                        {initials}
                                      </div>
                                      <div>
                                        <p className="font-semibold text-white flex items-center gap-1.5">
                                          {u.name}
                                          {isSelf && <span className="text-[9px] bg-indigo-500/10 text-indigo-400 font-mono px-1.5 py-0.2 rounded">Moi</span>}
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                  <td>{u.email}</td>
                                  <td className="capitalize font-mono text-[10px] text-indigo-400 font-bold">
                                    {u.role === "student" ? "Élève" : u.role === "teacher" ? "Enseignant" : "Administrateur"}
                                  </td>
                                  <td>
                                    {u.isBanned ? (
                                      <span className="inline-flex items-center gap-1 text-[10px] text-red-400 font-semibold bg-red-500/10 px-2 py-0.5 rounded-full">
                                        🚫 Banni
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                        ⚡ Actif
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-3 pr-2 text-right space-x-2">
                                    <button 
                                      onClick={() => {
                                        setProfile(prev => ({ ...prev, role: u.role, name: u.name, email: u.email }));
                                        setAdminSuccessMsg(`Changement de profil temporaire. Vous émulez maintenant ${u.name}.`);
                                      }}
                                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 text-[10px] font-bold text-slate-300 transition-colors"
                                    >
                                      Émuler
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setAdminSuccessMsg(`Le mot de passe de ${u.name} a été réinitialisé à 'EduCongo123'.`);
                                      }}
                                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 text-[10px] font-bold text-slate-300 transition-colors"
                                    >
                                      Reset MDP
                                    </button>
                                    
                                    {!isSelf && (
                                      <>
                                        <button 
                                          onClick={() => {
                                            handleBanUser(u);
                                            setAdminSuccessMsg(`L'utilisateur ${u.name} a été ${u.isBanned ? "réactivé (débanni)" : "suspendu (banni)"} de la plate-forme.`);
                                          }}
                                          className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                                            u.isBanned 
                                              ? "bg-emerald-600 hover:bg-emerald-500 text-white" 
                                              : "bg-amber-600 hover:bg-amber-500 text-white"
                                          }`}
                                        >
                                          {u.isBanned ? "Débannir" : "Bannir"}
                                        </button>

                                        {userToDelete === u.id ? (
                                          <span className="inline-flex gap-1 items-center bg-slate-950 p-1 rounded-lg border border-red-500/25">
                                            <span className="text-[9px] text-red-400 font-bold px-1 font-mono">Confirmer ?</span>
                                            <button
                                              onClick={() => {
                                                handleDeleteUser(u.id);
                                                setUserToDelete(null);
                                                setAdminSuccessMsg(`L'utilisateur ${u.name} a été définitivement supprimé de la plate-forme.`);
                                              }}
                                              className="px-1.5 py-0.5 rounded bg-red-600 text-white text-[9px] font-bold font-mono"
                                            >
                                              Oui
                                            </button>
                                            <button
                                              onClick={() => setUserToDelete(null)}
                                              className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[9px] font-bold font-mono"
                                            >
                                              Non
                                            </button>
                                          </span>
                                        ) : (
                                          <button 
                                            onClick={() => setUserToDelete(u.id)}
                                            className="px-2 py-1 rounded bg-red-600 hover:bg-red-500 text-[10px] font-bold text-white transition-colors"
                                          >
                                            Supprimer
                                          </button>
                                        )}
                                      </>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 2: GLOBAL ACTIVITIES (PREVIOUS CORE VIEW) */}
                  {adminActiveSubTab === "activities" && (
                    <div className="space-y-6">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-2 font-mono">
                        <Layers className="w-4 h-4 text-pink-400" />
                        SUIVI GLOBAL DES ACTIVITÉS DE LA PLATEFORME (ADMINISTRATEUR)
                      </h4>

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        
                        {/* Column 1: Publications des Enseignants */}
                        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-850 space-y-4">
                          <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                            <h5 className="text-xs font-bold text-emerald-400 font-mono uppercase flex items-center gap-2">
                              <BookOpen className="w-4 h-4" />
                              Publications des Enseignants
                            </h5>
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-mono font-bold">
                              {teacherPublications.length}
                            </span>
                          </div>

                          {teacherPublications.length === 0 ? (
                            <p className="text-slate-500 text-xs italic">Aucune publication sur la plateforme.</p>
                          ) : (
                            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                              {teacherPublications.map(pub => (
                                <div key={pub.id} className="p-3 rounded-xl bg-slate-900 border border-slate-900/60 text-xs">
                                  <div className="flex justify-between items-start gap-2">
                                    <span className="font-bold text-white">{pub.teacherName}</span>
                                    <span className="text-[9px] text-slate-500 font-mono">{pub.date}</span>
                                  </div>
                                  <h6 className="text-xs font-bold text-indigo-400 mt-1">{pub.title}</h6>
                                  <p className="text-slate-400 mt-1 line-clamp-2 leading-relaxed">{pub.content}</p>
                                  <span className="inline-block mt-2 px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[8px] font-mono font-bold">
                                    {pub.category}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Column 2: Réactions & Appréciations des Élèves */}
                        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-850 space-y-4">
                          <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                            <h5 className="text-xs font-bold text-indigo-400 font-mono uppercase flex items-center gap-2">
                              <Heart className="w-4 h-4" />
                              Réactions & Appréciations des Élèves
                            </h5>
                            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full font-mono font-bold">
                              {lessonReactions.length}
                            </span>
                          </div>

                          {lessonReactions.length === 0 ? (
                            <p className="text-slate-500 text-xs italic">Aucune réaction enregistrée pour le moment.</p>
                          ) : (
                            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                              {lessonReactions.map(reaction => {
                                const reactionIcons = {
                                  like: "👍 J'aime",
                                  dislike: "👎 Je n'aime pas",
                                  confused: "🤔 Je n'ai pas compris"
                                };
                                return (
                                  <div key={reaction.id} className="p-3 rounded-xl bg-slate-900 border border-slate-900/60 text-xs flex justify-between items-center gap-3">
                                    <div>
                                      <span className="font-extrabold text-slate-200">{reaction.studentName}</span>
                                      <p className="text-slate-500 text-[10px] mt-0.5">Sur la leçon: {reaction.lessonTitle}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-xl text-[10px] font-bold font-mono ${
                                      reaction.type === "like" ? "bg-emerald-500/10 text-emerald-400" :
                                      reaction.type === "dislike" ? "bg-rose-500/10 text-rose-450" : "bg-amber-500/10 text-amber-400"
                                    }`}>
                                      {reactionIcons[reaction.type as keyof typeof reactionIcons] || "🤔"}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Column 3: Résultats des Examens & Devoirs */}
                        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-850 space-y-4">
                          <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                            <h5 className="text-xs font-bold text-amber-400 font-mono uppercase flex items-center gap-2">
                              <Award className="w-4 h-4" />
                              Résultats des Élèves envoyés
                            </h5>
                            <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full font-mono font-bold">
                              {homeworkSubmissions.filter(s => s.status === "graded").length}
                            </span>
                          </div>

                          {homeworkSubmissions.filter(s => s.status === "graded").length === 0 ? (
                            <p className="text-slate-500 text-xs italic">Aucune note ou résultat enregistré pour le moment.</p>
                          ) : (
                            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                              {homeworkSubmissions.filter(s => s.status === "graded").map(sub => (
                                <div key={sub.id} className="p-3 rounded-xl bg-slate-900 border border-slate-900/60 text-xs space-y-1">
                                  <div className="flex justify-between items-center">
                                    <span className="font-bold text-slate-200">{sub.studentName}</span>
                                    <span className="text-emerald-400 font-mono font-extrabold">Note : {sub.grade} pts</span>
                                  </div>
                                  <div className="text-[10px] text-indigo-400 font-semibold">
                                    {sub.homeworkCategory} : {sub.homeworkTitle}
                                  </div>
                                  {sub.comment && (
                                    <p className="text-slate-400 italic text-[11px] bg-slate-950/45 p-2 rounded border border-slate-950">
                                      "{sub.comment}"
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Column 4: Soucis & Préoccupations des Élèves */}
                        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-850 space-y-4">
                          <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                            <h5 className="text-xs font-bold text-rose-400 font-mono uppercase flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" />
                              Soucis soumis par les Élèves
                            </h5>
                            <span className="text-[10px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded-full font-mono font-bold">
                              {studentConcerns.length}
                            </span>
                          </div>

                          {studentConcerns.length === 0 ? (
                            <p className="text-slate-500 text-xs italic">Aucun souci soumis par les élèves.</p>
                          ) : (
                            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                              {studentConcerns.map(c => (
                                <div key={c.id} className="p-3 rounded-xl bg-slate-900 border border-slate-900/60 text-xs space-y-1">
                                  <div className="flex justify-between items-start gap-2">
                                    <span className="font-bold text-slate-200">{c.studentName}</span>
                                    <span className="text-[9px] text-slate-500 font-mono">{c.date}</span>
                                  </div>
                                  <h6 className="text-[11px] font-bold text-red-400 uppercase">Problème : {c.title}</h6>
                                  <p className="text-slate-350 italic">"{c.content}"</p>
                                  <div className="pt-1">
                                    {c.status === "resolved" ? (
                                      <div className="p-2 rounded bg-emerald-500/5 text-[10px] text-emerald-400 border border-emerald-500/10">
                                        <span className="font-bold font-mono">Professeur Mubenga a résolu :</span> "{c.response}"
                                      </div>
                                    ) : (
                                      <span className="text-[9px] text-amber-500 font-mono font-bold uppercase animate-pulse">
                                        ⏳ Non résolu par l'Enseignant
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 3: SYSTEM CONFIGURATION & SECURITY CODES */}
                  {adminActiveSubTab === "settings" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850">
                          <span className="text-[9px] font-mono text-slate-500 uppercase block">Total Apprenants</span>
                          <span className="text-2xl font-extrabold text-white font-mono">
                            {mockUsers.filter(u => u.role === "student").length}
                          </span>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850">
                          <span className="text-[9px] font-mono text-slate-500 uppercase block">Total Enseignants</span>
                          <span className="text-2xl font-extrabold text-indigo-400 font-mono">
                            {mockUsers.filter(u => u.role === "teacher").length}
                          </span>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850">
                          <span className="text-[9px] font-mono text-slate-500 uppercase block">Rapports d'Erreurs / Alertes</span>
                          <span className="text-2xl font-extrabold text-rose-500 font-mono">0</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        {/* Left: Security Codes */}
                        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-850 space-y-4">
                          <h5 className="text-xs font-bold text-indigo-400 uppercase font-mono flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Codes de Sécurité Officiels (EPST)
                          </h5>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            Ces codes d'autorisation permettent de valider l'identité académique lors des enregistrements et changements de rôles.
                          </p>

                          <div className="space-y-3 pt-2 font-mono text-xs">
                            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/60 flex justify-between items-center">
                              <div>
                                <span className="text-[9px] text-slate-500 uppercase block">Code Accréditation Enseignant</span>
                                <span className="text-white font-bold font-mono">??Qw.1289?</span>
                              </div>
                              <span className="text-[9px] bg-slate-950 px-2 py-0.5 rounded text-indigo-400 border border-indigo-500/10 font-bold">PROFESSEUR</span>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/60 flex justify-between items-center">
                              <div>
                                <span className="text-[9px] text-slate-500 uppercase block">Code Accréditation Admin</span>
                                <span className="text-white font-bold font-mono">678-01_524</span>
                              </div>
                              <span className="text-[9px] bg-slate-950 px-2 py-0.5 rounded text-pink-400 border border-pink-500/10 font-bold">ADMINISTRATEUR</span>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/60 flex justify-between items-center">
                              <div>
                                <span className="text-[9px] text-slate-500 uppercase block">Mot de passe de Sécurité Admin</span>
                                <span className="text-white font-bold font-mono">Sa_@_isMb-Po</span>
                              </div>
                              <span className="text-[9px] bg-slate-950 px-2 py-0.5 rounded text-emerald-400 border border-emerald-500/10 font-bold">SUPERPASSWORD</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Audit Trail */}
                        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-850 space-y-4">
                          <h5 className="text-xs font-bold text-pink-400 uppercase font-mono flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Journal de Sécurité & d'Audit
                          </h5>
                          
                          <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                            <div className="border-l-2 border-indigo-500 pl-3 py-0.5">
                              <p className="text-xs text-white font-semibold">Connexion Admin réussie</p>
                              <p className="text-[9px] text-slate-500 font-mono">pobajeremie93@gmail.com • Aujourd'hui à 08:00</p>
                            </div>
                            <div className="border-l-2 border-pink-500 pl-3 py-0.5">
                              <p className="text-xs text-white font-semibold">Modification des accès de sécurité</p>
                              <p className="text-[9px] text-slate-500 font-mono">Fichiers système mis à jour • Hier à 17:15</p>
                            </div>
                            <div className="border-l-2 border-emerald-500 pl-3 py-0.5">
                              <p className="text-xs text-white font-semibold">Nouveau compte élève inscrit</p>
                              <p className="text-[9px] text-slate-500 font-mono">jean.mubala@ecolecongo.cd • 25 Juin 2026</p>
                            </div>
                            <div className="border-l-2 border-slate-600 pl-3 py-0.5">
                              <p className="text-xs text-white font-semibold">Initialisation de la base des cours</p>
                              <p className="text-[9px] text-slate-500 font-mono">Super Administrateur • 01 Juin 2026</p>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* CREDENTIALS LOGIN MODALS */}
      <AnimatePresence>
        {authModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-sm w-full space-y-4"
            >
              <div>
                <h3 className="text-base font-bold text-white capitalize">Vérification de sécurité : {authModal}</h3>
                <p className="text-[11px] text-slate-500">Veuillez renseigner les codes requis décrits dans le cahier des charges.</p>
              </div>

              {authError && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 p-2 text-xs rounded-xl text-center">
                  {authError}
                </div>
              )}

              <form onSubmit={handleRoleAuth} className="space-y-3.5">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 font-mono">Code de Vérification</label>
                  <input 
                    type="text" 
                    value={authCode}
                    onChange={e => setAuthCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 font-mono">Mot de passe</label>
                  <input 
                    type="password" 
                    value={authPassword}
                    onChange={e => setAuthPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    type="button"
                    onClick={() => setAuthModal(null)}
                    className="flex-grow py-2.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="flex-grow py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                  >
                    Vérifier & Ouvrir
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* USER PROFILE MODIFICATION MODAL */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative"
            >
              {/* Top gradient cover */}
              <div className="bg-gradient-to-r from-indigo-800 to-purple-800 h-24 relative">
                <button 
                  onClick={() => setIsProfileModalOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-950/40 hover:bg-slate-950/70 text-slate-300 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute -bottom-10 left-6">
                  <div className="relative group">
                    {/* Main Avatar Render */}
                    {selectedAvatar ? (
                      selectedAvatar.length <= 2 ? (
                        <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-4xl border-4 border-slate-900 shadow-xl">
                          {selectedAvatar}
                        </div>
                      ) : (
                        <img 
                          src={selectedAvatar} 
                          alt="Avatar" 
                          className="w-20 h-20 rounded-full object-cover border-4 border-slate-900 shadow-xl"
                          referrerPolicy="no-referrer"
                        />
                      )
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black border-4 border-slate-900 shadow-xl">
                        {profileNameInput ? profileNameInput[0].toUpperCase() : "U"}
                      </div>
                    )}

                    {/* Quick photo overlay icon */}
                    <label 
                      className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                    >
                      <Camera className="w-6 h-6 text-white" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleAvatarFileChange} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6 pt-14 space-y-5">
                <div>
                  <h3 className="text-base font-bold text-white">Personnaliser le Profil</h3>
                  <p className="text-[11px] text-slate-400">Configurez votre nom d'affichage et votre image de profil pour la classe.</p>
                </div>

                <div className="space-y-4">
                  {/* Name Input */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5 font-mono">
                      Nom complet (Élève / Enseignant)
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={profileNameInput}
                        onChange={e => setProfileNameInput(e.target.value)}
                        placeholder="Ex: Jean Mubala"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors font-semibold"
                      />
                      <Edit3 className="w-3.5 h-3.5 text-slate-500 absolute right-3.5 top-3.5" />
                    </div>
                  </div>

                  {/* Avatar Selectors */}
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase font-bold text-slate-400 font-mono">
                      Choisir un Avatar thématique
                    </label>
                    
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { label: "Élève G", value: "🧑‍🎓" },
                        { label: "Élève F", value: "👩‍🎓" },
                        { label: "Ordinateur", value: "💻" },
                        { label: "Robot", value: "🤖" },
                        { label: "Enseignante", value: "👩‍🏫" },
                        { label: "Enseignant", value: "👨‍🏫" },
                        { label: "Fusée", value: "🚀" },
                        { label: "Étoile", value: "🌟" },
                        { label: "Cerveau", value: "🧠" },
                        { label: "Codeur", value: "👨‍💻" },
                      ].map(av => {
                        const isChosen = selectedAvatar === av.value;
                        return (
                          <button
                            key={av.label}
                            type="button"
                            onClick={() => setSelectedAvatar(av.value)}
                            className={`h-11 rounded-xl bg-slate-950/60 hover:bg-slate-950 border text-lg flex items-center justify-center transition-all relative ${
                              isChosen ? "border-indigo-500 bg-slate-950 scale-105 shadow-md shadow-indigo-500/10" : "border-slate-800/80"
                            }`}
                            title={av.label}
                          >
                            {av.value}
                            {isChosen && (
                              <div className="absolute bottom-1 right-1 bg-indigo-500 rounded-full p-0.5 text-white">
                                <Check className="w-2 h-2" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Upload File Zone */}
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase font-bold text-slate-400 font-mono">
                      Ou importer une photo personnalisée
                    </label>
                    
                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer relative ${
                        isDraggingFile 
                          ? "border-indigo-500 bg-indigo-950/20 text-white" 
                          : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:bg-slate-950/70"
                      }`}
                    >
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleAvatarFileChange} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      />
                      <div className="space-y-1.5 flex flex-col items-center justify-center">
                        <Upload className="w-5 h-5 text-indigo-400" />
                        <div className="text-[11px] font-semibold">
                          Déposez votre photo ici, ou <span className="text-indigo-400">parcourez</span>
                        </div>
                        <p className="text-[9px] text-slate-500">Formats acceptés : PNG, JPG, GIF (Max: 2 Mo)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="flex gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setIsProfileModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    type="button"
                    onClick={handleSaveProfile}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/10 transition-colors"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PRINTABLE / VIEWABLE DIPLOMA MODAL */}
      <AnimatePresence>
        {activeCertForView && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur z-[100] flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white text-slate-900 border border-slate-300 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl p-12 space-y-8 font-sans"
            >
              {/* Certificate Inner Design */}
              <div className="border-[8px] border-double border-indigo-900 p-8 flex flex-col justify-between items-center text-center space-y-6 relative">
                
                {/* Visual Official seal */}
                <div className="absolute top-6 left-6 text-[9px] uppercase tracking-widest font-bold text-indigo-900 font-mono">
                  République Démocratique du Congo • EPST
                </div>

                {/* Profile Photo Frame */}
                <div className="absolute top-6 right-6 w-24 h-32 border-2 border-dashed border-indigo-900/20 rounded-xl bg-slate-50/50 flex items-center justify-center overflow-hidden">
                  {profile.avatarUrl ? (
                    profile.avatarUrl.length <= 2 ? (
                      <span className="text-4xl select-none">{profile.avatarUrl}</span>
                    ) : (
                      <img 
                        src={profile.avatarUrl} 
                        alt="Photo de l'élève" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    )
                  ) : null}
                </div>

                <div className="space-y-1">
                  <div className="w-12 h-12 rounded-full bg-indigo-900 text-white flex items-center justify-center mx-auto text-lg mb-2">
                    🎓
                  </div>
                  <h2 className="text-3xl font-black text-indigo-950 tracking-tight uppercase">
                    Brevet d'Aptitude Numérique
                  </h2>
                  <p className="text-xs uppercase tracking-wider font-mono text-slate-400">7ème Année de l'Éducation de Base</p>
                </div>

                <div className="space-y-2 max-w-lg">
                  <p className="text-xs italic text-slate-500">Le Ministère de l'Enseignement Primaire, Secondaire et Technique certifie que :</p>
                  <h3 className="text-2xl font-black text-indigo-900 tracking-tight">{activeCertForView.studentName}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    A complété avec brio l'ensemble des modules d'évaluation théoriques et les laboratoires d'ordinateurs simulés pour le syllabus <strong>{activeCertForView.subject}</strong>.
                  </p>
                </div>

                <div className="w-full flex justify-between items-end pt-8 border-t border-slate-100 text-xs text-slate-500 font-mono">
                  <div className="text-left">
                    <span>Délivré le : <strong>{activeCertForView.dateObtained}</strong></span><br />
                    <span>Clé unique : <strong>{activeCertForView.id}</strong></span>
                  </div>
                  
                  {/* Mock QR Code */}
                  <div className="w-20 h-20 border-2 border-slate-300 p-1 bg-white rounded-lg flex items-center justify-center font-mono text-[6px]">
                    [ QR VERIFY ]
                  </div>

                  <div className="text-right">
                    <span>Signature Enseignant :</span><br />
                    <span className="font-semibold italic text-indigo-900">{activeCertForView.teacherName}</span>
                  </div>
                </div>

              </div>

              {/* Back controls */}
              <div className="flex gap-4 justify-end">
                <button 
                  onClick={() => setActiveCertForView(null)}
                  className="py-2.5 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Fermer
                </button>
                <button 
                  onClick={() => handleDownloadCertificate(activeCertForView)}
                  className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <FileDown className="w-4 h-4" /> Télécharger le Brevet
                </button>
                <button 
                  onClick={() => window.print()}
                  className="py-2.5 px-6 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <FileDown className="w-4 h-4" /> Imprimer le Diplôme
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ACTIVE LAB MODAL OVERLAY */}
      {activeLabExercise && (
        <SimulatedDesktop 
          exerciseId={activeLabExercise.id}
          instructions={activeLabExercise.instructions}
          validationRule={activeLabExercise.validationRule}
          onSuccess={handleLabSuccess}
          onClose={() => setActiveLabExercise(null)}
        />
      )}

    </div>
  );
}
