import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-memory corrections / feedback storage
const correctionReports: any[] = [];

// Gemini Assistant Endpoint: /api/mitra
app.post('/api/mitra', async (req, res) => {
  try {
    const { message, conversationHistory, contextLicenceId } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemInstruction = `You are "Licence Mitra", an intelligent, trustworthy digital services assistant for "Licence Holding" — India's All-in-One Pan-India Licence, Registration, Certificate & Permission Information Platform (covering 141 services across 12 sectors).
Your purpose: Help citizens, shopkeepers, drivers, entrepreneurs, builders, doctors, educators, farmers, and corporate founders understand licensing, permits, certificates, and registration requirements across India.

THE 12 PAN-INDIA CATEGORIES COVERED:
1. Driving & Transport Licences (Learner/Permanent DL, renewals, RC transfer/NOC/fitness, permits, driving schools)
2. Business & Company Registrations (GST, Udyam MSME, Shops & Establishments, Trade Licence, PT, IEC, Pvt Ltd/LLP/OPC/Partnership, Startup India, Trademark, PAN/TAN, EPFO, ESIC, LWF)
3. Food & Restaurant Licences (FSSAI Basic/State/Central/Renewal/Modification, Eating House, Food Trade, Hotel, Catering, Fire NOC, Liquor/Bar, Commercial Music)
4. Factory & Industrial Licences (Factory registration & plan approval, Contract Labour, Principal Employer, SPCB CTE/CTO, Hazardous/Bio-medical/Plastic/E-Waste/Battery Waste, Environmental Clearance, Boiler, Lift, Electrical Inspector)
5. Healthcare & Medical Licences (Clinical Establishment, Hospital, Nursing Home, Clinic, Diagnostic Lab, Pharmacy/Wholesale/Retail Drug, Medical Devices, AYUSH, Medical Council)
6. Education & Training Registrations (School Recognition, Coaching Centre, Preschool/Daycare, College/University, ITI, Training Centre, Hostel)
7. Construction & Property Permissions (RERA Project/Agent, Building Plan Approval, Completion & Occupancy Certificates, Land Use Conversion, Layout, Borewell, Commercial Water/Electricity)
8. Import, Export & Logistics (IEC, RCMC, Warehouse, Cold Storage, Weighbridge, PESO, Petroleum Storage, Gas Cylinder)
9. Tourism & Entertainment (Hotel/Homestay, Tourism/Tour Operator, Event/Film Shooting/Loudspeaker Permission, Cinema/Theatre, Amusement)
10. Agriculture & Rural Business (Seed/Fertiliser/Pesticide Dealer, Dairy/Poultry/Livestock Establishment, APMC Trader, Groundwater/Irrigation)
11. Citizen Certificates & Services (Birth, Death, Marriage, Caste, Income, Residence, Domicile, EWS, Nativity, Legal Heir, Family Member, Senior Citizen, Disability, PCC, Character, Passport, Aadhaar, Voter)
12. Other Licences & Registrations (PSARA Security Agency & Compliance, Electrical Contractor, Legal Metrology, Weights & Measures, EPR, Copyright, Patent, Design)

CRITICAL OPERATIONAL RULES:
1. NEVER fabricate government fees, eligibility requirements, legal penal codes, or official portal domains.
2. Guide the user clearly to verified official government portals (e.g. parivahan.gov.in, foscos.fssai.gov.in, gst.gov.in, udyamregistration.gov.in, mca.gov.in, dgft.gov.in, peso.gov.in, passportindia.gov.in, uidai.gov.in, voters.eci.gov.in, ipindia.gov.in, or state e-District / RERA / SPCB portals).
3. Distinguish clearly between mandatory registrations, conditional permits, and voluntary/recommended registrations, and between Licences, Registrations, Certificates, and Permissions.
4. Always state honestly when statutory fees or procedures vary by State Government or Municipal Corporation rather than quoting a single uniform national figure.
5. Include clickable markdown links to verified .gov.in / .nic.in portals where relevant.
6. Conclude guidance with: "Licence Holding is an independent information platform and not a government body. Always verify current terms on the official portal before paying fees."
7. Tone: Professional, respectful, clear plain English, encouraging and accessible to first-time applicants.`;

    if (ai) {
      const prompt = `User Query: "${message}"
${contextLicenceId ? `User is currently viewing Licence ID: ${contextLicenceId}` : ''}
${conversationHistory && conversationHistory.length > 0 ? `Recent conversation context:\n${JSON.stringify(conversationHistory.slice(-4))}` : ''}

Provide a helpful, structured answer with bullet points, numbered roadmap steps where appropriate, official government domain references, and next action items.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.4,
        },
      });

      const responseText = response.text || 'I could not generate an answer right now. Please check the official government portal.';
      return res.json({ reply: responseText, source: 'gemini' });
    } else {
      // Deterministic fallback if API key is not yet set in environment
      const lower = message.toLowerCase();
      let reply = '';
      if (lower.includes('driving') || lower.includes('dl') || (lower.includes('licen') && (lower.includes('car') || lower.includes('bike') || lower.includes('learner')))) {
        reply = `### Driving Licences in India (Parivahan Sarathi)

In India, obtaining a driving licence is a two-stage process under the Motor Vehicles Act, 1988:

1. **Learner's Licence (LLR)**:
   - **Eligibility**: Age 18+ for light motor vehicles (cars) and geared two-wheelers; Age 16+ for gearless two-wheelers with parental consent.
   - **Portal**: [parivahan.gov.in](https://parivahan.gov.in/)
   - **Fee**: ₹150 per class + ₹50 test fee.
   - **Validity**: 6 months.

2. **Permanent Driving Licence (DL)**:
   - **Timeline**: You can apply 30 days after your LLR is issued.
   - **Test**: Practical driving test at the RTO test track.
   - **Fee**: State-notified statutory fee + Smart Card charges (check your RTO fee schedule on Parivahan).
   - **Validity**: Up to 20 years or age 40 (whichever comes first).

**Official Portal**: Visit [parivahan.gov.in](https://parivahan.gov.in/) to apply online with Aadhaar e-KYC.

*Disclaimer: Licence Holding is an independent informational platform. Please confirm rules at your local RTO.*`;
      } else if (lower.includes('food') || lower.includes('restaurant') || lower.includes('fssai') || lower.includes('cloud kitchen')) {
        reply = `### Food Business Licences (FSSAI / FoSCoS)

Under the Food Safety and Standards Act, 2006, all food operators must register based on annual turnover:

1. **FSSAI Basic Registration** (Turnover up to ₹12 Lakh/year):
   - For petty food stalls, home bakers, and small cloud kitchens.
   - **Government Fee**: ₹100 per year (1 to 5 years validity).
   - **Time**: 7 to 15 working days.

2. **FSSAI State Licence** (Turnover ₹12 Lakh to ₹20 Crore/year):
   - For full-scale restaurants, catering services, and mid-sized food manufacturers.
   - **Government Fee**: ₹2,000 to ₹5,000 per year.
   - **Requirement**: NABL water potability test, kitchen layout, and FSO inspection.

3. **FSSAI Central Licence** (Turnover > ₹20 Crore or multi-state / importers):
   - **Government Fee**: ₹7,500 per year.

4. **Complementary Local Clearances**: Eating House Licence (City Police), Municipal Trade Licence, and Fire Safety NOC (if above seating/floor area thresholds).

**Official Portal**: Apply directly on [foscos.fssai.gov.in](https://foscos.fssai.gov.in/).

*Disclaimer: Licence Holding is an independent informational platform.*`;
      } else if (lower.includes('gst') || lower.includes('tax')) {
        reply = `### GST Registration in India

GST Registration is an all-India 15-digit tax ID (GSTIN) issued by the Central Board of Indirect Taxes and Customs (CBIC).

- **Turnover Threshold**:
  - Goods: ₹40 Lakh per year (₹20 Lakh in special category states).
  - Services: ₹20 Lakh per year (₹10 Lakh in special category states).
  - Mandatory regardless of turnover for inter-state sellers and e-commerce vendors.
- **Official Fee**: **₹0 (Completely Free)**.
- **Documents Needed**: PAN, Aadhaar of authorized signatory, electricity bill / tax receipt of business place, and landlord NOC / rent agreement.
- **Official Portal**: [www.gst.gov.in](https://www.gst.gov.in/) (Never pay on third-party imitation websites).

*Disclaimer: Licence Holding is an independent informational platform.*`;
      } else if (lower.includes('msme') || lower.includes('udyam')) {
        reply = `### Udyam MSME Registration

Udyam is the zero-cost official registration for Micro, Small, and Medium Enterprises issued by the Ministry of MSME.

- **Benefits**: Priority Sector Lending, 50% discount on Trademark & Patent fees, protection against delayed payments (MSME SAMADHAAN), and tender EMD exemptions.
- **Government Fee**: **₹0 (Completely Free)**.
- **Requirements**: Aadhaar number and PAN card.
- **Official Portal**: [udyamregistration.gov.in](https://udyamregistration.gov.in/).

*Disclaimer: Licence Holding is an independent informational platform.*`;
      } else if (
        lower.includes('birth') || lower.includes('caste') || lower.includes('income') ||
        lower.includes('domicile') || lower.includes('ews') || lower.includes('passport') ||
        lower.includes('pcc') || lower.includes('certificate')
      ) {
        reply = `### Citizen Certificates & Civil Services in India

Citizen certificates are issued across Municipal, State Revenue (e-District), Police, and Central citizen portals:

- **Birth / Death Certificates**: Issued via the Civil Registration System ([crsorgi.gov.in](https://crsorgi.gov.in/)) or your local Municipal Corporation / Gram Panchayat Registrar.
- **Caste, Income, Residence, Domicile, EWS, Nativity & Legal Heir Certificates**: Applied through your **State e-District Portal** (e.g., Seva Sindhu in Karnataka, Aaple Sarkar in Maharashtra, Edistrict in UP/Delhi) and verified by the Tehsildar / Revenue Officer. Statutory fees vary by state.
- **Passport & Police Clearance Certificate (PCC)**: Applied online via [passportindia.gov.in](https://www.passportindia.gov.in/) with appointment at your nearest Passport Seva Kendra (PSK) or State Police portal.

*Disclaimer: Licence Holding is an independent informational platform. Always verify exact fee schedules on your state e-District or central portal.*`;
      } else if (lower.includes('rera') || lower.includes('building') || lower.includes('occupancy') || lower.includes('property')) {
        reply = `### Construction & Real Estate Permissions

- **RERA Project / Agent Registration**: Mandatory under RERA Act, 2016 via your **State RERA Portal** before advertising or selling projects exceeding 500 sq.m. or 8 units (or operating as an agent).
- **Building Plan Approval, Completion Certificate (CC) & Occupancy Certificate (OC)**: Administered by local Municipal Corporations / Urban Development Authorities via state Online Building Plan Approval Systems (OBPS). Fees and FAR/FSI norms vary by state and city.

*Disclaimer: Licence Holding is an independent informational platform.*`;
      } else {
        reply = `Hello! I am **Licence Mitra**, your digital guide across **141 Pan-India Licences, Registrations, Certificates & Permissions** in **12 sectors**:

1. **Driving & Transport**: Learner/Permanent DL, renewals, RC transfer/NOC, fitness & commercial permits.
2. **Business & Company**: GST, Udyam MSME, Shops & Establishments, Trade Licence, PT, Pvt Ltd/LLP/OPC, EPFO & ESIC.
3. **Food & Restaurant**: FSSAI Basic/State/Central, Eating House, Fire NOC, catering & excise.
4. **Factory & Industrial**: Factory licence & plan approval, SPCB CTE/CTO, waste authorisations, boilers & lifts.
5. **Healthcare, Education & Construction**: Clinical establishments, drug licences, school/coaching recognition, RERA, building plan & OC.
6. **Logistics, Tourism, Agriculture & Citizen Services**: IEC, RCMC, PESO, homestays/events, seed/fertiliser/pesticide/APMC, Birth/Caste/Income/Domicile/Passport/PCC, PSARA, Legal Metrology, EPR & IP.

How can I help with your specific requirement today?`;
      }

      return res.json({ reply, source: 'knowledge-base' });
    }
  } catch (error: any) {
    console.error('Error in /api/mitra:', error);
    res.status(500).json({
      error: 'Failed to process AI query',
      details: error.message || 'Unknown server error',
    });
  }
});

// Community corrections submission
app.post('/api/corrections', (req, res) => {
  const { licenceId, licenceName, issueType, details, submittedByEmail } = req.body;
  const report = {
    id: `rep-${Date.now()}`,
    licenceId: licenceId || 'general',
    licenceName: licenceName || 'General Feedback',
    issueType: issueType || 'Other',
    details: details || '',
    submittedByEmail: submittedByEmail || 'anonymous@user.in',
    submittedAt: new Date().toISOString(),
    status: 'Pending',
  };
  correctionReports.unshift(report);
  res.json({ success: true, reportId: report.id });
});

// Get submitted corrections for Admin view
app.get('/api/corrections', (req, res) => {
  res.json({ reports: correctionReports });
});

// Setup dev server or static file serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Licence Holding server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
