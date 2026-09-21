import { createFileRoute } from "@tanstack/react-router";
import { OfferPage } from "@/offer/OfferPage";
import { LIVE_HERO } from "@/lib/offerCopy";

export const Route = createFileRoute("/offer")({
  head: () => ({
    meta: [
      { title: LIVE_HERO.title },
      { name: "description", content: LIVE_HERO.description },
      { property: "og:title", content: LIVE_HERO.title },
      { property: "og:description", content: LIVE_HERO.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OfferPage,
});
