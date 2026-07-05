/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  GraduationCap, Shield, User, Lock, Mail, Users, ArrowRight, 
  Sparkles, Info, CheckCircle2, ChevronRight, Eye, EyeOff, X, Plus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, UserRole } from "../types";

interface AuthScreenProps {
  onLoginSuccess: (profile: UserProfile) => void;
}

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Form Fields
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [authCode, setAuthCode] = useState<string>(""); // For teacher/admin
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Google Sign-In States
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState<boolean>(false);
  const [googleEmailInput, setGoogleEmailInput] = useState<string>("");
  const [googleNameInput, setGoogleNameInput] = useState<string>("");
  const [googleSelectedRole, setGoogleSelectedRole] = useState<UserRole>("student");
  const [googleAuthCode, setGoogleAuthCode] = useState<string>("");
  const [googleStep, setGoogleStep] = useState<"choose" | "setup_role">("choose");
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [customGoogleEmail, setCustomGoogleEmail] = useState<string>("");
  const [customGoogleName, setCustomGoogleName] = useState<string>("");
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState<boolean>(false);

  // official test credentials
  const defaultCredentials = {
    student: {
      email: "jean.mubala@ecolecongo.cd",
      password: "password123",
      name: "Jean Mubala",
      id: "std_jean_mubala"
    },
    teacher: {
      email: "prof.mubenga@ecolecongo.cd",
      password: "Ens#i@an??",
      code: "??Qw.1289?",
      name: "Professeur Mubenga",
      id: "teacher_prof_mubenga"
    },
    admin: {
      email: "pobajeremie93@gmail.com",
      password: "Sa_@_isMb-Po",
      code: "678-01_524",
      name: "Super Administrateur",
      id: "admin_super"
    }
  };

  // Switch roles without pre-filling test credentials
  const handleQuickFill = (role: UserRole) => {
    setError(null);
    setSuccess(null);
    setSelectedRole(role);
    // Keep inputs clean for actual user entry
  };

  // Google Authentication Handlers
  const handleGoogleSignInClick = () => {
    setGoogleError(null);
    setGoogleStep("choose");
    setShowCustomGoogleInput(false);
    setCustomGoogleEmail("");
    setCustomGoogleName("");
    setIsGoogleModalOpen(true);
  };

  const handleSelectGoogleAccount = (gEmail: string, gName: string) => {
    setError(null);
    setSuccess(null);
    setGoogleError(null);
    
    const existingUsersStr = localStorage.getItem("edu_registered_users");
    const registeredUsers: UserProfile[] = existingUsersStr ? JSON.parse(existingUsersStr) : [];

    // Find any user with this email in registered list
    const foundUser = registeredUsers.find(u => u.email.toLowerCase() === gEmail.toLowerCase());
    
    if (foundUser && foundUser.isBanned) {
      setGoogleError("Ce compte a été banni par l'administrateur de la plate-forme.");
      return;
    }
    
    // Check default profiles
    let defaultRole: UserRole | null = null;
    let defaultName = gName;
    let defaultId = "";
    let defaultXp = 120;
    let defaultLevel = 2;

    if (gEmail.toLowerCase() === defaultCredentials.student.email.toLowerCase()) {
      defaultRole = "student";
      defaultName = defaultCredentials.student.name;
      defaultId = defaultCredentials.student.id;
    } else if (gEmail.toLowerCase() === defaultCredentials.teacher.email.toLowerCase()) {
      defaultRole = "teacher";
      defaultName = defaultCredentials.teacher.name;
      defaultId = defaultCredentials.teacher.id;
      defaultXp = 450;
      defaultLevel = 5;
    } else if (gEmail.toLowerCase() === defaultCredentials.admin.email.toLowerCase()) {
      defaultRole = "admin";
      defaultName = defaultCredentials.admin.name;
      defaultId = defaultCredentials.admin.id;
      defaultXp = 800;
      defaultLevel = 10;
    }

    if (foundUser) {
      // User is already registered! Sign them in instantly
      localStorage.setItem("edu_profile_7eme", JSON.stringify(foundUser));
      setSuccess(`Connexion Google réussie ! Bienvenue ${foundUser.name}`);
      setIsGoogleModalOpen(false);
      setTimeout(() => {
        onLoginSuccess(foundUser);
      }, 1000);
    } else if (defaultRole) {
      // Create session for default profile if chosen
      const loggedUser: UserProfile = {
        id: defaultId,
        name: defaultName,
        email: gEmail.toLowerCase(),
        role: defaultRole,
        emailConfirmed: true,
        streak: 5,
        xpPoints: defaultXp,
        level: defaultLevel,
        badges: defaultRole === "student" ? ["badge_welcome"] : [],
        completedLessons: defaultRole === "student" ? ["mtic_1_1"] : [],
        completedQuizzes: defaultRole === "student" ? { "mtic_1_1": 80 } : {},
        completedExercises: defaultRole === "student" ? { "mtic_1_1": ["desktop"] } : {},
        favoriteLessons: [],
        createdAt: new Date().toISOString()
      };
      localStorage.setItem("edu_profile_7eme", JSON.stringify(loggedUser));
      setSuccess(`Connexion Google réussie ! Bienvenue ${loggedUser.name}`);
      setIsGoogleModalOpen(false);
      setTimeout(() => {
        onLoginSuccess(loggedUser);
      }, 1000);
    } else {
      // Not registered yet. Forward to role setup step
      setGoogleEmailInput(gEmail);
      setGoogleNameInput(gName);
      setGoogleSelectedRole("student");
      setGoogleAuthCode("");
      setGoogleStep("setup_role");
    }
  };

  const handleCompleteGoogleRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleError(null);

    // Validate verification code for teachers/admins
    if (googleSelectedRole === "teacher" && googleAuthCode !== "??Qw.1289?") {
      setGoogleError("Le CODE ENSEIGNANT saisi est invalide.");
      return;
    } else if (googleSelectedRole === "admin") {
      if (googleEmailInput.trim().toLowerCase() !== "pobajeremie93@gmail.com") {
        setGoogleError("Seul le compte pobajeremie93@gmail.com est autorisé comme administrateur.");
        return;
      }
      if (googleAuthCode !== "678-01_524") {
        setGoogleError("Code d'accréditation Administrateur EPST invalide.");
        return;
      }
    }

    const newUser: UserProfile = {
      id: `usr_${Math.floor(Math.random() * 900000 + 100000)}`,
      name: googleNameInput.trim(),
      email: googleEmailInput.trim().toLowerCase(),
      role: googleSelectedRole,
      emailConfirmed: true,
      streak: 1,
      xpPoints: googleSelectedRole === "student" ? 0 : googleSelectedRole === "teacher" ? 100 : 200,
      level: 1,
      badges: ["badge_welcome"],
      completedLessons: [],
      completedQuizzes: {},
      completedExercises: {},
      favoriteLessons: [],
      createdAt: new Date().toISOString()
    };

    const existingUsersStr = localStorage.getItem("edu_registered_users");
    const registeredUsers: UserProfile[] = existingUsersStr ? JSON.parse(existingUsersStr) : [];
    registeredUsers.push(newUser);
    localStorage.setItem("edu_registered_users", JSON.stringify(registeredUsers));
    localStorage.setItem("edu_profile_7eme", JSON.stringify(newUser));

    setSuccess(`Compte Google créé ! Bienvenue ${newUser.name}`);
    setIsGoogleModalOpen(false);
    setTimeout(() => {
      onLoginSuccess(newUser);
    }, 1200);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs requis.");
      return;
    }

    if (!isLogin && !name.trim()) {
      setError("Veuillez saisir votre nom complet pour l'inscription.");
      return;
    }

    // Role-specific verification codes validation
    if (selectedRole === "teacher") {
      const codeToCheck = isLogin ? "??Qw.1289?" : "??Qw.1289?";
      if (authCode !== codeToCheck) {
        setError("Le CODE ENSEIGNANT saisi est invalide.");
        return;
      }
    } else if (selectedRole === "admin") {
      if (email.trim().toLowerCase() !== "pobajeremie93@gmail.com") {
        setError("Seul le compte pobajeremie93@gmail.com est autorisé comme administrateur.");
        return;
      }
      const codeToCheck = isLogin ? "678-01_524" : "678-01_524";
      if (authCode !== codeToCheck) {
        setError("Code d'accréditation Administrateur EPST invalide.");
        return;
      }
    }

    // Process Submission
    if (isLogin) {
      // Mock login validation
      const existingUsersStr = localStorage.getItem("edu_registered_users");
      const registeredUsers: UserProfile[] = existingUsersStr ? JSON.parse(existingUsersStr) : [];

      // Check default credentials or registered users
      const defaultCred = defaultCredentials[selectedRole];
      let loggedUser: UserProfile | null = null;

      if (email.trim() === defaultCred.email && password === defaultCred.password) {
        loggedUser = {
          id: defaultCred.id,
          name: defaultCred.name,
          email: defaultCred.email,
          role: selectedRole,
          emailConfirmed: true,
          streak: 5,
          xpPoints: selectedRole === "student" ? 120 : selectedRole === "teacher" ? 450 : 800,
          level: selectedRole === "student" ? 2 : selectedRole === "teacher" ? 5 : 10,
          badges: selectedRole === "student" ? ["badge_welcome"] : [],
          completedLessons: selectedRole === "student" ? ["mtic_1_1"] : [],
          completedQuizzes: selectedRole === "student" ? { "mtic_1_1": 80 } : {},
          completedExercises: selectedRole === "student" ? { "mtic_1_1": ["desktop"] } : {},
          favoriteLessons: [],
          createdAt: new Date().toISOString()
        };
      } else {
        // Look in custom registered users
        const found = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === selectedRole);
        if (found) {
          loggedUser = found;
        }
      }

      if (loggedUser) {
        if (loggedUser.isBanned) {
          setError("Ce compte a été banni par l'administrateur de la plate-forme.");
          return;
        }
        localStorage.setItem("edu_profile_7eme", JSON.stringify(loggedUser));
        onLoginSuccess(loggedUser);
      } else {
        setError("Adresse e-mail ou mot de passe incorrect pour ce rôle.");
      }
    } else {
      // Sign up flow
      const existingUsersStr = localStorage.getItem("edu_registered_users");
      const registeredUsers: UserProfile[] = existingUsersStr ? JSON.parse(existingUsersStr) : [];

      const alreadyExists = registeredUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (alreadyExists || email.toLowerCase() === defaultCredentials.student.email || email.toLowerCase() === defaultCredentials.teacher.email || email.toLowerCase() === defaultCredentials.admin.email) {
        setError("Cette adresse e-mail est déjà associée à un compte.");
        return;
      }

      // Create new user profile
      const newUser: UserProfile = {
        id: `usr_${Math.floor(Math.random() * 900000 + 100000)}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: selectedRole,
        emailConfirmed: true,
        streak: 1,
        xpPoints: selectedRole === "student" ? 0 : selectedRole === "teacher" ? 100 : 200,
        level: 1,
        badges: ["badge_welcome"],
        completedLessons: [],
        completedQuizzes: {},
        completedExercises: {},
        favoriteLessons: [],
        createdAt: new Date().toISOString()
      };

      registeredUsers.push(newUser);
      localStorage.setItem("edu_registered_users", JSON.stringify(registeredUsers));
      localStorage.setItem("edu_profile_7eme", JSON.stringify(newUser));

      setSuccess("Inscription réussie ! Connexion en cours...");
      setTimeout(() => {
        onLoginSuccess(newUser);
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 md:p-8 relative overflow-hidden font-sans">
      {/* Background aesthetics */}
      <div className="absolute top-[-25%] left-[-15%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] rounded-full bg-sky-500/10 blur-[130px] pointer-events-none" />

      {/* Top Bar Logo */}
      <header className="max-w-7xl mx-auto w-full flex justify-between items-center py-4 z-10 border-b border-slate-900">
        <div className="flex items-center gap-3">
          <img 
            src="/assets/images/tic_7_rdc_badge_1782901614022.jpg" 
            alt="TIC 7 RDC Logo" 
            className="h-11 w-11 object-cover rounded-full border border-slate-800"
            referrerPolicy="no-referrer"
          />
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              TIC 7 RDC
            </h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider">REPUBLIQUE DEMOCRATIQUE DU CONGO • EPST</p>
          </div>
        </div>
      </header>

      {/* Central Login Card Container */}
      <main className="max-w-6xl mx-auto w-full my-auto py-8 grid lg:grid-cols-12 gap-12 items-center z-10">
        
        {/* Left Side: Educational context */}
        <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
          <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 font-semibold tracking-wide inline-block uppercase">
            Curriculum National • 7ème Année
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
            Espace Scolaire <br />
            <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
              Numérique Intégré
            </span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Bienvenue sur le portail d'apprentissage des Technologies de l'Information (MTIC). Connectez-vous pour continuer votre progression, réaliser des TP dans notre laboratoire virtuel et valider vos brevets.
          </p>

          {/* Feature List */}
          <div className="hidden lg:block space-y-3 pt-4">
            <div className="flex items-center gap-3 text-slate-300">
              <div className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium">12 Modules interactifs guidés par un tuteur IA</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <div className="w-6 h-6 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium">Laboratoires simulés de Windows, Word et E-mails</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium">Workspace double fonction avec création de bannières IA</span>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Form Card */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="w-full max-w-lg bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl relative">
            
            {/* Tab selector for Roles */}
            <div className="flex bg-slate-950/60 p-1.5 rounded-2xl border border-slate-850 mb-6">
              <button
                type="button"
                onClick={() => handleQuickFill("student")}
                className={`flex-grow flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  selectedRole === "student"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <User className="w-4 h-4" />
                <span>Élève</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("teacher")}
                className={`flex-grow flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  selectedRole === "teacher"
                    ? "bg-sky-600 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Enseignant</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("admin")}
                className={`flex-grow flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  selectedRole === "admin"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </button>
            </div>

            {/* Header Text */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white">
                {isLogin ? "Connexion Espace" : "Créer un Compte"} {selectedRole === "student" ? "Élève" : selectedRole === "teacher" ? "Enseignant" : "Administrateur"}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isLogin 
                  ? "Entrez vos identifiants pour rejoindre l'espace académique." 
                  : "Inscrivez-vous gratuitement pour commencer l'apprentissage numérique."
                }
              </p>
            </div>

            {/* Notification messages */}
            {error && (
              <div className="mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 p-3 text-xs rounded-xl flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                <p className="flex-1">{error}</p>
              </div>
            )}
            {success && (
              <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 p-3 text-xs rounded-xl flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <p className="flex-1">{success}</p>
              </div>
            )}

            {/* Google Sign-In Option */}
            <div className="mb-6 space-y-4">
              <button
                type="button"
                onClick={handleGoogleSignInClick}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-900 font-bold text-xs py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer border border-slate-200/80"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continuer avec Google</span>
              </button>

              <div className="flex items-center gap-3 py-1">
                <div className="h-[1px] bg-slate-800 flex-grow" />
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">ou utiliser vos identifiants</span>
                <div className="h-[1px] bg-slate-800 flex-grow" />
              </div>
            </div>

            {/* Login / Registration Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              
              {/* Full Name (Sign Up only) */}
              {!isLogin && (
                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold text-slate-400 mb-1 tracking-wider">
                    Nom Complet de l'utilisateur
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Jean Mubala"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-[10px] uppercase font-mono font-bold text-slate-400 mb-1 tracking-wider">
                  Adresse E-mail Scolaire / Académique
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jerepoba9@gamil.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Authorized verification code for role security */}
              {selectedRole !== "student" && (
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="block text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">
                      {selectedRole === "admin" ? "CODE ADMIN" : "CODE ENSEIGNANT"}
                    </label>
                    <span className="text-[9px] font-mono text-slate-500">
                      Requis pour les rôles {selectedRole === "teacher" ? "Enseignants" : "Admins"}
                    </span>
                  </div>
                  <div className="relative">
                    <Shield className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      value={authCode}
                      onChange={(e) => setAuthCode(e.target.value)}
                      placeholder="******"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="block text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">
                    {selectedRole === "admin" ? "MOT DE PASSE ADMIN" : "Mot de passe de sécurité"}
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-10 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-3.5 px-6 rounded-xl text-center font-bold text-white text-xs shadow-lg transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer ${
                  selectedRole === "student" 
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 shadow-indigo-500/15" 
                    : selectedRole === "teacher" 
                      ? "bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600 shadow-sky-500/15" 
                      : "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 shadow-emerald-500/15"
                }`}
              >
                <span>{isLogin ? "Se connecter à l'espace" : "Finaliser l'inscription"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Toggle Login/Signup at bottom */}
            <div className="mt-6 pt-6 border-t border-slate-850 text-center">
              <p className="text-xs text-slate-400">
                {isLogin ? "Pas encore de compte ? " : "Vous avez déjà un compte ? "}
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setSuccess(null);
                    setIsLogin(!isLogin);
                  }}
                  className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline bg-transparent border-none p-0 cursor-pointer"
                  id="toggle-auth-mode"
                >
                  {isLogin ? "S'inscrire" : "Se connecter"}
                </button>
              </p>
            </div>

          </div>
        </div>

      </main>

      {/* Google Accounts Selector Modal */}
      <AnimatePresence>
        {isGoogleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden font-sans border border-slate-100"
            >
              {/* Header with Google logo */}
              <div className="p-6 pb-4 border-b border-slate-100 flex flex-col items-center relative">
                <button
                  type="button"
                  onClick={() => setIsGoogleModalOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer border-0"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="mb-3 flex justify-center">
                  <svg className="h-8 w-auto" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  {googleStep === "choose" ? "Choisir un compte" : "Terminer l'inscription"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {googleStep === "choose" ? "pour continuer vers TIC 7 RDC" : "Configurez votre profil d'apprentissage"}
                </p>
              </div>

              {googleStep === "choose" ? (
                <div className="p-6 space-y-4">
                  {/* Google Custom Sign-In Form (Default and Clean) */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                    <h4 className="text-xs font-bold text-slate-700">Connexion avec Google</h4>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[9px] uppercase font-mono font-bold text-slate-400 mb-1">Nom complet</label>
                        <input
                          type="text"
                          placeholder="Nom Complet (Ex: Aimé Tshilombo)"
                          value={customGoogleName}
                          onChange={(e) => setCustomGoogleName(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase font-mono font-bold text-slate-400 mb-1">Adresse E-mail Google</label>
                        <input
                          type="email"
                          placeholder="jerepoba9@gamil.com"
                          value={customGoogleEmail}
                          onChange={(e) => setCustomGoogleEmail(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (!customGoogleEmail.trim() || !customGoogleName.trim()) {
                          alert("Veuillez saisir votre nom et adresse e-mail Google.");
                          return;
                        }
                        handleSelectGoogleAccount(customGoogleEmail.trim(), customGoogleName.trim());
                      }}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-3 rounded-lg transition-colors cursor-pointer border-0"
                    >
                      Continuer
                    </button>
                  </div>

                  {/* Dynamic Registered Users from LocalStorage if there are any */}
                  {(() => {
                    try {
                      const existingUsersStr = localStorage.getItem("edu_registered_users");
                      if (existingUsersStr) {
                        const registeredUsers: UserProfile[] = JSON.parse(existingUsersStr);
                        // Filter out empty or placeholder entries
                        const filtered = registeredUsers.filter(u => u.email && u.name);
                        if (filtered.length > 0) {
                          return (
                            <div className="space-y-2">
                              <p className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">Comptes locaux enregistrés</p>
                              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                                {filtered.map((u, idx) => {
                                  const initials = u.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
                                  return (
                                    <button
                                      key={u.id || idx}
                                      type="button"
                                      onClick={() => handleSelectGoogleAccount(u.email, u.name)}
                                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left cursor-pointer border border-transparent hover:border-slate-100"
                                    >
                                      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shadow-inner text-xs">
                                        {initials || "U"}
                                      </div>
                                      <div className="flex-grow">
                                        <p className="text-xs font-bold text-slate-800">{u.name}</p>
                                        <p className="text-[10px] text-slate-500 font-mono">{u.email}</p>
                                      </div>
                                      <span className="text-[9px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full uppercase shrink-0">{u.role === "student" ? "Élève" : u.role === "teacher" ? "Ens." : "Admin"}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        }
                      }
                    } catch (e) {
                      console.error(e);
                    }
                    return null;
                  })()}

                  <div className="text-[9px] text-slate-400 text-center leading-relaxed px-2 pt-1 border-t border-slate-100">
                    Pour continuer, Google partagera votre nom et votre adresse e-mail avec l'application TIC 7 RDC afin de sécuriser votre espace académique.
                  </div>
                </div>
              ) : (
                /* Google role & code config step */
                <form onSubmit={handleCompleteGoogleRegistration} className="p-6 space-y-4">
                  {googleError && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-600 p-3 text-xs rounded-lg flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <p className="flex-grow">{googleError}</p>
                    </div>
                  )}

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                      {googleNameInput.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-850">{googleNameInput}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{googleEmailInput}</p>
                    </div>
                  </div>

                  {/* Role Selector */}
                  <div>
                    <label className="block text-[10px] uppercase font-mono font-bold text-slate-500 mb-1.5">
                      Rôle scolaire EPST
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setGoogleSelectedRole("student")}
                        className={`py-2 px-3 rounded-lg text-xs font-bold border text-center transition-all cursor-pointer border-0 ${
                          googleSelectedRole === "student"
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                            : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        Élève
                      </button>
                      <button
                        type="button"
                        onClick={() => setGoogleSelectedRole("teacher")}
                        className={`py-2 px-3 rounded-lg text-xs font-bold border text-center transition-all cursor-pointer border-0 ${
                          googleSelectedRole === "teacher"
                            ? "bg-sky-600 text-white shadow-md shadow-sky-600/10"
                            : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        Enseignant
                      </button>
                      <button
                        type="button"
                        onClick={() => setGoogleSelectedRole("admin")}
                        className={`py-2 px-3 rounded-lg text-xs font-bold border text-center transition-all cursor-pointer border-0 ${
                          googleSelectedRole === "admin"
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                            : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        Admin
                      </button>
                    </div>
                  </div>

                  {/* Auth Code (if Teacher or Admin) */}
                  {googleSelectedRole !== "student" && (
                    <div className="space-y-1.5">
                      <label className="block text-[10px] uppercase font-mono font-bold text-slate-500">
                        {googleSelectedRole === "admin" ? "CODE ADMIN" : "CODE ENSEIGNANT"}
                      </label>
                      <input
                        type="text"
                        placeholder="******"
                        value={googleAuthCode}
                        onChange={(e) => setGoogleAuthCode(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                        required
                      />
                      <p className="text-[9px] text-slate-400">
                        Saisissez le code officiel d'accréditation du Ministère de l'EPST RDC.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setGoogleStep("choose")}
                      className="flex-grow bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl transition-colors cursor-pointer text-center border-0"
                    >
                      Retour
                    </button>
                    <button
                      type="submit"
                      className="flex-grow bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors cursor-pointer text-center border-0 shadow-md shadow-indigo-600/15"
                    >
                      Confirmer
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer copyright */}
      <footer className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center py-4 border-t border-slate-900 text-[11px] text-slate-600 z-10 gap-2 text-center sm:text-left">
        <div>
          © 2026 Ministère de l'Enseignement Primaire, Secondaire et Technique (EPST) • République Démocratique du Congo
        </div>
        <div className="flex gap-4">
          <span className="hover:text-slate-400 cursor-pointer">Cahier des charges</span>
          <span className="hover:text-slate-400 cursor-pointer">Syllabus officiel MTIC</span>
        </div>
      </footer>
    </div>
  );
}
