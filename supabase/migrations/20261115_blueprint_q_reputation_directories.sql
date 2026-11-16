-- Blueprint Q: Local Reputation Engine, Guided Review Sequence & Directories Verification Vault
-- Schema: allthesmoke

-- 1. Add review_status tracking to leads & orders so existing reviewers are never double-asked
ALTER TABLE IF EXISTS allthesmoke.leads
  ADD COLUMN IF NOT EXISTS review_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (review_status IN ('pending', 'sent', 'completed')),
  ADD COLUMN IF NOT EXISTS review_requested_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS review_completed_at TIMESTAMPTZ;

ALTER TABLE IF EXISTS allthesmoke.orders
  ADD COLUMN IF NOT EXISTS review_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (review_status IN ('pending', 'sent', 'completed')),
  ADD COLUMN IF NOT EXISTS review_requested_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS review_completed_at TIMESTAMPTZ;

-- 2. Directory Submission Tracker table
CREATE TABLE IF NOT EXISTS allthesmoke.directory_listings (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Not Started'
    CHECK (status IN ('Not Started', 'Docs Needed', 'Pending Verification', 'Live')),
  required_proof TEXT NOT NULL,
  claim_url TEXT NOT NULL,
  live_url TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE allthesmoke.directory_listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access on directory_listings" ON allthesmoke.directory_listings;
CREATE POLICY "Admin full access on directory_listings"
  ON allthesmoke.directory_listings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 3. Private Business Verification Vault (metadata only — never store raw SSN/EIN)
CREATE TABLE IF NOT EXISTS allthesmoke.verification_vault (
  doc_key TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  file_path TEXT DEFAULT '',
  uploaded_at TIMESTAMPTZ,
  verified BOOLEAN NOT NULL DEFAULT FALSE
);

ALTER TABLE allthesmoke.verification_vault ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access on verification_vault" ON allthesmoke.verification_vault;
CREATE POLICY "Admin full access on verification_vault"
  ON allthesmoke.verification_vault
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Private Supabase Storage bucket for Business License, Kitchen Lease, Utility Bill (NEVER public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('verification-docs', 'verification-docs', false)
ON CONFLICT (id) DO UPDATE SET public = false;

DROP POLICY IF EXISTS "Authenticated admin access to verification-docs" ON storage.objects;
CREATE POLICY "Authenticated admin access to verification-docs"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'verification-docs')
  WITH CHECK (bucket_id = 'verification-docs');
