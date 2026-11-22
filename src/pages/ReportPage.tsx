import React, { useState, useRef } from 'react';
import { Upload, Camera, MapPin, AlertCircle, CheckCircle, Loader2, Trash2, ChevronDown } from 'lucide-react';
import type { Analysis, GarbageSize, WasteCategory } from '../types';
import { SAMPLE_SCENARIOS, BENGALURU_LOCALITIES, analyzeUserImage, saveIncident } from '../data';

type Step = 'upload' | 'analyze' | 'result' | 'success';

const SIZES: GarbageSize[] = ['Small', 'Medium', 'Large'];
const CATEGORIES: WasteCategory[] = ['Mixed Waste', 'Organic Waste', 'Construction Debris', 'Plastic/Dry Waste', 'Bulky Waste'];

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

export default function ReportPage() {
  const [step, setStep] = useState<Step>('upload');
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imageSource, setImageSource] = useState<'upload' | 'sample' | null>(null);
  const [location, setLocation] = useState('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [userSize, setUserSize] = useState<GarbageSize>('Medium');
  const [userCategory, setUserCategory] = useState<WasteCategory>('Mixed Waste');
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageDataUrl(ev.target?.result as string);
      setImageSource('upload');
      setStep('analyze');
      setAnalysis(null);
    };
    reader.readAsDataURL(file);
  }

  function selectSample(idx: number) {
    const scenario = SAMPLE_SCENARIOS[idx];
    setImageDataUrl(scenario.imageUrl);
    setImageSource('sample');
    setAnalysis(scenario.analysis);
    setStep('result');
  }

  async function handleAnalyze() {
    if (!imageDataUrl || !location) return;
    setAnalyzing(true);
    // Simulate a brief delay for UX
    await new Promise(r => setTimeout(r, 1200));
    if (imageSource === 'sample') {
      const sIdx = SAMPLE_SCENARIOS.findIndex(s => s.imageUrl === imageDataUrl);
      if (sIdx >= 0) {
        setAnalysis(SAMPLE_SCENARIOS[sIdx].analysis);
      }
    } else {
      // User-uploaded image: use their classification input
      setAnalysis(analyzeUserImage(userSize, userCategory));
    }
    setAnalyzing(false);
    setStep('result');
  }

  async function handleSubmit() {
    if (!imageDataUrl || !analysis || !location) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 600));
    const incident = {
      id: `INC-${Date.now()}`,
      imageDataUrl,
      location,
      analysis,
      status: 'Pending' as const,
      createdAt: new Date().toISOString(),
    };
    saveIncident(incident);
    setSubmitting(false);
    setStep('success');
  }

  function resetForm() {
    setStep('upload');
    setImageDataUrl(null);
    setImageSource(null);
    setLocation('');
    setAnalysis(null);
    setUserSize('Medium');
    setUserCategory('Mixed Waste');
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      {/* Header */}
      <header className="bg-white border-b border-emerald-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-none">Nirmala Nagara</h1>
              <p className="text-xs text-emerald-600 font-medium mt-0.5">Clean Bengaluru. Smarter Action.</p>
            </div>
          </div>
          <a
            href="/dashboard"
            className="text-sm text-emerald-700 font-medium hover:text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200"
          >
            Authority Dashboard →
          </a>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {step === 'success' ? (
          <SuccessCard onAnother={resetForm} />
        ) : (
          <>
            {/* Progress */}
            <div className="flex items-center gap-2 mb-8">
              {(['upload', 'analyze', 'result'] as Step[]).map((s, i) => (
                <React.Fragment key={s}>
                  <div className={`flex items-center gap-1.5 text-sm font-medium ${step === s ? 'text-emerald-700' : (step === 'result' && s === 'upload') || (step === 'result' && s === 'analyze') ? 'text-emerald-500' : (step === 'analyze' && s === 'upload') ? 'text-emerald-500' : 'text-gray-400'}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === s ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-600'}`}>{i + 1}</span>
                    <span className="hidden sm:inline">{s === 'upload' ? 'Upload' : s === 'analyze' ? 'Analyze' : 'Review'}</span>
                  </div>
                  {i < 2 && <div className="flex-1 h-px bg-emerald-200" />}
                </React.Fragment>
              ))}
            </div>

            {/* Upload Step */}
            {(step === 'upload' || step === 'analyze') && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Garbage Photo</h2>

                {/* Sample scenarios */}
                <div className="mb-5">
                  <p className="text-sm text-gray-500 mb-3">Quick demo — choose a sample scenario:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {SAMPLE_SCENARIOS.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => selectSample(i)}
                        className="relative rounded-xl overflow-hidden border-2 border-gray-200 hover:border-emerald-500 transition-all group"
                      >
                        <img src={s.imageUrl} alt={s.label} className="w-full h-20 object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs font-semibold text-center px-1">{s.label}</span>
                        </div>
                        <p className="text-xs text-gray-600 font-medium p-1.5 text-center leading-tight truncate">{s.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium">OR UPLOAD YOUR OWN</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Upload area */}
                {!imageDataUrl || imageSource === 'sample' ? (
                  <label className="block cursor-pointer">
                    <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />
                    <div className="border-2 border-dashed border-emerald-300 rounded-xl p-8 text-center hover:border-emerald-500 hover:bg-emerald-50 transition-all">
                      <Upload className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                      <p className="text-gray-700 font-medium">Click to upload a photo</p>
                      <p className="text-sm text-gray-400 mt-1">JPG, PNG or WebP</p>
                    </div>
                  </label>
                ) : (
                  <div className="relative">
                    <img src={imageDataUrl} alt="Uploaded" className="w-full rounded-xl object-cover max-h-64" />
                    <button
                      onClick={resetForm}
                      className="absolute top-2 right-2 bg-white rounded-lg p-1.5 shadow text-gray-500 hover:text-red-500"
                    >
                      ✕
                    </button>
                    {/* For user-uploaded images, ask them to classify */}
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <p className="text-sm font-medium text-amber-800 mb-3 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" /> Please classify the garbage (no AI vision available):
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Waste Category</label>
                          <div className="relative">
                            <select
                              value={userCategory}
                              onChange={e => setUserCategory(e.target.value as WasteCategory)}
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white appearance-none pr-8"
                            >
                              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                            <ChevronDown className="w-4 h-4 absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Estimated Size</label>
                          <div className="flex gap-1.5">
                            {SIZES.map(s => (
                              <button
                                key={s}
                                onClick={() => setUserSize(s)}
                                className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${userSize === s ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400'}`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Location + Analyze */}
            {(step === 'upload' || step === 'analyze') && imageDataUrl && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" /> Select Location
                </h2>
                <div className="relative">
                  <select
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">— Choose a Bengaluru locality —</option>
                    {BENGALURU_LOCALITIES.map(l => <option key={l}>{l}</option>)}
                  </select>
                  <ChevronDown className="w-5 h-5 absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                </div>
                <button
                  disabled={!location || analyzing}
                  onClick={handleAnalyze}
                  className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {analyzing ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing Image…</>
                  ) : (
                    <><Camera className="w-5 h-5" /> Analyze Image</>
                  )}
                </button>
              </div>
            )}

            {/* Result Step */}
            {step === 'result' && analysis && (
              <AnalysisResult
                analysis={analysis}
                imageDataUrl={imageDataUrl!}
                location={location}
                onLocationChange={setLocation}
                onSizeChange={(s) => setAnalysis({ ...analysis, size: s, severity: s === 'Small' ? 'Low' : s === 'Medium' ? 'Medium' : 'High', vehicle: s === 'Small' ? 'Handcart' : s === 'Medium' ? 'Mini pickup' : 'Tipper truck' })}
                onCategoryChange={(c) => setAnalysis({ ...analysis, wasteCategory: c })}
                onSubmit={handleSubmit}
                onBack={resetForm}
                submitting={submitting}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

function AnalysisResult({
  analysis, imageDataUrl, location, onLocationChange, onSizeChange, onCategoryChange, onSubmit, onBack, submitting
}: {
  analysis: Analysis;
  imageDataUrl: string;
  location: string;
  onLocationChange: (l: string) => void;
  onSizeChange: (s: GarbageSize) => void;
  onCategoryChange: (c: WasteCategory) => void;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
}) {
  const SIZES: GarbageSize[] = ['Small', 'Medium', 'Large'];
  const CATEGORIES: WasteCategory[] = ['Mixed Waste', 'Organic Waste', 'Construction Debris', 'Plastic/Dry Waste', 'Bulky Waste'];

  return (
    <div className="space-y-5">
      {/* Image preview */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <img src={imageDataUrl} alt="Garbage" className="w-full object-cover max-h-56" />
      </div>

      {/* Analysis card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Analysis Results</h2>
          {analysis.isSimulated && (
            <span className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-1 rounded-full font-medium">
              Demo Mode
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mb-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="text-sm font-medium text-emerald-800">Garbage Detected</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 mb-1">Waste Category</p>
            <div className="relative">
              <select
                value={analysis.wasteCategory}
                onChange={e => onCategoryChange(e.target.value as WasteCategory)}
                className="w-full bg-transparent font-semibold text-gray-800 text-sm appearance-none pr-5 focus:outline-none"
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <ChevronDown className="w-3 h-3 absolute right-0 top-1 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 mb-1">Estimated Size</p>
            <div className="flex gap-1">
              {SIZES.map(s => (
                <button
                  key={s}
                  onClick={() => onSizeChange(s)}
                  className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all ${analysis.size === s ? 'bg-emerald-600 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 mb-1">Severity</p>
            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold border ${SEVERITY_COLORS[analysis.severity]}`}>
              {analysis.severity}
            </span>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 mb-1">Recommended Vehicle</p>
            <p className="font-semibold text-gray-800 text-sm">
              {VEHICLE_ICON[analysis.vehicle]} {analysis.vehicle}
            </p>
          </div>
        </div>

        <div className="p-3 bg-gray-50 rounded-xl mb-4">
          <p className="text-xs text-gray-500 mb-1">Analysis Notes</p>
          <p className="text-sm text-gray-700">{analysis.explanation}</p>
        </div>

        <p className="text-xs text-gray-400 italic mb-4">* Vehicle recommendations are prototype suggestions, not official municipal guidelines.</p>

        {/* Location confirmation */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
          <div className="relative">
            <select
              value={location}
              onChange={e => onLocationChange(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">— Choose a locality —</option>
              {BENGALURU_LOCALITIES.map(l => <option key={l}>{l}</option>)}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 px-5 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-all"
        >
          ← Start Over
        </button>
        <button
          disabled={!location || submitting}
          onClick={onSubmit}
          className="flex-2 flex-grow py-3 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : '📋 Submit Report'}
        </button>
      </div>
    </div>
  );
}

function SuccessCard({ onAnother }: { onAnother: () => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-9 h-9 text-emerald-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Submitted!</h2>
      <p className="text-gray-500 mb-6">
        Your garbage report has been saved and is now visible to municipal authorities.
        A cleanup team will be dispatched based on the severity level.
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={onAnother}
          className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all"
        >
          Report Another
        </button>
        <a
          href="/dashboard"
          className="py-3 px-6 border border-emerald-200 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-all"
        >
          View Dashboard →
        </a>
      </div>
    </div>
  );
}
