import { createFileRoute } from "@tanstack/react-router";
import { PlanPage } from "@/offer/PlanPage";

/* Her Starter Guide. Her first name and her result ride in the query string,
   so this page is never for a search index. */
export const Route = createFileRoute("/plan/$archetype")({
  head: () => ({
    meta: [
      { title: "Your Starter Guide — Hormone Focus" },
      { name: "description", content: "Your personal 60-day plan, from your Hormone Check results." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Your Starter Guide — Hormone Focus" },
      { property: "og:description", content: "Your personal 60-day plan, from your Hormone Check results." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PlanPage,
});
