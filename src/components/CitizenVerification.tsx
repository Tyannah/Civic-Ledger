import React, { useState, useEffect, useRef } from 'react';
import { CountryInfo, RoadProject, CitizenVerdict, CitizenReport, ProjectTally } from '../types';
import { analyzeProjectBudget } from '../utils/calculator';
import { generateComplaintDocket } from '../utils/complaints';
import { calculateProjectTally, getStoredReports, saveCitizenReport } from '../utils/storage';
import { CitizenFeedbackChart } from './charts/CitizenFeedbackChart';
import {
  CheckSquare,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Mail,
  MessageCircle,
  Users,
  Send,
  ShieldAlert,
  Printer,
  Download,
  Filter,
  FileText,
  Camera,
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  Maximize2,
  Eye,
  X,
} from 'lucide-react';
import { DotGrid } from './CivicDecorations';

interface CitizenVerificationProps {
  project: RoadProject;
  country: CountryInfo;
}

export const CitizenVerification: React.FC<CitizenVerificationProps> = ({ project, country }) => {
  const [verdict, setVerdict] = useState<CitizenVerdict>('partial');
  const [note, setNote] = useState('');
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageCaption, setImageCaption] = useState<string>('');
  const [imageError, setImageError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedModalImage, setSelectedModalImage] = useState<CitizenReport | {
    imageUrl: string;
    imageCaption?: string;
    roadName: string;
    verdict: CitizenVerdict;
    note?: string;
    reporterLocation?: string;
    timestamp: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [docketViewMode, setDocketViewMode] = useState<'letterhead' | 'raw'>('letterhead');
  const [reportFilter, setReportFilter] = useState<'all' | CitizenVerdict>('all');
  const [allReports, setAllReports] = useState<CitizenReport[]>([]);
  const [tally, setTally] = useState<ProjectTally>({ matches: 0, partial: 0, notDone: 0, total: 0, confidenceScore: 0 });

  // Load community reports on mount or project change
  useEffect(() => {
    const loaded = getStoredReports();
    setAllReports(loaded);
    setTally(calculateProjectTally(project.id, loaded));
    setSubmitted(false);
    setCopied(false);
    setImagePreview(null);
    setImageCaption('');
    setImageError(null);
  }, [project.id]);

  const analysis = analyzeProjectBudget(project);
  const complaint = generateComplaintDocket({
    project,
    country,
    analysis,
    citizenVerdict: verdict,
    citizenNote: note,
    citizenLocation: location,
    citizenName: name,
    hasImage: Boolean(imagePreview),
    imageCaption: imageCaption.trim() || undefined,
  });

  const processImageFile = (file: File) => {
    setImageError(null);
    if (!file.type.startsWith('image/')) {
      setImageError('Please choose a valid image file (JPEG, PNG, or WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Photo size exceeds 5MB limit. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImagePreview(reader.result);
        if (!imageCaption) {
          const autoCaption = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          setImageCaption(autoCaption.slice(0, 45));
        }
      }
    };
    reader.onerror = () => {
      setImageError('Failed to read selected image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleClearImage = () => {
    setImagePreview(null);
    setImageCaption('');
    setImageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoadSamplePhoto = (url: string, caption: string) => {
    setImagePreview(url);
    setImageCaption(caption);
    setImageError(null);
  };

  const handleSubmitVerification = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport = saveCitizenReport({
      projectId: project.id,
      countryCode: project.countryCode,
      roadName: project.name,
      verdict,
      note: note.trim() || undefined,
      reporterLocation: location.trim() || undefined,
      imageUrl: imagePreview || undefined,
      imageCaption: imageCaption.trim() || undefined,
    });

    const updatedList = [newReport, ...allReports];
    setAllReports(updatedList);
    setTally(calculateProjectTally(project.id, updatedList));
    setSubmitted(true);
  };

  const handleCopyComplaint = () => {
    navigator.clipboard.writeText(complaint.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 3500);
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([complaint.body], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Petition_${country.code}_${project.name.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrintDocket = () => {
    window.print();
  };

  const projectReports = allReports.filter((r) => r.projectId === project.id);
  const filteredReports = projectReports.filter((r) => {
    if (reportFilter === 'all') return true;
    return r.verdict === reportFilter;
  });

  const ombudsman = country.complaintsBody;

  return (
    <section id="step-05-citizen-verification" className="relative bg-white border-2 border-[#DDD4C4] p-5 sm:p-7 mb-8 rounded-2xl shadow-xs overflow-hidden">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b-2 border-[#EAE3D5] pb-4 mb-6 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-bold uppercase bg-[#E09F3E] text-[#1E2522] px-3 py-0.5 rounded-full shadow-xs">
              Step 05
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-[#3A543E] font-bold">
              Citizen Ground Truth &amp; Legal Redress
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display uppercase tracking-wide text-[#3A543E]">
            Does This Match What You See on the Ground?
          </h2>
        </div>
        <div className="text-xs font-mono text-[#3A543E] bg-[#F4EFE6] px-3 py-1.5 border border-[#DDD4C4] rounded-full font-bold">
          Audit Database: <strong className="text-[#1E2522]">{tally.total} citizen observations logged</strong>
        </div>
      </div>

      {/* Community Confidence Score Bar with Analytical Chart */}
      <div className="bg-white border-2 border-[#DDD4C4] p-5 sm:p-6 mb-6 rounded-2xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAE3D5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F4EFE6] border border-[#DDD4C4] flex items-center justify-center text-[#3A543E]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-[#66726A] block font-bold">
                Public Delivery Verification Score ({project.name})
              </span>
              <span className="font-bold text-xl sm:text-2xl text-[#1E2522]">
                {tally.confidenceScore}% Citizen Ground Truth Confidence
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-[#2E663B] font-bold px-2.5 py-1 bg-[#E8F0EA] rounded-full">
              ● {tally.matches} Matches
            </span>
            <span className="text-[#8C5E1E] font-bold px-2.5 py-1 bg-[#FDF4E7] rounded-full">
              ● {tally.partial} Defects
            </span>
            <span className="text-[#BF532C] font-bold px-2.5 py-1 bg-[#FDF0EC] rounded-full">
              ● {tally.notDone} Stalled
            </span>
          </div>
        </div>

        {/* Verification Distribution Chart */}
        <div className="my-5">
          <CitizenFeedbackChart
            matches={tally.matches}
            partial={tally.partial}
            notDone={tally.notDone}
            total={tally.total}
            confidenceScore={tally.confidenceScore}
          />
        </div>

        {/* Visual Ratio Progress Bar */}
        <div className="mt-3">
          <div className="h-3 w-full bg-[#EAE3D5] flex overflow-hidden border border-[#DDD4C4] rounded-full">
            <div
              className="bg-[#2E663B] transition-all duration-500"
              style={{ width: `${tally.total > 0 ? (tally.matches / tally.total) * 100 : 0}%` }}
              title={`${tally.matches} reported matching ground reality`}
            />
            <div
              className="bg-[#E09F3E] transition-all duration-500"
              style={{ width: `${tally.total > 0 ? (tally.partial / tally.total) * 100 : 0}%` }}
              title={`${tally.partial} reported partial completion or defects`}
            />
            <div
              className="bg-[#BF532C] transition-all duration-500"
              style={{ width: `${tally.total > 0 ? (tally.notDone / tally.total) * 100 : 0}%` }}
              title={`${tally.notDone} reported abandoned or not delivered`}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-[#66726A] mt-2">
            <span>Aggregated across {tally.total} community submissions</span>
            <span>Persisted locally in your browser storage</span>
          </div>
        </div>
      </div>

      {/* Verification Input Form */}
      <form onSubmit={handleSubmitVerification} className="bg-[#FAF7F2] border-2 border-[#DDD4C4] p-5 sm:p-7 mb-6 rounded-2xl">
        <div className="border-b border-[#EAE3D5] pb-3.5 mb-5">
          <h3 className="font-bold text-xl text-[#1E2522]">
            Record Your Ground Observation: <span className="text-[#3A543E]">{project.name}</span>
          </h3>
          <p className="text-xs text-[#556259] mt-1 leading-relaxed">
            Select how closely official government records match physical reality on the road today. Your vote immediately updates the citizen confidence index and calibrates the legal complaint draft below.
          </p>
        </div>

        {/* 3-Way Choice Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-5">
          {/* Matches */}
          <label
            className={`border-2 p-4 cursor-pointer flex flex-col justify-between transition-all rounded-2xl ${
              verdict === 'matches'
                ? 'bg-white border-[#2E663B] ring-2 ring-[#2E663B] shadow-xs'
                : 'bg-[#F4EFE6] border-[#DDD4C4] text-[#4A554E] hover:bg-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <input
                type="radio"
                name="citizen_verdict"
                value="matches"
                checked={verdict === 'matches'}
                onChange={() => setVerdict('matches')}
                className="accent-[#2E663B]"
              />
              <CheckSquare className={`w-4 h-4 ${verdict === 'matches' ? 'text-[#2E663B]' : 'text-[#66726A]'}`} />
              <span className="font-bold text-base text-[#1E2522]">Matches Reality</span>
            </div>
            <p className="text-[11px] font-mono text-[#556259] mt-2.5 pl-6 leading-relaxed">
              Paved, functional, and delivered substantially as described in official project records.
            </p>
          </label>

          {/* Partially */}
          <label
            className={`border-2 p-4 cursor-pointer flex flex-col justify-between transition-all rounded-2xl ${
              verdict === 'partial'
                ? 'bg-white border-[#E09F3E] ring-2 ring-[#E09F3E] shadow-xs'
                : 'bg-[#F4EFE6] border-[#DDD4C4] text-[#4A554E] hover:bg-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <input
                type="radio"
                name="citizen_verdict"
                value="partial"
                checked={verdict === 'partial'}
                onChange={() => setVerdict('partial')}
                className="accent-[#E09F3E]"
              />
              <AlertTriangle className={`w-4 h-4 ${verdict === 'partial' ? 'text-[#E09F3E]' : 'text-[#66726A]'}`} />
              <span className="font-bold text-base text-[#1E2522]">Partially Delivered</span>
            </div>
            <p className="text-[11px] font-mono text-[#556259] mt-2.5 pl-6 leading-relaxed">
              Incomplete sections, heavy potholing, collapsed drainage, or missing footbridges.
            </p>
          </label>

          {/* Not Done */}
          <label
            className={`border-2 p-4 cursor-pointer flex flex-col justify-between transition-all rounded-2xl ${
              verdict === 'not_done'
                ? 'bg-white border-[#BF532C] ring-2 ring-[#BF532C] shadow-xs'
                : 'bg-[#F4EFE6] border-[#DDD4C4] text-[#4A554E] hover:bg-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <input
                type="radio"
                name="citizen_verdict"
                value="not_done"
                checked={verdict === 'not_done'}
                onChange={() => setVerdict('not_done')}
                className="accent-[#BF532C]"
              />
              <XCircle className={`w-4 h-4 ${verdict === 'not_done' ? 'text-[#BF532C]' : 'text-[#66726A]'}`} />
              <span className="font-bold text-base text-[#1E2522]">Not Done / Stalled</span>
            </div>
            <p className="text-[11px] font-mono text-[#556259] mt-2.5 pl-6 leading-relaxed">
              No asphalt, abandoned heavy plant, broken culverts, or completely deserted sites.
            </p>
          </label>
        </div>

        {/* Optional Resident Note and Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-xs font-mono">
          <div>
            <label className="block font-bold text-[#1E2522] uppercase tracking-wider mb-1.5">
              Field Observations &amp; Specific Defects (Optional)
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Grader parked 8 months ago; storm culverts left open; deep gully erosion at Km 4..."
              className="w-full p-3 border border-[#DDD4C4] bg-white text-[#1E2522] focus:border-[#3A543E] focus:outline-none text-xs rounded-xl"
            />
          </div>

          <div className="space-y-3">
            <div>
              <label className="block font-bold text-[#1E2522] uppercase tracking-wider mb-1.5">
                Your Village / Ward / Junction Location (Optional)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Ward 4 / Market Junction / Kilometer 12"
                className="w-full p-2.5 border border-[#DDD4C4] bg-white text-[#1E2522] focus:border-[#3A543E] focus:outline-none rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-[#1E2522] uppercase tracking-wider mb-1.5">
                Complainant Name or Group (Optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Concerned Residents Committee / Resident Taxpayer"
                className="w-full p-2.5 border border-[#DDD4C4] bg-white text-[#1E2522] focus:border-[#3A543E] focus:outline-none rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* On-Site Photographic Evidence Section */}
        <div className="mb-5 pt-3.5 border-t border-[#EAE3D5]">
          <div className="flex items-center justify-between mb-1.5">
            <label className="flex items-center gap-2 font-bold text-[#1E2522] uppercase tracking-wider text-xs font-mono">
              <Camera className="w-4 h-4 text-[#3A543E]" />
              Ground Truth Photographic Evidence (Optional)
            </label>
            {imagePreview && (
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#E8F0EA] text-[#2E663B] border border-[#BBD7C2] font-bold rounded-full">
                1 Image Attached
              </span>
            )}
          </div>
          <p className="text-[11px] font-mono text-[#66726A] mb-3 leading-relaxed">
            Attach a photo of physical road conditions (e.g. washouts, open drainage trenches, abandoned earthmovers, or completed tarmac). Drag and drop or browse from your device.
          </p>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
            id="citizen-evidence-image-input"
          />

          {!imagePreview ? (
            <div>
              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed p-4 sm:p-5 rounded-2xl text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-[#3A543E] bg-[#E8F0EA]/60 ring-2 ring-[#3A543E]'
                    : 'border-[#DDD4C4] bg-white hover:border-[#3A543E] hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="w-10 h-10 mx-auto rounded-full bg-[#FAF7F2] border border-[#DDD4C4] flex items-center justify-center mb-2 text-[#3A543E]">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono font-bold text-[#1E2522]">
                  Click to Browse Photo or Drag &amp; Drop Here
                </div>
                <div className="text-[11px] font-mono text-[#66726A] mt-1">
                  Supports JPEG, PNG, or WebP (Up to 5 MB)
                </div>
              </div>

              {/* Sample Photo Presets for Quick Testing */}
              <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] font-mono">
                <span className="text-[#66726A]">Or load test evidence:</span>
                <button
                  type="button"
                  onClick={() =>
                    handleLoadSamplePhoto(
                      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
                      'Excavated trench and halted machinery'
                    )
                  }
                  className="px-2.5 py-1 bg-white border border-[#DDD4C4] rounded-lg text-[#3A543E] hover:bg-[#FAF7F2] font-semibold transition-colors cursor-pointer"
                >
                  + Severe Trench / Stalled
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleLoadSamplePhoto(
                      'https://images.unsplash.com/photo-1578955274801-e28399580fb2?auto=format&fit=crop&w=800&q=80',
                      'Unfinished road shoulder and traffic diversions'
                    )
                  }
                  className="px-2.5 py-1 bg-white border border-[#DDD4C4] rounded-lg text-[#3A543E] hover:bg-[#FAF7F2] font-semibold transition-colors cursor-pointer"
                >
                  + Unpaved / Potholes
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleLoadSamplePhoto(
                      'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=800&q=80',
                      'Completed asphalt carriageway and flyover'
                    )
                  }
                  className="px-2.5 py-1 bg-white border border-[#DDD4C4] rounded-lg text-[#3A543E] hover:bg-[#FAF7F2] font-semibold transition-colors cursor-pointer"
                >
                  + Completed Carriageway
                </button>
              </div>
            </div>
          ) : (
            /* Selected Photo Preview Card */
            <div className="p-3.5 sm:p-4 bg-white border-2 border-[#3A543E] rounded-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-2xs">
              <div className="flex items-center gap-3.5 w-full sm:w-auto">
                <div className="relative group shrink-0">
                  <img
                    src={imagePreview}
                    alt="Citizen evidence preview"
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-[#DDD4C4]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedModalImage({
                        imageUrl: imagePreview,
                        imageCaption: imageCaption || 'Field observation photograph',
                        roadName: project.name,
                        verdict,
                        note,
                        reporterLocation: location,
                        timestamp: Date.now(),
                      })
                    }
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white cursor-pointer"
                    title="View enlarged photo"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#2E663B] bg-[#E8F0EA] px-2 py-0.5 rounded-full border border-[#BBD7C2]">
                      Evidentiary Photo Ready
                    </span>
                    <span className="text-[11px] font-mono text-[#66726A]">
                      Appended to ombudsman docket
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold text-[#1E2522] mb-1">
                      Caption / Landmark Tag:
                    </label>
                    <input
                      type="text"
                      value={imageCaption}
                      onChange={(e) => setImageCaption(e.target.value)}
                      placeholder="e.g. Uncovered box culvert at market junction, Km 6"
                      className="w-full text-xs font-mono p-2 border border-[#DDD4C4] rounded-lg focus:outline-none focus:border-[#3A543E]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center font-mono text-xs">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedModalImage({
                      imageUrl: imagePreview,
                      imageCaption: imageCaption || 'Field observation photograph',
                      roadName: project.name,
                      verdict,
                      note,
                      reporterLocation: location,
                      timestamp: Date.now(),
                    })
                  }
                  className="px-3 py-1.5 border border-[#DDD4C4] bg-[#FAF7F2] text-[#1E2522] hover:bg-white rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#3A543E]" />
                  Preview
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 border border-[#DDD4C4] bg-white text-[#1E2522] hover:bg-[#FAF7F2] rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-[#E09F3E]" />
                  Change
                </button>
                <button
                  type="button"
                  onClick={handleClearImage}
                  className="px-3 py-1.5 border border-[#F2C7BB] bg-[#FDF0EC] text-[#BF532C] hover:bg-[#FBE8E3] rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>
            </div>
          )}

          {imageError && (
            <div className="mt-2 text-xs font-mono text-[#BF532C] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{imageError}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-[#EAE3D5]">
          <span className="text-[11px] font-mono text-[#66726A]">
            Updates browser database and generates printable petition docket.
          </span>
          <button
            type="submit"
            id="btn-submit-verification"
            className="px-6 py-2.5 bg-[#3A543E] text-white font-mono text-xs uppercase font-bold tracking-wider hover:bg-[#2B402E] transition-colors flex items-center gap-2 cursor-pointer shadow-xs rounded-xl"
          >
            <Send className="w-3.5 h-3.5 text-[#E09F3E]" />
            {submitted ? 'Update Logged Observation' : 'Log Ground Verification Report'}
          </button>
        </div>

        {submitted && (
          <div className="mt-4 p-3 bg-[#E8F0EA] border border-[#2E663B] text-[#2E663B] font-mono text-xs flex items-center gap-2 rounded-xl">
            <Check className="w-4 h-4 shrink-0" />
            <span>Thank you. Your observation has been verified and registered into local storage.</span>
          </div>
        )}
      </form>

      {/* AUTO-GENERATED COMPLAINT DRAFT */}
      {(verdict === 'partial' || verdict === 'not_done') && (
        <div id="complaint-dossier-box" className="border-2 border-[#BF532C] bg-white p-5 sm:p-7 mb-6 shadow-sm rounded-2xl">
          {/* Header of the Legal Draft */}
          <div className="flex flex-col md:flex-row md:items-start justify-between border-b border-[#EAE3D5] pb-4 mb-4 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <ShieldAlert className="w-5 h-5 text-[#BF532C]" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#BF532C]">
                  Actionable Ombudsman Petition Draft
                </span>
              </div>
              <h3 className="font-bold text-2xl text-[#1E2522]">
                Pre-Filled Administrative Complaint Dossier
              </h3>
              <p className="text-xs text-[#556259] mt-1 max-w-xl leading-relaxed">
                Because physical delivery on <strong className="text-[#1E2522]">{project.name}</strong> deviates from public commitments, this dossier has been pre-filled with the statutory agency, budget citations, and legal grounds ready for submission.
              </p>
            </div>

            {/* Ombudsman Official Contact Card */}
            <div className="bg-[#FAF7F2] border-2 border-[#DDD4C4] p-4 text-xs font-mono text-[#3E4741] min-w-[280px] rounded-xl">
              <span className="block font-bold uppercase text-[#BF532C] text-[10px] tracking-wider mb-1">
                Routed to Constitutional Oversight Body:
              </span>
              <strong className="block text-[#1E2522] font-bold text-base leading-tight">
                {ombudsman.name}
              </strong>
              <div className="mt-2 space-y-1 text-[11px]">
                <div>
                  Phone:{' '}
                  <a href={`tel:${ombudsman.phones[0]}`} className="font-bold underline text-[#1E2522]">
                    {ombudsman.phones[0]}
                  </a>
                </div>
                {ombudsman.tollFree && (
                  <div className="text-[#2E663B] font-bold">
                    Toll-Free: {ombudsman.tollFree}
                  </div>
                )}
                {ombudsman.whatsapp && (
                  <div className="text-[#2E663B] font-bold">
                    WhatsApp: {ombudsman.whatsapp}
                  </div>
                )}
                <div>
                  Email:{' '}
                  <a href={`mailto:${ombudsman.email}`} className="font-semibold underline text-[#1E2522]">
                    {ombudsman.email}
                  </a>
                </div>
                <div className="text-[10px] text-[#66726A] italic pt-0.5">{ombudsman.feeNotice}</div>
              </div>
            </div>
          </div>

          {/* Action Toolbar & View Mode Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 font-mono text-xs border-b border-[#EAE3D5] pb-3">
            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                id="btn-copy-complaint"
                onClick={handleCopyComplaint}
                className="px-4 py-2 bg-[#3A543E] text-white font-bold uppercase tracking-wider hover:bg-[#2B402E] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs rounded-xl"
              >
                {copied ? <Check className="w-4 h-4 text-[#E09F3E]" /> : <Copy className="w-4 h-4 text-[#E09F3E]" />}
                {copied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}
              </button>

              <a
                href={complaint.mailtoUrl}
                id="btn-email-complaint"
                className="px-4 py-2 bg-[#1E2522] text-white uppercase tracking-wider hover:bg-[#2C3631] transition-colors flex items-center gap-1.5 rounded-xl font-bold"
              >
                <Mail className="w-4 h-4 text-[#E09F3E]" />
                Email Ombudsman
              </a>

              {complaint.whatsappUrl && (
                <a
                  href={complaint.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="btn-whatsapp-complaint"
                  className="px-4 py-2 bg-[#2E663B] text-white uppercase tracking-wider hover:bg-[#23522F] transition-colors flex items-center gap-1.5 rounded-xl font-bold"
                >
                  <MessageCircle className="w-4 h-4" />
                  Send WhatsApp
                </a>
              )}

              <button
                type="button"
                onClick={handleDownloadTxt}
                className="px-3.5 py-2 bg-[#FAF7F2] border border-[#DDD4C4] text-[#1E2522] uppercase tracking-wider hover:bg-[#EAE3D5] transition-colors flex items-center gap-1.5 cursor-pointer rounded-xl font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                Download .txt
              </button>

              <button
                type="button"
                onClick={handlePrintDocket}
                className="px-3.5 py-2 bg-[#FAF7F2] border border-[#DDD4C4] text-[#1E2522] uppercase tracking-wider hover:bg-[#EAE3D5] transition-colors flex items-center gap-1.5 cursor-pointer rounded-xl font-bold"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Docket
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-[#F4EFE6] p-1 border border-[#DDD4C4] text-[11px] rounded-full">
              <span className="text-[#66726A] px-2 uppercase font-bold">View:</span>
              <button
                type="button"
                onClick={() => setDocketViewMode('letterhead')}
                className={`px-3 py-1 font-bold transition-all cursor-pointer rounded-full ${
                  docketViewMode === 'letterhead' ? 'bg-[#3A543E] text-white' : 'text-[#4A554E]'
                }`}
              >
                Formal Letterhead
              </button>
              <button
                type="button"
                onClick={() => setDocketViewMode('raw')}
                className={`px-3 py-1 font-bold transition-all cursor-pointer rounded-full ${
                  docketViewMode === 'raw' ? 'bg-[#3A543E] text-white' : 'text-[#4A554E]'
                }`}
              >
                Plaintext
              </button>
            </div>
          </div>

          {/* DOCKET DISPLAY VIEWER */}
          {docketViewMode === 'letterhead' ? (
            /* Styled Formal Administrative Letter View */
            <div className="border-2 border-[#DDD4C4] bg-[#FAF7F2] p-6 sm:p-8 text-[#1E2522] shadow-inner text-sm leading-relaxed max-h-[460px] overflow-y-auto print:max-h-none print:p-0 print:border-none rounded-2xl">
              {/* Formal Letterhead Masthead */}
              <div className="border-b-2 border-[#DDD4C4] pb-4 mb-5 text-center">
                <div className="text-[10px] font-mono tracking-widest uppercase text-[#BF532C] font-bold">
                  CITIZEN INFRASTRUCTURE OVERSIGHT PETITION
                </div>
                <h4 className="font-display uppercase text-2xl sm:text-3xl mt-1 tracking-wide text-[#3A543E]">
                  Formal Grievance &amp; Petition for Administrative Inquiry
                </h4>
                <div className="flex items-center justify-between text-xs font-mono text-[#66726A] mt-3 pt-2 border-t border-[#EAE3D5]">
                  <span>REF: PET-{country.code}-{project.id.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(-8)}</span>
                  <span>DATE: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span>JURISDICTION: {country.name.toUpperCase()}</span>
                </div>
              </div>

              {/* Addressee Block */}
              <div className="mb-5 font-mono text-xs bg-white p-4 border border-[#DDD4C4] rounded-xl">
                <strong className="block text-[#1E2522] font-bold">TO THE PUBLIC COMPLAINTS &amp; OMBUDSMAN AUTHORITY:</strong>
                <div>{ombudsman.name}</div>
                <div>{ombudsman.address}</div>
                <div>Official Email: {ombudsman.email} | Tel: {ombudsman.phones[0]}</div>
              </div>

              {/* Subject Line */}
              <div className="mb-4 pb-2 border-b border-[#DDD4C4] font-mono text-xs font-bold text-[#1E2522]">
                SUBJECT: {complaint.subject}
              </div>

              {/* Formatted Content */}
              <div className="whitespace-pre-wrap text-xs leading-relaxed text-[#2A332C] space-y-3 font-mono">
                {complaint.body}
              </div>

              {/* Attached Photographic Evidence Annexure */}
              {imagePreview && (
                <div className="mt-6 p-4 border-2 border-[#DDD4C4] bg-white rounded-xl">
                  <div className="flex flex-wrap items-center justify-between pb-2 mb-3 border-b border-[#EAE3D5] text-[10px] font-mono uppercase tracking-wider text-[#BF532C] font-bold gap-2">
                    <span className="flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-[#BF532C]" />
                      ANNEXURE A: CITIZEN ON-SITE PHOTOGRAPHIC EVIDENCE
                    </span>
                    <span className="text-[#66726A]">ATTACHED TO PETITION DOSSIER</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <img
                      src={imagePreview}
                      alt="Citizen ground evidence"
                      referrerPolicy="no-referrer"
                      className="w-full sm:w-56 max-h-48 object-cover rounded-lg border border-[#DDD4C4] shadow-2xs"
                    />
                    <div className="space-y-1.5 text-xs font-mono text-[#4A554E] flex-1">
                      <strong className="block text-[#1E2522] text-sm font-sans">
                        {imageCaption || 'On-site physical condition observed on project corridor'}
                      </strong>
                      <div><span className="text-[#1E2522] font-bold">Target Road:</span> {project.name}</div>
                      {location && <div><span className="text-[#1E2522] font-bold">Observer Location:</span> {location}</div>}
                      <div><span className="text-[#1E2522] font-bold">Observation Verdict:</span> {verdict.toUpperCase().replace('_', ' ')}</div>
                      <div className="text-[10px] text-[#66726A] pt-1 border-t border-[#EAE3D5]">
                        Documented by resident observer for administrative review by {ombudsman.shortName}.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Formal Signoff */}
              <div className="mt-8 pt-4 border-t border-[#EAE3D5] font-mono text-xs flex justify-between text-[#66726A]">
                <div>
                  Filed under civic accountability provisions of {country.name}.
                </div>
                <div className="text-right italic">
                  Submitted via Civic Ledger Public Infrastructure Platform
                </div>
              </div>
            </div>
          ) : (
            /* Plaintext Raw Box */
            <div className="border border-[#DDD4C4] bg-[#F4EFE6] p-4 font-mono text-xs text-[#1E2522] overflow-x-auto max-h-[380px] overflow-y-auto leading-relaxed rounded-xl">
              <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed">
                {complaint.body}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Recent Community Field Reports on this Road */}
      {projectReports.length > 0 && (
        <div className="bg-[#FAF7F2] border-2 border-[#DDD4C4] p-4 sm:p-5 rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#EAE3D5] pb-3 mb-3 gap-2">
            <h4 className="font-bold text-base text-[#1E2522] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#3A543E]" />
              Recent Field Log Entries ({projectReports.length})
            </h4>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1 text-[11px] font-mono">
              <Filter className="w-3 h-3 text-[#66726A] mr-1" />
              {[
                { id: 'all', label: 'All' },
                { id: 'matches', label: 'Matches' },
                { id: 'partial', label: 'Defects' },
                { id: 'not_done', label: 'Stalled' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setReportFilter(filter.id as any)}
                  className={`px-2.5 py-1 border cursor-pointer rounded-full font-bold transition-all ${
                    reportFilter === filter.id
                      ? 'bg-[#3A543E] text-white border-[#3A543E]'
                      : 'bg-white text-[#4A554E] border-[#DDD4C4] hover:bg-[#EAE3D5]'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
            {filteredReports.map((r) => (
              <div key={r.id} className="p-3.5 border border-[#EAE3D5] bg-white text-xs font-mono rounded-xl shadow-2xs">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 border rounded-full ${
                        r.verdict === 'matches'
                          ? 'bg-[#E8F0EA] text-[#2E663B] border-[#BBD7C2]'
                          : r.verdict === 'partial'
                          ? 'bg-[#FDF4E7] text-[#8C5E1E] border-[#F4DCBE]'
                          : 'bg-[#FDF0EC] text-[#BF532C] border-[#F2C7BB]'
                      }`}
                    >
                      {r.verdict === 'matches' ? 'MATCHES REALITY' : r.verdict === 'partial' ? 'PARTIAL / DEFECTS' : 'NOT DONE / STALLED'}
                    </span>
                    {r.imageUrl && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#FAF7F2] text-[#3A543E] border border-[#DDD4C4] rounded-md flex items-center gap-1">
                        <Camera className="w-3 h-3 text-[#3A543E]" />
                        Photo Evidence Attached
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#66726A]">
                    {new Date(r.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {r.reporterLocation && ` • Location: ${r.reporterLocation}`}
                  </span>
                </div>

                <div className="flex items-start gap-3 justify-between">
                  <div className="flex-1">
                    {r.note ? (
                      <p className="text-[#2A332C] italic text-xs mt-1 pl-2.5 border-l-2 border-[#E09F3E] leading-relaxed">
                        "{r.note}"
                      </p>
                    ) : (
                      <p className="text-[#66726A] italic text-[11px] mt-1">No additional note recorded.</p>
                    )}

                    {r.imageCaption && (
                      <p className="text-[11px] text-[#556259] mt-2 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-[#E09F3E] shrink-0" />
                        <span><strong className="text-[#1E2522]">Photo:</strong> {r.imageCaption}</span>
                      </p>
                    )}
                  </div>

                  {r.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setSelectedModalImage(r)}
                      className="group relative shrink-0 rounded-xl overflow-hidden border-2 border-[#DDD4C4] hover:border-[#3A543E] transition-all cursor-pointer shadow-2xs"
                      title="Click to view full photo evidence"
                    >
                      <img
                        src={r.imageUrl}
                        alt={r.imageCaption || 'Citizen photo evidence'}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 sm:w-16 sm:h-16 object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photo Lightbox Modal */}
      {selectedModalImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedModalImage(null)}
        >
          <div
            className="relative bg-[#FAF7F2] border-2 border-[#DDD4C4] rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#EAE3D5] bg-white">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#3A543E]" />
                <h4 className="font-bold text-sm text-[#1E2522]">
                  Citizen Photographic Ground Evidence
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedModalImage(null)}
                className="w-8 h-8 rounded-full border border-[#DDD4C4] bg-[#FAF7F2] hover:bg-white flex items-center justify-center text-[#1E2522] cursor-pointer transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Image */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5">
              <div className="relative bg-black rounded-xl overflow-hidden flex items-center justify-center max-h-[58vh]">
                <img
                  src={selectedModalImage.imageUrl}
                  alt={selectedModalImage.imageCaption || 'Full resolution citizen evidence'}
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-[55vh] object-contain"
                />
              </div>

              {/* Metadata Details */}
              <div className="bg-white border border-[#EAE3D5] p-3.5 rounded-xl font-mono text-xs space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 border rounded-full ${
                      selectedModalImage.verdict === 'matches'
                        ? 'bg-[#E8F0EA] text-[#2E663B] border-[#BBD7C2]'
                        : selectedModalImage.verdict === 'partial'
                        ? 'bg-[#FDF4E7] text-[#8C5E1E] border-[#F4DCBE]'
                        : 'bg-[#FDF0EC] text-[#BF532C] border-[#F2C7BB]'
                    }`}
                  >
                    {selectedModalImage.verdict === 'matches'
                      ? 'MATCHES REALITY'
                      : selectedModalImage.verdict === 'partial'
                      ? 'PARTIAL / DEFECTS'
                      : 'NOT DONE / STALLED'}
                  </span>
                  <span className="text-[11px] text-[#66726A]">
                    {new Date(selectedModalImage.timestamp).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="text-sm font-bold text-[#1E2522]">
                  {selectedModalImage.imageCaption || 'On-site road condition verification photo'}
                </div>

                <div className="text-[#556259] text-[11px] space-y-0.5">
                  <div><strong className="text-[#1E2522]">Corridor:</strong> {selectedModalImage.roadName}</div>
                  {selectedModalImage.reporterLocation && (
                    <div><strong className="text-[#1E2522]">Location:</strong> {selectedModalImage.reporterLocation}</div>
                  )}
                  {selectedModalImage.note && (
                    <div className="pt-1 italic text-[#2A332C]">"{selectedModalImage.note}"</div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-[#EAE3D5] bg-white flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedModalImage(null)}
                className="px-4 py-2 bg-[#3A543E] text-white font-mono text-xs font-bold rounded-xl cursor-pointer hover:bg-[#2B402E] transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
