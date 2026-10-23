# 两版 README 第 28 行巡检文案收窄为「已配置」+ 001 校验行索引白名单放开

## 范围

本仓是 ops 定期统计维护的榜单仓库，本期只做「按需更新版本引用 + 文案实事求是」，**不建 CI / 测试基建**。共改 3 个文件，全批同提：

1. `README.md` 第 28 行（0-based index 27）整行替换为：

   ```text
   3. **15-Min Autonomous Issue Patrol**: Every shipped repo is wired into a **15-minute GitHub Issue patrol** — agents reproduce bugs, write regression gates, and triage feature requests.
   ```

   （相对现状仅删除 `, evaluate feature requests, and cut signed releases around the clock` 这一段并改写为 ` and triage feature requests.`；标题、`**15-minute GitHub Issue patrol**` 加粗、破折号保持原样。）

2. `README.zh-CN.md` 第 28 行（index 27）整行替换为：

   ```text
   3. **每 15 分钟巡检维护**：每个开源仓库均已配置每 15 分钟自动巡检 GitHub Issues，自动复现 Bug、评估需求。
   ```

   （相对现状仅删除「跑性能门禁并打包发版，绝不烂尾」类发版承诺并改为「自动复现 Bug、评估需求」。）

3. `.munk/checks/readme-001-cell.test.mjs`：只放开「行索引白名单」两处，不改任何其他断言/常量：
   - 新增常量 `const ALLOWED_CHANGED_LINES = [27, 35];`（27 = 第 28 行「15 分钟巡检流程段」，35 = 001 行），并在常量旁加注释：27 为按 2026-10-23 裁决「只述配置」改写的巡检流程段，35 为 001 状态行，其余行逐字节锁定。
   - `ac-single-changed-line-per-file` 中的 `assert.deepEqual(changedIdx, [35], ...)` 改为：`changedIdx` 非空、无重复、每个元素都在 `ALLOWED_CHANGED_LINES` 内、且 `length <= 2`；失败信息仍点名文件与具体行号。该用例中「行数不变」「表头 before[33]/after[33] 不变」「分隔行 before[34]/after[34] 不变」「001 行 7 pipes / 6 列 / 首尾管道」全部保留。
   - `ac-other-content-untouched` 的跳过条件由 `if (i === 35) return;` 改为 `if (ALLOWED_CHANGED_LINES.includes(i)) return;`，其余逐字节比较逻辑与诊断输出不变。
   - `ALLOWLIST`（4 个文件）、`IGNORED_PREFIXES`（`.munk/changes/`、`.munk/runs/`）、`MUNK_DIFF_BASE` / `MUNK_DIFF_HEAD` 区间解析与默认 base 规则、用例数量与文件清单：**一字不改、一条不增**。

4. `.munk/baseline/domains/readme/product.md`：把 `ac-single-changed-line-per-file` / `ac-other-content-untouched` 两条改为「只允许 001 行（索引 35）与巡检流程段（索引 27）两行改写，其余行逐字节锁定」，并记录本期第 28 行改写理由（只述配置事实、不发版承诺），追加本 WI 交付证明。

## 验收

- ac-en-line28-exact: `README.md` 第 28 行字符串逐字等于 `3. **15-Min Autonomous Issue Patrol**: Every shipped repo is wired into a **15-minute GitHub Issue patrol** — agents reproduce bugs, write regression gates, and triage feature requests.`
- ac-zh-line28-exact: `README.zh-CN.md` 第 28 行字符串逐字等于 `3. **每 15 分钟巡检维护**：每个开源仓库均已配置每 15 分钟自动巡检 GitHub Issues，自动复现 Bug、评估需求。`
- ac-line28-no-release-promise: 两版全文不含 `cut signed releases`、`around the clock`、`打包发版`、`绝不烂尾`、`自动化发版`；中文行不再出现「性能门禁」类承诺。
- ac-readmes-only-line28: 两版 README 与 `git show HEAD:<file>` 相比，变化行索引集合恰好是 `[27]`（两文件各自），文件总行数仍为 71，索引 27 以外的每一行逐字节相同。
- ac-001-cell-untouched: 两版 001 行（索引 35）逐字节等于 HEAD 快照：仍含 `v0.2.5 Shipped` / `v0.2.5 已发布`、`47 GB`、`752,479`（文件/目录口径）、`22,717 ms`、`9,361 / 9,547 ms`、`41,630 ms`、证据链接 `large-directory-memory.md`、`🤖 *15-min issue patrol configured*` / `🤖 *已配置每 15 分钟巡检*`；不出现 `v0.2.6` 或 `21.9 / 20.9 / 21.3 s`。
- ac-gate-whitelist-constant: 校验文件存在 `const ALLOWED_CHANGED_LINES = [27, 35];`，并在常量处或断言处以注释说明 27/35 的含义。
- ac-gate-line-guard: `ac-single-changed-line-per-file` 的变化行断言要求「非空 + 无重复 + 全部落在 `ALLOWED_CHANGED_LINES` 内 + 长度 ≤ 2（即 ≤ 白名单长度）」；越界时失败信息包含文件名与越界行号；行数不变、表头 33、分隔行 34、001 行 7 pipes/6 列的原断言仍逐条存在。
- ac-gate-other-lines-locked: `ac-other-content-untouched` 的跳过集合取自 `ALLOWED_CHANGED_LINES`，其余行仍逐字节比较；仅改第 28 行时该用例通过，并对其余 68 行（71 行减去 27、35 两行索引）实际比较。
- ac-gate-semantics-unchanged: `ALLOWLIST` 仍恰好是 `README.md`、`README.zh-CN.md`、`.munk/checks/readme-001-cell.test.mjs`、`.munk/baseline/domains/readme/product.md` 四项；`IGNORED_PREFIXES` 仍只有 `.munk/changes/`、`.munk/runs/`；区间解析（`MUNK_DIFF_BASE` / `MUNK_DIFF_HEAD` 优先、head 默认 `HEAD`、脏树 base=`HEAD`、干净树 base=`HEAD^`、无父回退空树）不变；测试用例数与文件集合不变（13 个用例、1 个测试文件），不新增断言用例。
- ac-no-ci: `.github/` 下仍只有 `ISSUE_TEMPLATE/`（`nominate-paid-app.yml`、`config.yml`），`.github/workflows/**` 不存在；本轮不新增任何 `*.yml` 工作流、不引入 `readme-001-contract.yml`、不接远端 CI。
- ac-gates-config-unchanged: `.munk/code-gates.json` 仍只有 `static`（`git diff --check`）与 `test`（`node --test .munk/checks/readme-001-cell.test.mjs`）两条单 argv 命令，`version` 与结构不变。
- ac-baseline-whitelist: `.munk/baseline/domains/readme/product.md` 两条 AC 写明「只允许 001 行（索引 35）与巡检流程段（索引 27）两行改写」，并记录第 28 行改写理由（`scheduleCron=*/15 * * * *` + `scheduleEnabled=true` 只支撑「已配置」、不发版承诺）；其余域文件未改动。
- ac-code-gates-pass: `git diff --check` 退出 0；`node --test .munk/checks/readme-001-cell.test.mjs` 在脏树默认区间（base=head=HEAD）下 13 个用例全绿、退出 0；空区间 `MUNK_DIFF_BASE=$(git rev-parse HEAD) MUNK_DIFF_HEAD=$(git rev-parse HEAD)` 亦退出 0。
- ac-opencompare-untouched: `codebases/projects/open-compare` 的 `git status --porcelain` 为空且 HEAD 未变，未改其任何文件、未重跑 benchmark。

