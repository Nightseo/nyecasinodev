import { ExpertOpinion } from "@/components/expert-opinion"

export default function ExpertsExamplePage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8">Expert Opinions Example</h1>

      <div className="space-y-8">
        <ExpertOpinion
          name="Lars Hansen"
          image="/images/Lars-Hansen.jpg"
          title="About Online Casino Security"
          content="<p>As an expert in online casino security, I've analyzed hundreds of platforms to ensure they meet the highest standards of data protection and fair play. The most secure casinos implement SSL encryption, have regular audits by independent testing agencies, and maintain licenses from respected regulatory bodies.</p><p>Players should always verify these security measures before depositing money. Look for certifications from eCOGRA or iTech Labs, and check that the casino uses reputable payment processors with additional security layers.</p>"
        />

        <ExpertOpinion
          name="Ole Johansen"
          image="/images/Ole-Johansen.jpg"
          title="Responsible Gambling Practices"
          content="<p>Responsible gambling should be at the core of every casino's operations. The best platforms provide tools like deposit limits, reality checks, and self-exclusion options. These features aren't just regulatory requirements—they're essential for player wellbeing.</p><p>I always recommend that players set strict budgets before they start playing and utilize the time management tools available. Remember that gambling should be entertainment, not a way to make money or solve financial problems.</p>"
        />

        <ExpertOpinion
          name="Ingrid Dahl"
          image="/images/Ingrid-Dahl.jpg"
          title="Maximizing Casino Bonuses"
          content="<p>Casino bonuses can significantly extend your playing time, but understanding the terms and conditions is crucial. Pay special attention to wagering requirements, game contributions, and maximum bet limits while a bonus is active.</p><p>The most valuable bonuses aren't always the ones with the highest amounts—look for those with fair terms that actually give you a realistic chance of converting bonus funds to real money. Low wagering requirements (30x or less) and reasonable time limits (30+ days) are good indicators of a player-friendly bonus.</p>"
        />
      </div>
    </div>
  )
}

