import { createFileRoute, Navigate, useParams } from "@tanstack/react-router";
import { OfferPage } from "@/offer/OfferPage";
import { OFFER_ANGLES, angleBySlug } from "@/lib/angles";
import { LIVE_HERO, heroFor } from "@/lib/offerCopy";

export const Route = createFileRoute("/offer/$slug")({
  head: ({ params }) => {
    const angle = angleBySlug(params.slug);
    const hero = heroFor(angle) ?? LIVE_HERO;
    return {
      meta: [
        { title: hero.title },
        { name: "description", content: hero.description },
        { property: "og:title", content: hero.title },
        { property: "og:description", content: hero.description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: OfferSlug,
});

/* An offer slug we do not sell against falls back to the master offer page. */
function OfferSlug() {
  const { slug } = useParams({ from: "/offer/$slug" });
  const known = OFFER_ANGLES.some((a) => a.slug && a.slug === slug);
  if (!known) return <Navigate to="/offer" replace />;
  return <OfferPage />;
}
