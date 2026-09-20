import React, { useState, useEffect } from 'react';
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
  Phone,
  FileText,
  Users,
  Send,
  ShieldAlert,
  Printer,
  Download,
  Eye,
  Filter,
} from 'lucide-react';

interface CitizenVerificationProps {
  project: RoadProject;
  country: CountryInfo;
}

export const CitizenVerification: React.FC<CitizenVerificationProps> = ({ project, country }) => {
  const [verdict, setVerdict] = useState<CitizenVerdict>('partial');
  const [note, setNote] = useState('');
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
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
  });

  const handleSubmitVerification = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport = saveCitizenReport({
      projectId: project.id,
      countryCode: project.countryCode,
      roadName: project.name,
      verdict,
      note: note.trim() || undefined,
      reporterLocation: location.trim() || undefined,
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
    <section id="step-05-citizen-verification" className="bg-white border border-[#2C3034] p-5 sm:p-7 mb-7 shadow-xs rounded-2xl">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-gray-200 pb-4 mb-5 gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase bg-[#1D4ED8] text-white px-2 py-0.5 rounded">
              Step 05
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-gray-600 font-semibold">
              Citizen Ground Truth & Legal Redress
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#16191B]">
            Does This Match What You See on the Ground?
          </h2>
        </div>
        <div className="text-xs font-mono text-gray-600 bg-gray-100 px-2.5 py-1 border border-gray-300 rounded-md">
          Audit Database: <strong className="text-[#1E2022]">{tally.total} citizen observations logged</strong>
        </div>
      </div>

      {/* Community Confidence Score Bar with Analytical Chart */}
      <div className="bg-white border border-[#CBD5E1] p-4 sm:p-5 mb-6 rounded-xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-[#1D4ED8]" />
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-gray-500 block">
                Public Delivery Verification Score ({project.name})
              </span>
              <span className="font-serif font-bold text-xl sm:text-2xl text-[#16191B]">
                {tally.confidenceScore}% Citizen Ground Truth Confidence
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-[#1E6E38] font-bold">
              ● {tally.matches} Matches
            </span>
            <span className="text-[#D9981E] font-bold">
              ● {tally.partial} Defects
            </span>
            <span className="text-rose-700 font-bold">
              ● {tally.notDone} Stalled
            </span>
          </div>
        </div>

        {/* Verification Distribution Chart */}
        <div className="my-4">
          <CitizenFeedbackChart
            matches={tally.matches}
            partial={tally.partial}
            notDone={tally.notDone}
            total={tally.total}
            confidenceScore={tally.confidenceScore}
          />
        </div>

        {/* Visual Ratio Progress Bar */}
        <div className="mt-2">
          <div className="h-3 w-full bg-gray-200 flex overflow-hidden border border-gray-300 rounded-full">
            <div
              className="bg-[#2E7D47] transition-all duration-500"
              style={{ width: `${tally.total > 0 ? (tally.matches / tally.total) * 100 : 0}%` }}
              title={`${tally.matches} reported matching ground reality`}
            />
            <div
              className="bg-[#D9981E] transition-all duration-500"
              style={{ width: `${tally.total > 0 ? (tally.partial / tally.total) * 100 : 0}%` }}
              title={`${tally.partial} reported partial completion or defects`}
            />
            <div
              className="bg-[#9E2A2B] transition-all duration-500"
              style={{ width: `${tally.total > 0 ? (tally.notDone / tally.total) * 100 : 0}%` }}
              title={`${tally.notDone} reported abandoned or not delivered`}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-gray-500 mt-1.5">
            <span>Aggregated across {tally.total} community submissions</span>
            <span>Persisted locally in your browser storage</span>
          </div>
        </div>
      </div>

      {/* Verification Input Form */}
      <form onSubmit={handleSubmitVerification} className="bg-white border-2 border-[#2C3034] p-5 sm:p-6 mb-6 rounded-xl">
        <div className="border-b border-[#E5DFD1] pb-3 mb-4">
          <h3 className="font-serif font-bold text-xl text-[#16191B]">
            Record Your Ground Observation: <span className="text-[#1D4ED8]">{project.name}</span>
          </h3>
          <p className="text-xs font-serif text-[#555A5F] mt-1 leading-relaxed">
            Select how closely official government records match physical reality on the road today. Your vote immediately updates the citizen confidence index and calibrates the legal complaint draft below.
          </p>
        </div>

        {/* 3-Way Choice Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4.5">
          {/* Matches */}
          <label
            className={`border-2 p-4 cursor-pointer flex flex-col justify-between transition-all rounded-xl ${
              verdict === 'matches'
                ? 'bg-[#EAF3EC] border-[#1E6E38] text-[#16191B] ring-1 ring-[#1E6E38] shadow-xs'
                : 'bg-[#FAF9F5] border-[#D8D1BF] text-[#555A5F] hover:bg-[#F2EFE8]'
            }`}
          >
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="citizen_verdict"
                value="matches"
                checked={verdict === 'matches'}
                onChange={() => setVerdict('matches')}
                className="accent-[#1E6E38]"
              />
              <CheckSquare className={`w-4 h-4 ${verdict === 'matches' ? 'text-[#1E6E38]' : 'text-[#7A8187]'}`} />
              <span className="font-serif font-bold text-base text-[#16191B]">Matches Reality</span>
            </div>
            <p className="text-[11px] font-mono text-[#5A6065] mt-2 pl-6 leading-relaxed">
              Paved, functional, and delivered substantially as described in official project records.
            </p>
          </label>

          {/* Partially */}
          <label
            className={`border-2 p-4 cursor-pointer flex flex-col justify-between transition-all rounded-xl ${
              verdict === 'partial'
                ? 'bg-[#FFF8EC] border-[#D9981E] text-[#16191B] ring-1 ring-[#D9981E] shadow-xs'
                : 'bg-[#FAF9F5] border-[#D8D1BF] text-[#555A5F] hover:bg-[#F2EFE8]'
            }`}
          >
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="citizen_verdict"
                value="partial"
                checked={verdict === 'partial'}
                onChange={() => setVerdict('partial')}
                className="accent-[#D9981E]"
              />
              <AlertTriangle className={`w-4 h-4 ${verdict === 'partial' ? 'text-[#D9981E]' : 'text-[#7A8187]'}`} />
              <span className="font-serif font-bold text-base text-[#16191B]">Partially Delivered</span>
            </div>
            <p className="text-[11px] font-mono text-[#5A6065] mt-2 pl-6 leading-relaxed">
              Incomplete sections, heavy potholing, collapsed drainage, or missing footbridges.
            </p>
          </label>

          {/* Not Done */}
          <label
            className={`border-2 p-4 cursor-pointer flex flex-col justify-between transition-all rounded-xl ${
              verdict === 'not_done'
                ? 'bg-rose-50 border-rose-600 text-[#16191B] ring-1 ring-rose-600 shadow-xs'
                : 'bg-[#FAF9F5] border-[#D8D1BF] text-[#555A5F] hover:bg-[#F2EFE8]'
            }`}
          >
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="citizen_verdict"
                value="not_done"
                checked={verdict === 'not_done'}
                onChange={() => setVerdict('not_done')}
                className="accent-rose-600"
              />
              <XCircle className={`w-4 h-4 ${verdict === 'not_done' ? 'text-rose-600' : 'text-[#7A8187]'}`} />
              <span className="font-serif font-bold text-base text-[#16191B]">Not Done / Stalled</span>
            </div>
            <p className="text-[11px] font-mono text-[#5A6065] mt-2 pl-6 leading-relaxed">
              No asphalt, abandoned heavy plant, broken culverts, or completely deserted sites.
            </p>
          </label>
        </div>

        {/* Optional Resident Note and Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4 text-xs font-mono">
          <div>
            <label className="block font-bold text-[#1E2022] uppercase tracking-wider mb-1">
              Field Observations & Specific Defects (Optional)
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Grader parked 8 months ago; storm culverts left open; deep gully erosion at Km 4..."
              className="w-full p-2.5 border border-[#BDB39E] bg-[#FAF9F5] text-[#1E2022] focus:border-[#1D4ED8] focus:outline-none text-xs rounded-md"
            />
          </div>

          <div className="space-y-2.5">
            <div>
              <label className="block font-bold text-[#1E2022] uppercase tracking-wider mb-1">
                Your Village / Ward / Junction Location (Optional)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Ward 4 / Market Junction / Kilometer 12"
                className="w-full p-2 border border-[#BDB39E] bg-[#FAF9F5] text-[#1E2022] focus:border-[#1D4ED8] focus:outline-none rounded-md"
              />
            </div>
            <div>
              <label className="block font-bold text-[#1E2022] uppercase tracking-wider mb-1">
                Complainant Name or Group (Optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Concerned Residents Committee / Resident Taxpayer"
                className="w-full p-2 border border-[#BDB39E] bg-[#FAF9F5] text-[#1E2022] focus:border-[#1D4ED8] focus:outline-none rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#EAE3D3]">
          <span className="text-[11px] font-mono text-[#6A7075]">
            Updates browser database and generates printable petition docket.
          </span>
          <button
            type="submit"
            id="btn-submit-verification"
            className="px-5 py-2.5 bg-[#1D4ED8] text-white font-mono text-xs uppercase tracking-wider hover:bg-[#1E40AF] transition-colors flex items-center gap-2 cursor-pointer shadow-xs rounded-lg"
          >
            <Send className="w-3.5 h-3.5" />
            {submitted ? 'Update Logged Observation' : 'Log Ground Verification Report'}
          </button>
        </div>

        {submitted && (
          <div className="mt-3 p-3 bg-[#EAF3EC] border border-[#3A6B48] text-[#1E6E38] font-mono text-xs flex items-center gap-2 rounded-md">
            <Check className="w-4 h-4 shrink-0" />
            <span>Thank you. Your observation has been verified and registered into local storage.</span>
          </div>
        )}
      </form>

      {/* AUTO-GENERATED COMPLAINT DRAFT (Triggered when "Partially" or "Not Done" is selected) */}
      {(verdict === 'partial' || verdict === 'not_done') && (
        <div id="complaint-dossier-box" className="border-2 border-[#1D4ED8] bg-white p-5 sm:p-6 mb-6 shadow-sm rounded-xl">
          {/* Header of the Legal Draft */}
          <div className="flex flex-col md:flex-row md:items-start justify-between border-b border-[#D8D0BF] pb-4 mb-4 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldAlert className="w-5 h-5 text-[#1D4ED8]" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1D4ED8]">
                  Actionable Ombudsman Petition Draft
                </span>
              </div>
              <h3 className="font-serif font-bold text-2xl text-[#16191B]">
                Pre-Filled Administrative Complaint Dossier
              </h3>
              <p className="text-xs font-serif text-[#555A5F] mt-1 max-w-xl leading-relaxed">
                Because physical delivery on <strong className="text-[#1E2022]">{project.name}</strong> deviates from public commitments, this dossier has been pre-filled with the statutory agency, budget citations, and legal grounds ready for submission.
              </p>
            </div>

            {/* Ombudsman Official Contact Card */}
            <div className="bg-[#FAF9F5] border-2 border-[#D5CEBD] p-3.5 text-xs font-mono text-[#3E4348] min-w-[280px] rounded-lg">
              <span className="block font-bold uppercase text-[#1D4ED8] text-[10px] tracking-wider mb-1">
                Routed to Constitutional Oversight Body:
              </span>
              <strong className="block text-[#16191B] font-serif text-base leading-tight">
                {ombudsman.name}
              </strong>
              <div className="mt-2 space-y-1 text-[11px]">
                <div>
                  Phone:{' '}
                  <a href={`tel:${ombudsman.phones[0]}`} className="font-bold underline text-[#1E2022]">
                    {ombudsman.phones[0]}
                  </a>
                </div>
                {ombudsman.tollFree && (
                  <div className="text-[#1E6E38] font-bold">
                    Toll-Free: {ombudsman.tollFree}
                  </div>
                )}
                {ombudsman.whatsapp && (
                  <div className="text-[#1E6E38] font-semibold">
                    WhatsApp: {ombudsman.whatsapp}
                  </div>
                )}
                <div>
                  Email:{' '}
                  <a href={`mailto:${ombudsman.email}`} className="font-semibold underline text-[#1E2022]">
                    {ombudsman.email}
                  </a>
                </div>
                <div className="text-[10px] text-[#6A7075] italic pt-0.5">{ombudsman.feeNotice}</div>
              </div>
            </div>
          </div>

          {/* Action Toolbar & View Mode Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 font-mono text-xs border-b border-[#EAE3D3] pb-3">
            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                id="btn-copy-complaint"
                onClick={handleCopyComplaint}
                className="px-4 py-2 bg-[#1D4ED8] text-white font-bold uppercase tracking-wider hover:bg-[#1E40AF] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs rounded-lg"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}
              </button>

              <a
                href={complaint.mailtoUrl}
                id="btn-email-complaint"
                className="px-3.5 py-2 bg-[#1E2022] text-white uppercase tracking-wider hover:bg-[#3A3F44] transition-colors flex items-center gap-1.5 rounded-lg"
              >
                <Mail className="w-4 h-4" />
                Email Ombudsman
              </a>

              {complaint.whatsappUrl && (
                <a
                  href={complaint.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="btn-whatsapp-complaint"
                  className="px-3.5 py-2 bg-[#1E6E38] text-white uppercase tracking-wider hover:bg-[#155229] transition-colors flex items-center gap-1.5 rounded-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  Send WhatsApp
                </a>
              )}

              <button
                type="button"
                onClick={handleDownloadTxt}
                className="px-3 py-2 bg-[#FAF8F3] border border-[#2C3034] text-[#1E2022] uppercase tracking-wider hover:bg-[#EDE8DC] transition-colors flex items-center gap-1.5 cursor-pointer rounded-lg"
              >
                <Download className="w-3.5 h-3.5" />
                Download .txt
              </button>

              <button
                type="button"
                onClick={handlePrintDocket}
                className="px-3 py-2 bg-[#FAF8F3] border border-[#2C3034] text-[#1E2022] uppercase tracking-wider hover:bg-[#EDE8DC] transition-colors flex items-center gap-1.5 cursor-pointer rounded-lg"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Docket
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-[#F2EDE2] p-1 border border-[#D5CCBA] text-[11px] rounded-md">
              <span className="text-[#6A7075] px-1 uppercase">View:</span>
              <button
                type="button"
                onClick={() => setDocketViewMode('letterhead')}
                className={`px-2 py-0.5 font-bold transition-all cursor-pointer rounded ${
                  docketViewMode === 'letterhead' ? 'bg-[#1E2022] text-white' : 'text-[#555A5F]'
                }`}
              >
                Formal Letterhead
              </button>
              <button
                type="button"
                onClick={() => setDocketViewMode('raw')}
                className={`px-2 py-0.5 font-bold transition-all cursor-pointer rounded ${
                  docketViewMode === 'raw' ? 'bg-[#1E2022] text-white' : 'text-[#555A5F]'
                }`}
              >
                Plaintext
              </button>
            </div>
          </div>

          {/* DOCKET DISPLAY VIEWER */}
          {docketViewMode === 'letterhead' ? (
            /* Styled Formal Administrative Letter View */
            <div className="border-2 border-[#2C3034] bg-[#FFFDF9] p-6 sm:p-8 font-serif text-[#16191B] shadow-inner text-sm leading-relaxed max-h-[460px] overflow-y-auto print:max-h-none print:p-0 print:border-none rounded-xl">
              {/* Formal Letterhead Masthead */}
              <div className="border-b-2 border-[#2C3034] pb-4 mb-5 text-center">
                <div className="text-[10px] font-mono tracking-widest uppercase text-[#1D4ED8] font-bold">
                  CITIZEN INFRASTRUCTURE OVERSIGHT PETITION
                </div>
                <h4 className="font-serif font-black text-xl sm:text-2xl mt-1 tracking-tight">
                  FORMAL GRIEVANCE & PETITION FOR ADMINISTRATIVE INQUIRY
                </h4>
                <div className="flex items-center justify-between text-xs font-mono text-[#5A6065] mt-3 pt-2 border-t border-[#D5CCBA]">
                  <span>REF: PET-{country.code}-{project.id.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(-8)}</span>
                  <span>DATE: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span>JURISDICTION: {country.name.toUpperCase()}</span>
                </div>
              </div>

              {/* Addressee Block */}
              <div className="mb-5 font-mono text-xs bg-[#FAF8F3] p-3.5 border border-[#E0D7C5] rounded-md">
                <strong className="block text-[#16191B] font-bold">TO THE PUBLIC COMPLAINTS & OMBUDSMAN AUTHORITY:</strong>
                <div>{ombudsman.name}</div>
                <div>{ombudsman.address}</div>
                <div>Official Email: {ombudsman.email} | Tel: {ombudsman.phones[0]}</div>
              </div>

              {/* Subject Line */}
              <div className="mb-4 pb-2 border-b border-[#2C3034] font-mono text-xs font-bold text-[#1E2022]">
                SUBJECT: {complaint.subject}
              </div>

              {/* Formatted Content */}
              <div className="whitespace-pre-wrap font-serif text-xs leading-relaxed text-[#2A2E33] space-y-3">
                {complaint.body}
              </div>

              {/* Formal Signoff */}
              <div className="mt-8 pt-4 border-t border-[#D5CCBA] font-mono text-xs flex justify-between text-[#555A5F]">
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
            <div className="border border-[#2C3034] bg-[#F7F5F0] p-4 font-mono text-xs text-[#1E2022] overflow-x-auto max-h-[380px] overflow-y-auto leading-relaxed rounded-xl">
              <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed">
                {complaint.body}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Recent Community Field Reports on this Road */}
      {projectReports.length > 0 && (
        <div className="bg-white border-2 border-[#2C3034] p-4 sm:p-5 rounded-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#EAE3D3] pb-3 mb-3 gap-2">
            <h4 className="font-serif font-bold text-base text-[#16191B] flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#1D4ED8]" />
              Recent Field Log Entries ({projectReports.length})
            </h4>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1 text-[11px] font-mono">
              <Filter className="w-3 h-3 text-[#7A8187] mr-1" />
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
                  className={`px-2 py-0.5 border cursor-pointer rounded-md ${
                    reportFilter === filter.id
                      ? 'bg-[#1E2022] text-white border-[#1E2022] font-semibold'
                      : 'bg-[#FAF8F3] text-[#555A5F] border-[#D5CCBA]'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 max-h-[240px] overflow-y-auto pr-1">
            {filteredReports.map((r) => (
              <div key={r.id} className="p-3 border border-[#EAE3D3] bg-[#FAF9F5] text-xs font-mono rounded-lg">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 border rounded ${
                      r.verdict === 'matches'
                        ? 'bg-[#EAF3EC] text-[#1E6E38] border-[#3A6B48]'
                        : r.verdict === 'partial'
                        ? 'bg-[#FFF8EC] text-[#D9981E] border-[#D9981E]'
                        : 'bg-rose-50 text-rose-800 border-rose-300'
                    }`}
                  >
                    {r.verdict === 'matches' ? 'MATCHES REALITY' : r.verdict === 'partial' ? 'PARTIAL / DEFECTS' : 'NOT DONE / STALLED'}
                  </span>
                  <span className="text-[10px] text-[#7A8187]">
                    {new Date(r.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {r.reporterLocation && ` • Location: ${r.reporterLocation}`}
                  </span>
                </div>
                {r.note ? (
                  <p className="text-[#2A2E33] font-serif italic text-xs mt-1.5 pl-1 border-l-2 border-[#D5CCBA]">
                    "{r.note}"
                  </p>
                ) : (
                  <p className="text-[#7A8187] italic text-[11px] mt-1">No additional note recorded.</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
