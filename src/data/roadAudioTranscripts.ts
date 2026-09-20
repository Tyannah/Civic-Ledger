import { RoadProject, CountryInfo, RoadClass } from '../types';

export interface AudioTranscript {
  language: 'sw' | 'lg' | 'en';
  languageName: 'Kiswahili' | 'Luganda' | 'English';
  languageNativeName: 'Kiswahili' | 'Oluganda' | 'English';
  title: string;
  leadSpeaker: string;
  estimatedDurationSec: number;
  sentences: {
    text: string;
    translationEn: string;
    focusTerm?: string;
    focusExplanation?: string;
  }[];
  civicTakeaway: string;
}

export interface RoadAudioPackage {
  projectId: string;
  roadName: string;
  countryCode: string;
  swahili: AudioTranscript;
  luganda: AudioTranscript;
  english: AudioTranscript;
}

// Pre-crafted, culturally authentic and grammatically refined scripts for seed road projects
export const SEED_AUDIO_PACKAGES: Record<string, RoadAudioPackage> = {
  // KENYA: Nairobi Western Bypass
  'ke-western-bypass': {
    projectId: 'ke-western-bypass',
    roadName: 'Nairobi Western Bypass',
    countryCode: 'KE',
    swahili: {
      language: 'sw',
      languageName: 'Kiswahili',
      languageNativeName: 'Kiswahili',
      title: 'Muhtasari wa Barabara: Nairobi Western Bypass',
      leadSpeaker: 'Dawati la Sauti la Civic Ledger',
      estimatedDurationSec: 42,
      sentences: [
        {
          text: 'Huu ni muhtasari wa mradi wa barabara ya Nairobi Western Bypass yenye urefu wa kilomita 17.',
          translationEn: 'This is an overview of the Nairobi Western Bypass road project spanning 17 kilometers.',
        },
        {
          text: 'Mamlaka inayohusika kisheria na barabara hii ya kitaifa ni KeNHA, yaani Mamlaka ya Kitaifa ya Barabara Kuu nchini Kenya.',
          translationEn: 'The statutory authority responsible for this national highway is KeNHA, the Kenya National Highways Authority.',
          focusTerm: 'Mamlaka ya Kitaifa (KeNHA)',
          focusExplanation: 'Statutory national highway authority managing Class S, A, and B trunk roads.',
        },
        {
          text: 'Gharama ya jumla iliyotangazwa ilikuwa Shilingi Bilioni 17.3 za Kenya, ikifadhiliwa asilimia 85 na mkopo kutoka Benki ya Exim ya China na asilimia 15 kutoka kwa Serikali ya Kenya.',
          translationEn: 'The total reported budget was KES 17.3 Billion, funded 85% by Exim Bank of China concessionary loan and 15% by the Government of Kenya.',
          focusTerm: 'Bajeti na Mkopo',
          focusExplanation: 'Concessionary external debt financing.',
        },
        {
          text: 'Mkandarasi mkuu alikuwa kampuni ya China Road and Bridge Corporation (CRBC), na barabara hii imekamilika na kufunguliwa kwa magari.',
          translationEn: 'The prime contractor was China Road and Bridge Corporation (CRBC), and the road is completed and open to traffic.',
        },
        {
          text: 'Ujumbe kwa wananchi: Ni wajibu wetu kufuatilia usalama wa madaraja ya watembea kwa miguu na mifereji ya maji ili fedha za walipakodi zizae matunda.',
          translationEn: 'Civic takeaway: It is our civic duty to inspect pedestrian crossings and drainage so taxpayer funds yield lasting value.',
        },
      ],
      civicTakeaway: 'Barabara imekamilika; raia wanapaswa kulinda mifereji ya maji na taa za barabarani.',
    },
    luganda: {
      language: 'lg',
      languageName: 'Luganda',
      languageNativeName: 'Oluganda',
      title: "Okunnyonnyola kw'Oluguudo: Nairobi Western Bypass",
      leadSpeaker: 'Empewo z’Ebyenguudo eza Civic Ledger',
      estimatedDurationSec: 45,
      sentences: [
        {
          text: 'Luno lwe lunnyonnyola ku lusasulo lw’oluguudo lwa Nairobi Western Bypass olwa kilomita 17.',
          translationEn: 'This is the briefing on the Nairobi Western Bypass road corridor spanning 17 kilometers.',
        },
        {
          text: 'Ekitongole ekivunaanyizibwa mu mateeka kye KeNHA, ekitongole ekitwala enguudo ennene mu ggwanga lya Kenya.',
          translationEn: 'The legally mandated body is KeNHA, the national highway agency in Kenya.',
          focusTerm: 'Ekitongole ekivunaanyizibwa (KeNHA)',
          focusExplanation: 'Designated statutory highways authority in charge of major arterial links.',
        },
        {
          text: 'Ensimbi ezasaasaanyizibwa zaali Siringi za Kenya obuwumbi 17 n’ekitundu, nga zaava mu bbanja lya Bbanka ya Exim ey’e China wamu ne Gavumenti ya Kenya.',
          translationEn: 'The expenditure totaled KES 17.3 Billion, funded by a concessionary loan from Exim Bank of China alongside the Government of Kenya.',
          focusTerm: 'Ensimbi n’Ebbanja',
          focusExplanation: 'Concessionary debt financing repaid by citizens through public revenue.',
        },
        {
          text: 'Kampuni eyazimba y’e China Road and Bridge Corporation, era oluguudo luno lwamalirizibwa ne lutandika okukozesebwa.',
          translationEn: 'The contractor was China Road and Bridge Corporation, and this road was finalized and opened for public transit.',
        },
        {
          text: 'Amagezi eri abatuuze: Omutuuze alina obuvunaanyizibwa okulondoola amakubo g’abannansi n’ensalosalo z’amazzi okulaba nti ensimbi z’omusolo tezaasaasaanyizibwa bwereere.',
          translationEn: 'Citizen advisory: Residents have a responsibility to monitor pedestrian links and drainage culverts so public tax funds are not wasted.',
        },
      ],
      civicTakeaway: 'Oluguudo lwamalirizibwa; abatuuze balondoola emitindo n’ebikomera by’ensalosalo.',
    },
    english: {
      language: 'en',
      languageName: 'English',
      languageNativeName: 'English',
      title: 'Corridor Overview: Nairobi Western Bypass',
      leadSpeaker: 'Civic Ledger Audio Desk',
      estimatedDurationSec: 38,
      sentences: [
        {
          text: 'Here is the civic overview for the 17-kilometer Nairobi Western Bypass corridor.',
          translationEn: 'Here is the civic overview for the 17-kilometer Nairobi Western Bypass corridor.',
        },
        {
          text: 'The statutory agency in charge is the Kenya National Highways Authority (KeNHA).',
          translationEn: 'The statutory agency in charge is the Kenya National Highways Authority (KeNHA).',
          focusTerm: 'KeNHA',
          focusExplanation: 'National highway authority.',
        },
        {
          text: 'The project budget was KES 17.3 Billion, funded 85% via Exim Bank of China and 15% by the Government of Kenya.',
          translationEn: 'The project budget was KES 17.3 Billion, funded 85% via Exim Bank of China and 15% by the Government of Kenya.',
        },
        {
          text: 'Civil works were delivered by CRBC and the corridor is now open to vehicular traffic.',
          translationEn: 'Civil works were delivered by CRBC and the corridor is now open to vehicular traffic.',
        },
        {
          text: 'Citizen action: Verify that pedestrian overpasses and roadside stormwater systems remain clear and maintained.',
          translationEn: 'Citizen action: Verify that pedestrian overpasses and roadside stormwater systems remain clear and maintained.',
        },
      ],
      civicTakeaway: 'Completed ring road; citizens verify drainage maintenance and pedestrian safety.',
    },
  },

  // UGANDA: Kampala–Entebbe Expressway
  'ug-entebbe-expressway': {
    projectId: 'ug-entebbe-expressway',
    roadName: 'Kampala–Entebbe Expressway',
    countryCode: 'UG',
    swahili: {
      language: 'sw',
      languageName: 'Kiswahili',
      languageNativeName: 'Kiswahili',
      title: 'Muhtasari wa Barabara: Kampala–Entebbe Expressway',
      leadSpeaker: 'Dawati la Sauti la Civic Ledger',
      estimatedDurationSec: 46,
      sentences: [
        {
          text: 'Huu ni muhtasari wa Barabara ya Mwendo Kasi ya Kampala kuelekea Entebbe nchini Uganda, yenye urefu wa kilomita 51.',
          translationEn: 'This is the overview of the 51-kilometer Kampala–Entebbe Expressway in Uganda.',
        },
        {
          text: 'Barabara hii ilisimamiwa hapo awali na Mamlaka ya UNRA, lakini kufuatia mabadiliko ya kiserikali mnamo Desemba 2024, sasa iko chini ya Wizara ya Ujenzi na Uchukuzi (MoWT).',
          translationEn: 'This road was previously managed by UNRA, but following government rationalization in Dec 2024, it is now directly under the Ministry of Works and Transport (MoWT).',
          focusTerm: 'Mabadiliko ya Usimamizi (RAPEX)',
          focusExplanation: 'Dissolution of UNRA and return of oversight directly into the Ministry of Works.',
        },
        {
          text: 'Bajeti ya mradi huu ilikuwa Shilingi Trilioni 1.76 za Uganda (takriban Dola za Marekani Milioni 476), ikijumuisha daraja refu la kinamasi cha Nambigirwa.',
          translationEn: 'The budget was UGX 1.76 Trillion (approx. USD 476 Million), including the 1.5km Nambigirwa swamp viaduct.',
          focusTerm: 'Dola Milioni 476',
          focusExplanation: 'One of the highest unit-cost expressway projects in East Africa.',
        },
        {
          text: 'Bunge la Uganda lilichunguza kwa kina gharama ya juu kwa kila kilomita, na barabara hii sasa inatozwa ada ya ushuru kwa kila gari.',
          translationEn: 'Uganda Parliament heavily probed its high unit cost per kilometer, and the road now operates as a toll road.',
        },
        {
          text: 'Ushauri wa kiraia: Fuatilia iwapo mapato ya ushuru yanalipa madeni ya taifa na iwapo ukarabati unafanyika kwa wakati.',
          translationEn: 'Civic advice: Monitor whether toll collections service the national loan and whether repairs are executed on time.',
        },
      ],
      civicTakeaway: 'Barabara ya ushuru yenye gharama ya juu; wananchi wafuatilie mapato na ulipaji wa madeni.',
    },
    luganda: {
      language: 'lg',
      languageName: 'Luganda',
      languageNativeName: 'Oluganda',
      title: "Okunnyonnyola kw'Oluguudo: Kampala–Entebbe Expressway",
      leadSpeaker: 'Empewo z’Ebyenguudo eza Civic Ledger',
      estimatedDurationSec: 50,
      sentences: [
        {
          text: 'Luno lwe lunnyonnyola ku luguudo olunene olw’akasambattuko olwa Kampala–Entebbe Expressway olwa kilomita 51 mu Uganda.',
          translationEn: 'This is the briefing on the 51-kilometer Kampala–Entebbe Expressway high-speed corridor in Uganda.',
        },
        {
          text: 'Oluguudo luno lwali luvunaanyizibwako UNRA, naye oluvannyuma lw’okuggyawo ekitongole ekyo mu Gwakkumi n’ebiri 2024, kati luli wansi wa Minisitule y’Emirimu n’Entambula (MoWT).',
          translationEn: 'This road was overseen by UNRA, but following its dissolution in December 2024, it is now directly under the Ministry of Works and Transport (MoWT).',
          focusTerm: 'Minisitule y’Emirimu (MoWT / ex-UNRA)',
          focusExplanation: 'Rationalization returned national roads directly under ministerial bureaucracy.',
        },
        {
          text: 'Zasaasaanyizibwako Shillingi za Uganda obutabalika 1.76, nga kye kimu ne Ddoola z’Amerika obukadde 476, omuli n’olutindo olwanvu olusala ettale ly’e Nambigirwa.',
          translationEn: 'Expenditure reached UGX 1.76 Trillion, equivalent to USD 476 Million, including the long viaduct traversing Nambigirwa swamp.',
          focusTerm: 'Ddoola obukadde 476',
          focusExplanation: 'Audited extensively by Parliamentary committees for its unit rate.',
        },
        {
          text: 'Palamenti ya Uganda yasaasaanya obudde bungi ng’ebuuza ku bbeeyi eno ey’ekimbe ku buli kilomita, era kati oluguudo luno lusasulirwa omusolo gw’okuluyitako.',
          translationEn: 'Uganda’s Parliament spent significant time interrogating this unit cost per kilometer, and motorists now pay toll fees to use it.',
        },
        {
          text: 'Okubuulirira eri omutuuze: Buli Munnayuganda alina okulondoola ensimbi z’omusolo gw’oku luguudo okulaba oba zisasula amabanja ag’ebweru n’okuddaabiriza ettale.',
          translationEn: 'Civic guidance: Every Ugandan should track toll receipts to verify they repay foreign debt and maintain the swamp bridges.',
        },
      ],
      civicTakeaway: 'Oluguudo lusasulirwa omusolo; abatuuze balondoola ensimbi ezikunganyizibwa n’okusasula ebbanja.',
    },
    english: {
      language: 'en',
      languageName: 'English',
      languageNativeName: 'English',
      title: 'Corridor Overview: Kampala–Entebbe Expressway (English for Luganda Corridor)',
      leadSpeaker: 'Uganda Audio Desk (English for Luganda Corridor)',
      estimatedDurationSec: 40,
      sentences: [
        {
          text: 'This is the civic briefing for Uganda’s 51-kilometer Kampala–Entebbe Expressway.',
          translationEn: 'This is the civic briefing for Uganda’s 51-kilometer Kampala–Entebbe Expressway.',
        },
        {
          text: 'Previously administered by UNRA, it is now managed directly by the Ministry of Works and Transport following RAPEX rationalization.',
          translationEn: 'Previously administered by UNRA, it is now managed directly by the Ministry of Works and Transport following RAPEX rationalization.',
          focusTerm: 'MoWT (ex-UNRA)',
          focusExplanation: 'Direct ministerial oversight.',
        },
        {
          text: 'Total project expenditure was USD 476 Million (UGX 1.76 Trillion), financed largely via an Exim Bank of China loan.',
          translationEn: 'Total project expenditure was USD 476 Million (UGX 1.76 Trillion), financed largely via an Exim Bank of China loan.',
        },
        {
          text: 'The road features 19 viaducts including the 1.5km Nambigirwa swamp bridge and operates on an electronic toll system.',
          translationEn: 'The road features 19 viaducts including the 1.5km Nambigirwa swamp bridge and operates on an electronic toll system.',
        },
        {
          text: 'Citizen watchdog role: Monitor toll revenues and debt repayment transparency through parliamentary oversight and the IGG.',
          translationEn: 'Citizen watchdog role: Monitor toll revenues and debt repayment transparency through parliamentary oversight and the IGG.',
        },
      ],
      civicTakeaway: 'High-cost toll highway; monitor revenue transparency and swamp infrastructure maintenance.',
    },
  },

  // UGANDA: Kampala City Roads Rehabilitation Project (KCRRP)
  'ug-kcca-rehab': {
    projectId: 'ug-kcca-rehab',
    roadName: 'Kampala City Roads Rehabilitation Project (KCRRP)',
    countryCode: 'UG',
    swahili: {
      language: 'sw',
      languageName: 'Kiswahili',
      languageNativeName: 'Kiswahili',
      title: 'Muhtasari wa Barabara: Miradi ya Barabara za Jiji la Kampala (KCRRP)',
      leadSpeaker: 'Dawati la Sauti la Civic Ledger',
      estimatedDurationSec: 44,
      sentences: [
        {
          text: 'Mradi wa KCRRP unahusu ukarabati na ujenzi mpya wa kilomita 29 za barabara kuu ndani ya jiji la Kampala.',
          translationEn: 'The KCRRP project involves the rehabilitation and dualing of 29 kilometers of major city roads in Kampala.',
        },
        {
          text: 'Mamlaka inayohusika ni KCCA, yaani Mamlaka ya Jiji Kuu la Kampala, ikishirikiana na Wizara ya Mambo ya Kampala.',
          translationEn: 'The responsible authority is KCCA, the Kampala Capital City Authority, working with the Ministry of Kampala.',
          focusTerm: 'KCCA (Jiji la Kampala)',
          focusExplanation: 'Metropolitan road authority managing city avenues, junctions, and drainage.',
        },
        {
          text: 'Bajeti ya mradi huu ni Shilingi Bilioni 288 za Uganda (takriban Dola za Marekani Milioni 78), kwa ufadhili wa Benki ya Maendeleo ya Afrika (AfDB).',
          translationEn: 'The project budget is UGX 288 Billion (approx. USD 78M), financed by the African Development Bank (AfDB).',
        },
        {
          text: 'Mradi unalenga kuondoa mashimo sugu ya barabarani, kuweka taa za sola za barabarani, na kujenga mifereji mipana ya kuzuia mafuriko.',
          translationEn: 'The project aims to eradicate chronic potholes, install solar street lighting, and construct covered storm canals to stop flooding.',
        },
        {
          text: 'Ushauri kwa raia: Wasiliana na madiwani na maofisa wa KCCA iwapo mkandarasi ameacha mashimo au mitaro wazi inayotishia maisha ya wakazi.',
          translationEn: 'Civic advice: Contact local councilors and KCCA if contractors leave open trenches endangering resident lives.',
        },
      ],
      civicTakeaway: 'Mradi wa KCCA kuondoa mashimo Kampala; wananchi wanapaswa kukagua ujenzi wa mitaro.',
    },
    luganda: {
      language: 'lg',
      languageName: 'Luganda',
      languageNativeName: 'Oluganda',
      title: "Okunnyonnyola kw'Oluguudo: Enteekateeka y'Enguudo z'ekibuga Kampala (KCRRP)",
      leadSpeaker: 'Empewo z’Ebyenguudo eza Civic Ledger',
      estimatedDurationSec: 48,
      sentences: [
        {
          text: 'Luno lwe lunnyonnyola ku nteekateeka y’okuddaabiriza enguudo z’ekibuga Kampala eza kilomita 29 ezimanyiddwa nga KCRRP.',
          translationEn: 'This is the briefing on the 29-kilometer Kampala City Roads Rehabilitation Project known as KCRRP.',
        },
        {
          text: 'Ekitongole ekivunaanyizibwa kye KCCA, nga bakolaganira wamu ne Minisitule evunaanyizibwa ku Kibuga Kampala.',
          translationEn: 'The agency responsible is KCCA, collaborating with the Ministry for Kampala Capital City.',
          focusTerm: 'KCCA (Ekitongole ky’Ekibuga Kampala)',
          focusExplanation: 'Capital City Authority in charge of urban pavements, streetlighting, and bypasses.',
        },
        {
          text: 'Ensimbi ezabikolako ziri Shilingi za Uganda obuwumbi 288, nga zino zaava mu bbanja lya Bbanka ya Afirika ey’Enkulaakulana (AfDB).',
          translationEn: 'The allocation is UGX 288 Billion, provided as an urban development loan by the African Development Bank (AfDB).',
          focusTerm: 'Ensimbi za AfDB',
          focusExplanation: 'Multilateral concessionary urban development loan.',
        },
        {
          text: 'Omulimu guno gweyongeddeyo okuggumiza amakubo agajjudde ebinnya, okuteekako amatala g’amasannyalaze g’enjuba, n’okuzimba ensalosalo z’amazzi aganjaala.',
          translationEn: 'This work focuses on paving potholed junctions, mounting solar streetlights, and building covered stormwater channels.',
        },
        {
          text: 'Okubuulirira eri abatuuze: Omutuuze yenna alina eddembe okubuuza KCCA ku bakozi abaleka ebinnya ebingi n’ensalosalo ezitali nzimbeko bikonkozo.',
          translationEn: 'Citizen advisory: Every resident has the right to query KCCA when contractors leave open trenches without pedestrian safety slabs.',
        },
      ],
      civicTakeaway: 'Emirimu gya KCCA gy’okuddaabiriza ebinnya; abatuuze beetegereze ensalosalo ezizimbibwa.',
    },
    english: {
      language: 'en',
      languageName: 'English',
      languageNativeName: 'English',
      title: 'Corridor Overview: Kampala City Roads (English for Luganda Corridor)',
      leadSpeaker: 'Uganda Audio Desk (English for Luganda Corridor)',
      estimatedDurationSec: 42,
      sentences: [
        {
          text: 'This briefing reviews the 29-kilometer Kampala City Roads Rehabilitation Project (KCRRP).',
          translationEn: 'This briefing reviews the 29-kilometer Kampala City Roads Rehabilitation Project (KCRRP).',
        },
        {
          text: 'The executing agency is KCCA under the supervision of the Ministry of Kampala and Metropolitan Affairs.',
          translationEn: 'The executing agency is KCCA under the supervision of the Ministry of Kampala and Metropolitan Affairs.',
          focusTerm: 'KCCA',
          focusExplanation: 'Kampala Capital City Authority.',
        },
        {
          text: 'Funded by an African Development Bank loan of UGX 288 Billion (approx. USD 78 Million).',
          translationEn: 'Funded by an African Development Bank loan of UGX 288 Billion (approx. USD 78 Million).',
        },
        {
          text: 'Focus areas include junction expansions, solar LED lighting, and large drainage culverts to prevent seasonal flooding.',
          translationEn: 'Focus areas include junction expansions, solar LED lighting, and large drainage culverts to prevent seasonal flooding.',
        },
        {
          text: 'Citizen action: Report open drainage excavations and prolonged contractor blockades directly to city division engineers.',
          translationEn: 'Citizen action: Report open drainage excavations and prolonged contractor blockades directly to city division engineers.',
        },
      ],
      civicTakeaway: 'AfDB-funded metropolitan overhaul; residents audit open trenches and street lighting.',
    },
  },

  // KENYA: Dongo Kundu Bypass
  'ke-dongo-kundu': {
    projectId: 'ke-dongo-kundu',
    roadName: 'Dongo Kundu Bypass (Mombasa Southern Bypass)',
    countryCode: 'KE',
    swahili: {
      language: 'sw',
      languageName: 'Kiswahili',
      languageNativeName: 'Kiswahili',
      title: 'Muhtasari wa Barabara: Dongo Kundu Bypass (Mombasa)',
      leadSpeaker: 'Dawati la Sauti la Civic Ledger',
      estimatedDurationSec: 43,
      sentences: [
        {
          text: 'Huu ni mradi wa kihistoria wa Dongo Kundu Bypass wenye urefu wa kilomita 18 katika Pwani ya Mombasa nchini Kenya.',
          translationEn: 'This is the historic 18-kilometer Dongo Kundu Bypass project in the Mombasa Coast of Kenya.',
        },
        {
          text: 'Mamlaka inayohusika ni KeNHA, ikisimamia ujenzi wa madaraja makubwa ya baharini ya Mwache na Mteza.',
          translationEn: 'The executing authority is KeNHA, managing the construction of the major Mwache and Mteza sea viaducts.',
          focusTerm: 'KeNHA Pwani',
          focusExplanation: 'Regional directorate overseeing coastal maritime highway structures.',
        },
        {
          text: 'Bajeti iliyotengwa ilikuwa Shilingi Bilioni 21 za Kenya, ikifadhiliwa kwa mkopo na Shirika la Ushirikiano la Kimataifa la Japani (JICA).',
          translationEn: 'The budget was KES 21 Billion, financed through a concessionary loan by the Japan International Cooperation Agency (JICA).',
        },
        {
          text: 'Barabara hii imesaidia sana wasafiri na wafanyabiashara kwa kuepuka msongamano mrefu wa vivuko vya feri vya Likoni.',
          translationEn: 'This road has greatly helped commuters and traders by bypassing the notorious delays at the Likoni ferry crossing.',
        },
        {
          text: 'Ushauri wa kiraia: Ni muhimu kulinda mikoko ya baharini na kufuatilia fidia za ardhi kwa wakazi walioathiriwa na mradi.',
          translationEn: 'Civic takeaway: It is critical to protect coastal mangroves and verify land compensation for project-affected residents.',
        },
      ],
      civicTakeaway: 'Madaraja ya baharini yaliyokamilika; kufuatilia usalama wa mazingira na fidia za wananchi.',
    },
    luganda: {
      language: 'lg',
      languageName: 'Luganda',
      languageNativeName: 'Oluganda',
      title: "Okunnyonnyola kw'Oluguudo: Dongo Kundu Bypass (Mombasa)",
      leadSpeaker: 'Empewo z’Ebyenguudo eza Civic Ledger',
      estimatedDurationSec: 46,
      sentences: [
        {
          text: 'Luno lwe lunnyonnyola ku luguudo olunene olw’e Dongo Kundu Bypass olwa kilomita 18 ku lubalama lw’ennyanja e Mombasa mu ggwanga lya Kenya.',
          translationEn: 'This is the briefing on the 18-kilometer Dongo Kundu Bypass coastal highway in Mombasa, Kenya.',
        },
        {
          text: 'Ekitongole ekivunaanyizibwa kye KeNHA, era oluguudo luno lulina amayiriro amanene agasala ennyanja ku Mwache ne Mteza.',
          translationEn: 'The statutory authority is KeNHA, and this corridor features major marine bridges crossing Mwache and Mteza creeks.',
          focusTerm: 'Amayiriro g’ennyanja (Sea viaducts)',
          focusExplanation: 'Complex marine civil engineering spanning sea creeks.',
        },
        {
          text: 'Zasaasaanyizibwako Siringi za Kenya obuwumbi 21, nga zaava mu bbanja lya JICA okuva mu ggwanga lya Buyapaani.',
          translationEn: 'Funding was KES 21 Billion, provided as a concessionary loan by JICA from Japan.',
        },
        {
          text: 'Oluguudo luno luyambye nnyo abasaabaze okwewala akalippagano ak’amaanyi ak’eryato ly’e Likoni ferry.',
          translationEn: 'This highway has relieved severe gridlocks by allowing traffic to bypass the congested Likoni ferry.',
        },
        {
          text: 'Amagezi eri abatuuze: Kikulu nnyo okulondoola eby’obutonde bw’ennyanja n’ensimbi ezaasasulwa abatuuze abaaliko ettaka eryakozesebwa.',
          translationEn: 'Citizen guidance: It is essential to monitor marine environmental conservation and land compensation for local displaced families.',
        },
      ],
      civicTakeaway: 'Oluguudo lw’ennyanja lwamalirizibwa; okulondoola obutonde n’ensimbi z’okuliyirira.',
    },
    english: {
      language: 'en',
      languageName: 'English',
      languageNativeName: 'English',
      title: 'Corridor Overview: Dongo Kundu Bypass (Mombasa)',
      leadSpeaker: 'Civic Ledger Audio Desk',
      estimatedDurationSec: 40,
      sentences: [
        {
          text: 'This briefing details the 18-kilometer Dongo Kundu Bypass in coastal Mombasa, Kenya.',
          translationEn: 'This briefing details the 18-kilometer Dongo Kundu Bypass in coastal Mombasa, Kenya.',
        },
        {
          text: 'Managed by KeNHA, the project features complex sea bridges across Mwache and Mteza creeks.',
          translationEn: 'Managed by KeNHA, the project features complex sea bridges across Mwache and Mteza creeks.',
          focusTerm: 'KeNHA Coastal',
          focusExplanation: 'National highways authority.',
        },
        {
          text: 'Budgeted at KES 21 Billion, funded through a low-interest concessionary loan from JICA (Japan).',
          translationEn: 'Budgeted at KES 21 Billion, funded through a low-interest concessionary loan from JICA (Japan).',
        },
        {
          text: 'The road connects Mombasa mainland west directly to the South Coast, bypassing the Likoni ferry.',
          translationEn: 'The road connects Mombasa mainland west directly to the South Coast, bypassing the Likoni ferry.',
        },
        {
          text: 'Civic oversight: Verify environmental restoration of mangrove zones and final resettlement disbursements.',
          translationEn: 'Civic oversight: Verify environmental restoration of mangrove zones and final resettlement disbursements.',
        },
      ],
      civicTakeaway: 'Completed coastal link; verify mangrove ecology protection and resettlement transparency.',
    },
  },

  // NIGERIA: Lagos–Ibadan Expressway
  'ng-lagos-ibadan': {
    projectId: 'ng-lagos-ibadan',
    roadName: 'Lagos–Ibadan Expressway',
    countryCode: 'NG',
    swahili: {
      language: 'sw',
      languageName: 'Kiswahili',
      languageNativeName: 'Kiswahili',
      title: 'Muhtasari wa Barabara: Lagos–Ibadan Expressway (Nigeria)',
      leadSpeaker: 'Dawati la Sauti la Civic Ledger',
      estimatedDurationSec: 45,
      sentences: [
        {
          text: 'Huu ni muhtasari wa barabara kuu ya Lagos kuelekea Ibadan nchini Nigeria yenye urefu wa kilomita 127.6.',
          translationEn: 'This is the overview of the 127.6-kilometer Lagos–Ibadan Expressway in Nigeria.',
        },
        {
          text: 'Mamlaka inayohusika ni Wizara ya Kazi ya Shirikisho (Federal Ministry of Works) ikishirikiana na FERMA.',
          translationEn: 'The responsible authority is the Federal Ministry of Works alongside FERMA.',
          focusTerm: 'Wizara ya Shirikisho (Federal Ministry)',
          focusExplanation: 'Federal authority overseeing inter-state trunk corridors.',
        },
        {
          text: 'Bajeti iliyotengwa imezidi Naira Bilioni 311 kupitia Mfuko wa Maendeleo ya Miundombinu ya Rais (PIDF).',
          translationEn: 'Appropriations exceeded 311 Billion Naira channeled through the Presidential Infrastructure Development Fund (PIDF).',
        },
        {
          text: 'Ingawa ilipaswa kukamilika miaka kadhaa iliyopita, mradi huu umekumbwa na ucheleweshaji wa zaidi ya muongo mmoja kutokana na ukosefu wa fedha na marekebisho ya usanifu.',
          translationEn: 'Although slated for earlier delivery, this project suffered over a decade of delays due to funding disruptions and design changes.',
        },
        {
          text: 'Ushauri kwa raia: Wananchi wanapaswa kudai uwazi kupitia Tume ya Malalamiko ya Umma (PCC) ili kusitisha hasara za kiuchumi kwa wasafiri.',
          translationEn: 'Civic takeaway: Citizens should demand accountability via the Public Complaints Commission (PCC) to halt economic losses for commuters.',
        },
      ],
      civicTakeaway: 'Barabara kuu ya kiuchumi iliyocheleweshwa; raia wafuatilie uwajibikaji kupitia Ombudsman PCC.',
    },
    luganda: {
      language: 'lg',
      languageName: 'Luganda',
      languageNativeName: 'Oluganda',
      title: "Okunnyonnyola kw'Oluguudo: Lagos–Ibadan Expressway (Nigeria)",
      leadSpeaker: 'Empewo z’Ebyenguudo eza Civic Ledger',
      estimatedDurationSec: 48,
      sentences: [
        {
          text: 'Luno lwe lunnyonnyola ku luguudo olunene olwa Lagos okutuuka e Ibadan mu ggwanga lya Nigeria olwa kilomita 127.6.',
          translationEn: 'This is the briefing on the 127.6-kilometer Lagos–Ibadan Expressway in Nigeria.',
        },
        {
          text: 'Ekitongole ekivunaanyizibwa kye Minisitule y’Emirimu ey’Ettwale lyonna erya Nigeria (Federal Ministry of Works) wamu ne FERMA.',
          translationEn: 'The body responsible is the Federal Ministry of Works alongside FERMA.',
          focusTerm: 'Federal Ministry of Works',
          focusExplanation: 'Central ministry managing federal highways across 36 states.',
        },
        {
          text: 'Ensimbi ezasaasaanyizibwa zaasuka mu Naira obuwumbi 311 nga zava mu nteekateeka y’Obwapulezidenti ey’Enkulaakulana (PIDF).',
          translationEn: 'Appropriations exceeded 311 Billion Naira funded through the Presidential Infrastructure Development Fund.',
        },
        {
          text: 'Wabula oluguudo luno lwalwayo nnyo emyaka egisukka mu kkumi nga lulekeddwa olw’ensimbi obutawerera n’enkyukakyuka ez’emirundi emingi.',
          translationEn: 'However, this road experienced severe delays exceeding 10 years due to irregular cash flows and redesigns.',
        },
        {
          text: 'Okubuulirira eri abatuuze: Abatambuze n’abatuuze basaanidde okutwala okwemulugunya kwabwe mu kitongole ky’Ombudsman (PCC) okulaba nti emirimu gimalirizibwa.',
          translationEn: 'Civic advice: Commuters should lodge formal grievances with the Public Complaints Commission (PCC) to demand prompt completion.',
        },
      ],
      civicTakeaway: 'Oluguudo olwalwawo ennyo; abatuuze beetegereze ensonga z’okulwawo basindike okwemulugunya mu PCC.',
    },
    english: {
      language: 'en',
      languageName: 'English',
      languageNativeName: 'English',
      title: 'Corridor Overview: Lagos–Ibadan Expressway (Nigeria)',
      leadSpeaker: 'Civic Ledger Audio Desk',
      estimatedDurationSec: 42,
      sentences: [
        {
          text: 'This is the briefing on Nigeria’s critical 127.6-kilometer Lagos–Ibadan freight artery.',
          translationEn: 'This is the briefing on Nigeria’s critical 127.6-kilometer Lagos–Ibadan freight artery.',
        },
        {
          text: 'Overseen by the Federal Ministry of Works and FERMA, executed by Julius Berger and RCC.',
          translationEn: 'Overseen by the Federal Ministry of Works and FERMA, executed by Julius Berger and RCC.',
          focusTerm: 'Federal Ministry of Works',
          focusExplanation: 'Federal highway authority.',
        },
        {
          text: 'Revised appropriations exceeded 311 Billion Naira under the Presidential Infrastructure Development Fund.',
          translationEn: 'Revised appropriations exceeded 311 Billion Naira under the Presidential Infrastructure Development Fund.',
        },
        {
          text: 'Despite being vital for national commerce, it has suffered over a decade of delays and revisions.',
          translationEn: 'Despite being vital for national commerce, it has suffered over a decade of delays and revisions.',
        },
        {
          text: 'Citizen action: File inquiries on contract timelines with the Public Complaints Commission (PCC).',
          translationEn: 'Citizen action: File inquiries on contract timelines with the Public Complaints Commission (PCC).',
        },
      ],
      civicTakeaway: 'Historic freight corridor delayed over 10 years; demand accountability via PCC.',
    },
  },
};

