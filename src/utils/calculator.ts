import { BenchmarkAnalysis, CostVerdict, CountryCode, RoadClass, RoadProject } from '../types';
import { BENCHMARK_BANDS, COUNTRIES } from '../data/roadsData';

export function formatCurrency(amount: number, currency: string): string {
  if (amount >= 1_000_000_000_000) {
    return `${(amount / 1_000_000_000_000).toFixed(2)} Trillion ${currency}`;
  }
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)} Billion ${currency}`;
  }
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)} Million ${currency}`;
  }
  return `${amount.toLocaleString()} ${currency}`;
}

export function formatUsd(amount: number): string {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(2)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}k`;
  }
  return `$${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function analyzeProjectBudget(
  project: Pick<RoadProject, 'budgetLocal' | 'lengthKm' | 'roadClass' | 'countryCode' | 'awardYear' | 'targetCompletionYear' | 'status'>
): BenchmarkAnalysis {
  const country = COUNTRIES[project.countryCode];
  const band = BENCHMARK_BANDS[project.roadClass];

  const length = Math.max(project.lengthKm, 0.1);
  const costPerKmLocal = project.budgetLocal / length;
  const costPerKmUsd = costPerKmLocal / country.fxRateToUsd;

  let verdict: CostVerdict = 'normal';
  let verdictTitle = 'Normal / Within Typical Range';
  let verdictExplanation = `The reported budget translates to approximately ${formatUsd(costPerKmUsd)}/km, which sits comfortably inside the universal benchmark band of ${formatUsd(band.minUsdPerKm)}–${formatUsd(band.maxUsdPerKm)}/km for ${band.label.toLowerCase()}.`;
  let isAnomalous = false;

  if (costPerKmUsd > band.maxUsdPerKm) {
    verdict = 'above_typical';
    isAnomalous = true;
    const timesHigher = (costPerKmUsd / band.maxUsdPerKm).toFixed(1);
    verdictTitle = 'Above Typical — Worth a Closer Look';
    verdictExplanation = `At ${formatUsd(costPerKmUsd)}/km, this project exceeds the typical ceiling of ${formatUsd(band.maxUsdPerKm)}/km by approximately ${timesHigher}×. While complex terrain, extensive sea/river viaducts, or multi-lane dualizations can justify higher figures, this anomaly warrants citizen scrutiny and audit oversight.`;
  } else if (costPerKmUsd < band.minUsdPerKm) {
    verdict = 'below_typical';
    verdictTitle = 'Below Typical Range';
    verdictExplanation = `At ${formatUsd(costPerKmUsd)}/km, this cost is below the standard lower threshold of ${formatUsd(band.minUsdPerKm)}/km. This could indicate an exceptionally lean procurement, or it may reflect a narrower scope (e.g. basic earth grading without paved asphalt, bridges, or proper stone drainage culverts).`;
  }

  // Delivery delay check
  const currentYear = new Date().getFullYear();
  let hasDeliveryDelay = false;
  let delayNotice: string | undefined = undefined;

  if (project.targetCompletionYear && currentYear > project.targetCompletionYear && project.status !== 'completed') {
    const overdueYears = currentYear - project.targetCompletionYear;
    hasDeliveryDelay = true;
    delayNotice = `Contract completion was scheduled for ${project.targetCompletionYear} (${overdueYears} year${overdueYears > 1 ? 's' : ''} overdue) with current status still listed as ${project.status.replace('_', ' ')}.`;
  } else if (project.awardYear && (currentYear - project.awardYear) > 7 && project.status !== 'completed') {
    hasDeliveryDelay = true;
    delayNotice = `Over ${currentYear - project.awardYear} years have elapsed since the contract award in ${project.awardYear}. Extended execution cycles frequently generate hidden cost escalations.`;
  } else if (project.status === 'delayed' || project.status === 'stalled') {
    hasDeliveryDelay = true;
    delayNotice = 'Civil works are formally registered as delayed or halted on the ground.';
  }

  // Scale positioning for the visual range bar
  // We map the value logarithmically or proportionally relative to the band
  const bandSpan = band.maxUsdPerKm - band.minUsdPerKm;
  let percentInBand = 50;
  if (costPerKmUsd <= band.minUsdPerKm) {
    const ratio = Math.max(0, costPerKmUsd / band.minUsdPerKm);
    percentInBand = ratio * 20; // 0% to 20%
  } else if (costPerKmUsd >= band.maxUsdPerKm) {
    const overflowRatio = Math.min(2, (costPerKmUsd - band.maxUsdPerKm) / band.maxUsdPerKm);
    percentInBand = 80 + (overflowRatio / 2) * 20; // 80% to 100%
  } else {
    // Inside band: 20% to 80%
    const progress = (costPerKmUsd - band.minUsdPerKm) / bandSpan;
    percentInBand = 20 + progress * 60;
  }

  return {
    costPerKmLocal,
    costPerKmUsd,
    band,
    verdict,
    verdictTitle,
    verdictExplanation,
    ratioToBandMin: costPerKmUsd / band.minUsdPerKm,
    ratioToBandMax: costPerKmUsd / band.maxUsdPerKm,
    percentInBand: Math.min(100, Math.max(0, percentInBand)),
    isAnomalous,
    hasDeliveryDelay,
    delayNotice,
  };
}
