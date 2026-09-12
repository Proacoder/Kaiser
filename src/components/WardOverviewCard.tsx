import React from "react";
import { MumbaiWard } from "../types";
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Award, 
  CheckCircle2, 
  Clock, 
  Star, 
  Wind, 
  Thermometer, 
  Droplets,
  Eye,
  ShieldCheck,
  Activity
} from "lucide-react";

interface WardOverviewCardProps {
  ward: MumbaiWard;
  onReportIssueInWard?: () => void;
}

export const WardOverviewCard: React.FC<WardOverviewCardProps> = ({ ward, onReportIssueInWard }) => {
  const { officer, weatherAndAqi } = ward;

  const getAqiBadgeColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "good":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "moderate":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "poor":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "unhealthy":
      case "severe":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-red-600 text-white text-xs font-black rounded-lg">
              Ward {ward.code}
            </span>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold rounded-lg">
              🚂 {ward.railwayCorridor} Zone
            </span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              BMC Jurisdiction #{ward.id}
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-950 mt-1.5">{ward.name}</h2>
          <div className="text-xs text-slate-600 mt-1 space-y-1">
            <p className="flex items-center gap-1.5 font-semibold text-slate-800">
              <span className="px-2 py-0.5 bg-slate-100 rounded font-bold text-[11px] text-red-600">Transit Hub(s):</span>
              <span>{ward.primaryRailwayStations}</span>
            </p>
            <p className="flex items-center gap-1 text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Coverage: {ward.areaDescription}</span>
            </p>
          </div>
        </div>

        {onReportIssueInWard && (
          <button
            onClick={onReportIssueInWard}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Building2 className="w-4 h-4" />
            <span>Report in Ward {ward.code}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Officer Details Card */}
        <div className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <img
                src={officer.avatar}
                alt={officer.name}
                className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-xs"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-red-600" />
                  <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
                    Assigned Assistant Municipal Commissioner
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-950">{officer.name}</h3>
                <p className="text-xs font-medium text-slate-500">{officer.designation}</p>
              </div>
            </div>

            <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-center shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">City Rank</span>
              <span className="text-sm font-black text-red-600 flex items-center gap-0.5">
                <Award className="w-3.5 h-3.5" /> #{officer.rank}
              </span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
            <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
              <Phone className="w-4 h-4 text-red-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Control Room Helpline</span>
                <a href={`tel:${officer.contact}`} className="font-bold text-slate-900 hover:text-red-600">
                  {officer.contact}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
              <Mail className="w-4 h-4 text-red-600 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 font-bold block">Official BMC Email</span>
                <a href={`mailto:${officer.email}`} className="font-bold text-slate-900 hover:text-red-600 truncate block">
                  {officer.email}
                </a>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">Ward Executive Office Address</span>
              <span className="font-medium text-slate-800">{officer.address}</span>
            </div>
          </div>

          {/* Officer Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-slate-500 font-bold mb-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-900" /> Solved
              </div>
              <span className="text-lg font-black text-slate-950">{officer.problemsSolved}</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-slate-500 font-bold mb-0.5">
                <Activity className="w-3.5 h-3.5 text-red-600" /> SLA Rate
              </div>
              <span className="text-lg font-black text-red-600">{officer.resolutionRate}%</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-slate-500 font-bold mb-0.5">
                <Clock className="w-3.5 h-3.5 text-slate-700" /> Turnaround
              </div>
              <span className="text-lg font-black text-slate-950">{officer.avgResolutionDays} days</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-slate-500 font-bold mb-0.5">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Rating
              </div>
              <span className="text-lg font-black text-slate-950">{officer.citizenSatisfaction} / 5</span>
            </div>
          </div>
        </div>

        {/* Live Ward Weather & AQI Box */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-400">
                Live Ward Environment
              </span>
              <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-md border ${getAqiBadgeColor(weatherAndAqi.aqiCategory)}`}>
                {weatherAndAqi.aqiCategory}
              </span>
            </div>

            {/* AQI Score */}
            <div className="mt-3 flex items-baseline justify-between bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <div>
                <span className="text-xs font-bold text-slate-400 block">Air Quality Index (AQI)</span>
                <span className="text-3xl font-black text-white">{weatherAndAqi.aqi}</span>
              </div>
              <Wind className="w-8 h-8 text-red-400 opacity-80" />
            </div>

            {/* PM2.5 / PM10 */}
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
              <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-700/40">
                <span className="text-[10px] text-slate-400 block font-bold">PM2.5 Level</span>
                <span className="font-black text-slate-200">{weatherAndAqi.pm25} µg/m³</span>
              </div>
              <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-700/40">
                <span className="text-[10px] text-slate-400 block font-bold">PM10 Level</span>
                <span className="font-black text-slate-200">{weatherAndAqi.pm10} µg/m³</span>
              </div>
            </div>
          </div>

          {/* Temperature & Weather */}
          <div className="pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-red-400" />
                <div>
                  <span className="text-xl font-black">{weatherAndAqi.temp}°C</span>
                  <span className="text-[11px] text-slate-300 block font-medium">{weatherAndAqi.condition}</span>
                </div>
              </div>

              <div className="text-right text-xs">
                <div className="flex items-center gap-1 text-slate-400">
                  <Droplets className="w-3.5 h-3.5 text-slate-300" /> Humidity: <span className="font-bold text-slate-200">{weatherAndAqi.humidity}%</span>
                </div>
                <div className="flex items-center justify-end gap-1 text-slate-400 mt-1">
                  <Wind className="w-3.5 h-3.5 text-slate-300" /> Wind: <span className="font-bold text-slate-200">{weatherAndAqi.windSpeed} km/h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
