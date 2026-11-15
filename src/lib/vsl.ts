/* THE VSL STEP, AND THE ONE SWITCH THAT TURNS IT OFF.
 *
 * David, 14 November 2026: after her result, show her a video from JJ and
 * put the offer under it, on one scrollable screen.
 *
 *   VSL_FLOW on    r1 -> vsl (video, proof, then the whole offer)
 *   VSL_FLOW off   r1 -> plan -> r2, which is what this branch does today
 *
 * ONE BOOLEAN, AND NOTHING ELSE TO UNDO. Nothing is deleted to make this
 * work: `plan` and `r2` stay in FLOW, stay in SCREENS and stay reachable at
 * their own addresses whichever way the flag is set. See shouldSkip in
 * logic.ts, which is the only place the flag changes where she goes.
 *
 * WHAT THIS FLAG DOES NOT RESTORE. Jane's Direction 2 (11 November) cut
 * `cause` and `meet` out of the walk and forwarded their addresses to
 * `plan`. That is a different switch, CUT in logic.ts, and this one leaves
 * it alone: VSL_FLOW off is this branch as it is today, not the nurture
 * sequence as it was two weeks ago.
 *
 * This module imports nothing, so logic.ts can read the flag without a
 * cycle through the screens that read logic.ts.
 */

export const VSL_FLOW = true;

/**
 * The Loom embed.
 *
 * THE CHROME PARAMETERS ARE GONE, 14 November. hide_owner, hide_share,
 * hide_title and hideEmbedTopBar tidied the player up and stopped it
 * playing: David pressed play and nothing happened. A plain player that
 * plays beats a tidy one that does not, so this is the embed URL Loom
 * itself hands out, which is what he sent through.
 *
 * t=0 IS THE ONE PARAMETER THAT STAYS. Loom resumes where a viewer left
 * off, so a woman who came back to the page, or who had the start of it
 * buffered, would press play and drop into the middle of JJ's sentence.
 * Every view starts at 0:00.
 *
 * WHAT WE STILL CANNOT MEASURE: the iframe is cross-origin, so there is no
 * timeupdate and no honest 25/50/75/complete. See track.vslPlay.
 *
 * THE 1.2x SPEED IS NOT OURS TO SET. David asked for 1x on 14 November.
 * Loom plays every embed at 1.2x by default and no query parameter changes
 * it: speed, playbackRate and hide_speed were each measured against the
 * live player and all three came back at 1.2. The parent page cannot reach
 * it either, the iframe being cross-origin. It is a per-video setting in
 * Loom's own dashboard, under Video Settings, and David has to flip it
 * there. See the e2e note in vsl.spec.ts.
 *
 * NOT AUTOPLAYED, deliberately. Muted autoplay inside a cross-origin iframe
 * is unreliable on iOS and a video that starts itself with no sound is a
 * video she watches none of. She taps play.
 */
export const VSL_LOOM_ID = '96d46768d238486f8bbcad8e9b0594d7';

export const VSL_EMBED_URL = `https://www.loom.com/embed/${VSL_LOOM_ID}?t=0`;

/** 4:5, upright, because she is holding a phone. */
export const VSL_ASPECT = '125%';

/**
 * What the CTA under the video scrolls to.
 *
 * THE HEADLINE, NOT THE TOP OF THE SECTION. David, 14 November: the button
 * has to land her on "Hormone Focus, your daily support". The section above
 * it starts with an eyebrow and a rating, so scrolling to the section put
 * the headline a third of the way down the screen with the small print
 * above it reading first.
 *
 * The id is on the heading R2 renders whether or not it is embedded, so the
 * anchor cannot drift away from the thing it names.
 */
export const OFFER_HEAD_ID = 'offer-head';

/** The section itself, which is what the sticky bar measures. */
export const OFFER_HERO_ID = 'offer-hero';

/**
 * How far above the headline to stop.
 *
 * The app header is sticky, so a headline scrolled exactly to the top of
 * the viewport sits underneath it. This is that header plus a little air.
 */
export const OFFER_SCROLL_OFFSET = 76;
