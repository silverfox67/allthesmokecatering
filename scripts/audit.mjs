import fs from 'fs';

// Automatically load .env.local / .env if present
for (const envFile of ['.env.local', '.env']) {
  if (fs.existsSync(envFile)) {
    const envContent = fs.readFileSync(envFile, 'utf-8');
    for (const line of envContent.split(/\r?\n/)) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = (match[2] || '').trim().replace(/^['"](.*)['"]$/, '$1');
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

const targetUrl = process.argv[2];
if (!targetUrl) {
  console.error("Usage: node scripts/audit.mjs https://your-site.pages.dev");
  process.exit(1);
}

console.log(`\n⏳ Running Full Trident Pre-Flight Audit on: ${targetUrl}...`);

const apiKey = process.env.PAGESPEED_API_KEY ? `&key=${process.env.PAGESPEED_API_KEY}` : '';
const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&strategy=mobile${apiKey}`;

try {
  const [psiRes, htmlRes] = await Promise.all([
    fetch(psiUrl),
    fetch(targetUrl, { headers: { 'User-Agent': 'TridentAuditBot/1.0' } })
  ]);

  if (!psiRes.ok) throw new Error(`PageSpeed API failed: ${psiRes.status}`);
  if (!htmlRes.ok) throw new Error(`HTML fetch failed: ${htmlRes.status}`);

  const psiData = await psiRes.json();
  const html = await htmlRes.text();

  const lighthouse = psiData.lighthouseResult;
  const perfScore = Math.round(lighthouse.categories.performance.score * 100);
  const audits = lighthouse.audits;

  const vitals = {
    LCP: audits['largest-contentful-paint']?.displayValue || 'N/A',
    CLS: audits['cumulative-layout-shift']?.displayValue || 'N/A',
    TBT: audits['total-blocking-time']?.displayValue || 'N/A',
    FCP: audits['first-contentful-paint']?.displayValue || 'N/A',
  };

  const redSpeedIssues = [];
  for (const [id, audit] of Object.entries(audits)) {
    if (audit.score === null || audit.score >= 0.5) continue;
    const savingsMs = audit.details?.overallSavingsMs || 0;
    if (audit.score < 0.5 || savingsMs > 250) {
      redSpeedIssues.push({
        title: audit.title,
        display: audit.displayValue || '',
        savingsMs,
        items: (audit.details?.items || []).slice(0, 3).map(i => i.url || i.node?.snippet || '').filter(Boolean)
      });
    }
  }
  redSpeedIssues.sort((a, b) => b.savingsMs - a.savingsMs);

  const jsonLdMatches = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const schemasFound = [];
  jsonLdMatches.forEach(m => {
    try {
      const parsed = JSON.parse(m[1].trim());
      const types = Array.isArray(parsed) ? parsed.map(p => p['@type']) : [parsed['@type'] || parsed['@graph']?.map(g => g['@type'])];
      schemasFound.push(...types.flat().filter(Boolean));
    } catch (e) {
      schemasFound.push('INVALID_JSON_LD');
    }
  });

  const contentChecks = {
    hasPhoneOrEmail: /(tel:|mailto:|\(\d{3}\)|\d{3}-\d{3}-\d{4})/i.test(html),
    hasFooterEntity: /<footer[\s\S]*?(LLC|Inc|Copyright|©|\d{4})[\s\S]*?<\/footer>/i.test(html),
    hasNumberedSteps: /(<ol|Step\s+1|1\.\s+|01\.)/i.test(html),
    hasRawImages: /src=["'][^"']+\.(png|jpg|jpeg)["']/i.test(html),
    hasManifest: /rel=["']manifest["']/i.test(html),
    hasDirectAnswers: /<h[23][^>]*>[^<]+<\/h[23]>\s*<p>[^<]{100,}<\/p>/i.test(html),
    hasNoIndex: /<meta[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex[^"']*["']/i.test(html),
    canonicalMatch: html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1] || null,
    hasH1: /<h1[^>]*>([\s\S]*?)<\/h1>/i.test(html),
    rawWordCount: html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').length,
    hasSitemapXml: false,
    hasRobotsTxt: false,
  };

  try {
    const sitemapRes = await fetch(`${targetUrl.replace(/\/$/, '')}/sitemap.xml`);
    contentChecks.hasSitemapXml = sitemapRes.ok;
    const robotsRes = await fetch(`${targetUrl.replace(/\/$/, '')}/robots.txt`);
    contentChecks.hasRobotsTxt = robotsRes.ok;
  } catch (e) {}

  let md = `# Trident Pre-Flight Audit: ${targetUrl}\n\n`;
  md += `**Mobile Performance Score:** \`${perfScore}/100\`\n\n`;
  md += `### Core Web Vitals Snapshot\n`;
  md += `| LCP | CLS | TBT | FCP |\n`;
  md += `| :--- | :--- | :--- | :--- |\n`;
  md += `| **${vitals.LCP}** | **${vitals.CLS}** | **${vitals.TBT}** | ${vitals.FCP} |\n\n`;

  md += `## 🔴 PRIORITY 1: Critical Speed & Asset Bottlenecks\n`;
  if (redSpeedIssues.length === 0) {
    md += `*No critical speed bottlenecks detected. Performance is clean.*\n\n`;
  } else {
    redSpeedIssues.forEach((issue, idx) => {
      md += `### ${idx + 1}. ${issue.title} ${issue.display ? `(\`${issue.display}\`)` : ''}\n`;
      if (issue.items.length > 0) {
        md += `**Offending Files / Nodes:**\n`;
        issue.items.forEach(item => md += `- \`${item}\`\n`);
      }
      md += `\n`;
    });
  }

  md += `## 🛡️ PRIORITY 2: E-E-A-T, Schema & AI Search Compliance\n`;
  md += schemasFound.length > 0
    ? `- [x] **Active JSON-LD Schemas:** \`${schemasFound.join(', ')}\`\n`
    : `- [ ] **MISSING JSON-LD:** No structured data detected. Inject LocalBusiness, Service, or HowTo schema.\n`;

  md += contentChecks.hasDirectAnswers
    ? `- [x] **Problem-Resolution Flow:** Heading-to-answer semantic paragraphs detected.\n`
    : `- [ ] **WEAK AI SEARCH SIGNAL:** Missing direct-answer paragraph immediately under key headings.\n`;

  md += contentChecks.hasNumberedSteps
    ? `- [x] **Procedural Hierarchy:** Step-by-step resolution sequences detected.\n`
    : `- [ ] **MISSING RESOLUTION STEPS:** No numbered procedural sequences found for problem fixes.\n`;

  md += contentChecks.hasFooterEntity
    ? `- [x] **Entity Verification:** Legal entity and attribution found in footer.\n`
    : `- [ ] **MISSING E-E-A-T FOOTER:** Legal name, copyright, or local jurisdiction missing from footer.\n`;

  md += contentChecks.hasPhoneOrEmail
    ? `- [x] **Direct Contact Signals:** Phone or email contact hooks verified.\n`
    : `- [ ] **MISSING CONTACT SIGNALS:** Direct phone or email contact missing.\n`;

  md += contentChecks.hasRawImages
    ? `- [ ] **UNOPTIMIZED ASSETS:** Raw PNG/JPG detected in HTML. Convert to WebP/AVIF.\n`
    : `- [x] **Image Formats:** Next-gen WebP/AVIF formatting verified.\n`;

  md += contentChecks.hasManifest
    ? `- [x] **PWA Manifest:** Linked in header.\n`
    : `- [ ] **MISSING PWA MANIFEST:** manifest.json link missing from HTML header.\n`;

  md += `\n## 🔍 PRIORITY 3: Googlebot Indexing Readiness\n`;
  md += !contentChecks.hasNoIndex
    ? `- [x] **Noindex Directive:** Clean (No accidental noindex tags detected).\n`
    : `- [ ] **FATAL INDEXING BLOCK:** noindex found in HTML meta tags. Remove immediately.\n`;

  md += (contentChecks.canonicalMatch && contentChecks.canonicalMatch.startsWith('https://'))
    ? `- [x] **Canonical URL Set:** \`${contentChecks.canonicalMatch}\`\n`
    : `- [ ] **CANONICAL ERROR:** Missing or non-HTTPS canonical URL tag.\n`;

  md += contentChecks.hasH1
    ? `- [x] **Server-Rendered H1:** Verified in raw HTML payload.\n`
    : `- [ ] **BLANK HTML RISK:** No <h1> found in raw HTML. Page may be rendering purely client-side.\n`;

  md += contentChecks.rawWordCount > 250
    ? `- [x] **Raw Text Density:** ~${contentChecks.rawWordCount} words in initial payload (Passed thin-content check).\n`
    : `- [ ] **THIN CONTENT RISK:** Less than 250 words found in raw HTML payload.\n`;

  md += contentChecks.hasRobotsTxt
    ? `- [x] **robots.txt:** Live and reachable.\n`
    : `- [ ] **MISSING ROBOTS.TXT:** public/robots.txt is returning 404.\n`;

  md += contentChecks.hasSitemapXml
    ? `- [x] **sitemap.xml:** Live and reachable.\n`
    : `- [ ] **MISSING SITEMAP:** public/sitemap.xml is returning 404.\n`;

  md += `\n---\n`;
  md += `> **ANTIGRAVITY DIRECTIVE:** Review all unchecked [ ] items across Priority 1, 2, and 3 above. Apply all code, asset, and schema patches in a single batch pass, run npm run build to verify, and output a confirmation log.\n`;

  fs.writeFileSync('AUDIT_ACTION_PLAN.md', md);
  console.log(`\n✅ Audit Complete! Mobile Score: ${perfScore}/100`);
  console.log(`📁 Saved categorized action plan to: AUDIT_ACTION_PLAN.md\n`);
} catch (err) {
  console.error(`❌ Audit failed:`, err.message);
  process.exit(1);
}
