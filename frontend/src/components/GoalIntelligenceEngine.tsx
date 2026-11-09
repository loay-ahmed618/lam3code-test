'use client';

import React, { useState } from 'react';
import { translations, Language } from '@/i18n/translations';
import { Target, Sliders, AlertCircle, RefreshCw, Check } from 'lucide-react';

interface GoalWeights {
  yield: number;
  water: number;
  soil: number;
  profit: number;
  climate: number;
  inputs: number;
}

interface GoalEngineProps {
  lang: Language;
  onApplyGoals: (weights: GoalWeights, constraints: { waterQuota: number; maxBudget: number; isWaterHard: boolean; isBudgetHard: boolean }) => void;
}

export default function GoalIntelligenceEngine({ lang, onApplyGoals }: GoalEngineProps) {
  const t = translations[lang];

  const [weights, setWeights] = useState<GoalWeights>({
    yield: 35,
    water: 30,
    soil: 15,
    profit: 20,
    climate: 0,
    inputs: 0
  });

  const [waterQuota, setWaterQuota] = useState<number>(2600);
  const [maxBudget, setMaxBudget] = useState<number>(12000);
  const [isWaterHard, setIsWaterHard] = useState<boolean>(true);
  const [isBudgetHard, setIsBudgetHard] = useState<boolean>(true);

  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  const isValid = Math.abs(total - 100) < 0.1;

  const handleSliderChange = (goalKey: keyof GoalWeights, val: number) => {
    setWeights(prev => ({
      ...prev,
      [goalKey]: val
    }));
  };

  const handleNormalize = () => {
    // Equalize active goals to sum 100%
    const keys = Object.keys(weights) as (keyof GoalWeights)[];
    const nonZeroKeys = keys.filter(k => weights[k] > 0);
    const activeKeys = nonZeroKeys.length > 0 ? nonZeroKeys : keys;
    const share = Math.floor(100 / activeKeys.length);
    const remainder = 100 - (share * activeKeys.length);

    const next: GoalWeights = { yield: 0, water: 0, soil: 0, profit: 0, climate: 0, inputs: 0 };
    activeKeys.forEach((k, idx) => {
      next[k] = share + (idx === 0 ? remainder : 0);
    });
    setWeights(next);
  };

  const handleApply = () => {
    if (!isValid) return;
    onApplyGoals(weights, {
      waterQuota,
      maxBudget,
      isWaterHard,
      isBudgetHard
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Title */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
          <Target className="w-5 h-5" />
          <span>{lang === 'ar' ? 'محرك ذكاء أهداف المزارع (Goal Intelligence Engine)' : 'Farmer Goal Intelligence Engine'}</span>
        </div>
        <p className="text-slate-300 text-sm mt-1 font-medium">
          {t.goal_question}
        </p>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Yield */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-slate-200">{t.goal_yield}</span>
            <span className="text-emerald-400 font-bold">{weights.yield}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={weights.yield}
            onChange={(e) => handleSliderChange('yield', Number(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Water */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-slate-200">{t.goal_water}</span>
            <span className="text-emerald-400 font-bold">{weights.water}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={weights.water}
            onChange={(e) => handleSliderChange('water', Number(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Soil Health */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-slate-200">{t.goal_soil}</span>
            <span className="text-emerald-400 font-bold">{weights.soil}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={weights.soil}
            onChange={(e) => handleSliderChange('soil', Number(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Profitability */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-slate-200">{t.goal_profit}</span>
            <span className="text-emerald-400 font-bold">{weights.profit}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={weights.profit}
            onChange={(e) => handleSliderChange('profit', Number(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Climate Resilience */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-slate-200">{t.goal_climate}</span>
            <span className="text-emerald-400 font-bold">{weights.climate}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={weights.climate}
            onChange={(e) => handleSliderChange('climate', Number(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Lower Inputs */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-slate-200">{t.goal_inputs}</span>
            <span className="text-emerald-400 font-bold">{weights.inputs}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={weights.inputs}
            onChange={(e) => handleSliderChange('inputs', Number(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Validation Banner & Normalize Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-300 font-medium">{t.total_weights}</span>
          <span className={`text-lg font-bold px-3 py-0.5 rounded-full ${isValid ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50' : 'bg-red-950 text-red-400 border border-red-500/50'}`}>
            {total}%
          </span>
          {!isValid && (
            <span className="text-xs text-red-400 flex items-center gap-1 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {t.must_equal_100}
            </span>
          )}
        </div>

        <button
          onClick={handleNormalize}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{t.normalize_btn}</span>
        </button>
      </div>

      {/* Hard Constraints Section */}
      <div className="space-y-3 pt-2">
        <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span>{t.hard_constraints_title}</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <label className="text-xs text-slate-400 block">{t.water_quota_label}</label>
            <input
              type="number"
              value={waterQuota}
              onChange={(e) => setWaterQuota(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isWaterHard}
                onChange={(e) => setIsWaterHard(e.target.checked)}
                className="accent-emerald-500 rounded"
              />
              <span>{t.is_hard_constraint}</span>
            </label>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <label className="text-xs text-slate-400 block">{t.max_budget_label}</label>
            <input
              type="number"
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isBudgetHard}
                onChange={(e) => setIsBudgetHard(e.target.checked)}
                className="accent-emerald-500 rounded"
              />
              <span>{t.is_hard_constraint}</span>
            </label>
          </div>
        </div>
      </div>

      {/* Recalculate CTA */}
      <button
        onClick={handleApply}
        disabled={!isValid}
        className={`w-full py-3 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition ${
          isValid
            ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
        }`}
      >
        <Check className="w-4 h-4" />
        <span>{t.recalculate_ranking}</span>
      </button>
    </div>
  );
}
