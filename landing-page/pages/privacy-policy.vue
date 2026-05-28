<script setup lang="ts">
const lastUpdated = 'May 28, 2026'

useHead({
  title: 'Privacy Policy — WalletAI',
  meta: [
    { name: 'description', content: 'Privacy Policy for WalletAI — AI-powered personal finance automation system.' }
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
        <h1 class="text-4xl lg:text-5xl font-black tracking-tight mb-3">Privacy Policy</h1>
        <p class="text-muted text-sm">Last updated: {{ lastUpdated }}</p>
      </div>

      <div class="divider-gradient mb-8"></div>

      <!-- Self-hosted notice -->
      <div class="glass-light rounded-2xl border border-success-500/20 p-5 mb-8 flex gap-4">
        <div class="w-10 h-10 rounded-xl bg-success-600/20 border border-success-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg class="w-5 h-5 text-success-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd"/>
          </svg>
        </div>
        <div>
          <p class="text-sm font-semibold text-success-400 mb-1">Self-Hosted Software</p>
          <p class="text-sm text-muted leading-relaxed">
            WalletAI is open-source, self-hosted software. When you deploy it on your own server, <strong class="text-white/80">you are the data controller</strong>. We (the developers) do not collect, access, or process any of your personal or financial data. This policy describes the data practices of the software itself.
          </p>
        </div>
      </div>

      <div class="prose-dark">

        <h2>1. Overview</h2>
        <p>
          WalletAI ("the Software") is an open-source, self-hosted personal finance automation system. It is designed to run entirely on infrastructure you own and control. This Privacy Policy explains how data flows within the Software and what data the Software processes during normal operation.
        </p>
        <p>
          The developers of WalletAI do not operate any central servers, cloud services, or data collection infrastructure. All data processed by WalletAI resides exclusively on your own deployment environment.
        </p>

        <h2>2. Data We (the Software) Process</h2>
        <p>
          When you deploy and use WalletAI, the following categories of data are processed and stored on your infrastructure:
        </p>

        <h3>2.1 Financial Transaction Data</h3>
        <ul>
          <li>Transaction amounts and currencies</li>
          <li>Merchant names and descriptions</li>
          <li>Transaction dates and times</li>
          <li>Bank names and account types (debit/credit)</li>
          <li>AI-generated categories and subcategories</li>
        </ul>

        <h3>2.2 Bank Statement Data</h3>
        <ul>
          <li>PDF e-statement files uploaded by you (stored in your filesystem)</li>
          <li>Parsed transaction records extracted from statements</li>
          <li>Statement metadata (bank, month, upload date)</li>
        </ul>

        <h3>2.3 Email Data</h3>
        <ul>
          <li>Bank notification email subjects and body text (processed by n8n on your server)</li>
          <li>Email metadata (sender, received date) used to identify transaction notifications</li>
          <li>Emails are not stored persistently; only extracted transaction data is saved</li>
        </ul>

        <h3>2.4 Authentication Data</h3>
        <ul>
          <li>Google OAuth profile information: name, email address, profile picture URL, Google ID</li>
          <li>JWT authentication tokens (stored in browser memory, not persistent)</li>
          <li>No passwords are collected or stored; authentication is exclusively via Google SSO</li>
        </ul>

        <h2>3. Third-Party Services You Configure</h2>
        <p>
          WalletAI integrates with third-party services that you configure. Your use of these services is subject to their respective privacy policies:
        </p>

        <h3>3.1 Google Gmail API</h3>
        <p>
          WalletAI uses the Gmail API (via n8n) to read bank notification emails from your Gmail account. This requires you to grant OAuth access. Data accessed through Gmail is processed locally on your server and never transmitted to WalletAI developers.
        </p>

        <h3>3.2 Google Gemini AI API</h3>
        <p>
          Transaction data (merchant names and amounts) is sent to Google's Gemini API for AI categorization. This means merchant names from your transactions are sent to Google's servers to process your categorization requests. Please review <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a> for how they handle API request data.
        </p>

        <h3>3.3 Google OAuth (Authentication)</h3>
        <p>
          User authentication uses Google OAuth 2.0. Basic profile information (name, email, profile picture) is retrieved from Google and stored in your PostgreSQL database.
        </p>

        <h2>4. Data Storage and Security</h2>
        <p>
          All data is stored in a PostgreSQL database running on your own server infrastructure. You are responsible for securing your deployment, including:
        </p>
        <ul>
          <li>Database access controls and credentials</li>
          <li>Server security and firewall configuration</li>
          <li>SSL/TLS certificate management via nginx</li>
          <li>Regular backups of your PostgreSQL database</li>
          <li>Keeping Docker images and dependencies updated</li>
        </ul>

        <h2>5. Data Retention</h2>
        <p>
          WalletAI does not automatically delete any data. Transaction records, statements, and user accounts persist in your database until you manually delete them. You can delete data directly through the application UI or via database access.
        </p>

        <h2>6. Data Sharing</h2>
        <p>
          Because WalletAI is self-hosted, your data is not shared with the WalletAI developers or any third party, except:
        </p>
        <ul>
          <li><strong>Google Gemini API:</strong> Merchant names are sent for AI categorization as described above</li>
          <li><strong>Google OAuth:</strong> OAuth tokens are exchanged with Google for authentication</li>
        </ul>
        <p>
          No financial data is ever sold, rented, or shared for advertising purposes.
        </p>

        <h2>7. Your Rights</h2>
        <p>
          Since you self-host WalletAI, you have complete control over your data. You can:
        </p>
        <ul>
          <li>Access all data via the dashboard or directly through the database</li>
          <li>Delete individual transactions, statements, or your entire account</li>
          <li>Export data at any time by querying your PostgreSQL database</li>
          <li>Shut down the service and delete all data from your server</li>
          <li>Revoke Gmail and Google OAuth access from your Google Account settings</li>
        </ul>

        <h2>8. Children's Privacy</h2>
        <p>
          WalletAI is not intended for use by individuals under the age of 18. We do not knowingly collect data from minors.
        </p>

        <h2>9. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Updates will be reflected in the repository's changelog and this document's "Last updated" date. Continued use of the Software after changes constitutes acceptance of the updated policy.
        </p>

        <h2>10. Contact</h2>
        <p>
          For questions about this Privacy Policy or the Software's data practices, please open an issue on the GitHub repository.
        </p>
      </div>

      <div class="divider-gradient mt-10 mb-8"></div>

      <div class="flex flex-col sm:flex-row gap-3">
        <NuxtLink to="/" class="btn-outline text-sm justify-center">← Back to Home</NuxtLink>
        <NuxtLink to="/terms-of-service" class="btn-outline text-sm justify-center">Terms of Service →</NuxtLink>
      </div>
    </main>

    <AppFooter />
  </div>
</template>
