/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import LearningPortal from "./components/LearningPortal";
import AuthScreen from "./components/AuthScreen";
import { UserProfile } from "./types";

export default function App() {
  // One-time platform reset to clean up all test sessions and make the platform completely fresh for publication
  const RESET_VERSION = "v1.0.3_published";
  if (typeof window !== "undefined" && localStorage.getItem("edu_platform_reset") !== RESET_VERSION) {
    localStorage.removeItem("edu_profile_7eme");
    localStorage.removeItem("edu_registered_users");
    localStorage.removeItem("edu_deleted_users");
    localStorage.removeItem("edu_notifications");
    localStorage.removeItem("edu_teacher_publications");
    localStorage.removeItem("edu_lesson_reactions");
    localStorage.removeItem("edu_student_concerns");
    localStorage.removeItem("edu_homework_list");
    localStorage.removeItem("edu_homework_submissions");
    localStorage.removeItem("edu_custom_lessons");
    localStorage.setItem("edu_platform_reset", RESET_VERSION);
  }

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("edu_profile_7eme");
    return saved ? JSON.parse(saved) : null;
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("edu_theme");
    return saved ? saved === "dark" : true;
  });

  useEffect(() => {
    localStorage.setItem("edu_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("edu_profile_7eme");
    setCurrentUser(null);
  };

  const handleLoginSuccess = (profile: UserProfile) => {
    setCurrentUser(profile);
  };

  // If no user is logged in, show the AuthScreen wrapped in the theme
  if (!currentUser) {
    return (
      <div className={`min-h-screen ${darkMode ? "theme-dark-beige bg-slate-950" : "theme-light-transparent bg-slate-50"}`}>
        <AuthScreen onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "theme-dark-beige bg-slate-950" : "theme-light-transparent bg-slate-50"}`}>
      <LearningPortal onBackToMain={handleLogout} darkMode={darkMode} setDarkMode={setDarkMode} />
    </div>
  );
}
