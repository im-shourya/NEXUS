export default function IndiaMapSection() {
  const examples = [
    { city: "Nagpur, Maharashtra", dist: "800km from Mumbai", result: "Striker → Mumbai City FC U-19 Trial" },
    { city: "Ranchi, Jharkhand", dist: "1,300km from Delhi", result: "Fast Bowler → Delhi Capitals Academy" },
    { city: "Kozhikode, Kerala", dist: "200km from Kochi", result: "Kabaddi Raider → Patna Pirates Camp" },
    { city: "Imphal, Manipur", dist: "2,200km from Chennai", result: "Sprinter → SAI National Camp" },
    { city: "Aurangabad", dist: "300km from Mumbai", result: "Leg-Spinner → MI Academy Trial" },
    { city: "Ludhiana, Punjab", dist: "300km from Delhi", result: "Wrestler → Army Sports Institute" },
  ]
  return (
    <section className="py-20 px-6 md:px-20" style={{ background: "#031A0A" }}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="relative h-72 rounded-2xl overflow-hidden" style={{ background: "var(--nx-bg4)", border: "1px solid var(--nx-border)" }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-3">🗺️</div>
              <p className="text-sm font-semibold" style={{ color: "var(--nx-green)" }}>India Talent Map</p>
              <p className="text-xs mt-1" style={{ color: "var(--nx-text3)" }}>Athletes from 200+ Indian cities</p>
              <div className="flex justify-center gap-4 mt-3">
                {["Nagpur","Ranchi","Kochi","Imphal","Aurangabad"].map(c => (
                  <div key={c} className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--nx-green)" }} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--nx-text1)" }}>India's next sports star is not in Mumbai.<br />They're in Nagpur. In Ranchi. In Imphal.</h2>
          <div className="space-y-3 mb-6">
            {examples.map((ex, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "var(--nx-green)" }} />
                <div>
                  <span className="text-sm font-semibold" style={{ color: "var(--nx-text1)" }}>{ex.city}</span>
                  <span className="text-xs mx-2" style={{ color: "var(--nx-text3)" }}>{ex.dist}</span>
                  <span className="text-xs" style={{ color: "var(--nx-green)" }}>→ {ex.result}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm" style={{ color: "var(--nx-text3)" }}>NEXUS has athletes from 200+ Indian cities — and growing every day.</p>
        </div>
      </div>
    </section>
  )
}
