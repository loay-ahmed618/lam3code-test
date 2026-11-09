'use client';

import React, { useState } from 'react';
import { translations, Language } from '@/i18n/translations';
import { DollarSign, PieChart, Calculator, Check } from 'lucide-react';

interface FinancialsProps {
  lang: Language;
  areaFeddan?: number;
}

export default function FinancialCalculator({ lang, areaFeddan = 4.8 }: FinancialsProps) {
  const t = translations[lang];

  const [seedCost, setSeedCost] = useState<number>(1600 * areaFeddan);
  const [fertCost, setFertCost] = useState<number>(3200 * areaFeddan);
  const [irrigationCost, setIrrigationCost] = useState<number>(1400 * areaFeddan);
  const [laborCost, setLaborCost] = useState<number>(2800 * areaFeddan);
  const [machineryCost, setMachineryCost] = useState<number>(2200 * areaFeddan);
  const [pesticideCost, setPesticideCost] = useState<number>(900 * areaFeddan);
  const [sellingPrice, setSellingPrice] = useState<number>(10000); // EGP per ton
  const [expectedYield, setExpectedYield] = useState<number>(3.2 * areaFeddan); // Tons

  const totalCosts = seedCost + fertCost + irrigationCost + laborCost + machineryCost + pesticideCost;
  const grossRevenue = expectedYield * sellingPrice;
  const netProfit = grossRevenue - totalCosts;
  const breakevenPrice = expectedYield > 0 ? totalCosts / expectedYield : 0;
  const breakevenYield = sellingPrice > 0 ? totalCosts / sellingPrice : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span>{t.fin_title}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'ar'
              ? 'تحليل التكاليف التشغيلية والأرباح الصافية ونقطة التعادل لمساحة الحقل الإجمالية'
              : 'Detailed operational expenditure breakdown, net return, and break-even pricing'}
          </p>
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <label className="text-slate-400 block mb-1">{lang === 'ar' ? 'تكلفة التقاوي (EGP)' : 'Seed Cost (EGP)'}</label>
          <input
            type="number"
            value={seedCost}
            onChange={(e) => setSeedCost(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
          />
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <label className="text-slate-400 block mb-1">{lang === 'ar' ? 'تكلفة التسميد (EGP)' : 'Fertilizer Cost (EGP)'}</label>
          <input
            type="number"
            value={fertCost}
            onChange={(e) => setFertCost(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
          />
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <label className="text-slate-400 block mb-1">{lang === 'ar' ? 'تكاليف الري والوقود (EGP)' : 'Irrigation & Fuel (EGP)'}</label>
          <input
            type="number"
            value={irrigationCost}
            onChange={(e) => setIrrigationCost(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
          />
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <label className="text-slate-400 block mb-1">{lang === 'ar' ? 'العمالة والتشغيل (EGP)' : 'Labor Cost (EGP)'}</label>
          <input
            type="number"
            value={laborCost}
            onChange={(e) => setLaborCost(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
          />
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <label className="text-slate-400 block mb-1">{lang === 'ar' ? 'سعر بيع الطن (EGP/طن)' : 'Selling Price / Ton'}</label>
          <input
            type="number"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-emerald-400 font-bold"
          />
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <label className="text-slate-400 block mb-1">{lang === 'ar' ? 'إجمالي المحصول (طن)' : 'Expected Total Yield (t)'}</label>
          <input
            type="number"
            value={expectedYield}
            onChange={(e) => setExpectedYield(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-bold"
          />
        </div>
      </div>

      {/* Results Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 block">{t.total_costs}</span>
          <span className="text-xl font-bold text-white mt-1 block">
            {totalCosts.toLocaleString()} EGP
          </span>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 block">{t.gross_revenue}</span>
          <span className="text-xl font-bold text-white mt-1 block">
            {grossRevenue.toLocaleString()} EGP
          </span>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/50 bg-emerald-950/20">
          <span className="text-xs text-emerald-400 font-medium block">{t.net_profit}</span>
          <span className="text-2xl font-bold text-emerald-300 mt-1 block">
            {netProfit.toLocaleString()} EGP
          </span>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 block">{t.breakeven_price}</span>
          <span className="text-xl font-bold text-amber-300 mt-1 block">
            {breakevenPrice.toFixed(0)} EGP
          </span>
          <span className="text-[10px] text-slate-500">
            {t.breakeven_yield}: {breakevenYield.toFixed(1)} t
          </span>
        </div>
      </div>
    </div>
  );
}
