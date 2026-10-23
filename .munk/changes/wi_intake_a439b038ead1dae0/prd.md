# 001 门禁改为显式区间可复跑

## 范围

只改两个文件：

- `.munk/checks/readme-001-cell.test.mjs`（门禁本体）：差异断言从 `git diff HEAD --name-only`（只覆盖未提交改动，干净树/合并提交/纯基线改动必然红）改为显式区间比较；行级对照改以 `git show <base>:<file>` 为基线；其余内容断言原样保留。
- `.munk/baseline/domains/readme/product.md`（readme 域基线）：`ac-gate-diff-allowlist` 改为新区间语义，`ac-code-gates-pass` 补三种复跑命令与默认 base 规则，「最近交付证明」追加本 WI id 与覆盖项。

两版 README 一个字节都不动；OpenCompare 仓不动。

## 验收

### 差异断言：区间选取

- ac-diff-default-clean: 工作树 `git status --porcelain` 为空且未设置 `MUNK_DIFF_*` 时，默认 base=`HEAD^`、head=`HEAD`；`node --test .munk/checks/readme-001-cell.test.mjs` 退出码 0。
- ac-diff-default-dirty: `git status --porcelain` 非空时默认 base=`HEAD`、head=`HEAD`，用 `git diff --name-only HEAD` 同时覆盖已暂存与未暂存改动；改动集合 ⊆ allowlist 时退出码 0。
- ac-diff-root-commit-fallback: base 解析出的提交无父提交时，base 取空树 `4b825dc642cb6eb9a060e54bf8d69288fbee4904`，不得抛错。
- ac-diff-explicit-range: 设置 `MUNK_DIFF_BASE` / `MUNK_DIFF_HEAD` 时按二者比较，且支持 SHA、分支名、`HEAD` 与 `HEAD^`；`MUNK_DIFF_HEAD` 未设置或为空串时回落为 `HEAD`。
- ac-diff-empty-range-ok: base 与 head 指向同一提交（如 `MUNK_DIFF_BASE=$(git rev-parse HEAD) MUNK_DIFF_HEAD=$(git rev-parse HEAD)`）时退出码 0，不因「零改动」失败。

### 差异断言：允许集合

- ac-diff-allowlist-subset: 先剔除 `.munk/changes/**` 与 `.munk/runs/**`，再断言改动集合是 `README.md`、`README.zh-CN.md`、`.munk/checks/readme-001-cell.test.mjs`、`.munk/baseline/domains/readme/product.md` 的**子集**；不要求四个同时出现（纯门禁改动、纯基线改动、合并结果、以及本轮仅 2 个文件都必须能过）。
- ac-diff-out-of-allowlist-reports: 出现集合外文件时退出非 0，且失败信息包含 base SHA、head SHA 与每个越界文件名；例如 `MUNK_DIFF_BASE=28e3bca MUNK_DIFF_HEAD=HEAD` 运行失败并点名 `AGENTS.md`。

### 行级断言

- ac-line-against-base: 行级断言以 `git show <base>:<file>` 作为对照快照，断言行数不变、仅索引 35（第 36 行）一行替换、表头与分隔行不变、该行仍 7 个管道符。
- ac-line-skip-when-no-diff: 某 README 在 base..head 无差异（含 base==head 空区间）时跳过该文件的整组行级断言，不得 fail，也不得退化为「读工作树与该文件自身比较」。
- ac-line-active-on-batch: 在最近一次 001 内容批次区间（`MUNK_DIFF_BASE=1b397be MUNK_DIFF_HEAD=0b99e07`）上运行，两版 README 的行级断言实际执行（输出中可见该用例通过而非跳过），且逐条断言成立。
- ac-head-snapshot-source: head 为 `HEAD` 时从工作树读取 README；head 为其它提交时从 `git show <head>:<file>` 读取，历史区间可复跑且与工作树状态无关。

### 内容断言保留

