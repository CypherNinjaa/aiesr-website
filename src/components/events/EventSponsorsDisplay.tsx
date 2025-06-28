"use client";

import Image from "next/image";
import { useEventSponsors } from "@/hooks/useSponsors";
import { SPONSOR_TIERS, EventSponsor } from "@/types";
import styles from "./EventSponsorsDisplay.module.css";

interface EventSponsorsDisplayProps {
  eventId: string;
}

export default function EventSponsorsDisplay({ eventId }: EventSponsorsDisplayProps) {
  const { data: eventSponsors = [], isLoading } = useEventSponsors(eventId);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-32 rounded bg-gray-200"></div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded bg-gray-200"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!eventSponsors.length) {
    return null;
  }

  // Group sponsors by tier for better display
  const sponsorsByTier = eventSponsors.reduce(
    (acc, sponsor) => {
      const tier = sponsor.sponsor_tier;
      if (!acc[tier]) {
        acc[tier] = [];
      }
      acc[tier].push(sponsor);
      return acc;
    },
    {} as Record<string, typeof eventSponsors>
  );

  // Sort tiers by priority
  const sortedTiers = SPONSOR_TIERS.filter(tier => sponsorsByTier[tier.tier]).sort(
    (a, b) => a.priority - b.priority
  );

  const getTierLabel = (tier: string) => {
    const tierConfig = SPONSOR_TIERS.find(t => t.tier === tier);
    return tierConfig?.label || tier;
  };

  const getTierClass = (tier: string) => {
    return styles[tier] || styles.bronze;
  };

  const getLogoSize = (tier: string, isFeatured: boolean) => {
    if (isFeatured) return "h-24 w-48";

    const tierConfig = SPONSOR_TIERS.find(t => t.tier === tier);
    switch (tierConfig?.defaultLogoSize) {
      case "large":
        return "h-20 w-40";
      case "medium":
        return "h-16 w-32";
      case "small":
        return "h-12 w-24";
      default:
        return "h-16 w-32";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-6 text-xl font-semibold text-gray-900">Event Sponsors</h3>

        {/* Featured Sponsors First */}
        {eventSponsors.some(s => s.is_featured) && (
          <div className="mb-8">
            <h4 className="mb-4 flex items-center gap-2 text-lg font-medium text-gray-800">
              <span className="text-yellow-500">⭐</span>
              Featured Sponsors
            </h4>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {eventSponsors
                .filter(s => s.is_featured)
                .map(eventSponsor => (
                  <div
                    key={eventSponsor.id}
                    className="group relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    {eventSponsor.sponsor.logo_url ? (
                      <div
                        className={`relative ${getLogoSize(eventSponsor.sponsor_tier, true)} mx-auto mb-4 overflow-hidden rounded bg-gray-50`}
                      >
                        <Image
                          src={eventSponsor.sponsor.logo_url}
                          alt={eventSponsor.sponsor.name}
                          fill
                          className="object-contain p-2"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div className="mx-auto mb-4 flex h-20 w-40 items-center justify-center rounded bg-gray-100 text-sm text-gray-500">
                        {eventSponsor.sponsor.name}
                      </div>
                    )}

                    <div className="text-center">
                      <h5 className="mb-2 font-semibold text-gray-900">
                        {eventSponsor.sponsor.name}
                      </h5>

                      <span
                        className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-medium text-white ${getTierClass(eventSponsor.sponsor_tier)}`}
                      >
                        {getTierLabel(eventSponsor.sponsor_tier)}
                      </span>

                      {(eventSponsor.custom_description || eventSponsor.sponsor.description) && (
                        <p className="mb-3 line-clamp-3 text-sm text-gray-600">
                          {eventSponsor.custom_description || eventSponsor.sponsor.description}
                        </p>
                      )}

                      {eventSponsor.sponsor.website_url && (
                        <a
                          href={eventSponsor.sponsor.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`Visit ${eventSponsor.sponsor.name} website`}
                          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          Visit Website
                          <svg
                            className="ml-1 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Sponsors by Tier */}
        {sortedTiers.map(tierConfig => {
          const tierSponsors = sponsorsByTier[tierConfig.tier].filter(s => !s.is_featured);
          if (!tierSponsors.length) return null;

          return (
            <div key={tierConfig.tier} className="mb-8">
              <h4 className="mb-4 flex items-center gap-2 text-lg font-medium text-gray-800">
                <span className={`h-4 w-4 rounded-full ${getTierClass(tierConfig.tier)}`}></span>
                {tierConfig.label} Sponsors
              </h4>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {tierSponsors.map(eventSponsor => (
                  <div
                    key={eventSponsor.id}
                    className="group relative rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
                  >
                    {eventSponsor.sponsor.website_url ? (
                      <a
                        href={eventSponsor.sponsor.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Visit ${eventSponsor.sponsor.name} website`}
                        className="block"
                      >
                        <SponsorLogo eventSponsor={eventSponsor} />
                      </a>
                    ) : (
                      <SponsorLogo eventSponsor={eventSponsor} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Helper component for sponsor logo
function SponsorLogo({ eventSponsor }: { eventSponsor: EventSponsor }) {
  const getLogoSize = (tier: string) => {
    const tierConfig = SPONSOR_TIERS.find(t => t.tier === tier);
    switch (tierConfig?.defaultLogoSize) {
      case "large":
        return "h-16 w-32";
      case "medium":
        return "h-12 w-24";
      case "small":
        return "h-10 w-20";
      default:
        return "h-12 w-24";
    }
  };

  return (
    <div className="text-center">
      {eventSponsor.sponsor.logo_url ? (
        <div
          className={`relative ${getLogoSize(eventSponsor.sponsor_tier)} mx-auto mb-2 overflow-hidden rounded bg-gray-50`}
        >
          <Image
            src={eventSponsor.sponsor.logo_url}
            alt={eventSponsor.sponsor.name}
            fill
            className="object-contain p-1"
            sizes="128px"
          />
        </div>
      ) : (
        <div
          className={`${getLogoSize(eventSponsor.sponsor_tier)} mx-auto mb-2 flex items-center justify-center rounded bg-gray-100 text-xs text-gray-500`}
        >
          {eventSponsor.sponsor.name}
        </div>
      )}

      <p className="truncate text-xs font-medium text-gray-700">{eventSponsor.sponsor.name}</p>
    </div>
  );
}
