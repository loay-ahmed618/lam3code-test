'use client';

import React from 'react';
import { translations, Language } from '@/i18n/translations';
import { Sun, CloudRain, Thermometer, Droplets, Activity, ShieldAlert, AlertCircle } from 'lucide-react';

interface EnvironmentalMetricsProps {
  lang: Language;
  metrics?: {
    avg_temperature_c: number;
    max_temperature_c: number;
    heat_stress_days_count: number;
    accumulated_precipitation_mm: number;
    avg_solar_radiation_mj: number;
    drought_risk_level: string;
    heat_risk_level: string;
  };
  ndvi?: number;
  soilMoisturePct?: number;
}

export default function EnvironmentalDashboard({
  lang,
  metrics = {
    avg_temperature_c: 24.2,
    max_temperature_c: 32.5,
    heat_stress_days_count: 0,
    accumulated_precipitation_mm: 1.2,
    avg_solar_radiation_mj: 19.4,
    drought_risk_level: 'Moderate',
    heat_risk_level: 'Low'
  },
  ndvi = 0.68,
  soilMoisturePct = 28.5
}: EnvironmentalMetricsProps) {
  const t = translations[lang];

  return (
    <div className="space-y-4">
      {/* Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Temp Card */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-medium">{t.avg_temp}</span>
            <Thermometer className="w-4 h-4 text-orange-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white">{metrics.avg_temperature_c}°C</span>
            <span className="text-xs text-slate-400">({metrics.max_temperature_c}° max)</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {t.heat_stress_days}: <span className="text-amber-400 font-semibold">{metrics.heat_stress_days_count}</span>
          </div>
        </div>

        {/* Solar Radiation */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-medium">{t.solar_rad}</span>
            <Sun className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white">{metrics.avg_solar_radiation_mj}</span>
            <span className="text-xs text-slate-400">MJ/m²/day</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-400 font-medium">
            {lang === 'ar' ? 'سطوع شمسي مثالي للتمثيل الضوئي' : 'Optimal solar insolation'}
          </div>
        </div>

        {/* Soil Moisture */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-medium">{lang === 'ar' ? 'رطوبة التربة (NASA SMAP)' : 'Soil Moisture (SMAP)'}</span>
            <Droplets className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white">{soilMoisturePct}%</span>
            <span className="text-xs text-slate-400">volumetric</span>
          </div>
          <div className="mt-1 text-[11px] text-blue-300">
            {lang === 'ar' ? 'مروية ومستقرة سطحياً' : 'Adequately saturated'}
          </div>
        </div>

        {/* Vegetation NDVI */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-medium">{t.vegetation_ndvi}</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white">{ndvi}</span>
            <span className="text-xs text-slate-400">/ 1.0</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-300 font-medium">
            {lang === 'ar' ? 'كثافة خضرية جيدة' : 'Healthy canopy index'}
          </div>
        </div>
      </div>

      {/* Transparent Scientific Disclaimer Box */}
      <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-4 shadow-xl">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              {t.scientific_disclaimer_title}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.scientific_disclaimer_body}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
