-- ============================================================================
-- NEXUS Core Schema Migration
-- Run this in Supabase SQL Editor (Dashboard → SQL → New Query)
-- ============================================================================

-- ── ENUMS ─────────────────────────────────────────────────────────────────
CREATE TYPE user_role AS ENUM ('ATHLETE', 'SCOUT', 'ACADEMY');

CREATE TYPE plan_tier AS ENUM (
  'FREE', 'PRO', 'SCOUT_BASIC', 'SCOUT_PRO', 'ACADEMY_STANDARD', 'ACADEMY_ELITE'
);

CREATE TYPE sport_type AS ENUM (
  'FOOTBALL','CRICKET','KABADDI','ATHLETICS','BADMINTON','HOCKEY',
  'WRESTLING','BASKETBALL','VOLLEYBALL','TABLE_TENNIS','ARCHERY','KHO_KHO'
);

CREATE TYPE risk_level AS ENUM ('LOW', 'MODERATE', 'HIGH');

-- ── USERS TABLE ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         text UNIQUE NOT NULL,
  phone         text UNIQUE,
  role          user_role NOT NULL,
  plan          plan_tier NOT NULL DEFAULT 'FREE',
  plan_expires_at timestamptz,
  onboarding_complete boolean NOT NULL DEFAULT false,
  avatar_url    text,
  full_name     text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  last_active_at timestamptz DEFAULT now(),
  is_verified   boolean NOT NULL DEFAULT false,
  notification_prefs jsonb NOT NULL DEFAULT '{}'::jsonb
);

-- ── ATHLETE PROFILES ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS athlete_profiles (
  id              uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  username        text UNIQUE NOT NULL,
  sport           sport_type NOT NULL DEFAULT 'FOOTBALL',
  position_role   text,
  sport_data      jsonb NOT NULL DEFAULT '{}'::jsonb,
  nexus_score     numeric(5,2) NOT NULL DEFAULT 0,
  profile_strength integer NOT NULL DEFAULT 0
    CHECK (profile_strength >= 0 AND profile_strength <= 100),
  dob             date,
  gender          text,
  height_cm       numeric(5,1),
  weight_kg       numeric(5,1),
  city            text NOT NULL DEFAULT '',
  state           text NOT NULL DEFAULT '',
  current_academy_id uuid,
  skill_scores    jsonb DEFAULT '{}'::jsonb,
  injury_risk_level risk_level,
  is_looking_for_trial boolean NOT NULL DEFAULT true,
  visibility      text NOT NULL DEFAULT 'PUBLIC'
    CHECK (visibility IN ('PUBLIC','SCOUTS_ONLY','PRIVATE'))
);

CREATE INDEX IF NOT EXISTS idx_athlete_sport ON athlete_profiles (sport);
CREATE INDEX IF NOT EXISTS idx_athlete_score ON athlete_profiles (nexus_score DESC);

-- ── SCOUT PROFILES ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS scout_profiles (
  id                    uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  org_name              text NOT NULL DEFAULT '',
  org_tier              text,
  credential_doc_url    text,
  is_credential_verified boolean NOT NULL DEFAULT false,
  sports_specialisation text[] DEFAULT '{}',
  preferred_regions     text[] DEFAULT '{}',
  monthly_search_quota  integer NOT NULL DEFAULT 20,
  trial_invites_sent    integer NOT NULL DEFAULT 0
);

-- ── ACADEMIES ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS academies (
  id                uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  slug              text UNIQUE NOT NULL,
  name              text NOT NULL,
  sports_offered    sport_type[] NOT NULL DEFAULT '{}',
  tier              text,
  affiliation_badges text[] DEFAULT '{}',
  total_athletes    integer NOT NULL DEFAULT 0,
  reputation_score  numeric(5,2) DEFAULT 0,
  placement_stats   jsonb DEFAULT '{}'::jsonb,
  facility_tags     text[] DEFAULT '{}',
  subscription_seats integer DEFAULT 50
);

