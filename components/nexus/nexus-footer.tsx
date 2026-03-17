"use client"

import Link from "next/link"
import { NexusLogo } from "./nexus-logo"
import { Twitter, Instagram, Linkedin, Youtube, Mail, MapPin, Phone } from "lucide-react"

const footerLinks = {
  platform: {
    title: "Platform",
    links: [
      { label: "For Athletes", href: "/athletes" },
      { label: "For Scouts", href: "/scouts" },
      { label: "For Academies", href: "/academies" },
      { label: "Discover Talent", href: "/discover" },
      { label: "Pricing", href: "/pricing" },
    ]
  },
  sports: {
    title: "Sports",
    links: [
      { label: "Football", href: "/sports/football" },
      { label: "Cricket", href: "/sports/cricket" },
      { label: "Kabaddi", href: "/sports/kabaddi" },
      { label: "Athletics", href: "/sports/athletics" },
      { label: "All Sports", href: "/sports" },
    ]
  },
  resources: {
    title: "Resources",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Blog", href: "/blog" },
      { label: "Success Stories", href: "/stories" },
      { label: "API Docs", href: "/developers" },
      { label: "Partners", href: "/partners" },
    ]
  },
  company: {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Contact", href: "/contact" },
    ]
  }
}

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/nexussports", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com/nexussports", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com/company/nexussports", label: "LinkedIn" },
  { icon: Youtube, href: "https://youtube.com/nexussports", label: "YouTube" },
]

export function NexusFooter() {
  return (
    <footer className="bg-[var(--nx-bg2)] border-t border-[var(--nx-border)]">
      {/* Main Footer */}
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <NexusLogo size={36} />
              <span className="font-[family-name:var(--font-display)] text-xl tracking-wider text-[var(--nx-text1)]">
                NEXUS
              </span>
            </Link>
            <p className="text-sm text-[var(--nx-text3)] mb-6 max-w-xs leading-relaxed">
              India&apos;s AI-powered sports talent discovery platform connecting 50M+ youth athletes with professional scouts and academies.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-sm text-[var(--nx-text3)]">
              <a href="mailto:hello@nexus.sports" className="flex items-center gap-2 hover:text-[var(--nx-green)] transition-colors">
                <Mail className="w-4 h-4" />
                hello@nexus.sports
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                SRM Institute, Chennai, India
              </div>
              <a href="tel:+911234567890" className="flex items-center gap-2 hover:text-[var(--nx-green)] transition-colors">
                <Phone className="w-4 h-4" />
                +91 123 456 7890
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--nx-bg4)] text-[var(--nx-text3)] hover:bg-[var(--nx-green-dim)] hover:text-[var(--nx-green)] transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-[var(--nx-text1)] mb-4 text-sm">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--nx-text3)] hover:text-[var(--nx-green)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--nx-border)]">
        <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-[var(--nx-text3)]">
            &copy; {new Date().getFullYear()} NEXUS Sports. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-sm text-[var(--nx-text3)]">
            <Link href="/privacy" className="hover:text-[var(--nx-green)] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[var(--nx-green)] transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-[var(--nx-green)] transition-colors">
              Cookie Policy
            </Link>
          </div>
          <div className="text-xs text-[var(--nx-text3)]">
            Team Infinity | Hack Nova 3.0 | SRM Institute
          </div>
        </div>
      </div>
    </footer>
  )
}
