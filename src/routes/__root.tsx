import { createRootRoute, HeadContent, Outlet, Scripts, useLocation } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { captureAttribution, captureQuizLanding, initClarity, initMeta, pageView } from '../lib/analytics';
import { captureListLink } from '../lib/listLink';
import '../styles/global.css';
import '../styles/kit.css';

export const Route = createRootRoute({
  head: () => ({ meta: [
    { charSet: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { title: 'The Hormone Check — Hormone Focus' },
    { name: 'description', content: 'Take JJ Smith’s Hormone Check to discover your hormone pattern and personal next steps.' },
    { property: 'og:title', content: 'The Hormone Check — Hormone Focus' },
    { property: 'og:description', content: 'Discover your hormone pattern and personal next steps with JJ Smith.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
  ], links: [
    { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap' },
  ] }),
  component: Root,
});
function Tracking() {
  const location = useLocation();
  const last = useRef<string | null>(null);
  useEffect(() => {
    captureListLink(); captureAttribution(); captureQuizLanding(); initClarity(); initMeta();
    if (!document.getElementById('hf-gtm')) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      const script = document.createElement('script');
      script.id = 'hf-gtm'; script.async = true;
      script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-WT4MWLTH';
      document.head.appendChild(script);
    }
    const path = location.pathname + location.searchStr;
    if (last.current === path) return;
    last.current = path;
    pageView(path, document.title);
  }, [location.pathname, location.searchStr]);
  return null;
}
function Root() {
  return <html lang="en"><head><HeadContent /></head><body><Outlet /><Tracking /><Scripts /></body></html>;
}