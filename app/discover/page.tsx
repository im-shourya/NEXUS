"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, MapPin, Star, TrendingUp, ChevronRight, Calendar, Zap, Heart, SlidersHorizontal, Grid3X3, List, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { NexusNav } from "@/components/nexus/nexus-nav"
import { NexusFooter } from "@/components/nexus/nexus-footer"

const SPORTS_CATEGORIES = [
  { id: "all", name: "All Sports", icon: "🏆", count: 5200 },
  { id: "football", name: "Football", icon: "⚽", count: 1850 },
  { id: "cricket", name: "Cricket", icon: "🏏", count: 1200 },
  { id: "kabaddi", name: "Kabaddi", icon: "🤼", count: 680 },
  { id: "athletics", name: "Athletics", icon: "🏃", count: 520 },
  { id: "badminton", name: "Badminton", icon: "🏸", count: 340 },
  { id: "hockey", name: "Hockey", icon: "🏑", count: 280 },
  { id: "basketball", name: "Basketball", icon: "🏀", count: 180 },
  { id: "wrestling", name: "Wrestling", icon: "🤺", count: 150 },
]

const TRENDING_ATHLETES = [
  {
    id: 1,
    name: "Arjun Reddy",
    age: 17,
    sport: "Football",
    position: "Striker",
    location: "Hyderabad",
    state: "Telangana",
    nexusScore: 94,
    badges: ["Rising Star", "Top Scorer", "State Champion"],
    stats: { goals: 28, assists: 15, matches: 32 },
    scoutViews: 156,
    verified: true,
  },
  {
    id: 2,
    name: "Priya Sharma",
    age: 16,
    sport: "Athletics",
    position: "Sprinter (100m, 200m)",
    location: "Chennai",
    state: "Tamil Nadu",
    nexusScore: 91,
    badges: ["National Camp", "State Record"],
    stats: { pb100m: "11.52s", medals: 12, competitions: 18 },
    scoutViews: 203,
    verified: true,
  },
  {
    id: 3,
    name: "Vikram Singh", username: "vikram-singh",
    age: 19,
    sport: "Kabaddi",
    position: "Raider",
    location: "Rohtak",
    state: "Haryana",
    nexusScore: 89,
    badges: ["PKL Prospect", "Power Raider"],
    stats: { raidPoints: 245, successRate: "68%", matches: 48 },
    scoutViews: 178,
    verified: true,
  },
  {
    id: 4,
    name: "Ananya Patel",
    age: 15,
    sport: "Badminton",
    position: "Singles Specialist",
    location: "Bangalore",
    state: "Karnataka",
    nexusScore: 88,
    badges: ["Junior National", "Rising Talent"],
    stats: { ranking: 8, wins: 67, tournaments: 24 },
    scoutViews: 134,
    verified: true,
  },
  {
    id: 5,
    name: "Rohit Mehra",
    age: 18,
    sport: "Cricket",
    position: "Fast Bowler",
    location: "Delhi",
    state: "Delhi",
    nexusScore: 87,
    badges: ["IPL Prospect", "U-19 India"],
    stats: { wickets: 78, economy: "6.2", matches: 42 },
    scoutViews: 289,
    verified: true,
  },
  {
    id: 6,
    name: "Kavya Nair",
    age: 17,
    sport: "Football",
    position: "Goalkeeper",
    location: "Kochi",
    state: "Kerala",
    nexusScore: 86,
    badges: ["Clean Sheets", "State Team"],
    stats: { saves: 156, cleanSheets: 18, matches: 35 },
    scoutViews: 112,
    verified: false,
  },
]

const FEATURED_ACADEMIES = [
  { id: 1, name: "Reliance Foundation YDC", sport: "Football", location: "Navi Mumbai", athletes: 120, rating: 4.9 },
  { id: 2, name: "Gopichand Academy", sport: "Badminton", location: "Hyderabad", athletes: 85, rating: 4.8 },
  { id: 3, name: "SAI Sonepat", sport: "Wrestling", location: "Haryana", athletes: 95, rating: 4.7 },
]

const UPCOMING_TRIALS = [
  { id: 1, name: "ISL Youth Trials", date: "Mar 25", location: "Goa", sport: "Football", spots: 50 },
  { id: 2, name: "PKL Selection Camp", date: "Apr 2", location: "Patna", sport: "Kabaddi", spots: 30 },
  { id: 3, name: "State Athletics Meet", date: "Apr 10", location: "Chennai", sport: "Athletics", spots: 100 },
]

