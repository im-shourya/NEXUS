"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Users, Trophy, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

const sportsData = [
  {
    id: "football",
    name: "Football",
    icon: "⚽",
    athletes: "8.2M",
    scouts: "450+",
    states: 28,
    color: "var(--sport-football)",
    leagues: ["ISL", "I-League", "State Leagues"],
    description: "From grassroot clubs to ISL dreams, discover India's football talent pipeline.",
    featured: true
  },
  {
    id: "cricket",
    name: "Cricket",
    icon: "🏏",
    athletes: "15M",
    scouts: "680+",
    states: 28,
    color: "var(--sport-cricket)",
    leagues: ["IPL", "Ranji Trophy", "U-19"],
    description: "Unearth the next generation of Indian cricket superstars.",
    featured: true
  },
  {
    id: "kabaddi",
    name: "Kabaddi",
    icon: "🤼",
    athletes: "4.5M",
    scouts: "280+",
    states: 24,
    color: "var(--sport-kabaddi)",
    leagues: ["PKL", "State Leagues"],
    description: "Traditional sport meets modern scouting technology.",
    featured: true
  },
  {
    id: "athletics",
    name: "Athletics",
    icon: "🏃",
    athletes: "6.8M",
    scouts: "320+",
    states: 28,
    color: "var(--sport-athletics)",
    leagues: ["Olympics", "Asian Games", "Nationals"],
    description: "Track and field talent discovery across disciplines.",
    featured: true
  },
  {
    id: "badminton",
    name: "Badminton",
    icon: "🏸",
    athletes: "3.2M",
    scouts: "180+",
    states: 22,
    color: "var(--sport-badminton)",
    leagues: ["BWF", "PBL", "State Leagues"],
    description: "Continuing India's badminton legacy with new talent."
  },
  {
    id: "basketball",
    name: "Basketball",
    icon: "🏀",
    athletes: "2.1M",
    scouts: "95+",
    states: 18,
    color: "var(--sport-basketball)",
    leagues: ["UBA", "3x3", "State Leagues"],
    description: "Building India's basketball future, one player at a time."
  },
  {
    id: "hockey",
    name: "Hockey",
    icon: "🏑",
    athletes: "2.8M",
    scouts: "210+",
    states: 22,
    color: "var(--sport-hockey)",
    leagues: ["HL", "Olympics", "State Leagues"],
    description: "India's national sport with renewed glory."
  },
  {
    id: "wrestling",
    name: "Wrestling",
    icon: "🤼‍♂️",
    athletes: "1.9M",
    scouts: "140+",
    states: 16,
    color: "var(--sport-wrestling)",
    leagues: ["PWL", "Olympics", "Nationals"],
    description: "From akharas to Olympic podiums."
  },
  {
    id: "kho",
    name: "Kho-Kho",
    icon: "🏃‍♀️",
    athletes: "2.4M",
    scouts: "120+",
    states: 20,
    color: "var(--sport-kho)",
    leagues: ["UKL", "Nationals"],
    description: "Traditional Indian sport going professional."
  },
  {
    id: "volleyball",
    name: "Volleyball",
    icon: "🏐",
    athletes: "1.6M",
    scouts: "85+",
    states: 18,
    color: "var(--sport-volleyball)",
    leagues: ["PVL", "State Leagues"],
    description: "Growing India's volleyball ecosystem."
  },
  {
    id: "archery",
    name: "Archery",
    icon: "🏹",
    athletes: "0.8M",
    scouts: "65+",
    states: 14,
    color: "var(--sport-archery)",
    leagues: ["Olympics", "World Cup", "Nationals"],
    description: "Precision sport with Olympic ambitions."
  },
  {
    id: "tabletennis",
    name: "Table Tennis",
    icon: "🏓",
    athletes: "1.2M",
    scouts: "75+",
    states: 16,
    color: "var(--sport-tabletennis)",
    leagues: ["UTT", "State Leagues"],
    description: "Fast-paced talent discovery on the table."
  }
]

