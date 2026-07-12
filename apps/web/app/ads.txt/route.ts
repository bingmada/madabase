export function GET() {
  return new Response("google.com, pub-4491218467179399, DIRECT, f08c47fec0942fa0\n", {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
