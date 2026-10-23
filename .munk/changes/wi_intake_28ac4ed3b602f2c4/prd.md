# README 001 行巡检文案改为「只述配置」

## 范围

把两个 README 中 **001 行 OpenCompare 状态单元格末尾的 🤖 巡检一行**改为只陈述「已配置」，删除一切运行结果措辞；同批把随文案一起硬编码旧口径的两处校验/基线文档同步到新口径。**每个 README 只允许 1 行变化，且就是 001 行那一行。**

允许改动按负责人三组，实际共 **4 个文件**（第 1 组为两版 README）：

1. `README.md`、`README.zh-CN.md`

   仅替换 001 行（文件第 36 行）末尾的 🤖 段，前置内容一字不动：

   - 英文：`🤖 *15-min issue patrol configured · last run failed (2026-10-22)*` → `🤖 *15-min issue patrol configured*`
   - 中文：`🤖 *已配置每 15 分钟巡检 · 最近一次运行失败（2026-10-22）*` → `🤖 *已配置每 15 分钟巡检*`

   改完后两行分别以 `🤖 *15-min issue patrol configured* |` 与 `🤖 *已配置每 15 分钟巡检* |` 结尾。

2. `.munk/checks/readme-001-cell.test.mjs`

   只改硬编码旧文案的三处断言，全部换成新文案字面量（不得改成「读取 README 实际内容再与自己比较」的自我满足式断言）：

   - `ac-en-001-cell-exact` 的必含串：`15-min issue patrol configured · last run failed (2026-10-22)` → `15-min issue patrol configured`
   - `ac-zh-001-cell-exact` 的必含串：`已配置每 15 分钟巡检 · 最近一次运行失败（2026-10-22）` → `已配置每 15 分钟巡检`
   - `ac-patrol-copy-failed` 改名为 `ac-patrol-copy-configured`：正则改为要求单元格以 `*15-min issue patrol configured*` / `*已配置每 15 分钟巡检*` 结尾（其后仅表格分隔符），并**新增反向断言**：两个 001 行都不得出现 `last run failed`、`failed`、`运行失败`、`失败`、`Active`、`维护中`、`正常巡检`、`运行正常`、`running`（大小写不敏感）。
   - `ac-diff-only-two-readmes` 的期望改动集合扩为本次 4 个文件；先剔除 `.munk/changes/**` 与 `.munk/runs/**` 这两类 Host 过程产物，再对被跟踪的内容文件做集合相等断言。

   其余断言全部保留原样：每文件恰好 1 行变化（索引 35）、行数不变、7 pipes / 6 列、其余行逐字节不变、47 GB 单列、冷/热/合计分列、证据链接、安装包版本、其他条目、OpenCompare 仓 clean。

3. `.munk/baseline/domains/readme/product.md`

   - `ac-patrol-copy-failed` 改名 `ac-patrol-copy-configured`，改写为「两个 001 行单元格以新巡检文案结尾，且不含失败/健康措辞」。
   - `ac-patrol-facts-consistent`：「文案不得宣称 Active」保留；删掉「只能写最近一次运行失败」的推导，改为「`digest.md` 在盘，Host failed / `digestPath=null` 属终态记账假阴性，故运行结果不作为对外文案」。
   - 同文件内因本次口径变化而失真的两处引用一并去陈（不外扩）：`ac-en-001-cell-exact` / `ac-zh-001-cell-exact` 的「巡检失败口径」→「巡检配置口径」；`ac-diff-only-two-readmes` 的改动范围由「恰好两个 README」改为「内容文件恰好两个 README，同批允许 readme 域基线与 001 校验文件更新」。

## 验收

