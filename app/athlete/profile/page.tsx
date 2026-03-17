"use client"

import { useEffect, useState } from "react"
import { MapPin, Calendar, Mail, Phone, Edit3, Trophy, Video, CheckCircle2, Share2, Download, Camera } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore, useUser } from "@/store/auth-store"
import { EditProfileModal } from "./edit-modal"

// Mock athlete data
const mockAthlete = {
  id: "ATH-2024-JH-0847",
  name: "Priya Sharma",
  sport: "Football",
  position: "Striker",
  secondaryPosition: "Attacking Midfielder",
  dateOfBirth: "2006-05-15",
  age: 19,
  gender: "Female",
  email: "priya.sharma@email.com",
  phone: "+91 98765 43210",
  state: "Jharkhand",
  district: "Ranchi",
  city: "Ranchi",

  // Physical
  height: 168,
  weight: 58,
  dominantFoot: "Right",
  bloodGroup: "B+",

  // Stats
  nexusScore: 87,
  profileViews: 1247,
  shortlists: 18,
  yearsPlaying: 6,
  experienceLevel: "Advanced",

  // Current
  currentClub: "Jharkhand Women FC",
  coachName: "Sunita Devi",
  coachPhone: "+91 98765 12345",

  // Performance Metrics
  metrics: {
    speed: 85,
    stamina: 78,
    technique: 92,
    tactical: 80,
    physical: 75,
    mental: 88
  },

  // Achievements
  achievements: [
    { id: 1, title: "State U-17 Gold Medal", year: 2023, type: "gold" },
    { id: 2, title: "District Level Best Striker", year: 2023, type: "award" },
    { id: 3, title: "Inter-School Champion", year: 2022, type: "gold" },
    { id: 4, title: "SAI Talent Hunt Selection", year: 2024, type: "selection" }
  ],

  // Videos
  videos: [
    { id: 1, title: "Match Highlights vs Bihar", duration: "3:45", views: 342 },
    { id: 2, title: "Training Session - Shooting", duration: "2:15", views: 189 },
    { id: 3, title: "Skill Showcase Reel", duration: "1:30", views: 567 }
  ],

  verified: true
}

const metricColors: Record<string, string> = {
  speed: "var(--nx-cyan)",
  stamina: "var(--nx-green)",
  technique: "var(--nx-gold)",
  tactical: "var(--nx-purple)",
  physical: "var(--nx-orange)",
  mental: "var(--nx-pink)"
}

