/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// --- AD GENERATOR STUDIO TYPES ---

export type AdSizeId =
  | "medium_rectangle" // 300x250 (4:3-ish, highly common)
  | "leaderboard"      // 728x90 (8:1)
  | "skyscraper"       // 120x600 (1:5)
  | "wide_skyscraper"  // 160x600 (1:3.75)
  | "half_page"        // 300x600 (1:2)
  | "large_rectangle"  // 336x280 (1.2:1)
  | "mobile_leaderboard" // 320x50 (6.4:1)
  | "billboard"        // 970x250 (3.88:1)
  | "square"           // 250x250 (1:1)
  | "social_story"     // 1080x1920 (9:16)
  | "social_landscape" // 1200x628 (1.91:1)
  | "social_square";   // 1080x1080 (1:1)

export interface AdSize {
  id: AdSizeId;
  name: string;
  width: number;
  height: number;
  aspectRatio: string; // "1:1" | "16:9" | "9:16" | "4:3" | "3:4" | "4:1" | "1:4" etc.
  category: "Display" | "Mobile" | "Social" | "Skyscraper";
}

export interface AdGeneratorConfig {
  brandName: string;
  productDescription: string;
  websiteUrl: string;
  callToAction: string;
  stylePreset: "modern" | "vibrant" | "minimalist" | "corporate" | "playful" | "tech";
  model: "gemini-3-pro-image" | "gemini-3.1-flash-image";
  resolution: "1K" | "2K" | "4K";
  customColors?: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
}

export interface BannerAdAsset {
  headline: string;
  subheading: string;
  description: string;
  buttonText: string;
  imageUrl: string; // Gemini generated base64 or placeholder
  theme: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    buttonBg: string;
    buttonText: string;
  };
}


// --- EDUMTIC LEARNING PORTAL TYPES ---

export type UserRole = "student" | "teacher" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  emailConfirmed: boolean;
  streak: number;
  xpPoints: number;
  level: number;
  badges: string[]; // ids of unlocked badges
  completedLessons: string[]; // ids of lessons completed
  completedQuizzes: { [lessonId: string]: number }; // lessonId -> best score (%)
  completedExercises: { [lessonId: string]: string[] }; // lessonId -> list of completed exercises (types)
  favoriteLessons: string[]; // ids of lessons
  teacherCode?: string; // code to connect to teacher's space
  connectedOnceTeachers?: string[]; // list of teacher codes student connected to at least once
  isBanned?: boolean; // if true, user cannot log in
  createdAt: string;
}

export interface TeacherPublication {
  id: string;
  teacherCode: string;
  teacherName: string;
  title: string;
  content: string;
  category: "Cours" | "TP" | "Annonce";
  date: string;
}

export interface TeacherSpace {
  id: string;
  name: string;
  accessKey: string;
  teacherId: string;
  studentIds: string[];
}

export interface Lesson {
  id: string;
  title: string;
  level: string; // e.g. "7ème"
  category: string;
  imageUrl?: string;
  objectives: string[];
  contentSections: {
    title: string;
    body: string;
    bullets?: string[];
  }[];
  summary: string[];
  videos: {
    id: string;
    title: string;
    type: "local" | "youtube";
    url: string; // simulated file or actual YouTube embed
  }[];
  exercises: {
    id: string;
    title: string;
    description: string;
    type: "desktop" | "explorer" | "word" | "browser" | "email";
    instructions: string[];
    validationRule: string; // condition to meet
  }[];
  quiz: {
    questions: {
      id: string;
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    }[];
    passingScore: number; // e.g. 70
  };
  resources: {
    title: string;
    type: "pdf" | "word" | "powerpoint" | "zip" | "link";
    size: string;
    downloadUrl: string;
  }[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  xpRequired: number;
  category: string;
}

export interface Certificate {
  id: string;
  studentName: string;
  studentId: string;
  subject: string;
  level: string;
  dateObtained: string;
  teacherName?: string;
  verificationCode: string;
  qrValue: string;
  type: "certificat" | "brevet";
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  type: "info" | "new_lesson" | "badge" | "certificate" | "system";
  date: string;
  read: boolean;
  studentId?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  content: string;
  timestamp: string;
  attachment?: {
    name: string;
    type: string;
    size: string;
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "exam" | "lesson" | "evaluation" | "general";
  description: string;
}

export interface HistoricalActivity {
  id: string;
  userId: string;
  type: "login" | "lesson_view" | "video_watch" | "quiz_complete" | "exercise_complete" | "certificate_earned";
  title: string;
  detail: string;
  timestamp: string;
}

// --- NEW PORTAL FEATURES TYPES ---

export interface LessonReaction {
  id: string;
  pubId: string;
  pubTitle: string;
  studentId: string;
  studentName: string;
  type: "like" | "dislike" | "not_understood"; // 👍 "j'aime", 👎 "je n'aime pas", 🤔 "je n'ai pas compris"
  date: string;
}

export interface StudentConcern {
  id: string;
  studentId: string;
  studentName: string;
  teacherCode: string;
  teacherName: string;
  title: string;
  content: string;
  status: "pending" | "resolved";
  response?: string;
  date: string;
}

export interface Homework {
  id: string;
  teacherCode: string;
  teacherName: string;
  title: string;
  category: "Devoir" | "TP" | "Exercice";
  description: string;
  question: string;
  corregiType: string; // expected answer key
  points: number;
  dateLimit: string;
  date: string;
}

export interface HomeworkSubmission {
  id: string;
  homeworkId: string;
  homeworkTitle: string;
  homeworkCategory: "Devoir" | "TP" | "Exercice";
  studentId: string;
  studentName: string;
  studentAnswer: string;
  teacherCode: string;
  status: "submitted" | "graded";
  grade?: number;
  comment?: string;
  correctedBy?: "teacher" | "ia";
  date: string;
}

