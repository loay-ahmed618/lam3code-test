'use client';

import React from 'react';
import { translations, Language } from '@/i18n/translations';
import { Printer, FileText, CheckCircle, Shield, Calendar, MapPin, Globe } from 'lucide-react';

interface ReportProps {
  lang: Language;
  onPrint?: () => void;
}

export default function PrintableFieldReport({ lang }: ReportProps) {
  const t = translations[lang];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span>{lang === 'ar' ? 'التقرير الشامل لدعم القرار الزراعي (Bilingual Report)' : 'Bilingual Comprehensive Decision Support Report'}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'ar'
              ? 'وثيقة رسمية تتضمن المؤشرات البيئية، مقارنة الاستراتيجيات، والاعتماد المهني'
              : 'Official briefing summarizing NASA environmental metrics, strategy comparisons, and professional sign-off'}
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>{t.report_btn}</span>
        </button>
      </div>

      {/* Styled Printable Sheet */}
      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-5 text-xs text-slate-300 print:bg-white print:text-black">
        {/* Document Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4 print:border-black">
          <div>
            <span className="text-emerald-400 font-extrabold text-lg block tracking-wider print:text-emerald-700">
              SOLDOC AGRO-INTELLIGENCE
            </span>
            <span className="text-slate-400 text-xs block">
              {lang === 'ar' ? 'منظومة دعم القرار الزراعي الذكية' : 'Smart Agricultural Decision Support System'}
            </span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block">{lang === 'ar' ? 'رقم التقرير:' : 'Report Ref:'} SOLDOC-EG-2025-084</span>
            <span className="text-slate-400 block">{lang === 'ar' ? 'تاريخ الإصدار:' : 'Issued:'} {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Parcel Profile */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 print:bg-gray-100">
          <div>
            <span className="text-slate-500 block">{t.field_name}</span>
            <span className="font-bold text-white print:text-black">{lang === 'ar' ? 'حقل القمح النموذجي' : 'Demonstration Wheat Field'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">{t.area}</span>
            <span className="font-bold text-emerald-400 print:text-black">4.80 {t.feddan} (2.02 {t.hectare})</span>
          </div>
          <div>
            <span className="text-slate-500 block">{t.crop} & {t.season}</span>
            <span className="font-bold text-white print:text-black">{lang === 'ar' ? 'قمح (موسم شتوي 24/25)' : 'Wheat (Winter 24/25)'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">{lang === 'ar' ? 'الموقع' : 'Location'}</span>
            <span className="font-bold text-white print:text-black">Kafr El-Sheikh, Egypt</span>
          </div>
        </div>

        {/* Strategy Summary in Report */}
        <div className="space-y-2">
          <h4 className="font-bold text-emerald-400 text-sm print:text-emerald-700">
            {lang === 'ar' ? 'الاستراتيجية الموصى بها الأولى (الرتبة #1):' : 'Top Feasible Recommended Strategy (Rank #1):'}
          </h4>
          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 print:bg-gray-50">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-white print:text-black">
                {lang === 'ar' ? 'الاستراتيجية (ج) — الإدارة المتكاملة المرنة للمناخ' : 'Strategy C — Climate-Resilient Integrated Agro-Ecology'}
              </span>
              <span className="text-emerald-400 font-bold print:text-emerald-700">{t.score}: 95.2</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              {lang === 'ar'
                ? 'تحقق الاستراتيجية أفضل توازن بين خفض استهلاك المياه بنسبة 22% مقارنة بالغمر التقليدي، وتحقيق إنتاجية 3.22 طن/فدان مع صافي أرباح 89,500 جنيه لمساحة الحقل، مع تقليل مخاطر موجات الحر إلى أدنى مستوى.'
                : 'Achieves ideal synergy: reduces water demand by 22% versus conventional flood, delivers 3.22 t/feddan with 89,500 EGP net return across field, and minimizes heatwave risk.'}
            </p>
          </div>
        </div>

        {/* Scientific Disclosures Statement */}
        <div className="border-t border-slate-800 pt-3 text-[11px] text-slate-400 leading-relaxed print:text-gray-600">
          <span className="font-bold block text-slate-300 print:text-black">
            {t.scientific_disclaimer_title}
          </span>
          {t.scientific_disclaimer_body}
        </div>
      </div>
    </div>
  );
}
