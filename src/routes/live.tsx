import { createFileRoute } from '@tanstack/react-router';
import { OfferPage } from '../offer/OfferPage';
export const Route = createFileRoute('/live')({ component: Live });
function Live() { return <OfferPage live />; }