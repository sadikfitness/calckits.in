# 🚀 CalcKit Deployment Guide

This guide will help you deploy CalcKit to production.

## Prerequisites

- Git installed
- A GitHub account (or GitLab/Bitbucket)
- A Netlify account (free tier is sufficient)

## Step-by-Step Deployment

### 1. Prepare Your Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: CalcKit v1.0.0"

# Add remote repository
git remote add origin https://github.com/yourusername/calckit.git

# Push to GitHub
git push -u origin main
```

### 2. Deploy to Netlify

#### Option A: Using Netlify UI (Recommended for beginners)

1. **Sign up/Login to Netlify**
   - Go to https://netlify.com
   - Sign up with GitHub

2. **Create New Site**
   - Click "New site from Git"
   - Choose GitHub
   - Select your `calckit` repository

3. **Configure Build Settings**
   - Build command: Leave empty or `echo 'No build'`
   - Publish directory: `.` (root)
   - Click "Deploy site"

4. **Wait for Deployment**
   - First deploy takes 1-2 minutes
   - You'll get a random subdomain like `random-name-123.netlify.app`

5. **Custom Domain (Optional)**
   - Go to "Domain settings"
   - Click "Add custom domain"
   - Follow DNS configuration steps

#### Option B: Using Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site
netlify init

# Deploy
netlify deploy --prod
```

### 3. Configure Google Analytics

1. **Create GA4 Property**
   - Go to https://analytics.google.com
   - Create new property
   - Get your Measurement ID (G-XXXXXXXXXX)

2. **Update index.html**
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR-ID"></script>
   <script>
       gtag('config', 'G-YOUR-ID');
   </script>
   ```

3. **Deploy Changes**
   ```bash
   git add index.html
   git commit -m "Add Google Analytics"
   git push
   ```

### 4. Setup Google AdSense

1. **Apply for AdSense**
   - Go to https://adsense.google.com
   - Apply with your site
   - Wait for approval (usually 1-2 weeks)

2. **Add AdSense Code**
   - Copy the AdSense script from your dashboard
   - Add to `<head>` in index.html
   - Replace `.ad-placeholder` content with actual ad units

3. **Create Ad Units**
   - Header: 728x90 (Leaderboard)
   - Sidebar: 300x250 (Medium Rectangle)
   - Footer: 728x90 (Leaderboard)

### 5. Setup Affiliate Programs

#### Indian Finance Affiliates:

1. **Amazon Associates**
   - Apply: https://affiliate.amazon.in
   - Link to financial books, calculators

2. **PolicyBazaar**
   - Apply: https://www.policybazaar.com/partners
   - Insurance affiliate program
   - Commission: Up to ₹2000 per lead

3. **BankBazaar**
   - Apply: https://www.bankbazaar.com/partner
   - Loans, credit cards
   - Commission: ₹500-5000 per conversion

4. **Groww**
   - Apply: https://groww.in/affiliate
   - Investment platform
   - Commission varies

5. **Upstox**
   - Apply: https://upstox.com/open-account
   - Stock trading platform

### 6. SEO Configuration

#### Submit to Search Engines

1. **Google Search Console**
   ```
   1. Go to https://search.google.com/search-console
   2. Add property: calckit.netlify.app
   3. Verify ownership (use HTML tag method)
   4. Submit sitemap: https://calckit.netlify.app/sitemap.xml
   ```

2. **Bing Webmaster Tools**
   ```
   1. Go to https://www.bing.com/webmasters
   2. Add site
   3. Import from Google Search Console (easier)
   4. Submit sitemap
   ```

#### Generate Structured Data

Already included in index.html! Verify at:
- https://search.google.com/test/rich-results
- https://validator.schema.org/

### 7. Performance Optimization

#### Enable Netlify Features

1. **Asset Optimization**
   - Go to Site settings → Build & deploy → Post processing
   - Enable "Bundle CSS" and "Minify CSS"
   - Enable "Minify JS"
   - Enable "Compress images"

2. **Prerendering (Optional)**
   - Enable "Prerender" for better SEO
   - Good for static content

3. **Analytics**
   - Enable Netlify Analytics (optional, $9/mo)
   - Or use Google Analytics (free)

### 8. Social Media Setup

#### Open Graph Images

1. Create OG image (1200x630 px)
2. Add to index.html:
   ```html
   <meta property="og:image" content="https://calckit.netlify.app/og-image.png">
   ```

#### Twitter Card

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="CalcKit - All-in-One Calculator">
<meta name="twitter:description" content="20+ Free Calculators">
<meta name="twitter:image" content="https://calckit.netlify.app/twitter-card.png">
```

