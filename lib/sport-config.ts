// Central sport configuration — drives AI matching, UI colors, positions, stats
// Adding a new sport = add a row here, zero code changes elsewhere

export type SportKey =
  | "football" | "cricket" | "kabaddi" | "athletics"
  | "badminton" | "hockey" | "wrestling" | "kho_kho"
  | "basketball" | "volleyball" | "table_tennis" | "archery"

export interface SportConfig {
  id: SportKey
  label: string
  emoji: string
  color: string          // CSS var reference
  colorHex: string       // direct hex for inline styles
  positions: { id: string; label: string; abbr: string }[]
  primaryMetrics: { id: string; label: string; emoji: string; unit?: string }[]
  videoTypes: string[]
  scoutTiers: string[]
  injuryZones: string[]
  ageGroups: string[]
}

export const SPORT_CONFIG: Record<SportKey, SportConfig> = {
  football: {
    id: "football",
    label: "Football",
    emoji: "⚽",
    color: "var(--sport-football)",
    colorHex: "#00F574",
    positions: [
      { id: "GK", label: "Goalkeeper", abbr: "GK" },
      { id: "CB", label: "Centre-Back", abbr: "CB" },
      { id: "LB", label: "Left-Back", abbr: "LB" },
      { id: "RB", label: "Right-Back", abbr: "RB" },
      { id: "CDM", label: "Defensive Midfielder", abbr: "CDM" },
      { id: "CM", label: "Central Midfielder", abbr: "CM" },
      { id: "CAM", label: "Attacking Midfielder", abbr: "CAM" },
      { id: "LW", label: "Left Winger", abbr: "LW" },
      { id: "RW", label: "Right Winger", abbr: "RW" },
      { id: "ST", label: "Second Striker", abbr: "ST" },
      { id: "CF", label: "Centre Forward", abbr: "CF" },
    ],
    primaryMetrics: [
      { id: "speed", label: "Sprint Speed", emoji: "⚡" },
      { id: "dribbling", label: "Dribbling", emoji: "🎯" },
      { id: "ball_control", label: "Ball Control", emoji: "🏈" },
      { id: "shooting", label: "Shooting Accuracy", emoji: "🎯" },
      { id: "passing", label: "Passing Range", emoji: "📐" },
      { id: "defensive", label: "Defensive Work Rate", emoji: "🛡️" },
      { id: "game_intelligence", label: "Game Intelligence", emoji: "🧠" },
    ],
    videoTypes: ["Match Full", "Match Clip", "Free-Kick / Set Piece", "Dribbling Drill", "Sprint Session", "Training Ground", "ISL Trial Recording", "GK Reflexes", "Penalty Shootout"],
    scoutTiers: ["ISL", "I-League", "I2 League", "State League", "Khelo India"],
    injuryZones: ["Hamstring", "Knee/ACL", "Groin", "Ankle"],
    ageGroups: ["U-12", "U-14", "U-17", "U-19", "U-21", "Senior"],
  },

  cricket: {
    id: "cricket",
    label: "Cricket",
    emoji: "🏏",
    color: "var(--sport-cricket)",
    colorHex: "#00C9B1",
    positions: [
      { id: "BATSMAN", label: "Batsman", abbr: "BAT" },
      { id: "PACE_BOWLER", label: "Pace Bowler", abbr: "PACE" },
      { id: "SPIN_BOWLER", label: "Spin Bowler", abbr: "SPIN" },
      { id: "ALL_ROUNDER", label: "All-Rounder", abbr: "AR" },
      { id: "WICKET_KEEPER", label: "Wicket-Keeper", abbr: "WK" },
    ],
    primaryMetrics: [
      { id: "batting_avg", label: "Batting Average", emoji: "🏏" },
      { id: "strike_rate", label: "Strike Rate", emoji: "⚡" },
      { id: "bowling_avg", label: "Bowling Average", emoji: "🎳" },
      { id: "economy", label: "Economy Rate", emoji: "📊" },
      { id: "fielding", label: "Fielding", emoji: "🤸" },
      { id: "fitness", label: "Fitness", emoji: "💪" },
    ],
    videoTypes: ["Batting Innings", "Bowling Spell", "Fielding Highlights", "Net Session (Batting)", "Net Session (Bowling)", "Wicket-Keeping Session", "Match Full", "Trial Recording"],
    scoutTiers: ["IPL Academy", "BCCI State", "NCA", "Ranji Trophy", "Khelo India"],
    injuryZones: ["Lower Back", "Knee", "Shoulder", "Shin"],
    ageGroups: ["U-16", "U-19", "U-23", "Senior"],
  },

  kabaddi: {
    id: "kabaddi",
    label: "Kabaddi",
    emoji: "🤼",
    color: "var(--sport-kabaddi)",
    colorHex: "#F72585",
    positions: [
      { id: "RAIDER", label: "Raider", abbr: "RAI" },
      { id: "DEFENDER", label: "Defender", abbr: "DEF" },
      { id: "ALL_ROUNDER", label: "All-Rounder", abbr: "AR" },
    ],
    primaryMetrics: [
      { id: "raid_success", label: "Raid Success Rate", emoji: "⚡", unit: "%" },
      { id: "escape_rate", label: "Escape Rate", emoji: "🏃", unit: "%" },
      { id: "tackle_success", label: "Tackle Success Rate", emoji: "🛡️", unit: "%" },
      { id: "touch_points", label: "Touch Points/Match", emoji: "👆" },
      { id: "stamina", label: "Stamina", emoji: "💪" },
      { id: "agility", label: "Agility", emoji: "🤸" },
    ],
    videoTypes: ["Raid Compilation", "Tackle Compilation", "Full Match", "Do-or-Die Raid", "Lobby Defence", "Training Session"],
    scoutTiers: ["PKL", "Khelo India", "National Federation", "State Association"],
    injuryZones: ["Knee Meniscus", "Shoulder", "Ankle", "Wrist"],
    ageGroups: ["U-18", "U-20", "Senior"],
  },

  athletics: {
    id: "athletics",
    label: "Athletics",
    emoji: "🏃",
    color: "var(--sport-athletics)",
    colorHex: "#3B82F6",
    positions: [
      { id: "100m", label: "100m Sprint", abbr: "100m" },
      { id: "200m", label: "200m Sprint", abbr: "200m" },
      { id: "400m", label: "400m Sprint", abbr: "400m" },
      { id: "800m", label: "800m Middle Distance", abbr: "800m" },
      { id: "1500m", label: "1500m", abbr: "1500m" },
      { id: "5000m", label: "5000m", abbr: "5000m" },
      { id: "hurdles", label: "Hurdles", abbr: "HUR" },
      { id: "long_jump", label: "Long Jump", abbr: "LJ" },
      { id: "high_jump", label: "High Jump", abbr: "HJ" },
      { id: "triple_jump", label: "Triple Jump", abbr: "TJ" },
      { id: "javelin", label: "Javelin", abbr: "JAV" },
      { id: "shot_put", label: "Shot Put", abbr: "SP" },
      { id: "discus", label: "Discus Throw", abbr: "DIS" },
    ],
    primaryMetrics: [
      { id: "pb", label: "Personal Best", emoji: "⏱️" },
      { id: "reaction_time", label: "Reaction Time", emoji: "⚡" },
      { id: "acceleration", label: "Acceleration", emoji: "🚀" },
      { id: "top_speed", label: "Top Speed", emoji: "💨" },
      { id: "endurance", label: "Endurance", emoji: "💪" },
      { id: "technique", label: "Technique", emoji: "🎯" },
    ],
    videoTypes: ["Race Recording", "Field Event Attempt", "Training Sprint", "Technique Drill", "Time Trial"],
    scoutTiers: ["SAI", "AFI", "State Athletics", "Asian Games", "Khelo India"],
    injuryZones: ["Hamstring", "Shin", "Achilles", "Knee"],
    ageGroups: ["U-16", "U-18", "U-20", "U-23", "Senior"],
  },

  badminton: {
    id: "badminton",
    label: "Badminton",
    emoji: "🏸",
    color: "var(--sport-badminton)",
    colorHex: "#A3E635",
    positions: [
      { id: "SINGLES", label: "Singles", abbr: "SGL" },
      { id: "DOUBLES", label: "Doubles", abbr: "DBL" },
      { id: "MIXED", label: "Mixed Doubles", abbr: "MXD" },
    ],
    primaryMetrics: [
      { id: "smash_accuracy", label: "Smash Accuracy", emoji: "💥", unit: "%" },
      { id: "court_coverage", label: "Court Coverage", emoji: "🗺️" },
      { id: "net_play", label: "Net Play", emoji: "🏸" },
      { id: "footwork", label: "Footwork", emoji: "👟" },
      { id: "reaction", label: "Reaction Time", emoji: "⚡" },
      { id: "endurance", label: "Stamina", emoji: "💪" },
    ],
    videoTypes: ["Singles Match", "Doubles Match", "Smash Compilation", "Footwork Drill", "Multi-Shuttle Drill", "Tournament Match"],
    scoutTiers: ["BAI", "Gopichand Academy", "SAI Badminton", "State Association"],
    injuryZones: ["Knee (Patellar)", "Shoulder (Rotator Cuff)", "Ankle", "Elbow"],
    ageGroups: ["Sub-Junior", "Junior", "U-21", "Senior"],
  },

  hockey: {
    id: "hockey",
    label: "Hockey",
    emoji: "🏑",
    color: "var(--sport-hockey)",
    colorHex: "#8B5CF6",
    positions: [
      { id: "GK", label: "Goalkeeper", abbr: "GK" },
      { id: "DEF", label: "Defender", abbr: "DEF" },
      { id: "MID", label: "Midfielder", abbr: "MID" },
      { id: "FWD", label: "Forward", abbr: "FWD" },
      { id: "DRAG", label: "Drag Flicker", abbr: "DF" },
    ],
    primaryMetrics: [
      { id: "drag_flick", label: "Drag Flick Speed", emoji: "💨", unit: "km/h" },
      { id: "pass_accuracy", label: "Pass Accuracy", emoji: "🎯", unit: "%" },
      { id: "dribbling", label: "Dribbling", emoji: "🏑" },
      { id: "tackling", label: "Tackling", emoji: "🛡️" },
      { id: "penalty_corner", label: "Penalty Corner", emoji: "🎯", unit: "%" },
      { id: "speed", label: "Speed", emoji: "⚡" },
    ],
    videoTypes: ["Match Full", "Drag Flick Compilation", "Penalty Corner Session", "Dribbling Drill", "Training Session"],
    scoutTiers: ["Hockey India", "SAI Hockey", "Oil India", "Odisha Hockey", "State Association"],
    injuryZones: ["Knee (Turf)", "Lower Back", "Ankle", "Hand/Wrist"],
    ageGroups: ["U-16", "U-18", "U-21", "Senior"],
  },

  wrestling: {
    id: "wrestling",
    label: "Wrestling",
    emoji: "🤸",
    color: "var(--sport-wrestling)",
    colorHex: "#EF4444",
    positions: [
      { id: "FREESTYLE", label: "Freestyle", abbr: "FS" },
      { id: "GRECO", label: "Greco-Roman", abbr: "GR" },
      { id: "KUSHTI", label: "Kushti (Traditional)", abbr: "KUS" },
    ],
    primaryMetrics: [
      { id: "takedown", label: "Takedown Success", emoji: "🤸", unit: "%" },
      { id: "escape_rate", label: "Escape Rate", emoji: "🏃", unit: "%" },
      { id: "pin_rate", label: "Pin Attempt Rate", emoji: "📌" },
      { id: "strength", label: "Strength", emoji: "💪" },
      { id: "technique", label: "Technique", emoji: "🎯" },
      { id: "endurance", label: "Endurance", emoji: "⏱️" },
    ],
    videoTypes: ["Match Full", "Takedown Compilation", "Technique Drill", "Training Session"],
    scoutTiers: ["WFI", "Army Sports Institute", "SAI Wrestling", "Chhatrasal Akhara", "State Association"],
    injuryZones: ["Knee Ligament", "Shoulder", "Neck", "Rib"],
    ageGroups: ["U-15", "U-20", "U-23", "Senior"],
  },

  kho_kho: {
    id: "kho_kho",
    label: "Kho-Kho",
    emoji: "🏃",
    color: "var(--sport-kho)",
    colorHex: "#FBBF24",
    positions: [
      { id: "CHASER", label: "Chaser (Runner)", abbr: "CHS" },
      { id: "DEFENDER", label: "Defender", abbr: "DEF" },
    ],
    primaryMetrics: [
      { id: "catches", label: "Catches/Turn", emoji: "✋" },
      { id: "survival_time", label: "Defender Survival", emoji: "⏱️", unit: "s" },
      { id: "tapping_accuracy", label: "Tapping Accuracy", emoji: "🎯", unit: "%" },
      { id: "speed", label: "Speed", emoji: "⚡" },
      { id: "agility", label: "Agility", emoji: "🤸" },
      { id: "stamina", label: "Stamina", emoji: "💪" },
    ],
    videoTypes: ["Chasing Compilation", "Defence Highlights", "Full Match", "Training Session"],
    scoutTiers: ["Ultimate Kho-Kho", "KKFI", "Khelo India", "State Association"],
    injuryZones: ["Ankle", "Knee", "Shoulder", "Hamstring"],
    ageGroups: ["U-17", "U-21", "Senior"],
  },

  basketball: {
    id: "basketball",
    label: "Basketball",
    emoji: "🏀",
    color: "var(--sport-basketball)",
    colorHex: "#F97316",
    positions: [
      { id: "PG", label: "Point Guard", abbr: "PG" },
      { id: "SG", label: "Shooting Guard", abbr: "SG" },
      { id: "SF", label: "Small Forward", abbr: "SF" },
      { id: "PF", label: "Power Forward", abbr: "PF" },
      { id: "C", label: "Centre", abbr: "C" },
    ],
    primaryMetrics: [
      { id: "points", label: "Points/Game", emoji: "🏀" },
      { id: "assists", label: "Assists/Game", emoji: "📐" },
      { id: "rebounds", label: "Rebounds/Game", emoji: "💪" },
      { id: "fg_pct", label: "FG %", emoji: "🎯", unit: "%" },
      { id: "vertical", label: "Vertical Jump", emoji: "⬆️", unit: "cm" },
      { id: "speed", label: "Court Speed", emoji: "⚡" },
    ],
    videoTypes: ["Full Game", "Highlight Reel", "Shooting Drill", "3x3 Match", "Tournament Recording"],
    scoutTiers: ["BFI", "NBA Basketball Without Borders", "3BL", "DBL College", "SAI Basketball"],
    injuryZones: ["Ankle", "Knee", "Lower Back", "Finger"],
    ageGroups: ["U-16", "U-18", "U-21", "Senior"],
  },

  volleyball: {
    id: "volleyball",
    label: "Volleyball",
    emoji: "🏐",
    color: "var(--sport-volleyball)",
    colorHex: "#06B6D4",
    positions: [
      { id: "SETTER", label: "Setter", abbr: "SET" },
      { id: "OH", label: "Outside Hitter", abbr: "OH" },
      { id: "OPP", label: "Opposite Hitter", abbr: "OPP" },
      { id: "MB", label: "Middle Blocker", abbr: "MB" },
      { id: "LIBERO", label: "Libero", abbr: "LIB" },
    ],
    primaryMetrics: [
      { id: "kills", label: "Kills/Set", emoji: "💥" },
      { id: "kill_pct", label: "Kill %", emoji: "🎯", unit: "%" },
      { id: "blocks", label: "Blocks/Set", emoji: "🛡️" },
      { id: "aces", label: "Ace Serves/Set", emoji: "🏐" },
      { id: "digs", label: "Dig Success", emoji: "🤸", unit: "%" },
      { id: "jump_height", label: "Spike Height", emoji: "⬆️", unit: "cm" },
    ],
    videoTypes: ["Full Set", "Spike Compilation", "Serve Drill", "Beach Volleyball", "Tournament Match"],
    scoutTiers: ["VFI", "Prime Volleyball League", "SAI Volleyball", "State Association"],
    injuryZones: ["Knee (Jumper's)", "Shoulder", "Ankle", "Finger"],
    ageGroups: ["U-18", "U-21", "Senior"],
  },

  table_tennis: {
    id: "table_tennis",
    label: "Table Tennis",
    emoji: "🏓",
    color: "var(--sport-tabletennis)",
    colorHex: "#EC4899",
    positions: [
      { id: "OFFENSIVE", label: "Offensive (Attacker)", abbr: "ATT" },
      { id: "DEFENSIVE", label: "Defensive (Chopper)", abbr: "DEF" },
      { id: "ALL_ROUND", label: "All-Round", abbr: "AR" },
    ],
    primaryMetrics: [
      { id: "point_win", label: "Point Win Rate", emoji: "🏓", unit: "%" },
      { id: "first_attack", label: "First Attack %", emoji: "⚡", unit: "%" },
      { id: "loop_kill", label: "Loop Kill %", emoji: "💥", unit: "%" },
      { id: "service_ace", label: "Service Ace Rate", emoji: "🎯", unit: "%" },
      { id: "footwork", label: "Footwork", emoji: "👟" },
      { id: "reaction", label: "Reaction Speed", emoji: "⚡" },
    ],
    videoTypes: ["Singles Match", "Doubles Match", "Forehand Drill", "Service Practice", "Tournament Recording"],
    scoutTiers: ["TTFI", "PSPB", "State Association", "Dhyanchand Academy"],
    injuryZones: ["Elbow (Table Tennis)", "Shoulder", "Knee", "Wrist"],
    ageGroups: ["U-12", "U-15", "U-18", "U-21", "Senior"],
  },

  archery: {
    id: "archery",
    label: "Archery",
    emoji: "🎯",
    color: "var(--sport-archery)",
    colorHex: "#84CC16",
    positions: [
      { id: "RECURVE", label: "Recurve Bow", abbr: "REC" },
      { id: "COMPOUND", label: "Compound Bow", abbr: "COM" },
      { id: "TRADITIONAL", label: "Traditional (Barebow)", abbr: "TRAD" },
    ],
    primaryMetrics: [
      { id: "avg_score", label: "Avg Score/Arrow", emoji: "🎯" },
      { id: "grouping", label: "Arrow Grouping", emoji: "⭕", unit: "cm" },
      { id: "consistency", label: "Release Consistency", emoji: "📊", unit: "%" },
      { id: "distance_70m", label: "70m Score", emoji: "📏" },
      { id: "mental", label: "Mental Composure", emoji: "🧠" },
      { id: "technique", label: "Technique", emoji: "🎯" },
    ],
    videoTypes: ["70m Round", "Indoor 18m", "Release Form Analysis", "Competition Recording"],
    scoutTiers: ["AAI", "Jharkhand Archery", "SAI Archery", "Tata Archery Academy"],
    injuryZones: ["Elbow (Medial)", "Shoulder (Rotator Cuff)", "Thoracic Spine"],
    ageGroups: ["U-18", "U-21", "Senior"],
  },
}

