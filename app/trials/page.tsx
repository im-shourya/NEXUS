"use client"

import { useState } from "react"
import { Search, Filter, MapPin, Calendar, Users, Clock, ChevronRight, Target, Zap, CheckCircle, AlertCircle, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NexusNav } from "@/components/nexus/nexus-nav"
import { NexusFooter } from "@/components/nexus/nexus-footer"

const TRIALS_DATA = [
  {
    id: 1,
    name: "ISL Youth Trials 2026",
    organizer: "Indian Super League",
    sport: "Football",
    date: "Mar 25-27, 2026",
    location: "Goa",
    venue: "Fatorda Stadium",
    spots: 50,
    registered: 234,
    ageGroup: "U-17, U-19",
    level: "National",
    deadline: "Mar 20, 2026",
    status: "Open",
    requirements: ["NEXUS Score 70+", "State level participation", "Medical fitness certificate"],
    description: "Annual ISL youth talent hunt across India. Selected players get direct academy admission and scholarship opportunities.",
    fee: "Free",
    featured: true,
  },
  {
    id: 2,
    name: "PKL Selection Camp",
    organizer: "Pro Kabaddi League",
    sport: "Kabaddi",
    date: "Apr 2-5, 2026",
    location: "Patna",
    venue: "Patliputra Sports Complex",
    spots: 30,
    registered: 156,
    ageGroup: "U-21, Senior",
    level: "National",
    deadline: "Mar 28, 2026",
    status: "Open",
    requirements: ["NEXUS Score 65+", "District level experience", "Physical fitness test"],
    description: "Selection camp for PKL Season 12. Top performers will be drafted to PKL teams.",
    fee: "Rs. 500",
    featured: true,
  },
  {
    id: 3,
    name: "State Athletics Championship Trials",
    organizer: "Tamil Nadu Athletics Association",
    sport: "Athletics",
    date: "Apr 10-12, 2026",
    location: "Chennai",
    venue: "Jawaharlal Nehru Stadium",
    spots: 100,
    registered: 312,
    ageGroup: "U-16, U-18, U-21",
    level: "State",
    deadline: "Apr 5, 2026",
    status: "Open",
    requirements: ["District level participation", "Valid ID proof", "School/Academy recommendation"],
    description: "State championship qualifying trials. Winners represent Tamil Nadu at nationals.",
    fee: "Rs. 200",
    featured: false,
  },
  {
    id: 4,
    name: "Badminton Academy Open Trials",
    organizer: "Gopichand Academy",
    sport: "Badminton",
    date: "Apr 15, 2026",
    location: "Hyderabad",
    venue: "Pullela Gopichand Academy",
    spots: 20,
    registered: 89,
    ageGroup: "U-14, U-16",
    level: "Academy",
    deadline: "Apr 10, 2026",
    status: "Open",
    requirements: ["NEXUS Score 60+", "Basic badminton skills", "Age proof"],
    description: "Admission trials for India's premier badminton academy. Full scholarship for selected candidates.",
    fee: "Rs. 1000",
    featured: true,
  },
  {
    id: 5,
    name: "Hockey India Selection",
    organizer: "Hockey India",
    sport: "Hockey",
    date: "May 1-3, 2026",
    location: "Bhubaneswar",
    venue: "Kalinga Stadium",
    spots: 40,
    registered: 178,
    ageGroup: "U-21",
    level: "National",
    deadline: "Apr 25, 2026",
    status: "Closing Soon",
    requirements: ["State representation", "NEXUS Score 70+", "Medical clearance"],
    description: "Selection trials for Junior India Hockey Team. SAI coaching support for selected players.",
    fee: "Free",
    featured: false,
  },
]

const MY_REGISTRATIONS = [
  {
    id: 1,
    trialName: "ISL Youth Trials 2026",
    date: "Mar 25-27, 2026",
    location: "Goa",
    status: "Confirmed",
    registrationId: "ISL-2026-1847",
  },
]