## 非目标

- 不新增 CI 工作流、不接 GitHub Actions、不搬已 abort 项（`wi_intake_b17fb3ee5943e692`）的 `readme-001-contract.yml`，不做合并后 push 验证。
- 不新增测试用例、不新增测试文件、不引入依赖或脚手架；校验文件除上述两处行索引白名单外不动（`ALLOWLIST`、`IGNORED_PREFIXES`、区间解析、内容断言、禁用词断言全部保持）。
- 不改 `.munk/code-gates.json`、`AGENTS.md`、`.agents/skills/markdown-docs/SKILL.md`。
- 不动 001 行单元格：`v0.2.5` 徽标、安装包链接、`47 GB`、`752,479` 规模、`22,717 / 9,361 / 9,547 / 41,630 ms`、证据链接、巡检配置文案一律零字节改动；`v0.2.5 → v0.2.6` 与 `21.9 / 20.9 / 21.3 s` 需等 OpenCompare 仓归档同口径证据后「徽标 + 数字 + 校验文件」同批替换，本期不做。
- 不改榜单（Shipped Replacements / 已完成平替）、Target Leaderboard、Why、Watch Live、License 等段落，不改表格列数/表头/分隔行/编号/价格/平台。
- 不改 OpenCompare 仓任何文件（含 `docs/perf/**`、证据 JSON），不重跑 benchmark、不 push。
- 除第 28 行外，两版 README 与 HEAD 逐字节相同；不做排版重设计、不顺手优化其他句子。

## 实现约束

- 唯一允许改动的文件：`README.md`、`README.zh-CN.md`、`.munk/checks/readme-001-cell.test.mjs`、`.munk/baseline/domains/readme/product.md`；出现第五个内容文件即视为越界。
- 第 28 行用最小 `edit` 整行替换，禁止重排/换行/改标点风格；行数与前后空行保持（当前两版均 71 行）。
- 校验文件只允许动：新增 `ALLOWED_CHANGED_LINES` 常量（含注释）、`ac-single-changed-line-per-file` 的变化行断言、`ac-other-content-untouched` 的跳过条件；不得改常量 `ALLOWLIST` / `IGNORED_PREFIXES` / 区间解析代码；不得新增 `test(...)` 块。
- 行距口径：0-based 索引 27 = 第 28 行（巡检 3 步流程段），索引 35 = 第 36 行（001 表格行），索引 33/34 = 表头与分隔行；三个数字须与现文件一致，交付前用 `sed -n '28p;36p'` 复核。
- 门禁原文（`git diff --check`、`node --test .munk/checks/readme-001-cell.test.mjs`）不改；交付说明必须写明：被测 commit（`git rev-parse HEAD` 与交付 commit）、两版 README 仅第 28 行不同且其余行逐字节不变、`code_gates` 两条命令的退出码与用例统计（13 tests / 0 fail）、以及 `.github/workflows/**` 不存在的核对命令输出。
- 口径依据（仅复核用，不写进 README）：Host 任务 `task_4e683c60a04d4fba` 的 `scheduleCron=*/15 * * * *`、`scheduleEnabled=true` 只支撑「已配置每 15 分钟巡检」，不支撑任何发版节奏或「打包发版」承诺。