export default function DiscoverPage() {
  const [selectedSport, setSelectedSport] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [ageRange, setAgeRange] = useState([14, 25])
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--nx-bg)]">
      <NexusNav />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="px-4 py-12 md:py-16">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Discover India&apos;s
              <span className="text-[var(--nx-green)]"> Sports Talent</span>
            </h1>
            <p className="text-[var(--nx-text2)] text-lg max-w-2xl mx-auto mb-8">
              Explore 50,000+ verified athletes across 12+ sports. Find the next champion.
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--nx-text3)]" />
                  <Input 
                    placeholder="Search athletes by name, sport, location, or skills..."
                    className="pl-12 h-14 text-lg bg-[var(--nx-bg3)] border-[var(--nx-border)] focus:border-[var(--nx-green-border)]"
                  />
                </div>
                <Button 
                  variant="outline" 
                  className="h-14 px-6 border-[var(--nx-border)]"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="w-5 h-5 mr-2" />
                  Filters
                </Button>
                <Button className="h-14 px-8 bg-[var(--nx-green)] text-black hover:bg-[var(--nx-green-dark)]">
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Panel */}
        {showFilters && (
          <section className="px-4 pb-8">
            <div className="max-w-7xl mx-auto">
              <div className="nx-card p-6">
                <div className="grid md:grid-cols-4 gap-6">
                  <div>
                    <label className="text-sm text-[var(--nx-text3)] mb-2 block">Sport</label>
                    <Select value={selectedSport} onValueChange={setSelectedSport}>
                      <SelectTrigger className="bg-[var(--nx-bg4)] border-[var(--nx-border)]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SPORTS_CATEGORIES.map((sport) => (
                          <SelectItem key={sport.id} value={sport.id}>
                            {sport.icon} {sport.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-[var(--nx-text3)] mb-2 block">Location</label>
                    <Select defaultValue="all">
                      <SelectTrigger className="bg-[var(--nx-bg4)] border-[var(--nx-border)]">
                        <SelectValue placeholder="All India" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All India</SelectItem>
                        <SelectItem value="north">North India</SelectItem>
                        <SelectItem value="south">South India</SelectItem>
                        <SelectItem value="east">East India</SelectItem>
                        <SelectItem value="west">West India</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-[var(--nx-text3)] mb-2 block">
                      Age Range: {ageRange[0]} - {ageRange[1]}
                    </label>
                    <Slider
                      value={ageRange}
                      onValueChange={setAgeRange}
                      min={10}
                      max={30}
                      step={1}
                      className="mt-4"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[var(--nx-text3)] mb-2 block">NEXUS Score</label>
                    <Select defaultValue="all">
                      <SelectTrigger className="bg-[var(--nx-bg4)] border-[var(--nx-border)]">
                        <SelectValue placeholder="Any Score" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Score</SelectItem>
                        <SelectItem value="90">90+ Elite</SelectItem>
                        <SelectItem value="80">80+ Advanced</SelectItem>
                        <SelectItem value="70">70+ Intermediate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Sport Categories */}
        <section className="px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {SPORTS_CATEGORIES.map((sport) => (
                <button
                  key={sport.id}
                  onClick={() => setSelectedSport(sport.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-full whitespace-nowrap transition-all ${
                    selectedSport === sport.id
                      ? "bg-[var(--nx-green)] text-black font-medium"
                      : "bg-[var(--nx-bg3)] text-[var(--nx-text2)] hover:bg-[var(--nx-bg4)] border border-[var(--nx-border)]"
                  }`}
                >
                  <span className="text-lg">{sport.icon}</span>
                  <span>{sport.name}</span>
                  <Badge variant="outline" className={`ml-1 text-[10px] ${
                    selectedSport === sport.id 
                      ? "border-black/30 text-black" 
                      : "border-[var(--nx-border)] text-[var(--nx-text3)]"
                  }`}>
                    {sport.count}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Results Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Trending Athletes</h2>
                  <p className="text-sm text-[var(--nx-text3)]">5,247 athletes found</p>
                </div>
                <div className="flex items-center gap-3">
                  <Select defaultValue="trending">
                    <SelectTrigger className="w-[160px] bg-[var(--nx-bg3)] border-[var(--nx-border)]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trending">Trending</SelectItem>
                      <SelectItem value="score">Highest Score</SelectItem>
                      <SelectItem value="recent">Recently Active</SelectItem>
                      <SelectItem value="views">Most Viewed</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex border border-[var(--nx-border)] rounded-lg overflow-hidden">
                    <button 
                      onClick={() => setViewMode("grid")}
                      className={`p-2 ${viewMode === "grid" ? "bg-[var(--nx-green)] text-black" : "bg-[var(--nx-bg3)]"}`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setViewMode("list")}
                      className={`p-2 ${viewMode === "list" ? "bg-[var(--nx-green)] text-black" : "bg-[var(--nx-bg3)]"}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Athletes Grid */}
              <div className={viewMode === "grid" ? "grid md:grid-cols-2 gap-4" : "space-y-4"}>
                {TRENDING_ATHLETES.map((athlete) => (
                  <Link 
                    href={`/athlete/${athlete.username || athlete.id}`}
                    key={athlete.id}
                    className="nx-card p-4 hover:border-[var(--nx-green-border)] transition-all group cursor-pointer"
                  >
                    <div className="flex gap-4">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[var(--nx-green-dim)] to-[var(--nx-bg4)] flex items-center justify-center text-3xl font-bold text-[var(--nx-green)]">
                          {athlete.name.charAt(0)}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[var(--nx-bg)] border-2 border-[var(--nx-green)] flex items-center justify-center">
                          <span className="text-xs font-bold text-[var(--nx-green)]">{athlete.nexusScore}</span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-[var(--nx-text1)]">{athlete.name}</h3>
                              {athlete.verified && (
                                <Badge variant="outline" className="text-[9px] border-[var(--nx-cyan)] text-[var(--nx-cyan)]">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-[var(--nx-text3)]">
                              {athlete.age} yrs • {athlete.position}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-[var(--nx-text3)]">
                            <TrendingUp className="w-3 h-3 text-[var(--nx-green)]" />
                            <span>{athlete.scoutViews} views</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <Badge className="bg-[var(--nx-green-dim)] text-[var(--nx-green)] border-none text-xs">
                            {athlete.sport}
                          </Badge>
                          <span className="flex items-center gap-1 text-xs text-[var(--nx-text3)]">
                            <MapPin className="w-3 h-3" />
                            {athlete.location}, {athlete.state}
                          </span>
                        </div>

                        {/* Badges */}
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {athlete.badges.slice(0, 2).map((badge, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--nx-bg4)] text-[var(--nx-text3)]">
                              {badge}
                            </span>
                          ))}
                          {athlete.badges.length > 2 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--nx-bg4)] text-[var(--nx-text3)]">
                              +{athlete.badges.length - 2}
                            </span>
                          )}
                        </div>

                        {/* Score Bar */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-[var(--nx-text3)]">NEXUS Score</span>
                            <span className="text-[var(--nx-green)] font-medium">{athlete.nexusScore}/100</span>
                          </div>
                          <Progress value={athlete.nexusScore} className="h-1.5 bg-[var(--nx-bg4)]" />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" className="h-7 bg-[var(--nx-green)] text-black hover:bg-[var(--nx-green-dark)]">
                            View Profile
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 border-[var(--nx-border)]">
                            <Bookmark className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 border-[var(--nx-border)]">
                            <Heart className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <Button variant="outline" className="w-full border-[var(--nx-border)] hover:border-[var(--nx-green-border)]">
                Load More Athletes
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* AI Recommendations */}
              <div className="nx-card p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[var(--nx-green-dim)] flex items-center justify-center">
                    <Zap className="w-4 h-4 text-[var(--nx-green)]" />
                  </div>
                  <h3 className="font-semibold">AI Insights</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-[var(--nx-text2)] p-3 rounded-lg bg-[var(--nx-bg4)]">
                    <span className="text-[var(--nx-green)]">Trending:</span> Football talent from Haryana showing 34% growth this month
                  </p>
                  <p className="text-sm text-[var(--nx-text2)] p-3 rounded-lg bg-[var(--nx-bg4)]">
                    <span className="text-[var(--nx-cyan)]">Hot:</span> Athletics sprinters U-16 category highly active
                  </p>
                </div>
              </div>

              {/* Featured Academies */}
              <div className="nx-card p-4">
                <h3 className="font-semibold mb-4">Featured Academies</h3>
                <div className="space-y-3">
                  {FEATURED_ACADEMIES.map((academy) => (
                    <div key={academy.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--nx-bg4)] transition-colors cursor-pointer">
                      <div className="w-10 h-10 rounded-xl bg-[var(--nx-green-dim)] flex items-center justify-center text-sm font-bold text-[var(--nx-green)]">
                        {academy.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{academy.name}</p>
                        <p className="text-xs text-[var(--nx-text3)]">{academy.sport} • {academy.location}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-[var(--nx-gold)] fill-[var(--nx-gold)]" />
                        <span className="text-xs">{academy.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-2 text-[var(--nx-green)]">
                  View All Academies
                </Button>
              </div>

              {/* Upcoming Trials */}
              <div className="nx-card p-4">
                <h3 className="font-semibold mb-4">Upcoming Trials</h3>
                <div className="space-y-3">
                  {UPCOMING_TRIALS.map((trial) => (
                    <div key={trial.id} className="p-3 rounded-lg bg-[var(--nx-bg4)] border border-[var(--nx-border)]">
                      <p className="text-sm font-medium">{trial.name}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-[var(--nx-text3)]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {trial.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {trial.location}
                        </span>
                      </div>
                      <Badge variant="outline" className="mt-2 text-[10px] border-[var(--nx-cyan)] text-[var(--nx-cyan)]">
                        {trial.spots} spots left
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <NexusFooter />
    </div>
  )
}
