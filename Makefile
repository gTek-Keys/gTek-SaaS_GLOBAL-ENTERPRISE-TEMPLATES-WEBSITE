dev:
	pnpm --prefix apps/gtek-web dev

build:
	pnpm --prefix apps/gtek-web build

predeploy:
	node scripts/predeploy.js || echo '{"ok":false}'

postdeploy:
	node scripts/postdeploy.js

reports:
	mkdir -p .reports
	node scripts/summarize-milestones.js > .reports/milestones-summary.md
	@echo "✅ Milestone summary updated at .reports/milestones-summary.md"
