'use client';

import React, { useState } from 'react';
import { translations, Language } from '@/i18n/translations';
import { UserCheck, CheckCircle2, Clock, AlertTriangle, MessageSquare, Send } from 'lucide-react';

interface ReviewProps {
  lang: Language;
  userRole?: 'farmer' | 'agronomist' | 'admin';
  fieldName?: string;
}

export default function AgronomistReviewPortal({
  lang,
  userRole = 'agronomist',
  fieldName = 'حقل القمح التجريبي — كفر الشيخ'
}: ReviewProps) {
  const t = translations[lang];

  const [status, setStatus] = useState<'pending' | 'approved' | 'changes_requested'>('approved');
  const [comment, setComment] = useState<string>(
    lang === 'ar'
      ? 'تمت مراجعة بيانات الإجهاد الحراري والاحتياجات المائية للحقل. الاستراتيجية (ب) و (ج) مناسبتان تماماً لدورة المحصول الشتوي مع مراعاة رش سليكات البوتاسيوم في طور طرد السنابل.'
      : 'Field thermal stress and water deficit models reviewed. Strategy B and C are well adapted to winter phenology. Ensure foliar potassium silicate spray at booting stage.'
  );
  const [isSaved, setIsSaved] = useState<boolean>(true);

  const handleSave = () => {
    setIsSaved(true);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            <span>{t.review_title}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'ar'
              ? 'بوابة التحقق المهني والمصادقة الزراعية من قبل المهندسين والمستشارين المعتمدين'
              : 'Professional agronomic validation and peer-review sign-off workflow'}
          </p>
        </div>

        {/* Current Status Badge */}
        <div className="flex items-center gap-2">
          {status === 'approved' && (
            <span className="bg-emerald-950 border border-emerald-500/60 text-emerald-300 text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {t.status_approved}
            </span>
          )}
          {status === 'pending' && (
            <span className="bg-amber-950 border border-amber-500/60 text-amber-300 text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              {t.status_pending}
            </span>
          )}
          {status === 'changes_requested' && (
            <span className="bg-orange-950 border border-orange-500/60 text-orange-300 text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              {t.status_changes}
            </span>
          )}
        </div>
      </div>

      {/* Agronomist Inputs & Status Change */}
      <div className="space-y-4">
        <div>
          <label className="text-xs text-slate-400 block mb-2 font-medium">
            {lang === 'ar' ? 'تحديد حالة الاعتماد المهني للاستراتيجية:' : 'Set Agronomic Validation Status:'}
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => { setStatus('approved'); setIsSaved(false); }}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                status === 'approved'
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t.status_approved}</span>
            </button>

            <button
              onClick={() => { setStatus('pending'); setIsSaved(false); }}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                status === 'pending'
                  ? 'bg-amber-950 border-amber-500 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{t.status_pending}</span>
            </button>

            <button
              onClick={() => { setStatus('changes_requested'); setIsSaved(false); }}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                status === 'changes_requested'
                  ? 'bg-orange-950 border-orange-500 text-orange-300'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{t.status_changes}</span>
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-400 block mb-1 font-medium flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'ar' ? 'ملاحظات وتوجيهات المهندس الزراعي للمزارع:' : 'Agronomist Recommendations & Notes:'}</span>
          </label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => { setComment(e.target.value); setIsSaved(false); }}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 leading-relaxed"
          />
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{t.submit_review}</span>
        </button>

        {isSaved && (
          <span className="text-xs text-emerald-400 font-semibold block pt-1">
            {lang === 'ar' ? '✓ تم حفظ وتحديث سجل مراجعة المهندس الزراعي' : '✓ Agronomist review logged successfully'}
          </span>
        )}
      </div>
    </div>
  );
}
