"use client"

import { useState, useEffect } from "react"
import { Quote, Star, ChevronLeft, ChevronRight, Verified } from "lucide-react"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Athlete",
    sport: "Football",
    location: "Jharkhand",
    avatar: "/testimonials/priya.jpg",
    quote: "NEXUS changed everything for me. Coming from a small village in Jharkhand, I never thought ISL scouts would even know I exist. Within 3 months of creating my profile, I had 4 academy trials and now I'm training with Jamshedpur FC's youth team.",
    rating: 5,
    verified: true,
    outcome: "Signed with Jamshedpur FC Youth"
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    role: "Scout",
    organization: "Bengaluru FC",
    avatar: "/testimonials/rajesh.jpg",
    quote: "The AI matching is incredibly accurate. I've discovered 3 players through NEXUS who are now in our first team pipeline. The video analysis tools save me hours of work, and the filter system helps me find exactly what I'm looking for.",
    rating: 5,
    verified: true,
    outcome: "Discovered 12+ professional players"
  },
  {
    id: 3,
    name: "Ananya Reddy",
    role: "Athlete",
    sport: "Badminton",
    location: "Hyderabad",
    avatar: "/testimonials/ananya.jpg",
    quote: "My parents couldn't afford expensive academies. NEXUS connected me with a SAI scholarship program I didn't even know existed. Now I'm training at Pullela Gopichand Academy on a full scholarship.",
    rating: 5,
    verified: true,
    outcome: "SAI Scholarship Recipient"
  },
  {
    id: 4,
    name: "Vikram Singh",
    role: "Academy Director",
    organization: "Punjab Sports Academy",
    avatar: "/testimonials/vikram.jpg",
    quote: "We've streamlined our entire talent acquisition process through NEXUS. The trial management system is brilliant - from registration to selection, everything is automated. Our intake quality has improved by 40%.",
    rating: 5,
    verified: true,
    outcome: "40% improvement in intake quality"
  },
  {
    id: 5,
    name: "Mohammed Iqbal",
    role: "Athlete",
    sport: "Kabaddi",
    location: "Haryana",
    avatar: "/testimonials/iqbal.jpg",
    quote: "I was about to give up on my kabaddi dreams when NEXUS matched me with a PKL team scout. My AI potential score helped them see what I could become, not just what I was. Now I'm playing in the Pro Kabaddi League!",
    rating: 5,
    verified: true,
    outcome: "PKL Player - Haryana Steelers"
  }
]

const stats = [
  { value: "12,000+", label: "Success Stories" },
  { value: "4.9/5", label: "Average Rating" },
  { value: "94%", label: "Would Recommend" },
]

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goTo = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  const prev = () => goTo((currentIndex - 1 + testimonials.length) % testimonials.length)
  const next = () => goTo((currentIndex + 1) % testimonials.length)

  const current = testimonials[currentIndex]

  return (
    <section className="relative py-32 bg-[var(--nx-bg2)] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--nx-green)]/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-mono uppercase tracking-widest text-[var(--nx-purple)] bg-[rgba(155,93,255,0.08)] border border-[rgba(155,93,255,0.22)] rounded-full">
            Success Stories
          </span>
          <h2 className="text-nx-h1 text-[var(--nx-text1)] mb-6">
            Real Athletes,<br />
            <span className="text-[var(--nx-green)]">Real Dreams Achieved</span>
          </h2>
          <p className="text-nx-body-lg max-w-2xl mx-auto">
            From village grounds to professional leagues — hear from the athletes, 
            scouts, and academies who found success on NEXUS.
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-8 mb-16">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-[family-name:var(--font-display)] text-[var(--nx-green)] mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-[var(--nx-text3)]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Testimonial */}
        <div className="relative max-w-4xl mx-auto">
          <div className="p-8 md:p-12 rounded-3xl bg-[var(--nx-bg3)] border border-[var(--nx-border)]">
            {/* Quote Icon */}
            <Quote className="w-12 h-12 text-[var(--nx-green)]/30 mb-6" />

            {/* Quote Text */}
            <blockquote className="text-xl md:text-2xl text-[var(--nx-text1)] leading-relaxed mb-8 font-light">
              &ldquo;{current.quote}&rdquo;
            </blockquote>

            {/* Author */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                {/* Avatar placeholder */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--nx-green)] to-[var(--nx-cyan)] flex items-center justify-center text-lg font-bold text-black">
                  {current.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[var(--nx-text1)]">
                      {current.name}
                    </span>
                    {current.verified && (
                      <Verified className="w-4 h-4 text-[var(--nx-cyan)]" />
                    )}
                  </div>
                  <div className="text-sm text-[var(--nx-text3)]">
                    {current.role} {current.sport && `• ${current.sport}`} {current.organization && `• ${current.organization}`}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                {/* Rating */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: current.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[var(--nx-gold)] text-[var(--nx-gold)]" />
                  ))}
                </div>
                {/* Outcome */}
                <div className="px-3 py-1 text-xs font-medium rounded-full bg-[var(--nx-green-dim)] border border-[var(--nx-green-border)] text-[var(--nx-green)]">
                  {current.outcome}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goTo(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    index === currentIndex
                      ? "w-8 bg-[var(--nx-green)]"
                      : "bg-[var(--nx-border2)] hover:bg-[var(--nx-text3)]"
                  )}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full bg-[var(--nx-bg4)] border border-[var(--nx-border)] flex items-center justify-center text-[var(--nx-text2)] hover:text-[var(--nx-text1)] hover:border-[var(--nx-green-border)] transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="w-10 h-10 rounded-full bg-[var(--nx-bg4)] border border-[var(--nx-border)] flex items-center justify-center text-[var(--nx-text2)] hover:text-[var(--nx-text1)] hover:border-[var(--nx-green-border)] transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Testimonial Cards Preview */}
        <div className="hidden lg:grid grid-cols-3 gap-6 mt-12">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <button
              key={testimonial.id}
              onClick={() => goTo(index)}
              className={cn(
                "p-6 rounded-2xl text-left transition-all",
                index === currentIndex
                  ? "bg-[var(--nx-green-dim)] border border-[var(--nx-green-border)]"
                  : "bg-[var(--nx-bg3)]/50 border border-[var(--nx-border)] hover:bg-[var(--nx-bg3)]"
              )}
            >
              <p className="text-sm text-[var(--nx-text2)] mb-4 line-clamp-3">
                &ldquo;{testimonial.quote.slice(0, 100)}...&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--nx-green)] to-[var(--nx-cyan)] flex items-center justify-center text-xs font-bold text-black">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-sm font-medium text-[var(--nx-text1)]">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-[var(--nx-text3)]">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
