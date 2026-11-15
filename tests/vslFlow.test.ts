/* ONE BOOLEAN WIDE.
 *
 * David asked for the VSL step to be reversible: flipping VSL_FLOW off has
 * to give back the flow this branch walks today, exactly. A comment saying
 * so is worth nothing, so this file loads logic.ts twice, once with the
 * flag mocked on and once off, and walks both.
 *
 * vi.resetModules between the two, because logic.ts reads the flag at module
 * scope: FLOW and REVEAL are built once, when the module is first imported.
 */
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import type { QuizState, ScreenId } from '../src/lib/logic';

type Logic = typeof import('../src/lib/logic');

/** logic.ts, loaded fresh with the flag forced one way. */
async function logicWith(flag: boolean): Promise<Logic> {
  vi.resetModules();
  vi.doMock('../src/lib/vsl', async () => ({
    ...(await vi.importActual<typeof import('../src/lib/vsl')>('../src/lib/vsl')),
    VSL_FLOW: flag,
  }));
  return import('../src/lib/logic');
}

/** A woman who reaches the offer: mid forties, periods unpredictable. */
const her = (L: Logic): QuizState => ({
  ...L.createState(),
  sym: ['weight', 'sleep'], main: 'weight', age: '45-49', cycle: 'unpredictable',
  tried: ['food'], name: 'Dana', email: 'dana@example.com',
});

beforeEach(() => { vi.resetModules(); });
afterEach(() => { vi.doUnmock('../src/lib/vsl'); vi.resetModules(); });

test('with the flag ON she goes result, video, and the walk ends there', async () => {
  const L = await logicWith(true);
  const seen = L.path(her(L));

  expect(seen[seen.indexOf('r1') + 1], 'the video follows the result').toBe('vsl');
  expect(seen[seen.length - 1], 'and it is the end of the walk').toBe('vsl');
  /* The offer is INSIDE that screen, so neither of the two it replaces is
     walked. Neither is deleted: see the next test. */
  expect(seen, 'the plan screen is stepped over').not.toContain('plan');
  expect(seen, 'the offer screen is stepped over').not.toContain('r2');
  expect(L.REVEAL, 'the progress bar counts the walk she is on')
    .toEqual(['r1', 'vsl']);
});

test('with the flag OFF she goes result, plan, offer, and never sees a video', async () => {
  const L = await logicWith(false);
  const seen = L.path(her(L));

  expect(seen[seen.indexOf('r1') + 1], 'her plan follows the result').toBe('plan');
  expect(seen[seen.indexOf('plan') + 1], 'and then the offer').toBe('r2');
  expect(seen[seen.length - 1], 'the walk ends on the offer').toBe('r2');
  expect(seen, 'no video anywhere in it').not.toContain('vsl');
  expect(L.REVEAL).toEqual(['r1', 'plan', 'r2']);
});

test('nothing is deleted to make the switch: every screen is still in FLOW', async () => {
  /* The point of doing it with shouldSkip rather than by swapping arrays.
     A screen that is in FLOW is a screen Quiz.tsx can still render and
     steps.ts can still address. */
  for (const flag of [true, false]) {
    const L = await logicWith(flag);
    for (const id of ['r1', 'vsl', 'plan', 'r2', 'rDoc'] as ScreenId[]) {
      expect(L.FLOW, `${id} left FLOW with the flag ${flag}`).toContain(id);
    }
  }
});

test('the doctor route is never walked into the video, either way', async () => {
  /* The VSL screen carries the offer, so it answers to the same rule the
     offer does: a woman being sent to her doctor sees none of it. */
  for (const flag of [true, false]) {
    const L = await logicWith(flag);
    /* Under forty with periods stopped: docReason 'young'. */
    const doc: QuizState = {
      ...L.createState(),
      sym: ['bloat'], main: 'bloat', age: 'under-40', cycle: 'stopped', twelve: 'yes',
    };
    const seen = L.path(doc);
    expect(L.seesOffer(doc), `flag ${flag}`).toBe(false);
    expect(seen, `flag ${flag}: the doctor route saw the video`).not.toContain('vsl');
    expect(seen, `flag ${flag}`).not.toContain('r2');
    expect(seen, `flag ${flag}`).toContain('rDoc');
  }
});
