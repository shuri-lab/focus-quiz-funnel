/* THE VSL STEP, END TO END.                            14 November 2026
 *
 * David's order, top to bottom: a headline, the video, a button that
 * scrolls, the press logos, the women, then the whole offer. This file
 * walks it in a browser, because every part of it is a layout claim that
 * the unit tests cannot see: that the order holds, that the button lands on
 * the offer, and that the offer under it is the same offer with the same
 * cart link it has always had.
 *
 * The flow itself is proved in tests/vslFlow.test.ts, which loads logic.ts
 * with the flag forced both ways. This file is about the screen.
 */
import { expect, test } from '@playwright/test';
import { expectNoHorizontalOverflow, heading } from './helpers';

/** Her state, written before the app boots. See tests/ for why addInitScript. */
const seed = (page: import('@playwright/test').Page) => page.addInitScript(
  (st) => sessionStorage.setItem('hf_quiz_state_v3', JSON.stringify(st)),
  {
    sym: ['weight', 'sleep'], main: 'weight', age: '45-49',
    cycle: 'unpredictable', tried: ['food'], name: 'Dana',
    email: 'dana@example.com', twelve: '', skipEmail: false,
  },
);

const top = (page: import('@playwright/test').Page, sel: string) =>
  page.evaluate((s) => {
    const el = document.querySelector(s);
    return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : -1;
  }, sel);

