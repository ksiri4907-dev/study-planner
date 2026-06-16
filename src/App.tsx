import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  Code, 
  GitMerge, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  RotateCcw, 
  Edit3, 
  PlusCircle, 
  BookMarked,
  Layers,
  ChevronRight,
  TrendingUp,
  Info,
  Check,
  Award,
  AlertCircle
} from 'lucide-react';
import { INITIAL_STUDY_PLAN, DayPlan } from './data/studyPlan';
import { UserProgress, StudyStats } from './types';
import StatsCard from './components/StatsCard';
import TutorPanel from './components/TutorPanel';
import AdaptationWizard from './components/AdaptationWizard';

// Firebase Imports
import { 
  db, 
  auth, 
  loginWithGoogle, 
  logoutUser, 
  handleFirestoreError, 
  OperationType 
} from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  getDocFromServer, 
  serverTimestamp 
} from 'firebase/firestore';

export default function App() {
  // --- Persistent State Configuration ---
  const [progress, setProgress] = useState<UserProgress>({
    completedDays: [],
    userNotes: {},
    challengeCompletions: [],
    isAdapted: false,
    notes: "",
    currentDayIndex: 1
  });

  const [activeWeek, setActiveWeek] = useState<number | "all">("all");
  const [focusedDay, setFocusedDay] = useState<DayPlan | null>(null);
  const [tutorType, setTutorType] = useState<"concept" | "code" | "dryrun">("concept");
  const [editingNotesDay, setEditingNotesDay] = useState<number | null>(null);
  const [tempNotesVal, setTempNotesVal] = useState("");
  const [adaptationOpen, setAdaptationOpen] = useState(false);
  const [reflectionOpenWeek, setReflectionOpenWeek] = useState<number | null>(null);
  const [generalMemo, setGeneralMemo] = useState("");

  // Firebase Authentication States
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Connection test on mount and register authenticated state sync
  useEffect(() => {
    // 1. Mandatory connection test on initial boot
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error: any) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();

    // 2. Load cached local content first as guest
    try {
      const stored = localStorage.getItem("aiml_planner_progress_v2");
      if (stored) {
        const parsed = JSON.parse(stored);
        setProgress(parsed);
        if (parsed.notes) {
          setGeneralMemo(parsed.notes);
        }
      } else {
        setProgress({
          completedDays: [],
          userNotes: {},
          challengeCompletions: [],
          isAdapted: false,
          notes: "",
          currentDayIndex: 1,
          adaptedPlan: INITIAL_STUDY_PLAN
        });
      }
    } catch (e) {
      console.error("LocalStorage load failed on initialization:", e);
    }

    // 3. Bind Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthLoading(true);

      if (currentUser) {
        setSyncing(true);
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            const syncedProgress: UserProgress = {
              completedDays: data.completedDays || [],
              userNotes: data.userNotes || {},
              challengeCompletions: data.challengeCompletions || [],
              isAdapted: data.isAdapted || false,
              notes: data.notes || "",
              currentDayIndex: data.currentDayIndex || 1,
              adaptedPlan: data.adaptedPlan || INITIAL_STUDY_PLAN
            };
            setProgress(syncedProgress);
            if (data.notes) {
              setGeneralMemo(data.notes);
            }
            localStorage.setItem("aiml_planner_progress_v2", JSON.stringify(syncedProgress));
          } else {
            // New user on cloud! Auto sync any existing local progress state up to the database
            const stored = localStorage.getItem("aiml_planner_progress_v2");
            let initialProgress = {
              completedDays: [],
              userNotes: {},
              challengeCompletions: [],
              isAdapted: false,
              notes: "",
              currentDayIndex: 1,
              adaptedPlan: INITIAL_STUDY_PLAN
            };
            if (stored) {
              try {
                initialProgress = JSON.parse(stored);
              } catch (e) {
                console.error(e);
              }
            }
            await setDoc(userRef, {
              userId: currentUser.uid,
              email: currentUser.email || '',
              completedDays: initialProgress.completedDays || [],
              challengeCompletions: initialProgress.challengeCompletions || [],
              userNotes: initialProgress.userNotes || {},
              isAdapted: initialProgress.isAdapted || false,
              notes: initialProgress.notes || '',
              currentDayIndex: initialProgress.currentDayIndex || 1,
              adaptedPlan: initialProgress.adaptedPlan || INITIAL_STUDY_PLAN,
              updatedAt: serverTimestamp()
            });
          }
        } catch (err) {
          console.error("Firebase fetch or registration sync failed:", err);
          handleFirestoreError(err, OperationType.GET, `users/${currentUser.uid}`);
        } finally {
          setSyncing(false);
        }
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Save progress changes both locally and asynchronously update Cloud Firestore database
  const saveProgress = async (newProgress: UserProgress) => {
    setProgress(newProgress);
    localStorage.setItem("aiml_planner_progress_v2", JSON.stringify(newProgress));

    if (auth.currentUser) {
      setSyncing(true);
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await setDoc(userRef, {
          userId: auth.currentUser.uid,
          email: auth.currentUser.email || '',
          completedDays: newProgress.completedDays || [],
          challengeCompletions: newProgress.challengeCompletions || [],
          userNotes: newProgress.userNotes || {},
          isAdapted: newProgress.isAdapted || false,
          notes: newProgress.notes || '',
          currentDayIndex: newProgress.currentDayIndex || 1,
          adaptedPlan: newProgress.adaptedPlan || INITIAL_STUDY_PLAN,
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (err) {
        console.error("Firestore update failed:", err);
        handleFirestoreError(err, OperationType.WRITE, `users/${auth.currentUser.uid}`);
      } finally {
        setSyncing(false);
      }
    }
  };

  // Auth Handler Functions
  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (e) {
      console.error(e);
      alert("Sign-in popup was blocked or failed. Please check browser pop-up permissions and try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.error(e);
    }
  };

  // --- Derived Variables ---
  const currentPlan = progress.adaptedPlan || INITIAL_STUDY_PLAN;

  const stats: StudyStats = (() => {
    const completedCount = progress.completedDays.length;
    const percentage = Math.round((completedCount / 30) * 100);
    const challengesCount = progress.challengeCompletions.length;

    // Calculate dynamic calendar consecutive streak
    let currentStreak = 0;
    const sortedCompleted = [...progress.completedDays].sort((a,b) => a - b);
    let tempStreak = 0;
    let expected = 1;

    // Standard streak checking logic
    for (let i = 0; i < sortedCompleted.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        if (sortedCompleted[i] === sortedCompleted[i - 1] + 1) {
          tempStreak++;
        } else if (sortedCompleted[i] === sortedCompleted[i - 1]) {
          // ignore duplicate ticks
        } else {
          tempStreak = 1; // broken
        }
      }
      if (tempStreak > currentStreak) {
        currentStreak = tempStreak;
      }
    }

    return {
      completedCount,
      percentage,
      challengesCount,
      streak: completedCount > 0 ? (currentStreak || 1) : 0
    };
  })();

  // Filter current plan elements to active week tags
  const filteredDays = currentPlan.filter(d => activeWeek === "all" || d.week === activeWeek);

  // --- Event Handler Actions ---
  const toggleDayCompletion = (dayNum: number) => {
    const completed = [...progress.completedDays];
    const idx = completed.indexOf(dayNum);
    if (idx > -1) {
      completed.splice(idx, 1);
    } else {
      completed.push(dayNum);
    }
    const updated = {
      ...progress,
      completedDays: completed,
      currentDayIndex: Math.max(1, Math.min(30, Math.max(...completed, 0) + 1))
    };
    saveProgress(updated);
  };

  const toggleChallengeCompletion = (dayNum: number) => {
    const completed = [...progress.challengeCompletions];
    const idx = completed.indexOf(dayNum);
    if (idx > -1) {
      completed.splice(idx, 1);
    } else {
      completed.push(dayNum);
    }
    const updated = {
      ...progress,
      challengeCompletions: completed
    };
    saveProgress(updated);
  };

  const handleStartEditingNotes = (dayNum: number, currentText: string) => {
    setEditingNotesDay(dayNum);
    setTempNotesVal(currentText || "");
  };

  const handleSaveNotes = (dayNum: number) => {
    const notesMap = { ...progress.userNotes };
    notesMap[dayNum] = tempNotesVal;
    const updated = {
      ...progress,
      userNotes: notesMap
    };
    saveProgress(updated);
    setEditingNotesDay(null);
  };

  const handleSaveGeneralMemo = (val: string) => {
    setGeneralMemo(val);
    saveProgress({
      ...progress,
      notes: val
    });
  };

  const handleApplyAdaptation = (newPlan: DayPlan[]) => {
    // Fill back missing preceding days so that earlier day records aren't overwritten
    const adjustedPlan = [...currentPlan];
    newPlan.forEach(adaptedDay => {
      const existingIdx = adjustedPlan.findIndex(d => d.day === adaptedDay.day);
      if (existingIdx > -1) {
        adjustedPlan[existingIdx] = adaptedDay;
      }
    });

    const updated = {
      ...progress,
      adaptedPlan: adjustedPlan,
      isAdapted: true
    };
    saveProgress(updated);
  };

  const handleResetSchedule = () => {
    if (confirm("Are you sure you want to revert to the standard syllabus layout? This will overwrite previous custom AI adaptations, but preserves your ticked completion logs.")) {
      const updated = {
        ...progress,
        adaptedPlan: INITIAL_STUDY_PLAN,
        isAdapted: false
      };
      saveProgress(updated);
    }
  };

  // Find remaining uncompleted study topics for the adaptation model
  const uncompletedTopics = currentPlan
    .filter(d => !progress.completedDays.includes(d.day))
    .map(d => d.topic);

  // Focus day automatically triggers AI side preview
  const handleOpenTutor = (day: DayPlan, type: "concept" | "code" | "dryrun") => {
    setFocusedDay(day);
    setTutorType(type);
  };

  // Weekly Reflection Self-Check details
  const getReflectionQuestions = (weekNum: number) => {
    switch (weekNum) {
      case 1:
        return [
          "Why do variables 'A' and 'B' reference the exact same memory coordinate when copying raw arrays in Python? (Hint: References vs values)",
          "How do dynamic conditionals prevent redundant checks comparing grades (e.g. why is checking both 'score > 80' and 'score <= 90' unnecessary if they are nested sequentially)?",
          "What is the significance of the '__main__' verification block when structuring custom Python helper modules?"
        ];
      case 2:
        return [
          "Why is checking for unique values standard in sets and dictionaries with O(1) complexity, while measuring lists runs in O(N)?",
          "What are the benefits of open contextual blocks (e.g., 'with open()') compared to manual state terminations?",
          "Can you outline some core real-world reasons why 'except Exception:' clauses clutter trace logs?"
        ];
      case 3:
        return [
          "How does the recursion stack memory frame operate? Why is a strong mathematical base case mandatory?",
          "Trace Binary Search indices: why are values halved logarithmically, and when does Bubble sort execution hit its optimal O(N) linear limits?",
          "Compare memory cost constraints between recursive Divide-and-Conquer Merge Sort and standard iterations."
        ];
      default:
        return [
          "Explain why matrix shape limits (A, B) * (B, C) must match. How does coordinates dimensionality outline model weights?",
          "What is variance vs standard deviation? Graph slope variables.",
          "Describe how a single-parameter gradient descent step updates weights. Why is learning rate tuning important?"
        ];
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] font-sans text-slate-200 p-4 md:p-6 lg:p-8 antialiased">
      
      {/* Header section crafted as a sleek Bento header block */}
      <header className="bg-[#11141B] border border-slate-800 rounded-2xl p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)]">
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/10 text-indigo-400 rounded-xl p-2.5 border border-indigo-500/20 shadow-md shadow-indigo-500/5">
              <Sparkles className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-sans">
                  AI/ML Path: <span className="text-indigo-400">The 30-Day Blueprint</span>
                </h1>
                {progress.isAdapted && (
                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm font-mono">
                    Adapted Sched
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-sm mt-1 font-medium">
                Personalized study plan & adaptive curriculum for Computer Science Student
              </p>
            </div>
          </div>
        </div>

        {/* Sync Controls and Action Toolbar inside the header */}
        <div className="flex flex-wrap items-center gap-3">
          {authLoading ? (
            <div className="flex items-center gap-2 bg-slate-900/40 py-1.5 px-3 rounded-xl border border-slate-800 text-xs text-slate-400 font-mono">
              <div className="h-3 w-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              Verifying...
            </div>
          ) : user ? (
            <div className="flex items-center gap-2.5 bg-slate-900/60 border border-slate-800 py-1.5 px-3.5 rounded-xl shadow-inner">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || "User Avatar"} referrerPolicy="no-referrer" className="h-5 w-5 rounded-full border border-indigo-400" />
              ) : (
                <div className="h-5 w-5 bg-indigo-500 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-900">
                  {(user.displayName || user.email || "S").charAt(0).toUpperCase()}
                </div>
              )}
              <div className="text-left text-[10px] leading-tight font-mono">
                <p className="font-semibold text-slate-200 line-clamp-1 max-w-[90px]">
                  {user.displayName || user.email?.split("@")[0]}
                </p>
                <p className="text-[8px] text-indigo-400 flex items-center gap-0.5 mt-0.5">
                  <span className="h-1 w-1 rounded-full bg-indigo-400 inline-block animate-pulse"></span>
                  {syncing ? "syncing..." : "cloud-synced"}
                </p>
              </div>
              <button 
                onClick={handleLogout}
                className="ml-1 text-[9px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 py-1 px-2 rounded transition uppercase tracking-wider border border-slate-700/60"
                title="Sign out of current Google account"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2 px-4 rounded-xl transition duration-200 shadow-lg shadow-indigo-600/10 active:scale-[0.98] border border-indigo-500/40"
              title="Connect with Google to persist your study plan in Cloud Firestore"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sync with Google
            </button>
          )}

          <button
            onClick={() => setAdaptationOpen(true)}
            className="bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold px-4 py-2 rounded-xl transition hover:scale-[1.02] flex items-center gap-1.5 border border-indigo-400/40"
          >
            <GitMerge className="h-4 w-4" />
            Adapt Plan
          </button>
          {progress.isAdapted && (
            <button
              onClick={handleResetSchedule}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 border border-slate-700"
              title="Revert modifications to original syllabus"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Plan
            </button>
          )}
        </div>
      </header>

      {/* Main Content Stage container */}
      <main className="max-w-7xl mx-auto">
        
        {/* Dynamic Interactive Progress Board styled in Bento row */}
        <StatsCard stats={stats} />

        {/* Dynamic Adaptability Banner */}
        {stats.percentage < 50 && stats.completedCount > 0 && (
          <div className="bg-[#11141B] border border-amber-500/20 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <h5 className="font-bold text-sm text-slate-200">
                  Feeling overwhelmed or finding a concept difficult?
                </h5>
                <p className="text-xs text-slate-400 mt-0.5 max-w-2xl leading-normal">
                  Customize the upcoming roadmap, aggregate complex mathematical concepts or split theories securely with our <strong>AI Adaptation Wizard</strong> at any time.
                </p>
              </div>
            </div>
            <button
              onClick={() => setAdaptationOpen(true)}
              className="text-xs font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 px-3.5 py-2 rounded-xl transition shrink-0"
            >
              Start Adaptation
            </button>
          </div>
        )}

        {/* Layout Split Screen: Table & Notes on Left, Active Lecture Mentor on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Complete study schedule viewport (Bento card space) */}
          <div className="lg:col-span-8 space-y-6">

            {/* Adaptation Wizard overlay panel if opened */}
            {adaptationOpen && (
              <div className="bg-[#11141B] border border-slate-800 shadow-xl rounded-2xl p-6 transition-all mb-6">
                <AdaptationWizard
                  currentDay={progress.currentDayIndex || 1}
                  availableTopics={uncompletedTopics}
                  onApplyAdaptedPlan={handleApplyAdaptation}
                  onClose={() => setAdaptationOpen(false)}
                />
              </div>
            )}

            {/* Navigation and Selector Toolbar (Bento segment header) */}
            <div className="bg-[#11141B] border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-indigo-400" />
                <h4 className="font-bold text-sm text-slate-200">Current Phase: Python & Foundations (Week 1)</h4>
              </div>

              {/* Filtering tabs */}
              <div className="flex flex-wrap gap-1 bg-[#0A0C10] p-1 rounded-xl border border-slate-800/80">
                <button
                  onClick={() => setActiveWeek("all")}
                  className={`text-xs font-semibold py-1.5 px-3.5 rounded-lg transition-all ${
                    activeWeek === "all"
                      ? "bg-[#11141B] text-indigo-400 shadow-sm border border-slate-800"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  All Days
                </button>
                {[1, 2, 3, 4].map(w => (
                  <button
                    key={w}
                    onClick={() => setActiveWeek(w)}
                    className={`text-xs font-semibold py-1.5 px-3.5 rounded-lg transition-all ${
                      activeWeek === w
                        ? "bg-[#11141B] text-indigo-400 shadow-sm border border-slate-800"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Week {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Structured Table Stage (Central bento box list) */}
            <div className="bg-[#11141B] border border-slate-800 rounded-2xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/30 text-slate-400 font-bold text-xs uppercase border-b border-slate-800">
                      <th className="py-3.5 px-3 w-12 text-center">Done</th>
                      <th className="py-3.5 px-3 w-16 text-center">Day</th>
                      <th className="py-3.5 px-4">Topic & AI Guides</th>
                      <th className="py-3.5 px-4">Hands-On Task</th>
                      <th className="py-3.5 px-4">My Notes (Click to edit)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredDays.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-500 text-sm font-medium">
                          No days registered in this filtered block.
                        </td>
                      </tr>
                    ) : (
                      filteredDays.map(day => {
                        const isCompleted = progress.completedDays.includes(day.day);
                        const isChallengeCompleted = progress.challengeCompletions.includes(day.day);
                        const userNotesContent = progress.userNotes[day.day] || "";
                        const isActiveFocus = focusedDay?.day === day.day;

                        return (
                          <tr 
                            key={day.day}
                            className={`group transition-all ${
                              isCompleted 
                                ? "bg-emerald-950/5 hover:bg-emerald-950/10" 
                                : "hover:bg-slate-900/30"
                            } ${isActiveFocus ? "bg-indigo-950/20 ring-1 ring-indigo-500/40" : ""}`}
                          >
                            {/* Checkbox tracker */}
                            <td className="py-4 px-3 text-center align-middle">
                              <button
                                onClick={() => toggleDayCompletion(day.day)}
                                className={`h-6 w-6 mx-auto rounded-lg flex items-center justify-center transition-all border ${
                                  isCompleted 
                                    ? "bg-indigo-500 border-indigo-600 text-white shadow-[0_0_8px_rgba(99,102,241,0.4)]"
                                    : "border-slate-850 bg-slate-900/50 text-transparent hover:border-indigo-400"
                                } cursor-pointer`}
                                title={isCompleted ? "Mark incomplete" : "Mark goals completed"}
                                aria-label={`Toggle Day ${day.day} Completion`}
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            </td>

                            {/* Day & Week Tag */}
                            <td className="py-4 px-3 align-middle text-center">
                              <div className="flex flex-col items-center justify-center">
                                <span className={`text-base font-bold font-mono ${isCompleted ? "text-slate-500 line-through" : "text-white"}`}>
                                  {day.day.toString().padStart(2, '0')}
                                </span>
                                <span className="text-[8px] text-indigo-400/80 font-bold uppercase tracking-wider font-mono">
                                  W{day.week}
                                </span>
                              </div>
                            </td>

                            {/* Topic, description, and AI tutorial triggers */}
                            <td className="py-4 px-4 min-w-[200px]">
                              <div>
                                <h4 className={`text-sm font-bold tracking-tight ${isCompleted ? "text-slate-500 line-through" : "text-slate-100"}`}>
                                  {day.topic}
                                </h4>
                                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                                  {day.notes}
                                </p>

                                {/* Mini AI Trigger tags */}
                                <div className="flex flex-wrap gap-1.5 mt-2.5">
                                  <button
                                    onClick={() => handleOpenTutor(day, "concept")}
                                    className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-2 py-1 rounded transition border border-indigo-500/20"
                                  >
                                    <BookOpen className="h-3 w-3" />
                                    Explain
                                  </button>
                                  <button
                                    onClick={() => handleOpenTutor(day, "code")}
                                    className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-400 hover:text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 px-2 py-1 rounded transition border border-teal-500/20"
                                  >
                                    <Code className="h-3 w-3" />
                                    Code Template
                                  </button>
                                  <button
                                    onClick={() => handleOpenTutor(day, "dryrun")}
                                    className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-1 rounded transition border border-amber-500/20 flex"
                                  >
                                    <GitMerge className="h-3 w-3" />
                                    Traces
                                  </button>
                                </div>
                              </div>
                            </td>

                            {/* Practical Task & Encouragement notes and Optional Challenge */}
                            <td className="py-4 px-4 min-w-[240px]">
                              <div className="space-y-2">
                                <p className={`text-xs leading-relaxed ${isCompleted ? "text-slate-500 line-through" : "text-slate-300"}`}>
                                  {day.task}
                                </p>
                                
                                <div className="border-l-2 border-indigo-500/60 pl-2 bg-indigo-950/20 py-1.5 px-2 rounded-r">
                                  <span className="block text-[8px] text-indigo-400 font-bold tracking-wider uppercase font-mono">Motivation Mentor:</span>
                                  <p className="text-[10px] italic text-slate-400 leading-normal mt-0.5">
                                    "{day.motivation}"
                                  </p>
                                </div>

                                {/* Optional Challenge trigger */}
                                <div className="border border-slate-800 rounded-xl p-2.5 bg-slate-900/30">
                                  <div className="flex items-center justify-between gap-1 mb-1">
                                    <span className="text-[9px] font-bold text-indigo-400 tracking-wider uppercase inline-flex items-center gap-1 font-mono">
                                      <Award className="h-3 w-3" />
                                      Challenge Level
                                    </span>
                                    <button
                                      onClick={() => toggleChallengeCompletion(day.day)}
                                      className={`text-[8px] font-bold px-2 py-0.5 rounded transition ${
                                        isChallengeCompleted
                                          ? "bg-indigo-500 text-white"
                                          : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/50"
                                      } cursor-pointer`}
                                    >
                                      {isChallengeCompleted ? "Conquered!" : "Tap to complete"}
                                    </button>
                                  </div>
                                  <p className="text-[10px] text-slate-400 leading-normal">
                                    {day.challenge}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* User Notes and editing */}
                            <td className="py-4 px-4 min-w-[150px] relative align-middle">
                              {editingNotesDay === day.day ? (
                                <div className="space-y-1">
                                  <textarea
                                    className="w-full text-xs p-1.5 border border-slate-700 bg-slate-950 rounded-lg text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                                    rows={3}
                                    value={tempNotesVal}
                                    onChange={(e) => setTempNotesVal(e.target.value)}
                                    autoFocus
                                  />
                                  <div className="flex gap-1 justify-end">
                                    <button
                                      onClick={() => setEditingNotesDay(null)}
                                      className="text-[9px] font-semibold text-slate-500 hover:text-slate-300 px-2 py-1 rounded"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => handleSaveNotes(day.day)}
                                      className="text-[9px] font-semibold bg-indigo-500 hover:bg-indigo-600 text-white px-2.5 py-1 rounded"
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div 
                                  onClick={() => handleStartEditingNotes(day.day, userNotesContent)}
                                  className="text-xs text-slate-400 hover:text-slate-100 min-h-[40px] p-2 hover:bg-slate-900 border border-dashed border-transparent hover:border-slate-800 rounded-lg cursor-pointer transition font-mono"
                                  title="Click to personalize notes for this day"
                                >
                                  {userNotesContent ? (
                                    <span className="text-slate-300 whitespace-pre-wrap">{userNotesContent}</span>
                                  ) : (
                                    <span className="text-slate-500 italic flex items-center gap-1 text-[10px]">
                                      <PlusCircle className="h-3 w-3" />
                                      Memo pad...
                                    </span>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Structured Weekly Reflections Container */}
            {activeWeek !== "all" && (
              <div className="bg-[#11141B] border border-slate-800 rounded-2xl p-5 text-left shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm text-indigo-400 flex items-center gap-1.5">
                    <BookMarked className="h-4 w-4" />
                    Week {activeWeek} Self-Check reflection
                  </h4>
                  <button
                    onClick={() => setReflectionOpenWeek(reflectionOpenWeek === activeWeek ? null : activeWeek)}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
                  >
                    {reflectionOpenWeek === activeWeek ? "Hide Questions" : "Show Self-Check Questions"}
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Reflect on what you've learned. Tracing base-cases, loop states, complexity bounds, or weight adjustments helps lock in theoretical concepts.
                </p>

                {reflectionOpenWeek === activeWeek && (
                  <div className="mt-4 bg-[#0A0C10] p-4 rounded-xl border border-slate-800 space-y-4">
                    <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider font-mono">Concept Validation Questions:</span>
                    <ol className="list-decimal list-inside text-xs text-slate-400 space-y-2.5">
                      {getReflectionQuestions(activeWeek).map((q, idx) => (
                        <li key={idx} className="leading-relaxed">
                          <strong>{q}</strong>
                        </li>
                      ))}
                    </ol>
                    <div className="pt-2 border-t border-slate-850">
                      <p className="text-[10px] text-slate-500">
                        *Tip: Click the "Explain" button on the active day's syllabus and ask the AI Mentor queries about these reflection prompts!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* General notepad memo pad (Bento style) */}
            <div className="bg-[#11141B] border border-slate-800 p-6 rounded-2xl shadow-sm text-left">
              <h5 className="font-bold text-sm text-slate-200 mb-2 flex items-center gap-1.5">
                <FileText className="h-4.5 w-4.5 text-indigo-400" />
                Persistent General Study Memo
              </h5>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                Record general formulas, mathematical derivations, next step career milestones, or code snippets here. This field is preserved across pages dynamically.
              </p>
              <textarea
                className="w-full bg-[#0A0C10] border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                rows={4}
                value={generalMemo}
                onChange={(e) => handleSaveGeneralMemo(e.target.value)}
                placeholder="e.g., NumPy activation slope formula for SGD update gradients..."
              />
            </div>

          </div>

          {/* RIGHT COLUMN: Bento interactive blocks (Road Map, Adaptive 전략 and Mentor panel) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Bento Block A: The Interactive 30-Day Map Grid (Roadmap) */}
            <div className="bg-[#11141B] border border-slate-800 rounded-2xl p-4 shadow-md text-left">
              <div className="flex justify-between items-center mb-3.5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#718096]">The Road Map</h3>
                <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 py-0.5 px-2 rounded font-mono font-bold">DAYS 01 - 30</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 30 }, (_, i) => {
                  const dayNum = i + 1;
                  const dayObj = currentPlan.find(d => d.day === dayNum);
                  const isCompleted = progress.completedDays.includes(dayNum);
                  const isCurrent = progress.completedDays.length === 0 ? dayNum === 1 : (dayNum === Math.min(30, Math.max(...progress.completedDays) + 1));
                  const isFocused = focusedDay?.day === dayNum;

                  return (
                    <button
                      key={dayNum}
                      onClick={() => {
                        if (dayObj) {
                          setFocusedDay(dayObj);
                          setTutorType("concept");
                        }
                      }}
                      className={`aspect-square rounded-lg flex flex-col items-center justify-center font-mono text-[10px] font-bold transition-all relative cursor-pointer border ${
                        isCompleted
                          ? "bg-indigo-600/90 text-white border-indigo-500/40 shadow-[0_0_8px_rgba(99,102,241,0.25)]"
                          : isCurrent
                          ? "bg-indigo-950 border-indigo-400 text-indigo-300 animate-pulse"
                          : "bg-[#0A0C10] hover:bg-[#161a22] text-slate-500 border-slate-850"
                      } ${
                        isFocused ? "ring-2 ring-indigo-400 ring-offset-2 ring-offset-[#11141B] scale-102" : "hover:border-slate-700"
                      }`}
                      title={dayObj ? `Day ${dayNum}: ${dayObj.topic}` : `Day ${dayNum}`}
                    >
                      <span>{dayNum.toString().padStart(2, '0')}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-3.5 text-[9px] font-mono text-slate-500 flex justify-between uppercase border-t border-slate-850 pt-2">
                <span>DAY 01: PYTHON</span>
                <span>DAY 30: AI CAPSTONE</span>
              </div>
            </div>

            {/* Bento Block B: Strategic Adaptive strategy */}
            <div className="bg-[#11141B] border border-slate-800 rounded-2xl p-4 flex flex-col text-left">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#718096] mb-3">Adaptive strategy</h3>
              <div className="bg-indigo-950/20 p-3 rounded-xl border border-indigo-500/20 mb-3 text-xs leading-normal">
                <p className="font-bold text-indigo-400 mb-1 flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Struggling or Out of Time?
                </p>
                <p className="text-[11px] text-slate-400">
                  Select math elements or coding models inside the syllabus. Skip raw theoretical derivations & ask the AI Tutor for clean templates instantly.
                </p>
              </div>
              <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800 text-xs">
                <p className="font-bold text-indigo-400/80 mb-1">Today's Reflection Tip</p>
                <p className="text-[11px] italic text-slate-400 leading-normal">
                  "{focusedDay ? focusedDay.motivation : 'Practice spacing variables & loops correctly. Continuity beats massive, broken sprints every single time.'}"
                </p>
              </div>
            </div>

            {/* Bento Block C: Smart interactive AI Lecturer / Tutor Panel */}
            <div className="relative">
              <TutorPanel
                selectedDay={focusedDay}
                initialType={tutorType}
                onClose={() => setFocusedDay(null)}
              />

              {/* Guide card shown inline if no day has been focused */}
              {!focusedDay && (
                <div className="bg-[#11141B] border border-slate-800 rounded-2xl p-4 mt-6 text-left shadow-sm">
                  <h4 className="font-bold text-xs text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider mb-2 font-mono">
                    <Info className="h-4 w-4" />
                    How to navigate the Blueprint
                  </h4>
                  <ul className="text-[11px] text-slate-400 space-y-2.5 leading-relaxed">
                    <li className="flex items-start gap-1.5">
                      <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded h-4.5 w-4.5 text-[9px] font-bold inline-flex items-center justify-center shrink-0 mt-0.5 font-mono">01</span>
                      <span>Tick off tasks when conquered to keep dynamic streak counts healthy in real-time.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded h-4.5 w-4.5 text-[9px] font-bold inline-flex items-center justify-center shrink-0 mt-0.5 font-mono">02</span>
                      <span>Tap any square on the <strong>30-Day Map</strong> above to summon customized concept models.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded h-4.5 w-4.5 text-[9px] font-bold inline-flex items-center justify-center shrink-0 mt-0.5 font-mono">03</span>
                      <span>Click standard Row triggers: <strong>Explain</strong>, <strong>Code Template</strong>, or <strong>Traces</strong> to launch full AI mentorship.</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

          </div>

        </div>

      </main>

      {/* Decorative clean footer */}
      <footer className="border-t border-slate-800 text-slate-500 text-xs py-8 mt-12 text-center transition-colors">
        <p className="font-semibold text-slate-400 mb-1 font-mono uppercase tracking-wider">
          Smart CS AIML Study Planner Workspace
        </p>
        <p className="text-[10px] text-slate-500">
          Crafted with React 19, Tailwind CSS, Express, and Google Gemini AI API.
        </p>
      </footer>

    </div>
  );
}
