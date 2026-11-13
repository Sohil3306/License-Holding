import { LicenceCategory } from '../types/licence';

export interface CategoryInfo {
  id: LicenceCategory;
  order: number;
  serialRange: string;
  name: string;
  shortDescription: string;
  iconName: string;
  examples: string[];
  scopeNote: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'driving-transport',
    order: 1,
    serialRange: '1 – 17',
    name: 'Driving & Transport Licences',
    shortDescription: 'Learner & permanent driving licences, DL renewals, RC transfers, NOCs, fitness certificates, permits, and driving schools.',
    iconName: 'Car',
    examples: ["Learner's Licence", 'Permanent Driving Licence', 'Vehicle Registration (RC)', 'Commercial Vehicle Permit'],
    scopeNote: 'Governed under the Motor Vehicles Act, 1988 and Central Motor Vehicles Rules, 1989 via Parivahan Sewa (Sarathi & Vahan).'
  },
  {
    id: 'business-company',
    order: 2,
    serialRange: '18 – 34',
    name: 'Business & Company Registrations',
    shortDescription: 'GST, Udyam MSME, Shops & Establishments, Trade Licence, PT, IEC, Pvt Ltd, LLP, OPC, Startup India, EPFO, and ESIC.',
    iconName: 'Store',
    examples: ['GST Registration', 'Udyam / MSME Registration', 'Private Limited Company Registration', 'EPFO & ESIC Registration'],
    scopeNote: 'Clearly distinguishes tax registrations, entity incorporations, municipal operating licences, and statutory labour registrations.'
  },
  {
    id: 'food-restaurant',
    order: 3,
    serialRange: '35 – 47',
    name: 'Food & Restaurant Licences',
    shortDescription: 'FSSAI Basic, State & Central licences, renewals, Eating House licence, catering, Fire NOC, excise/bar, and music permissions.',
    iconName: 'Utensils',
    examples: ['FSSAI Basic Registration', 'FSSAI State Licence', 'Restaurant / Eating House Licence', 'Liquor / Excise & Bar Licence'],
    scopeNote: 'FSSAI tier depends on annual turnover and production capacity; Eating House, Fire NOC, and Excise vary by state/city police and municipal laws.'
  },
  {
    id: 'factory-industrial',
    order: 4,
    serialRange: '48 – 62',
    name: 'Factory & Industrial Licences',
    shortDescription: 'Factory registration & plan approval, Contract Labour, SPCB CTE/CTO, waste authorisations, EC, boilers, lifts, and electrical approvals.',
    iconName: 'Factory',
    examples: ['Factory Registration & Licence', 'Pollution Control Board CTE & CTO', 'Hazardous & E-Waste Authorisation', 'Boiler Registration'],
    scopeNote: 'Requires site inspection, factory layout sanction, environmental consents (Red/Orange/Green), and statutory worker safety compliance.'
  },
  {
    id: 'healthcare-medical',
    order: 5,
    serialRange: '63 – 73',
    name: 'Healthcare & Medical Licences',
    shortDescription: 'Clinical establishments, hospitals, nursing homes, diagnostic labs, wholesale/retail drug licences, medical devices, and AYUSH.',
    iconName: 'HeartPulse',
    examples: ['Clinical Establishment Registration', 'Hospital & Nursing Home Registration', 'Retail & Wholesale Drug Licence', 'Medical Device Permissions'],
    scopeNote: 'Strictly requires qualified medical/pharmacy personnel, cold-chain infrastructure, bio-medical waste tie-ups, and physical inspections.'
  },
  {
    id: 'education-training',
    order: 6,
    serialRange: '74 – 80',
    name: 'Education & Training Registrations',
    shortDescription: 'School recognition, coaching centre registration, preschool/daycare, college/university approvals, ITI, training centres, and hostels.',
    iconName: 'GraduationCap',
    examples: ['School Recognition', 'Coaching Centre Registration', 'Preschool / Daycare Registration', 'ITI & Hostel Registration'],
    scopeNote: 'Governed by state education departments, central regulatory bodies (UGC/AICTE/NCVT/DGT), and local safety/fire regulations.'
  },
  {
    id: 'construction-property',
    order: 7,
    serialRange: '81 – 90',
    name: 'Construction & Property Permissions',
    shortDescription: 'RERA project & agent registrations, building plan approval, completion & occupancy certificates, land use conversion, and utility connections.',
    iconName: 'HardHat',
    examples: ['RERA Project Registration', 'Building Plan Approval', 'Occupancy Certificate (OC)', 'Land Use Conversion & Borewell NOC'],
    scopeNote: 'Executed through state RERA portals, municipal town planning authorities, revenue departments, and electricity/water boards.'
  },
  {
    id: 'import-export-logistics',
    order: 8,
    serialRange: '91 – 98',
    name: 'Import, Export & Logistics',
    shortDescription: 'Import Export Code (IEC), RCMC, warehouse & cold storage licences, weighbridges, PESO explosive/petroleum, and gas cylinder licences.',
    iconName: 'Globe',
    examples: ['Import Export Code (IEC)', 'Export Promotion Council (RCMC)', 'Warehouse & Cold Storage Licence', 'PESO & Petroleum Storage Licence'],
    scopeNote: 'Covers DGFT foreign trade clearances, warehousing/agricultural storage norms, legal metrology weighbridges, and PESO hazardous safety.'
  },
  {
    id: 'tourism-entertainment',
    order: 9,
    serialRange: '99 – 106',
    name: 'Tourism & Entertainment',
    shortDescription: 'Hotel & homestay registration, tour operator recognition, event & film shooting permissions, loudspeaker, cinema/theatre, and amusement.',
    iconName: 'Ticket',
    examples: ['Hotel / Homestay Registration', 'Tour Operator Recognition', 'Event & Film Shooting Permission', 'Cinema / Theatre Licence'],
    scopeNote: 'Administered by Ministry of Tourism (NIDHI), state tourism boards, district magistrates, and local police licensing branches.'
  },
  {
    id: 'agriculture-rural',
    order: 10,
    serialRange: '107 – 114',
    name: 'Agriculture & Rural Business',
    shortDescription: 'Seed, fertiliser, and pesticide dealer licences, dairy, poultry, livestock establishment permissions, APMC mandi trader, and irrigation.',
    iconName: 'Sprout',
    examples: ['Seed Dealer Licence', 'Fertiliser Dealer Licence', 'Pesticide Dealer Licence', 'APMC / Market Trader Licence'],
    scopeNote: 'Mandates state agriculture department inspections, principal certificate (Form O) from manufacturers, and environmental/groundwater norms.'
  },
  {
    id: 'citizen-certificates',
    order: 11,
    serialRange: '115 – 132',
    name: 'Citizen Certificates & Services',
    shortDescription: 'Birth, death, marriage, caste, income, domicile, EWS, nativity, legal heir, disability, PCC, character, passport, Aadhaar, and voter services.',
    iconName: 'FileBadge',
    examples: ['Birth & Death Certificate', 'Caste, Income & EWS Certificate', 'Domicile & Legal Heir Certificate', 'Police Clearance & Passport'],
    scopeNote: 'Delivered via CRS/state e-District portals, Tehsildar/Revenue offices, Police Seva portals, Passport Seva, UIDAI, and Election Commission.'
  },
  {
    id: 'other-licences',
    order: 12,
    serialRange: '133 – 141',
    name: 'Other Licences & Registrations',
    shortDescription: 'PSARA security agency licence, electrical contractor, legal metrology, weights & measures, EPR, copyright, patent, and design registration.',
    iconName: 'ShieldCheck',
    examples: ['Security Agency Licence (PSARA)', 'Electrical Contractor Licence', 'Legal Metrology & Weights', 'Copyright, Patent & Design Registration'],
    scopeNote: 'Covers Home Department security compliance, state electrical inspectorates, packaged commodities/weights metrology, CPCB EPR, and IP India.'
  }
];
