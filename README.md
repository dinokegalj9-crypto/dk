# Sensorium

> A journey through human consciousness and memory, told in scent.
> You are not buying a perfume — you are collecting the fragments of a life.

Sensorium is structured as **Chapters** (life stages / psychological eras) made of
**Fragments** (individual perfumes — pieces of memory, consciousness, emotion, identity).
Chapter I — *Origins* — is the active chapter; its first fragment, **Memorium (Fragment I)**,
is released.

Built with **Next.js (App Router) · TypeScript · Tailwind v4 · Framer Motion**.

## Preview it

### On your phone / sharing — deploy to Vercel (≈1 min, no local setup)
1. Go to **[vercel.com](https://vercel.com) → Add New → Project** and sign in with GitHub.
2. Import the **`dk`** repository.
3. Set **Production Branch** (or the deploy branch) to `claude/upbeat-bohr-Gp4s6`.
4. Framework auto-detects **Next.js** — no settings needed. Click **Deploy**.

You'll get a live URL (e.g. `dk-xxx.vercel.app`). Every push to that branch redeploys.

### On your computer
```bash
git clone https://github.com/dinokegalj9-crypto/dk.git
cd dk
git checkout claude/upbeat-bohr-Gp4s6
npm install
npm run dev          # http://localhost:3000  (live editing)
# or, the production build:
npm run build && npm run start
```

> Note: this can't be previewed from inside the cloud dev session — its `localhost` isn't
> reachable from your device. Use one of the two paths above.

## Structure

```
src/
├── app/                  routes (home, /the-library, /the-house, /fragrance/[slug], 404)
├── components/
│   ├── atmosphere/       the Void system, the hero (Surfacing), reveals, transitions
│   ├── chapter/          ChapterShowcase — the active chapter, collected fragment by fragment
│   ├── fragments/        Fragment — a piece of a chapter (vessel + hierarchy, or a shard)
│   ├── fragrance/        Composition + KeepPanel (the quiet facts and the way to keep it)
│   ├── layout/           Chrome (nav/menu/sound) + Footer
│   └── sections/         Philosophy (the House manifesto)
├── content/              chapters + fragments (typed; CMS-swappable)
├── lib/                  content adapter, motion, seo, format
└── types/                the content model
public/media/             the Memorium vessel image
```

The brand constitution and the full design/architecture rationale live in [`/docs`](./docs),
with a standalone token + component reference in [`/design-system`](./design-system).
