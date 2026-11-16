-- Live Smoker Menu & Price Configurator sync for all visitors
-- Schema: allthesmoke

CREATE TABLE IF NOT EXISTS allthesmoke.menu_live_config (
  id TEXT PRIMARY KEY,
  live_overrides JSONB NOT NULL DEFAULT '{}'::jsonb,
  price_config JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE allthesmoke.menu_live_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read menu_live_config" ON allthesmoke.menu_live_config;
CREATE POLICY "Public read menu_live_config"
  ON allthesmoke.menu_live_config
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin write menu_live_config" ON allthesmoke.menu_live_config;
CREATE POLICY "Admin write menu_live_config"
  ON allthesmoke.menu_live_config
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
