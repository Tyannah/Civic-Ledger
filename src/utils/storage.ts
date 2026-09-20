import { CitizenReport, CitizenVerdict, CountryCode, ProjectTally } from '../types';

const STORAGE_KEY = 'civic_ledger_community_reports_v2';
const LEGACY_STORAGE_KEY_V1 = 'civic_ledger_community_reports_v1';
const LEGACY_STORAGE_KEY = 'barabara_yangu_community_reports_v1';

// Initial baseline citizen reports seeded for realism on first load
const INITIAL_SEEDED_REPORTS: CitizenReport[] = [
  // Kenya - Western Bypass
  {
    id: 'seed-ke-wb-1',
    projectId: 'ke-western-bypass',
    countryCode: 'KE',
    roadName: 'Nairobi Western Bypass',
    verdict: 'matches',
    note: 'Road is fully open and paved from Gitaru to Ruaka. Overpasses functional. Some pedestrian footbridges still lack ramps.',
    reporterLocation: 'Kikuyu / Ruaka Corridor',
    imageUrl: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Western Bypass completed dual carriageway and flyover near Ruaka',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 12,
  },
  {
    id: 'seed-ke-wb-2',
    projectId: 'ke-western-bypass',
    countryCode: 'KE',
    roadName: 'Nairobi Western Bypass',
    verdict: 'matches',
    note: 'High standard surface. Dramatically cut travel time to Limuru road.',
    reporterLocation: 'Nairobi West',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 20,
  },
  {
    id: 'seed-ke-wb-3',
    projectId: 'ke-western-bypass',
    countryCode: 'KE',
    roadName: 'Nairobi Western Bypass',
    verdict: 'partial',
    note: 'Road completed, but lighting is often dark at Ndenderu junction, creating night hazard.',
    reporterLocation: 'Ndenderu',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },

  // Kenya - Dongo Kundu
  {
    id: 'seed-ke-dk-1',
    projectId: 'ke-dongo-kundu',
    countryCode: 'KE',
    roadName: 'Dongo Kundu Bypass',
    verdict: 'matches',
    note: 'Mteza and Mwache bridges are world-class. Traveled straight from airport to Diani without Likoni ferry delay.',
    reporterLocation: 'Mombasa / Kwale',
    imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Dongo Kundu sea bridge approach corridor',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 8,
  },

  // Kenya - Machakos ward (delayed)
  {
    id: 'seed-ke-mach-1',
    projectId: 'ke-machakos-ward',
    countryCode: 'KE',
    roadName: 'Mavoko Peri-Urban Ring & Market Link (Demo)',
    verdict: 'not_done',
    note: 'Contractor graded the earth and left exposed culverts. Heavy rain created big trenches. Grader has been parked for months.',
    reporterLocation: 'Mavoko Ward',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Excavated unpaved trench and halted works at Mavoko',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 15,
  },
  {
    id: 'seed-ke-mach-2',
    projectId: 'ke-machakos-ward',
    countryCode: 'KE',
    roadName: 'Mavoko Peri-Urban Ring & Market Link (Demo)',
    verdict: 'not_done',
    note: 'No machinery on site. Dust during dry days, mud during wet season.',
    reporterLocation: 'Machakos County',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },

  // Uganda - Entebbe Expressway
  {
    id: 'seed-ug-ee-1',
    projectId: 'ug-entebbe-expressway',
    countryCode: 'UG',
    roadName: 'Kampala–Entebbe Expressway',
    verdict: 'matches',
    note: 'Physically high quality and fast. Smooth surface. Toll collection works reliably.',
    reporterLocation: 'Kajjansi / Entebbe',
    imageUrl: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Entebbe Expressway main tarmac carriageway',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 14,
  },
  {
    id: 'seed-ug-ee-2',
    projectId: 'ug-entebbe-expressway',
    countryCode: 'UG',
    roadName: 'Kampala–Entebbe Expressway',
    verdict: 'partial',
    note: 'Road is delivered and smooth, but drainage along the Spur route backs up during torrential storms, and toll price remains controversial given unit cost.',
    reporterLocation: 'Busega',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 9,
  },

  // Uganda - Gulu Municipal
  {
    id: 'seed-ug-gulu-1',
    projectId: 'ug-gulu-municipal',
    countryCode: 'UG',
    roadName: 'Gulu Municipal Access & Market Corridors (Demo)',
    verdict: 'not_done',
    note: 'Drainage trenches dug out right in front of shop entrances over a year ago. Work abandoned. Children at risk of falling.',
    reporterLocation: 'Gulu City Centre',
    imageUrl: 'https://images.unsplash.com/photo-1578955274801-e28399580fb2?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Excavated trenches and abandoned road shoulder',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 7,
  },
  {
    id: 'seed-ug-gulu-2',
    projectId: 'ug-gulu-municipal',
    countryCode: 'UG',
    roadName: 'Gulu Municipal Access & Market Corridors (Demo)',
    verdict: 'partial',
    note: 'Cobblestone portion is intact, but the main access connector has zero asphalt.',
    reporterLocation: 'Layibi',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },

  // Nigeria - Lagos-Ibadan
  {
    id: 'seed-ng-li-1',
    projectId: 'ng-lagos-ibadan',
    countryCode: 'NG',
    roadName: 'Lagos–Ibadan Expressway Rehabilitation & Reconstruction',
    verdict: 'partial',
    note: 'Large sections around Sagamu and Kara are paved and smooth, but diversions and unfinished shoulders still cause 4-hour gridlock on peak weekends. 11+ years is completely unacceptable for delivery.',
    reporterLocation: 'Berger / Long Bridge Axis',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 4,
  },
  {
    id: 'seed-ng-li-2',
    projectId: 'ng-lagos-ibadan',
    countryCode: 'NG',
    roadName: 'Lagos–Ibadan Expressway Rehabilitation & Reconstruction',
    verdict: 'partial',
    note: 'The finished dual carriageway asphalt is good quality, but the unending lane diversions without adequate night reflectors pose severe security and crash risks.',
    reporterLocation: 'Ibafo / Mowe',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 10,
  },
  {
    id: 'seed-ng-li-3',
    projectId: 'ng-lagos-ibadan',
    countryCode: 'NG',
    roadName: 'Lagos–Ibadan Expressway Rehabilitation & Reconstruction',
    verdict: 'not_done',
    note: 'Section toward Ibadan still has bad stretches and uncompleted drainage channels.',
    reporterLocation: 'Oyo State Border',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 22,
  },

  // Nigeria - Owerri Feeder
  {
    id: 'seed-ng-ow-1',
    projectId: 'ng-owerri-feeder',
    countryCode: 'NG',
    roadName: 'Owerri North Rural Farm-to-Market Link (Demo)',
    verdict: 'not_done',
    note: 'Completely abandoned. Culvert collapsed into gully. Palm oil pickup trucks cannot pass.',
    reporterLocation: 'Owerri North LGA',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 6,
  },
];

