'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { translations, Language } from '@/i18n/translations';
import { MapPin, RefreshCw, Layers } from 'lucide-react';

const LeafletMapView = dynamic(() => import('./LeafletMapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 rounded-xl bg-emerald-50/50 flex flex-col items-center justify-center border border-emerald-100 text-emerald-700">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mb-2"></div>
      <p className="text-sm font-medium">Loading OpenStreetMap Nile Delta Tiles...</p>
    </div>
  ),
});

interface Point {
  lat: number;
  lng: number;
}

interface FieldMapProps {
  lang: Language;
  onBoundaryUpdate?: (coords: Point[], areaFeddans: number) => void;
}

export default function FieldMap({ lang, onBoundaryUpdate }: FieldMapProps) {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'osm' | 'satellite'>('osm');

  // Realistic Nile Delta coordinates (Kafr El-Sheikh agricultural district)
  const [polygon, setPolygon] = useState<Point[]>([
    { lat: 31.1125, lng: 30.9355 },
    { lat: 31.1142, lng: 30.9421 },
    { lat: 31.1088, lng: 30.9442 },
    { lat: 31.1072, lng: 30.9372 },
  ]);

  // Geodesic area calculation
  const calculateArea = (points: Point[]) => {
    if (points.length < 3) return { feddans: 0, hectares: 0 };
    const avgLat = points.reduce((acc, p) => acc + p.lat, 0) / points.length;
    const latRad = (avgLat * Math.PI) / 180;
    const R = 6378137;
    const xy = points.map((p) => ({
      x: ((p.lng * Math.PI) / 180) * R * Math.cos(latRad),
      y: ((p.lat * Math.PI) / 180) * R,
    }));
    let area = 0;
    for (let i = 0; i < xy.length; i++) {
      const j = (i + 1) % xy.length;
      area += xy[i].x * xy[j].y;
      area -= xy[j].x * xy[i].y;
    }
    const sqM = Math.abs(area) / 2;
    const feddans = Number((sqM / 4200.833).toFixed(1));
    const hectares = Number((sqM / 10000).toFixed(2));
    return { feddans, hectares };
  };

  const { feddans, hectares } = calculateArea(polygon);

  const handlePolygonChange = (newCoords: Point[]) => {
    setPolygon(newCoords);
    const { feddans } = calculateArea(newCoords);
    if (onBoundaryUpdate) {
      onBoundaryUpdate(newCoords, feddans);
    }
  };

  const resetBoundary = () => {
    const defaultCoords = [
      { lat: 31.1125, lng: 30.9355 },
      { lat: 31.1142, lng: 30.9421 },
      { lat: 31.1088, lng: 30.9442 },
      { lat: 31.1072, lng: 30.9372 },
    ];
    handlePolygonChange(defaultCoords);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <MapPin className="text-emerald-600 w-5 h-5" />
            {lang === 'ar' ? 'الخريطة الحقلية وتحديد الحدود الجغرافية' : 'Digital Field Boundary & GIS Mapping'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {lang === 'ar'
              ? 'تحديد دقيق لمضلع الحقل على خريطة دلتا النيل مع حساب أوتوماتيكي للمساحة بالفدان والهكتار.'
              : 'Interactive Nile Delta polygon boundary with automated geodesic area computation in Feddans.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('osm')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'osm' ? 'bg-white shadow-xs text-emerald-700' : 'text-slate-600'
              }`}
            >
              OpenStreetMap
            </button>
            <button
              onClick={() => setActiveTab('satellite')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'satellite' ? 'bg-white shadow-xs text-emerald-700' : 'text-slate-600'
              }`}
            >
              {lang === 'ar' ? 'أقمار صناعية' : 'Satellite (Imagery)'}
            </button>
          </div>

          <button
            onClick={resetBoundary}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50 rounded-lg border border-slate-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {lang === 'ar' ? 'إعادة ضبط المضلع' : 'Reset Polygon'}
          </button>
        </div>
      </div>

      {/* Real Interactive Leaflet Map */}
      <div className="relative">
        <LeafletMapView
          coordinates={polygon}
          onPolygonChange={handlePolygonChange}
          center={[31.1107, 30.9388]}
        />

        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-3 py-2 rounded-lg shadow-md border border-slate-200 text-xs text-slate-600 z-1000">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
            <Layers className="w-3.5 h-3.5" />
            <span>Nile Delta — Kafr El-Sheikh</span>
          </div>
          <span className="text-[11px] text-slate-500">31°06'38"N, 30°56'20"E</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100">
        <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
          <span className="text-xs text-emerald-700 block font-medium">
            {lang === 'ar' ? 'المساحة المحسوبة' : 'Calculated Area'}
          </span>
          <span className="text-lg font-bold text-emerald-900">
            {feddans} {t.feddan}
          </span>
          <span className="text-xs text-emerald-600 block">
            ({hectares} {lang === 'ar' ? 'هكتار' : 'Hectares'})
          </span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 block font-medium">
            {lang === 'ar' ? 'الإحداثيات المركزية' : 'Center Coordinates'}
          </span>
          <span className="text-xs font-semibold text-slate-700 block font-mono">
            {polygon[0].lat.toFixed(4)}° N
          </span>
          <span className="text-xs font-semibold text-slate-700 block font-mono">
            {polygon[0].lng.toFixed(4)}° E
          </span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 block font-medium">
            {lang === 'ar' ? 'نقاط المضلع' : 'Polygon Vertices'}
          </span>
          <span className="text-lg font-bold text-slate-800">
            {polygon.length} {lang === 'ar' ? 'نقاط' : 'points'}
          </span>
          <span className="text-xs text-slate-500 block">
            {lang === 'ar' ? 'قابلة للسحب بالخريطة' : 'Draggable on map'}
          </span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 block font-medium">
            {lang === 'ar' ? 'المحصول والموسم' : 'Crop & Season'}
          </span>
          <span className="text-sm font-bold text-slate-800 block truncate">
            {lang === 'ar' ? 'قمح (جيزة 171)' : 'Wheat (Giza 171)'}
          </span>
          <span className="text-xs text-emerald-600 font-medium">
            {lang === 'ar' ? 'الموسم الشتوي 2024 / 2025' : 'Winter Season 2024 / 2025'}
          </span>
        </div>
      </div>
    </div>
  );
}
