"use client"

import { useState } from "react"
import { Plus, Calendar, Clock, Target, CheckCircle2, Circle, MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"

const SESSIONS = [
  { id: 1, date: "Today", title: "Sprint & Agility Training", duration: "90 min", type: "Physical", completed: false, drills: ["10x 40m sprints", "Agility ladder × 15", "Cone dribbling × 10", "Plyometric jumps × 20"] },
  { id: 2, date: "Yesterday", title: "Ball Control + Shooting", duration: "75 min", type: "Technical", completed: true, drills: ["First touch drill × 50", "Shooting accuracy × 30", "Free-kick practice × 15", "1v1 drills × 20"] },
  { id: 3, date: "Dec 20", title: "Match Simulation", duration: "120 min", type: "Tactical", completed: true, drills: ["Full 11v11 match", "Set pieces training", "Video analysis session"] },
]

const PROGRESS = [
  { week: "W1", load: 65 }, { week: "W2", load: 72 }, { week: "W3", load: 80 },
  { week: "W4", load: 68 }, { week: "W5", load: 85 }, { week: "W6", load: 78 },
]

const GOALS = [
  { id: 1, title: "Sprint Speed 85/100", current: 82, target: 85, color: "var(--nx-cyan)", sport: "Football" },
  { id: 2, title: "Shooting Accuracy 80/100", current: 71, target: 80, color: "var(--nx-green)", sport: "Football" },
  { id: 3, title: "Pass Accuracy 75%", current: 68, target: 75, color: "var(--nx-gold)", sport: "Football" },
]

const TYPE_COLORS: Record<string, string> = {
  Physical: "var(--nx-cyan)", Technical: "var(--nx-green)", Tactical: "var(--nx-gold)", Recovery: "var(--nx-purple)"
}

export default function AthleteTrainingPage() {
  const [activeTab, setActiveTab] = useState("log")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--nx-text1)]">Training Hub</h1>
          <p className="text-[var(--nx-text3)] text-sm mt-0.5">Log sessions, track progress, hit your goals</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--nx-green)] text-black font-semibold text-sm hover:brightness-110 transition-all">
          <Plus className="w-4 h-4" />Log Session
        </button>
      </div>

      <div className="flex gap-2">
        {["log", "goals", "analytics"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all",
              activeTab === tab
                ? "bg-[var(--nx-green)] text-black"
                : "bg-[var(--nx-bg3)] border border-[var(--nx-border)] text-[var(--nx-text2)] hover:text-[var(--nx-text1)]"
            )}>{tab}</button>
        ))}
      </div>

      {activeTab === "log" && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {SESSIONS.map(session => (
              <div key={session.id} className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)] hover:border-[var(--nx-green-border)] transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <button className="mt-0.5 shrink-0">
                      {session.completed
                        ? <CheckCircle2 className="w-5 h-5 text-[var(--nx-green)]" />
                        : <Circle className="w-5 h-5 text-[var(--nx-text3)]" />}
                    </button>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-[var(--nx-text1)]">{session.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold"
                          style={{ background: `${TYPE_COLORS[session.type]}15`, color: TYPE_COLORS[session.type], fontFamily: "var(--font-mono)" }}>
                          {session.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-[var(--nx-text3)]">
                        <span><Calendar className="w-3 h-3 inline mr-1" />{session.date}</span>
                        <span><Clock className="w-3 h-3 inline mr-1" />{session.duration}</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-1.5 text-[var(--nx-text3)] hover:text-[var(--nx-text1)] transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {session.drills.map((d, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg text-xs bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text2)]">{d}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-5">
            <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
              <h3 className="font-semibold text-[var(--nx-text1)] mb-4">This Week</h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[{ val: "3", label: "Sessions" }, { val: "4.5h", label: "Total Time" }, { val: "78%", label: "Intensity" }].map((s, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[var(--nx-bg4)]">
                    <div className="text-xl font-bold text-[var(--nx-green)]" style={{ fontFamily: "var(--font-display)" }}>{s.val}</div>
                    <div className="text-[10px] text-[var(--nx-text3)]">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
              <h3 className="font-semibold text-[var(--nx-text1)] mb-4">Training Load</h3>
              <div className="flex items-end gap-2 h-20">
                {PROGRESS.map((p, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t-lg" style={{ height: "100%", background: "var(--nx-bg4)" }}>
                      <div className="w-full rounded-t-lg bg-[var(--nx-green)] transition-all" style={{ height: `${p.load}%`, marginTop: `${100 - p.load}%` }} />
                    </div>
                    <span className="text-[9px] text-[var(--nx-text3)]" style={{ fontFamily: "var(--font-mono)" }}>{p.week}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[var(--nx-text1)]">Quick Log</h3>
                <span className="text-xs text-[var(--nx-text3)]">Today</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Sprint", "Shooting", "Dribbling", "Stamina", "Recovery", "Match"].map(d => (
                  <button key={d} className="px-3 py-1.5 rounded-xl text-xs bg-[var(--nx-bg4)] border border-[var(--nx-border)] text-[var(--nx-text2)] hover:border-[var(--nx-green-border)] hover:text-[var(--nx-green)] transition-colors">
                    + {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "goals" && (
        <div className="space-y-4">
          {GOALS.map(goal => (
            <div key={goal.id} className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${goal.color}15` }}>
                    <Target className="w-4 h-4" style={{ color: goal.color }} />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--nx-text1)]">{goal.title}</p>
                    <p className="text-xs text-[var(--nx-text3)]">{goal.sport}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold" style={{ color: goal.color, fontFamily: "var(--font-display)", fontSize: "20px" }}>{goal.current}</p>
                  <p className="text-xs text-[var(--nx-text3)]">→ {goal.target}</p>
                </div>
              </div>
              <div className="h-2 bg-[var(--nx-bg4)] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${(goal.current / goal.target) * 100}%`, background: goal.color }} />
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-[var(--nx-text3)]">Progress: {Math.round((goal.current / goal.target) * 100)}%</p>
                <p className="text-xs" style={{ color: goal.color }}>{goal.target - goal.current} pts to go</p>
              </div>
            </div>
          ))}
          <button className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[var(--nx-bg3)] border border-dashed border-[var(--nx-border2)] text-[var(--nx-text3)] hover:border-[var(--nx-green-border)] hover:text-[var(--nx-green)] transition-all text-sm w-full justify-center">
            <Plus className="w-4 h-4" />Add New Goal
          </button>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="grid lg:grid-cols-2 gap-6">
          {[
            { title: "Sessions This Month", value: "14", sub: "↑ 3 from last month", color: "var(--nx-green)" },
            { title: "Total Training Hours", value: "21h", sub: "↑ 4.5h from last month", color: "var(--nx-cyan)" },
            { title: "Avg Session Intensity", value: "78%", sub: "Moderate-High", color: "var(--nx-gold)" },
            { title: "Goals Achieved", value: "2/3", sub: "One in progress", color: "var(--nx-purple)" },
          ].map((stat, i) => (
            <div key={i} className="p-5 rounded-2xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
              <p className="text-xs text-[var(--nx-text3)] mb-2" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>{stat.title}</p>
              <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: stat.color }}>{stat.value}</p>
              <p className="text-xs text-[var(--nx-text3)] mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
