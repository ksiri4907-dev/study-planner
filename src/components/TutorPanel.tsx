import React, { useState, useEffect } from 'react';
import { Sparkles, Code, BookOpen, GitMerge, X, Copy, Check, Info, RefreshCw, AlertTriangle } from 'lucide-react';
import { DayPlan } from '../types';

interface TutorPanelProps {
  selectedDay: DayPlan | null;
  onClose: () => void;
  initialType?: "concept" | "code" | "dryrun";
}

export const TutorPanel: React.FC<TutorPanelProps> = ({ selectedDay, onClose, initialType = "concept" }) => {
  const [activeTab, setActiveTab] = useState<"concept" | "code" | "dryrun">(initialType);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Synchronize dynamic updates when selectedDay or activeTab changes
  useEffect(() => {
    if (selectedDay) {
      fetchTutorData(activeTab);
    }
  }, [selectedDay, activeTab]);

  const fetchTutorData = async (type: "concept" | "code" | "dryrun") => {
    if (!selectedDay) return;
    setLoading(true);
    setError(null);
    setContent("");

    try {
      const response = await fetch("/api/gemini/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          day: selectedDay.day,
          topic: selectedDay.topic,
          task: selectedDay.task,
          type: type
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to fetch AI tutor insights.");
      }

      const data = await response.json();
      setContent(data.result || "No data received.");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Verify your connection or try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!selectedDay) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
        <Sparkles className="h-12 w-12 text-slate-300 mb-2 animate-bounce" />
        <p className="font-medium text-slate-500">No lecture selected</p>
        <p className="text-xs max-w-xs mt-1">
          Click the study icon, tasks, or day titles inside the study plan table to load dynamic explanations from Gemini.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
      {/* Dynamic Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white px-4 py-4 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/25 hover:bg-white/40 text-white rounded-full p-1 transition"
          aria-label="Close panel"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full font-bold">Day {selectedDay.day}</span>
          <span className="text-xs text-teal-100 font-semibold">Week {selectedDay.week} Syllabus</span>
        </div>
        <h4 className="font-semibold text-lg tracking-tight pr-6">{selectedDay.topic}</h4>
      </div>

      {/* Target Task Briefing */}
      <div className="bg-slate-50 dark:bg-slate-950/45 px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">Day's Goal:</span>{" "}
            <span className="text-slate-600 dark:text-slate-400">{selectedDay.task}</span>
          </div>
        </div>
      </div>

      {/* Selector Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 p-1 gap-1">
        <button
          onClick={() => setActiveTab("concept")}
          className={`flex-1 flex justify-center items-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            activeTab === "concept"
              ? "bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-sm"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          Explanation
        </button>
        <button
          onClick={() => setActiveTab("code")}
          className={`flex-1 flex justify-center items-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            activeTab === "code"
              ? "bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-sm"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Code className="h-3.5 w-3.5" />
          Python Code
        </button>
        <button
          onClick={() => setActiveTab("dryrun")}
          className={`flex-1 flex justify-center items-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            activeTab === "dryrun"
              ? "bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-sm"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <GitMerge className="h-3.5 w-3.5" />
          Dry-Run Table
        </button>
      </div>

      {/* Main content body */}
      <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-slate-900">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center py-12 text-slate-500 text-center">
            <RefreshCw className="h-8 w-8 text-teal-600 animate-spin mb-3" />
            <p className="font-semibold text-sm">Consulting AI Lecture Peer...</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs px-4">
              Building dynamic, personalized explanations using our server-side intelligent assistant. This may take a few seconds...
            </p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 rounded-xl p-4 text-center my-6">
            <AlertTriangle className="h-10 w-10 text-rose-500 mx-auto mb-2" />
            <h5 className="font-semibold text-rose-800 dark:text-rose-400 text-sm">Assistant Link Blocked</h5>
            <p className="text-xs text-rose-600 dark:text-rose-400/90 mt-1 mb-3">{error}</p>
            <button
              onClick={() => fetchTutorData(activeTab)}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transitions"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {/* Copy button action bar */}
            {content && (
              <div className="flex justify-end pr-1">
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2.5 py-1.5 rounded-lg font-medium transition"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy Content
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Formatted body container */}
            <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-wrap font-sans antialiased">
              {content && activeTab === "code" ? (
                <div className="bg-slate-950 text-slate-100 rounded-xl p-4 font-mono text-xs overflow-x-auto shadow-inner border border-slate-800">
                  {content}
                </div>
              ) : content && activeTab === "dryrun" ? (
                <div className="font-mono text-xs overflow-x-auto bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  {content}
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Clean paragraphs for raw explanations */}
                  {content.split("\n\n").map((para, idx) => (
                    <p key={idx} className="mb-3">
                      {para}
                    </p>
                  ))}
                </div>
              )}
            </div>
            
            {/* Standard preloaded local helper fallback warning if content somehow fails */}
            {!content && !loading && (
              <div className="text-center p-6 text-slate-400">
                <Sparkles className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs">Select active tab to load detailed dynamic guides.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer support citation */}
      <div className="bg-slate-50 dark:bg-slate-950 p-3 text-center border-t border-slate-100 dark:border-slate-800">
        <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal">
          Empathetic guidance fueled by Gemini-3.5-Flash. Keep studying daily to maintain your streak!
        </p>
      </div>
    </div>
  );
};
export default TutorPanel;