export function getStoredReports(): CitizenReport[] {
  if (typeof window === 'undefined') return INITIAL_SEEDED_REPORTS;
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ||
      localStorage.getItem(LEGACY_STORAGE_KEY_V1) ||
      localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEEDED_REPORTS));
      return INITIAL_SEEDED_REPORTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return INITIAL_SEEDED_REPORTS;
    // Enrich seed reports with image URLs if missing
    const enriched = parsed.map((item) => {
      if (item.id && !item.imageUrl) {
        const seedMatch = INITIAL_SEEDED_REPORTS.find((s) => s.id === item.id);
        if (seedMatch?.imageUrl) {
          return { ...item, imageUrl: seedMatch.imageUrl, imageCaption: seedMatch.imageCaption };
        }
      }
      return item;
    });
    return enriched;
  } catch (err) {
    console.error('Failed reading localStorage reports', err);
    return INITIAL_SEEDED_REPORTS;
  }
}

export function saveCitizenReport(report: Omit<CitizenReport, 'id' | 'timestamp'>): CitizenReport {
  const current = getStoredReports();
  const newReport: CitizenReport = {
    ...report,
    id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    timestamp: Date.now(),
  };

  const updated = [newReport, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed saving report to localStorage', err);
  }
  return newReport;
}

export function calculateProjectTally(projectId: string, allReports: CitizenReport[]): ProjectTally {
  const projectReports = allReports.filter((r) => r.projectId === projectId);
  const matches = projectReports.filter((r) => r.verdict === 'matches').length;
  const partial = projectReports.filter((r) => r.verdict === 'partial').length;
  const notDone = projectReports.filter((r) => r.verdict === 'not_done').length;
  const total = projectReports.length;

  let confidenceScore = 0;
  if (total > 0) {
    // Matches count as 100%, partial counts as 45%, not_done counts as 0%
    const scoreSum = matches * 100 + partial * 45;
    confidenceScore = Math.round(scoreSum / total);
  }

  return {
    matches,
    partial,
    notDone,
    total,
    confidenceScore,
  };
}
