import { ClientOnly, createFileRoute } from '@tanstack/react-router';
import { Quiz } from '../quiz/Quiz';
export const Route = createFileRoute('/$slug_/quiz/$')({ component: QuizPage });
function QuizPage() { return <ClientOnly><Quiz /></ClientOnly>; }