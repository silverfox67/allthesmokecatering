// Shared Supabase PostgREST helper for Cloudflare Pages Functions
// Uses multi-tenant schema `allthesmoke` via Accept-Profile / Content-Profile headers.

export const SUPABASE_SCHEMA = "allthesmoke";

export function getSupabaseConfig(env = {}) {
  const url = (env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "");
  const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY || "";
  return {
    url,
    key,
    configured: Boolean(url && key),
  };
}

export async function supabaseRequest(env, table, options = {}) {
  const { url, key, configured } = getSupabaseConfig(env);
  if (!configured) {
    return {
      ok: false,
      status: 503,
      data: null,
      error: "Supabase environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) are not configured.",
      code: "NOT_CONFIGURED",
    };
  }

  const {
    method = "GET",
    query = "",
    body = undefined,
    prefer = "return=representation",
  } = options;

  const endpoint = `${url}/rest/v1/${table}${query ? `?${query}` : ""}`;
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };

  if (method === "GET" || method === "HEAD") {
    headers["Accept-Profile"] = SUPABASE_SCHEMA;
  } else {
    headers["Content-Profile"] = SUPABASE_SCHEMA;
    headers["Accept-Profile"] = SUPABASE_SCHEMA;
  }

  if (prefer && method !== "GET" && method !== "HEAD") {
    headers["Prefer"] = prefer;
  }

  try {
    const res = await fetch(endpoint, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    let parsed = null;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = text;
    }

    if (!res.ok) {
      const code = parsed && typeof parsed === "object" ? parsed.code || "" : "";
      const message =
        parsed && typeof parsed === "object"
          ? parsed.message || parsed.error || JSON.stringify(parsed)
          : String(parsed || `HTTP ${res.status}`);
      return {
        ok: false,
        status: res.status,
        data: null,
        error: message,
        code,
      };
    }

    return {
      ok: true,
      status: res.status,
      data: parsed,
      error: null,
      code: null,
    };
  } catch (err) {
    return {
      ok: false,
      status: 500,
      data: null,
      error: err instanceof Error ? err.message : "Network error contacting Supabase",
      code: "NETWORK_ERROR",
    };
  }
}