// Helper functions
export function getSportConfig(sport: string): SportConfig {
  const key = sport.toLowerCase().replace(/[^a-z_]/g, "_").replace("kho-kho", "kho_kho").replace("table tennis", "table_tennis") as SportKey
  return SPORT_CONFIG[key] || SPORT_CONFIG.football
}

export function getSportColor(sport: string): string {
  return getSportConfig(sport).colorHex
}

export function getSportEmoji(sport: string): string {
  return getSportConfig(sport).emoji
}

export function getSportPositions(sport: string) {
  return getSportConfig(sport).positions
}

export const SPORT_LIST = Object.values(SPORT_CONFIG).map(s => ({
  id: s.id,
  label: s.label,
  emoji: s.emoji,
  color: s.colorHex,
}))

// Tier badge configs used across the platform
export const SCOUT_TIER_BADGES: Record<string, { label: string; color: string }> = {
  ISL:          { label: "ISL", color: "#9B5DFF" },
  I_LEAGUE:     { label: "I-League", color: "#9B5DFF" },
  IPL:          { label: "IPL Academy", color: "#FFB800" },
  PKL:          { label: "PKL", color: "#F72585" },
  SAI:          { label: "SAI", color: "#00D4FF" },
  AFI:          { label: "AFI", color: "#3B82F6" },
  BAI:          { label: "BAI", color: "#A3E635" },
  HOCKEY_INDIA: { label: "Hockey India", color: "#8B5CF6" },
  WFI:          { label: "WFI", color: "#EF4444" },
  KHELO_INDIA:  { label: "Khelo India", color: "#FFB800" },
  STATE:        { label: "State", color: "#00C9B1" },
  DISTRICT:     { label: "District", color: "#7A9E89" },
  PRIVATE:      { label: "Scout", color: "#7A9E89" },
}

// Risk level colors
export const RISK_COLORS = {
  LOW:      { text: "var(--nx-green)",  bg: "rgba(0,245,116,0.08)",   border: "rgba(0,245,116,0.22)" },
  MODERATE: { text: "var(--nx-amber)",  bg: "rgba(245,166,35,0.08)",  border: "rgba(245,166,35,0.22)" },
  HIGH:     { text: "var(--nx-red)",    bg: "rgba(255,59,48,0.08)",   border: "rgba(255,59,48,0.22)" },
}

// NexusScore™ color bands
export function scoreColor(score: number): string {
  if (score >= 80) return "var(--nx-cyan)"
  if (score >= 65) return "var(--nx-gold)"
  if (score >= 50) return "var(--nx-green)"
  if (score >= 35) return "var(--nx-amber)"
  return "var(--nx-red)"
}
