# Ojai Interfaith Council Website
**ojaiinterfaith.org**

## Project Structure

```
ojaiinterfaith/
├── index.html          # Main page
├── css/
│   └── style.css       # All styles
├── js/
│   └── main.js         # All interactivity
├── data/
│   ├── events.json     # ← Edit this to update events
│   └── members.json    # ← Edit this to update council members
├── images/
│   └── logo.jpeg       # OIC logo
└── README.md
```

---

## Previewing Locally

Because the site loads `data/events.json` and `data/members.json` via JavaScript, you **cannot** preview it by just double-clicking `index.html` — browsers block local file requests for security. You have two options:

**Option A — VS Code Live Server (easiest):**
1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code
2. Right-click `index.html` → **Open with Live Server**

**Option B — Python (if installed):**
```bash
cd ojaiinterfaith
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

The live site at ojaiinterfaith.org will always work correctly.

---

## Updating Content

### Adding / Editing Events
Open `data/events.json` and add an entry:

```json
{
  "id": 5,
  "title": "Your Event Title",
  "date": "2026-08-15",
  "time": "6:00 PM",
  "location": "Venue Name",
  "address": "123 Main St, Ojai, CA 93023",
  "description": "A short description of the event.",
  "category": "Gathering"
}
```

Past events are automatically hidden. Categories: `Gathering`, `Community`, `Celebration`, `Meeting`, `Workshop`

### Adding / Editing Council Members
Open `data/members.json` and add/edit entries:

```json
{
  "id": 7,
  "name": "Full Name",
  "title": "Member at Large",
  "tradition": "Faith Tradition",
  "bio": "A short biography.",
  "photo": ""
}
```

To add a photo, put the image in `images/` and set `"photo": "images/yourphoto.jpg"`.

---

## Deploy to GitHub Pages + Cloudflare

### Step 1 — Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click **New repository**
3. Name it `ojaiinterfaith-website` (or similar)
4. Set to **Public** (required for free GitHub Pages)
5. Click **Create repository**

### Step 2 — Push the Files

If you have Git installed, open a terminal in this folder and run:

```bash
git init
git add .
git commit -m "Initial website launch"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ojaiinterfaith-website.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages

1. In your GitHub repo, go to **Settings → Pages**
2. Under **Source**, select `Deploy from a branch`
3. Branch: `main`, Folder: `/ (root)`
4. Click **Save**
5. GitHub will give you a URL like `https://yourusername.github.io/ojaiinterfaith-website`

### Step 4 — Connect Cloudflare to Your Domain

Since ojaiinterfaith.org is already on Cloudflare:

1. Log into your [Cloudflare dashboard](https://dash.cloudflare.com)
2. Select your domain → **DNS**
3. Add these DNS records:

   | Type  | Name | Content                        | Proxy |
   |-------|------|--------------------------------|-------|
   | A     | @    | 185.199.108.153                | ✓ On  |
   | A     | @    | 185.199.109.153                | ✓ On  |
   | A     | @    | 185.199.110.153                | ✓ On  |
   | A     | @    | 185.199.111.153                | ✓ On  |
   | CNAME | www  | YOUR_USERNAME.github.io        | ✓ On  |

4. Back in GitHub Pages settings, under **Custom domain**, enter `ojaiinterfaith.org`
5. Check **Enforce HTTPS** once it propagates (may take a few minutes)

### Step 5 — Set Up the Contact Form (Optional)

The form currently falls back to opening an email app. To enable direct form submissions:

1. Sign up free at [formspree.io](https://formspree.io)
2. Create a new form pointing to `info@ojaiinterfaith.org`
3. Copy your Form ID (looks like `xabc1234`)
4. In `js/main.js`, find this line:
   ```js
   const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
   ```
   Replace `YOUR_FORM_ID` with your actual ID.
5. Commit and push the change.

---

## Making Future Updates

Whenever you edit events, members, or any file:

```bash
git add .
git commit -m "Update events for June"
git push
```

GitHub Pages will automatically redeploy within ~1 minute.

---

## Need Help?

Contact your web administrator or email info@ojaiinterfaith.org.
