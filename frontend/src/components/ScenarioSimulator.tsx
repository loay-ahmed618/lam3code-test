'use client';

import React, { useState } from 'react';
import { translations, Language } from '@/i18n/translations';
import { Play, Flame, Droplets, TrendingDown, RefreshCcw } from 'lucide-react';

interface SimulationProps {
  lang: Language;
  onRunSimulation?: (scenario: string, params: { temp: number; water: number }) => void;
}

export default function ScenarioSimulator({ lang, onRunSimulation }: SimulationProps) {
  const t = translations[lang];

  const [scenarioType, setScenarioType] = useState<'HEAT_STRESS' | 'WATER_SCARCITY' | 'COMBINED_STRESS' | 'NORMAL'>('HEAT_STRESS');
  const [tempDelta, setTempDelta] = useState<number>(2.5);
  const [waterCut, setWaterCut] = useState<number>(20);

  // Computed impacts based on agricultural response curves
  const yieldImpact = Number((-(Math.min(40, tempDelta * 4.5) + Math.min(50, waterCut * 0.75))).toFixed(1));
  const profitImpact = Number((yieldImpact * 1.6).toFixed(1));

  const handleApplyPreset = (type: 'HEAT_STRESS' | 'WATER_SCARCITY' | 'COMBINED_STRESS' | 'NORMAL') => {
    setScenarioType(type);
    if (type === 'HEAT_STRESS') {
      setTempDelta(3.5);
      setWaterCut(5);
    } else if (type === 'WATER_SCARCITY') {
      setTempDelta(0.5);
      setWaterCut(30);
    } else if (type === 'COMBINED_STRESS') {
      setTempDelta(3.0);
      setWaterCut(25);
    } else {
      setTempDelta(0);
      setWaterCut(0);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <span>{t.sim_title}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'ar'
              ? 'نمذجة استكشافية لفهم مرونة الاستراتيجيات أمام الصدمات المناخية وشح المياه'
              : 'Exploratory modeling to stress-test strategy resilience against heatwaves and water quotas'}
          </p>
        </div>
      </div>

      {/* Preset Scenario Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={() => handleApplyPreset('NORMAL')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
            scenarioType === 'NORMAL'
              ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
              : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          {lang === 'ar' ? 'الظروف الطبيعية المعتادة' : 'Baseline Normal'}
        </button>

        <button
          onClick={() => handleApplyPreset('HEAT_STRESS')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
            scenarioType === 'HEAT_STRESS'
              ? 'bg-orange-950 border-orange-500 text-orange-300'
              : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          {lang === 'ar' ? 'موجة حرارية شديدة (+3.5°م)' : 'Heatwave (+3.5°C)'}
        </button>

        <button
          onClick={() => handleApplyPreset('WATER_SCARCITY')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
            scenarioType === 'WATER_SCARCITY'
              ? 'bg-blue-950 border-blue-500 text-blue-300'
              : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          {lang === 'ar' ? 'عجز مائي حاد (-30%)' : 'Water Deficit (-30%)'}
        </button>

        <button
          onClick={() => handleApplyPreset('COMBINED_STRESS')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
            scenarioType === 'COMBINED_STRESS'
              ? 'bg-red-950 border-red-500 text-red-300'
              : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          {lang === 'ar' ? 'صدمة مزدوجة (حرارة + شح)' : 'Combined Climate Shock'}
        </button>
      </div>

      {/* Sliders for Custom Exploration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs font-medium">
            <span className="text-slate-300">{t.temp_anomaly}</span>
            <span className="text-orange-400 font-bold">+{tempDelta}°C</span>
          </div>
          <input
            type="range"
            min="0"
            max="6"
            step="0.5"
            value={tempDelta}
            onChange={(e) => setTempDelta(Number(e.target.value))}
            className="w-full accent-orange-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs font-medium">
            <span className="text-slate-300">{t.water_deficit}</span>
            <span className="text-blue-400 font-bold">-{waterCut}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            value={waterCut}
            onChange={(e) => setWaterCut(Number(e.target.value))}
            className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Impact Output Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block">{t.impact_yield}</span>
            <span className={`text-2xl font-bold ${yieldImpact < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {yieldImpact}%
            </span>
          </div>
          <TrendingDown className="w-8 h-8 text-red-500/80" />
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block">{t.impact_profit}</span>
            <span className={`text-2xl font-bold ${profitImpact < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {profitImpact}%
            </span>
          </div>
          <TrendingDown className="w-8 h-8 text-red-500/80" />
        </div>
      </div>
    </div>
  );
}
