import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-1">
        <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Terms of Service</h1>
              <p className="text-lg text-muted-foreground">Last updated: January 2025</p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container max-w-4xl">
            <div className="prose prose-lg max-w-none space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using PostUp's services, you accept and agree to be bound by the terms and provision
                  of this agreement. If you do not agree to these terms, please do not use our services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">2. Service Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  PostUp provides a platform for purchasing guest post placements on third-party websites. We act as an
                  intermediary between clients and publishers. While we vet all sites in our network, we do not control
                  the content or policies of third-party websites.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">3. User Obligations</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">When using our services, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Provide accurate and complete information</li>
                  <li>Submit original content that does not infringe on third-party rights</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Not use our services for spam, malicious, or illegal purposes</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">4. Payment Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All payments are processed securely through Stripe. Prices are listed in USD and are subject to
                  change. Payment is required before order processing begins. Refunds are handled on a case-by-case
                  basis according to our refund policy.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">5. Content Guidelines</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All content submitted must be original, well-written, and relevant to the target publication. We
                  reserve the right to reject content that does not meet quality standards or violates publisher
                  guidelines.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">6. Turnaround Times</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Estimated turnaround times are provided for each site but are not guaranteed. Actual publication times
                  may vary based on publisher schedules and content review processes.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">7. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  PostUp is not responsible for the actions, content, or policies of third-party publishers. We do not
                  guarantee specific SEO results or traffic outcomes from guest post placements.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">8. Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about these terms, please contact us at legal@postup.com
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
