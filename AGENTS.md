# Project architecture
- Keep TanStack Start’s file routes and bootstrap when importing upstream files; adapt React Router imports through `src/lib/rr.tsx` so the deployed runtime has a valid entry point.
- Render both quiz entry routes inside ClientOnly because saved answers and list-link state are browser-owned.
- Load PostHog lazily behind the shared analytics module to keep server imports safe.
- Capture session attribution before hydrated cart links render so buying links retain incoming tracking.
- Keep the VSL switch in its browser-safe configuration module and embed the shared offer without another Screen wrapper to prevent competing scroll resets.