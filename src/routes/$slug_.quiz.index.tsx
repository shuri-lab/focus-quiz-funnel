import { createFileRoute, redirect } from '@tanstack/react-router';
import { FIRST_STEP, STEP_SLUG } from '../quiz/steps';
export const Route = createFileRoute('/$slug_/quiz/')({ beforeLoad: ({ params, location }) => { throw redirect({ href: `/${params.slug}/quiz/${STEP_SLUG[FIRST_STEP]}${location.searchStr}`, replace: true }); } });