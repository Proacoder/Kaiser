import React, { useState } from "react";
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow, 
  useAdvancedMarkerRef 
} from "@vis.gl/react-google-maps";
import { MapContainer, TileLayer, Marker as LeafletMarker, Popup as LeafletPopup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Complaint } from "../types";
import { useNavigate } from "react-router-dom";
import { MapPin, ArrowRight, ExternalLink, Key, Layers } from "lucide-react";

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  "";

const hasValidKey = Boolean(API_KEY) && API_KEY !== "YOUR_API_KEY";

interface MumbaiMapProps {
  complaints?: Complaint[];
  selectedLocation?: { lat: number; lng: number } | null;
  onSelectLocation?: (lat: number, lng: number) => void;
  height?: string;
  zoom?: number;
  center?: [number, number];
}

// Leaflet Location Picker Subcomponent
const LeafletLocationPicker: React.FC<{ onSelect: (lat: number, lng: number) => void }> = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Subcomponent for Google Maps Marker + InfoWindow
const GoogleMapComplaintMarker: React.FC<{ complaint: Complaint }> = ({ complaint }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const getMarkerColor = (c: Complaint) => {
    if (c.status === "Resolved") return "#10B981"; // Emerald
    if (c.severity >= 80) return "#E11D48"; // Critical Rose Red
    if (c.severity >= 60) return "#F59E0B"; // High Amber
    return "#0284C7"; // Sky Blue
  };

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: complaint.latitude, lng: complaint.longitude }}
        onClick={() => setOpen(true)}
        title={complaint.title}
      >
        <Pin 
          background={getMarkerColor(complaint)} 
          glyphColor="#ffffff" 
          borderColor="#ffffff" 
        />
      </AdvancedMarker>

      {open && (
        <InfoWindow anchor={marker} onCloseClick={() => setOpen(false)}>
          <div className="p-2 max-w-xs font-sans text-xs">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-slate-100 text-slate-700">
                {complaint.category}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-100 text-blue-800">
                {complaint.status}
              </span>
            </div>

            <h4 className="font-bold text-slate-900 text-sm mb-1 leading-snug">
              {complaint.title}
            </h4>

            <p className="text-slate-600 text-[11px] line-clamp-2 mb-2">
              {complaint.description}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-slate-500">
              <span className="font-medium text-[11px]">
                Ward {complaint.ward} ({complaint.wardName})
              </span>
              <button
                onClick={() => navigate(`/complaint/${complaint.id}`)}
                className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1 text-[11px]"
              >
                Inspect <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export const MumbaiMap: React.FC<MumbaiMapProps> = ({
  complaints = [],
  selectedLocation,
  onSelectLocation,
  height = "520px",
  zoom = 12,
  center = [19.076, 72.877],
}) => {
  const navigate = useNavigate();
  const [useFallbackMap, setUseFallbackMap] = useState(!hasValidKey);

  // If valid key is present and user didn't explicitly request fallback, render Google Maps
  if (hasValidKey && !useFallbackMap) {
    return (
      <div className="relative w-full rounded-2xl overflow-hidden border border-slate-300 shadow-sm" style={{ height }}>
        {/* Map Provider indicator bar */}
        <div className="absolute top-3 left-3 z-10 bg-slate-900/90 backdrop-blur-md text-white text-[11px] px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2 shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold">Google Maps Vector Engine</span>
        </div>

        <APIProvider apiKey={API_KEY} version="weekly">
          <Map
            defaultCenter={{ lat: center[0], lng: center[1] }}
            defaultZoom={zoom}
            mapId="DEMO_MAP_ID"
            internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
            style={{ width: "100%", height: "100%" }}
            onClick={(e) => {
              if (onSelectLocation && e.detail.latLng) {
                onSelectLocation(e.detail.latLng.lat, e.detail.latLng.lng);
              }
            }}
          >
            {/* Selected Location Pin */}
            {selectedLocation && (
              <AdvancedMarker position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}>
                <Pin background="#0D7377" glyphColor="#ffffff" borderColor="#ffffff" />
              </AdvancedMarker>
            )}

            {/* Complaint Markers */}
            {complaints.map((item) => (
              <GoogleMapComplaintMarker key={item.id} complaint={item} />
            ))}
          </Map>
        </APIProvider>

        {/* Legend Overlay */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-md text-xs z-10 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block"></span>
            <span className="text-slate-700 font-medium">Critical (80+)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            <span className="text-slate-700 font-medium">High (60-79)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block"></span>
            <span className="text-slate-700 font-medium">Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span className="text-slate-700 font-medium">Resolved</span>
          </div>
        </div>
      </div>
    );
  }

  // Splash screen completely removed by user request.

  // Leaflet Fallback Map Render
  const getMarkerColor = (complaint: Complaint) => {
    if (complaint.status === "Resolved") return "#10B981";
    if (complaint.severity >= 80) return "#E11D48";
    if (complaint.severity >= 60) return "#F59E0B";
    return "#0284C7";
  };

  const createCustomIcon = (complaint: Complaint) => {
    const color = getMarkerColor(complaint);
    const html = `
      <div style="
        background-color: ${color};
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="background-color: white; width: 6px; height: 6px; border-radius: 50%;"></div>
      </div>
    `;
    return L.divIcon({
      html,
      className: "custom-map-pin",
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });
  };

  const pickerIcon = L.divIcon({
    html: `
      <div style="
        background-color: #0D7377;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 15px rgba(13, 115, 119, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
      ">📍</div>
    `,
    className: "picker-pin",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-300 shadow-sm z-0">


      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height, width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {onSelectLocation && <LeafletLocationPicker onSelect={onSelectLocation} />}

        {selectedLocation && (
          <LeafletMarker position={[selectedLocation.lat, selectedLocation.lng]} icon={pickerIcon}>
            <LeafletPopup>
              <div className="p-1 font-sans text-xs">
                <strong className="text-blue-700 block text-sm mb-0.5">Selected Location</strong>
                <span>Lat: {selectedLocation.lat.toFixed(5)}, Lng: {selectedLocation.lng.toFixed(5)}</span>
              </div>
            </LeafletPopup>
          </LeafletMarker>
        )}

        {complaints.map((item) => (
          <LeafletMarker
            key={item.id}
            position={[item.latitude, item.longitude]}
            icon={createCustomIcon(item)}
          >
            <LeafletPopup className="civic-map-popup">
              <div className="p-2 max-w-xs font-sans">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded bg-slate-100 text-slate-700">
                    {item.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      item.status === "Resolved"
                        ? "bg-emerald-100 text-emerald-800"
                        : item.severity >= 80
                        ? "bg-rose-100 text-rose-800"
                        : "bg-sky-100 text-sky-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm mb-1 leading-snug">
                  {item.title}
                </h4>

                <p className="text-xs text-slate-600 line-clamp-2 mb-2">
                  {item.description}
                </p>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="text-slate-500 font-medium">
                    Ward {item.ward} ({item.wardName})
                  </span>
                  <button
                    onClick={() => navigate(`/complaint/${item.id}`)}
                    className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    Inspect <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </LeafletPopup>
          </LeafletMarker>
        ))}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-md text-xs z-[400] flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block"></span>
          <span className="text-slate-700 font-medium">Critical (80+)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
          <span className="text-slate-700 font-medium">High (60-79)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block"></span>
          <span className="text-slate-700 font-medium">Medium</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
          <span className="text-slate-700 font-medium">Resolved</span>
        </div>
      </div>
    </div>
  );
};
