import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Languages,
  Radio,
  FileText,
  Copy,
  Check,
  Download,
  HelpCircle,
  Headphones,
  Sparkles,
  Info,
} from 'lucide-react';
import { RoadProject, CountryInfo } from '../types';
import {
  generateAudioPackageForProject,
  AudioTranscript,
  RoadAudioPackage,
} from '../data/roadAudioTranscripts';
import { audioEngine } from '../utils/audioPlayback';

interface RoadAudioModuleProps {
  project: RoadProject;
  country: CountryInfo;
  className?: string;
  defaultExpanded?: boolean;
}

interface LanguageOption {
  code: 'sw' | 'lg' | 'en';
  label: string;
  sublabel: string;
  flag: string;
  badge?: string;
}

const getEffectiveCountryCode = (project: RoadProject, country: CountryInfo): string => {
  return project.countryCode || country.code;
};

const getDefaultLangForCountry = (cCode: string): 'sw' | 'lg' | 'en' => {
  if (cCode === 'KE') return 'sw'; // Kiswahili for Kenya
  if (cCode === 'UG') return 'en'; // English for Luganda / Uganda
  return 'en';
};

const getLanguageTabsForCountry = (cCode: string): LanguageOption[] => {
  if (cCode === 'KE') {
    return [
      { code: 'sw', label: 'Kiswahili', sublabel: 'Kenya (National)', flag: '🇰🇪', badge: 'Primary' },
      { code: 'en', label: 'English', sublabel: 'Reference Gloss', flag: '🇬🇧' },
    ];
  }
  if (cCode === 'UG') {
    return [
      { code: 'en', label: 'English', sublabel: 'For Luganda Corridor', flag: '🇬🇧', badge: 'Primary' },
      { code: 'lg', label: 'Luganda', sublabel: 'Oluganda (Native)', flag: '🇺🇬', badge: 'Indigenous' },
    ];
  }
  return [
    { code: 'en', label: 'English', sublabel: 'Federal Highway', flag: '🇳🇬', badge: 'Official' },
  ];
};

