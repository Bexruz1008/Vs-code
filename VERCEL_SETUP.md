# Vercel Auto Deploy (Per Folder)

This repository already deploys to GitHub Pages.  
Now Vercel deploy is also automated per folder.

## How it works

On every push to `main`, workflow:

1. Detects all folders that contain `index.html` (case-insensitive).
2. Creates/links a Vercel project for each folder automatically.
3. Deploys each detected folder to production.

Project name pattern:

- `vs-code-<folder-path-normalized>`

Examples:

- `.sass/Imtihon` -> `vs-code-sass-imtihon`
- `Html v2/Ilmla copy` -> `vs-code-html-v2-ilmla-copy`

## Required one-time setup

In GitHub repository:

1. `Settings` -> `Secrets and variables` -> `Actions`
2. Add secret:
   - `VERCEL_TOKEN`

Optional:

- Add repository variable `VERCEL_SCOPE` (team slug) if your token belongs to a team setup.
  If omitted, Vercel CLI default scope is used.

## Manual deploy for a specific folder

Open:

- `Actions` -> `Deploy to Vercel (Auto by Folder)` -> `Run workflow`

Set input:

- `deploy_dir` = folder path (example: `.sass/Imtihon`)

The folder must contain `index.html`.
