import React from 'react';
import { LicenceRecord } from '../types/licence';
import { ArrowRight, ShieldCheck, Clock, IndianRupee } from 'lucide-react';

interface PopularLicencesProps {
  licences: LicenceRecord[];
  onSelectLicence: (licence: LicenceRecord) => void;
  onExploreAll: () => void;
}

const FEATURED_POPULAR_IDS = [
  'permanent-driving-licence',
  'gst-registration',
  'udyam-msme-registration',
  'fssai-basic-registration',
  'shop-and-establishment-registration',
  'municipal-trade-licence',
  'factory-licence',
  'clinical-establishment-registration',
  'rera-project-registration',
  'birth-certificate',
  'passport-assistance',
  'epr-registration',
];

export const PopularLicences: React.FC<PopularLicencesProps> = ({
  licences,
  onSelectLicence,
  onExploreAll,
}) => {
  const popularByFeatured = FEATURED_POPULAR_IDS
    .map((id) => licences.find((l) => l.id === id))
    .filter((l): l is LicenceRecord => Boolean(l));

  const popularList =
    popularByFeatured.length >= 6
      ? popularByFeatured
      : licences.filter((l) => l.isPopular).slice(0, 12);

  return (
    <section className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-teal-700 mb-1">
              High Demand Across All 12 Sectors
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Popular Licences, Registrations & Certificates
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Essential citizen certificates, transport permits, and business clearances applied across India.
            </p>
          </div>
          <button
            onClick={onExploreAll}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800 transition-colors shrink-0 group"
          >
            <span>Explore all {licences.length} directory items</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Licence Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularList.map((licence) => (
            <div
              key={licence.id}
              onClick={() => onSelectLicence(licence)}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Quiet unboxed metadata header */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5 gap-2">
                  <span className="font-medium text-slate-700 truncate">
                    <span className="font-mono text-slate-400 mr-1.5">#{licence.serialNo}</span>
                    {licence.categoryLabel}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-700 shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{licence.serviceType}</span>
                  </span>
                </div>

                {/* Licence Title */}
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug mb-2">
                  {licence.name}
                </h3>

                {/* Short overview */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {licence.tagline || licence.overview}
                </p>

                {/* Key metadata grid */}
                <div className="space-y-2 py-3 border-y border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-600 gap-2">
                    <span className="text-slate-600 shrink-0">Jurisdiction</span>
                    <span className="font-medium text-slate-800 truncate text-right">{licence.jurisdiction} Authority</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 gap-2">
                    <span className="text-slate-600 flex items-center gap-1 shrink-0">
                      <IndianRupee className="w-3.5 h-3.5 text-slate-600" />
                      <span>Govt Fee</span>
                    </span>
                    <span className="font-semibold text-slate-900 tabular-nums truncate text-right" title={licence.governmentFees.summary}>
                      {licence.governmentFees.summary.split('.')[0]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 gap-2">
                    <span className="text-slate-600 flex items-center gap-1 shrink-0">
                      <Clock className="w-3.5 h-3.5 text-slate-600" />
                      <span>Timeline</span>
                    </span>
                    <span className="font-medium text-slate-800 truncate text-right">
                      {licence.processingTimeEstimate.split('(')[0].trim()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action link */}
              <div className="mt-4 pt-2 flex items-center justify-between text-xs font-semibold text-teal-700 group-hover:text-teal-800">
                <span>View Requirements & Portal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
