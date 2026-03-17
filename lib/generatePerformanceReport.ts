import jsPDF from "jspdf"

interface SkillBar {
  label: string
  score: number
  weight: number
}

interface FormFinding {
  status: string
  title: string
  detail: string
}

interface InjuryPart {
  label: string
  pct: number
  color: string
}

interface PeerMetric {
  metric: string
  athlete: number
  avg: number
  label: string
}

interface TrajectoryPoint {
  month: string
  score: number
  type: string
}

interface ReportData {
  overallScore: number
  speedRating: string
  technique: string
  injuryRisk: string
  skillBars: SkillBar[]
  formFindings: FormFinding[]
  injuryParts: InjuryPart[]
  peerData: PeerMetric[]
  trajectoryData: TrajectoryPoint[]
  analysisSport: string
  analysisDate: string | null
  analysisVideoTitle: string
  hasAnalysis: boolean
}

// ── Color helpers ──
const COLORS = {
  bg: [15, 17, 21] as [number, number, number],
  card: [22, 25, 31] as [number, number, number],
  border: [40, 44, 52] as [number, number, number],
  text1: [240, 242, 245] as [number, number, number],
  text2: [170, 175, 185] as [number, number, number],
  text3: [120, 125, 135] as [number, number, number],
  cyan: [0, 212, 255] as [number, number, number],
  green: [0, 245, 116] as [number, number, number],
  gold: [255, 200, 50] as [number, number, number],
  amber: [255, 170, 50] as [number, number, number],
  red: [255, 80, 80] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  black: [0, 0, 0] as [number, number, number],
}

function scoreColor(s: number): [number, number, number] {
  if (s >= 80) return COLORS.cyan
  if (s >= 65) return COLORS.gold
  if (s >= 50) return COLORS.green
  if (s >= 35) return COLORS.amber
  return COLORS.red
}

function riskColor(risk: string): [number, number, number] {
  if (risk === "LOW") return COLORS.green
  if (risk === "MODERATE") return COLORS.amber
  return COLORS.red
}

