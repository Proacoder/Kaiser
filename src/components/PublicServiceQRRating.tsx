import React, { useState } from 'react';
import { QrCode, Star, CheckCircle, Award, Sparkles, Building2, MapPin, ThumbsUp, Camera, RefreshCw } from 'lucide-react';
import { PublicServiceRating } from '../types';

interface PublicServiceQRRatingProps {
  onClose?: () => void;
  onRatingSuccess?: (rating: PublicServiceRating, pointsEarned: number) => void;
}

const PRESET_FACILITIES = [
  { id: 'FAC-BND-01', name: 'Bandra West Station Public Restroom #4', type: 'Public Restroom', ward: 9, wardName: 'H-West (Bandra West)' },
  { id: 'FAC-DDR-02', name: 'Dadar Market Bus Stop Shelter & Bench', type: 'Bus Stop / Depot', ward: 11, wardName: 'G-North (Dadar/Dharavi)' },
  { id: 'FAC-AND-03', name: 'Andheri East Station Waste Collection Spot', type: 'Waste Bin / Bin Spot', ward: 7, wardName: 'K-East (Andheri East)' },
  { id: 'FAC-JHU-04', name: 'Juhu Beach Promenade Public Park', type: 'Public Park', ward: 10, wardName: 'K-West (Andheri West)' },
  { id: 'FAC-CST-05', name: 'CSMT Railway Terminus Water Kiosk #2', type: 'Water Kiosk', ward: 1, wardName: 'A Ward (Churchgate/Colaba)' },
];

const AVAILABLE_TAGS = [
  'Hygiene Maintained',
  'Regularly Sanitized',
  'Well Lit & Safe',
  'Odor Free',
  'Water Available',
  'Disabled Friendly',
  'Needs Cleaning',
  'Damaged Fixtures'
];

