---
name: markdown-docs
description: Conventions for editing and verifying this docs-only repo's bilingual README pair, including the OpenCompare 001 status cell, evidence-sourced numbers, and the node:test content contract. Use when changing README.md / README.zh-CN.md or the checks under .munk/checks.
---

# Markdown docs (README pair)

## When to use

- Editing `README.md` or `README.zh-CN.md` (copy, tables, badges, leaderboard rows).
- Changing the `001` OpenCompare status cell or its evidence-backed numbers.
- Adding/adjusting content-contract tests in `.munk/checks/`.

## Rules

1. **Bilingual, same batch.** Any semantic change goes into `README.md` and `README.zh-CN.md` together, with identical meaning and matching emphasis/markup.
2. **Table shape is frozen.** Every table row keeps 6 columns / 7 pipes; header and separator rows stay byte-identical. Do not add, remove, or reorder columns.
3. **Numbers come from evidence only.** Sources live in the OpenCompare repo: `docs/perf/large-directory-memory.md` and `docs/perf/evidence/*.json`. Copy exact values; never derive throughput, average multiple rounds, or round.
4. **Size ≠ speed.** A repository size (e.g. `47 GB`) must not share a line with a run duration; put them on separate `<br>` lines and state the measurement basis (`du -sh` of both repos, includes unhashed files).
5. **Label the timings.** Cold run, warm runs, and multi-round total stay distinct and in order; never collapse them into one "X seconds" claim.
6. **Status must match facts.** Patrol wording distinguishes "configured" from "healthy". Never write `Active` / `维护中` / `正常` when the latest recorded run failed.
7. **Minimal diff.** Touch only the target cell/line. Leave other rows, paragraphs, URLs, and badges untouched; prefer a one-line replacement over rewrapping.

## Verify

- Contract suite (real bytes, baseline diff, evidence values): `node --test .munk/checks/readme-001-cell.test.mjs`
- Whitespace/conflict markers: `git diff --check`
- Manual L3: confirm the rendered table rows on GitHub still show the same column count and `<br>` breaks.
- When a new acceptance item appears, add a `node:test` case named after it (`ac-*`) rather than verifying by eye.