export function generatePerformanceReport(data: ReportData) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 15
  const contentW = pageW - margin * 2
  let y = 0

  // ── Background ──
  function drawBackground() {
    doc.setFillColor(...COLORS.bg)
    doc.rect(0, 0, pageW, pageH, "F")
  }
  drawBackground()

  // ── Utility: check page break ──
  function checkPage(neededHeight: number) {
    if (y + neededHeight > pageH - 15) {
      doc.addPage()
      drawBackground()
      y = margin
    }
  }

  // ── Utility: draw rounded rect ──
  function drawCard(x: number, yPos: number, w: number, h: number) {
    doc.setFillColor(...COLORS.card)
    doc.setDrawColor(...COLORS.border)
    doc.setLineWidth(0.3)
    doc.roundedRect(x, yPos, w, h, 3, 3, "FD")
  }

  // ── Utility: section title ──
  function sectionTitle(title: string, icon?: string) {
    checkPage(14)
    y += 4
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(...COLORS.cyan)
    const text = icon ? `${icon}  ${title}` : title
    doc.text(text, margin, y)
    y += 2
    // Underline
    doc.setDrawColor(...COLORS.cyan)
    doc.setLineWidth(0.4)
    doc.line(margin, y, margin + doc.getTextWidth(text), y)
    y += 6
  }

  // ═══════════════════════════════════════════
  // HEADER
  // ═══════════════════════════════════════════
  y = margin

  // Top accent bar
  doc.setFillColor(...COLORS.cyan)
  doc.rect(0, 0, pageW, 3, "F")

  y = 14
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...COLORS.white)
  doc.text("NexusScore\u2122 Performance Report", margin, y)
  y += 7

  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...COLORS.text3)
  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  doc.text(`Generated on ${dateStr}  \u2022  AI-powered analysis`, margin, y)

  if (data.hasAnalysis && data.analysisDate) {
    y += 4
    doc.text(
      `Latest analysis: ${data.analysisVideoTitle} \u2022 ${data.analysisDate} \u2022 ${data.analysisSport === "cricket" ? "Cricket" : "Football"}`,
      margin,
      y
    )
  }

  y += 4
  doc.setDrawColor(...COLORS.border)
  doc.setLineWidth(0.3)
  doc.line(margin, y, pageW - margin, y)
  y += 6

  // ═══════════════════════════════════════════
  // KPI SUMMARY
  // ═══════════════════════════════════════════
  const kpis = [
    { label: "NexusScore\u2122", value: `${data.overallScore}/100`, color: COLORS.green },
    { label: "Speed Rating", value: data.speedRating, color: COLORS.cyan },
    { label: "Technique", value: data.technique, color: COLORS.gold },
    { label: "Injury Risk", value: data.injuryRisk, color: riskColor(data.injuryRisk) },
  ]

  checkPage(30)
  const kpiW = (contentW - 9) / 4
  const kpiH = 22

  kpis.forEach((kpi, i) => {
    const kpiX = margin + i * (kpiW + 3)
    drawCard(kpiX, y, kpiW, kpiH)

    // Label
    doc.setFontSize(7)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(...COLORS.text3)
    doc.text(kpi.label.toUpperCase(), kpiX + kpiW / 2, y + 7, { align: "center" })

    // Value
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(...kpi.color)
    doc.text(kpi.value, kpiX + kpiW / 2, y + 16, { align: "center" })
  })

  y += kpiH + 6

  // ═══════════════════════════════════════════
  // SKILL BREAKDOWN
  // ═══════════════════════════════════════════
  sectionTitle("Skill Breakdown")

  const barRowH = 8
  const barMaxW = contentW - 55

  data.skillBars.forEach((skill) => {
    checkPage(barRowH + 2)
    // Label
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(...COLORS.text2)
    doc.text(skill.label, margin, y + 3)

    // Score
    const sc = scoreColor(skill.score)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(...sc)
    doc.text(String(skill.score), pageW - margin, y + 3, { align: "right" })

    // Bar background
    const barX = margin + 45
    const barY = y
    const barH = 4
    doc.setFillColor(...COLORS.border)
    doc.roundedRect(barX, barY, barMaxW, barH, 2, 2, "F")

    // Bar fill
    const fillW = (skill.score / 100) * barMaxW
    doc.setFillColor(...sc)
    doc.roundedRect(barX, barY, fillW, barH, 2, 2, "F")

    y += barRowH
  })

  y += 4

  // ═══════════════════════════════════════════
  // CV FORM ANALYSIS
  // ═══════════════════════════════════════════
  sectionTitle("CV Form Analysis")

  data.formFindings.forEach((finding) => {
    checkPage(14)

    // Status indicator
    const isGood = finding.status === "good"
    doc.setFillColor(...(isGood ? COLORS.green : COLORS.amber))
    doc.circle(margin + 2, y + 2, 1.5, "F")

    // Title
    doc.setFontSize(9)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(...(isGood ? COLORS.text1 : COLORS.amber))
    doc.text(finding.title, margin + 7, y + 3)

    // Detail
    y += 5
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(...COLORS.text3)
    const detailLines = doc.splitTextToSize(finding.detail, contentW - 10)
    doc.text(detailLines, margin + 7, y + 1)
    y += detailLines.length * 4 + 3
  })

  y += 2

  // ═══════════════════════════════════════════
  // INJURY RISK
  // ═══════════════════════════════════════════
  sectionTitle("Injury Risk Assessment")

  checkPage(30)

  // Overall risk label
  doc.setFontSize(22)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...riskColor(data.injuryRisk))
  doc.text(data.injuryRisk, margin, y + 4)
  y += 3

  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...COLORS.text3)
  doc.text(
    data.hasAnalysis ? "Based on ML analysis" : "Overall risk assessment",
    margin,
    y + 5
  )
  y += 10

  // Body parts grid
  const partW = (contentW - 6) / 2
  const partH = 14

  data.injuryParts.forEach((part, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    if (col === 0 && i > 0) checkPage(partH + 2)

    const px = margin + col * (partW + 3)
    const py = y + row * (partH + 3)

    drawCard(px, py, partW, partH)

    // Percentage
    const partColor =
      part.pct >= 25 ? COLORS.red : part.pct >= 15 ? COLORS.amber : COLORS.green
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(...partColor)
    doc.text(`${part.pct}%`, px + partW / 2, py + 6, { align: "center" })

    // Label
    doc.setFontSize(7)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(...COLORS.text3)
    doc.text(part.label.toUpperCase(), px + partW / 2, py + 11, { align: "center" })
  })

  y += Math.ceil(data.injuryParts.length / 2) * (partH + 3) + 4

  // ═══════════════════════════════════════════
  // PEER COMPARISON
  // ═══════════════════════════════════════════
  sectionTitle("Peer Comparison")

  checkPage(10)

  // Table header
  const colWidths = [contentW * 0.35, contentW * 0.2, contentW * 0.2, contentW * 0.25]
  const headers = ["Metric", "Your Score", "Average", "Percentile"]

  doc.setFillColor(...COLORS.card)
  doc.rect(margin, y - 3, contentW, 7, "F")

  doc.setFontSize(8)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...COLORS.cyan)
  let colX = margin + 3
  headers.forEach((h, i) => {
    doc.text(h, colX, y + 1)
    colX += colWidths[i]
  })
  y += 7

  // Table rows
  data.peerData.forEach((peer) => {
    checkPage(8)
    colX = margin + 3

    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(...COLORS.text2)
    doc.text(peer.metric, colX, y)
    colX += colWidths[0]

    doc.setTextColor(...COLORS.green)
    doc.setFont("helvetica", "bold")
    doc.text(String(peer.athlete), colX, y)
    colX += colWidths[1]

    doc.setTextColor(...COLORS.amber)
    doc.setFont("helvetica", "normal")
    doc.text(String(peer.avg), colX, y)
    colX += colWidths[2]

    doc.setTextColor(...COLORS.green)
    doc.setFont("helvetica", "bold")
    doc.text(peer.label, colX, y)

    y += 6

    // Separator line
    doc.setDrawColor(...COLORS.border)
    doc.setLineWidth(0.15)
    doc.line(margin, y - 2, pageW - margin, y - 2)
  })

  y += 4

  // ═══════════════════════════════════════════
  // CAREER TRAJECTORY
  // ═══════════════════════════════════════════
  sectionTitle("Career Trajectory")

  checkPage(40)

  // Draw mini chart using lines
  const chartX = margin + 5
  const chartW = contentW - 10
  const chartH = 35
  const chartY = y

  // Chart background
  drawCard(margin, chartY - 4, contentW, chartH + 10)

  // Axis
  doc.setDrawColor(...COLORS.border)
  doc.setLineWidth(0.2)
  doc.line(chartX, chartY + chartH, chartX + chartW, chartY + chartH) // X axis
  doc.line(chartX, chartY, chartX, chartY + chartH) // Y axis

  // Y-axis labels
  const minScore = 55
  const maxScore = 90
  const yRange = maxScore - minScore
  const ySteps = [55, 65, 75, 85]
  doc.setFontSize(6)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...COLORS.text3)
  ySteps.forEach((val) => {
    const yPos = chartY + chartH - ((val - minScore) / yRange) * chartH
    doc.text(String(val), chartX - 4, yPos + 1, { align: "right" })
    doc.setDrawColor(...COLORS.border)
    doc.setLineWidth(0.1)
    doc.line(chartX, yPos, chartX + chartW, yPos)
  })

  // Plot data points and lines
  const points = data.trajectoryData
  const segmentW = chartW / (points.length - 1)

  points.forEach((point, i) => {
    const px = chartX + i * segmentW
    const py = chartY + chartH - ((point.score - minScore) / yRange) * chartH

    // X-axis label
    doc.setFontSize(6)
    doc.setTextColor(...COLORS.text3)
    doc.text(point.month, px, chartY + chartH + 4, { align: "center" })

    // Line to next point
    if (i < points.length - 1) {
      const nextPx = chartX + (i + 1) * segmentW
      const nextPy =
        chartY + chartH - ((points[i + 1].score - minScore) / yRange) * chartH

      doc.setDrawColor(...COLORS.green)
      if (point.type === "projected" || points[i + 1].type === "projected") {
        doc.setLineDashPattern([1, 1], 0)
        doc.setLineWidth(0.5)
      } else {
        doc.setLineDashPattern([], 0)
        doc.setLineWidth(0.8)
      }
      doc.line(px, py, nextPx, nextPy)
    }

    // Dot
    doc.setFillColor(...COLORS.green)
    doc.circle(px, py, 1, "F")

    // Score label
    doc.setFontSize(6)
    doc.setTextColor(...COLORS.green)
    doc.text(String(point.score), px, py - 3, { align: "center" })
  })

  // Reset dash pattern
  doc.setLineDashPattern([], 0)

  y = chartY + chartH + 12

  // Legend
  checkPage(10)
  doc.setFontSize(7)
  doc.setTextColor(...COLORS.text3)
  doc.setFont("helvetica", "normal")

  doc.setDrawColor(...COLORS.green)
  doc.setLineWidth(0.6)
  doc.line(margin + 3, y, margin + 10, y)
  doc.text("Actual performance", margin + 13, y + 1)

  doc.setLineDashPattern([1, 1], 0)
  doc.line(margin + 60, y, margin + 67, y)
  doc.setLineDashPattern([], 0)
  doc.text("Projected trajectory", margin + 70, y + 1)

  y += 8

  // Insight box
  checkPage(14)
  doc.setFillColor(20, 30, 25)
  doc.roundedRect(margin, y, contentW, 10, 2, 2, "F")
  doc.setFontSize(8)
  doc.setTextColor(...COLORS.text2)
  doc.text(
    "\u{1F4A1} At your current rate, you'll hit 80/100 by May \u2014 ISL U-21 trial-ready threshold.",
    margin + 4,
    y + 6
  )
  y += 16

  // ═══════════════════════════════════════════
  // FOOTER
  // ═══════════════════════════════════════════
  checkPage(20)

  // Footer bar
  const footerY = pageH - 12
  doc.setFillColor(...COLORS.card)
  doc.rect(0, footerY, pageW, 12, "F")

  doc.setDrawColor(...COLORS.cyan)
  doc.setLineWidth(0.3)
  doc.line(0, footerY, pageW, footerY)

  doc.setFontSize(7)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...COLORS.text3)
  doc.text("Generated by Nexus \u2022 AI Sports Analytics Platform", margin, footerY + 5)
  doc.text(
    "This report is AI-generated and should be used alongside professional coaching advice.",
    margin,
    footerY + 9
  )

  doc.setTextColor(...COLORS.cyan)
  doc.text(dateStr, pageW - margin, footerY + 5, { align: "right" })

  // ── Save ──
  doc.save(`NexusScore_Report_${new Date().toISOString().slice(0, 10)}.pdf`)
}
