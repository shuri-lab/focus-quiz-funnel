import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import {
  createState, nextId, prevId, stateKey, QUESTIONS, REVEAL, shouldSkip,
  type QuizState, type ScreenId,
} from '../lib/logic';
import { track } from '../lib/analytics';
import type { Angle } from '../lib/angles';
import { QuizCtx, type QuizApi } from './context';

const STORE_KEY = 'hf_quiz_state';

function load(): QuizState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(STORE_KEY);
    if (!raw) return null;
    return { ...createState(), ...JSON.parse(raw) };
  } catch {
    return null;
  }
}

function save(S: QuizState) {
  if (typeof window === 'undefined') return;
  try { sessionStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch { /* private browsing */ }
}

export function QuizProvider({ angle, children }: { angle: Angle; children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [S, setS] = useState<QuizState>(() => {
    const restored = load();
    if (restored) return restored;
    return { ...createState(), sym: [...angle.preselect] };
  });

  const here = ((location.state as { screen?: ScreenId } | null)?.screen ?? 's1') as ScreenId;

  useEffect(() => { save(S); }, [S]);

  const set = useCallback((patch: Partial<QuizState>) => {
    setS((prev) => ({ ...prev, ...patch }));
  }, []);

  const toggle = useCallback(<K extends 'sym' | 'mood' | 'markers' | 'tried'>(
    key: K, value: QuizState[K][number],
  ) => {
    setS((prev) => {
      const list = prev[key] as string[];
      const i = list.indexOf(value as string);
      let out = i > -1 ? [...list.slice(0, i), ...list.slice(i + 1)] : [...list, value as string];

      if (key === 'markers') {
        if (value === 'none') out = i > -1 ? [] : ['none'];
        else out = out.filter((m) => m !== 'none');
      }
      return { ...prev, [key]: out } as QuizState;
    });
  }, []);

  const latest = useRef(S);
  latest.current = S;

  const goTo = useCallback((id: ScreenId | undefined, replace = false) => {
    if (!id) return;
    navigate({
      to: location.pathname + location.search,
      state: { screen: id } as Record<string, unknown>,
      replace,
    });
  }, [navigate, location.pathname, location.search]);

  const advancedFrom = useRef<ScreenId | null>(null);

  const next = useCallback((opts?: { replace?: boolean }) => {
    if (advancedFrom.current === here) return;
    advancedFrom.current = here;
    goTo(nextId(latest.current, here), opts?.replace);
  }, [goTo, here]);

  const back = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.state?.idx > 0) {
      navigate({ to: '.', viewTransition: true }); // fallback
      window.history.back();
      return;
    }
    goTo(prevId(latest.current, here), true);
  }, [navigate, goTo, here]);

  const restart = useCallback(() => {
    const fresh = { ...createState(), sym: [...angle.preselect] };
    setS(fresh);
    if (typeof window !== 'undefined') {
      try { sessionStorage.removeItem(STORE_KEY); } catch { /* ignore */ }
    }
    goTo('s1');
  }, [angle.preselect, goTo]);

  const live = useCallback((ids: ScreenId[]) => ids.filter((k) => !shouldSkip(S, k)), [S]);

  const questionStep = useMemo(() => {
    const asked = live(QUESTIONS);
    const i = asked.indexOf(here);
    return i > -1 ? { index: i + 1, total: asked.length } : null;
  }, [live, here]);

  const revealStep = useMemo(() => {
    const shown = live(REVEAL);
    const i = shown.indexOf(here);
    return i > -1 ? { index: i + 1, total: shown.length } : null;
  }, [live, here]);

  const seen = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (seen.current.has(here)) return;
    seen.current.add(here);

    if (here === 's1') track.quizStart(angle.slug);
    if (questionStep) track.quizStep(here, questionStep.index, questionStep.total);
    if (here === 'r1') track.resultView(stateKey(latest.current));
    if (here === 'r7') track.offerView(stateKey(latest.current));
    if (here === 'rDoc') track.doctorRoute(stateKey(latest.current));
  }, [here]);

  const value = useMemo<QuizApi>(() => ({
    S, angle, here, set, toggle, next, back, restart,
    canBack: here !== 's1' && here !== 's12',
    questionStep, revealStep,
  }), [S, angle, here, set, toggle, next, back, restart, questionStep, revealStep]);

  return <QuizCtx.Provider value={value}>{children}</QuizCtx.Provider>;
}
