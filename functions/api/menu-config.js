// Cloudflare Pages Function: /api/menu-config
// Reads and persists Smoker Menu, Packages, Party Pans, Delivery Rules, and Weekly Chalkboard
// in Supabase `allthesmoke.menu_live_config` (zero extra SQL tables required).
import { supabaseRequest } from "./_supabase.js";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const ACTIVE_ROW_ID = "active-menu-config";
const CHALKBOARD_ROW_ID = "active-chalkboard";

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: cors });
}

export async function onRequestGet(context) {
  const env = context.env || {};
  const res = await supabaseRequest(env, "menu_live_config", {
    method: "GET",
    query: `id=in.(${ACTIVE_ROW_ID},${CHALKBOARD_ROW_ID})&select=*`,
  });

  if (!res.ok) {
    return new Response(
      JSON.stringify({
        success: false,
        liveOverrides: null,
        priceConfig: null,
        chalkboard: null,
        error: res.error,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...cors } }
    );
  }

  const rows = Array.isArray(res.data) ? res.data : [];
  const menuRow = rows.find((r) => r.id === ACTIVE_ROW_ID) || null;
  const chalkRow = rows.find((r) => r.id === CHALKBOARD_ROW_ID) || null;

  return new Response(
    JSON.stringify({
      success: true,
      liveOverrides: menuRow?.live_overrides || null,
      priceConfig: menuRow?.price_config || null,
      chalkboard: chalkRow?.price_config || null,
    }),
    { status: 200, headers: { "Content-Type": "application/json", ...cors } }
  );
}

export async function onRequestPost(context) {
  try {
    const env = context.env || {};
    const body = await context.request.json();
    const { liveOverrides, priceConfig, chalkboard } = body || {};

    if (chalkboard && typeof chalkboard === "object") {
      const chalkRes = await supabaseRequest(env, "menu_live_config", {
        method: "POST",
        prefer: "resolution=merge-duplicates,return=representation",
        body: {
          id: CHALKBOARD_ROW_ID,
          live_overrides: {},
          price_config: chalkboard,
          updated_at: new Date().toISOString(),
        },
      });
      if (!chalkRes.ok) {
        return new Response(
          JSON.stringify({ success: false, error: chalkRes.error, code: chalkRes.code }),
          { status: chalkRes.status || 500, headers: { "Content-Type": "application/json", ...cors } }
        );
      }
      if (!liveOverrides && !priceConfig) {
        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { "Content-Type": "application/json", ...cors } }
        );
      }
    }

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