- ac-diff-four-files: 剔除 `.munk/changes/**`、`.munk/runs/**` 后，`git diff HEAD --name-only` 恰好是 `README.md`、`README.zh-CN.md`、`.munk/checks/readme-001-cell.test.mjs`、`.munk/baseline/domains/readme/product.md` 四项。
- ac-one-line-per-readme: 每个 README 与 HEAD 相比只有一处行替换且位于索引 35（第 36 行）；文件总行数不变，该行仍是 `|` 分隔的 6 列 / 7 个管道符。
- ac-en-patrol-configured: `README.md` 001 行单元格以 `🤖 *15-min issue patrol configured*` 结尾（其后仅 ` |`）。
- ac-zh-patrol-configured: `README.zh-CN.md` 001 行单元格以 `🤖 *已配置每 15 分钟巡检*` 结尾（其后仅 ` |`）。
- ac-no-run-result-wording: 两个 001 行都不含 `last run failed`、`failed`、`运行失败`、`失败`、`Active`、`维护中`、`正常巡检`、`运行正常`、`running`（大小写不敏感）。
- ac-metrics-untouched: 两个单元格仍含 `752,479 files / 97,565 dirs (symlinks not followed)` 与 `752,479 文件 / 97,565 目录（不跟随符号链接）`、`cold run 22,717 ms (round 1 actually hashed 76,604 files / 11,105,870,346 B)` 与 `冷跑 22,717 ms（第 1 轮实际哈希 76,604 文件 / 11,105,870,346 B）`、`warm runs 9,361 / 9,547 ms` 与 `热跑 9,361 / 9,547 ms`、`3-round total 41,630 ms` 与 `三轮合计 41,630 ms`；`47 GB` 仍单独成行并保留 `combined du -sh of both local repos` / `两份本地仓库 du -sh 合计` 与 `includes files not hashed` / `含未参与哈希的文件` 限定词。
- ac-evidence-and-installer-untouched: 两版仍分别含 `*[Method & evidence](https://github.com/chaxiu/OpenCompare/blob/main/docs/perf/large-directory-memory.md)*` 与 `*[方法与证据](https://github.com/chaxiu/OpenCompare/blob/main/docs/perf/large-directory-memory.md)*`，以及 `v0.2.5 Shipped` / `v0.2.5 已发布` 与 `https://github.com/chaxiu/OpenCompare/releases`。
- ac-other-rows-byte-identical: 两个 README 中除索引 35 外的每一行都与 `git show HEAD:<file>` 逐字节相同（含表头、分隔行、其他条目、榜单与其他段落）。
- ac-gate-no-self-comparison: 校验文件中三处旧文案字面量已替换为新文案字面量，且新断言不通过「读取 README 实际内容再与自身比较」取真；`ac-patrol-copy-configured` 同时含「以新文案结尾」的正向断言与上述反向禁用词断言。
- ac-gate-diff-allowlist: 校验文件的差异断言剔除 `.munk/changes/**`、`.munk/runs/**` 后，断言集合恰好是 `README.md`、`README.zh-CN.md`、`.munk/checks/readme-001-cell.test.mjs`、`.munk/baseline/domains/readme/product.md`。
- ac-baseline-patrol-acs: readme 域基线中存在 `ac-patrol-copy-configured` 且不再存在 `ac-patrol-copy-failed`；`ac-patrol-facts-consistent` 保留「不得宣称 Active / 正常，也不改 Host schedule」，删去「只能写最近一次运行失败」的推导，并写明 `digest.md` 在盘、Host failed / `digestPath=null` 为终态记账假阴性、运行结果不作为对外文案。
- ac-no-other-baseline-domain: `.munk/baseline/` 下除 `domains/readme/product.md` 外无任何文件改动；`AGENTS.md`、`.agents/skills/markdown-docs/SKILL.md`、`.munk/code-gates.json` 均未改动。
- ac-opencompare-repo-clean: 交付前后 OpenCompare 仓库 `git status --porcelain` 为空且 HEAD 未变，未改其任何文件，未重跑 benchmark。
- ac-code-gates-pass: `git diff --check` 与 `node --test .munk/checks/readme-001-cell.test.mjs` 均返回 0，且测试用例全绿。

## 非目标

- 不改 `AGENTS.md`、`.agents/skills/markdown-docs/SKILL.md`、`.munk/code-gates.json`、其他 `.munk/baseline/**` 域文件。
- 不改 OpenCompare 仓库任何文件（含 `docs/perf/**`、证据 JSON、`large-directory-memory.md`），不重跑 benchmark、不改 `perf/profiles.json`。
- 不改任何数字：`47 GB` 及其限定词、`752,479` 文件 / `97,565` 目录、冷跑 `22,717 ms`、热跑 `9,361 / 9,547 ms`、三轮合计 `41,630 ms`、第 1 轮 `76,604` 文件 / `11,105,870,346` B 一律原样保留。
- 不写 `Active` / `维护中` / `正常巡检` / `运行正常` / `running`，也不写 `failed` / `失败` / `运行失败` / 任何日期化的运行结果。
- 不改 Host schedule 配置（`task_4e683c60a04d4fba`：`scheduleCron=*/15 * * * *`、`scheduleEnabled=true` 保持不变），不动 `task_*` / `trun_*` 记录。
- 不改表格列数、表头、分隔行、编号、价格、平台、版本号、安装包链接、其他条目或其他段落；不重写整份 README。
- 不新增条目、替身目标、排版重设计、构建/打包/发版/浏览器自测或 `code_gates` 以外的大面积测试。

## 实现约束

- 改动方式：对两个 README 使用最小 `edit`（只替换 `🤖 *...*` 片段），禁止整行重写或格式化。
- 口径依据（只作为复核材料，不写进 README）：`task_4e683c60a04d4fba` 的 `scheduleCron=*/15 * * * *` + `scheduleEnabled=true` 只支撑「已配置」；`task_4e683c60a04d4fba` 三场 failed（`trun_22e13c5821aa5329` / `trun_bc2cb0d829e0c8c6` / `trun_ec8c911c638e3693`）的 `digest.md` 均在盘（`ec8c911` 还抓到真实外部 Bug I#3），故 Host 的 `failed` + `digestPath=null` 判为终态记账假阴性；升级为 Active 需等 Host 记账修复并出现 succeeded 记录。
- 校验文件里剔除 `.munk/changes/**` 与 `.munk/runs/**` 是过程产物豁免，不是放宽内容范围：内容文件仍做集合相等断言。
- `ac-diff-only-two-readmes` 保留原名，但期望集合更新为本次 4 个文件（readme 域基线与 001 校验文件属同批契约更新）。若认为应改名，交由负责人在 Delivery 前决定，不在 Coding 阶段自创。
- `local_merge` 若再报 `remote-https is not a git command`，按上一轮记录属 Host 内置 git exec-path 缺陷：不排查远端、不改 git 配置，直接按既有处置上报。
