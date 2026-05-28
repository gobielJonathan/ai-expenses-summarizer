<script setup lang="ts">
const lastUpdated = 'May 28, 2026'

useHead({
  title: 'Terms of Service — WalletAI',
  meta: [
    { name: 'description', content: 'Terms of Service for WalletAI — AI-powered personal finance automation system.' }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-bg text-text">
    <AppNav />

    <main class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">

      <!-- Header -->
      <div class="mb-10">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-1.5 text-sm text-muted hover:text-white transition-colors duration-200 mb-6 no-underline group"
        >
          <svg class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" viewBox="0 0 24 24" fill="none">
            <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M15 18l-6-6 6-6"/>
          </svg>
          Back to home
        </NuxtLink>

        <div class="section-label mb-4">Legal</div>
        <h1 class="text-4xl lg:text-5xl font-black tracking-tight mb-3">Terms of Service</h1>
        <p class="text-muted text-sm">Last updated: {{ lastUpdated }}</p>
      </div>

      <div class="divider-gradient mb-8"></div>

      <!-- Open source notice -->
      <div class="glass-light rounded-2xl border border-primary-500/20 p-5 mb-8 flex gap-4">
        <div class="w-10 h-10 rounded-xl bg-primary-600/20 border border-primary-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg class="w-5 h-5 text-primary-400" viewBox="0 0 24 24" fill="none">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div>
          <p class="text-sm font-semibold text-primary-400 mb-1">Open-Source Software License</p>
          <p class="text-sm text-muted leading-relaxed">
            WalletAI is open-source software distributed under the MIT License. These Terms of Service govern the use of the Software and any associated documentation or services provided by the WalletAI project.
          </p>
        </div>
      </div>

      <div class="prose-dark">

        <h2>1. Acceptance of Terms</h2>
        <p>
          By downloading, installing, deploying, or using WalletAI ("the Software"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Software.
        </p>
        <p>
          These Terms apply to all users of the Software, including individuals who deploy the Software for personal use.
        </p>

        <h2>2. Description of Software</h2>
        <p>
          WalletAI is an open-source, self-hosted personal finance automation system that:
        </p>
        <ul>
          <li>Reads bank transaction notification emails via Gmail API</li>
          <li>Parses bank PDF e-statements</li>
          <li>Uses Google Gemini AI for transaction categorization</li>
          <li>Provides an analytics dashboard for financial data visualization</li>
          <li>Runs on user-owned infrastructure via Docker</li>
        </ul>

        <h2>3. License</h2>
        <p>
          WalletAI is released under the <strong class="text-white/80">MIT License</strong>. You are free to:
        </p>
        <ul>
          <li>Use the Software for personal or commercial purposes</li>
          <li>Modify the source code</li>
          <li>Distribute copies of the Software</li>
          <li>Sublicense the Software</li>
        </ul>
        <p>
          The above rights are granted provided the original copyright notice and permission notice are preserved in all copies or substantial portions of the Software.
        </p>

        <h2>4. User Responsibilities</h2>
        <p>
          By using WalletAI, you agree to:
        </p>

        <h3>4.1 Legal Compliance</h3>
        <ul>
          <li>Use the Software only for lawful purposes and in compliance with applicable laws and regulations</li>
          <li>Comply with Google's Terms of Service when using Gmail API and Gemini AI integrations</li>
          <li>Comply with your bank's terms of service regarding automated access to account information</li>
          <li>Comply with applicable financial data regulations in your jurisdiction</li>
        </ul>

        <h3>4.2 Security</h3>
        <ul>
          <li>Maintain the security of your deployment environment</li>
          <li>Protect API keys, secrets, and authentication credentials</li>
          <li>Keep the Software and its dependencies updated</li>
          <li>Implement appropriate access controls to your server and database</li>
          <li>Not expose your deployment to unauthorized access</li>
        </ul>

        <h3>4.3 Proper Use</h3>
        <ul>
          <li>Use the Software solely for processing your own financial data</li>
          <li>Not use the Software to process third-party financial data without their explicit consent</li>
          <li>Not use the Software for any fraudulent, deceptive, or illegal financial activities</li>
          <li>Not attempt to reverse-engineer the AI models or circumvent rate limiting</li>
        </ul>

        <h2>5. Third-Party Services</h2>
        <p>
          WalletAI integrates with third-party services. Your use of these services is governed by their respective terms:
        </p>
        <ul>
          <li><strong class="text-white/80">Google Gmail API:</strong> Subject to Google API Terms of Service</li>
          <li><strong class="text-white/80">Google Gemini AI:</strong> Subject to Google AI/Gemini Terms of Service</li>
          <li><strong class="text-white/80">Google OAuth 2.0:</strong> Subject to Google Terms of Service</li>
        </ul>
        <p>
          You are responsible for obtaining and maintaining valid API credentials for all third-party services and for any costs incurred through their use.
        </p>

        <h2>6. Disclaimer of Warranties</h2>
        <p>
          THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, ACCURACY OF FINANCIAL DATA, AND NON-INFRINGEMENT.
        </p>
        <p>
          WalletAI is a personal productivity tool and does not constitute financial advice. The analytics and categorizations provided are automated and may contain errors. Always verify important financial information with your actual bank statements.
        </p>
        <p>
          THE DEVELOPERS DO NOT WARRANT THAT:
        </p>
        <ul>
          <li>The Software will be error-free or uninterrupted</li>
          <li>AI categorizations will be accurate or complete</li>
          <li>All bank email formats will be parsed correctly</li>
          <li>The Software will be compatible with all versions of supported bank email formats</li>
        </ul>

        <h2>7. Limitation of Liability</h2>
        <p>
          IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS OF WALLETAI BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE, ARISING FROM, OUT OF, OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
        </p>
        <p>
          This includes but is not limited to:
        </p>
        <ul>
          <li>Financial losses arising from incorrect categorization or analytics</li>
          <li>Data loss due to improper deployment or hardware failure</li>
          <li>Security breaches resulting from inadequate server configuration</li>
          <li>Third-party service outages or API changes</li>
          <li>Loss of access to Gmail or other integrated services</li>
        </ul>

        <h2>8. Financial Data and Advice</h2>
        <p>
          WalletAI is a personal data organization tool. It does not provide:
        </p>
        <ul>
          <li>Financial advice or investment recommendations</li>
          <li>Tax advice or calculations</li>
          <li>Accounting services</li>
          <li>Audited financial statements</li>
        </ul>
        <p>
          Always consult qualified financial or tax professionals for financial decisions.
        </p>

        <h2>9. Intellectual Property</h2>
        <p>
          The WalletAI source code is licensed under the MIT License as described in Section 3. The WalletAI name, logo, and documentation are the intellectual property of the project contributors and may not be used to imply endorsement without permission.
        </p>

        <h2>10. Privacy</h2>
        <p>
          Your use of WalletAI is also governed by our <NuxtLink to="/privacy-policy" class="text-primary-400 hover:text-primary-300">Privacy Policy</NuxtLink>, which describes how the Software processes and handles data.
        </p>

        <h2>11. Modifications to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. Changes will be reflected in the repository and indicated by an updated "Last updated" date. Your continued use of the Software after modifications constitutes acceptance of the revised Terms.
        </p>

        <h2>12. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the jurisdiction where the primary contributors reside, without regard to conflict of law provisions. Any disputes shall first be attempted to be resolved through GitHub issues or good-faith discussion.
        </p>

        <h2>13. Severability</h2>
        <p>
          If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect.
        </p>

        <h2>14. Entire Agreement</h2>
        <p>
          These Terms, together with the Privacy Policy and the MIT License, constitute the entire agreement between you and the WalletAI project regarding the Software and supersede all prior agreements.
        </p>

        <h2>15. Contact</h2>
        <p>
          For questions about these Terms, please open an issue on the GitHub repository or contact the project maintainers through GitHub.
        </p>
      </div>

      <div class="divider-gradient mt-10 mb-8"></div>

      <div class="flex flex-col sm:flex-row gap-3">
        <NuxtLink to="/" class="btn-outline text-sm justify-center">← Back to Home</NuxtLink>
        <NuxtLink to="/privacy-policy" class="btn-outline text-sm justify-center">Privacy Policy →</NuxtLink>
      </div>
    </main>

    <AppFooter />
  </div>
</template>