-- ── ACHIEVEMENTS ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS achievements (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id  uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       text NOT NULL,
  description text,
  level       text CHECK (level IN ('STATE','NATIONAL','INTERNATIONAL','CLUB')),
  sport       sport_type,
  year        integer,
  proof_url   text,
  is_verified boolean NOT NULL DEFAULT false,
  verified_by uuid REFERENCES users(id),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ── PERFORMANCE METRICS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS performance_metrics (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id  uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sport       sport_type NOT NULL,
  metric_key  text NOT NULL,
  value       numeric NOT NULL,
  unit        text,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  source      text DEFAULT 'manual'
    CHECK (source IN ('manual','wearable','cv_analysis','coach')),
  notes       text
);

CREATE INDEX IF NOT EXISTS idx_perf_athlete ON performance_metrics (athlete_id, sport, recorded_at DESC);

-- ── READINESS SCORES ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS readiness_scores (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id        uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date              date NOT NULL DEFAULT CURRENT_DATE,
  overall_score     integer CHECK (overall_score >= 0 AND overall_score <= 100),
  training_load     integer CHECK (training_load >= 0 AND training_load <= 100),
  recovery_quality  integer CHECK (recovery_quality >= 0 AND recovery_quality <= 100),
  sleep_hrs         numeric(3,1),
  wellness_note     text,
  momentum_7d       numeric(5,2),
  UNIQUE (athlete_id, date)
);

-- ── VIDEOS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS videos (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  s3_key          text NOT NULL,
  hls_playlist_url text,
  thumbnail_url   text,
  status          text NOT NULL DEFAULT 'UPLOADING'
    CHECK (status IN ('UPLOADING','PROCESSING','READY','FAILED')),
  is_ai_reel      boolean NOT NULL DEFAULT false,
  total_views     integer NOT NULL DEFAULT 0,
  scout_plays     integer NOT NULL DEFAULT 0,
  duration_secs   integer,
  sport_tags      text[] DEFAULT '{}',
  visibility      text NOT NULL DEFAULT 'PUBLIC'
    CHECK (visibility IN ('PUBLIC','SCOUTS_ONLY','PRIVATE')),
  title           text,
  display_order   integer NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ── CONVERSATIONS & MESSAGES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS conversations (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_a_id   uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  participant_b_id   uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type               text CHECK (type IN ('SCOUT_ATHLETE','SCOUT_ACADEMY','ACADEMY_ATHLETE')),
  last_message_at    timestamptz DEFAULT now(),
  last_message_preview text,
  unread_a           integer NOT NULL DEFAULT 0,
  unread_b           integer NOT NULL DEFAULT 0,
  UNIQUE (participant_a_id, participant_b_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content         text NOT NULL,
  type            text NOT NULL DEFAULT 'TEXT'
    CHECK (type IN ('TEXT','TRIAL_INVITE','SYSTEM','FILE')),
  metadata        jsonb DEFAULT '{}'::jsonb,
  sent_at         timestamptz NOT NULL DEFAULT now(),
  read_at         timestamptz,
  deleted_at      timestamptz
);

-- ── NOTIFICATIONS ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type        text NOT NULL,
  title       text NOT NULL,
  body        text,
  action_url  text,
  is_read     boolean NOT NULL DEFAULT false,
  priority    text DEFAULT 'MEDIUM'
    CHECK (priority IN ('LOW','MEDIUM','HIGH','URGENT')),
  sent_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notif_user ON notifications (user_id, sent_at DESC);

-- ── SCOUT MATCHES ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS scout_matches (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scout_id        uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  athlete_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  match_score     integer CHECK (match_score >= 0 AND match_score <= 100),
  match_reasons   jsonb DEFAULT '[]'::jsonb,
  viewed_at       timestamptz,
  is_shortlisted  boolean NOT NULL DEFAULT false,
  shortlist_priority integer,
  hidden_gem_flag boolean NOT NULL DEFAULT false,
  hot_streak_flag boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ── SHORTLISTS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS shortlists (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scout_id            uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  athlete_id          uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  position_target     text,
  development_timeline text,
  assessment_notes    text,
  star_rating         integer CHECK (star_rating >= 1 AND star_rating <= 5),
  watchlist_intelligence jsonb DEFAULT '{}'::jsonb,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- ── TRIAL INVITATIONS ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trial_invitations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scout_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  athlete_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  org_name      text NOT NULL,
  position      text,
  trial_start   timestamptz,
  trial_end     timestamptz,
  venue         text,
  status        text NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING','ACCEPTED','DECLINED','EXPIRED')),
  accepted_at   timestamptz,
  outcome       text CHECK (outcome IN ('SIGNED','REJECTED','NO_SHOW')),
  outcome_notes text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ── TOURNAMENTS ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tournaments (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organiser_id          uuid REFERENCES users(id) ON DELETE SET NULL,
  name                  text NOT NULL,
  sport                 sport_type NOT NULL,
  format                text,
  registration_deadline timestamptz,
  status                text NOT NULL DEFAULT 'DRAFT'
    CHECK (status IN ('DRAFT','REGISTRATION_OPEN','REGISTRATION_CLOSED','LIVE','COMPLETED','CANCELLED')),
  max_teams             integer,
  prize_pool_inr        integer,
  scout_access_list     uuid[] DEFAULT '{}',
  live_stream_url       text,
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- ── PAYMENTS & SUBSCRIPTIONS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  razorpay_order_id    text,
  razorpay_payment_id  text,
  razorpay_signature   text,
  amount_paise         integer NOT NULL,
  currency             text NOT NULL DEFAULT 'INR',
  plan                 plan_tier,
  status               text NOT NULL DEFAULT 'PENDING',
  gst_amount           integer DEFAULT 0,
  created_at           timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan                   plan_tier NOT NULL,
  billing_cycle          text CHECK (billing_cycle IN ('MONTHLY','ANNUAL')),
  starts_at              timestamptz NOT NULL DEFAULT now(),
  ends_at                timestamptz,
  auto_renew             boolean NOT NULL DEFAULT true,
  razorpay_subscription_id text,
  status                 text NOT NULL DEFAULT 'ACTIVE'
    CHECK (status IN ('ACTIVE','CANCELLED','EXPIRED','TRIAL'))
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE athlete_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scout_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE academies ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE readiness_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE scout_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE shortlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE trial_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- ── USERS RLS ─────────────────────────────────────────────────────────────
CREATE POLICY "Users can read own row"
  ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own row"
  ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own row"
  ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- ── ATHLETE PROFILES RLS ──────────────────────────────────────────────────
CREATE POLICY "Public athlete profiles are readable"
  ON athlete_profiles FOR SELECT
  USING (visibility = 'PUBLIC' OR auth.uid() = id);
CREATE POLICY "Athletes can update own profile"
  ON athlete_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Athletes can insert own profile"
  ON athlete_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ── SCOUT PROFILES RLS ───────────────────────────────────────────────────
CREATE POLICY "Scout profiles readable by owner"
  ON scout_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Scouts can update own profile"
  ON scout_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Scouts can insert own profile"
  ON scout_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ── ACADEMIES RLS ─────────────────────────────────────────────────────────
CREATE POLICY "Academies are publicly readable"
  ON academies FOR SELECT USING (true);
CREATE POLICY "Academy owner can update"
  ON academies FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Academy owner can insert"
  ON academies FOR INSERT WITH CHECK (auth.uid() = id);

-- ── ACHIEVEMENTS RLS ──────────────────────────────────────────────────────
CREATE POLICY "Achievements are publicly readable"
  ON achievements FOR SELECT USING (true);
CREATE POLICY "Athletes can manage own achievements"
  ON achievements FOR ALL USING (auth.uid() = athlete_id);

-- ── VIDEOS RLS ────────────────────────────────────────────────────────────
CREATE POLICY "Public videos are readable"
  ON videos FOR SELECT
  USING (visibility = 'PUBLIC' OR auth.uid() = owner_id);
CREATE POLICY "Owners can manage own videos"
  ON videos FOR ALL USING (auth.uid() = owner_id);

-- ── NOTIFICATIONS RLS ─────────────────────────────────────────────────────
CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- ── CONVERSATIONS RLS ─────────────────────────────────────────────────────
CREATE POLICY "Participants can access conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = participant_a_id OR auth.uid() = participant_b_id);

-- ── MESSAGES RLS ──────────────────────────────────────────────────────────
CREATE POLICY "Conversation participants can read messages"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
      AND (auth.uid() = c.participant_a_id OR auth.uid() = c.participant_b_id)
    )
  );
CREATE POLICY "Users can send messages"
  ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- ── SCOUT MATCHES RLS ─────────────────────────────────────────────────────
CREATE POLICY "Scouts can view own matches"
  ON scout_matches FOR SELECT USING (auth.uid() = scout_id);
CREATE POLICY "Athletes can see their matches"
  ON scout_matches FOR SELECT USING (auth.uid() = athlete_id);

-- ── SHORTLISTS RLS (scout only — athlete cannot see) ──────────────────────
CREATE POLICY "Scouts can manage own shortlists"
  ON shortlists FOR ALL USING (auth.uid() = scout_id);

-- ── TRIAL INVITATIONS RLS ─────────────────────────────────────────────────
CREATE POLICY "Scouts can manage own trial invitations"
  ON trial_invitations FOR ALL USING (auth.uid() = scout_id);
CREATE POLICY "Athletes can view their trial invitations"
  ON trial_invitations FOR SELECT USING (auth.uid() = athlete_id);
CREATE POLICY "Athletes can update trial status"
  ON trial_invitations FOR UPDATE USING (auth.uid() = athlete_id);

-- ── TOURNAMENTS RLS ───────────────────────────────────────────────────────
CREATE POLICY "Tournaments are publicly readable"
  ON tournaments FOR SELECT USING (true);
CREATE POLICY "Organisers can manage own tournaments"
  ON tournaments FOR ALL USING (auth.uid() = organiser_id);

-- ── PAYMENTS RLS ──────────────────────────────────────────────────────────
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT USING (auth.uid() = user_id);

-- ── SUBSCRIPTIONS RLS ─────────────────────────────────────────────────────
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- ── PERFORMANCE METRICS RLS ───────────────────────────────────────────────
CREATE POLICY "Athletes can manage own metrics"
  ON performance_metrics FOR ALL USING (auth.uid() = athlete_id);
CREATE POLICY "Public metrics are readable"
  ON performance_metrics FOR SELECT USING (true);

-- ── READINESS SCORES RLS ──────────────────────────────────────────────────
CREATE POLICY "Athletes can manage own readiness"
  ON readiness_scores FOR ALL USING (auth.uid() = athlete_id);

-- ============================================================================
-- HELPER: Disable email confirmation for dev (run in Supabase Dashboard)
-- Auth → Settings → Toggle OFF "Enable email confirmations"
-- ============================================================================
