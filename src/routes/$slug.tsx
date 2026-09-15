import { createFileRoute, Link, redirect, useParams } from "@tanstack/react-router";
import { Landing } from "@/landing/Landing";
import { ANGLES } from "@/lib/angles";

export const Route = createFileRoute("/$slug")({
  head: ({ params }) => {
    const angle = ANGLES.find((a) => a.slug === params.slug);
    const title = angle?.title ?? "The Hormone Check";
    const description = angle?.description ?? "A two-minute symptom check that tells you which stage you are in. From JJ Smith.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  beforeLoad: ({ params }) => {
    const known = ANGLES.some((a) => a.slug && a.slug === params.slug);
    if (!known) throw redirect({ to: "/" });
  },
  component: SlugLanding,
});

function SlugLanding() {
  const { slug } = useParams({ from: "/$slug" });
  return <Landing slug={slug} />;
}
