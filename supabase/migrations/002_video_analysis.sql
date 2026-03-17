-- ============================================================================
-- Video Analysis Schema
-- Stores ML analysis results from cricket-analyzer and football_cv_analysis
-- ============================================================================

-- Table to store full analysis results per video
CREATE TABLE IF NOT EXISTS video_analyses (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id        uuid NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  athlete_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sport           text NOT NULL,
  analysis_subtype text,  -- e.g. 'batting', 'bowling' for cricket; null for football
  status          text NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING','RUNNING','COMPLETED','FAILED')),
  analysis_json   jsonb,
  overall_score   numeric(5,2),
  grade           text,
  error_message   text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  completed_at    timestamptz
);

CREATE INDEX IF NOT EXISTS idx_analysis_video ON video_analyses (video_id);
CREATE INDEX IF NOT EXISTS idx_analysis_athlete ON video_analyses (athlete_id, created_at DESC);

-- RLS
ALTER TABLE video_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athletes can view own analyses"
  ON video_analyses FOR SELECT USING (auth.uid() = athlete_id);
CREATE POLICY "Athletes can manage own analyses"
  ON video_analyses FOR ALL USING (auth.uid() = athlete_id);

-- Add analysis sport column to videos table
ALTER TABLE videos ADD COLUMN IF NOT EXISTS analysis_sport text;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS analysis_subtype text;

-- ── GRANTS ────────────────────────────────────────────────────────────────
-- Required for Supabase — the authenticated role needs explicit table access
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Users table (needed for auto-creating user row on first upload)
GRANT ALL ON users TO authenticated;
GRANT SELECT ON users TO anon;

-- Athlete profiles
GRANT ALL ON athlete_profiles TO authenticated;
GRANT SELECT ON athlete_profiles TO anon;

-- Video analyses
GRANT ALL ON video_analyses TO authenticated;
GRANT SELECT ON video_analyses TO anon;

-- Videos table
GRANT ALL ON videos TO authenticated;
GRANT SELECT ON videos TO anon;
