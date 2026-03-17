"use client"

import { useState } from "react"
import { Trophy, Calendar, MapPin, Users, Search, Filter, ChevronRight, Star, ArrowUpRight, Plus, Medal, Target, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select"

const FEATURED_TOURNAMENTS = [
  {
    id: 1,
    name: "ISL Youth Cup 2026",
    sport: "Football",
    date: "Mar 25-30, 2026",
    location: "Goa",
    prize: "₹10,00,000",
    teams: 32,
    registered: true,
    registeredAthletes: 8,
    status: "Upcoming",
    level: "National",
    organizer: "Indian Super League",
    deadline: "Mar 20",
    image: null,
  },
  {
    id: 2,
    name: "State Athletics Championship",
    sport: "Athletics",
    date: "Apr 5-8, 2026",
    location: "Chennai",
    prize: "₹5,00,000",
    teams: 64,
    registered: false,
    registeredAthletes: 0,
    status: "Open",
    level: "State",
    organizer: "Tamil Nadu Athletics Association",
    deadline: "Apr 1",
    image: null,
  },
]

const ALL_TOURNAMENTS = [
  {
    id: 1,
    name: "PKL Youth League",
    sport: "Kabaddi",
    date: "Apr 15-22",
    location: "Patna",
    level: "National",
    status: "Open",
    spots: 24,
    registered: false,
  },
  {
    id: 2,
    name: "Inter-Academy Football Cup",
    sport: "Football",
    date: "Apr 10-12",
    location: "Mumbai",
    level: "Regional",
    status: "Open",
    spots: 16,
    registered: true,
  },
  {
    id: 3,
    name: "Badminton Junior Nationals",
    sport: "Badminton",
    date: "May 1-5",
    location: "Hyderabad",
    level: "National",
    status: "Open",
    spots: 128,
    registered: false,
  },
  {
    id: 4,
    name: "Hockey Academy League",
    sport: "Hockey",
    date: "May 10-15",
    location: "Bhubaneswar",
    level: "National",
    status: "Closing Soon",
    spots: 12,
    registered: false,
  },
]

const PAST_RESULTS = [
  {
    id: 1,
    name: "Winter Football Championship",
    date: "Feb 2026",
    position: 2,
    totalTeams: 24,
    athletes: 6,
    highlights: ["Best Striker Award - Rahul K.", "3 Athletes Scouted"],
  },
  {
    id: 2,
    name: "Maharashtra Athletics Meet",
    date: "Jan 2026",
    position: 1,
    totalTeams: 32,
    athletes: 8,
    highlights: ["Gold in 100m", "Silver in Relay", "2 National Records"],
  },
]

export default function TournamentsPage() {
  const [activeTab, setActiveTab] = useState("discover")
  const [sportFilter, setSportFilter] = useState("all")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Tournaments</h1>
          <p className="text-[var(--nx-text2)]">Discover, register, and track tournament participation</p>
        </div>
        <Button className="bg-[var(--nx-green)] text-black hover:bg-[var(--nx-green-dark)]">
          <Plus className="w-4 h-4 mr-2" />
          Create Tournament
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Registrations", value: "3", icon: CheckCircle, color: "var(--nx-green)" },
          { label: "Upcoming Events", value: "5", icon: Calendar, color: "var(--nx-cyan)" },
          { label: "Medals Won", value: "12", icon: Medal, color: "var(--nx-gold)" },
          { label: "Athletes Competing", value: "24", icon: Users, color: "var(--nx-orange)" },
        ].map((stat, i) => (
          <div key={i} className="nx-card p-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${stat.color}15` }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-xs text-[var(--nx-text3)]">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Tournaments */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Featured Tournaments</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {FEATURED_TOURNAMENTS.map((tournament) => (
            <div 
              key={tournament.id}
              className="nx-card overflow-hidden hover:border-[var(--nx-green-border)] transition-all"
            >
              {/* Banner */}
              <div className="h-32 bg-gradient-to-br from-[var(--nx-green-dim)] via-[var(--nx-bg4)] to-[var(--nx-bg3)] relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Trophy className="w-16 h-16 text-[var(--nx-green)]/20" />
                </div>
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className="bg-[var(--nx-green)] text-black">{tournament.level}</Badge>
                  <Badge variant="outline" className="border-white/30 text-white bg-black/30">
                    {tournament.sport}
                  </Badge>
                </div>
                {tournament.registered && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-[var(--nx-cyan)] text-black">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Registered
                    </Badge>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold">{tournament.name}</h3>
                <p className="text-sm text-[var(--nx-text3)]">by {tournament.organizer}</p>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="flex items-center gap-2 text-sm text-[var(--nx-text2)]">
                    <Calendar className="w-4 h-4 text-[var(--nx-text3)]" />
                    <span>{tournament.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--nx-text2)]">
                    <MapPin className="w-4 h-4 text-[var(--nx-text3)]" />
                    <span>{tournament.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--nx-text2)]">
                    <Users className="w-4 h-4 text-[var(--nx-text3)]" />
                    <span>{tournament.teams} teams</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--nx-gold)]">
                    <Trophy className="w-4 h-4" />
                    <span>{tournament.prize}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--nx-border)]">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[var(--nx-orange)]" />
                    <span className="text-xs text-[var(--nx-text3)]">
                      Deadline: {tournament.deadline}
                    </span>
                  </div>
                  {tournament.registered ? (
                    <Button size="sm" variant="outline" className="border-[var(--nx-cyan)] text-[var(--nx-cyan)]">
                      {tournament.registeredAthletes} Athletes
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  ) : (
                    <Button size="sm" className="bg-[var(--nx-green)] text-black hover:bg-[var(--nx-green-dark)]">
                      Register Now
                      <ArrowUpRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <TabsList className="bg-[var(--nx-bg3)]">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="registered">My Registrations</TabsTrigger>
            <TabsTrigger value="results">Past Results</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--nx-text3)]" />
              <Input 
                placeholder="Search tournaments..." 
                className="pl-10 bg-[var(--nx-bg4)] border-[var(--nx-border)]"
              />
            </div>
            <Select value={sportFilter} onValueChange={setSportFilter}>
              <SelectTrigger className="w-[140px] bg-[var(--nx-bg4)] border-[var(--nx-border)]">
                <SelectValue placeholder="Sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
                <SelectItem value="football">Football</SelectItem>
                <SelectItem value="cricket">Cricket</SelectItem>
                <SelectItem value="kabaddi">Kabaddi</SelectItem>
                <SelectItem value="athletics">Athletics</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="discover" className="mt-6">
          <div className="space-y-3">
            {ALL_TOURNAMENTS.map((tournament) => (
              <div 
                key={tournament.id}
                className="nx-card p-4 hover:border-[var(--nx-green-border)] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--nx-green-dim)] flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-[var(--nx-green)]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{tournament.name}</h3>
                      <Badge variant="outline" className="text-[10px] border-[var(--nx-border)]">
                        {tournament.sport}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] ${
                          tournament.status === "Closing Soon" 
                            ? "border-[var(--nx-orange)] text-[var(--nx-orange)]"
                            : "border-[var(--nx-green-border)] text-[var(--nx-green)]"
                        }`}
                      >
                        {tournament.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-[var(--nx-text3)]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {tournament.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {tournament.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {tournament.level}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[var(--nx-text3)]">{tournament.spots} spots left</p>
                    {tournament.registered ? (
                      <Badge className="mt-1 bg-[var(--nx-cyan)] text-black">Registered</Badge>
                    ) : (
                      <Button size="sm" className="mt-1 bg-[var(--nx-green)] text-black hover:bg-[var(--nx-green-dark)]">
                        Register
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="registered" className="mt-6">
          <div className="space-y-3">
            {FEATURED_TOURNAMENTS.filter(t => t.registered).map((tournament) => (
              <div key={tournament.id} className="nx-card p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--nx-cyan)]/10 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-[var(--nx-cyan)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{tournament.name}</h3>
                    <p className="text-sm text-[var(--nx-text3)]">
                      {tournament.date} • {tournament.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[var(--nx-cyan)]">{tournament.registeredAthletes}</p>
                    <p className="text-xs text-[var(--nx-text3)]">Athletes</p>
                  </div>
                  <Button variant="outline" className="border-[var(--nx-border)]">
                    Manage
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="results" className="mt-6">
          <div className="space-y-4">
            {PAST_RESULTS.map((result) => (
              <div key={result.id} className="nx-card p-4">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center ${
                    result.position === 1 
                      ? "bg-[var(--nx-gold)]/20" 
                      : result.position === 2 
                      ? "bg-gray-400/20" 
                      : "bg-orange-600/20"
                  }`}>
                    <Medal className={`w-6 h-6 ${
                      result.position === 1 
                        ? "text-[var(--nx-gold)]" 
                        : result.position === 2 
                        ? "text-gray-400" 
                        : "text-orange-600"
                    }`} />
                    <span className="text-xs font-bold">#{result.position}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{result.name}</h3>
                    <p className="text-sm text-[var(--nx-text3)]">{result.date} • {result.totalTeams} teams</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {result.highlights.map((highlight, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] border-[var(--nx-green-border)] text-[var(--nx-green)]">
                          <Star className="w-3 h-3 mr-1" />
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="ghost" className="text-[var(--nx-text3)]">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