test.describe('the welcome video', () => {
  test.beforeEach(async ({ page }) => { await seed(page); });

  test('says its piece in David\'s order, and the offer is under it', async ({ page }) => {
    await page.goto('/quiz/welcome-video');
    await expect(heading(page), 'the headline is the screen heading').toHaveCount(1);

    /* ONE h1. The offer below brings its own hero headline, which is an h2
       here because this screen owns the first one. */
    await expect(page.locator('h1')).toHaveCount(1);

    const order = {
      head: await top(page, '.vslHead'),
      player: await top(page, '.vslPlayer'),
      cta: await top(page, '.vslCta'),
      press: await top(page, '.vslProof .pfPress'),
      photo: await top(page, '.vslProof .pfRail'),
      hero: await top(page, '#offer-hero'),
    };
    for (const [k, v] of Object.entries(order)) {
      expect(v, `${k} is missing from the screen`).toBeGreaterThan(-1);
    }
    expect(order.head).toBeLessThan(order.player);
    expect(order.player).toBeLessThan(order.cta);
    expect(order.cta, 'the logos come after the button').toBeLessThan(order.press);
    expect(order.press, 'the logos come before the women').toBeLessThan(order.photo);
    expect(order.photo, 'the offer comes last').toBeLessThan(order.hero);

    /* NOT TWICE. The offer renders these two itself on its own address; the
       order above is David's, so the embedded copy drops them. */
    await expect(page.locator('[data-proof="rail"]'), 'the offer doubled the rails')
      .toHaveCount(0);

    /* ROOM TO BREATHE, David 14 November: they were cramped against the
       button, against the offer, and against each other. */
    const gaps = await page.evaluate(() => {
      const box = (s: string) => document.querySelector(s)!.getBoundingClientRect();
      const cta = box('.vslCta');
      const press = box('.vslProof .pfPress');
      const photo = box('.vslProof .pfRail');
      const hero = box('#offer-hero');
      return {
        above: Math.round(press.top - cta.bottom),
        between: Math.round(photo.top - press.bottom),
        below: Math.round(hero.top - photo.bottom),
      };
    });
    for (const [where, px] of Object.entries(gaps)) {
      expect(px, `only ${px}px ${where} the sliders`).toBeGreaterThanOrEqual(28);
    }

    await expectNoHorizontalOverflow(page, 'the welcome video screen');
  });

  test('the video is the Loom embed, with its chrome asked off', async ({ page }) => {
    await page.goto('/quiz/welcome-video');
    const frame = page.locator('.vslFrame iframe');
    await expect(frame, 'the player never mounted').toHaveCount(1);
    const src = await frame.getAttribute('src');
    expect(src).toContain('loom.com/embed/96d46768d238486f8bbcad8e9b0594d7');
    /* EVERY VIEW STARTS AT 0:00. Loom resumes where a viewer left off, so
       without this she can press play and land mid sentence. */
    expect(src, 'the video can resume mid sentence').toContain('t=0');
    /* THE CHROME PARAMETERS STAY OFF: they stopped the player playing. */
    for (const p of ['hide_owner', 'hide_share', 'hide_title', 'hideEmbedTopBar']) {
      expect(src, `${p} is back, and it breaks play`).not.toContain(p);
    }
    /* NOT AUTOPLAYED: she taps play. See vsl.ts. */
    expect(src, 'the video starts itself').not.toContain('autoplay=1');
  });

  test('the button scrolls to the offer, it does not buy', async ({ page }) => {
    await page.goto('/quiz/welcome-video');
    const cta = page.locator('[data-vsl-cta]');
    await expect(cta).toHaveText(/See my welcome offer/);
    /* A button, not a link: nothing here leaves the page. */
    expect(await cta.evaluate((el) => el.tagName)).toBe('BUTTON');

    await cta.click();
    await page.waitForTimeout(1200);

    /* ONTO THE BUY BOX, 17 November (Jane). It used to land on the offer's
       headline, whose own button then scrolled her down a second time. One
       tap now puts the price and the buy button in front of her. */
    const box = await page.evaluate(() => {
      const el = document.getElementById('offer-buy')!;
      const r = el.getBoundingClientRect();
      return {
        top: Math.round(r.top),
        clearOfTheHeader: r.top > 8,
        topOnScreen: r.top >= 0 && r.top < window.innerHeight / 2,
      };
    });
    expect(box.topOnScreen, `the buy box starts at ${box.top}px`).toBe(true);
    /* The app header is sticky, so landing at exactly 0 hides it under. */
    expect(box.clearOfTheHeader, 'the buy box is under the app header').toBe(true);
    expect(page.url(), 'the button navigated').toContain('/quiz/welcome-video');
  });

  test('checkout from here is the same cart link as always', async ({ page }) => {
    /* THE WHOLE POINT OF EMBEDDING R2 RATHER THAN REBUILDING IT. If this
       drifts, the orders stop being attributable to the quiz. */
    await page.goto('/quiz/welcome-video');
    const hrefs = await page.locator('a[href*="shop.jjsmithonline.com/cart"]')
      .evaluateAll((as) => [...new Set(as.map((a) => (a as HTMLAnchorElement).href))]);
    expect(hrefs.length, 'no cart link on the screen').toBeGreaterThan(0);

    for (const h of hrefs) {
      const u = new URL(h);
      expect(u.searchParams.get('utm_campaign'), h).toBe('hf_quiz');
      expect(u.searchParams.get('hf_funnel'), h).toBe('quiz');
      expect(u.searchParams.get('attributes[hf_funnel]'), h).toBe('quiz');
      /* The cart, not the checkout. */
      if (u.pathname.includes(':')) {
        expect(u.searchParams.get('storefront'), h).toBe('true');
      }
    }
  });

  test('the result screen names the video, not a plan', async ({ page }) => {
    await page.goto('/quiz/result');
    await expect(page.locator('.actionBar .cta'))
      .toHaveText(/WATCH WHAT THIS MEANS/);
    await expect(page.locator('.actionBar .cta')).not.toHaveText(/SEE MY PLAN/);
    /* And it goes where it says it goes. */
    await page.locator('.actionBar .cta').click();
    await expect(page).toHaveURL(/\/quiz\/welcome-video$/);
  });

  test('plan and the offer keep their own addresses', async ({ page }) => {
    /* Nothing was deleted to make room for the video: see vsl.ts. */
    for (const [slug, re] of [
      ['your-plan', /plan/i], ['your-kit', /./], ['kit', /./],
    ] as [string, RegExp][]) {
      await page.goto(`/quiz/${slug}`);
      await expect(heading(page), `/quiz/${slug} is gone`).toHaveCount(1);
      await expect(page).toHaveURL(new RegExp(`/quiz/${slug}$`));
      expect(await heading(page).textContent()).toMatch(re);
    }
  });
});
