<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Upstream files import `react-router-dom`; on each pull rewrite that import to `@/lib/rr` (a TanStack shim) so files copy in unchanged. Quiz steps live in splat routes `/quiz/$` and `/$slug/quiz/$`. Why: keeps pulls mechanical.

- Keep PostHog behind the shared analytics module and load its browser SDK lazily; this preserves server-safe imports and one tracking boundary.

- Cart links on the Kit screen omit href until hydration and rebuild through the shared useHydrated hook after session capture; this ensures React updates server-rendered links with browser attribution.
- Bottle and kit quiz offers share one screen with explicit variants; only the bottle belongs to the normal flow, while the kit remains directly addressable until its fulfilment is available.
- Render the quiz inside TanStack ClientOnly at both entry routes because saved answers and list-link state are browser-owned and cannot match server-rendered quiz results.
- Keep the VSL flow switch in its browser-safe configuration module and embed the shared offer without a second Screen wrapper; this preserves reversible routing and prevents competing scroll/focus resets.
