# ═══════════════════════════════════════════════════════════
# 📊 Google Analytics Setup Guide
# ═══════════════════════════════════════════════════════════

## Step 1: Create Google Analytics Account
1. Go to: https://analytics.google.com
2. Click "Start measuring"
3. Fill in account details:
   - Account name: Akram Mostafa
   - Property name: akrammostafa.com
   - Time zone: Egypt (GMT+2)
   - Currency: Egyptian Pound (EGP)

## Step 2: Get Tracking Code
After creating property, you'll get a code like:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## Step 3: Add to Your Website
Add the code to `index.html` **BEFORE** the `</head>` tag

## Step 4: Verify Installation
1. Visit your website
2. Go back to Google Analytics
3. Check "Real-time" report
4. You should see 1 active user (you!)

## Step 5: Set Up Goals (Optional)
- Goal 1: Contact form submission
- Goal 2: Course page visit
- Goal 3: Store page visit
- Goal 4: WhatsApp click

## Expected Data After 24-48 Hours:
✅ Number of visitors
✅ Page views
✅ Bounce rate
✅ Session duration
✅ Geographic location
✅ Device types (mobile/desktop)
✅ Traffic sources (Google, Facebook, Direct)

═══════════════════════════════════════════════════════════