### 9. Post-Deployment Checklist

- [ ] Site is live and accessible
- [ ] SSL certificate is active (HTTPS)
- [ ] All calculators work correctly
- [ ] Mobile responsive design verified
- [ ] Dark mode toggle works
- [ ] Search functionality works
- [ ] Google Analytics tracking
- [ ] Sitemap submitted to search engines
- [ ] robots.txt is accessible
- [ ] Service worker registers (check DevTools)
- [ ] PWA can be installed
- [ ] All links work (no 404s)
- [ ] Forms validate properly
- [ ] Copy buttons work
- [ ] Charts display correctly

### 10. Monitoring & Maintenance

#### Weekly Tasks
- Check Google Analytics traffic
- Monitor AdSense earnings
- Check for broken links
- Review user feedback

#### Monthly Tasks
- Update exchange rates (if using real API)
- Review and optimize ad placements
- Check page speed (Lighthouse)
- Update sitemap if needed
- Backup calculation history data

#### Quarterly Tasks
- Update tax slabs (if changed)
- Review and add new calculators
- Update design/UI improvements
- Security audit

## Custom Domain Setup

### Using Namecheap/GoDaddy

1. **Purchase Domain**
   - Buy domain (e.g., calckit.com)

2. **Configure DNS**
   - Go to DNS settings
   - Add CNAME record:
     - Name: `www`
     - Value: `your-site.netlify.app`
   - Add A record (for root):
     - Name: `@`
     - Value: `75.2.60.5` (Netlify Load Balancer)

3. **Update Netlify**
   - Go to Domain settings
   - Add custom domain
   - Enable HTTPS (automatic)

## Troubleshooting

### Site Not Loading
- Check Netlify deploy logs
- Verify all files are pushed to Git
- Clear browser cache

### Service Worker Issues
- Clear browser cache
- Unregister old service worker (DevTools → Application)
- Hard refresh (Ctrl+Shift+R)

### Analytics Not Tracking
- Verify GA4 ID is correct
- Check ad blockers
- Wait 24 hours for data to appear

### Ad Spaces Empty
- Check AdSense approval status
- Verify ad codes are correct
- Check for ad blockers

## Security Headers Verification

Test at: https://securityheaders.com/

Expected grade: A or A+

## Performance Testing

1. **Google PageSpeed Insights**
   - https://pagespeed.web.dev/
   - Target: 90+ score

2. **GTmetrix**
   - https://gtmetrix.com/
   - Target: A grade

3. **WebPageTest**
   - https://www.webpagetest.org/
   - Target: < 2s load time

## Backup Strategy

### Automatic (via Git)
- All code is backed up in Git
- Netlify keeps deploy history

### Manual Backups
```bash
# Backup calculation history from localStorage
# Add export feature in future update

# Backup repository
git clone https://github.com/yourusername/calckit.git calckit-backup
```

## Cost Breakdown

### Free Tier (Recommended to Start)
- Netlify Hosting: Free
- Google Analytics: Free
- GitHub: Free
- Domain: ~$10-15/year
- SSL Certificate: Free (via Netlify)

**Total: ~$10-15/year**

### Paid Upgrades (Optional)
- Netlify Pro: $19/month (for analytics, forms)
- Google Workspace: $6/user/month (for custom email)
- Premium Domain: Varies
- CDN (Cloudflare Pro): $20/month

## Support & Help

- **Netlify Docs**: https://docs.netlify.com
- **Netlify Community**: https://community.netlify.com
- **Stack Overflow**: Tag with `netlify`, `pwa`
- **CalcKit Issues**: GitHub Issues page

## Next Steps

After successful deployment:

1. ✅ Share on social media
2. ✅ Submit to calculator directories
3. ✅ Create backlinks for SEO
4. ✅ Monitor user feedback
5. ✅ Plan feature updates

---

**Congratulations! Your CalcKit is now live! 🎉**

Visit your site and start helping users with calculations!

