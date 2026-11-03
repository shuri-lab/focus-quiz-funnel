import { ClientOnly, createFileRoute, useParams } from "@tanstack/react-router";
import { Navigate } from "@/lib/rr";
import { Quiz } from "@/quiz/Quiz";
import { ANGLES } from "@/lib/angles";
import { FIRST_STEP, STEP_SLUG } from "@/quiz/steps";

export const Route = createFileRoute("/$slug/quiz/$")({
  head: ({ params }) => {
    const angle = ANGLES.find((a) => a.slug === params.slug);
    const kicker = angle?.label ?? "";
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
  component: SlugQuiz,
});

function SlugQuiz() {
  const { slug, _splat } = useParams({ from: "/$slug/quiz/$" });
  const known = ANGLES.some((a) => a.slug && a.slug === slug);
  if (!known) return <Navigate to="/" replace />;
  if (!_splat) return <Navigate to={`/${slug}/quiz/${STEP_SLUG[FIRST_STEP]}`} replace />;
  return <ClientOnly><Quiz /></ClientOnly>;
}
