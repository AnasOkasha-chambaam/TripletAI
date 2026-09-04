import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// No incrementalCache override on purpose.
//
// An R2/KV incremental cache only earns its place if a route actually uses ISR,
// and nothing here does: there is no `export const revalidate`, no
// `generateStaticParams`, and no route segment config anywhere in app/. The one
// cache call in the codebase is revalidatePath("/dashboard") inside a server
// action (lib/actions/room.actions.ts), which invalidates the client router
// cache for an already-dynamic route — it does not need a shared cache backend.
//
// Adding one anyway would mean an extra binding, an extra R2 bucket to provision
// and pay for, and a failure mode to debug, all for a cache nothing reads.
export default defineCloudflareConfig();
