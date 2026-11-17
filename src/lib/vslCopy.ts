/* EVERY WORD THE VSL SCREEN SAYS.
 *
 * It is three lines long, and all three are here rather than in vsl.tsx for
 * the reason every other copy module exists: tests/copy.test.ts reads the
 * exports of these files and nothing else, so a sentence typed into a
 * component is a sentence nobody checked.
 *
 * SAME GATE AS THE REST: no contractions, no verb aimed at a symptom, no
 * banned word, and no dash, em or en, since 29 October.
 *
 * PLACEHOLDERS. David, 14 November: "Treat these as placeholders, I will
 * finalize the wording." Nothing below is signed off.
 */

/**
 * THE HEADLINE OVER THE VIDEO, 17 November (Jane). She already told us her
 * symptom, so the headline does not ask it back. It promises what the video
 * gives her: why it keeps happening, and what to do about it, from JJ.
 * Keyed by mainConcern. The eyebrow above it says who and how long.
 */
export const VSL_HEAD_BY: Record<string, string> = {
  weight: 'Why the weight keeps going to your middle',
  sleep: 'Why you keep waking up at 3 AM',
  energy: 'Why you are tired even after a full night',
  sweats: 'Why the hot flashes keep coming back',
  bloat: 'Why you feel bloated by the afternoon',
  mood: 'Why your mood and memory feel off',
};

/** When she named no symptom. */
export const VSL_HEAD = 'Why your body feels different';

/** Under the headline, smaller (Jane, 17 Nov: the full sentence ran to four lines). */
export const VSL_SUB = 'And what to do about it.';

/** Above the headline: who explains it, and that it is short (the video runs 2 min 47 s). */
export const VSL_EYEBROW = 'JJ explains in under 3 minutes';

/* WHICH SYMPTOM, WHEN SHE PICKED SEVERAL: mainConcern, her answer to "Which
   one bothers you the most?". With one symptom ticked, that one. */
export const vslHead = (concern: string): string => VSL_HEAD_BY[concern] ?? VSL_HEAD;


/**
 * TODO David: the alternative he listed, kept here so the choice is one
 * edit rather than one rewrite. "Before your offer, a quick word from JJ."
 */

/** The button under the video. It scrolls to the offer, it does not buy. */
export const VSL_CTA = 'See my welcome offer';

/**
 * What the player is, for a screen reader and for a slow connection that
 * never loads the iframe.
 */
export const VSL_PLAYER_TITLE = 'A video from JJ Smith about your result';
