import React from 'react';
import { CheckCircle2, Award, Zap, BookOpen } from 'lucide-react';
import { StudyStats } from '../types';

interface StatsCardProps {
  stats: StudyStats;
}

export const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  return (
    <div id="stats-dashboard" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Block 1: Days Completed */}
      <div className="bg-[#11141B] border border-slate-800/80 rounded-2xl p-4 flex items-center gap-4 transition-all hover:border-slate-700/80 group">
        <div className="bg-indigo-500/10 text-indigo-400 p-3 rounded-xl border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-all">
          <BookOpen className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Days Completed</p>
          <h3 className="text-2xl font-bold font-mono text-white mt-1">
            {stats.completedCount} <span className="text-xs text-slate-500 font-normal">/ 30 DAYS</span>
          </h3>
        </div>
      </div>

      {/* Block 2: Overall Progress */}
      <div className="bg-[#11141B] border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-center gap-2 transition-all hover:border-slate-700/80">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Overall Progress</p>
          <span className="text-xs font-mono font-bold text-indigo-400">{stats.percentage}%</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500/10 text-indigo-400 p-2 rounded-lg border border-indigo-500/20 shrink-0">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="w-full bg-slate-850 dark:bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
            <div 
              className="bg-indigo-500 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" 
              style={{ width: `${stats.percentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Block 3: Current Streak */}
      <div className="bg-[#11141B] border border-slate-800/80 rounded-2xl p-4 flex items-center gap-4 transition-all hover:border-slate-700/80 group">
        <div className="bg-amber-500/10 text-amber-400 p-3 rounded-xl border border-amber-500/20 group-hover:bg-amber-500/20 transition-all">
          <Zap className="h-6 w-6 animate-pulse" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Current Streak</p>
          <h3 className="text-2xl font-bold font-mono text-white mt-1">
            {stats.streak} <span className="text-xs text-slate-500 font-normal">CONSECUTIVE</span>
          </h3>
        </div>
      </div>

      {/* Block 4: Challenges Conquered */}
      <div className="bg-[#11141B] border border-slate-800/80 rounded-2xl p-4 flex items-center gap-4 transition-all hover:border-slate-700/80 group">
        <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-xl border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
          <Award className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Portfolio Completed</p>
          <h3 className="text-2xl font-bold font-mono text-white mt-1">
            {stats.challengesCount} <span className="text-xs text-slate-500 font-normal">CONQUERED</span>
          </h3>
        </div>
      </div>
    </div>
  );
};
export default StatsCard;
