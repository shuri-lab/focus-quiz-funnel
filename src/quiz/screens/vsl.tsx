import { useCallback, useEffect, useRef } from 'react';
import { useQuiz } from '../context';
import { Screen, ScreenTitle } from '../../components/Screen';
import { VslPlayer } from '../../components/VslPlayer';
import { PhotoRail, PressRail } from '../../components/Proof';
import { mainConcern, stateKey } from '../../lib/logic';
import { OFFER_BUY_ID, OFFER_SCROLL_OFFSET } from '../../lib/vsl';
import { VSL_CTA, VSL_EYEBROW, vslHead } from '../../lib/vslCopy';
import { track } from '../../lib/analytics';
import { R2 } from './offer';
import { getArm } from '../../lib/arm';

/* THE VIDEO, THE PROOF, AND THE OFFER, ON ONE SCROLL. 14 November 2026.
 *
 * David's order, top to bottom, and this file does not decide any of it:
 *
 *   1  the headline                     vslCopy.ts
 *   2  the video                        VslPlayer
 *   3  a button that scrolls down       vslCopy.ts
 *   4  the press logos, then the women  Proof.tsx
 *   5  the offer, entire and unchanged  R2, embedded
 *
 * THE OFFER IS NOT REBUILT HERE. It is the same R2 the walk ends on today,
 * rendered with `embedded` so it drops its own copy of the two rails and
 * its <Screen> wrapper. Its copy, its cards, its cart links, its outcome
 * and its angle are untouched, which is what keeps checkout attribution
 * identical to the flow this replaces.
 *
 * WHICH OFFER SHE SEES is the arm, read the same way Quiz.tsx reads it, so
 * the A/B is unchanged by the video being in front of it.
 */
export function Vsl() {
  const { S } = useQuiz();
  const outcome = stateKey(S);
  const top = useRef<HTMLDivElement>(null);

  /* SEEN, ONCE. An IntersectionObserver rather than a mount effect: the
     screen mounts at the top of a long page, and "she arrived" and "she saw
     it" are the same thing here only because the headline is the first
     thing on it. The observer is the honest version and costs nothing. */
  useEffect(() => {
    const el = top.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') { track.vslView(outcome); return undefined; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { track.vslView(outcome); io.disconnect(); }
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, [outcome]);

  const onPlay = useCallback(() => track.vslPlay(outcome), [outcome]);

  /* DOWN TO THE OFFER, NOT OUT TO THE SHOP.
     Onto the HEADLINE, by its id, and not scrollIntoView on the section:
     the app header is sticky, so "the top of the viewport" is underneath
     it. Measured and offset instead. */
  /* STRAIGHT TO THE BUY BOX, 17 November (Jane). It used to land on the
     offer's hero, whose own button scrolled her down again: two taps to reach
     the price she was promised. */
  const scrollToId = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - OFFER_SCROLL_OFFSET;
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  }, []);
  const toOffer = useCallback(() => { track.vslCta(outcome); scrollToId(OFFER_BUY_ID); }, [outcome, scrollToId]);

  return (
    <Screen id="vsl">
      <div className="vsl" ref={top}>
        <p className="vslEyebrow">{VSL_EYEBROW}</p>
        <ScreenTitle className="vslHead">{vslHead(mainConcern(S))}</ScreenTitle>

        <VslPlayer onInteract={onPlay} />

        <button type="button" className="cta vslCta" data-vsl-cta onClick={toOffer}>
          {VSL_CTA} &nbsp;&rarr;
        </button>

        {/* David's order: the logos she half recognises, then the women. */}
        <div className="vslProof">
          <PressRail />
          <PhotoRail />
        </div>
      </div>

      {/* The offer, exactly as the walk shows it today. */}
      <R2 variant={getArm() === 'bottle25' ? 'bottle' : 'kit'} screen="r2" embedded />
    </Screen>
  );
}
