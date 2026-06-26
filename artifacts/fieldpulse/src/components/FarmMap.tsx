'use client';

import { useMemo, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

interface FarmMapProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
  readOnly?: boolean;
}

function computeBoundary(lat: number, lng: number, sizeKm = 0.2): [number, number][] {
  const latOffset = sizeKm / 111;
  const lngOffset = sizeKm / (111 * Math.cos((lat * Math.PI) / 180));
  return [
    [lat + latOffset, lng - lngOffset],
    [lat + latOffset, lng + lngOffset],
    [lat - latOffset, lng + lngOffset],
    [lat - latOffset, lng - lngOffset],
  ];
}

function DraggableMarker({ position, onMove }: { position: [number, number]; onMove: (lat: number, lng: number) => void }) {
  const markerRef = useCallback((ref: L.Marker | null) => {
    if (ref) {
      ref.on('dragend', () => {
        const pos = ref.getLatLng();
        onMove(pos.lat, pos.lng);
      });
    }
  }, [onMove]);

  return (
    <Marker ref={markerRef} position={position} draggable={true}>
      <Popup>
        <div className="text-center font-sans">
          <p className="font-semibold text-xs">Your Farm</p>
          <p className="text-[10px] text-gray-500">{position[0].toFixed(4)}, {position[1].toFixed(4)}</p>
        </div>
      </Popup>
    </Marker>
  );
}

function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({ click(e) { onClick(e.latlng.lat, e.latlng.lng); } });
  return null;
}

function FitBounds({ bounds }: { bounds: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 17 });
    }
  }, [map, bounds]);
  return null;
}

export default function FarmMap({ latitude, longitude, onLocationChange, readOnly = false }: FarmMapProps) {
  const boundary = useMemo(() => computeBoundary(latitude, longitude), [latitude, longitude]);
  const center: [number, number] = [latitude, longitude];

  return (
    <div className="rounded-xl overflow-hidden border border-[#ECE8E1] shadow-xs" style={{ height: 340, isolation: 'isolate' }}>
      <MapContainer
        center={center}
        zoom={16}
        className="w-full h-full"
        zoomControl={!readOnly}
        dragging={!readOnly}
        scrollWheelZoom={!readOnly}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {!readOnly && <MapClickHandler onClick={(lat, lng) => onLocationChange(lat, lng)} />}
        <DraggableMarker position={center} onMove={(lat, lng) => onLocationChange(lat, lng)} />
        <Polygon
          positions={boundary}
          pathOptions={{
            color: '#22A34F',
            weight: 2,
            fillColor: '#22A34F',
            fillOpacity: 0.08,
            dashArray: '6, 4',
          }}
        />
        <FitBounds bounds={boundary} />
      </MapContainer>
      {!readOnly && (
        <div className="text-[9px] text-[#6B6B6B] text-center py-1.5 bg-white border-t border-[#ECE8E1] font-sans">
          Drag the marker to adjust farm location &middot; Click anywhere to move
        </div>
      )}
    </div>
  );
}