- ac-content-assertions-kept: 以下断言全部保留并作用于所选 head 快照：精确规模（752,479 文件 / 97,565 目录、不跟随符号链接）、冷跑 22,717 ms（第 1 轮实际哈希 76,604 文件 / 11,105,870,346 B）、热跑 9,361 / 9,547 ms、三轮合计 41,630 ms、`47 GB` 与耗时分行且注明 `du -sh` 合计与含未参与哈希的文件、冷→热→合计顺序与唯一性、证据链接 `large-directory-memory.md`、`v0.2.5 Shipped` / `v0.2.5 已发布` 与 releases URL、巡检只写「已配置」且无 failed/Active/正常 等禁用词、旧口径 `752k` / `9.3s` / `75.2 万文件` 不再出现。
- ac-content-passes-on-batch: 同一组内容断言在 `1b397be..0b99e07` 区间上全绿。
- ac-opencompare-repo-clean: OpenCompare 仓库 `git status --porcelain` 仍为空（检出不存在时按现有逻辑 skip）。

### 本次交付边界

- ac-readmes-bytes-untouched: 相对 HEAD，两版 README 逐字节相同（`git diff --name-only` 不含它们）；表格 6 列 / 7 管道符结构不变。
- ac-gates-config-untouched: `.munk/code-gates.json` 的两条单 argv 命令（`git diff --check`、`node --test .munk/checks/readme-001-cell.test.mjs`）不变；`AGENTS.md`、`.agents/skills/markdown-docs/SKILL.md` 未改动。
- ac-baseline-acs-updated: 基线 `ac-gate-diff-allowlist` 写明区间语义与子集/空区间/越界失败；`ac-code-gates-pass` 写入三种复跑命令与默认 base 规则；「最近交付证明」追加本 WI id、覆盖项与被测 commit；`ac-no-other-baseline-domain` 原样保留。
- ac-code-gates-pass: `git diff --check` 与 `node --test .munk/checks/readme-001-cell.test.mjs` 均返回 0；且实测覆盖三种状态：干净 HEAD 默认运行通过、显式区间（空区间 + 最近 4 文件批次）通过、反向越界区间失败并点名越界文件。
- ac-no-new-deps: 不新增依赖或脚手架；校验文件只使用 Node 内置模块（`node:test`、`node:assert/strict`、`node:fs`、`node:child_process`、`node:path`、`node:url`）。

## 非目标

- 不改两版 README 任何字节、表格结构、数字与巡检口径；`v0.2.5` 徽标与 22,717 / 9,361 / 9,547 / 41,630 ms 属同一份 v0.2.5 期证据，不允许单独换成 v0.2.6（需等 OpenCompare 归档同口径数字后「徽标 + 数字 + 校验文件」同批替换）。
- 不改 `AGENTS.md`（原计划的 Test pyramid 段已取消，复跑命令写在校验文件注释/失败信息与基线 AC 中）。
- 不改 `.munk/code-gates.json`、`.agents/skills/markdown-docs/SKILL.md`、Host 配置或 schedule。
- 不改 OpenCompare 仓任何文件、不重跑 benchmark、不 push。
- 不新增 L2/L3 测试、浏览器自测、CI 配置或打包发版脚手架；不重构校验文件其它用例。

## 实现约束

- 区间解析顺序：`MUNK_DIFF_BASE`/`MUNK_DIFF_HEAD` 优先；head 默认 `HEAD`；base 默认——`git status --porcelain` 非空取 `HEAD`，干净取 `HEAD^`；`HEAD^` 不存在时取空树 `4b825dc642cb6eb9a060e54bf8d69288fbee4904`。
- 取 diff 的方式：head 为 `HEAD` 时 `git diff --name-only <base>`（含暂存与未暂存）；否则 `git diff --name-only <base>..<head>`。
- 剔除前缀 `.munk/changes/`、`.munk/runs/` 后再做子集断言，越界文件逐个列出；allowlist 严格保持 4 个文件，不得为了「本轮少改」而放宽或收紧。
- 行级对照统一走 `git show <base>:<file>`；用 `git diff --name-only <base>..<head> -- <file>`（或等价）判断该 README 本区间是否有差异，无差异即跳过该文件的行级用例。
- 校验文件顶部注释与 allowlist 失败信息里写清三种复跑命令：默认、空区间 `MUNK_DIFF_BASE=$(git rev-parse HEAD) MUNK_DIFF_HEAD=$(git rev-parse HEAD)`、历史区间 `MUNK_DIFF_BASE=<sha> MUNK_DIFF_HEAD=<sha>`。
- 验证允许在本地临时提交以复现「干净 HEAD」，但禁止 push；若需保留未提交工作树，验证后 `git reset --soft HEAD^` 复原，并在交付说明同时写明干净态与工作树态的命令、base/head SHA 与结果，另附 `git rev-parse HEAD` 的被测 commit。
