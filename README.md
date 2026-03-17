# NEXUS — Sports Intelligence Platform
**Team Infinity · HackNova 3.0 · ATHLETECH Track · SRM Institute**

## Stack
Next.js 16 · TypeScript · Tailwind CSS v4 · ShadCN/Radix · Recharts · Supabase · Razorpay · Vercel

## Quick Start
```bash
npm install
npm run dev
# Visit http://localhost:3000
```

## Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
RESEND_API_KEY=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-south-1
AWS_S3_BUCKET=nexus-videos
```

## Roles
- **Athlete** — `/auth/signup?role=athlete` — Free profile, AI reel, scout matching
- **Scout** — `/auth/signup?role=scout` — Discover athletes, shortlist, trial invitations
- **Academy** — `/auth/signup?role=academy` — Squad management, tournaments, scout CRM

## Features
### AI Systems
1. Scout Matching Engine (sport-specific weights, 12 sports)
2. Highlight Reel Generator (MediaPipe + FFmpeg, Lambda)
3. CV Form Analyser (wasm, sport-specific findings)
4. Injury Risk Predictor (biomechanical rules per sport)
5. Readiness Score Engine (training load + recovery)
6. Peer Comparison Ranker (cohort percentiles)
7. Career Trajectory Predictor (linear regression)

### Payments
Razorpay — UPI, NetBanking, Card — 4 plan tiers — GST 18%

| Plan | Price | Role |
|------|-------|------|
| Free Athlete | ₹0 | Athlete |
| Pro Athlete | ₹99/mo | Athlete |
| Scout Pro | ₹499/mo | Scout |
| Academy | ₹999/mo | Academy |

## Project Structure
```
app/
  page.tsx                    ← Landing page
  athlete/                    ← Athlete dashboard suite
  scout/                      ← Scout dashboard suite
  academy/                    ← Academy dashboard suite
  auth/login|signup|...       ← Auth flows
  onboarding/athlete|scout|academy/
  payment/                    ← Razorpay checkout
  pricing/                    ← Pricing page
  discover/                   ← Public athlete discovery
components/
  landing/                    ← 13 landing sections
  nexus/                      ← Core design system components
  ui/                         ← ShadCN component set
lib/
  sport-config.ts             ← All 12 sports config
  utils.ts
```

## Deployment
```bash
vercel deploy --prod
```
