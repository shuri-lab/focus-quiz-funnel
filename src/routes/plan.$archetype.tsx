import { createFileRoute } from '@tanstack/react-router';
import { PlanPage } from '../offer/PlanPage';
export const Route = createFileRoute('/plan/$archetype')({ component: PlanPage });