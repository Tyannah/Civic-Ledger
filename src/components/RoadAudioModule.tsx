import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Radio,
  FileText,
  Copy,
  Check,
  Download,
  HelpCircle,
  ChevronDown,
  ChevronUp,
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
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
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
      className={`border-t border-[#DDD4C4] bg-[#FAF7F2] ${className}`}
    >
      {/* Sleek Integrated Header Bar */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE3D5] bg-[#F4EFE6]/70">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#3A543E] text-white flex items-center justify-center shrink-0">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-bold text-[#3A543E] tracking-wider">
                Civic Audio Desk
              </span>
              <span className="text-xs text-[#888]">•</span>
              <span className="text-xs font-mono text-[#556259]">
                {currentTranscript.leadSpeaker}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-[#1E2522]">
              {currentTranscript.title}
            </h4>
          </div>
        </div>

        {/* Header Right: Language Switcher & Player Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Language Selector Pills */}
          <div className="flex items-center gap-1 bg-[#EAE3D5] p-1 rounded-full border border-[#DDD4C4]">
            {availableTabs.map((tab) => {
              const isActive = activeLang === tab.code;
              return (
                <button
                  key={tab.code}
                  type="button"
                  onClick={() => handleLanguageChange(tab.code)}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#3A543E] text-white shadow-2xs'
                      : 'text-[#4A554E] hover:text-[#1E2522] hover:bg-white/60'
                  }`}
                >
                  <span>{tab.flag}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-[#556259] hover:text-[#1E2522] rounded-lg hover:bg-[#EAE3D5] transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse audio player' : 'Expand audio player'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-4">

          {/* Compact Audio Console Strip */}
          <div className="bg-white border border-[#DDD4C4] rounded-xl p-4 shadow-2xs space-y-3">
            {/* Progress & Wave Row */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono text-[#66726A]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1E2522]">{formatTime(elapsedSeconds)}</span>
                  <span>/</span>
                  <span>{formatTime(currentTranscript.estimatedDurationSec)}</span>
                </div>

                {/* Soundwave bars */}
                <div className="flex items-end gap-1 h-5 px-2 py-0.5 bg-[#FAF7F2] border border-[#DDD4C4] rounded-md">
                  {barHeights.map((h, i) => (
                    <span
                      key={i}
                      style={{ height: `${h}%` }}
                      className={`w-0.5 rounded-full transition-all duration-100 ${
                        isPlaying ? 'bg-[#3A543E]' : 'bg-[#DDD4C4]'
                      }`}
                    />
                  ))}
                </div>

                <span>
                  Line {currentSentenceIndex + 1} of {currentTranscript.sentences.length}
                </span>
              </div>

              {/* Scrubber Bar */}
              <div
                className="w-full bg-[#EAE3D5] rounded-full h-2 overflow-hidden cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const pct = Math.max(0, Math.min(1, clickX / rect.width));
                  const targetSentence = Math.floor(pct * currentTranscript.sentences.length);
                  handleSentenceClick(targetSentence);
                }}
              >
                <div
                  className="bg-[#3A543E] h-full rounded-full transition-all duration-200"
                  style={{ width: `${Math.min(100, Math.max(progressPercent, ((currentSentenceIndex) / currentTranscript.sentences.length) * 100))}%` }}
                />
              </div>
            </div>

            {/* Tactical Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
              <div className="flex items-center gap-2">
                {/* Play/Pause Button */}
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className={`px-4 py-2 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs ${
                    isPlaying
                      ? 'bg-[#BF532C] hover:bg-[#A84520] text-white'
                      : 'bg-[#3A543E] hover:bg-[#2B402E] text-white'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{activeLang === 'sw' ? 'Sikiliza' : 'Play Audio'}</span>
                    </>
                  )}
                </button>

                {/* Restart */}
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-2 bg-[#FAF7F2] hover:bg-[#EAE3D5] border border-[#DDD4C4] rounded-lg text-[#4A554E] transition-colors cursor-pointer"
                  title="Restart"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                {/* Speed toggle */}
                <button
                  type="button"
                  onClick={handleSpeedToggle}
                  className="px-2.5 py-2 bg-[#FAF7F2] hover:bg-[#EAE3D5] border border-[#DDD4C4] rounded-lg text-xs font-mono font-bold text-[#4A554E] transition-colors cursor-pointer"
                  title="Playback Speed"
                >
                  {speedRate}x
                </button>

                {/* Mute */}
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 bg-[#FAF7F2] hover:bg-[#EAE3D5] border border-[#DDD4C4] rounded-lg text-[#4A554E] transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-[#BF532C]" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Right Side Tools */}
              <div className="flex items-center gap-2">
                {/* Transcript Toggle */}
                <button
                  type="button"
                  onClick={() => setShowTranscript(!showTranscript)}
                  className={`px-3 py-1.5 border rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    showTranscript
                      ? 'bg-[#E8F0EA] border-[#BBD7C2] text-[#2E663B]'
                      : 'bg-[#FAF7F2] border-[#DDD4C4] text-[#556259] hover:bg-[#EAE3D5]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Transcript ({currentTranscript.sentences.length})</span>
                  {showTranscript ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                {/* Copy */}
                <button
                  type="button"
                  onClick={handleCopyScript}
                  className="p-2 bg-[#FAF7F2] hover:bg-[#EAE3D5] border border-[#DDD4C4] rounded-lg text-[#556259] transition-colors cursor-pointer"
                  title="Copy Transcript"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#2E663B]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                {/* Download */}
                <button
                  type="button"
                  onClick={handleDownloadScript}
                  className="p-2 bg-[#FAF7F2] hover:bg-[#EAE3D5] border border-[#DDD4C4] rounded-lg text-[#556259] transition-colors cursor-pointer"
                  title="Download .txt"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Collapsible Transcript Section */}
          {showTranscript && (
            <div className="bg-white border border-[#DDD4C4] rounded-xl p-4 sm:p-5 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE3D5] text-xs font-mono">
                <span className="font-bold text-[#1E2522] uppercase tracking-wider">
                  Read-Along Script ({currentTranscript.languageName})
                </span>
                <button
                  type="button"
                  onClick={() => setShowEnglishGloss(!showEnglishGloss)}
                  className="text-[11px] text-[#3A543E] hover:underline cursor-pointer font-semibold"
                >
                  {showEnglishGloss ? 'Hide Companion Gloss' : 'Show Companion Gloss'}
                </button>
              </div>

              {/* Scrollable Sentence List */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-sm">
                {currentTranscript.sentences.map((sent, idx) => {
                  const isCurrent = isPlaying && currentSentenceIndex === idx;

                  return (
                    <div
                      key={idx}
                      onClick={() => handleSentenceClick(idx)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-[#FDF9EE] border-[#E09F3E] text-[#1E2522] shadow-2xs'
                          : 'bg-[#FAF7F2]/50 border-[#EAE3D5] hover:bg-white text-[#333]'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5 ${
                            isCurrent
                              ? 'bg-[#E09F3E] text-[#1E2522]'
                              : 'bg-[#EAE3D5] text-[#66726A]'
                          }`}
                        >
                          {idx + 1}
                        </span>

                        <div className="flex-1 space-y-1">
                          <p className={`leading-relaxed ${isCurrent ? 'font-semibold text-[#1E2522]' : 'text-[#2D3530]'}`}>
                            {sent.text}
                          </p>

                          {showEnglishGloss && (
                            <p className="text-xs text-[#66726A] italic border-t border-[#EAE3D5]/60 pt-1">
                              {activeLang === 'en' && isUganda ? (
                                <>
                                  <span className="font-mono not-italic text-[10px] text-[#3A543E] font-bold mr-1">
                                    Oluganda:
                                  </span>
                                  {audioPackage.luganda.sentences[idx]?.text || sent.translationEn}
                                </>
                              ) : (
                                <>
                                  <span className="font-mono not-italic text-[10px] text-[#3A543E] font-bold mr-1">
                                    En:
                                  </span>
                                  {sent.translationEn}
                                </>
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Compact Civic Takeaway */}
              <div className="pt-2 border-t border-[#EAE3D5] flex items-start gap-2 text-xs text-[#2E663B] bg-[#E8F0EA]/60 p-3 rounded-lg">
                <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#3A543E]" />
                <div>
                  <strong className="font-mono uppercase text-[10px] block text-[#1E2522]">
                    Core Civic Takeaway
                  </strong>
                  <span className="text-[#2D3530] font-sans">
                    {currentTranscript.civicTakeaway}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
