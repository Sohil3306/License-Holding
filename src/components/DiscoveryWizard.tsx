import React, { useState } from 'react';
import { ApplicantType, LicenceRecord } from '../types/licence';
import { INDIAN_STATES } from '../data/indianStates';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  ExternalLink,
  ShieldCheck,
  Building2,
  FileCheck2
} from 'lucide-react';

interface DiscoveryWizardProps {
  licences: LicenceRecord[];
  onSelectLicence: (licence: LicenceRecord) => void;
  onOpenAI: () => void;
}

interface RecommendationItem {
  licence: LicenceRecord;
  tier: 'Mandatory' | 'Conditional' | 'Recommended';
  reason: string;
  actionNeeded: string;
}

export const DiscoveryWizard: React.FC<DiscoveryWizardProps> = ({
  licences,
  onSelectLicence,
  onOpenAI,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // User state
  const [applicantType, setApplicantType] = useState<ApplicantType>('Sole Proprietorship');
  const [activitySector, setActivitySector] = useState<string>('food-hospitality');
  const [specificDetails, setSpecificDetails] = useState<string>('Dine-in restaurant & takeaway');
  const [stateCode, setStateCode] = useState<string>('KA');
  const [cityName, setCityName] = useState<string>('Bengaluru');
  const [applicationKind, setApplicationKind] = useState<'New' | 'Renewal' | 'Modification'>('New');
  const [turnoverScale, setTurnoverScale] = useState<string>('12L-to-1Cr');
  const [hasGST, setHasGST] = useState<boolean>(false);
  const [hasUdyam, setHasUdyam] = useState<boolean>(false);

  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const totalSteps = 6;

  // Sectors list covering all 12 Pan-India categories
  const sectors = [
    { id: 'driving-personal', title: 'Driving, Vehicle RC & Transport', desc: 'Learner/Permanent DL, RC transfer, fitness, commercial permits.' },
    { id: 'citizen-certificates', title: 'Citizen Certificates & Personal IDs', desc: 'Birth/death, marriage, caste, income, domicile, EWS, PCC, passport, Aadhaar.' },
    { id: 'food-hospitality', title: 'Food, Restaurant & Cloud Kitchen', desc: 'FSSAI Basic/State/Central, Eating House, Fire NOC, catering, excise.' },
    { id: 'retail-trade', title: 'Retail Shop, Trading & Wholesale', desc: 'Commercial shops, Shops Act, trade licence, legal metrology, GST.' },
    { id: 'tech-services', title: 'IT, Startups & Professional Services', desc: 'Software firms, Pvt Ltd/LLP/OPC, Startup India, Trademark, EPFO/ESIC.' },
    { id: 'manufacturing', title: 'Factory, Industry & Environment', desc: 'Factory licence & plan approval, SPCB CTE/CTO, waste & EPR, boilers.' },
    { id: 'healthcare', title: 'Hospital, Clinic, Lab & Pharmacy', desc: 'Clinical establishment, nursing home, retail/wholesale drug licence, AYUSH.' },
    { id: 'education', title: 'Schools, Coaching, Daycare & Hostels', desc: 'School recognition, coaching centres, preschools, ITI, hostels.' },
    { id: 'construction', title: 'Construction, RERA & Real Estate', desc: 'RERA project/agent, building plan approval, OC, land use, borewell.' },
    { id: 'import-export', title: 'Import, Export, Warehousing & PESO', desc: 'IEC, RCMC, warehouses, cold storage, PESO petroleum & gas storage.' },
    { id: 'tourism', title: 'Tourism, Hotels, Events & Cinema', desc: 'Homestays, tour operators, event/film permissions, cinema & amusement.' },
    { id: 'agriculture', title: 'Agriculture, Seeds, Dairy & APMC', desc: 'Seed/fertiliser/pesticide dealer, dairy, poultry, livestock, APMC mandi.' },
    { id: 'security-ip', title: 'Security Agencies, Metrology & IP', desc: 'PSARA security agency, electrical contractor, weights, copyright & patents.' },
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setIsCompleted(false);
  };

  // Generate tailored recommendations across all 141 Pan-India services
  const getRecommendations = (): RecommendationItem[] => {
    const list: RecommendationItem[] = [];

    const findLicence = (idOrSlug: string) =>
      licences.find((l) => l.id === idOrSlug || l.slug === idOrSlug);

    if (activitySector === 'driving-personal') {
      const llr = findLicence('learners-driving-licence');
      const dl = findLicence('permanent-driving-licence');
      const renewal = findLicence('driving-licence-renewal');
      const idp = findLicence('international-driving-permit');
      if (applicationKind === 'New') {
        if (llr) {
          list.push({
            licence: llr,
            tier: 'Mandatory',
            reason: 'Mandatory initial step before practical test in India. Must hold for at least 30 days.',
            actionNeeded: 'Apply online on Parivahan Sarathi with Aadhaar e-KYC.'
          });
        }
        if (dl) {
          list.push({
            licence: dl,
            tier: 'Mandatory',
            reason: 'Permanent authorisation to drive independently once LLR completes 30 days.',
            actionNeeded: 'Book driving track test slot on Parivahan Sarathi.'
          });
        }
        if (idp) {
          list.push({
            licence: idp,
            tier: 'Recommended',
            reason: 'Optional 1-year international permit if you plan to drive abroad with your Indian DL.',
            actionNeeded: 'Apply via Form 4A on Parivahan Sarathi with valid passport & visa.'
          });
        }
      } else if (applicationKind === 'Renewal') {
        if (renewal) {
          list.push({
            licence: renewal,
            tier: 'Mandatory',
            reason: 'DL validity renewal required within 1 year before or after expiry.',
            actionNeeded: 'Submit Form 9 and Form 1A (if 40+) on Parivahan Sarathi.'
          });
        }
      } else {
        const addr = findLicence('driving-licence-address-change');
        if (addr) {
          list.push({
            licence: addr,
            tier: 'Mandatory',
            reason: 'Update residential address or endorse additional vehicle class on your existing DL.',
            actionNeeded: 'Submit address/endorsement application on Parivahan Sarathi.'
          });
        }
      }
      return list;
    }

    if (activitySector === 'citizen-certificates') {
      const picks = [
        {
          id: 'birth-certificate',
          tier: 'Mandatory' as const,
          reason: 'Primary statutory record of identity and age issued under the RBD Act.',
          actionNeeded: 'Verify hospital CRS entry or apply via municipal registrar / e-District.'
        },
        {
          id: 'income-certificate',
          tier: 'Conditional' as const,
          reason: 'Required for scholarships, fee waivers, EWS eligibility, and state welfare schemes.',
          actionNeeded: 'Apply via state e-District portal with salary/income proof and Aadhaar.'
        },
        {
          id: 'domicile-certificate',
          tier: 'Conditional' as const,
          reason: 'Establishes state residence status for state quota admissions and public employment.',
          actionNeeded: 'Submit continuous residence proofs on state e-District / Revenue portal.'
        },
        {
          id: 'police-clearance-certificate',
          tier: 'Recommended' as const,
          reason: 'Essential for overseas employment, emigration, or background-verified roles.',
          actionNeeded: 'Schedule PCC appointment via Passport Seva or state police citizen portal.'
        },
        {
          id: 'passport-assistance',
          tier: 'Recommended' as const,
          reason: 'Official travel and citizenship document issued via Passport Seva Kendra.',
          actionNeeded: 'Submit online form on passportindia.gov.in and book PSK biometric slot.'
        }
      ];
      for (const p of picks) {
        const lic = findLicence(p.id);
        if (lic) list.push({ licence: lic, tier: p.tier, reason: p.reason, actionNeeded: p.actionNeeded });
      }
      return list;
    }

    // Food & Hospitality
    if (activitySector === 'food-hospitality') {
      if (turnoverScale === 'under-12L') {
        const fssaiBasic = findLicence('fssai-basic-registration');
        if (fssaiBasic) {
          list.push({
            licence: fssaiBasic,
            tier: 'Mandatory',
            reason: 'Mandatory 14-digit registration for petty food vendors & small cloud kitchens with turnover up to ₹12 Lakh/yr.',
            actionNeeded: 'File Form A on foscos.fssai.gov.in (₹100/yr).'
          });
        }
      } else if (turnoverScale === 'above-20Cr') {
        const fssaiCentral = findLicence('fssai-central-licence');
        if (fssaiCentral) {
          list.push({
            licence: fssaiCentral,
            tier: 'Mandatory',
            reason: 'Mandatory central licence for food operators with turnover above ₹20 Crore or multi-state chains.',
            actionNeeded: 'File Form B on FoSCoS under Central licensing authority.'
          });
        }
      } else {
        const fssaiState = findLicence('fssai-state-licence');
        if (fssaiState) {
          list.push({
            licence: fssaiState,
            tier: 'Mandatory',
            reason: 'Mandatory state licence for restaurants & commercial kitchens with turnover between ₹12 Lakh and ₹20 Crore.',
            actionNeeded: 'File Form B on FoSCoS; get water potability tested at a NABL lab.'
          });
        }
      }

      const eatingHouse = findLicence('restaurant-eating-house-licence');
      if (eatingHouse) {
        list.push({
          licence: eatingHouse,
          tier: 'Conditional',
          reason: `Police Eating House / Public Place permission applicable for dine-in restaurants in metro cities like ${cityName}.`,
          actionNeeded: 'Apply on State Police Licensing portal after FSSAI and Fire NOC.'
        });
      }

      const trade = findLicence('municipal-trade-licence');
      if (trade) {
        list.push({
          licence: trade,
          tier: 'Mandatory',
          reason: `Mandatory municipal permission to operate food service premises in ${cityName} corporation limits.`,
          actionNeeded: 'Apply on city corporation portal with property tax PID and rental lease.'
        });
      }

      const shop = findLicence('shop-and-establishment-registration');
      if (shop) {
        list.push({
          licence: shop,
          tier: 'Mandatory',
          reason: 'State labour department registration regulating restaurant staff hours and working days.',
          actionNeeded: 'Register on state labour portal.'
        });
      }

      const fire = findLicence('fire-safety-noc');
      if (fire) {
        list.push({
          licence: fire,
          tier: (turnoverScale === '1Cr-to-20Cr' || turnoverScale === 'above-20Cr') ? 'Mandatory' : 'Conditional',
          reason: 'Mandatory for dine-in eateries above seating/floor area thresholds (varies by state fire rules).',
          actionNeeded: 'Submit floor plans and fire safety equipment details to Fire & Emergency Services.'
        });
      }
    }

    // Retail or Tech Services
    if (activitySector === 'retail-trade' || activitySector === 'tech-services') {
      const shop = findLicence('shop-and-establishment-registration');
      if (shop) {
        list.push({
          licence: shop,
          tier: 'Mandatory',
          reason: 'Statutory proof of business premises and operational commencement needed for commercial operations and current bank account.',
          actionNeeded: 'Apply on state labour portal within 30 days of opening.'
        });
      }

      if (activitySector === 'retail-trade') {
        const trade = findLicence('municipal-trade-licence');
        if (trade) {
          list.push({
            licence: trade,
            tier: 'Mandatory',
            reason: `Municipal clearance for physical retail store inside ${cityName} corporation.`,
            actionNeeded: 'Submit property tax receipt and lease agreement to municipal ward.'
          });
        }
        const weights = findLicence('weights-measures-licence');
        if (weights) {
          list.push({
            licence: weights,
            tier: 'Conditional',
            reason: 'Required if retail shop uses weighing scales or sells pre-packaged retail commodities.',
            actionNeeded: 'Verify and stamp weighing instruments via State Legal Metrology.'
          });
        }
      } else {
        const startup = findLicence('startup-india-recognition');
        if (startup) {
          list.push({
            licence: startup,
            tier: 'Recommended',
            reason: 'DPIIT recognition unlocks angel tax/income tax benefits, fast-track IPR rebates, and public procurement exemptions.',
            actionNeeded: 'Apply online at startupindia.gov.in (for Pvt Ltd / LLP / Partnership).'
          });
        }
        const tm = findLicence('trademark-registration');
        if (tm) {
          list.push({
            licence: tm,
            tier: 'Recommended',
            reason: 'Protects your brand name, logo, and software/service identity across India.',
            actionNeeded: 'File Form TM-A on ipindiaonline.gov.in (50% fee discount with Udyam).'
          });
        }
      }
    }

    // Manufacturing / Factory
    if (activitySector === 'manufacturing') {
      const factoryPlan = findLicence('factory-plan-approval');
      if (factoryPlan) {
        list.push({
          licence: factoryPlan,
          tier: 'Mandatory',
          reason: 'Mandatory prior building layout approval before constructing or installing a factory.',
          actionNeeded: 'Submit structural and machinery plans to State DISH / Chief Inspector of Factories.'
        });
      }
      const factory = findLicence('factory-licence');
      if (factory) {
        list.push({
          licence: factory,
          tier: 'Mandatory',
          reason: 'Mandatory under Factories Act, 1948 for manufacturing units employing 10+ workers with power (20+ without power).',
          actionNeeded: 'Apply for factory registration & operating licence on state labour/DISH portal.'
        });
      }
      const cte = findLicence('pollution-control-board-cte');
      if (cte) {
        list.push({
          licence: cte,
          tier: 'Mandatory',
          reason: 'Prior Consent to Establish (CTE) under Water/Air Acts before commencing plant setup.',
          actionNeeded: 'Apply on state SPCB / OCMMS portal under White/Green/Orange/Red category.'
        });
      }
      const cto = findLicence('pollution-control-board-cto');
      if (cto) {
        list.push({
          licence: cto,
          tier: 'Mandatory',
          reason: 'Consent to Operate (CTO) required before starting commercial manufacturing production.',
          actionNeeded: 'Apply on state SPCB portal once pollution control equipment is installed.'
        });
      }
      const fire = findLicence('fire-safety-noc');
      if (fire) {
        list.push({
          licence: fire,
          tier: 'Mandatory',
          reason: 'Industrial fire prevention and hazardous material life-safety clearance.',
          actionNeeded: 'Install compliant fire suppression systems and request inspection.'
        });
      }
    }

    // Healthcare
    if (activitySector === 'healthcare') {
      const cea = findLicence('clinical-establishment-registration');
      if (cea) {
        list.push({
          licence: cea,
          tier: 'Mandatory',
          reason: 'Mandatory health establishment registration for clinics, hospitals, and diagnostic centres.',
          actionNeeded: 'Register on State Clinical Establishment / KPME / Health Department portal.'
        });
      }
      const drug = findLicence('retail-drug-licence');
      if (drug) {
        list.push({
          licence: drug,
          tier: 'Conditional',
          reason: 'Mandatory Form 20/21 permit if dispensing or retailing allopathic medicines with a Registered Pharmacist.',
          actionNeeded: 'Submit Form 19 on state drugs portal with pharmacist credentials and refrigerator invoice.'
        });
      }
      const bmw = findLicence('biomedical-waste-authorisation');
      if (bmw) {
        list.push({
          licence: bmw,
          tier: 'Mandatory',
          reason: 'Mandatory SPCB Bio-Medical Waste tie-up and authorisation for clinics, labs, and hospitals.',
          actionNeeded: 'Sign CBWTF agreement and apply on state SPCB portal.'
        });
      }
    }

    // Education & Training
    if (activitySector === 'education') {
      const school = findLicence('school-recognition');
      const coaching = findLicence('coaching-centre-registration');
      const fire = findLicence('fire-safety-noc');
      if (school) {
        list.push({
          licence: school,
          tier: 'Conditional',
          reason: 'Mandatory state education recognition under RTE Act for K-12 schools.',
          actionNeeded: 'Apply via State School Education Portal with trust deed, land docs, and safety NOCs.'
        });
      }
      if (coaching) {
        list.push({
          licence: coaching,
          tier: 'Mandatory',
          reason: 'Registration & compliance under state coaching rules and MoE guidelines for coaching centres.',
          actionNeeded: 'Register on State Higher/Secondary Education portal with facility & fire safety compliance.'
        });
      }
      if (fire) {
        list.push({
          licence: fire,
          tier: 'Mandatory',
          reason: 'Mandatory Fire & Building Safety NOC for educational buildings and hostels.',
          actionNeeded: 'Obtain Fire Safety NOC from State Fire Services.'
        });
      }
    }

    // Construction & Real Estate
    if (activitySector === 'construction') {
      const reraProj = findLicence('rera-project-registration');
      const bpa = findLicence('building-plan-approval');
      const oc = findLicence('occupancy-certificate');
      if (bpa) {
        list.push({
          licence: bpa,
          tier: 'Mandatory',
          reason: `Sanction of architectural plans from ${cityName} municipal/planning authority before excavation or construction.`,
          actionNeeded: 'Submit licensed architect drawings on Municipal / Urban Development OBPS portal.'
        });
      }
      if (reraProj) {
        list.push({
          licence: reraProj,
          tier: 'Mandatory',
          reason: 'Mandatory under RERA Act, 2016 before advertising or selling projects exceeding 500 sq.m. or 8 apartments.',
          actionNeeded: 'Register project on State RERA portal with sanctioned plan & 70% escrow details.'
        });
      }
      if (oc) {
        list.push({
          licence: oc,
          tier: 'Mandatory',
          reason: 'Occupancy Certificate required post-construction before handing over units or obtaining permanent utilities.',
          actionNeeded: 'Apply with Completion Certificate, Fire NOC, and Lift NOC.'
        });
      }
    }

    // Import, Export & Logistics
    if (activitySector === 'import-export') {
      const iec = findLicence('import-export-code-logistics') || findLicence('import-export-code');
      const rcmc = findLicence('export-promotion-council-rcmc');
      const wh = findLicence('warehouse-licence');
      const peso = findLicence('peso-licence');
      if (iec) {
        list.push({
          licence: iec,
          tier: 'Mandatory',
          reason: '10-digit DGFT code mandatory to clear shipments through Indian Customs and receive foreign forex remittances.',
          actionNeeded: 'Apply on dgft.gov.in (₹500 one-time fee).'
        });
      }
      if (rcmc) {
        list.push({
          licence: rcmc,
          tier: 'Recommended',
          reason: 'Registration-Cum-Membership Certificate needed to claim Foreign Trade Policy benefits and export incentives.',
          actionNeeded: 'Apply via DGFT common e-RCMC portal for your Export Promotion Council.'
        });
      }
      if (wh) {
        list.push({
          licence: wh,
          tier: 'Conditional',
          reason: 'Required if operating commercial warehousing, bonded storage, or WDRA-registered godowns.',
          actionNeeded: 'Apply with State Warehousing / WDRA or Municipal authority as applicable.'
        });
      }
      if (peso) {
        list.push({
          licence: peso,
          tier: 'Conditional',
          reason: 'Mandatory for storing or handling petroleum, compressed gas cylinders, or hazardous flammables.',
          actionNeeded: 'Submit site safety layout to PESO (peso.gov.in).'
        });
      }
    }

    // Tourism & Entertainment
    if (activitySector === 'tourism') {
      const hotel = findLicence('hotel-homestay-registration');
      const tour = findLicence('tour-operator-recognition');
      const ev = findLicence('event-permission');
      if (hotel) {
        list.push({
          licence: hotel,
          tier: 'Mandatory',
          reason: 'Registration with State Tourism Board & Ministry of Tourism NIDHI for hotels, resorts, and homestays.',
          actionNeeded: 'Register accommodation on nidhi.tourism.gov.in and state tourism portal.'
        });
      }
      if (tour) {
        list.push({
          licence: tour,
          tier: 'Recommended',
          reason: 'Official Ministry of Tourism recognition strengthens traveller trust and institutional bookings.',
          actionNeeded: 'Apply via Ministry of Tourism online recognition portal.'
        });
      }
      if (ev) {
        list.push({
          licence: ev,
          tier: 'Conditional',
          reason: 'Required before hosting public concerts, exhibitions, or large gatherings in municipal/police limits.',
          actionNeeded: 'Obtain Police NOC, Fire clearance, and Loudspeaker permission if applicable.'
        });
      }
    }

    // Agriculture & Rural
    if (activitySector === 'agriculture') {
      const seed = findLicence('seed-dealer-licence');
      const fert = findLicence('fertiliser-dealer-licence');
      const pest = findLicence('pesticide-dealer-licence');
      const apmc = findLicence('apmc-market-trader-licence');
      if (seed) {
        list.push({
          licence: seed,
          tier: 'Mandatory',
          reason: 'Mandatory under Seeds (Control) Order, 1983 for selling notified agricultural seeds.',
          actionNeeded: 'Apply via State Agriculture Department with storage premises proof.'
        });
      }
      if (fert) {
        list.push({
          licence: fert,
          tier: 'Mandatory',
          reason: 'Mandatory under Fertiliser (Control) Order, 1985 requiring Form O from manufacturers.',
          actionNeeded: 'Submit Form A1 and Principal Certificate (Form O) to District Agriculture Officer.'
        });
      }
      if (pest) {
        list.push({
          licence: pest,
          tier: 'Conditional',
          reason: 'Required under Insecticides Act, 1968 with mandatory agriculture/chemistry degree or certified training.',
          actionNeeded: 'Apply to State Agriculture Department Licensing Officer.'
        });
      }
      if (apmc) {
        list.push({
          licence: apmc,
          tier: 'Conditional',
          reason: 'Required to trade or bid as a commission agent / trader in regulated APMC agricultural mandis.',
          actionNeeded: 'Register with State Agricultural Marketing Board / e-NAM.'
        });
      }
    }

    // Security & IP
    if (activitySector === 'security-ip') {
      const psara = findLicence('security-agency-licence');
      const lm = findLicence('legal-metrology-licence');
      const epr = findLicence('epr-registration');
      const pat = findLicence('patent-assistance');
      if (psara) {
        list.push({
          licence: psara,
          tier: 'Conditional',
          reason: 'Mandatory Home Department PSARA licence before providing private security guards in a state.',
          actionNeeded: 'Apply via State Home Department / PSARA portal with MoU for guard training.'
        });
      }
      if (lm) {
        list.push({
          licence: lm,
          tier: 'Conditional',
          reason: 'Required for importers/packers of pre-packaged commodities or manufacturers/dealers of weights.',
          actionNeeded: 'Apply for LMPC registration on State Legal Metrology or NTH portal.'
        });
      }
      if (epr) {
        list.push({
          licence: epr,
          tier: 'Conditional',
          reason: 'Mandatory for Producers, Importers & Brand Owners (PIBOs) of plastic, e-waste, batteries, or tyres.',
          actionNeeded: 'Register on CPCB centralised EPR portal.'
        });
      }
      if (pat) {
        list.push({
          licence: pat,
          tier: 'Recommended',
          reason: 'Protects novel inventions or technical processes across India for 20 years.',
          actionNeeded: 'File patent specification on ipindia.gov.in (80% fee rebate for Startups/MSMEs).'
        });
      }
    }

    // Core Tax & MSME Recommendations for business activities
    const gst = findLicence('gst-registration');
    if (gst && !hasGST) {
      const isHighTurnover = turnoverScale !== 'under-12L';
      list.push({
        licence: gst,
        tier: isHighTurnover ? 'Mandatory' : 'Recommended',
        reason: isHighTurnover
          ? 'Required once turnover exceeds threshold (₹40L for goods, ₹20L for services) or for inter-state and e-commerce selling.'
          : 'Enables Input Tax Credit (ITC) on capital assets and voluntary inter-state supplies.',
        actionNeeded: 'Apply for free on gst.gov.in using Aadhaar e-KYC.'
      });
    }

    const udyam = findLicence('udyam-msme-registration');
    if (udyam && !hasUdyam) {
      list.push({
        licence: udyam,
        tier: 'Recommended',
        reason: 'Zero-cost official recognition as an MSME unlocking 1-2% bank loan interest subsidies, 50% patent/trademark discount, and payment protection.',
        actionNeeded: 'Register for ₹0 on udyamregistration.gov.in using Aadhaar & PAN.'
      });
    }

    // Professional Tax (State Commercial Taxes)
    if (applicantType !== 'Individual') {
      const pt = findLicence('professional-tax-registration');
      if (pt) {
        list.push({
          licence: pt,
          tier: 'Conditional',
          reason: 'Mandatory in applicable states (including Karnataka, Maharashtra, West Bengal, Tamil Nadu, Gujarat) for employers and professionals.',
          actionNeeded: 'Complete PTEC / PTRC registration on your State Commercial Taxes portal.'
        });
      }
    }

    // Corporate entity incorporation if company selected
    if (applicantType === 'Private Limited') {
      const pvt = findLicence('private-limited-company-incorporation');
      if (pvt) {
        list.push({
          licence: pvt,
          tier: 'Mandatory',
          reason: 'Corporate legal personality, limited liability, and institutional fundraising readiness.',
          actionNeeded: 'File SPICe+ Part A & B on mca.gov.in.'
        });
      }
    } else if (applicantType === 'LLP') {
      const llp = findLicence('llp-incorporation');
      if (llp) {
        list.push({
          licence: llp,
          tier: 'Mandatory',
          reason: 'Incorporated partnership combining operational flexibility with limited liability protection.',
          actionNeeded: 'File FiLLiP form on mca.gov.in.'
        });
      }
    }

    return list;
  };

  const recommendations = getRecommendations();
  const mandatoryItems = recommendations.filter((r) => r.tier === 'Mandatory');
  const conditionalItems = recommendations.filter((r) => r.tier === 'Conditional');
  const recommendedItems = recommendations.filter((r) => r.tier === 'Recommended');

  return (
    <div className="py-10 bg-slate-50 min-h-[85vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200/80 px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Intelligent Eligibility Evaluation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Find the Licences You Need
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-xl mx-auto">
            Answer a few tailored questions about your planned activity to generate a personalized regulatory roadmap.
          </p>
        </div>

        {/* Wizard Card Container */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          
          {!isCompleted ? (
            <div>
              {/* Progress Bar */}
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Step {currentStep} of {totalSteps}
                </span>
                <span className="text-xs text-slate-500 font-medium tabular-nums">
                  {Math.round((currentStep / totalSteps) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1">
                <div
                  className="bg-teal-600 h-1 transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>

              {/* Step Content */}
              <div className="p-6 sm:p-8">
                
                {/* Step 1: Entity Type */}
                {currentStep === 1 && (
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 mb-1">
                      1. How will you or your business operate?
                    </h2>
                    <p className="text-xs text-slate-500 mb-5">
                      Select your legal business constitution or individual status.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { type: 'Individual' as ApplicantType, label: 'Individual Citizen', desc: 'Personal permits, driving licence, individual professional.' },
                        { type: 'Sole Proprietorship' as ApplicantType, label: 'Sole Proprietorship', desc: 'Single-owner business, retail shop, small enterprise.' },
                        { type: 'Partnership' as ApplicantType, label: 'Partnership Firm', desc: 'Two or more co-founders under a Partnership Deed.' },
                        { type: 'LLP' as ApplicantType, label: 'Limited Liability Partnership (LLP)', desc: 'Incorporated partnership with limited liability protection.' },
                        { type: 'Private Limited' as ApplicantType, label: 'Private Limited Company', desc: 'Corporate startup, institutional entity, multi-shareholder.' },
                        { type: 'Farmer' as ApplicantType, label: 'Farmer / Producer Co-op', desc: 'Agricultural producer, FPO, farming community.' },
                      ].map((item) => (
                        <div
                          key={item.type}
                          onClick={() => setApplicantType(item.type)}
                          className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                            applicantType === item.type
                              ? 'border-teal-600 bg-teal-50/50 ring-1 ring-teal-600'
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-bold text-slate-900">{item.label}</span>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              applicantType === item.type ? 'border-teal-600 bg-teal-600' : 'border-slate-300'
                            }`}>
                              {applicantType === item.type && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Activity Sector */}
                {currentStep === 2 && (
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 mb-1">
                      2. What primary activity do you intend to perform?
                    </h2>
                    <p className="text-xs text-slate-500 mb-5">
                      Licensing authorities are divided strictly by operational sector.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {sectors.map((sec) => (
                        <div
                          key={sec.id}
                          onClick={() => setActivitySector(sec.id)}
                          className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                            activitySector === sec.id
                              ? 'border-teal-600 bg-teal-50/50 ring-1 ring-teal-600'
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-bold text-slate-900">{sec.title}</span>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              activitySector === sec.id ? 'border-teal-600 bg-teal-600' : 'border-slate-300'
                            }`}>
                              {activitySector === sec.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">{sec.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Location (State and Municipality) */}
                {currentStep === 3 && (
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 mb-1">
                      3. Where will the activity or business be located?
                    </h2>
                    <p className="text-xs text-slate-500 mb-5">
                      State labour laws, municipal trade licences, and pollution rules depend on exact location.
                    </p>
                    <div className="space-y-4 max-w-lg">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          State or Union Territory:
                        </label>
                        <select
                          value={stateCode}
                          onChange={(e) => {
                            setStateCode(e.target.value);
                            const st = INDIAN_STATES.find((s) => s.code === e.target.value);
                            if (st && st.majorCities.length > 0) {
                              setCityName(st.majorCities[0]);
                            }
                          }}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                        >
                          {INDIAN_STATES.map((s) => (
                            <option key={s.code} value={s.code}>
                              {s.name} ({s.type})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          City / Municipality:
                        </label>
                        <select
                          value={cityName}
                          onChange={(e) => setCityName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                        >
                          {INDIAN_STATES.find((s) => s.code === stateCode)?.majorCities.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Application Kind */}
                {currentStep === 4 && (
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 mb-1">
                      4. What kind of application is this?
                    </h2>
                    <p className="text-xs text-slate-500 mb-5">
                      New applications, renewals, and modifications have distinct fee schedules and procedures.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'New' as const, label: 'Fresh / New Application', desc: 'Applying for the very first time for this permit.' },
                        { id: 'Renewal' as const, label: 'Renewal of Existing', desc: 'Extending validity of an expiring licence or certificate.' },
                        { id: 'Modification' as const, label: 'Modification / Amendment', desc: 'Updating address, partners, or vehicle class.' }
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setApplicationKind(item.id)}
                          className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                            applicationKind === item.id
                              ? 'border-teal-600 bg-teal-50/50 ring-1 ring-teal-600'
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-bold text-slate-900">{item.label}</span>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              applicationKind === item.id ? 'border-teal-600 bg-teal-600' : 'border-slate-300'
                            }`}>
                              {applicationKind === item.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 5: Turnover & Scale */}
                {currentStep === 5 && (
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 mb-1">
                      5. What is your approximate annual business turnover or scale?
                    </h2>
                    <p className="text-xs text-slate-500 mb-5">
                      Statutory thresholds (e.g. FSSAI Basic vs State Licence; GST exemption thresholds) are tied directly to turnover.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { id: 'under-12L', label: 'Under ₹12 Lakh / year', desc: 'Eligible for FSSAI Basic Registration (₹100/yr) and small vendor exemptions.' },
                        { id: '12L-to-40L', label: '₹12 Lakh to ₹40 Lakh / year', desc: 'Requires FSSAI State Licence for food; below general GST mandatory threshold for goods.' },
                        { id: '40L-to-1Cr', label: '₹40 Lakh to ₹1 Crore / year', desc: 'Mandatory GST registration; Micro enterprise classification under Udyam.' },
                        { id: '1Cr-to-20Cr', label: '₹1 Crore to ₹20 Crore / year', desc: 'Small enterprise tier; full commercial accounting & tax audits.' },
                        { id: 'above-20Cr', label: 'Above ₹20 Crore / year', desc: 'Mandates FSSAI Central Licence for food businesses; Medium enterprise scale.' }
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setTurnoverScale(item.id)}
                          className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                            turnoverScale === item.id
                              ? 'border-teal-600 bg-teal-50/50 ring-1 ring-teal-600'
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-bold text-slate-900">{item.label}</span>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              turnoverScale === item.id ? 'border-teal-600 bg-teal-600' : 'border-slate-300'
                            }`}>
                              {turnoverScale === item.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 6: Existing Registrations */}
                {currentStep === 6 && (
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 mb-1">
                      6. Do you already hold any of these common registrations?
                    </h2>
                    <p className="text-xs text-slate-500 mb-5">
                      This prevents recommending duplicate clearances.
                    </p>
                    <div className="space-y-3 max-w-lg">
                      <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                        <input
                          type="checkbox"
                          checked={hasGST}
                          onChange={(e) => setHasGST(e.target.checked)}
                          className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                        />
                        <div>
                          <span className="text-sm font-bold text-slate-900">I already have an active GST Registration (GSTIN)</span>
                          <p className="text-xs text-slate-500">Issued by CBIC / State Commercial Taxes.</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                        <input
                          type="checkbox"
                          checked={hasUdyam}
                          onChange={(e) => setHasUdyam(e.target.checked)}
                          className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                        />
                        <div>
                          <span className="text-sm font-bold text-slate-900">I already have an active Udyam MSME Certificate</span>
                          <p className="text-xs text-slate-500">Issued by Ministry of MSME.</p>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

              </div>

              {/* Wizard Navigation Footer */}
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl transition-colors ${
                    currentStep === 1
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xs transition-colors"
                >
                  <span>{currentStep === totalSteps ? 'View Tailored Results' : 'Continue'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Results View */
            <div className="p-6 sm:p-8">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-6">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-teal-700">
                    Evaluation Complete
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mt-0.5">
                    Your Personalized Licensing Roadmap
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Based on: <span className="font-semibold text-slate-700">{applicantType}</span> · <span className="font-semibold text-slate-700">{cityName}, {INDIAN_STATES.find(s => s.code === stateCode)?.name}</span>
                  </p>
                </div>

                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start New Assessment</span>
                </button>
              </div>

              {/* Transparent Legal Disclaimer */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl mb-6 text-xs text-amber-900 flex items-start gap-3">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  <span className="font-semibold">Legal Guidance Disclaimer:</span> This assessment identifies clearances commonly applicable to your declared parameters. It is an educational tool and does not constitute formal legal counsel. Always verify with official authorities before commencing operations.
                </p>
              </div>

              {/* Section 1: Mandatory Licences */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Mandatory Requirements ({mandatoryItems.length})
                  </h3>
                </div>
                <div className="space-y-3">
                  {mandatoryItems.length > 0 ? (
                    mandatoryItems.map(({ licence, reason, actionNeeded }) => (
                      <div
                        key={licence.id}
                        className="p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1 max-w-xl">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-bold text-slate-900 text-sm hover:text-teal-700 cursor-pointer" onClick={() => onSelectLicence(licence)}>
                              {licence.name}
                            </span>
                            <span className="text-slate-400">·</span>
                            <span className="text-slate-500 font-medium">{licence.jurisdiction} Authority</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            <span className="font-medium text-slate-700">Why it applies:</span> {reason}
                          </p>
                          <p className="text-[11px] text-teal-800">
                            <span className="font-semibold">Action:</span> {actionNeeded}
                          </p>
                        </div>
                        <button
                          onClick={() => onSelectLicence(licence)}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shrink-0 transition-colors"
                        >
                          View Requirements
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic">No mandatory clearances found for this exact combination.</p>
                  )}
                </div>
              </div>

              {/* Section 2: Conditional Licences */}
              {conditionalItems.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                      Conditional Requirements ({conditionalItems.length})
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {conditionalItems.map(({ licence, reason, actionNeeded }) => (
                      <div
                        key={licence.id}
                        className="p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1 max-w-xl">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-bold text-slate-900 text-sm hover:text-teal-700 cursor-pointer" onClick={() => onSelectLicence(licence)}>
                              {licence.name}
                            </span>
                            <span className="text-slate-400">·</span>
                            <span className="text-slate-500 font-medium">{licence.jurisdiction} Authority</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            <span className="font-medium text-slate-700">Trigger condition:</span> {reason}
                          </p>
                          <p className="text-[11px] text-teal-800">
                            <span className="font-semibold">Action:</span> {actionNeeded}
                          </p>
                        </div>
                        <button
                          onClick={() => onSelectLicence(licence)}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg shrink-0 transition-colors"
                        >
                          Check Thresholds
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 3: Recommended Registrations */}
              {recommendedItems.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                      Recommended Registrations ({recommendedItems.length})
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {recommendedItems.map(({ licence, reason, actionNeeded }) => (
                      <div
                        key={licence.id}
                        className="p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1 max-w-xl">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-bold text-slate-900 text-sm hover:text-teal-700 cursor-pointer" onClick={() => onSelectLicence(licence)}>
                              {licence.name}
                            </span>
                            <span className="text-slate-400">·</span>
                            <span className="text-slate-500 font-medium">Voluntary / Recommended</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            <span className="font-medium text-slate-700">Benefit:</span> {reason}
                          </p>
                          <p className="text-[11px] text-teal-800">
                            <span className="font-semibold">Next Step:</span> {actionNeeded}
                          </p>
                        </div>
                        <button
                          onClick={() => onSelectLicence(licence)}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg shrink-0 transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ask Mitra AI Button */}
              <div className="p-5 bg-teal-50 border border-teal-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Need clarification on your exact setup?</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Ask Licence Mitra to generate a personalized document checklist or explain specific exemptions.
                  </p>
                </div>
                <button
                  onClick={onOpenAI}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask Mitra AI</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
