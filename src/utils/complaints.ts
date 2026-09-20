import { RoadProject, CountryInfo, CitizenVerdict, BenchmarkAnalysis } from '../types';
import { formatCurrency, formatUsd } from './calculator';

export interface ComplaintData {
  project: RoadProject;
  country: CountryInfo;
  analysis: BenchmarkAnalysis;
  citizenVerdict: CitizenVerdict;
  citizenNote?: string;
  citizenLocation?: string;
  citizenName?: string;
}

export function generateComplaintDocket(data: ComplaintData): {
  subject: string;
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  recipientTollFree?: string;
  recipientWhatsapp?: string;
  recipientAddress: string;
  body: string;
  mailtoUrl: string;
  whatsappUrl?: string;
} {
  const { project, country, analysis, citizenVerdict, citizenNote, citizenLocation, citizenName } = data;
  const authority = country.authorities[project.roadClass];
  const ombudsman = country.complaintsBody;
  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const verdictDescription =
    citizenVerdict === 'not_done'
      ? 'CIVIL WORKS ABANDONED / UNDELIVERED'
      : 'PARTIAL COMPLETION & MANIFEST TECHNICAL DEFECTS';

  const subject = `CITIZEN PETITION: Urgent Investigation into ${project.name} (${authority.code}) — ${verdictDescription}`;

  const body = `DATE: ${dateStr}
TO: ${ombudsman.name} (${ombudsman.shortName})
PHYSICAL ADDRESS: ${ombudsman.address}
OFFICIAL EMAIL: ${ombudsman.email}

RE: FORMAL COMPLAINT AND CITIZEN PETITION REGARDING PUBLIC ROAD PROJECT
PROJECT TITLE: ${project.name}
RESPONSIBLE STATUTORY AUTHORITY: ${authority.name} (${authority.code})
OVERSIGHT / FUNDING CHANNEL: ${authority.oversightBody}

----------------------------------------------------------------------
1. CASE PARTICULARS & BUDGETARY DISCLOSURE
----------------------------------------------------------------------
- Road Classification: ${project.roadClass.toUpperCase()} NETWORK
- Length: ${project.lengthKm} km
- Reported Contract Budget: ${formatCurrency(project.budgetLocal, country.currency)} (${project.budgetDisplay})
- Estimated Unit Cost: ${formatUsd(analysis.costPerKmUsd)} / km (${formatCurrency(analysis.costPerKmLocal, country.currency)}/km)
- Universal Benchmark Range for Class: ${formatUsd(analysis.band.minUsdPerKm)} – ${formatUsd(analysis.band.maxUsdPerKm)} / km
- Cost Assessment: ${analysis.verdictTitle.toUpperCase()}
- Funding / Partner Source: ${project.fundingSource}${project.contractorOrPartner ? `\n- Contractor / Implementing Partner: ${project.contractorOrPartner}` : ''}${project.awardYear ? `\n- Award / Commencement Year: ${project.awardYear}` : ''}${project.targetCompletionYear ? `\n- Contracted Completion Year: ${project.targetCompletionYear}` : ''}

----------------------------------------------------------------------
2. CITIZEN ON-THE-GROUND FINDINGS & COMPLAINT GROUNDS
----------------------------------------------------------------------
A citizen physical inspection conducted at the project location indicates that public expenditure on this corridor has failed to deliver the intended public utility.

STATUS CLAIMED IN OFFICIAL RECORDS: ${project.status.toUpperCase().replace('_', ' ')}
GROUND REALITY OBSERVED BY RESIDENTS: ${verdictDescription}

SPECIFIC OBSERVATIONS FROM THE GROUND:
${citizenNote ? citizenNote.trim() : 'Public works appear severely stalled, defective, or deserted without functional drainage, paving, or safety provisions.'}
${citizenLocation ? `Location of Citizen Observer: ${citizenLocation.trim()}` : ''}
${analysis.delayNotice ? `\nDELIVERY DELAY RECORD:\n${analysis.delayNotice}` : ''}

----------------------------------------------------------------------
3. STATUTORY BREACH & INSTITUTIONAL CONTEXT
----------------------------------------------------------------------
Under ${country.name === 'Kenya' ? 'the Constitution of Kenya (Articles 10, 35 & 232), the Public Procurement and Asset Disposal Act, and the Kenya Roads Board Act' : country.name === 'Uganda' ? 'the Constitution of the Republic of Uganda (Articles 17, 41 & Chapter 13) and the Uganda Roads Act 2019' : 'the Public Complaints Commission Act (Cap P37 LFN 2004) and the Public Procurement Act 2007'}, citizens are entitled to transparency, timely execution of public infrastructure, and administrative accountability.

Authority Mandate: "${authority.mandate}"
Structural Governance Notice: ${authority.structuralNote || country.governanceInsight.summary}

----------------------------------------------------------------------
4. PRAYERS FOR ADMINISTRATIVE RELIEF & ACTION REQUESTED
----------------------------------------------------------------------
The complainant respectfully requests ${ombudsman.shortName} to exercise its constitutional powers to:
1. Conduct an urgent, independent on-site engineering and quality inspection of ${project.name}.
2. Requisition and publicly disclose the contract bills of quantities (BOQ), milestone inspection certificates, and schedule of disbursements released to date.
3. Determine whether public funds were diverted, misallocated, or paid out for uncompleted or substandard works.
4. Issue binding administrative directions to ${authority.name} to compel immediate remediation, contractor enforcement, or referral to anti-corruption authorities where criminal negligence is evident.

Respectfully submitted,
${citizenName ? citizenName.trim() : 'Concerned Citizen / Resident of ' + country.name}
Recorded via Civic Ledger Public Infrastructure Platform
Timestamp: ${new Date().toISOString()}
Contact for Ombudsman Follow-up: Citizen Petitioner
`;

  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  const mailtoUrl = `mailto:${ombudsman.email}?subject=${encodedSubject}&body=${encodedBody}`;

  let whatsappUrl: string | undefined = undefined;
  if (ombudsman.whatsapp) {
    const cleanPhone = ombudsman.whatsapp.replace(/[^0-9]/g, '');
    const briefWhatsapp = encodeURIComponent(
      `*CITIZEN INFRASTRUCTURE PETITION to ${ombudsman.shortName}*\n\n*Project:* ${project.name}\n*Authority:* ${authority.name}\n*Ground finding:* ${verdictDescription}\n*Reported Budget:* ${project.budgetDisplay}\n\n*Details:* ${citizenNote || 'Citizen reports stalled/defective works.'}\n\nSubmitted via Civic Ledger.`
    );
    whatsappUrl = `https://wa.me/${cleanPhone}?text=${briefWhatsapp}`;
  }

  return {
    subject,
    recipientName: ombudsman.name,
    recipientEmail: ombudsman.email,
    recipientPhone: ombudsman.phones[0],
    recipientTollFree: ombudsman.tollFree,
    recipientWhatsapp: ombudsman.whatsapp,
    recipientAddress: ombudsman.address,
    body,
    mailtoUrl,
    whatsappUrl,
  };
}
