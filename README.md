# Anchor website

Static site: plain HTML, CSS, and JS. No build step, no dependencies,
no cookies, no analytics, self-hosted fonts.

## Files
- index.html — the one-page site
- privacy.html, terms.html — legal pages (served at /privacy and /terms)
- 404.html — not-found page
- sitemap.xml, robots.txt — SEO
- favicon.ico, favicon.svg, *.png icons, site.webmanifest — icons
- assets/img/og-image.png — social share image (1200x630)
- _headers — Netlify security + caching headers

## Before you deploy (important)
1. Domain: the site uses https://anchorrecovery.app everywhere
   (canonical URLs, sitemap, share image, structured data). If your
   domain is different, replace it in every file:
     grep -rl "anchorrecovery.app" . | xargs sed -i "s#https://anchorrecovery.app#https://YOUR-DOMAIN#g"
   Note: the Play Store link (id=com.anchorrecovery.app) is the app's
   package name, not the domain. The command above only replaces the
   https://anchorrecovery.app prefix, so the Play link stays correct.
2. Contact email: hello@anchorrecovery.app is a placeholder. Replace it
   with a real inbox you check:
     grep -rl "hello@anchorrecovery.app" . | xargs sed -i "s#hello@anchorrecovery.app#you@yourdomain.com#g"
3. Age: the privacy policy and terms say 18+. Make sure this matches
   the target audience you set in Play Console.

## Deploy on Netlify
Drag this whole folder into https://app.netlify.com/drop, or connect
the repo. Netlify serves privacy.html at /privacy and uses 404.html
automatically, and applies the _headers file.
(On other hosts, you may need to configure clean URLs and the 404
page yourself.)

## After you deploy
- Play Console: update your Privacy policy URL to https://YOUR-DOMAIN/privacy
  (App content -> Privacy policy), replacing the old Netlify link.
- Google Search Console: add the domain, then submit
  https://YOUR-DOMAIN/sitemap.xml
- Test the share preview by pasting your URL into a WhatsApp or
  LinkedIn message.

## Notes
- The Google Play button is custom-styled to match the site. Google's
  brand guidelines prefer the official "Get it on Google Play" badge,
  so swap it in if you want to follow them strictly.
- The privacy policy and terms were written to match what the app
  actually does, but they aren't legal advice. Have them reviewed if
  you can, especially the privacy policy given the sensitive subject.
