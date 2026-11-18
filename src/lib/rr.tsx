import { Link as RouterLink, useLocation as routerLocation, useNavigate as routerNavigate, useParams as routerParams, useRouter } from '@tanstack/react-router';
import { useCallback, useEffect, type ReactNode } from 'react';

type Destination = string | { pathname: string; search?: string };
type Options = { replace?: boolean; state?: unknown };
export function useNavigate() {
  const navigate = routerNavigate();
  const router = useRouter();
  return useCallback((to: Destination | number, options?: Options) => {
    if (typeof to === 'number') { router.history.go(to); return; }
    const href = typeof to === 'string' ? to : to.pathname + (to.search ?? '');
    return navigate({ href, replace: options?.replace });
  }, [navigate, router]);
}
export function useParams(): Record<string, string | undefined> {
  const params = routerParams({ strict: false }) as Record<string, string | undefined>;
  return { ...params, step: params._splat?.split('/')[0] };
}
export function useLocation() {
  const location = routerLocation();
  return { ...location, search: location.searchStr };
}
export function useSearchParams(): [URLSearchParams] {
  return [new URLSearchParams(routerLocation().searchStr)];
}
export function Navigate({ to, replace }: { to: string; replace?: boolean }) {
  const navigate = useNavigate();
  useEffect(() => { void navigate(to, { replace }); }, [navigate, to, replace]);
  return null;
}
export function Link({ to, children, ...props }: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string; children?: ReactNode }) {
  return <RouterLink to={to} {...props}>{children}</RouterLink>;
}