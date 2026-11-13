import {
  ApplicantType,
  ApplicationMode,
  ApplicationStep,
  DocumentRequirement,
  FeeItem,
  JurisdictionLevel,
  LicenceCategory,
  LicenceFAQ,
  LicenceRecord,
  ServiceType,
  SourceReference,
  VerificationStatus,
} from '../types/licence';

export interface CompactLicenceInput {
  serialNo: number;
  id: string;
  slug?: string;
  name: string;
  serviceType: ServiceType;
  aliases: string[];
  category: LicenceCategory;
  categoryLabel: string;
  tagline: string;
  overview: string;
  whatItAllows: string[];
  whoNeedsIt: string[];
  whoIsExempt?: string[];
  eligibilityCriteria: string[];
  applicantTypes: ApplicantType[];
  activitiesCovered: string[];
  jurisdiction: JurisdictionLevel;
  state?: string;
  municipality?: string;
  issuingAuthority: string;
  governingMinistry: string;
  relevantLegislation: string;
  applicationMode: ApplicationMode;
  officialApplicationUrl: string;
  officialInfoUrl?: string;
  feeSummary: string;
  feeItems?: FeeItem[];
  professionalFeeNote?: string;
  processingTimeEstimate: string;
  validityPeriod: string;
  renewalLeadTime: string;
  renewalProcedure: string;
  penaltyForDelay?: string;
  inspectionRequirements: string;
  modificationAndTransfer?: string;
  commonRejectionReasons: string[];
  requiredDocuments: DocumentRequirement[];
  steps: ApplicationStep[];
  sources: SourceReference[];
  faqs: LicenceFAQ[];
  relatedLicenceIds?: string[];
  verificationStatus?: VerificationStatus;
  verifiedBy?: string;
  lastVerifiedDate?: string;
  isPopular?: boolean;
}

export function buildLicenceRecord(input: CompactLicenceInput): LicenceRecord {
  return {
    id: input.id,
    serialNo: input.serialNo,
    slug: input.slug || input.id,
    name: input.name,
    serviceType: input.serviceType,
    aliases: input.aliases,
    category: input.category,
    categoryLabel: input.categoryLabel,
    tagline: input.tagline,
    overview: input.overview,
    whatItAllows: input.whatItAllows,
    whoNeedsIt: input.whoNeedsIt,
    whoIsExempt: input.whoIsExempt || [
      'Exemptions depend on statutory thresholds, state rules, and specific activity criteria. Confirm with the issuing authority.'
    ],
    eligibilityCriteria: input.eligibilityCriteria,
    applicantTypes: input.applicantTypes,
    activitiesCovered: input.activitiesCovered,
    jurisdiction: input.jurisdiction,
    state: input.state,
    municipality: input.municipality,
    issuingAuthority: input.issuingAuthority,
    governingMinistry: input.governingMinistry,
    relevantLegislation: input.relevantLegislation,
    applicationMode: input.applicationMode,
    officialApplicationUrl: input.officialApplicationUrl,
    officialInfoUrl: input.officialInfoUrl || input.officialApplicationUrl,
    governmentFees: {
      summary: input.feeSummary,
      items: input.feeItems || [
        {
          particular: 'Official Government / Statutory Fee',
          amount: input.feeSummary.split('.')[0],
        },
      ],
      professionalFeeNote: input.professionalFeeNote,
    },
    processingTimeEstimate: input.processingTimeEstimate,
    validityPeriod: input.validityPeriod,
    renewalRequirements: {
      leadTime: input.renewalLeadTime,
      procedure: input.renewalProcedure,
      penaltyForDelay: input.penaltyForDelay,
    },
    inspectionRequirements: input.inspectionRequirements,
    modificationAndTransfer:
      input.modificationAndTransfer ||
      'Amendments to address, ownership, or scope must be submitted on the issuing authority portal with supporting proof.',
    commonRejectionReasons: input.commonRejectionReasons,
    requiredDocuments: input.requiredDocuments,
    steps: input.steps,
    sources: input.sources,
    faqs: input.faqs,
    relatedLicenceIds: input.relatedLicenceIds || [],
    verificationStatus: input.verificationStatus || 'Verified',
    verifiedBy: input.verifiedBy || 'Licence Holding Regulatory Desk',
    lastVerifiedDate: input.lastVerifiedDate || '2026-11-10',
    isPopular: input.isPopular || false,
  };
}
