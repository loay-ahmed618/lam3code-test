'use client';

import React from 'react';
import { translations, Language } from '@/i18n/translations';
import { Award, AlertOctagon, CheckCircle2, TrendingUp, Droplet, DollarSign, Layers } from 'lucide-react';

export interface StrategyItem {
  strategy_code: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  is_feasible: boolean;
  violated_constraints: string[];
  expected_yield_ton_per_feddan: number;
  water_use_m3_per_feddan: number;
  soil_health_index: number;
  production_cost_egp_per_feddan: number;
  expected_net_profit_egp: number;
  climate_risk_score: number;
  input_dependency_score: number;
  final_score: number;
  rank: number;
  explanation_en: string;
  explanation_ar: string;
  assumptions_en: string[];
  assumptions_ar: string[];
  tradeoffs_en: string[];
  tradeoffs_ar: string[];
}

interface StrategyMatrixProps {
  lang: Language;
  strategies: StrategyItem[];
}

export default function StrategyComparisonMatrix({ lang, strategies }: StrategyMatrixProps) {
  const t = translations[lang];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <span>{t.strategies_title}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'ar'
              ? 'مقارنة شفافة ومفسرة بين البدائل الثلاثة بناءً على أوزان أهدافك والقيود المفروضة'
              : 'Transparent & explainable comparison across three alternatives based on active goals and hard constraints'}
          </p>
        </div>
      </div>

      {/* Cards Comparison View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {strategies.map((strat) => {
          const isTop = strat.rank === 1 && strat.is_feasible;
          return (
            <div
              key={strat.strategy_code}
              className={`rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 ${
                !strat.is_feasible
                  ? 'bg-red-950/20 border-red-800/40 opacity-80'
                  : isTop
                  ? 'bg-slate-900 border-emerald-500/80 shadow-2xl ring-1 ring-emerald-500/30'
                  : 'bg-slate-900/80 border-slate-800 shadow-xl'
              }`}
            >
              <div>
                {/* Header Rank Badge */}
                <div className="flex justify-between items-start gap-2 mb-3">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                      !strat.is_feasible
                        ? 'bg-red-950 text-red-400 border border-red-700/50'
                        : isTop
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {!strat.is_feasible ? (
                      <>
                        <AlertOctagon className="w-3.5 h-3.5" />
                        <span>{t.infeasible}</span>
                      </>
                    ) : (
                      <>
                        <Award className="w-3.5 h-3.5" />
                        <span>{t.rank} #{strat.rank}</span>
                      </>
                    )}
                  </span>

                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {t.score}: {strat.final_score}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white mb-2 leading-snug">
                  {lang === 'ar' ? strat.name_ar : strat.name_en}
                </h4>

                <p className="text-xs text-slate-300 mb-4 leading-relaxed line-clamp-3">
                  {lang === 'ar' ? strat.description_ar : strat.description_en}
                </p>

                {/* Quantitative Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800/80 mb-4">
                  <div>
                    <span className="text-slate-400 block">{t.expected_yield}</span>
                    <span className="font-bold text-emerald-400 text-sm">
                      {strat.expected_yield_ton_per_feddan.toFixed(2)} {lang === 'ar' ? 'طن/فدان' : 't/fed'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block">{t.water_usage}</span>
                    <span className="font-bold text-blue-400 text-sm">
                      {strat.water_use_m3_per_feddan.toFixed(0)} {lang === 'ar' ? 'م³/فدان' : 'm³/fed'}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-900">
                    <span className="text-slate-400 block">{t.est_profit}</span>
                    <span className="font-bold text-emerald-300 text-sm">
                      {strat.expected_net_profit_egp.toLocaleString()} EGP
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-900">
                    <span className="text-slate-400 block">{t.soil_health}</span>
                    <span className="font-bold text-amber-300 text-sm">
                      {strat.soil_health_index}/100
                    </span>
                  </div>
                </div>

                {/* Constraint Violations Notice if Infeasible */}
                {!strat.is_feasible && strat.violated_constraints.length > 0 && (
                  <div className="bg-red-950/60 border border-red-700/50 p-2.5 rounded-lg text-xs text-red-200 mb-3 space-y-1">
                    <span className="font-bold block text-red-300">
                      {lang === 'ar' ? 'تم الاستبعاد بسبب مخالفة قيد إلزامي:' : 'Excluded due to constraint breach:'}
                    </span>
                    {strat.violated_constraints.map((v, idx) => (
                      <p key={idx} className="text-[11px] leading-tight">• {v}</p>
                    ))}
                  </div>
                )}

                {/* Explainable Decision Support Section */}
                <div className="space-y-2 text-xs">
                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="font-semibold text-emerald-400 block mb-0.5">
                      {t.why_selected}
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {lang === 'ar' ? strat.explanation_ar : strat.explanation_en}
                    </p>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="font-semibold text-amber-400 block mb-0.5">
                      {t.tradeoffs}
                    </span>
                    <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-0.5">
                      {(lang === 'ar' ? strat.tradeoffs_ar : strat.tradeoffs_en).map((to, i) => (
                        <li key={i}>{to}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
