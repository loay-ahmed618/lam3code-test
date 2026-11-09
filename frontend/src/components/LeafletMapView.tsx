'use client';

import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface Point {
  lat: number;
  lng: number;
}

interface LeafletMapViewProps {
  coordinates: Point[];
  onPolygonChange: (coords: Point[]) => void;
  center: [number, number];
}

export default function LeafletMapView({ coordinates, onPolygonChange, center }: LeafletMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonRef = useRef<L.Polygon | null>(null);
  const markersRef = useRef<L.Marker[]>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Fix default marker icon in Leaflet webpack/nextjs environments
    const DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    const map = L.map(mapContainerRef.current).setView(center, 15);
    mapInstanceRef.current = map;

    // OpenStreetMap standard tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | SOLDOC GeoEngine',
      maxZoom: 19,
    }).addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clean previous polygon and markers
    if (polygonRef.current) {
      polygonRef.current.remove();
    }
    if (markersRef.current) {
      markersRef.current.forEach((m) => m.remove());
    }

    const latLngs = coordinates.map((c) => [c.lat, c.lng] as [number, number]);
    const poly = L.polygon(latLngs, {
      color: '#16a34a',
      fillColor: '#22c55e',
      fillOpacity: 0.35,
      weight: 3,
    }).addTo(map);
    polygonRef.current = poly;

    // Add draggable vertex markers to allow farmer boundary adjustment
    const markers: L.Marker[] = [];
    coordinates.forEach((pt, index) => {
      const marker = L.marker([pt.lat, pt.lng], {
        draggable: true,
        title: `Point ${index + 1}`,
      }).addTo(map);

      marker.on('dragend', () => {
        const newPos = marker.getLatLng();
        const updated = [...coordinates];
        updated[index] = { lat: Number(newPos.lat.toFixed(5)), lng: Number(newPos.lng.toFixed(5)) };
        onPolygonChange(updated);
      });

      markers.push(marker);
    });
    // @ts-ignore
    markersRef.current = markers;

    if (latLngs.length > 0) {
      map.fitBounds(poly.getBounds(), { padding: [20, 20] });
    }
  }, [coordinates]);

  return <div ref={mapContainerRef} className="w-full h-80 rounded-xl overflow-hidden border border-emerald-200 z-0" />;
}
