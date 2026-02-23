# Vercel Setup (Additional)

This repository already deploys to GitHub Pages.  
This guide adds Vercel as an extra deployment target.

## 1) Create/connect Vercel project (one time)

1. Log in to Vercel.
2. Create a new project and connect this GitHub repo (`shbehruz04-design/Vs-code`).
3. Framework preset: `Other`.
4. Build command: leave empty (or default).
5. Output directory: leave empty.

## 2) Get Vercel IDs locally (one time)

Run in this repository root:

```powershell
vercel login
vercel link
```

After linking, open `.vercel/project.json` and copy:

- `orgId`
- `projectId`

## 3) Add GitHub repository secrets (one time)

GitHub repo -> `Settings` -> `Secrets and variables` -> `Actions` -> `New repository secret`

Add these three secrets:

- `VERCEL_TOKEN` (create token in Vercel account settings)
- `VERCEL_ORG_ID` (from `.vercel/project.json`)
- `VERCEL_PROJECT_ID` (from `.vercel/project.json`)

## 4) Trigger deploy

Push to `main` (your existing `Ctrl+Shift+B` flow already does this), or open:

- `Actions` -> `Deploy to Vercel (Optional)` -> `Run workflow`

If secrets are configured correctly, workflow deploys and prints the Vercel URL.
