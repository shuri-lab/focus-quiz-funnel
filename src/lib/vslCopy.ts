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

/** TODO David: the headline over the video. */
export const VSL_HEAD = 'Your result is in. Press play and let me walk you through it';

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
