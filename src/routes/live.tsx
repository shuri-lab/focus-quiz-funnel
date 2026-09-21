import { createFileRoute } from "@tanstack/react-router";
import { OfferPage } from "@/offer/OfferPage";
import { LIVE_HERO } from "@/lib/offerCopy";

export const Route = createFileRoute("/live")({
  head: () => ({
    meta: [
      { title: LIVE_HERO.title },
      { name: "description", content: LIVE_HERO.description },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: LIVE_HERO.title },
      { property: "og:description", content: LIVE_HERO.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LivePage,
});

function LivePage() {
  return <OfferPage live />;
}