export const PublicServiceQRRating: React.FC<PublicServiceQRRatingProps> = ({ onClose, onRatingSuccess }) => {
  const [selectedFacility, setSelectedFacility] = useState(PRESET_FACILITIES[0]);
  const [cleanliness, setCleanliness] = useState(4);
  const [maintenance, setMaintenance] = useState(4);
  const [safety, setSafety] = useState(4);
  const [feedback, setFeedback] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Hygiene Maintained', 'Well Lit & Safe']);
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(20);
  const [activeTab, setActiveTab] = useState<'scan' | 'manual'>('scan');

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleQuickScan = (fac: typeof PRESET_FACILITIES[0]) => {
    setSelectedFacility(fac);
    setActiveTab('manual');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const overallRating = parseFloat(((cleanliness + maintenance + safety) / 3).toFixed(1));
    const newRatingData = {
      facilityId: selectedFacility.id,
      facilityName: selectedFacility.name,
      facilityType: selectedFacility.type,
      ward: selectedFacility.ward,
      wardName: selectedFacility.wardName,
      rating: overallRating,
      cleanlinessScore: cleanliness,
      maintenanceScore: maintenance,
      safetyScore: safety,
      feedback,
      tags: selectedTags,
      photoUrl,
      ratedByName: 'Resident Citizen',
      createdAt: new Date().toISOString()
    };

    try {
      await fetch('/api/public-services/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRatingData)
      }).catch(() => null);

      await fetch('/api/points/award', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'RATE_SERVICE', points: 20 })
      }).catch(() => null);
    } catch (err) {
      console.warn('Network call failed, persisting rating to local storage.', err);
    }

    // Persist in localStorage for client-side persistence
    const existingRatings = JSON.parse(localStorage.getItem('civic_qr_ratings') || '[]');
    existingRatings.push(newRatingData);
    localStorage.setItem('civic_qr_ratings', JSON.stringify(existingRatings));

    const currentPts = Number(localStorage.getItem('civic_user_points') || 240);
    const newPts = currentPts + 20;
    localStorage.setItem('civic_user_points', String(newPts));

    setPointsEarned(20);
    setSubmitted(true);
    if (onRatingSuccess) {
      onRatingSuccess(newRatingData as any, 20);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 shadow-2xl max-w-2xl mx-auto my-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-xl">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              Public Service QR Rating Flow
              <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <Award className="w-3 h-3" /> +20 Civic Points
              </span>
            </h2>
            <p className="text-xs text-slate-400">Scan QR stickers at public facilities or select facility below to submit instant hygiene audit.</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg font-bold px-2 py-1">✕</button>
        )}
      </div>

      {submitted ? (
        <div className="py-12 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 animate-bounce" />
          </div>
          <h3 className="text-2xl font-extrabold text-emerald-400">Rating Submitted Successfully!</h3>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            Thank you for auditing <span className="text-cyan-300 font-semibold">{selectedFacility.name}</span>. Your feedback helps municipal ward officers improve civic amenities.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-cyan-500/20 border border-amber-500/30 text-amber-300 rounded-xl text-sm font-semibold">
            <Sparkles className="w-4 h-4 text-amber-400" /> +{pointsEarned} Civic Points Credited to Your Account!
          </div>
          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={() => { setSubmitted(false); setActiveTab('scan'); }}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl transition"
            >
              Rate Another Facility
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium rounded-xl shadow-lg transition"
              >
                Close & Return
              </button>
            )}
          </div>
        </div>
      ) : (
        <div>
          {/* Tabs */}
          <div className="flex bg-slate-800/80 rounded-xl p-1 mb-6 border border-slate-700/50">
            <button
              type="button"
              onClick={() => setActiveTab('scan')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition ${activeTab === 'scan' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <QrCode className="w-4 h-4" /> QR Simulator / Select Facility
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition ${activeTab === 'manual' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Building2 className="w-4 h-4" /> Service Audit Form
            </button>
          </div>

          {activeTab === 'scan' ? (
            <div className="space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center">
                <div className="w-40 h-40 bg-slate-900 border-2 border-dashed border-cyan-500/40 rounded-xl mx-auto flex flex-col items-center justify-center gap-2 p-2 relative group hover:border-cyan-400 transition cursor-pointer">
                  <QrCode className="w-16 h-16 text-cyan-400 animate-pulse" />
                  <span className="text-[10px] text-cyan-300 font-mono">SCAN MUNICIPAL QR CODE</span>
                  <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition text-xs text-cyan-200 font-semibold">
                    Simulate Camera Scan
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-3">Point mobile camera at QR stickers posted on public toilets, bus stops, or water posts.</p>
              </div>

              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Or Select Quick Scan Preset Facility:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRESET_FACILITIES.map(fac => (
                  <button
                    key={fac.id}
                    type="button"
                    onClick={() => handleQuickScan(fac)}
                    className="p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500/50 rounded-xl text-left transition flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between text-xs text-cyan-400 font-mono mb-1">
                      <span>{fac.id}</span>
                      <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">{fac.type}</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-200 line-clamp-1">{fac.name}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-slate-500" /> Ward {fac.ward} ({fac.wardName.split(' ')[0]})
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Selected Facility Header */}
              <div className="p-3 bg-cyan-950/40 border border-cyan-800/40 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-cyan-400 font-mono">{selectedFacility.id} • {selectedFacility.type}</div>
                  <div className="text-sm font-bold text-slate-100">{selectedFacility.name}</div>
                  <div className="text-xs text-slate-400">Ward {selectedFacility.ward} — {selectedFacility.wardName}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('scan')}
                  className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Change
                </button>
              </div>

              {/* Ratings Sliders */}
              <div className="space-y-3 bg-slate-950/60 p-4 border border-slate-800 rounded-xl">
                {/* Cleanliness */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>Cleanliness & Hygiene</span>
                    <span className="text-cyan-400 flex items-center gap-1"><Star className="w-3 h-3 fill-cyan-400" /> {cleanliness} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={cleanliness}
                    onChange={(e) => setCleanliness(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>

                {/* Maintenance */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>Structural Maintenance & Fixtures</span>
                    <span className="text-cyan-400 flex items-center gap-1"><Star className="w-3 h-3 fill-cyan-400" /> {maintenance} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={maintenance}
                    onChange={(e) => setMaintenance(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>

                {/* Safety */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>Lighting, Safety & Accessibility</span>
                    <span className="text-cyan-400 flex items-center gap-1"><Star className="w-3 h-3 fill-cyan-400" /> {safety} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={safety}
                    onChange={(e) => setSafety(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
              </div>

              {/* Audit Tags */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Audit Observation Tags:</label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_TAGS.map(tag => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                          isSelected
                            ? 'bg-cyan-600/30 border-cyan-500 text-cyan-300 font-medium'
                            : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feedback text */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Remarks (Optional):</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Mention specific observations (e.g., tap leaking, soap dispenser full, light broken)..."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/20 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>Submitting Audit...</>
                ) : (
                  <>
                    <ThumbsUp className="w-4 h-4" /> Submit Service Audit & Earn +20 Points
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
