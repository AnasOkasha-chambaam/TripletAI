# TripletAI

TripletAI is an application designed to handle Supervised Learning Triplets. It provides an intuitive platform to efficiently manage and curate your supervised learning triplets.

## Purpose

The purpose of TripletAI is to streamline the process of managing supervised learning triplets, ensuring that no two actions from different users are taken on the same triplet simultaneously. This is achieved through real-time updates and locking mechanisms.

## Functionality

- **Add or Edit Triplets**: Users can add new triplets or edit existing ones.
- **View Locked Triplets**: Users can view triplets that are locked by other users to avoid conflicts.
- **Real-time Updates**: The application uses `socket.io` for real-time updates to ensure that all users have the latest information.
- **Embla Carousel**: The application uses the Embla Carousel to display triplets in a user-friendly manner.

## Setup Instructions

### Prerequisites

- **Node.js 24.20.0** (LTS "Krypton") — pinned in [`.nvmrc`](.nvmrc). With [nvm](https://github.com/nvm-sh/nvm), run `nvm install && nvm use` in the project root to pick it up.
- **pnpm 11.25.0** — pinned via the `packageManager` field in `package.json`. Any recent pnpm will download and switch to this exact version automatically, so no manual install step is needed.
- **Wrangler 4.128.0** — a normal devDependency, installed by `pnpm install`. No global install needed.

> **Note on deployment:** Vercel only supports pnpm 6–10 natively, and `lockfileVersion: 9.0` is ambiguous (pnpm 9, 10 and 11 all write it), so Vercel guesses an older pnpm. [`vercel.json`](vercel.json) therefore pins the install to pnpm 11.25.0 explicitly. For the same reason `package.json` deliberately has **no** `engines.pnpm` field — Vercel compares it against its own guessed version and hard-fails the build. Don't add it back.
>
> Cloudflare's build image has the same problem for a different reason: it does **not** read `packageManager` at all, and defaults to pnpm 10.11.1. pnpm 10 silently ignores the `allowBuilds` map in [`pnpm-workspace.yaml`](pnpm-workspace.yaml), so the pnpm version is pinned inside the Cloudflare build command too. See [Deploy on Cloudflare Workers](#deploy-on-cloudflare-workers).

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/AnasOkasha-chambaam/TripletAI
   cd tripletai
   ```

2. Install dependencies:

   ```sh
   pnpm install
   ```

3. Create a `.env` file in the root directory and add the necessary environment variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY=YOUR_CLERK_SECRET_KEY

ALLOWED_EMAILS=YOUR_EMAIL

MONGODB_URI=YOUR_MONGODB_URI

WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET

LIVEBLOCKS_SECRET_KEY=YOUR_LIVEBLOCKS_SECRET_KEY
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=YOUR_LIVEBLOCKS_PUBLIC_KEY

```

> `ALLOWED_EMAILS` absent or empty means **allow every signed-in user** (it logs a warning saying so). Set it to restrict access. `*` also means allow everyone.

For running the app as a Cloudflare Worker locally, copy the same values into a `.dev.vars` file — `wrangler` reads that rather than `.env`. Both are gitignored:

```sh
cp .env .dev.vars
```

4. Run the development server:

   ```sh
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Standout Features

- **Real-time Updates**: The application uses `liveblocks` to provide real-time updates, ensuring that all users have the latest information.
- **Embla Carousel**: The application uses the Embla Carousel to display triplets in a user-friendly manner.
- **Locking Mechanism**: The application ensures that no two actions from different users are taken on the same triplet simultaneously by locking triplets that are being edited.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment

This app deploys to **two** hosts, and both are supported peers — a change to one should not break the other.

### Deploy on Vercel

The install and build commands are pinned in [`vercel.json`](vercel.json). Nothing else is needed; pushing to `main` is enough.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Deploy on Cloudflare Workers

Runs through the [OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare), which compiles the Next build into a single Worker. Config lives in [`wrangler.jsonc`](wrangler.jsonc) and [`open-next.config.ts`](open-next.config.ts).

**Deploy from your machine:**

```sh
pnpm run deploy
```

> Use `pnpm run deploy`, **not** `pnpm deploy` — `deploy` is a built-in pnpm command, so without `run` pnpm runs its own thing and never touches this script.

Other scripts:

| Script | What it does |
| --- | --- |
| `pnpm preview` | Build the Worker and run it locally in workerd |
| `pnpm run deploy` | Build the Worker and deploy it |
| `pnpm upload` | Build and upload a version without routing traffic to it |
| `pnpm cf-typegen` | Regenerate `cloudflare-env.d.ts` from the bindings (gitignored) |

**Automatic deploys (Workers Builds)** are configured in the Cloudflare dashboard, not in this repo. The settings that must be there:

- **Build command:** `npx --yes pnpm@11.25.0 install --frozen-lockfile && npx --yes pnpm@11.25.0 run build`
- **Deploy command:** `npx wrangler deploy`
- **Variables and secrets:** every key from the `.env` block above must be set. The `NEXT_PUBLIC_*` ones are needed at *build* time, because Next inlines them into the client bundle.

**Things worth knowing about the Workers target:**

- **Cloudflare Images must be enabled** on the account. `sharp` cannot run on Workers, so the `IMAGES` binding in `wrangler.jsonc` provides image optimization instead.
- **MongoDB Atlas must allow `0.0.0.0/0`.** Workers egress from dynamic IPs and cannot be allowlisted by range. Use a least-privilege database user to compensate.
- **Database calls are slower here than on Vercel.** Workers give each request its own I/O context, so a connection cannot be pooled across requests; [`lib/dbConnect.ts`](lib/dbConnect.ts) detects the Workers runtime and reconnects per request (~1.5s), while keeping the global connection cache everywhere else.
- **Worker size:** the bundle is ~2.8 MiB gzipped against a 3 MiB limit on the Workers Free plan. That headroom is thin — if you add a large dependency or another big binary asset under `app/`, check `npx wrangler deploy --dry-run` before pushing.
