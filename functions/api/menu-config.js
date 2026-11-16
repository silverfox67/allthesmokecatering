// Cloudflare Pages Function: /api/menu-config
// Reads and persists Smoker Menu live availability & price config in Supabase `allthesmoke.menu_live_config`
import { supabaseRequest } from "./_supabase.js";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const ACTIVE_ROW_ID = "active-menu-config";

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: cors });
}

export async function onRequestGet(context) {
  const env = context.env || {};
  const res = await supabaseRequest(env, "menu_live_config", {
    method: "GET",
    query: `id=eq.${ACTIVE_ROW_ID}&select=*`,
  });

  if (!res.ok) {
    return new Response(
      JSON.stringify({ success: false, liveOverrides: null, priceConfig: null, error: res.error }),
      { status: 200, headers: { "Content-Type": "application/json", ...cors } }
    );
  }

  const row = Array.isArray(res.data) && res.data[0] ? res.data[0] : null;
  return new Response(
    JSON.stringify({
      success: true,
      liveOverrides: row?.live_overrides || null,
      priceConfig: row?.price_config || null,
    }),
    { status: 200, headers: { "Content-Type": "application/json", ...cors } }
  );
}

export async function onRequestPost(context) {
  try {
    const env = context.env || {};
    const body = await context.request.json();
    const { liveOverrides, priceConfig } = body || {};

    const payload = {
      id: ACTIVE_ROW_ID,
      updated_at: new Date().toISOString(),
    };
    if (liveOverrides && typeof liveOverrides === "object") {
      payload.live_overrides = liveOverrides;
    }
    if (priceConfig && typeof priceConfig === "object") {
      payload.price_config = priceConfig;
    }

    const res = await supabaseRequest(env, "menu_live_config", {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=representation",
      body: payload,
    });

    if (!res.ok) {
      return new Response(
        JSON.stringify({ success: false, error: res.error, code: res.code }),
        { status: res.status || 500, headers: { "Content-Type": "application/json", ...cors } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...cors } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message || "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...cors } }
    );
  }
}
