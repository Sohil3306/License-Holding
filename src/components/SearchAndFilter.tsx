import React, { useState, useMemo } from 'react';
import { LicenceRecord, LicenceCategory, JurisdictionLevel, ApplicantType, ServiceType } from '../types/licence';
import { CATEGORIES } from '../data/categories';
import { Search, ShieldCheck, IndianRupee, Clock, ArrowRight, X, AlertCircle } from 'lucide-react';

interface SearchAndFilterProps {
  licences: LicenceRecord[];
  onSelectLicence: (licence: LicenceRecord) => void;
  initialQuery?: string;
  initialCategory?: LicenceCategory | 'all';
}

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  licences,
  onSelectLicence,
  initialQuery = '',
  initialCategory = 'all',
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<LicenceCategory | 'all'>(initialCategory);
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | 'all'>('all');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<JurisdictionLevel | 'all'>('all');
  const [selectedApplicantType, setSelectedApplicantType] = useState<ApplicantType | 'all'>('all');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);

  // Filter and search logic across all 141 Pan-India services
  const filteredLicences = useMemo(() => {
    const matched = licences.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      if (selectedServiceType !== 'all' && item.serviceType !== selectedServiceType) {
        return false;
      }

      if (selectedJurisdiction !== 'all' && item.jurisdiction !== selectedJurisdiction) {
        return false;
      }

      if (selectedApplicantType !== 'all' && !item.applicantTypes.includes(selectedApplicantType)) {
        return false;
      }

      if (verifiedOnly && item.verificationStatus !== 'Verified') {
        return false;
      }

      if (!searchQuery.trim()) return true;

      const rawQ = searchQuery.toLowerCase().trim();
      const q = normalizeText(searchQuery);

      // Exact or #serialNo match (e.g. "24" or "#24")
      const numericMatch = rawQ.replace(/^#/, '');
      if (/^\d+$/.test(numericMatch) && item.serialNo === Number(numericMatch)) {
        return true;
      }

      // Direct text matching (normalized for apostrophes)
      if (normalizeText(item.name).includes(q)) return true;
      if (item.aliases.some((a) => normalizeText(a).includes(q))) return true;
      if (normalizeText(item.overview).includes(q)) return true;
      if (normalizeText(item.tagline).includes(q)) return true;
      if (normalizeText(item.issuingAuthority).includes(q)) return true;
      if (normalizeText(item.categoryLabel).includes(q)) return true;
      if (normalizeText(item.serviceType).includes(q)) return true;

      // Multi-word AND matching when spaces present
      const tokens = q.split(' ').filter((t) => t.length >= 2);
      if (tokens.length > 1) {
        const searchableBlob = normalizeText(
          `${item.name} ${item.aliases.join(' ')} ${item.categoryLabel} ${item.issuingAuthority} ${item.tagline}`
        );
        if (tokens.every((tok) => searchableBlob.includes(tok))) return true;
      }

      // Natural language keyword rules across all 12 categories
      if (q.includes('restaurant') || q.includes('cafe') || q.includes('kitchen') || q.includes('food') || q.includes('hotel') || q.includes('bar')) {
        if (item.category === 'food-restaurant' || item.slug.includes('trade') || item.id === 'hotel-homestay-registration') return true;
      }
      if (q.includes('driving') || q.includes('learner') || q.includes('car') || q.includes('bike') || q.includes('vehicle') || q.includes('rto') || q.includes('rc')) {
        if (item.category === 'driving-transport') return true;
      }
      if (q.includes('factory') || q.includes('industry') || q.includes('manufacturing') || q.includes('pollution') || q.includes('boiler') || q.includes('waste')) {
        if (item.category === 'factory-industrial') return true;
      }
      if (q.includes('rera') || q.includes('building') || q.includes('property') || q.includes('occupancy') || q.includes('borewell') || q.includes('construction') || q.includes('real estate')) {
        if (item.category === 'construction-property') return true;
      }
      if (q.includes('export') || q.includes('import') || q.includes('foreign') || q.includes('iec') || q.includes('peso') || q.includes('warehouse') || q.includes('cold storage') || q.includes('petroleum') || q.includes('gas')) {
        if (item.category === 'import-export-logistics' || item.id === 'import-export-code') return true;
      }
      if (q.includes('hospital') || q.includes('clinic') || q.includes('pharmacy') || q.includes('drug') || q.includes('medical') || q.includes('doctor') || q.includes('ayush') || q.includes('lab')) {
        if (item.category === 'healthcare-medical') return true;
      }
      if (q.includes('school') || q.includes('college') || q.includes('coaching') || q.includes('preschool') || q.includes('daycare') || q.includes('iti') || q.includes('hostel') || q.includes('training')) {
        if (item.category === 'education-training') return true;
      }
      if (q.includes('event') || q.includes('film') || q.includes('cinema') || q.includes('theatre') || q.includes('loudspeaker') || q.includes('tourism') || q.includes('homestay') || q.includes('amusement')) {
        if (item.category === 'tourism-entertainment') return true;
      }
      if (q.includes('seed') || q.includes('fertiliser') || q.includes('fertilizer') || q.includes('pesticide') || q.includes('dairy') || q.includes('poultry') || q.includes('livestock') || q.includes('apmc') || q.includes('farm') || q.includes('agri')) {
        if (item.category === 'agriculture-rural') return true;
      }
      if (
        q.includes('birth') || q.includes('death') || q.includes('marriage') || q.includes('caste') ||
        q.includes('income') || q.includes('residence') || q.includes('domicile') || q.includes('ews') ||
        q.includes('nativity') || q.includes('legal heir') || q.includes('family member') || q.includes('senior citizen') ||
        q.includes('disability') || q.includes('pcc') || q.includes('police clearance') || q.includes('character') ||
        q.includes('passport') || q.includes('aadhaar') || q.includes('aadhar') || q.includes('voter')
      ) {
        if (item.category === 'citizen-certificates') return true;
      }
      if (
        q.includes('security agency') || q.includes('psara') || q.includes('electrical contractor') ||
        q.includes('metrology') || q.includes('weights') || q.includes('epr') ||
        q.includes('copyright') || q.includes('patent') || q.includes('design')
      ) {
        if (item.category === 'other-licences') return true;
      }
      if (q.includes('gst') || q.includes('tax') || q.includes('pan') || q.includes('tan')) {
        if (item.id === 'gst-registration' || item.slug.includes('tax') || item.id === 'pan-tan-assistance') return true;
      }
      if (q.includes('msme') || q.includes('small business') || q.includes('startup') || q.includes('company') || q.includes('llp') || q.includes('epfo') || q.includes('esic')) {
        if (item.category === 'business-company') return true;
      }
      if (q.includes('bangalore') || q.includes('bengaluru') || q.includes('karnataka')) {
        if (item.state === 'Karnataka' || item.municipality?.includes('BBMP') || item.slug.includes('karnataka') || item.slug.includes('trade')) return true;
      }

      return false;
    });

    return [...matched].sort((a, b) => a.serialNo - b.serialNo);
  }, [
    licences,
    searchQuery,
    selectedCategory,
    selectedServiceType,
    selectedJurisdiction,
    selectedApplicantType,
    verifiedOnly,
  ]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'all' ||
    selectedServiceType !== 'all' ||
    selectedJurisdiction !== 'all' ||
    selectedApplicantType !== 'all' ||
    verifiedOnly;

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedServiceType('all');
    setSelectedJurisdiction('all');
    setSelectedApplicantType('all');
    setVerifiedOnly(false);
  };

  return (
    <div className="py-8 bg-slate-50 min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-teal-700 mb-1">
            Pan-India Directory · {licences.length} Catalogued Items
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Explore All Licences, Registrations & Certificates
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Search across all 12 Pan-India sectors by service name, S. No. (#1–#141), authority, or activity.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs mb-6 space-y-4">
          
          {/* Main search bar */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by licence, certificate, activity, or S. No. (e.g. 'FSSAI', 'RERA', 'Birth Certificate', 'PESO', '#24')..."
              className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter dropdowns row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            
            {/* Category Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Sector / Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as LicenceCategory | 'all')}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-500"
              >
                <option value="all">All 12 Sectors ({licences.length})</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.order}. {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Type Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Service Type
              </label>
              <select
                value={selectedServiceType}
                onChange={(e) => setSelectedServiceType(e.target.value as ServiceType | 'all')}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-500"
              >
                <option value="all">All Service Types</option>
                <option value="Licence">Licence</option>
                <option value="Registration">Registration</option>
                <option value="Certificate">Certificate</option>
                <option value="Permission">Permission / NOC</option>
                <option value="Renewal / Update">Renewal / Update</option>
              </select>
            </div>

            {/* Jurisdiction Level Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Authority Level
              </label>
              <select
                value={selectedJurisdiction}
                onChange={(e) => setSelectedJurisdiction(e.target.value as JurisdictionLevel | 'all')}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-500"
              >
                <option value="all">All Jurisdictions</option>
                <option value="Central">Central Ministries</option>
                <option value="State">State Departments</option>
                <option value="Municipal / Local">Municipal / Local Bodies</option>
              </select>
            </div>

            {/* Applicant Type Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Applicant Type
              </label>
              <select
                value={selectedApplicantType}
                onChange={(e) => setSelectedApplicantType(e.target.value as ApplicantType | 'all')}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-500"
              >
                <option value="all">All Applicant Types</option>
                <option value="Individual">Individual Citizen</option>
                <option value="Sole Proprietorship">Sole Proprietorship</option>
                <option value="Partnership">Partnership Firm</option>
                <option value="LLP">Limited Liability Partnership</option>
                <option value="Private Limited">Private Limited Company</option>
                <option value="Farmer">Farmer / Rural Enterprise</option>
                <option value="Trust / NGO">Trust / Society / Institution</option>
              </select>
            </div>

            {/* Verified toggle and reset */}
            <div className="flex items-end justify-between gap-2">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 py-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span>Verified only</span>
              </label>

              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-teal-700 hover:text-teal-900 font-medium py-2 px-1 underline"
                >
                  Reset all
                </button>
              )}
            </div>

          </div>

          {/* Results count & active search indicator */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing <strong className="text-slate-900 tabular-nums">{filteredLicences.length}</strong> matching items of {licences.length}
            </span>
            {searchQuery && (
              <span className="truncate max-w-xs text-slate-600">
                Filtered by query: &ldquo;{searchQuery}&rdquo;
              </span>
            )}
          </div>

        </div>

        {/* Results List / Grid */}
        {filteredLicences.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLicences.map((licence) => (
              <div
                key={licence.id}
                onClick={() => onSelectLicence(licence)}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Quiet unboxed metadata header */}
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2 gap-2">
                    <span className="font-medium text-slate-700 truncate">
                      <span className="font-mono text-slate-400 mr-1.5">#{licence.serialNo}</span>
                      {licence.categoryLabel}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 text-[11px] shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{licence.serviceType}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors mb-1.5 leading-snug">
                    {licence.name}
                  </h3>

                  {/* Overview */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {licence.tagline || licence.overview}
                  </p>

                  {/* Metadata Specs */}
                  <div className="space-y-1.5 py-2.5 border-y border-slate-100 text-xs">
                    <div className="flex items-center justify-between text-slate-600 gap-2">
                      <span className="text-slate-600 shrink-0">Issuing Authority</span>
                      <span className="font-medium text-slate-800 truncate text-right" title={licence.issuingAuthority}>
                        {licence.issuingAuthority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 gap-2">
                      <span className="text-slate-600 flex items-center gap-1 shrink-0">
                        <IndianRupee className="w-3 h-3 text-slate-600" />
                        <span>Govt Fee</span>
                      </span>
                      <span className="font-semibold text-slate-900 tabular-nums truncate text-right" title={licence.governmentFees.summary}>
                        {licence.governmentFees.summary.split('.')[0]}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 gap-2">
                      <span className="text-slate-600 flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3 text-slate-600" />
                        <span>Duration</span>
                      </span>
                      <span className="font-medium text-slate-800 truncate text-right">
                        {licence.processingTimeEstimate.split('(')[0].trim()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-1 flex items-center justify-between text-xs font-semibold text-teal-700 group-hover:text-teal-800">
                  <span>View Details & Checklist</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No matching services found</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              We couldn&apos;t find any licence or certificate matching &ldquo;{searchQuery}&rdquo;. Try broader terms like &ldquo;restaurant&rdquo;, &ldquo;driving&rdquo;, &ldquo;RERA&rdquo;, &ldquo;birth certificate&rdquo;, or &ldquo;GST&rdquo;.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
