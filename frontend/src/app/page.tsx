'use client';

import React, { useState, useEffect } from 'react';
import { translations, Language } from '@/i18n/translations';
import { api, FieldDto } from '@/services/api';
import FieldMap from '@/components/FieldMap';
import EnvironmentalDashboard from '@/components/EnvironmentalDashboard';
import GoalIntelligenceEngine from '@/components/GoalIntelligenceEngine';
import StrategyComparisonMatrix, { StrategyItem } from '@/components/StrategyComparisonMatrix';
import ScenarioSimulator from '@/components/ScenarioSimulator';
import FinancialCalculator from '@/components/FinancialCalculator';
import AgronomistReviewPortal from '@/components/AgronomistReviewPortal';
import PrintableFieldReport from '@/components/PrintableFieldReport';
import { Sprout, User, Compass, Wifi, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const [lang, setLang] = useState<Language>('ar');
  const t = translations[lang];
  const [backendStatus, setBackendStatus] = useState<string>('checking');
  const [activeField, setActiveField] = useState<FieldDto | null>(null);

  // Initial Strategies data
  const [strategies, setStrategies] = useState<StrategyItem[]>([
    {
      strategy_code: "STRATEGY_C",
      name_en: "Strategy C — Climate-Resilient Integrated Agro-Ecology (Balanced)",
      name_ar: "الاستراتيجية (ج) — الإدارة المتكاملة المرنة للمناخ (المتوازنة)",
      description_en: "Balanced approach combining heat-tolerant cultivars, anti-transpirant potassium silicate sprays, mulching, and regulated deficit irrigation.",
      description_ar: "استراتيجية متوازنة تجمع بين الأصناف المقاومة للإجهاد الحراري، ورش سليكات البوتاسيوم لتخفيف الصدمات، وتغطية التربة بالملش والري الناقص المقنن.",
      is_feasible: true,
      violated_constraints: [],
      expected_yield_ton_per_feddan: 3.22,
      water_use_m3_per_feddan: 1872.0,
      soil_health_index: 85.0,
      production_cost_egp_per_feddan: 9690.0,
      expected_net_profit_egp: 22510.0,
      climate_risk_score: 25.0,
      input_dependency_score: 40.0,
      final_score: 95.2,
      rank: 1,
      explanation_en: "Ranks #1 based on active priorities (Yield: 35%, Water: 30%, Profit: 20%). Delivers high yield resilience with lowest heat stress vulnerability.",
      explanation_ar: "تحتل المرتبة الأولى بناءً على أوزان أهدافك (إنتاجية: 35%، مياه: 30%، أرباح: 20%). تحقق إنتاجية ثابتة ومقاومة قصوى لموجات الحر.",
      assumptions_en: ["Potassium silicate applied at booting stage", "Soil moisture monitored at 30cm depth"],
      assumptions_ar: ["رش سليكات البوتاسيوم في طور طرد السنابل", "مراقبة رطوبة التربة على عمق 30 سم"],
      tradeoffs_en: ["Higher upfront planning required", "Outstanding water economy and soil carbon conservation"],
      tradeoffs_ar: ["تتطلب تخطيطاً دقيقاً في مواعيد الرش", "توفير ممتاز في مياه الري وحماية خصوبة التربة على المدى الطويل"]
    },
    {
      strategy_code: "STRATEGY_B",
      name_en: "Strategy B — Priority-Optimized Precision Fertigation",
      name_ar: "الاستراتيجية (ب) — التسميد والري الدقيق الموجه للأهداف",
      description_en: "Engineered specifically to maximize water use efficiency and grain weight via micro-irrigation scheduling.",
      description_ar: "مخصصة لتحقيق أعلى كفاءة مائية مع زيادة وزن الحبوب عبر جدولة الري والتسميد المركز.",
      is_feasible: true,
      violated_constraints: [],
      expected_yield_ton_per_feddan: 3.50,
      water_use_m3_per_feddan: 2280.0,
      soil_health_index: 70.0,
      production_cost_egp_per_feddan: 11210.0,
      expected_net_profit_egp: 23790.0,
      climate_risk_score: 45.0,
      input_dependency_score: 65.0,
      final_score: 87.4,
      rank: 2,
      explanation_en: "Strong production output, but requires slightly higher chemical inputs and operating capital.",
      explanation_ar: "إنتاجية مرتفعة ممتازة، ولكنها تتطلب استثماراً أعلى في مستلزمات التسميد ورأس المال التشغيلي.",
      assumptions_en: ["Certified hybrid seed purity >= 98%"],
      assumptions_ar: ["استخدام تقاوي هجين معتمدة بنقاوة لا تقل عن 98%"],
      tradeoffs_en: ["Maximizes tonnage per feddan", "Requires strict fertigation hardware management"],
      tradeoffs_ar: ["تحقق أعلى محصول بالطن للفدان", "تحتاج إدارة ومتابعة لشبكة التسميد والتنقيط"]
    },
    {
      strategy_code: "STRATEGY_A",
      name_en: "Strategy A — Conventional Flood & Inputs (Current Practice)",
      name_ar: "الاستراتيجية (أ) — الممارسة التقليدية الحالية (ري سطحي بالغمر)",
      description_en: "Traditional basin flood irrigation with scheduled broadcast urea/NPK application.",
      description_ar: "الري بالغمر السطحي التقليدي مع نثار سماد اليوريا والمركبات الشائعة.",
      is_feasible: true,
      violated_constraints: [],
      expected_yield_ton_per_feddan: 2.80,
      water_use_m3_per_feddan: 2760.0,
      soil_health_index: 52.0,
      production_cost_egp_per_feddan: 9500.0,
      expected_net_profit_egp: 18500.0,
      climate_risk_score: 68.0,
      input_dependency_score: 75.0,
      final_score: 64.1,
      rank: 3,
      explanation_en: "Baseline practice. Lowest capital cost, but high water losses and vulnerability to climatic fluctuations.",
      explanation_ar: "الممارسة المرجعية الحالية. أقل تكلفة أولية، لكنها تعاني من فواقد مياه عالية وعرضة للتقلبات الجوية.",
      assumptions_en: ["Flood conveyance efficiency ~55%"],
      assumptions_ar: ["كفاءة نقل وتوزيع مياه الغمر 55%"],
      tradeoffs_en: ["No special equipment needed", "Significant evaporation and nitrate leaching losses"],
      tradeoffs_ar: ["لا تتطلب معدات متخصصة", "فواقد بخر وغسيل آزوت مرتفعة في التربة"]
    }
  ]);

  // Sync HTML lang and dir attribute
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Connect to Backend API on mount
  useEffect(() => {
    async function initBackend() {
      const health = await api.getHealth();
      if (health.status === 'healthy') {
        setBackendStatus('online');
      } else {
        setBackendStatus('fallback');
      }

      // Fetch active field from backend
      const fields = await api.getFields();
      if (fields && fields.length > 0) {
        setActiveField(fields[0]);
      }
    }
    initBackend();
  }, []);

  const handleApplyGoals = async (weights: any, constraints: any) => {
    // Attempt backend evaluation
    const backendResult = await api.evaluateStrategies(
      activeField?.crop_type || "Wheat",
      activeField?.area_feddan || 12.4,
      weights,
      constraints
    );

    if (backendResult && backendResult.strategies) {
      setStrategies(backendResult.strategies);
      return;
    }

    // Fallback client-side recalculation
    const updated = strategies.map(s => {
      const isWaterBreached = constraints.isWaterHard && s.water_use_m3_per_feddan > constraints.waterQuota;
      const isBudgetBreached = constraints.isBudgetHard && s.production_cost_egp_per_feddan > constraints.maxBudget;

      const violations: string[] = [];
      if (isWaterBreached) violations.push(lang === 'ar' ? `تجاوز حصة المياه (${s.water_use_m3_per_feddan} > ${constraints.waterQuota} م³)` : `Exceeds water quota (${s.water_use_m3_per_feddan} > ${constraints.waterQuota} m³)`);
      if (isBudgetBreached) violations.push(lang === 'ar' ? `تجاوز سقف الميزانية (${s.production_cost_egp_per_feddan} > ${constraints.maxBudget} EGP)` : `Exceeds budget (${s.production_cost_egp_per_feddan} > ${constraints.maxBudget} EGP)`);

      const feasible = violations.length === 0;
      let score = s.final_score;
      if (!feasible) {
        score = 0.0;
      } else {
        const wWater = weights.water / 100;
        const wYield = weights.yield / 100;
        const wProfit = weights.profit / 100;
        score = Number(((s.expected_yield_ton_per_feddan / 3.5 * 100 * wYield) + (100 - (s.water_use_m3_per_feddan / 2800 * 40)) * wWater + 80 * wProfit).toFixed(1));
      }

      return {
        ...s,
        is_feasible: feasible,
        violated_constraints: violations,
        final_score: score
      };
    });

    updated.sort((a, b) => (b.is_feasible ? b.final_score : -1) - (a.is_feasible ? a.final_score : -1));
    updated.forEach((item, index) => { item.rank = index + 1; });
    setStrategies(updated);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-950">
              <Sprout className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white block">
                SOLDOC
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider block">
                Agro-Decision Support
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Backend Connectivity Status Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800/80 border border-slate-700">
              {backendStatus === 'online' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">FastAPI Core Active</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-300">FastAPI Standby</span>
                </>
              )}
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setLang('ar')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  lang === 'ar' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                العربية
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  lang === 'en' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
            </div>

            {/* User Profile Badge */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
              <User className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 font-medium">
                {lang === 'ar' ? 'م/ أحمد الشناوي' : 'Eng. Ahmed Shennawy'}
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded font-semibold border border-emerald-600/40">
                {t.role_agronomist}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl">
          <div className="max-w-3xl space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/40">
              <Compass className="w-3.5 h-3.5" />
              {lang === 'ar' ? 'منظومة دعم القرار الزراعي المتكاملة' : 'Integrated Agro-Decision Intelligence'}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {t.app_title}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* 1. GIS Map & Field Management */}
        <section id="fields" className="space-y-3">
          <FieldMap lang={lang} />
        </section>

        {/* 2. NASA Environmental Indicators Dashboard */}
        <section id="environmental" className="space-y-3">
          <div className="border-b border-slate-800 pb-2">
            <h2 className="text-lg font-bold text-white">
              {t.nasa_data_title}
            </h2>
          </div>
          <EnvironmentalDashboard lang={lang} />
        </section>

        {/* 3. Farmer Goal Intelligence Engine */}
        <section id="goals" className="space-y-3">
          <GoalIntelligenceEngine lang={lang} onApplyGoals={handleApplyGoals} />
        </section>

        {/* 4. Strategy Comparison Matrix */}
        <section id="strategies" className="space-y-3">
          <StrategyComparisonMatrix lang={lang} strategies={strategies} />
        </section>

        {/* 5. Scenario Stress Simulator */}
        <section id="simulation" className="space-y-3">
          <ScenarioSimulator lang={lang} />
        </section>

        {/* 6. Financial Analysis Calculator */}
        <section id="finances" className="space-y-3">
          <FinancialCalculator lang={lang} />
        </section>

        {/* 7. Agronomist Review Portal */}
        <section id="review" className="space-y-3">
          <AgronomistReviewPortal lang={lang} />
        </section>

        {/* 8. Bilingual Printable Report */}
        <section id="report" className="space-y-3">
          <PrintableFieldReport lang={lang} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>© {new Date().getFullYear()} SOLDOC — {lang === 'ar' ? 'منصة دعم القرار الزراعي الذكي لمزارع الدلتا ومصر' : 'Smart Agricultural Decision Support Platform for Egypt'}</p>
          <p className="text-[11px] text-slate-500">
            {lang === 'ar'
              ? 'البيانات الميتيورولوجية مقدمة عبر NASA POWER. مؤشرات الأقمار الصناعية (SMAP و Landsat) هي مؤشرات إقليمية استكشافية وتتطلب التحقق الحقلي المستمر.'
              : 'Agro-climatology via NASA POWER AG. Satellite indicators (SMAP & Landsat) represent regional exploratory proxies and necessitate routine ground-truth validation.'}
          </p>
        </div>
      </footer>
    </div>
  );
}
