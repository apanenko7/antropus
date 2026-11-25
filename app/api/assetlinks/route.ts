/**
 * Digital Asset Links for the Android app (TWA), served at /.well-known/assetlinks.json via a rewrite in next.config.ts.
 * Without it the app opens with a browser URL bar. Values come from env vars (both are public, not secrets):
 *  - ANDROID_PACKAGE_NAME, e.g. "app.atropus.twa"
 *  - ANDROID_SHA256_CERT_FINGERPRINTS: comma-separated SHA-256 fingerprints; include the Play App Signing key
 *    (Play Console → Test and release → App integrity) and the upload key if you test local builds.
 */
export function GET() {
  const packageName = process.env.ANDROID_PACKAGE_NAME?.trim();
  const fingerprints = (process.env.ANDROID_SHA256_CERT_FINGERPRINTS ?? "")
    .split(",")
    .map(f => f.trim().toUpperCase())
    .filter(Boolean);

  const body =
    packageName && fingerprints.length
      ? [
          {
            relation: ["delegate_permission/common.handle_all_urls"],
            target: { namespace: "android_app", package_name: packageName, sha256_cert_fingerprints: fingerprints },
          },
        ]
      : [];

  return Response.json(body, { headers: { "cache-control": "public, max-age=3600" } });
}
