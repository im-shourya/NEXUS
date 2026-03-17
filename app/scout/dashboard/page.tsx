"use client"

import { useState } from "react"
import { Search, Filter, MapPin, TrendingUp, Eye, MessageSquare, Calendar, ChevronRight, Zap, Users, Award, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

const SPORTS = [
  { id: "all", name: "All Sports", icon: "🏆" },
  { id: "football", name: "Football", icon: "⚽" },
  { id: "cricket", name: "Cricket", icon: "🏏" },
  { id: "kabaddi", name: "Kabaddi", icon: "🤼" },
  { id: "athletics", name: "Athletics", icon: "🏃" },
  { id: "badminton", name: "Badminton", icon: "🏸" },
  { id: "hockey", name: "Hockey", icon: "🏑" },
]

const DISCOVERED_ATHLETES = [
  {
    id: 1,
    name: "Arjun Reddy",
    age: 17,
    sport: "Football",
    position: "Striker",
    location: "Hyderabad, Telangana",
    nexusScore: 87,
    matchPercent: 94,
    stats: { goals: 23, assists: 12, matches: 28 },
    badges: ["Rising Star", "Top Scorer"],
    avatar: null,
    trending: true,
    verified: true,
  },
  {
    id: 2,
    name: "Priya Sharma",
    age: 16,
    sport: "Athletics",
    position: "Sprinter",
    location: "Chennai, Tamil Nadu",
    nexusScore: 91,
    matchPercent: 89,
    stats: { pb100m: "11.8s", medals: 8, competitions: 15 },
    badges: ["State Champion", "National Camp"],
    avatar: null,
    trending: true,
    verified: true,
  },
  {
    id: 3,
    name: "Vikram Singh",
    age: 19,
    sport: "Kabaddi",
    position: "Raider",
    location: "Rohtak, Haryana",
    nexusScore: 85,
    matchPercent: 92,
    stats: { raidPoints: 156, tackles: 34, matches: 42 },
    badges: ["PKL Prospect", "Power Raider"],
    avatar: null,
    trending: false,
    verified: true,
  },
  {
    id: 4,
    name: "Ananya Patel",
    age: 15,
    sport: "Badminton",
    position: "Singles",
    location: "Bangalore, Karnataka",
    nexusScore: 88,
    matchPercent: 86,
    stats: { ranking: 12, wins: 45, tournaments: 18 },
    badges: ["Junior Champion", "Rising Talent"],
    avatar: null,
    trending: true,
    verified: false,
  },
]

const SHORTLISTED = [
  { id: 1, name: "Arjun Reddy", sport: "Football", addedDate: "2 days ago" },
  { id: 2, name: "Vikram Singh", sport: "Kabaddi", addedDate: "1 week ago" },
]

const UPCOMING_TRIALS = [
  { id: 1, name: "ISL Youth Trials", date: "Mar 25", location: "Goa", spots: 12 },
  { id: 2, name: "State Athletics Meet", date: "Apr 2", location: "Chennai", spots: 8 },
]

export default function ScoutDashboardPage() {
  const [selectedSport, setSelectedSport] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Athletes Discovered", value: "2,847", change: "+124", icon: Users, color: "var(--nx-green)" },
          { label: "Shortlisted", value: "48", change: "+6", icon: Bookmark, color: "var(--nx-cyan)" },
          { label: "Trials Scheduled", value: "12", change: "+3", icon: Calendar, color: "var(--nx-gold)" },
          { label: "Successful Signings", value: "7", change: "+2", icon: Award, color: "var(--nx-orange)" },
        ].map((stat, i) => (
          <div key={i} className="nx-card p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-[var(--nx-text3)] uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold mt-1" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-xs text-[var(--nx-green)] mt-1">{stat.change} this month</p>
              </div>
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${stat.color}15` }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="nx-card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--nx-text3)]" />
            <Input
              placeholder="Search athletes by name, location, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[var(--nx-bg4)] border-[var(--nx-border)] text-[var(--nx-text1)]"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select value={selectedSport} onValueChange={setSelectedSport}>
              <SelectTrigger className="w-[160px] bg-[var(--nx-bg4)] border-[var(--nx-border)]">
                <SelectValue placeholder="Sport" />
              </SelectTrigger>
              <SelectContent>
                {SPORTS.map((sport) => (
                  <SelectItem key={sport.id} value={sport.id}>
                    <span className="flex items-center gap-2">
                      <span>{sport.icon}</span>
                      <span>{sport.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[140px] bg-[var(--nx-bg4)] border-[var(--nx-border)]">
                <SelectValue placeholder="Age" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ages</SelectItem>
                <SelectItem value="u16">Under 16</SelectItem>
                <SelectItem value="u18">Under 18</SelectItem>
                <SelectItem value="u21">Under 21</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[160px] bg-[var(--nx-bg4)] border-[var(--nx-border)]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All India</SelectItem>
                <SelectItem value="north">North India</SelectItem>
                <SelectItem value="south">South India</SelectItem>
                <SelectItem value="east">East India</SelectItem>
                <SelectItem value="west">West India</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-[var(--nx-border)] hover:border-[var(--nx-green-border)]">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Sport Pills */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {SPORTS.map((sport) => (
            <button
              key={sport.id}
              onClick={() => setSelectedSport(sport.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                selectedSport === sport.id
                  ? "bg-[var(--nx-green)] text-black font-medium"
                  : "bg-[var(--nx-bg4)] text-[var(--nx-text2)] hover:bg-[var(--nx-bg5)]"
              }`}
            >
              <span>{sport.icon}</span>
              <span>{sport.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content - Discovered Athletes */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">AI-Recommended Athletes</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--nx-text3)]">2,847 matches</span>
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "grid" | "list")}>
                <TabsList className="bg-[var(--nx-bg4)]">
                  <TabsTrigger value="grid" className="text-xs">Grid</TabsTrigger>
                  <TabsTrigger value="list" className="text-xs">List</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className={viewMode === "grid" ? "grid md:grid-cols-2 gap-4" : "space-y-3"}>
            {DISCOVERED_ATHLETES.map((athlete) => (
              <div
                key={athlete.id}
                className="nx-card p-4 hover:border-[var(--nx-green-border)] transition-all cursor-pointer group"
              >
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--nx-green-dim)] to-[var(--nx-bg4)] flex items-center justify-center text-2xl font-bold text-[var(--nx-green)]">
                      {athlete.name.charAt(0)}
                    </div>
                    {athlete.trending && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--nx-orange)] rounded-full flex items-center justify-center">
                        <TrendingUp className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-[var(--nx-text1)] truncate">{athlete.name}</h3>
                          {athlete.verified && (
                            <Badge variant="outline" className="text-[10px] border-[var(--nx-cyan)] text-[var(--nx-cyan)]">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-[var(--nx-text3)]">
                          {athlete.age} yrs • {athlete.position} • {athlete.sport}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[var(--nx-green)]">{athlete.matchPercent}%</div>
                        <div className="text-[10px] text-[var(--nx-text3)]">Match</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mt-2 text-xs text-[var(--nx-text3)]">
                      <MapPin className="w-3 h-3" />
                      <span>{athlete.location}</span>
                    </div>

                    {/* Badges */}
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {athlete.badges.map((badge, i) => (
                        <span key={i} className="nx-chip nx-chip-green text-[10px]">
                          {badge}
                        </span>
                      ))}
                    </div>

                    {/* NEXUS Score */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[var(--nx-text3)]">NEXUS Score</span>
                        <span className="text-[var(--nx-green)] font-medium">{athlete.nexusScore}/100</span>
                      </div>
                      <Progress 
                        value={athlete.nexusScore} 
                        className="h-1.5 bg-[var(--nx-bg4)]"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" className="h-7 bg-[var(--nx-green)] text-black hover:bg-[var(--nx-green-dark)]">
                        <Eye className="w-3 h-3 mr-1" />
                        View Profile
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 border-[var(--nx-border)]">
                        <Bookmark className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 border-[var(--nx-border)]">
                        <MessageSquare className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full border-[var(--nx-border)] hover:border-[var(--nx-green-border)]">
            Load More Athletes
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* AI Insights */}
          <div className="nx-card p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[var(--nx-green-dim)] flex items-center justify-center">
                <Zap className="w-4 h-4 text-[var(--nx-green)]" />
              </div>
              <h3 className="font-semibold">AI Insights</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-[var(--nx-bg4)] border border-[var(--nx-border)]">
                <p className="text-sm text-[var(--nx-text2)]">
                  <span className="text-[var(--nx-green)]">12 new athletes</span> matching your criteria joined this week from Haryana region.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[var(--nx-bg4)] border border-[var(--nx-border)]">
                <p className="text-sm text-[var(--nx-text2)]">
                  <span className="text-[var(--nx-cyan)]">Trending:</span> U-17 Football talent pool showing 23% growth in South India.
                </p>
              </div>
            </div>
          </div>

          {/* Shortlist */}
          <div className="nx-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">My Shortlist</h3>
              <Badge variant="outline" className="border-[var(--nx-green-border)] text-[var(--nx-green)]">
                {SHORTLISTED.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {SHORTLISTED.map((athlete) => (
                <div key={athlete.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--nx-bg4)] transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-[var(--nx-green-dim)] flex items-center justify-center text-sm font-bold text-[var(--nx-green)]">
                    {athlete.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{athlete.name}</p>
                    <p className="text-xs text-[var(--nx-text3)]">{athlete.sport} • {athlete.addedDate}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--nx-text3)]" />
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-2 text-[var(--nx-green)] hover:bg-[var(--nx-green-dim)]">
              View All Shortlisted
            </Button>
          </div>

          {/* Upcoming Trials */}
          <div className="nx-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Upcoming Trials</h3>
              <Button size="sm" variant="outline" className="h-7 border-[var(--nx-border)]">
                + Create
              </Button>
            </div>
            <div className="space-y-2">
              {UPCOMING_TRIALS.map((trial) => (
                <div key={trial.id} className="p-3 rounded-lg bg-[var(--nx-bg4)] border border-[var(--nx-border)]">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">{trial.name}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-[var(--nx-text3)]">
                        <Calendar className="w-3 h-3" />
                        <span>{trial.date}</span>
                        <MapPin className="w-3 h-3 ml-1" />
                        <span>{trial.location}</span>
                      </div>
                    </div>
                    <Badge className="bg-[var(--nx-cyan)] text-black text-[10px]">
                      {trial.spots} spots
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="nx-card p-4">
            <h3 className="font-semibold mb-4">Discovery Analytics</h3>
            <div className="space-y-3">
              {[
                { label: "Profile Views", value: "1,247", trend: "+18%" },
                { label: "Messages Sent", value: "89", trend: "+12%" },
                { label: "Response Rate", value: "76%", trend: "+5%" },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-[var(--nx-text3)]">{stat.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{stat.value}</span>
                    <span className="text-xs text-[var(--nx-green)]">{stat.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