export default function AthleteProfilePage() {
  const user = useUser()
  const [activeTab, setActiveTab] = useState("overview")
  const [profile, setProfile] = useState<any>(null)
  const [latestAnalysis, setLatestAnalysis] = useState<any>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const loadProfile = () => {
    fetch('/api/profile/me')
      .then(res => res.json())
      .then(data => { if (data.profile) setProfile(data.profile) })
      .catch(console.error)
  }

  const loadAnalysis = () => {
    fetch('/api/analysis/latest')
      .then(res => res.json())
      .then(data => { if (data.analysis) setLatestAnalysis(data.analysis) })
      .catch(console.error)
  }

  useEffect(() => {
    loadProfile()
    loadAnalysis()
  }, [])

  // Derive real stats from profile + analysis
  const sportData = (() => { try { return JSON.parse(profile?.sport_data || '{}') } catch { return {} } })()
  const analysisScore = latestAnalysis?.overall_score || 0
  const nexusScore = Math.max(profile?.nexus_score || 0, analysisScore)
  const profileStrength = profile?.profile_strength || 0

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="relative p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 nx-green-radial opacity-30" />

        <div className="relative flex flex-col lg:flex-row gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[var(--nx-green)] to-[var(--nx-cyan)] flex items-center justify-center text-4xl font-bold text-black">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "A"}
            </div>
            <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] flex items-center justify-center text-[var(--nx-text3)] hover:text-[var(--nx-green)] transition-colors">
              <Camera className="w-5 h-5" />
            </button>
            {profile?.is_credential_verified && (
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[var(--nx-cyan)] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-black" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-[var(--nx-text1)]">
                    {user?.fullName || "Loading..."}
                  </h1>
                  <span className="px-2 py-1 text-xs font-mono bg-[var(--nx-bg4)] rounded text-[var(--nx-text3)]">
                    {user?.id?.substring(0, 8).toUpperCase() || "ATH-NEW"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--nx-text2)]">
                  <span className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: "var(--sport-football)" }} />
                    {profile?.sport || "Sport"}
                  </span>
                  <span>{profile?.position_role || "Position"}</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profile?.city || "City"}, {profile?.state || "State"}
                  </span>
                  {(profile?.height_cm || profile?.weight_kg) && (
                    <span className="flex items-center gap-1">
                      {profile.height_cm ? `${profile.height_cm}cm` : ""} {profile.weight_kg ? `· ${profile.weight_kg}kg` : ""}
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-[var(--nx-green-dim)] border border-[var(--nx-green-border)] text-[var(--nx-green)]">
                    NEXUS {nexusScore}
                  </span>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-[var(--nx-bg4)] text-[var(--nx-text3)]">
                    Profile {profileStrength}% Complete
                  </span>
                  {latestAnalysis?.grade && (
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.22)] text-[var(--nx-cyan)]">
                      Grade: {latestAnalysis.grade}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2.5 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text3)] hover:text-[var(--nx-text1)] transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2.5 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text3)] hover:text-[var(--nx-text1)] transition-colors">
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--nx-green)] text-black font-semibold hover:brightness-110 transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-4 gap-4">
              <div className="p-3 rounded-xl bg-[var(--nx-bg4)]/50">
                <div className="text-2xl font-bold text-[var(--nx-green)]">{nexusScore}</div>
                <div className="text-xs text-[var(--nx-text3)]">NEXUS Score</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--nx-bg4)]/50">
                <div className="text-2xl font-bold text-[var(--nx-cyan)]">{analysisScore || '—'}</div>
                <div className="text-xs text-[var(--nx-text3)]">Analysis Score</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--nx-bg4)]/50">
                <div className="text-2xl font-bold text-[var(--nx-pink)]">{profile?.sport || '—'}</div>
                <div className="text-xs text-[var(--nx-text3)]">Sport</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--nx-bg4)]/50">
                <div className="text-2xl font-bold text-[var(--nx-gold)]">{profile?.position_role || '—'}</div>
                <div className="text-xs text-[var(--nx-text3)]">Position</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] overflow-x-auto">
        {["overview", "performance", "achievements", "media", "contact"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
              activeTab === tab
                ? "bg-[var(--nx-green)] text-black"
                : "text-[var(--nx-text3)] hover:text-[var(--nx-text1)]"
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === "overview" && (
            <>
              {/* Physical Stats */}
              <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
                <h2 className="font-semibold text-[var(--nx-text1)] mb-4">Physical Attributes</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-[var(--nx-bg4)]">
                    <div className="text-2xl font-bold text-[var(--nx-text1)]">{profile?.height_cm || '—'} cm</div>
                    <div className="text-sm text-[var(--nx-text3)]">Height</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--nx-bg4)]">
                    <div className="text-2xl font-bold text-[var(--nx-text1)]">{profile?.weight_kg || '—'} kg</div>
                    <div className="text-sm text-[var(--nx-text3)]">Weight</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--nx-bg4)]">
                    <div className="text-2xl font-bold text-[var(--nx-text1)]">{sportData.preferredFoot || '—'}</div>
                    <div className="text-sm text-[var(--nx-text3)]">Dominant Foot</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--nx-bg4)]">
                    <div className="text-2xl font-bold text-[var(--nx-text1)]">{profile?.gender || '—'}</div>
                    <div className="text-sm text-[var(--nx-text3)]">Gender</div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
                <h2 className="font-semibold text-[var(--nx-text1)] mb-4">Performance Metrics</h2>
                <div className="space-y-4">
                  {Object.entries(mockAthlete.metrics).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[var(--nx-text2)] capitalize">{key}</span>
                        <span className="text-sm font-bold" style={{ color: metricColors[key] }}>
                          {value}/100
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-[var(--nx-bg4)] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${value}%`,
                            background: metricColors[key]
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "performance" && (
            <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
              <h2 className="font-semibold text-[var(--nx-text1)] mb-4">Detailed Performance Analysis</h2>
              <p className="text-[var(--nx-text3)]">
                Performance analysis will be generated from uploaded videos and match data.
              </p>
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
              <h2 className="font-semibold text-[var(--nx-text1)] mb-4">Achievements & Awards</h2>
              <div className="space-y-4">
                {mockAthlete.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)]"
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      achievement.type === "gold" && "bg-[var(--nx-gold)]/20",
                      achievement.type === "award" && "bg-[var(--nx-purple)]/20",
                      achievement.type === "selection" && "bg-[var(--nx-green)]/20"
                    )}>
                      <Trophy className={cn(
                        "w-6 h-6",
                        achievement.type === "gold" && "text-[var(--nx-gold)]",
                        achievement.type === "award" && "text-[var(--nx-purple)]",
                        achievement.type === "selection" && "text-[var(--nx-green)]"
                      )} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-[var(--nx-text1)]">{achievement.title}</h3>
                      <p className="text-sm text-[var(--nx-text3)]">{achievement.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "media" && (
            <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
              <h2 className="font-semibold text-[var(--nx-text1)] mb-4">Video Gallery</h2>
              <div className="grid gap-4">
                {mockAthlete.videos.map((video) => (
                  <div
                    key={video.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)] hover:border-[var(--nx-green-border)] transition-colors cursor-pointer"
                  >
                    <div className="w-24 h-16 rounded-lg bg-[var(--nx-bg3)] flex items-center justify-center">
                      <Video className="w-8 h-8 text-[var(--nx-text3)]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-[var(--nx-text1)]">{video.title}</h3>
                      <p className="text-sm text-[var(--nx-text3)]">
                        {video.duration} | {video.views} views
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
              <h2 className="font-semibold text-[var(--nx-text1)] mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[var(--nx-text3)]" />
                  <span className="text-[var(--nx-text2)]">{mockAthlete.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[var(--nx-text3)]" />
                  <span className="text-[var(--nx-text2)]">{mockAthlete.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[var(--nx-text3)]" />
                  <span className="text-[var(--nx-text2)]">{mockAthlete.district}, {mockAthlete.state}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Club */}
          <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h2 className="font-semibold text-[var(--nx-text1)] mb-4">Current Club</h2>
            <div className="p-4 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)]">
              <h3 className="font-medium text-[var(--nx-text1)]">{mockAthlete.currentClub}</h3>
              <p className="text-sm text-[var(--nx-text3)] mt-1">Active Member</p>
            </div>
          </div>

          {/* Coach Info */}
          <div className="p-6 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            <h2 className="font-semibold text-[var(--nx-text1)] mb-4">Coach/Trainer</h2>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[var(--nx-bg4)] flex items-center justify-center text-lg font-bold text-[var(--nx-text3)]">
                {mockAthlete.coachName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-medium text-[var(--nx-text1)]">{mockAthlete.coachName}</h3>
                <p className="text-sm text-[var(--nx-text3)]">{mockAthlete.coachPhone}</p>
              </div>
            </div>
          </div>

          {/* NEXUS Score Breakdown */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[var(--nx-green-dim)] to-transparent border border-[var(--nx-green-border)]">
            <h2 className="font-semibold text-[var(--nx-text1)] mb-4">NEXUS AI Score</h2>
            <div className="text-center mb-4">
              <div className="text-5xl font-[family-name:var(--font-display)] text-[var(--nx-green)]">
                {nexusScore}
              </div>
              <div className="text-sm text-[var(--nx-text3)]">out of 100</div>
            </div>
            <p className="text-sm text-[var(--nx-text2)] text-center">
              {latestAnalysis
                ? `Based on video analysis (Grade: ${latestAnalysis.grade || 'N/A'})`
                : 'Upload and analyze a video to generate your score.'
              }
            </p>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        profile={profile}
        onSuccess={loadProfile}
      />
    </div>
  )
}
