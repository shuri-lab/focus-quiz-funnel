import { createFileRoute, redirect, useParams } from "@tanstack/react-router";
import { Quiz } from "@/quiz/Quiz";
import { ANGLES } from "@/lib/angles";

export const Route = createFileRoute("/$slug/quiz")({
  head: ({ params }) => {
    const angle = ANGLES.find((a) => a.slug === params.slug);
    const kicker = angle?.kicker ?? "";
    const title = `The Hormone Check${kicker ? ` — ${kicker}` : ""}`;
    const description = angle?.description ?? "A two-minute symptom check that tells you which stage you are in. From JJ Smith.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "noindex,nofollow" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  beforeLoad: ({ params }) => {
    const known = ANGLES.some((a) => a.slug && a.slug === params.slug);
    if (!known) throw redirect({ to: "/" });
  },
  component: SlugQuiz,
});

function SlugQuiz() {
  const { slug } = useParams({ from: "/$slug/quiz" });
  return <Quiz slug={slug} />;
}
