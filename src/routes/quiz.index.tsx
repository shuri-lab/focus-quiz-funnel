import { createFileRoute, redirect } from '@tanstack/react-router';
import { FIRST_STEP, STEP_SLUG } from '../quiz/steps';
export const Route = createFileRoute('/quiz/')({ beforeLoad: ({ location }) => { throw redirect({ href: `/quiz/${STEP_SLUG[FIRST_STEP]}${location.searchStr}`, replace: true }); } });