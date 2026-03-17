import { NexusLogo } from "@/components/nexus/nexus-logo"
import Link from "next/link"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[var(--nx-bg)]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--nx-bg)]/80 backdrop-blur-xl border-b border-[var(--nx-border)]">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <NexusLogo size="sm" />
          </Link>
          <Link 
            href="/auth/login"
            className="text-sm text-[var(--nx-text3)] hover:text-[var(--nx-text1)] transition-colors"
          >
            Already have an account? <span className="text-[var(--nx-green)]">Log In</span>
          </Link>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="pt-16">
        {children}
      </main>
    </div>
  )
}
