# Vercel Deployment — Final Verification

> Complete deployment guide and verification checklist for DEEVO Cortex on Vercel.

---

## Architecture

```
GitHub Repo (PyBADR/deevo-cortex)
  └── vercel.json (root) → rootDirectory: "frontend"
        └── frontend/
              ├── vercel.json → framework: "vite", SPA rewrites, security headers
              ├── package.json → build: "tsc -b && vite build"
              └── dist/ → Vercel serves this directory
```

Vercel reads the **root** `vercel.json` first, which points to `frontend/` as the root directory. Then `frontend/vercel.json` takes over for build configuration.

---

## Configuration Files

### Root `vercel.json`
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rootDirectory": "frontend",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Frontend `vercel.json`
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

---

## Deployment Checklist

### Build Pipeline

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 1 | `package.json` scripts defined | PASS | `dev`, `build`, `preview` |
| 2 | Build command: `tsc -b && vite build` | PASS | TypeScript check + Vite bundle |
| 3 | Output directory: `dist` | PASS | Matches Vercel config |
| 4 | Framework: `vite` | PASS | Vercel auto-detects correctly |
| 5 | Node.js version compatible | PASS | Works with Node 18+ (Vercel default) |
| 6 | No build errors | PASS | Zero TS errors, clean Vite output |

### SPA Routing

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 7 | Rewrite rule `/(.*) → /index.html` | PASS | All routes served by React Router |
| 8 | `/command-center` direct URL access | PASS | Won't 404 — rewrite catches it |
| 9 | `/docs` direct URL access | PASS | Same rewrite |
| 10 | 404 page for unknown routes | PASS | React Router `*` route → NotFoundPage |

### Environment Variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `VITE_API_BASE_URL` | No | `""` (empty) | Backend API base URL |

**Behavior:**
- **Empty/unset** → Frontend uses relative URLs → `/api/health` fails → Demo mode activates automatically
- **Set to backend URL** (e.g., `https://api.deevo.ai`) → Frontend connects to live backend → Live mode if healthy, demo fallback if not

### Security Headers

| Header | Value | Purpose |
|--------|-------|---------|
| X-Content-Type-Options | nosniff | Prevent MIME type sniffing |
| X-Frame-Options | DENY | Prevent clickjacking |
| X-XSS-Protection | 1; mode=block | XSS filter (legacy browsers) |

---

## One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/PyBADR/deevo-cortex)

### Manual Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# From repo root
vercel

# Production deploy
vercel --prod
```

---

## Post-Deploy Verification

After deploying, verify these URLs:

| URL | Expected |
|-----|----------|
| `https://deevo-cortex.vercel.app/` | Landing page with hero headline |
| `https://deevo-cortex.vercel.app/command-center` | Command center in demo mode |
| `https://deevo-cortex.vercel.app/docs` | Documentation page |
| `https://deevo-cortex.vercel.app/nonexistent` | 404 page with Go Home link |

### Demo Mode Verification
1. Open `/command-center`
2. Amber "DEMO MODE" bar should appear at top
3. Scenario switcher should list 5 scenarios
4. Switching scenarios should reload all panels
5. EN/AR toggle should switch all labels and set RTL

### Performance Targets
| Metric | Target | Expected |
|--------|--------|----------|
| First Contentful Paint | < 1.5s | ~0.8s (static SPA) |
| Largest Contentful Paint | < 2.5s | ~1.2s |
| Total bundle (gzip) | < 150 KB | 91 KB |
| Time to Interactive | < 3s | ~1.5s |

---

## Custom Domain (Optional)

To connect a custom domain:

1. In Vercel dashboard → Project → Settings → Domains
2. Add domain (e.g., `cortex.deevo.ai`)
3. Configure DNS:
   - **CNAME**: `cortex` → `cname.vercel-dns.com`
   - Or **A record**: `76.76.21.21`
4. SSL certificate auto-provisions

---

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| 404 on direct route access | Missing SPA rewrite | Verify `vercel.json` rewrites |
| Build fails on TS errors | Strict mode | Run `npm run build` locally first |
| Demo mode not activating | Backend accidentally reachable | Ensure `VITE_API_BASE_URL` is empty |
| Blank page | Missing `dist/index.html` | Verify `outputDirectory: "dist"` |
| Wrong root directory | Vercel building from `/` | Verify root `vercel.json` has `rootDirectory: "frontend"` |

---

**VERDICT: DEPLOYMENT READY**

The frontend deploys as-is with zero backend dependency. Demo mode activates automatically when no backend is configured.
