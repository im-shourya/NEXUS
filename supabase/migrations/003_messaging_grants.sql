-- ============================================================================
-- Messaging & Chat Grants
-- Ensures authenticated users can access conversations, messages etc.
-- ============================================================================

-- Schema access
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Conversations
GRANT ALL ON conversations TO authenticated;
GRANT SELECT ON conversations TO anon;

-- Messages
GRANT ALL ON messages TO authenticated;
GRANT SELECT ON messages TO anon;

-- Notifications
GRANT ALL ON notifications TO authenticated;
GRANT SELECT ON notifications TO anon;

-- Athlete profiles (for discover)
GRANT ALL ON athlete_profiles TO authenticated;
GRANT SELECT ON athlete_profiles TO anon;

-- Scout profiles
GRANT ALL ON scout_profiles TO authenticated;
GRANT SELECT ON scout_profiles TO anon;

-- Users
GRANT ALL ON users TO authenticated;
GRANT SELECT ON users TO anon;

-- Videos & analysis
GRANT ALL ON videos TO authenticated;
GRANT ALL ON video_analyses TO authenticated;