export default function TrialsPage() {
  const [activeTab, setActiveTab] = useState("discover")
  const [sportFilter, setSportFilter] = useState("all")

  const featuredTrials = TRIALS_DATA.filter(t => t.featured)
  const allTrials = TRIALS_DATA

  return (
    <div className="min-h-screen bg-[var(--nx-bg)]">
      <NexusNav />
      
      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="px-4 py-12 md:py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="bg-[var(--nx-orange)] text-white mb-4">
              <Zap className="w-3 h-3 mr-1" />
              15 New Trials This Week
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Find Your
              <span className="text-[var(--nx-green)]"> Perfect Trial</span>
            </h1>
            <p className="text-[var(--nx-text2)] text-lg max-w-2xl mx-auto mb-8">
              Discover trials from ISL, PKL, state academies, and more. Register directly and track your applications.
            </p>

            {/* Search */}
            <div className="flex flex-col md:flex-row gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--nx-text3)]" />
                <Input 
                  placeholder="Search trials by sport, location, or organizer..."
                  className="pl-12 h-14 bg-[var(--nx-bg3)] border-[var(--nx-border)]"
                />
              </div>
              <Select value={sportFilter} onValueChange={setSportFilter}>
                <SelectTrigger className="w-full md:w-[160px] h-14 bg-[var(--nx-bg3)] border-[var(--nx-border)]">
                  <SelectValue placeholder="Sport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sports</SelectItem>
                  <SelectItem value="football">Football</SelectItem>
                  <SelectItem value="cricket">Cricket</SelectItem>
                  <SelectItem value="kabaddi">Kabaddi</SelectItem>
                  <SelectItem value="athletics">Athletics</SelectItem>
                  <SelectItem value="badminton">Badminton</SelectItem>
                </SelectContent>
              </Select>
              <Button className="h-14 px-8 bg-[var(--nx-green)] text-black">
                Search
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Trials */}
        <section className="px-4 pb-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-semibold mb-6">Featured Trials</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredTrials.map((trial) => (
                <div 
                  key={trial.id}
                  className="nx-card overflow-hidden hover:border-[var(--nx-green-border)] transition-all group"
                >
                  {/* Banner */}
                  <div className="h-28 bg-gradient-to-br from-[var(--nx-green-dim)] via-[var(--nx-bg4)] to-[var(--nx-bg3)] relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Target className="w-12 h-12 text-[var(--nx-green)]/20" />
                    </div>
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className="bg-[var(--nx-green)] text-black text-[10px]">{trial.level}</Badge>
                      <Badge variant="outline" className="border-white/30 text-white bg-black/30 text-[10px]">
                        {trial.sport}
                      </Badge>
                    </div>
                    {trial.status === "Closing Soon" && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-[var(--nx-orange)] text-white text-[10px]">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Closing Soon
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold">{trial.name}</h3>
                    <p className="text-xs text-[var(--nx-text3)] mt-1">by {trial.organizer}</p>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="flex items-center gap-2 text-xs text-[var(--nx-text2)]">
                        <Calendar className="w-3 h-3 text-[var(--nx-text3)]" />
                        <span>{trial.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[var(--nx-text2)]">
                        <MapPin className="w-3 h-3 text-[var(--nx-text3)]" />
                        <span>{trial.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[var(--nx-text2)]">
                        <Users className="w-3 h-3 text-[var(--nx-text3)]" />
                        <span>{trial.spots} spots</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[var(--nx-text2)]">
                        <Clock className="w-3 h-3 text-[var(--nx-text3)]" />
                        <span>{trial.ageGroup}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--nx-border)]">
                      <div>
                        <p className="text-xs text-[var(--nx-text3)]">Registration Fee</p>
                        <p className="font-semibold text-[var(--nx-green)]">{trial.fee}</p>
                      </div>
                      <Button size="sm" className="bg-[var(--nx-green)] text-black hover:bg-[var(--nx-green-dark)]">
                        Apply Now
                        <ArrowUpRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="px-4">
          <div className="max-w-6xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-[var(--nx-bg3)]">
                <TabsTrigger value="discover">All Trials</TabsTrigger>
                <TabsTrigger value="registered">My Registrations</TabsTrigger>
                <TabsTrigger value="recommended">AI Recommended</TabsTrigger>
              </TabsList>

              <TabsContent value="discover" className="mt-6 space-y-4">
                {allTrials.map((trial) => (
                  <div 
                    key={trial.id}
                    className="nx-card p-5 hover:border-[var(--nx-green-border)] transition-all"
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-16 h-16 rounded-xl bg-[var(--nx-green-dim)] flex items-center justify-center flex-shrink-0">
                        <Target className="w-8 h-8 text-[var(--nx-green)]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-lg">{trial.name}</h3>
                              <Badge variant="outline" className="text-[10px] border-[var(--nx-border)]">
                                {trial.sport}
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className={`text-[10px] ${
                                  trial.status === "Closing Soon" 
                                    ? "border-[var(--nx-orange)] text-[var(--nx-orange)]"
                                    : "border-[var(--nx-green-border)] text-[var(--nx-green)]"
                                }`}
                              >
                                {trial.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-[var(--nx-text3)] mt-1">by {trial.organizer}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-[var(--nx-green)]">{trial.fee}</p>
                            <p className="text-xs text-[var(--nx-text3)]">{trial.registered} registered</p>
                          </div>
                        </div>

                        <p className="text-sm text-[var(--nx-text2)] mt-3">{trial.description}</p>

                        <div className="flex flex-wrap gap-4 mt-4 text-sm text-[var(--nx-text3)]">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {trial.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {trial.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {trial.spots} spots
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Deadline: {trial.deadline}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                          {trial.requirements.map((req, i) => (
                            <span key={i} className="text-xs px-2 py-1 rounded-full bg-[var(--nx-bg4)] text-[var(--nx-text3)]">
                              {req}
                            </span>
                          ))}
                        </div>

                        <div className="flex gap-2 mt-4 pt-4 border-t border-[var(--nx-border)]">
                          <Button className="bg-[var(--nx-green)] text-black hover:bg-[var(--nx-green-dark)]">
                            Apply Now
                          </Button>
                          <Button variant="outline" className="border-[var(--nx-border)]">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="registered" className="mt-6">
                {MY_REGISTRATIONS.length > 0 ? (
                  <div className="space-y-4">
                    {MY_REGISTRATIONS.map((reg) => (
                      <div key={reg.id} className="nx-card p-5">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-[var(--nx-cyan)]/10 flex items-center justify-center">
                            <CheckCircle className="w-7 h-7 text-[var(--nx-cyan)]" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{reg.trialName}</h3>
                            <div className="flex gap-4 mt-1 text-sm text-[var(--nx-text3)]">
                              <span>{reg.date}</span>
                              <span>{reg.location}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-[var(--nx-green)] text-black">{reg.status}</Badge>
                            <p className="text-xs text-[var(--nx-text3)] mt-1">ID: {reg.registrationId}</p>
                          </div>
                          <Button variant="outline" className="border-[var(--nx-border)]">
                            View Pass
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="nx-card p-12 text-center">
                    <Target className="w-16 h-16 text-[var(--nx-text3)] mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Registrations Yet</h3>
                    <p className="text-[var(--nx-text3)] mb-4">Explore trials and register to track them here</p>
                    <Button className="bg-[var(--nx-green)] text-black">Explore Trials</Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="recommended" className="mt-6">
                <div className="nx-card p-5 mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--nx-green-dim)] flex items-center justify-center">
                      <Zap className="w-5 h-5 text-[var(--nx-green)]" />
                    </div>
                    <div>
                      <h3 className="font-semibold">AI-Powered Recommendations</h3>
                      <p className="text-sm text-[var(--nx-text3)]">Based on your profile and performance data</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {TRIALS_DATA.slice(0, 3).map((trial) => (
                    <div 
                      key={trial.id}
                      className="nx-card p-4 border-l-4 border-l-[var(--nx-green)]"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{trial.name}</h3>
                            <Badge className="bg-[var(--nx-green-dim)] text-[var(--nx-green)] text-[10px]">
                              94% Match
                            </Badge>
                          </div>
                          <p className="text-sm text-[var(--nx-text3)] mt-1">
                            {trial.date} • {trial.location}
                          </p>
                        </div>
                        <Button size="sm" className="bg-[var(--nx-green)] text-black">
                          Quick Apply
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <NexusFooter />
    </div>
  )
}
