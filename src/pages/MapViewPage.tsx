import React, { useState, useEffect } from "react";
import { complaintService } from "../services/api";
import { Complaint } from "../types";
import { MumbaiMap } from "../components/MumbaiMap";
import { ComplaintCard } from "../components/ComplaintCard";
import { MUMBAI_WARDS_DATA } from "../data/mumbaiWardsData";
import { MapPin, Search, Layers3, Crosshair, ListFilter } from "lucide-react";

export const MapViewPage: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedWard, setSelectedWard] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { loadMapData(); }, [selectedWard, selectedCategory]);
  const loadMapData = async () => { try { setLoading(true); const res = await complaintService.getAll({ ward: selectedWard, category: selectedCategory, q: searchQuery }); setComplaints(res.data); } catch (err) { console.error("Failed to load map data", err); } finally { setLoading(false); } };
  const mapCenter: [number, number] = activeComplaint ? [activeComplaint.latitude, activeComplaint.longitude] : [19.076, 72.877];
  return <div className="map-workspace"><div className="shell map-head"><div><div className="section-kicker">Field intelligence / spatial view</div><h1>Where Mumbai needs attention.</h1><p>Locate active complaints, scan ward patterns, and jump from a map pin to the full citizen report.</p></div><div className="map-stat"><MapPin size={16} /><strong>{complaints.length}</strong><span>mapped incidents</span></div></div><div className="shell map-toolbar"><div className="map-search"><Search size={16} /><input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && loadMapData()} placeholder="Search a street or landmark" /></div><select value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)}><option value="all">All Mumbai wards</option>{MUMBAI_WARDS_DATA.map((w) => <option key={w.id} value={w.id}>Ward {w.code} — {w.name}</option>)}</select><select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}><option value="all">All departments</option><option value="Pothole">Potholes</option><option value="Garbage">Garbage</option><option value="Water Leakage">Water leakage</option><option value="Drainage">Drainage</option><option value="Streetlight">Streetlights</option><option value="Roadwork">Roadwork</option></select><button onClick={loadMapData} className="map-refresh"><Crosshair size={15} /> Refresh</button></div><div className="shell map-split"><section className="map-incident-pane"><div className="pane-head"><div><span className="section-kicker">Incident stream</span><h2>{loading ? "Updating map..." : `${complaints.length} reports in view`}</h2></div><ListFilter size={17} /></div><div className="map-incident-list">{complaints.map((item) => <div role="button" tabIndex={0} key={item.id} onClick={() => setActiveComplaint(item)} onKeyDown={(e) => e.key === "Enter" && setActiveComplaint(item)} className={`map-incident ${activeComplaint?.id === item.id ? "is-selected" : ""}`}><ComplaintCard complaint={item} onUpdate={loadMapData} /></div>)}</div></section><section className="map-canvas"><div className="map-canvas-label"><Layers3 size={15} /> Live ward layer <span>Click a report to center map</span></div><MumbaiMap complaints={complaints} height="700px" center={mapCenter} zoom={activeComplaint ? 14 : 12} /></section></div></div>;
};
