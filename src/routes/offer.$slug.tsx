import { createFileRoute } from '@tanstack/react-router';
import { OfferPage } from '../offer/OfferPage';
export const Route = createFileRoute('/offer/$slug')({ component: OfferPage });