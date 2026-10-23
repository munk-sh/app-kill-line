# 修正 README 001 行 OpenCompare 状态与实测数据口径

## 范围

只改 `README.md` 与 `README.zh-CN.md` 中 **001 号 OpenCompare** 那一行的「Status & Benchmark / 当前状态与实测表现」单元格，两版同批提交。单元格外的表格列、表头、版本号、安装包链接、其他条目、榜单与其他段落一律不动。

目标单元格内容（两版同义、同批）：

**README.md（001 行最后一列）**

```markdown
✅ **v0.2.5 Shipped** · [Get Installer](https://github.com/chaxiu/OpenCompare/releases)<br>📦 *Source tree ≈ 47 GB (combined du -sh of both local repos; includes files not hashed)*<br>🚀 *752,479 files / 97,565 dirs (symlinks not followed) · cold run 22,717 ms (round 1 actually hashed 76,604 files / 11,105,870,346 B) · warm runs 9,361 / 9,547 ms · 3-round total 41,630 ms*<br>📄 *[Method & evidence](https://github.com/chaxiu/OpenCompare/blob/main/docs/perf/large-directory-memory.md)*<br>🤖 *15-min issue patrol configured · last run failed (2026-10-22)*
```

**README.zh-CN.md（001 行最后一列）**

```markdown
✅ **v0.2.5 已发布** · [下载安装包](https://github.com/chaxiu/OpenCompare/releases)<br>📦 *源目录体积约 47 GB（两份本地仓库 du -sh 合计，含未参与哈希的文件）*<br>🚀 *752,479 文件 / 97,565 目录（不跟随符号链接）· 冷跑 22,717 ms（第 1 轮实际哈希 76,604 文件 / 11,105,870,346 B）· 热跑 9,361 / 9,547 ms · 三轮合计 41,630 ms*<br>📄 *[方法与证据](https://github.com/chaxiu/OpenCompare/blob/main/docs/perf/large-directory-memory.md)*<br>🤖 *已配置每 15 分钟巡检 · 最近一次运行失败（2026-10-22）*
```

删除旧的误导性表述：英文 `47 GB / 752k files compared in 9.3s`、中文 `47 GB / 75.2 万文件大目录 9.3 秒比完`。

## 验收

- ac-diff-only-two-readmes: `git diff --name-only` 结果恰好是 `README.md` 与 `README.zh-CN.md` 两项，无构建产物或其他文件改动。
- ac-single-changed-line-per-file: 每个文件的 `git diff -U0` 只有一处 hunk，且仅一条旧行被替换为一条新行；文件总行数保持不变，001 行仍为 7 个 `|` 分隔的 6 列结构，表头与分隔行逐字不变。
- ac-en-001-cell-exact: `README.md` 的 001 行单元格同时包含 `752,479 files / 97,565 dirs (symlinks not followed)`、`cold run 22,717 ms (round 1 actually hashed 76,604 files / 11,105,870,346 B)`、`warm runs 9,361 / 9,547 ms`、`3-round total 41,630 ms`、`Source tree ≈ 47 GB`、`combined du -sh of both local repos`、`includes files not hashed`、`15-min issue patrol configured · last run failed (2026-10-22)`。
- ac-zh-001-cell-exact: `README.zh-CN.md` 的 001 行单元格同时包含 `752,479 文件 / 97,565 目录（不跟随符号链接）`、`冷跑 22,717 ms（第 1 轮实际哈希 76,604 文件 / 11,105,870,346 B）`、`热跑 9,361 / 9,547 ms`、`三轮合计 41,630 ms`、`源目录体积约 47 GB`、`两份本地仓库 du -sh 合计`、`含未参与哈希的文件`、`已配置每 15 分钟巡检 · 最近一次运行失败（2026-10-22）`。
- ac-old-claims-removed: 两个 README 中均不再出现 `47 GB / 752k files compared in 9.3s` 与 `47 GB / 75.2 万文件大目录 9.3 秒比完`，也不出现 `752k`/`75.2 万文件` 作为规模口径。
- ac-volume-separate-from-timing: 每个单元格中 `47 GB` 所在行与 `22,717 ms` 所在行之间至少隔一个 `<br>`；任何单行都不匹配「47 GB 同一行紧邻 9.3 / 22.7 / 41.6 秒级耗时」的并排句式（即不得出现 `47 GB` 与 `9.3`、`9.3s`、`9.3 秒` 同处一行）。
- ac-warm-label-required: 若出现 `9.3 s`、`9.3s` 或 `9.3 秒`，同一行必须同时含 `warm` 或 `热跑`；目标文案采用精确毫秒值，不得单独出现 9.3 秒。
- ac-cold-hot-values-sourced: 冷跑只对应 `22,717 ms`（第 1 轮，实际哈希 `76,604` 文件 / `11,105,870,346` B），热跑只对应 `9,361 / 9,547 ms`，合计只对应 `41,630 ms`；三者不得互换或合并为单值。
- ac-evidence-link: 两个单元格都含指向 `https://github.com/chaxiu/OpenCompare/blob/main/docs/perf/large-directory-memory.md` 的 Markdown 链接，且链接文字分别为 `Method & evidence` / `方法与证据`。
- ac-installer-version-untouched: 两版仍分别包含 `v0.2.5 Shipped` / `v0.2.5 已发布` 与 `https://github.com/chaxiu/OpenCompare/releases`，文字与 URL 未改写。
- ac-patrol-copy-failed: 两个 001 行单元格分别以 `15-min issue patrol configured · last run failed (2026-10-22)` 与 `已配置每 15 分钟巡检 · 最近一次运行失败（2026-10-22）` 结尾（其后仅表格分隔符 ` |`）；该行不匹配 `Active`、`维护中`、`正常巡检`、`运行正常` 任一字样（大小写不敏感）。
- ac-patrol-facts-consistent: 巡检口径以 `task_4e683c60a04d4fba`（`scheduleCron=*/15 * * * *`、`scheduleEnabled=true`）为配置事实，以 `trun_22e13c5821aa5329`（2026-10-22 02:30 schedule）、`trun_bc2cb0d829e0c8c6`（02:40 manual）连续失败且 `digestPath=null`、其后仅 guard skip、最近成功带 digest run 为 `trun_7cf071d44762cd29`（2026-10-21 13:09）为运行事实；文案不得宣称巡检处于 Active / 正常状态。
- ac-other-content-untouched: Target Leaderboard / 开源平替投票榜的全部行、Why / 为什么、Watch Live / 直播间、License / 协议等段落逐字未变；除 001 行最后一列外无任何字符变化。
- ac-opencompare-repo-clean: 交付前后 `git -C /Users/zhutao/Library/Application Support/Munk AI/munk-auto/codebases/projects/open-compare status --porcelain` 均为空且 HEAD 未变，未修改该仓任何文件。

