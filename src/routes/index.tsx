import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/landing/Landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Hormone Check — Find out what is actually going on" },
      { name: "description", content: "A two-minute symptom check that tells you which stage you are in: hormonal imbalance, perimenopause or menopause. From JJ Smith." },
      { property: "og:title", content: "The Hormone Check — Find out what is actually going on" },
      { property: "og:description", content: "A two-minute symptom check that tells you which stage you are in: hormonal imbalance, perimenopause or menopause. From JJ Smith." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <Landing />;
}
