export default function ComparisonSection() {
  const rows = [
    { feature: "Verified scout identity", whatsapp: false, sports: "partial", nexus: true },
    { feature: "India-specific clubs (ISL, IPL, PKL)", whatsapp: false, sports: false, nexus: true },
    { feature: "AI performance scoring", whatsapp: false, sports: "partial", nexus: true },
    { feature: "Injury risk prediction", whatsapp: false, sports: false, nexus: true },
    { feature: "Tournament live scoring + scout alerts", whatsapp: false, sports: false, nexus: true },
    { feature: "Hindi & regional language support", whatsapp: true, sports: false, nexus: true },
    { feature: "Price", whatsapp: "Free", sports: "₹1,100/mo", nexus: "₹99/mo" },
  ]

  const cell = (val: boolean | string | "partial") => {
    if (val === true) return <span style={{ color: "var(--nx-green)" }}>✓ Yes</span>
    if (val === false) return <span style={{ color: "var(--nx-red)" }}>✗ No</span>
    if (val === "partial") return <span style={{ color: "var(--nx-amber)" }}>~ Partial</span>
    return <span style={{ color: "var(--nx-cyan)", fontFamily: "var(--font-display)", fontSize: "16px" }}>{val}</span>
  }

  return (
    <section className="py-20 px-6 md:px-20" style={{ background: "var(--nx-bg)" }}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-3" style={{ color: "var(--nx-text1)" }}>Why NEXUS instead of WhatsApp groups and Instagram DMs?</h2>
        <p className="text-sm text-center mb-10" style={{ color: "var(--nx-text3)" }}>The most common current "solution" is unverifiable — anyone can claim to be an ISL scout.</p>
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--nx-border)" }}>
          <table className="w-full">
            <thead>
              <tr style={{ background: "var(--nx-bg4)", borderBottom: "1px solid var(--nx-border)" }}>
                <th className="px-5 py-4 text-left text-xs font-semibold text-[var(--nx-text3)] tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)", width: "36%" }}>Feature</th>
                <th className="px-4 py-4 text-center text-xs font-semibold text-[var(--nx-text3)] tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)" }}>WhatsApp / DMs</th>
                <th className="px-4 py-4 text-center text-xs font-semibold text-[var(--nx-text3)] tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)" }}>SportsRecruits</th>
                <th className="px-4 py-4 text-center text-xs font-semibold tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--nx-green)" }}>NEXUS</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b" style={{ borderColor: "var(--nx-border)", background: i % 2 === 0 ? "var(--nx-bg3)" : "var(--nx-bg2)" }}>
                  <td className="px-5 py-3.5 text-sm" style={{ color: "var(--nx-text2)" }}>{row.feature}</td>
                  <td className="px-4 py-3.5 text-center text-sm">{cell(row.whatsapp as any)}</td>
                  <td className="px-4 py-3.5 text-center text-sm">{cell(row.sports as any)}</td>
                  <td className="px-4 py-3.5 text-center text-sm font-semibold">{cell(row.nexus as any)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