// Procedural dynamic generator for any custom or non-seed road project
export function generateAudioPackageForProject(project: RoadProject, country: CountryInfo): RoadAudioPackage {
  const existing = SEED_AUDIO_PACKAGES[project.id];
  if (existing) {
    return existing;
  }

  const authority = country.authorities[project.roadClass];
  const ombudsman = country.complaintsBody;

  // Status mapping in Swahili & Luganda
  const statusSwahili =
    project.status === 'completed'
      ? 'imekamilika na inatumiwa na magari'
      : project.status === 'under_construction'
      ? 'iko katika hatua ya ujenzi na uchimbaji'
      : project.status === 'delayed'
      ? 'imechelewa kupita muda uliopangwa kisheria'
      : 'imesitishwa na kazi zimesimama ardhini';

  const statusLuganda =
    project.status === 'completed'
      ? 'yamaliriziddwa era ekozesebwa ebidduka'
      : project.status === 'under_construction'
      ? 'ekyazimbirwako mu kiseera kino'
      : project.status === 'delayed'
      ? 'eriko obuzibu bw’okulwawo okusukka ku budde obwali bwapangibwa'
      : 'yayimiriziddwa era tewali bakozi ku kisaawe';

  // Swahili sentences
  const swahiliSentences = [
    {
      text: `Huu ni muhtasari wa sauti wa barabara ya ${project.name} nchini ${country.name} yenye urefu wa kilomita ${project.lengthKm}.`,
      translationEn: `This is the audio overview of the ${project.name} road in ${country.name} spanning ${project.lengthKm} kilometers.`,
    },
    {
      text: `Mamlaka inayohusika kisheria kusimamia mradi huu ni ${authority.name} (${authority.code}), yenye jukumu la ${authority.mandate}.`,
      translationEn: `The statutory authority legally responsible for this project is ${authority.name} (${authority.code}), mandated to ${authority.mandate}.`,
      focusTerm: authority.code,
      focusExplanation: `Mamlaka husika nchini ${country.name}.`,
    },
    {
      text: `Bajeti iliyotangazwa ni ${project.budgetDisplay}, na chanzo cha fedha kikiwa ni ${project.fundingSource}.`,
      translationEn: `The reported budget is ${project.budgetDisplay}, financed via ${project.fundingSource}.`,
    },
    {
      text: `Hali ya sasa ardhini inaonyesha kuwa barabara hii ${statusSwahili}. ${project.statusNotes || ''}`,
      translationEn: `Current ground status indicates that this road is ${project.status}. ${project.statusNotes || ''}`,
    },
    {
      text: `Kama mwananchi, una haki ya kikatiba ya kuona barabara safi. Ukiona mapungufu, unaweza kuripoti kwa ${ombudsman.shortName}.`,
      translationEn: `As a citizen, you hold a constitutional right to quality roads. If you notice defects, report to ${ombudsman.shortName}.`,
      focusTerm: ombudsman.shortName,
      focusExplanation: 'Ofisi ya Ombudsman inayopokea malalamiko ya wananchi bila malipo.',
    },
  ];

  // Luganda sentences
  const lugandaSentences = [
    {
      text: `Luno lwe lunnyonnyola lw’eddoboozi ku luguudo lwa ${project.name} mu ggwanga lya ${country.name} olwa kilomita ${project.lengthKm}.`,
      translationEn: `This is the audio briefing for the ${project.name} road in ${country.name} spanning ${project.lengthKm} kilometers.`,
    },
    {
      text: `Ekitongole ekivunaanyizibwa mu mateeka kye ${authority.name} (${authority.code}), era obuvunaanyizibwa bwabwe bwe buno: ${authority.mandate}.`,
      translationEn: `The statutory body responsible by law is ${authority.name} (${authority.code}), mandated for: ${authority.mandate}.`,
      focusTerm: authority.code,
      focusExplanation: `Ekitongole ekivunaanyizibwa ku nguudo zino mu ${country.name}.`,
    },
    {
      text: `Ensimbi ezaabalirirwa ziri ${project.budgetDisplay}, nga zava mu nsonga zino: ${project.fundingSource}.`,
      translationEn: `The budgeted funds are ${project.budgetDisplay}, derived from: ${project.fundingSource}.`,
    },
    {
      text: `Embeera y'oluguudo ku ttaka mu kiseera kino eraga nti ${statusLuganda}. ${project.statusNotes || ''}`,
      translationEn: `Ground status currently indicates that the road is ${project.status}. ${project.statusNotes || ''}`,
    },
    {
      text: `Buli mutuuze alina eddembe okufuna enguudo ennungi olw’omusolo gwe. Singa olaba obulagajjavu, tuukirira ${ombudsman.shortName}.`,
      translationEn: `Every resident has the right to quality public roads for their tax. If you spot neglect, reach out to ${ombudsman.shortName}.`,
      focusTerm: ombudsman.shortName,
      focusExplanation: 'Ekitongole ky’Ombudsman ekikola ku kwemulugunya kw’abatuuze ku bwereere.',
    },
  ];

  // English sentences
  const englishSentences = [
    {
      text: `This is the audio overview for the ${project.name} corridor in ${country.name}, measuring ${project.lengthKm} kilometers.`,
      translationEn: `This is the audio overview for the ${project.name} corridor in ${country.name}, measuring ${project.lengthKm} kilometers.`,
    },
    {
      text: `The designated statutory road authority is ${authority.name} (${authority.code}).`,
      translationEn: `The designated statutory road authority is ${authority.name} (${authority.code}).`,
      focusTerm: authority.code,
      focusExplanation: 'Statutory executing agency.',
    },
    {
      text: `Reported project capital expenditure is ${project.budgetDisplay}, funded by ${project.fundingSource}.`,
      translationEn: `Reported project capital expenditure is ${project.budgetDisplay}, funded by ${project.fundingSource}.`,
    },
    {
      text: `Official execution status: ${project.status.toUpperCase().replace('_', ' ')}. ${project.statusNotes || ''}`,
      translationEn: `Official execution status: ${project.status.toUpperCase().replace('_', ' ')}. ${project.statusNotes || ''}`,
    },
    {
      text: `Constitutional redress: If ground reality does not match public expenditure, submit a petition to ${ombudsman.name}.`,
      translationEn: `Constitutional redress: If ground reality does not match public expenditure, submit a petition to ${ombudsman.name}.`,
      focusTerm: ombudsman.shortName,
      focusExplanation: 'Constitutional Ombudsman.',
    },
  ];

  return {
    projectId: project.id,
    roadName: project.name,
    countryCode: project.countryCode,
    swahili: {
      language: 'sw',
      languageName: 'Kiswahili',
      languageNativeName: 'Kiswahili',
      title: `Muhtasari wa Barabara: ${project.name}`,
      leadSpeaker: project.countryCode === 'KE' ? 'Dawati la Sauti la Kenya (Kiswahili)' : 'Dawati la Sauti la Civic Ledger',
      estimatedDurationSec: 42,
      sentences: swahiliSentences,
      civicTakeaway: `Uangalizi wa kiraia kwa ${project.name}: fuatilia uwajibikaji wa ${authority.code}.`,
    },
    luganda: {
      language: 'lg',
      languageName: 'Luganda',
      languageNativeName: 'Oluganda',
      title: `Okunnyonnyola kw'Oluguudo: ${project.name}`,
      leadSpeaker: 'Empewo z’Ebyenguudo eza Uganda (Civic Ledger)',
      estimatedDurationSec: 45,
      sentences: lugandaSentences,
      civicTakeaway: `Okulondoola kw'abatuuze ku ${project.name}: weetegereze emirimu gya ${authority.code}.`,
    },
    english: {
      language: 'en',
      languageName: 'English',
      languageNativeName: 'English',
      title: project.countryCode === 'UG'
        ? `Corridor Overview: ${project.name} (English for Luganda Corridor)`
        : `Corridor Overview: ${project.name}`,
      leadSpeaker: project.countryCode === 'UG'
        ? 'Uganda Audio Desk (English for Luganda Corridor)'
        : project.countryCode === 'KE'
        ? 'Kenya Civic Audio Desk (English Reference)'
        : 'Civic Ledger Audio Desk',
      estimatedDurationSec: 38,
      sentences: englishSentences,
      civicTakeaway: `Civic accountability for ${project.name}: inspect delivery by ${authority.code}.`,
    },
  };
}