export const RoadAudioModule: React.FC<RoadAudioModuleProps> = ({
  project,
  country,
  className = '',
  defaultExpanded = true,
}) => {
  const effectiveCode = getEffectiveCountryCode(project, country);
  const isKenya = effectiveCode === 'KE';
  const isUganda = effectiveCode === 'UG';
  const availableTabs = getLanguageTabsForCountry(effectiveCode);

  const [activeLang, setActiveLang] = useState<'sw' | 'lg' | 'en'>(() =>
    getDefaultLangForCountry(effectiveCode)
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [speedRate, setSpeedRate] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showEnglishGloss, setShowEnglishGloss] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  // Audio visualizer animation state
  const [barHeights, setBarHeights] = useState<number[]>([40, 65, 30, 80, 55, 90, 45, 70, 35, 85, 60, 40]);
  const visualizerIntervalRef = useRef<number | null>(null);

  // Get current audio package for this project
  const audioPackage: RoadAudioPackage = generateAudioPackageForProject(project, country);
  const currentTranscript: AudioTranscript =
    activeLang === 'sw'
      ? audioPackage.swahili
      : activeLang === 'lg'
      ? audioPackage.luganda
      : audioPackage.english;

  // Stop audio whenever project or country changes and set default language
  useEffect(() => {
    audioEngine.stop();
    setIsPlaying(false);
    setCurrentSentenceIndex(0);
    setElapsedSeconds(0);
    setProgressPercent(0);
    setActiveLang(getDefaultLangForCountry(effectiveCode));
  }, [project.id, effectiveCode]);

  // Handle animated visualizer
  useEffect(() => {
    if (isPlaying) {
      visualizerIntervalRef.current = window.setInterval(() => {
        setBarHeights(
          Array.from({ length: 14 }, () => Math.floor(Math.random() * 75) + 20)
        );
      }, 120);
    } else {
      if (visualizerIntervalRef.current) {
        clearInterval(visualizerIntervalRef.current);
        visualizerIntervalRef.current = null;
      }
      setBarHeights([30, 45, 25, 50, 35, 60, 30, 45, 20, 50, 40, 25, 35, 20]);
    }
    return () => {
      if (visualizerIntervalRef.current) {
        clearInterval(visualizerIntervalRef.current);
      }
    };
  }, [isPlaying]);

  // Clean up when unmounting
  useEffect(() => {
    return () => {
      audioEngine.stop();
    };
  }, []);

  const handleTogglePlay = () => {
    if (isPlaying) {
      audioEngine.stop();
      setIsPlaying(false);
      return;
    }

    startPlayback(currentSentenceIndex);
  };

  const startPlayback = (fromIndex = 0) => {
    const sentences = currentTranscript.sentences.map((s) => s.text);
    setIsPlaying(true);
    setCurrentSentenceIndex(fromIndex);

    audioEngine.speakSentences({
      sentences,
      language: activeLang,
      rate: speedRate,
      volume: isMuted ? 0 : 1.0,
      startIndex: fromIndex,
      onSentenceChange: (idx) => {
        setCurrentSentenceIndex(idx);
      },
      onProgress: (elapsed, percent) => {
        setElapsedSeconds(elapsed);
        setProgressPercent(percent);
      },
      onEnd: () => {
        setIsPlaying(false);
        setProgressPercent(100);
      },
      onError: () => {
        setIsPlaying(false);
      },
    });
  };

  const handleLanguageChange = (lang: 'sw' | 'lg' | 'en') => {
    if (lang === activeLang) return;
    audioEngine.stop();
    setIsPlaying(false);
    setActiveLang(lang);
    setCurrentSentenceIndex(0);
    setElapsedSeconds(0);
    setProgressPercent(0);
  };

  const handleSpeedToggle = () => {
    const nextSpeed = speedRate === 0.85 ? 1.0 : speedRate === 1.0 ? 1.2 : 0.85;
    setSpeedRate(nextSpeed);
    if (isPlaying) {
      audioEngine.stop();
      setTimeout(() => {
        startPlayback(currentSentenceIndex);
      }, 100);
    }
  };

  const handleSentenceClick = (index: number) => {
    audioEngine.stop();
    setCurrentSentenceIndex(index);
    startPlayback(index);
  };

  const handleReset = () => {
    audioEngine.stop();
    setIsPlaying(false);
    setCurrentSentenceIndex(0);
    setElapsedSeconds(0);
    setProgressPercent(0);
  };

  const handleCopyScript = () => {
    const formatted = `[CIVIC LEDGER AUDIO SCRIPT - ${currentTranscript.languageName.toUpperCase()}]
Road: ${project.name} (${country.name})
Title: ${currentTranscript.title}
Speaker / Desk: ${currentTranscript.leadSpeaker}
Estimated Duration: ~${currentTranscript.estimatedDurationSec}s

${currentTranscript.sentences
  .map((s, i) => {
    const companion =
      activeLang === 'en' && isUganda
        ? `   (Luganda / Oluganda: ${audioPackage.luganda.sentences[i]?.text || s.translationEn})`
        : `   (English: ${s.translationEn})`;
    return `${i + 1}. ${s.text}\n${companion}`;
  })
  .join('\n\n')}

Civic Takeaway: ${currentTranscript.civicTakeaway}
Source: Civic Ledger Public Infrastructure Index`;

    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadScript = () => {
    const content = `CIVIC LEDGER AUDIO BROADCAST DOSSIER
======================================================
Road Corridor: ${project.name}
Jurisdiction: ${country.name} (${project.roadClass.toUpperCase()} NETWORK)
Language: ${currentTranscript.languageName} (${currentTranscript.languageNativeName})
Speaker / Channel: ${currentTranscript.leadSpeaker}

SCRIPT TRANSCRIPT:
------------------------------------------------------
${currentTranscript.sentences
  .map((s, i) => {
    const companionLabel = activeLang === 'en' && isUganda ? 'Luganda Translation' : 'English Translation';
    const companionText =
      activeLang === 'en' && isUganda
        ? audioPackage.luganda.sentences[i]?.text || s.translationEn
        : s.translationEn;
    return `[SEGMENT ${i + 1}]\n${s.text}\n${companionLabel}: ${companionText}\n`;
  })
  .join('\n')}
------------------------------------------------------
CIVIC AUDIT TAKEAWAY:
${currentTranscript.civicTakeaway}

Reported Authority: ${country.authorities[project.roadClass].name}
Budget Allocation: ${project.budgetDisplay}
Status: ${project.status.toUpperCase()}
Generated by Civic Ledger Citizen Audit Initiative
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CivicLedger-Audio-${project.id}-${activeLang}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      id="road-audio-module"
      className={`border-2 border-[#DDD4C4] bg-[#FAF7F2] rounded-2xl overflow-hidden shadow-xs transition-all ${className}`}
    >
      {/* Module Header Bar */}
      <div className="bg-[#2D3F33] text-[#F4EFE6] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#3A543E]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E09F3E] text-[#1E2522] flex items-center justify-center font-bold shrink-0 shadow-xs">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#E09F3E]">
                Civic Audio Desk
              </span>
              <span className="text-[10px] font-mono text-white/60">•</span>
              <span className="text-[10px] font-mono text-[#E8F0EA] font-semibold">
                {isKenya
                  ? 'Dawati la Sauti (Kiswahili / Kenya)'
                  : isUganda
                  ? 'English Briefing for Luganda Corridor (Uganda)'
                  : 'Federal Highway Audio Briefing (Nigeria)'}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>{isKenya ? 'Kenya Corridor Audio' : isUganda ? 'Uganda Corridor Audio' : 'Oral Corridor Overview'}</span>
              <span className="text-xs font-mono font-normal text-[#DDD4C4]/80 hidden md:inline">
                ({project.name})
              </span>
            </h3>
          </div>
        </div>

        {/* Quick Language Badges & Collapse Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-[#F4EFE6] border border-white/20 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Headphones className="w-3.5 h-3.5 text-[#E09F3E]" />
            <span>{isExpanded ? 'Hide Audio Desk' : 'Open Audio Player'}</span>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-6">
          {/* Top Explanatory Banner: Country Specific Audio Context */}
          <div className="bg-white border border-[#DDD4C4] p-3.5 sm:p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5 text-xs text-[#3E4741]">
              <Languages className="w-4 h-4 text-[#BF532C] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#1E2522] font-semibold">
                  {isKenya
                    ? 'Kiswahili Audio for Kenya: '
                    : isUganda
                    ? 'English Audio for Luganda Corridor: '
                    : 'Oral Civic Accountability: '}
                </strong>
                {isKenya
                  ? 'Public infrastructure audits in East African Kiswahili for Kenya corridors, highlighting KeNHA/KURA statutory mandates, exchequer budget allocations, and citizen oversight.'
                  : isUganda
                  ? 'English corridor briefing tailored for the Luganda / Uganda road network, detailing MoWT & KCCA execution, loan repayments, and watchdog checkpoints.'
                  : 'Public infrastructure audits narrating statutory agency mandates, procurement expenditures, and ground-truth checkpoints.'}
              </div>
            </div>

            {/* Dynamic Language Selector Tabs */}
            <div className="flex items-center gap-1 bg-[#F4EFE6] p-1 rounded-xl border border-[#DDD4C4] shrink-0 self-stretch sm:self-auto justify-between sm:justify-start">
              {availableTabs.map((tab) => {
                const isActive = activeLang === tab.code;
                return (
                  <button
                    key={tab.code}
                    type="button"
                    onClick={() => handleLanguageChange(tab.code)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#3A543E] text-white shadow-2xs'
                        : 'text-[#3E4741] hover:text-[#1E2522] hover:bg-white/60'
                    }`}
                  >
                    <span>{tab.flag}</span>
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span
                        className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-semibold ${
                          isActive ? 'bg-white/20 text-[#E8F0EA]' : 'bg-[#DDD4C4]/60 text-[#556259]'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Player Console */}
          <div className="bg-white border-2 border-[#DDD4C4] rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#EAE3D5]">
              {/* Channel / Program Title */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E09F3E] animate-ping" />
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#3A543E] font-bold">
                    {currentTranscript.leadSpeaker}
                  </span>
                  <span className="text-xs text-[#66726A]">•</span>
                  <span className="text-[11px] font-mono text-[#66726A]">
                    {currentTranscript.languageName} ({currentTranscript.languageNativeName})
                  </span>
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-[#1E2522]">
                  {currentTranscript.title}
                </h4>
              </div>

              {/* Animated Soundwave Visualizer */}
              <div className="flex items-end gap-1 h-9 px-3 py-1 bg-[#FAF7F2] border border-[#DDD4C4] rounded-xl self-start md:self-center">
                {barHeights.map((h, i) => (
                  <span
                    key={i}
                    style={{ height: `${h}%` }}
                    className={`w-1 rounded-full transition-all duration-100 ${
                      isPlaying
                        ? i % 2 === 0
                          ? 'bg-[#3A543E]'
                          : 'bg-[#E09F3E]'
                        : 'bg-[#DDD4C4]'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Main Audio Controls & Progress */}
            <div className="mt-5 space-y-4">
              {/* Progress Slider Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-[#66726A]">
                  <span className="font-bold text-[#1E2522]">{formatTime(elapsedSeconds)}</span>
                  <span>
                    Sentence {currentSentenceIndex + 1} of {currentTranscript.sentences.length}
                  </span>
                  <span className="font-bold text-[#1E2522]">
                    ~{formatTime(currentTranscript.estimatedDurationSec)}
                  </span>
                </div>

                <div className="w-full bg-[#EAE3D5] rounded-full h-2.5 overflow-hidden relative cursor-pointer">
                  <div
                    className="bg-[#3A543E] h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(progressPercent, ((currentSentenceIndex) / currentTranscript.sentences.length) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Tactical Button Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Big Play/Pause Button */}
                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-xs ${
                      isPlaying
                        ? 'bg-[#BF532C] hover:bg-[#A84520] text-white'
                        : 'bg-[#3A543E] hover:bg-[#2B402E] text-white'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>Simamisha (Pause)</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        <span>Sikiliza (Play Overview)</span>
                      </>
                    )}
                  </button>

                  {/* Reset/Restart Button */}
                  <button
                    type="button"
                    onClick={handleReset}
                    className="p-2.5 bg-[#FAF7F2] hover:bg-[#EFE9DD] border border-[#DDD4C4] rounded-xl text-[#3E4741] transition-colors cursor-pointer"
                    title="Anza upya (Restart Audio)"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  {/* Speed Selector */}
                  <button
                    type="button"
                    onClick={handleSpeedToggle}
                    className="px-3 py-2 bg-[#FAF7F2] hover:bg-[#EFE9DD] border border-[#DDD4C4] rounded-xl text-xs font-mono font-bold text-[#3E4741] transition-colors cursor-pointer"
                    title="Badilisha kasi (Playback Speed)"
                  >
                    {speedRate}x
                  </button>

                  {/* Mute/Unmute */}
                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2.5 bg-[#FAF7F2] hover:bg-[#EFE9DD] border border-[#DDD4C4] rounded-xl text-[#3E4741] transition-colors cursor-pointer"
                    title={isMuted ? 'Washa sauti (Unmute)' : 'Zima sauti (Mute)'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-[#BF532C]" /> : <Volume2 className="w-4 h-4 text-[#3A543E]" />}
                  </button>
                </div>

                {/* Right Side Options: English Gloss Toggle & Share */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEnglishGloss(!showEnglishGloss)}
                    className={`px-3 py-2 border rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      showEnglishGloss
                        ? 'bg-[#E8F0EA] border-[#BBD7C2] text-[#2E663B]'
                        : 'bg-[#FAF7F2] border-[#DDD4C4] text-[#66726A]'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>
                      {activeLang === 'en' && isUganda
                        ? 'Luganda Translation'
                        : 'English Translation'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyScript}
                    className="px-3 py-2 bg-[#FAF7F2] hover:bg-[#EFE9DD] border border-[#DDD4C4] rounded-xl text-xs font-mono font-bold text-[#3E4741] flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Copy transcript text"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#2E663B]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Script'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadScript}
                    className="p-2 bg-[#FAF7F2] hover:bg-[#EFE9DD] border border-[#DDD4C4] rounded-xl text-[#3E4741] transition-colors cursor-pointer"
                    title="Download transcript dossier (.txt)"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Synchronized Read-Along Script & Focus Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E09F3E]" />
                <span className="text-xs font-mono uppercase font-bold tracking-wider text-[#1E2522]">
                  Synchronized Read-Along Transcript ({currentTranscript.languageName})
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#66726A]">
                Click any line to play from that sentence
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {currentTranscript.sentences.map((sent, idx) => {
                const isCurrent = isPlaying && currentSentenceIndex === idx;

                return (
                  <div
                    key={idx}
                    onClick={() => handleSentenceClick(idx)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#FDF9EE] border-2 border-[#E09F3E] shadow-sm transform scale-[1.008]'
                        : 'bg-white border-[#EAE3D5] hover:border-[#3A543E]/50 hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                              isCurrent
                                ? 'bg-[#E09F3E] text-[#1E2522]'
                                : 'bg-[#FAF7F2] text-[#66726A] border border-[#DDD4C4]'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          {sent.focusTerm && (
                            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-[#E8F0EA] text-[#2E663B] border border-[#BBD7C2] rounded-md">
                              {sent.focusTerm}
                            </span>
                          )}
                          {isCurrent && (
                            <span className="text-[10px] font-mono font-bold text-[#BF532C] uppercase flex items-center gap-1 animate-pulse">
                              <Volume2 className="w-3 h-3" />{' '}
                              {activeLang === 'sw'
                                ? 'Inasoma sasa (Speaking)'
                                : activeLang === 'lg'
                                ? 'Esoma kati (Speaking)'
                                : 'Now Speaking'}
                            </span>
                          )}
                        </div>

                        {/* Primary Spoken Language Text */}
                        <p className={`text-sm sm:text-base leading-relaxed ${isCurrent ? 'font-bold text-[#1E2522]' : 'text-[#2D3530]'}`}>
                          {sent.text}
                        </p>

                        {/* Translation Gloss */}
                        {showEnglishGloss && (
                          <p className="text-xs text-[#66726A] italic pt-1 border-t border-[#F4EFE6] leading-normal font-sans">
                            {activeLang === 'en' && isUganda ? (
                              <>
                                <strong className="text-[#3A543E] font-mono not-italic text-[10px] uppercase mr-1">
                                  Oluganda:
                                </strong>
                                {audioPackage.luganda.sentences[idx]?.text || sent.translationEn}
                              </>
                            ) : (
                              <>
                                <strong className="text-[#3A543E] font-mono not-italic text-[10px] uppercase mr-1">
                                  En:
                                </strong>
                                {sent.translationEn}
                              </>
                            )}
                          </p>
                        )}

                        {/* Optional Focus term explanation */}
                        {sent.focusExplanation && (
                          <div className="text-[11px] font-mono text-[#556259] pt-1 flex items-center gap-1">
                            <Info className="w-3 h-3 text-[#E09F3E] shrink-0" />
                            <span>{sent.focusExplanation}</span>
                          </div>
                        )}
                      </div>

                      {/* Play line button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSentenceClick(idx);
                        }}
                        className={`p-2 rounded-lg text-xs font-mono shrink-0 transition-colors ${
                          isCurrent
                            ? 'bg-[#E09F3E] text-[#1E2522]'
                            : 'bg-[#FAF7F2] hover:bg-[#3A543E] hover:text-white text-[#3E4741] border border-[#DDD4C4]'
                        }`}
                        title={
                          activeLang === 'sw'
                            ? 'Cheza mstari huu'
                            : activeLang === 'lg'
                            ? 'Zannya olunyiriri luno'
                            : 'Play this sentence'
                        }
                      >
                        <Play className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Civic Takeaway Card */}
          <div className="bg-[#E8F0EA] border border-[#BBD7C2] p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-start gap-2.5 text-[#2E663B]">
              <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[11px] uppercase font-bold text-[#1E2522]">
                  {activeLang === 'sw'
                    ? 'Ujumbe Mkuu wa Kiraia (Civic Takeaway)'
                    : activeLang === 'lg'
                    ? 'Ekkulu eriri mu Okubuulirira kuno (Civic Takeaway)'
                    : 'Core Civic Takeaway'}
                </strong>
                <span className="text-[#2D3530] text-xs font-sans mt-0.5 block leading-relaxed">
                  {currentTranscript.civicTakeaway}
                </span>
              </div>
            </div>

            <span className="text-[10px] uppercase font-bold px-2.5 py-1 bg-white text-[#3A543E] border border-[#BBD7C2] rounded-lg shrink-0 self-start sm:self-auto">
              Civic Standard
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