export default function SportsSection() {
  const [activeSport, setActiveSport] = useState(sportsData[0])
  const featuredSports = sportsData.filter(s => s.featured)
  const otherSports = sportsData.filter(s => !s.featured)

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 transition-colors duration-500"
          style={{ 
            background: `radial-gradient(ellipse 80% 50% at 50% 100%, ${activeSport.color}15, transparent 70%)` 
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-mono uppercase tracking-widest text-[var(--nx-green)] bg-[var(--nx-green-dim)] border border-[var(--nx-green-border)] rounded-full">
            12 Sports Covered
          </span>
          <h2 className="text-nx-h1 text-[var(--nx-text1)] mb-6">
            One Platform,<br />
            <span className="text-[var(--nx-green)]">Every Sport</span>
          </h2>
          <p className="text-nx-body-lg max-w-2xl mx-auto">
            From football to kabaddi, cricket to athletics — discover talent across 
            12 sports with specialized metrics and verified scout networks.
          </p>
        </div>

        {/* Featured Sports Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {featuredSports.map((sport) => (
            <button
              key={sport.id}
              onClick={() => setActiveSport(sport)}
              className={cn(
                "relative p-6 rounded-2xl border text-left transition-all duration-300 group",
                activeSport.id === sport.id
                  ? "bg-[var(--nx-bg3)] border-transparent"
                  : "bg-[var(--nx-bg3)]/50 border-[var(--nx-border)] hover:border-[var(--nx-border2)]"
              )}
              style={{
                boxShadow: activeSport.id === sport.id 
                  ? `0 0 40px ${sport.color}25, 0 0 0 1px ${sport.color}40` 
                  : 'none'
              }}
            >
              {/* Icon */}
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform group-hover:scale-110"
                style={{ 
                  background: `${sport.color}15`,
                  border: `1px solid ${sport.color}30`
                }}
              >
                {sport.icon}
              </div>

              {/* Info */}
              <h3 className="text-lg font-semibold text-[var(--nx-text1)] mb-2">
                {sport.name}
              </h3>
              <p className="text-sm text-[var(--nx-text3)] mb-4 line-clamp-2">
                {sport.description}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-[var(--nx-text3)]">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {sport.athletes}
                </span>
                <span className="flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" />
                  {sport.scouts}
                </span>
              </div>

              {/* Active Indicator */}
              {activeSport.id === sport.id && (
                <div 
                  className="absolute inset-x-0 bottom-0 h-1 rounded-b-2xl"
                  style={{ background: sport.color }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Active Sport Detail */}
        <div 
          className="p-8 rounded-3xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] mb-8"
          style={{
            boxShadow: `0 0 60px ${activeSport.color}10`
          }}
        >
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                  style={{ 
                    background: `${activeSport.color}15`,
                    border: `1px solid ${activeSport.color}30`
                  }}
                >
                  {activeSport.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[var(--nx-text1)]">
                    {activeSport.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {activeSport.leagues.map((league) => (
                      <span 
                        key={league}
                        className="px-2 py-0.5 text-xs rounded-full"
                        style={{ 
                          background: `${activeSport.color}15`,
                          color: activeSport.color
                        }}
                      >
                        {league}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-[var(--nx-text2)] mb-6">
                {activeSport.description} Our AI-powered platform connects athletes with 
                verified scouts and academies, providing performance analytics and trial opportunities 
                tailored specifically for {activeSport.name.toLowerCase()} players.
              </p>
              <Link
                href={`/sports/${activeSport.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all hover:gap-3"
                style={{ 
                  background: activeSport.color,
                  color: '#000'
                }}
              >
                Explore {activeSport.name}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Stats */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)]">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5" style={{ color: activeSport.color }} />
                  <span className="text-sm text-[var(--nx-text3)]">Registered Athletes</span>
                </div>
                <div className="text-3xl font-[family-name:var(--font-display)]" style={{ color: activeSport.color }}>
                  {activeSport.athletes}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)]">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="w-5 h-5" style={{ color: activeSport.color }} />
                  <span className="text-sm text-[var(--nx-text3)]">Verified Scouts</span>
                </div>
                <div className="text-3xl font-[family-name:var(--font-display)]" style={{ color: activeSport.color }}>
                  {activeSport.scouts}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[var(--nx-bg4)] border border-[var(--nx-border)]">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-5 h-5" style={{ color: activeSport.color }} />
                  <span className="text-sm text-[var(--nx-text3)]">States Covered</span>
                </div>
                <div className="text-3xl font-[family-name:var(--font-display)]" style={{ color: activeSport.color }}>
                  {activeSport.states}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Sports */}
        <div>
          <h4 className="text-sm font-semibold text-[var(--nx-text3)] uppercase tracking-wider mb-4">
            More Sports
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {otherSports.map((sport) => (
              <button
                key={sport.id}
                onClick={() => setActiveSport(sport)}
                className={cn(
                  "p-4 rounded-xl text-center transition-all",
                  activeSport.id === sport.id
                    ? "bg-[var(--nx-bg3)] ring-1"
                    : "bg-[var(--nx-bg3)]/50 hover:bg-[var(--nx-bg3)]"
                )}
                style={{
                  ringColor: activeSport.id === sport.id ? sport.color : 'transparent'
                }}
              >
                <div className="text-2xl mb-2">{sport.icon}</div>
                <div className="text-xs font-medium text-[var(--nx-text2)]">
                  {sport.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
