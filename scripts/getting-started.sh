#!/usr/bin/env bash
set -e

echo "🚀 gTek GLOBAL — Getting Started Buildout"
echo "-----------------------------------------"

# 1. Ensure pnpm is installed
if ! command -v pnpm &> /dev/null; then
  echo "📦 Installing pnpm..."
  npm install -g pnpm
fi

# 2. Initialize monorepo
echo "📂 Setting up monorepo..."
mkdir -p apps packages supabase config .github/workflows

# 3. Run Codex scaffold
echo "🛠️  Generating scaffold via Codex CLI..."
node ./bin/codex.js init gtek-web gtek.world saas-global-templates-services

# 4. Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# 5. Local build check
echo "🔧 Building Next.js app..."
pnpm -C apps/gtek-web build

# 6. Supabase schema prep
echo "🗄️  Applying Supabase schema..."
psql $SUPABASE_DB < supabase/schema.sql || echo "⚠️ Supabase not connected — skipping."

# 7. GitHub Actions compliance workflow
echo "⚙️  Setting up GitHub Actions workflow..."
cp .github/workflows/compliance.yml .github/workflows/compliance.yml.backup 2>/dev/null || true
cat > .github/workflows/compliance.yml <<'YML'
# gTek GLOBAL Compliance Workflow
name: Compliance Pipeline
on: [push, workflow_dispatch]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: pnpm install
      - run: pnpm -C apps/gtek-web build
      - run: echo "See COMPLIANCE.md for details" >> $GITHUB_STEP_SUMMARY
YML

# 8. Git init & first commit
echo "📡 Initializing Git..."
git init
git add .
git commit -m "chore: initial gTek GLOBAL scaffold"
git branch -M main

# 9. Push to GitHub (assumes remote already added)
if git remote | grep origin; then
  echo "⬆️  Pushing to GitHub..."
  git push -u origin main
else
  echo "⚠️ No remote named origin set. Run: git remote add origin <url>"
fi

# 10. Vercel deploy (requires token + org/project IDs in env)
if [ -n "$VERCEL_TOKEN" ] && [ -n "$VERCEL_PROJECT_ID" ] && [ -n "$VERCEL_ORG_ID" ]; then
  echo "🚀 Deploying to Vercel..."
  npx vercel --prod \
    --token $VERCEL_TOKEN \
    --scope $VERCEL_ORG_ID \
    --confirm
else
  echo "⚠️ Vercel environment not configured. Set VERCEL_TOKEN, VERCEL_PROJECT_ID, VERCEL_ORG_ID."
fi

echo "✅ gTek GLOBAL — Getting Started complete!"
