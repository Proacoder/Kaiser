import React, { useState, useEffect } from 'react';
import { Award, Trophy, Star, ShieldCheck, Flame, ThumbsUp, QrCode, PlusCircle, CheckCircle, TrendingUp, UserCheck } from 'lucide-react';
import { CitizenRewardProfile } from '../types';

interface LeaderboardUser {
  rank: number;
  name: string;
  ward: string;
  points: number;
  badgeCount: number;
  title: string;
}

const TOP_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: "Aarav Sharma", ward: "H-West (Bandra)", points: 680, badgeCount: 6, title: "Civic Champion" },
  { rank: 2, name: "Priya Mehta", ward: "G-North (Dadar)", points: 540, badgeCount: 5, title: "Sanitation Sentinel" },
  { rank: 3, name: "Neha Gupta", ward: "K-East (Andheri)", points: 490, badgeCount: 4, title: "Urban Vigilant" },
  { rank: 4, name: "Rajesh Kulkarni", ward: "A-Ward (Colaba)", points: 420, badgeCount: 4, title: "Civic Inspector" },
  { rank: 5, name: "Ananya Deshmukh", ward: "K-West (Juhu)", points: 380, badgeCount: 3, title: "Ward Auditor" },
];

export const CitizenGamificationLeaderboard: React.FC = () => {
  const [profile, setProfile] = useState<CitizenRewardProfile>({
    points: 240,
    level: 3,
    rankTitle: "Civic Sentinel",
    complaintsSubmitted: 4,
    upvotesCast: 12,
    servicesRated: 3,
    badges: [
      { id: "b1", name: "First Reporter", description: "Reported your first civic complaint", icon: "🛡️", earnedAt: new Date().toISOString() },
      { id: "b2", name: "Community Vigilant", description: "Upvoted 10+ local ward complaints", icon: "⭐", earnedAt: new Date().toISOString() },
      { id: "b3", name: "QR Auditor", description: "Rated 3 public facilities using QR code", icon: "📱", earnedAt: new Date().toISOString() }
    ]
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const qrRatings = JSON.parse(localStorage.getItem('civic_qr_ratings') || '[]');
      const userComplaints = JSON.parse(localStorage.getItem('civic_user_complaints') || '[]');
      const upvotedIds = JSON.parse(localStorage.getItem('civic_upvoted_ids') || '[]');

      const complaintsCount = userComplaints.length || 4;
      const upvotesCount = upvotedIds.length || 12;
      const qrCount = qrRatings.length || 3;

      const calculatedPoints = (complaintsCount * 50) + (upvotesCount * 5) + (qrCount * 20);
      const savedPoints = Number(localStorage.getItem('civic_user_points') || calculatedPoints);
      const finalPoints = Math.max(savedPoints, calculatedPoints);

      let level = Math.floor(finalPoints / 100) + 1;
      let rankTitle = "Civic Sentinel";
      if (level >= 5) rankTitle = "Civic Champion";
      else if (level >= 4) rankTitle = "Urban Vigilant";
      else if (level >= 3) rankTitle = "Civic Sentinel";
      else if (level >= 2) rankTitle = "Active Reporter";

      setProfile({
        points: finalPoints,
        level,
        rankTitle,
        complaintsSubmitted: complaintsCount,
        upvotesCast: upvotesCount,
        servicesRated: qrCount,
        badges: [
          { id: "b1", name: "First Reporter", description: "Reported your first civic complaint", icon: "🛡️", earnedAt: new Date().toISOString() },
          { id: "b2", name: "Community Vigilant", description: "Upvoted 10+ local ward complaints", icon: "⭐", earnedAt: new Date().toISOString() },
          { id: "b3", name: "QR Auditor", description: "Rated public facilities using QR code scanner", icon: "📱", earnedAt: new Date().toISOString() }
        ]
      });
    } catch (err) {
      console.error('Failed to load citizen rewards profile:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 sm:p-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900/40 via-slate-900 to-cyan-950/40 border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-amber-400" /> Civic Participation Rewards
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-100">
              Citizen Level {profile.level}: <span className="text-amber-400">{profile.rankTitle}</span>
            </h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Earn Civic Points by reporting real-time grievances, upvoting community issues, and auditing public facilities via QR codes.
            </p>
          </div>

          {/* User Score Card */}
          <div className="bg-slate-950/80 border border-amber-500/40 rounded-2xl p-5 text-center min-w-[240px] shadow-xl">
            <div className="text-xs text-amber-400 uppercase tracking-widest font-semibold">Total Points Balance</div>
            <div className="text-4xl font-black text-amber-300 my-1 flex items-center justify-center gap-2">
              <Award className="w-8 h-8 text-amber-400" /> {profile.points}
            </div>
            <div className="text-[11px] text-slate-400">Next Level in {100 - (profile.points % 100)} Points</div>
            <div className="w-full h-2 bg-slate-800 rounded-full mt-2 overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${profile.points % 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Badges & Earning Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Activity Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" /> Your Contributions
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-300 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-400" /> Grievances Reported
              </span>
              <span className="text-sm font-bold text-emerald-400">{profile.complaintsSubmitted}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-300 flex items-center gap-2">
                <ThumbsUp className="w-4 h-4 text-cyan-400" /> Community Upvotes
              </span>
              <span className="text-sm font-bold text-cyan-400">{profile.upvotesCast}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-300 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-amber-400" /> Services QR Rated
              </span>
              <span className="text-sm font-bold text-amber-400">{profile.servicesRated}</span>
            </div>
          </div>
        </div>

        {/* Earning Rules */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" /> How to Earn Points
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-bold text-emerald-300">Submit Valid Complaint</div>
                <div className="text-slate-400 text-[10px]">Verified photo & ward geolocation</div>
              </div>
              <span className="font-bold text-emerald-400 text-sm bg-emerald-500/20 px-2 py-1 rounded">+50 Pts</span>
            </div>

            <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-bold text-cyan-300">Rate QR Public Service</div>
                <div className="text-slate-400 text-[10px]">Restroom, bus stop, or water kiosk</div>
              </div>
              <span className="font-bold text-cyan-400 text-sm bg-cyan-500/20 px-2 py-1 rounded">+20 Pts</span>
            </div>

            <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-bold text-amber-300">Upvote Ward Grievance</div>
                <div className="text-slate-400 text-[10px]">Support fellow citizens' reports</div>
              </div>
              <span className="font-bold text-amber-400 text-sm bg-amber-500/20 px-2 py-1 rounded">+5 Pts</span>
            </div>
          </div>
        </div>

        {/* Badges Showcase */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> Earned Badges ({profile.badges.length})
          </h3>
          <div className="space-y-2.5">
            {profile.badges.map(b => (
              <div key={b.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-3">
                <div className="text-2xl">{b.icon}</div>
                <div>
                  <div className="text-xs font-bold text-slate-200">{b.name}</div>
                  <div className="text-[10px] text-slate-400">{b.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Ward Leaderboard Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400" /> Mumbai Municipal Ward Leaderboard
            </h2>
            <p className="text-xs text-slate-400">Top active citizen contributors for current month.</p>
          </div>
          <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-medium">Updated Real-Time</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="p-3">Rank</th>
                <th className="p-3">Citizen Name</th>
                <th className="p-3">Assigned Ward</th>
                <th className="p-3 text-center">Title</th>
                <th className="p-3 text-right">Points Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {TOP_LEADERBOARD.map(u => (
                <tr key={u.rank} className="hover:bg-slate-800/50 transition">
                  <td className="p-3 font-bold text-slate-100 flex items-center gap-2">
                    {u.rank === 1 && <span className="text-amber-400 text-sm">🥇</span>}
                    {u.rank === 2 && <span className="text-slate-300 text-sm">🥈</span>}
                    {u.rank === 3 && <span className="text-amber-600 text-sm">🥉</span>}
                    {u.rank > 3 && <span className="text-slate-500 pl-1">{u.rank}</span>}
                  </td>
                  <td className="p-3 font-semibold text-slate-200">{u.name}</td>
                  <td className="p-3 text-slate-400">{u.ward}</td>
                  <td className="p-3 text-center">
                    <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded-md text-[10px] font-medium">
                      {u.title}
                    </span>
                  </td>
                  <td className="p-3 text-right font-bold text-amber-400 font-mono text-sm">{u.points} Pts</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
