// Cloudflare Pages Function: /api/weekend-drop
// Reads and persists the active Weekend Drop config + Live toggle in Supabase `allthesmoke.weekend_drops`
import { supabaseRequest } from "./_supabase.js";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const ACTIVE_ROW_ID = "active-weekend-drop";

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: cors });
}

export async function onRequestGet(context) {
  const env = context.env || {};
  const res = await supabaseRequest(env, "weekend_drops", {
    method: "GET",
    query: `id=eq.${ACTIVE_ROW_ID}&select=*`,
  });

  if (!res.ok) {
    return new Response(
      JSON.stringify({ success: false, drop: null, error: res.error, code: res.code }),
      { status: 200, headers: { "Content-Type": "application/json", ...cors } }
    );
  }

  const row = Array.isArray(res.data) && res.data[0] ? res.data[0] : null;
  const drop = row && row.payload ? { ...row.payload, isActive: Boolean(row.is_active) } : null;

  return new Response(
    JSON.stringify({ success: true, drop }),
    { status: 200, headers: { "Content-Type": "application/json", ...cors } }
  );
}

export async function onRequestPost(context) {
  try {
    const env = context.env || {};
    const drop = await context.request.json();
    if (!drop || typeof drop !== "object") {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid weekend drop payload" }),
        { status: 400, headers: { "Content-Type": "application/json", ...cors } }
      );
    }

    const res = await supabaseRequest(env, "weekend_drops", {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=representation",
      body: {
        id: ACTIVE_ROW_ID,
        is_active: Boolean(drop.isActive),
        payload: drop,
        updated_at: new Date().toISOString(),
      },
    });

    if (!res.ok) {
      return new Response(
        JSON.stringify({ success: false, error: res.error, code: res.code }),
        { status: res.status || 500, headers: { "Content-Type": "application/json", ...cors } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, drop }),
      { status: 200, headers: { "Content-Type": "application/json", ...cors } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message || "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...cors } }
    );
  }
}
