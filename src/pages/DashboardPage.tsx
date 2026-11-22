import { useState, useEffect } from 'react';
import { CheckCircle, Clock, Trash2, TrendingUp, ArrowLeft } from 'lucide-react';
import type { Incident } from '../types';
import { getIncidents, markResolved } from '../data';

const SEVERITY_COLORS: Record<string, string> = {
  Low: 'bg-green-100 text-green-700 border-green-200',
  Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  High: 'bg-red-100 text-red-700 border-red-200',
};

const VEHICLE_ICON: Record<string, string> = {
  'Handcart': '🛒',
  'Mini pickup': '🚐',
  'Tipper truck': '🚛',
};

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    setIncidents(getIncidents());
  }, []);

  function handleMarkResolved(id: string) {
    markResolved(id);
    setIncidents(getIncidents());
  }

  const total = incidents.length;
  const pending = incidents.filter(i => i.status === 'Pending').length;
  const resolved = incidents.filter(i => i.status === 'Resolved').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-none">Nirmala Nagara</h1>
              <p className="text-xs text-emerald-600 font-medium mt-0.5">Authority Dashboard</p>
            </div>
          </div>
          <a
            href="/nirmala-nagara/report"
            className="text-sm text-emerald-700 font-medium hover:text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> File a Report
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard label="Total Reports" value={total} icon={<TrendingUp className="w-5 h-5" />} color="text-blue-600 bg-blue-50" />
          <StatCard label="Pending" value={pending} icon={<Clock className="w-5 h-5" />} color="text-yellow-600 bg-yellow-50" />
          <StatCard label="Resolved" value={resolved} icon={<CheckCircle className="w-5 h-5" />} color="text-emerald-600 bg-emerald-50" />
        </div>

        {/* Incidents */}
        {incidents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">No reports yet</p>
            <p className="text-sm text-gray-400 mt-1">Reports submitted by citizens will appear here.</p>
            <a href="/nirmala-nagara/report" className="mt-4 inline-block text-sm text-emerald-600 font-medium hover:underline">
              Submit the first report →
            </a>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Incident Reports</h2>
              <span className="text-sm text-gray-400">{incidents.length} report{incidents.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {incidents.map(incident => (
                <IncidentCard key={incident.id} incident={incident} onResolve={handleMarkResolved} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        {icon}
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

function IncidentCard({ incident, onResolve }: { incident: Incident; onResolve: (id: string) => void }) {
  const { id, imageDataUrl, location, analysis, status, createdAt } = incident;
  const date = new Date(createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${status === 'Resolved' ? 'border-emerald-200 opacity-80' : 'border-gray-100'}`}>
      {/* Image */}
      <div className="relative">
        <img src={imageDataUrl} alt="Garbage" className="w-full h-36 object-cover" />
        <span className={`absolute top-2 right-2 text-xs font-bold px-2.5 py-1 rounded-full border ${
          status === 'Resolved' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'
        }`}>
          {status === 'Resolved' ? '✓ Resolved' : '⏳ Pending'}
        </span>
      </div>

      <div className="p-4">
        {/* Location + Date */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-semibold text-gray-900 text-sm">{location}</p>
            <p className="text-xs text-gray-400 mt-0.5">{date}</p>
          </div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${SEVERITY_COLORS[analysis.severity]}`}>
            {analysis.severity}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Size</span>
            <span className="font-medium text-gray-800">{analysis.size}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Category</span>
            <span className="font-medium text-gray-800 text-right text-xs">{analysis.wasteCategory}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Vehicle</span>
            <span className="font-medium text-gray-800">{VEHICLE_ICON[analysis.vehicle]} {analysis.vehicle}</span>
          </div>
        </div>

        {/* ID */}
        <p className="text-xs text-gray-300 mb-3 font-mono">{id}</p>

        {/* Action button */}
        {status === 'Pending' ? (
          <button
            onClick={() => onResolve(id)}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" /> Mark Resolved
          </button>
        ) : (
          <div className="w-full py-2.5 bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-xl flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" /> Cleaned Up
          </div>
        )}
      </div>
    </div>
  );
}
