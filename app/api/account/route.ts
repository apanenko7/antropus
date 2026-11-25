import { getAdmin } from "@/lib/firebase/admin";

/**
 * DELETE /api/account — deletes the signed-in user's progress document and their Firebase Auth account.
 * Header: Authorization: Bearer <Firebase ID token>. Required by Google Play's account deletion policy.
 */
export async function DELETE(request: Request) {
  const admin = getAdmin();
  if (!admin.ok) {
    console.error("[api/account] Admin SDK unavailable:", admin.reason);
    return Response.json({ error: "Account service is not configured" }, { status: 503 });
  }

  const token = request.headers.get("authorization")?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

  let uid: string;
  try {
    uid = (await admin.auth.verifyIdToken(token)).uid;
  } catch (e) {
    console.warn("[api/account] ID token rejected:", (e as { code?: string }).code ?? (e as Error).message);
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await admin.db.collection("users").doc(uid).delete();
    await admin.auth.deleteUser(uid);
  } catch (e) {
    const code = (e as { code?: string }).code;
    // Already gone counts as success: the request is idempotent.
    if (code !== "auth/user-not-found") {
      console.error("[api/account] Delete failed:", code ?? (e as Error).message);
      return Response.json({ error: "Delete failed" }, { status: 500 });
    }
  }

  return new Response(null, { status: 204 });
}
