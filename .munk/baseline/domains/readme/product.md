# Domain: readme

双语 README 内容域（SSOT）。承载 `README.md` / `README.zh-CN.md` 的内容契约：Shipped Replacements / 已完成平替表、OpenCompare 001 行的状态与实测单元格、榜单与其余段落。

## 验收

域级 AC 定义（由 Delivery 从 WI `prd.md` fold；具体数值与目标文案见各 WI）。

### 表格结构与变更范围

- **ac-diff-only-two-readmes**: `git diff --name-only` 恰好是 `README.md` 与 `README.zh-CN.md`，无构建产物或其他文件改动（`.munk/baseline/**` fold 产物除外）。
- **ac-single-changed-line-per-file**: 每个 README 的 `git diff -U0` 只有一处 hunk，且仅一条旧行被替换为一条新行；文件总行数不变。
- **ac-other-content-untouched**: Target Leaderboard / 开源平替投票榜的全部行、Why / 为什么、Watch Live / 直播间、License / 协议等段落逐字未变；除 001 行最后一列外无任何字符变化。

### 001 行单元格内容

- **ac-en-001-cell-exact**: `README.md` 的 001 行单元格同时包含精确规模、冷跑/热跑/三轮合计毫秒值、体量说明、巡检失败口径等 WI 中列明的全部片段。
- **ac-zh-001-cell-exact**: `README.zh-CN.md` 的 001 行单元格同时包含与英文版同义的中文片段（精确规模、冷跑/热跑/合计、体量、巡检失败口径）。
- **ac-installer-version-untouched**: 两版仍分别包含 `v0.2.5 Shipped` / `v0.2.5 已发布` 与 `https://github.com/chaxiu/OpenCompare/releases`，文字与 URL 未改写。
- **ac-evidence-link**: 两个单元格都含指向 `https://github.com/chaxiu/OpenCompare/blob/main/docs/perf/large-directory-memory.md` 的 Markdown 链接，链接文字分别为 `Method & evidence` / `方法与证据`。
- **ac-volume-separate-from-timing**: `47 GB` 所在行与 `22,717 ms` 所在行之间至少隔一个 `<br>`；不得出现 `47 GB` 与 `9.3` / `9.3s` / `9.3 秒` 同处一行。体量只能写作「约 47 GB / ≈ 47 GB」，且注明为两份本地仓库 `du -sh` 合计、含未参与哈希的文件。
- **ac-old-claims-removed**: 两个 README 中均不再出现 `47 GB / 752k files compared in 9.3s` 与 `47 GB / 75.2 万文件大目录 9.3 秒比完`，也不出现 `752k` / `75.2 万文件` 作为规模口径。
- **ac-warm-label-required**: 若出现 `9.3 s` / `9.3s` / `9.3 秒`，同一行必须同时含 `warm` 或 `热跑`；目标文案采用精确毫秒值，不得单独出现 9.3 秒。
- **ac-cold-hot-values-sourced**: 冷跑只对应 `22,717 ms`（第 1 轮，实际哈希 `76,604` 文件 / `11,105,870,346` B）；热跑只对应 `9,361 / 9,547 ms`；合计只对应 `41,630 ms`。三者不得互换或合并为单值。
- **ac-numbers-evidence-only**: 单元格内数字只从归档证据复制，禁止发明、取整、求平均或反推（如由体量推吞吐、三轮求均值），也不得把体量解读为「全量读取」。

### 巡检状态口径

- **ac-patrol-copy-failed**: 两个 001 行单元格分别以 `15-min issue patrol configured · last run failed (2026-10-22)` 与 `已配置每 15 分钟巡检 · 最近一次运行失败（2026-10-22）` 结尾（其后仅表格分隔符）；该行不匹配 `Active`、`维护中`、`正常巡检`、`运行正常` 任一字样（大小写不敏感）。
- **ac-patrol-facts-consistent**: 巡检口径以 Host 真实任务/运行记录为准——`scheduleCron=*/15 * * * *` + `scheduleEnabled=true` 只支撑「已配置」；以 schedule 与 manual run 的连续失败、`digestPath=null`、其后仅 guard skip、最近带 digest 的成功 run 时间为运行事实；文案不得宣称巡检处于 Active / 正常状态，也不改 Host schedule 配置。

### 外部仓库与流程

- **ac-opencompare-repo-clean**: 交付前后 OpenCompare 仓库（`codebases/projects/open-compare`）`git status --porcelain` 均为空且 HEAD 未变，未修改该仓任何文件（含 `docs/perf/`、证据 JSON、`large-directory-memory.md`），不重跑 benchmark。
- **ac-no-extra-scaffolding**: 不引入构建、打包、发版、浏览器自测或 `code_gates` 以外的大面积测试；不新增替身目标、条目或排版重设计。

## 最近交付证明

- WI: `wi_intake_dd1842845349037c`（2026-10-23，Local merge）
- 结果: 001 行 OpenCompare 状态单元格由「47 GB / 752k files compared in 9.3s + 巡检 Active/维护中」改写为与证据一致的分行口径（体量独立成行 / 精确规模 / 冷跑与热跑分列毫秒 / 证据链接 / 巡检已配置但最近失败）；两版 README 同批，各 1 hunk、各替换 1 行，`git diff --name-only` 仅两个 README，总行数不变。
- 覆盖: ac-diff-only-two-readmes、ac-single-changed-line-per-file、ac-en-001-cell-exact、ac-zh-001-cell-exact、ac-old-claims-removed、ac-volume-separate-from-timing、ac-warm-label-required、ac-cold-hot-values-sourced、ac-evidence-link、ac-installer-version-untouched、ac-patrol-copy-failed、ac-patrol-facts-consistent、ac-other-content-untouched、ac-opencompare-repo-clean。
- 备注: 本轮 change pack 无 `tests/cases/**`（纯内容修正，无独立 case 文件），QA fold 仅落 AC 定义；验证由 `.munk/checks/readme-001-cell.test.mjs` 承担，`code_gates` 通过。
