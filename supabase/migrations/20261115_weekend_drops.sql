-- Live Weekend Drop toggle & config for all visitors
-- Schema: allthesmoke

CREATE TABLE IF NOT EXISTS allthesmoke.weekend_drops (
  id TEXT PRIMARY KEY,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE allthesmoke.weekend_drops ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read weekend_drops" ON allthesmoke.weekend_drops;
CREATE POLICY "Public read weekend_drops"
  ON allthesmoke.weekend_drops
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin write weekend_drops" ON allthesmoke.weekend_drops;
CREATE POLICY "Admin write weekend_drops"
  ON allthesmoke.weekend_drops
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
