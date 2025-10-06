export async function GET() {
  return new Response(
    JSON.stringify({
      ok: true,
      t: Date.now(),
      commit: process.env.VERCEL_GIT_COMMIT_SHA || process.env.COMMIT_REF || "local",
    }),
    { headers: { "content-type": "application/json" } }
  );
}
