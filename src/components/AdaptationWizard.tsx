import React, { useState } from 'react';
import { Calendar, HelpCircle, Edit2, RotateCcw, Sparkles, CheckCircle, RefreshCw, AlertTriangle, ArrowRight } from 'lucide-react';
import { DayPlan } from '../types';

interface AdaptationWizardProps {
  currentDay: number;
  availableTopics: string[];
  onApplyAdaptedPlan: (newPlan: DayPlan[]) => void;
  onClose: () => void;
}

export const AdaptationWizard: React.FC<AdaptationWizardProps> = ({ 
  currentDay, 
  availableTopics, 
  onApplyAdaptedPlan, 
  onClose 
}) => {
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [previewPlan, setPreviewPlan] = useState<DayPlan[] | null>(null);

  const handleRunAdaptation = async () => {
    setLoading(true);
    setError(null);
    setPreviewPlan(null);

    try {
      const response = await fetch("/api/gemini/adapt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentDay,
          uncompletedTopics: availableTopics,
          comments: comments || "I am feeling details are moving too quickly and need to merge linear algebra and lists to spend more hands-on time on algorithms."
        })
      });

      if (!response.ok) {
        throw new Error("Failed to process customized schedule adaptively.");
      }

      const data = await response.json();
      if (data.updatedPlan && Array.isArray(data.updatedPlan)) {
        setPreviewPlan(data.updatedPlan);
      } else {
        throw new Error("Received an invalid restructured schedule payload.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Verify your connection details and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmChanges = () => {
    if (previewPlan) {
      onApplyAdaptedPlan(previewPlan);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="p-5 max-w-2xl mx-auto bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-6 w-6 text-amber-500 animate-spin" />
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">AI Adaptation Wizard</h3>
      </div>

      <p className="text-xs text-slate-500 mb-4 leading-relaxed">
        Sometimes life happens! Rather than abandoning your course, let's restructure your upcoming syllabus (Days {currentDay} to 30) using AI. We can blend advanced linear datasets, summarize theoretical concepts, and customize the milestones to match your personal pacing.
      </p>

      {success ? (
        <div className="text-center py-8 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
          <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-2 animate-bounce" />
          <h4 className="text-lg font-bold text-emerald-800 dark:text-emerald-300">Schedule Updated!</h4>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
            Your personalized study timeline has been securely synchronized.
          </p>
        </div>
      ) : previewPlan ? (
        <div className="space-y-4">
          <div className="border border-green-200 bg-green-50/40 dark:bg-green-950/10 rounded-xl p-3 text-xs flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
            <p className="text-green-800 dark:text-green-400">
              <strong>Preview Ready:</strong> We restructured {previewPlan.length} remaining study slots. Examine the preview below and confirm alignment to switch over.
            </p>
          </div>

          <div className="max-h-60 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
            {previewPlan.map((p) => (
              <div key={p.day} className="p-3 text-left hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-teal-500 text-white font-bold text-[10px] px-1.5 py-0.5 rounded">Day {p.day}</span>
                  <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">{p.topic}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal mb-1"><strong>Task:</strong> {p.task}</p>
                <p className="text-[10px] italic text-teal-600 dark:text-teal-400">"{p.motivation}"</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              onClick={() => setPreviewPlan(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
            >
              Back to edit
            </button>
            <button
              onClick={handleConfirmChanges}
              className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition shadow"
            >
              Apply New Schedule
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Your Current Status & Concerns (Tell us what variables feel tricky, or why you need to adjust)
            </label>
            <textarea
              className="w-full border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-xs focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400"
              rows={3}
              placeholder="e.g., I missed Days 15-18 due to university exams. I find recursion difficult, so please blend sorting algorithms into slightly lighter daily goals so I can catch up safely."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            ></textarea>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800 text-left">
            <h5 className="font-semibold text-xs text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-teal-600" />
              Adaptation Parameters
            </h5>
            <ul className="text-[10px] text-slate-500 grid grid-cols-2 gap-2 mt-2">
              <li>• Restructure target: <strong>Days {currentDay} to 30</strong></li>
              <li>• Uncompleted concepts: <strong>{availableTopics.length} remaining</strong></li>
              <li>• Target outcome: <strong>Confident graduation</strong></li>
              <li>• Adaptation method: <strong>Dynamic topic-merging</strong></li>
            </ul>
          </div>

          {error && (
            <div className="border border-rose-200 bg-rose-50 dark:bg-rose-950/25 rounded-xl p-3 text-xs flex items-center gap-2 text-rose-700">
              <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50/50 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleRunAdaptation}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition shadow"
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Calculating optimal path...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  Generate New Schedule
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdaptationWizard;
