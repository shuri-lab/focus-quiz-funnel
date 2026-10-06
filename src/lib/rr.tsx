/* A thin react-router-dom-shaped layer over TanStack Router.
 *
 * Upstream is written against react-router-dom. Mapping the handful of hooks
 * it uses here lets upstream files be copied in unchanged on every pull.
 * The step segment lives in a splat route, so `_splat` is surfaced as `step`.
 */
import { useEffect, type ReactNode } from 'react';
import {
  Link as TLink,
  useParams as useTParams,
  useRouter,
  useLocation as useTLocation,
  useSearch,
} from '@tanstack/react-router';

export function useParams(): Record<string, string | undefined> {
  const p = useTParams({ strict: false }) as Record<string, string | undefined>;
  const step = p['_splat'] || p['step'] || undefined;
  return { ...p, step };
}

type To = string | { pathname: string; search?: string };
const toHref = (to: To) => (typeof to === 'string' ? to : `${to.pathname}${to.search ?? ''}`);

export function useNavigate() {
  const router = useRouter();
  return (to: To | number, opts?: { replace?: boolean; state?: unknown }) => {
    if (typeof to === 'number') { router.history.go(to); return; }
    void router.navigate({ href: toHref(to), replace: !!opts?.replace });
  };
}

export function Navigate({ to, replace }: { to: To; replace?: boolean }) {
  const router = useRouter();
  useEffect(() => {
    void router.navigate({ href: toHref(to), replace: replace ?? false });
  }, [router, to, replace]);
  return null;
}

export function Link({ to, children, className }: { to: string; children: ReactNode; className?: string }) {
  return <TLink to={to as string} className={className}>{children}</TLink>;
}

export function useLocation() {
  const l = useTLocation();
  return { pathname: l.pathname, search: l.searchStr, hash: l.hash };
}

export function useSearchParams(): [URLSearchParams] {
  const s = useSearch({ strict: false }) as Record<string, unknown>;
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(s)) if (typeof v === 'string') p.set(k, v);
  return [p];
}
