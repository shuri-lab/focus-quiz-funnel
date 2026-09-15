import { createFileRoute } from "@tanstack/react-router";
import { Quiz } from "@/quiz/Quiz";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "The Hormone Check" },
      { name: "description", content: "A two-minute symptom check that tells you which stage you are in. From JJ Smith." },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: "The Hormone Check" },
      { property: "og:description", content: "A two-minute symptom check that tells you which stage you are in. From JJ Smith." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: QuizRoute,
});

function QuizRoute() {
  return <Quiz slug={undefined} />;
}
