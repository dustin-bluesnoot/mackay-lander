'use client';

import { useRef } from 'react';
import Image from 'next/image';

const MAX_SELECTIONS = 5;

interface Partner {
  id: string;
  name: string;
  tier: string;
  shortDescription: string;
  offerDetails: string | null;
  learnMoreUrl: string | null;
  logoUrl: string | null;
}

interface Step3PartnersProps {
  partners: Partner[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

const TIER_CONFIG: Record<string, { label: string; barColor: string; badgeBg: string; badgeText: string; accentColor: string }> = {
  PLATINUM: {
    label: 'Platinum Partners',
    barColor: 'from-yellow-300 to-gold',
    badgeBg: 'bg-gray-100',
    badgeText: 'text-gray-700',
    accentColor: '#c9a84c',
  },
  NATIONAL: {
    label: 'National Partners',
    barColor: 'bg-navy',
    badgeBg: 'bg-navy-50',
    badgeText: 'text-navy',
    accentColor: '#1e3a5f',
  },
  INNOVATOR: {
    label: 'Innovator Partners',
    barColor: 'bg-teal-600',
    badgeBg: 'bg-teal-50',
    badgeText: 'text-teal-700',
    accentColor: '#0d9488',
  },
};

const TIER_ORDER = ['PLATINUM', 'NATIONAL', 'INNOVATOR'];

function PartnerCard({
  partner,
  isSelected,
  isDisabled,
  onToggle,
}: {
  partner: Partner;
  isSelected: boolean;
  isDisabled: boolean;
  onToggle: () => void;
}) {
  const config = TIER_CONFIG[partner.tier] || TIER_CONFIG.INNOVATOR;

  return (
    <div
      className={`relative flex-shrink-0 w-72 rounded-xl overflow-hidden shadow-sm border-2 transition-all duration-200 cursor-pointer group ${
        isSelected
          ? 'border-navy shadow-md ring-2 ring-navy/20 bg-blue-50'
          : isDisabled
          ? 'border-gray-200 opacity-50 cursor-not-allowed'
          : 'border-gray-200 hover:border-navy/40 hover:shadow-md bg-white'
      }`}
      onClick={isDisabled ? undefined : onToggle}
    >
      {/* Selected checkmark badge */}
      {isSelected && (
        <div className="absolute top-3 left-3 z-10 w-7 h-7 bg-navy rounded-full flex items-center justify-center shadow">
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      {/* Top color bar */}
      <div
        className={`h-1.5 w-full ${
          partner.tier === 'PLATINUM'
            ? 'bg-gradient-to-r from-yellow-300 to-gold'
            : partner.tier === 'NATIONAL'
            ? 'bg-navy'
            : 'bg-teal-600'
        }`}
      />

      <div className="p-5">
        {/* Tier badge */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${config.badgeBg} ${config.badgeText}`}
          >
            {partner.tier}
          </span>
        </div>

        {/* Logo */}
        <div className="h-14 flex items-center justify-center mb-4">
          {partner.logoUrl ? (
            <div className="relative w-28 h-14">
              <Image
                src={partner.logoUrl}
                alt={`${partner.name} logo`}
                fill
                className="object-contain"
                onError={() => {}}
              />
            </div>
          ) : (
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: config.accentColor }}
            >
              {partner.name.charAt(0)}
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className="font-bold text-navy text-sm mb-2 leading-tight line-clamp-2">
          {partner.name}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 mb-4">
          {partner.shortDescription}
        </p>

        {/* Learn more link */}
        {partner.learnMoreUrl && (
          <a
            href={partner.learnMoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-navy hover:text-gold font-medium inline-flex items-center gap-1 mb-4"
          >
            Learn More
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}

        {/* Select button */}
        <button
          type="button"
          onClick={isDisabled ? undefined : onToggle}
          disabled={isDisabled}
          className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
            isSelected
              ? 'bg-navy text-white'
              : isDisabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-navy hover:text-white'
          }`}
        >
          {isSelected ? '✓ Selected' : 'Select Partner'}
        </button>
      </div>
    </div>
  );
}

function TierSection({
  tier,
  partners,
  selectedIds,
  atLimit,
  onToggle,
}: {
  tier: string;
  partners: Partner[];
  selectedIds: string[];
  atLimit: boolean;
  onToggle: (id: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const config = TIER_CONFIG[tier] || TIER_CONFIG.INNOVATOR;

  function scroll(direction: 'left' | 'right') {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -320 : 320,
        behavior: 'smooth',
      });
    }
  }

  if (partners.length === 0) return null;

  return (
    <div className="mb-10">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-1 h-6 rounded-full flex-shrink-0 ${
            tier === 'PLATINUM'
              ? 'bg-gradient-to-b from-yellow-300 to-gold'
              : tier === 'NATIONAL'
              ? 'bg-navy'
              : 'bg-teal-600'
          }`}
        />
        <h3 className="text-base font-bold text-navy">{config.label}</h3>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          {partners.length}
        </span>
      </div>

      {/* Carousel */}
      <div className="relative">
        {partners.length > 3 && (
          <button
            type="button"
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Scroll left"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto carousel-scroll pb-2"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {partners.map((partner) => {
            const isSelected = selectedIds.includes(partner.id);
            const isDisabled = atLimit && !isSelected;
            return (
              <div key={partner.id} style={{ scrollSnapAlign: 'start' }}>
                <PartnerCard
                  partner={partner}
                  isSelected={isSelected}
                  isDisabled={isDisabled}
                  onToggle={() => onToggle(partner.id)}
                />
              </div>
            );
          })}
        </div>

        {partners.length > 3 && (
          <button
            type="button"
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Scroll right"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default function Step3Partners({ partners, selectedIds, onChange }: Step3PartnersProps) {
  const atLimit = selectedIds.length >= MAX_SELECTIONS;

  function togglePartner(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((sid) => sid !== id));
    } else if (!atLimit) {
      onChange([...selectedIds, id]);
    }
  }

  const partnersByTier = TIER_ORDER.reduce<Record<string, Partner[]>>((acc, tier) => {
    acc[tier] = partners.filter((p) => p.tier === tier);
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-navy mb-1">Connect with Our Trusted Resource Partners</h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          Please select up to 5 partners you would like to be personally introduced to. All offers are complimentary or specially priced for MacKay Members.
        </p>
      </div>

      {/* Selection counter */}
      <div className="mb-6">
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            atLimit
              ? 'bg-gold text-white'
              : 'bg-navy text-white'
          }`}
        >
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              atLimit ? 'bg-white/30' : 'bg-white/20'
            }`}
          >
            {selectedIds.length}
          </span>
          {selectedIds.length} / {MAX_SELECTIONS} Partners Selected
          {atLimit && <span className="text-xs opacity-90">(limit reached)</span>}
        </div>
      </div>

      {/* Tiers */}
      {TIER_ORDER.map((tier) => (
        <TierSection
          key={tier}
          tier={tier}
          partners={partnersByTier[tier] || []}
          selectedIds={selectedIds}
          atLimit={atLimit}
          onToggle={togglePartner}
        />
      ))}

      {partners.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No partners available for this survey.
        </div>
      )}
    </div>
  );
}
