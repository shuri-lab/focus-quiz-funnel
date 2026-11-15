import { useEffect, useRef, useState } from 'react';
import { VSL_ASPECT, VSL_EMBED_URL } from '../lib/vsl';
import { VSL_PLAYER_TITLE } from '../lib/vslCopy';

/**
 * THE VIDEO FROM JJ, in a 4:5 box because she is holding a phone.
 *
 * LAZY MOUNTED. The iframe is not in the document until the box is near the
 * viewport, so a woman who lands on this screen does not pay for Loom's
 * player before she has read the headline above it. Once mounted it stays:
 * unmounting a player she has started is the one thing worse than loading
 * it early.
 *
 * NOT AUTOPLAYED. See the note in vsl.ts.
 *
 * WHAT WE CANNOT MEASURE. The iframe is cross-origin, so there is no
 * timeupdate, no duration and no honest retention curve. `onInteract` is
 * the nearest true thing: the browser moves focus into the iframe when she
 * clicks inside it, so a window blur with the iframe focused means she
 * touched the player. It does NOT mean the video played, and it fires at
 * most once. Loom's own dashboard is where watch time lives.
 */
export function VslPlayer({ onInteract }: { onInteract?: () => void } = {}) {
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return undefined;
    /* No IntersectionObserver, no lazy loading: show the player. */
    if (typeof IntersectionObserver === 'undefined') { setMounted(true); return undefined; }

    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setMounted(true); io.disconnect(); }
    }, { rootMargin: '400px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!mounted || !onInteract) return undefined;
    let fired = false;
    const onBlur = () => {
      if (fired) return;
      if (document.activeElement !== frame.current) return;
      fired = true;
      onInteract();
    };
    window.addEventListener('blur', onBlur);
    return () => window.removeEventListener('blur', onBlur);
  }, [mounted, onInteract]);

  return (
    <div className="vslPlayer" ref={box}>
      <div className="vslFrame" style={{ paddingBottom: VSL_ASPECT }}>
        {mounted && (
          <iframe
            ref={frame}
            src={VSL_EMBED_URL}
            title={VSL_PLAYER_TITLE}
            frameBorder="0"
            allowFullScreen
            allow="fullscreen; picture-in-picture"
          />
        )}
      </div>
    </div>
  );
}