## 非目标

- 不改 OpenCompare 仓库任何文件（含 `docs/perf/`、证据 JSON、`large-directory-memory.md`），不重跑 benchmark、不改 `perf/profiles.json`。
- 不改工具链、构建、发布流程，不跑无关构建、打包、发版、浏览器自测、`code_gates` 以外的大面积测试。
- 不改表格列数、表头、分隔行、编号、价格、平台、版本号、安装包链接、其他 001 行外的字段。
- 不改 Host schedule 配置（`task_4e683c60a04d4fba` 的 `scheduleCron=*/15 * * * *`、`scheduleEnabled=true` 保持不变）；001 行巡检文案仅按本文改为失败口径，不写 Active / 维护中 / 正常巡检。
- 不新增替身目标、不新增条目、不调整中英文结构或其他段落。
- 不新增未归档数字或推算值（如由 47 GB 推算吞吐、由三轮求平均）；不把 47 GB 解读为「全量读取」。
- 不做视觉/排版重设计，仅保持既有 `<br>` 与斜体单元格样式。

## 实现约束

- 数字唯一来源（只读）：
  - `/Users/zhutao/Library/Application Support/Munk AI/munk-auto/codebases/projects/open-compare/docs/perf/large-directory-memory.md` 第 6.2 节
  - `/Users/zhutao/Library/Application Support/Munk AI/munk-auto/codebases/projects/open-compare/docs/perf/evidence/dawnchat-zenmind-20261022-post-fix-3rounds.json`
- 已核对证据值：`counts.files=752479`、`counts.dirs=97565`、`rounds[0].wallMs=22717`、`rounds[0].counts.hashedFiles=76604`、`rounds[0].counts.bytesToHash=11105870346`、`rounds[1].wallMs=9361`、`rounds[2].wallMs=9547`、第 2/3 轮 `hashedFiles=0`、`totalWallMs=41630`。
- 47 GB 为两份本地仓库 `du -sh` 合计（实测 `6.0G` + `41G`），含未参与哈希的文件；必须保留，但只能写成「约 47 GB / ≈ 47 GB」的体量说明，并与耗时分行，禁止与 9.3 s 并排暗示全量读取。
- 目标文案见「范围」，按原文落盘；中英文同义同批，保持行内 `<br>` 与 `*...*` 斜体。
- 巡检口径依据：task_4e683c60a04d4fba 的 `scheduleCron=*/15 * * * *`、`scheduleEnabled=true` 仅为「已配置」；2026-10-22 02:30 schedule（`trun_22e13c5821aa5329`）与 02:40 manual（`trun_bc2cb0d829e0c8c6`）连续失败、`digestPath=null`，此后只有 guard skip；最近一次带 digest 的成功 run 为 2026-10-21 13:09（`trun_7cf071d44762cd29`）。因此巡检行只能写「已配置…最近一次运行失败」，不得写 Active。
- 交付前自查：`git status --short` 只有两个 README 被修改，`git diff` 只含 001 行状态单元格；不执行无关构建。
