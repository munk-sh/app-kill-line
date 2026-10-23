# AGENTS.md

This repository is a **docs-only** project: `README.md` (English) and `README.zh-CN.md` (Simplified Chinese) are the product. There is no application, package manifest, build step, or bundler here — do not scaffold one unless the product itself changes.

## Layout

- `README.md` / `README.zh-CN.md` — bilingual pair. Every content change lands in **both** files in the same batch, with identical meaning.
- The `001` row of the `Shipped Replacements` / `已完成平替` table carries the OpenCompare status cell: an installer line, a source-size line, a benchmark line, an evidence link, and an issue-patrol line, separated by `<br>`, italicised with `*...*`.
- Per-row value sources live in the OpenCompare repo (`docs/perf/large-directory-memory.md` + `docs/perf/evidence/*.json`). Never invent, round, average, or derive numbers from them.
- `.munk/checks/` — content-contract tests. `.munk/code-gates.json` — the gate matrix the Host runs.

## Conventions

- Keep the table shape fixed: 6 columns / 7 pipes per row; header and separator rows are byte-stable.
- Do not silently reformat unrelated lines, headings, badges, leaderboard rows, or link URLs.
- Status wording must match the recorded facts (e.g. patrol "configured" vs. "healthy"); never upgrade a failed run to `Active` / `正常`.
- Numbers in prose are only copied from archived evidence; when a cell mixes a size with a duration, keep them on separate `<br>` lines and label warm runs explicitly.

## Test pyramid

- L1 (content/logic, no external IO): `node --test .munk/checks/*.test.mjs` — `node:test` + `node:assert/strict`, zero dependencies (Node 24). Tests assert the real README bytes, the diff against the pre-change baseline, and evidence-derived values.
- There is no L2/L3 harness in this repo (no server, UI, or device surface). L3 visual verification is manual review of the rendered tables on GitHub.
- Run a single file with `node --test .munk/checks/<name>.test.mjs`; run the whole suite with the gate command below.
- Gates (single argv each): `git diff --check`, `node --test .munk/checks/readme-001-cell.test.mjs`.

## Skills

- Markdown/doc copy changes and the README status-cell contract: `.agents/skills/markdown-docs/SKILL.md`.
