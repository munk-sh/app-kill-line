# Domain: readme

双语 README 内容域（SSOT）。承载 `README.md` / `README.zh-CN.md` 的内容契约：Shipped Replacements / 已完成平替表、OpenCompare 001 行的状态与实测单元格、榜单与其余段落。

## 验收

域级 AC 定义（由 Delivery 从 WI `prd.md` fold；具体数值与目标文案见各 WI）。

### 表格结构与变更范围

- **ac-diff-only-two-readmes**: README 内容批次的改动集合中内容文件恰好是 `README.md` 与 `README.zh-CN.md`，无构建产物或其他内容文件改动；同批允许 readme 域基线（`.munk/baseline/domains/readme/product.md`）与 001 校验文件（`.munk/checks/readme-001-cell.test.mjs`）更新，`.munk/changes/**`、`.munk/runs/**` 过程产物豁免。纯门禁改动、纯基线改动、合并结果与空区间不要求两版 README 出现，按 `ac-gate-diff-allowlist` 的子集语义放行。
- **ac-single-changed-line-per-file**: 每个 README 只允许 001 行（索引 35）与巡检流程段（索引 27）两行改写，其余行逐字节锁定；变化的行索引非空、无重复、全部落在 `ALLOWED_CHANGED_LINES = [27, 35]` 内且不超过两项；文件总行数不变，表头（索引 33）与分隔行（索引 34）逐字节不变，001 行仍是 6 列 / 7 个管道符。
- **ac-other-content-untouched**: 除 001 行（索引 35）与巡检流程段（索引 27）外，Target Leaderboard / 开源平替投票榜、Why / 为什么、Watch Live / 直播间、License / 协议等 68 行逐字节未变。索引 27 的改写理由是：`scheduleCron=*/15 * * * *` + `scheduleEnabled=true` 只支撑「已配置每 15 分钟巡检」这一配置事实，不支撑任何发版节奏，故删除 `cut signed releases around the clock` / `打包发版` 一类发版承诺。

- **ac-line28-no-release-promise**: 巡检流程段（索引 27）只述「已配置每 15 分钟巡检、复现 Bug、评估/分诊需求」，不得含 `cut signed releases`、`around the clock`、`打包发版`、`绝不烂尾`、`自动化发版`、`性能门禁` 一类发版或门禁承诺；判定按该行（巡检段）进行，其他段落的既有措辞不因此改写。
- **ac-no-ci**: 本轮不新增 CI 或工作流：`.github/` 下仍只有 `ISSUE_TEMPLATE/`（`nominate-paid-app.yml`、`config.yml`），`.github/workflows/**` 不存在，不引入 `readme-001-contract.yml`，不接远端 CI、不做合并后 push 验证。

### 001 行单元格内容

- **ac-en-001-cell-exact**: `README.md` 的 001 行单元格同时包含精确规模、冷跑/热跑/三轮合计毫秒值、体量说明、巡检配置口径等 WI 中列明的全部片段。
- **ac-zh-001-cell-exact**: `README.zh-CN.md` 的 001 行单元格同时包含与英文版同义的中文片段（精确规模、冷跑/热跑/合计、体量、巡检配置口径）。
- **ac-installer-version-untouched**: 两版仍分别包含 `v0.2.5 Shipped` / `v0.2.5 已发布` 与 `https://github.com/chaxiu/OpenCompare/releases`，文字与 URL 未改写。
- **ac-evidence-link**: 两个单元格都含指向 `https://github.com/chaxiu/OpenCompare/blob/main/docs/perf/large-directory-memory.md` 的 Markdown 链接，链接文字分别为 `Method & evidence` / `方法与证据`。
- **ac-volume-separate-from-timing**: `47 GB` 所在行与 `22,717 ms` 所在行之间至少隔一个 `<br>`；不得出现 `47 GB` 与 `9.3` / `9.3s` / `9.3 秒` 同处一行。体量只能写作「约 47 GB / ≈ 47 GB」，且注明为两份本地仓库 `du -sh` 合计、含未参与哈希的文件。
- **ac-old-claims-removed**: 两个 README 中均不再出现 `47 GB / 752k files compared in 9.3s` 与 `47 GB / 75.2 万文件大目录 9.3 秒比完`，也不出现 `752k` / `75.2 万文件` 作为规模口径。
- **ac-warm-label-required**: 若出现 `9.3 s` / `9.3s` / `9.3 秒`，同一行必须同时含 `warm` 或 `热跑`；目标文案采用精确毫秒值，不得单独出现 9.3 秒。
- **ac-cold-hot-values-sourced**: 冷跑只对应 `22,717 ms`（第 1 轮，实际哈希 `76,604` 文件 / `11,105,870,346` B）；热跑只对应 `9,361 / 9,547 ms`；合计只对应 `41,630 ms`。三者不得互换或合并为单值。
- **ac-numbers-evidence-only**: 单元格内数字只从归档证据复制，禁止发明、取整、求平均或反推（如由体量推吞吐、三轮求均值），也不得把体量解读为「全量读取」。
- **ac-metrics-untouched**: 两版单元格仍含 `752,479 files / 97,565 dirs (symlinks not followed)` / `752,479 文件 / 97,565 目录（不跟随符号链接）`、`cold run 22,717 ms (round 1 actually hashed 76,604 files / 11,105,870,346 B)` / `冷跑 22,717 ms（第 1 轮实际哈希 76,604 文件 / 11,105,870,346 B）`、`warm runs 9,361 / 9,547 ms` / `热跑 9,361 / 9,547 ms`、`3-round total 41,630 ms` / `三轮合计 41,630 ms`；`47 GB` 仍单独成行并保留 `combined du -sh of both local repos` / `两份本地仓库 du -sh 合计` 与 `includes files not hashed` / `含未参与哈希的文件` 限定词。
- **ac-evidence-and-installer-untouched**: 两版仍分别含 `*[Method & evidence](https://github.com/chaxiu/OpenCompare/blob/main/docs/perf/large-directory-memory.md)*` / `*[方法与证据](https://github.com/chaxiu/OpenCompare/blob/main/docs/perf/large-directory-memory.md)*`，以及 `v0.2.5 Shipped` / `v0.2.5 已发布` 与 `https://github.com/chaxiu/OpenCompare/releases`。
- **ac-other-rows-byte-identical**: 两个 README 中除 001 行（索引 35）外的每一行都与 `git show HEAD:<file>` 逐字节相同（含表头、分隔行、其他条目、榜单与其他段落）。
- **ac-one-line-per-readme**: 每个 README 与 HEAD 相比只有一处行替换且位于索引 35（第 36 行），文件总行数不变，该行仍是 `|` 分隔的 6 列 / 7 个管道符。
- **ac-en-patrol-configured** / **ac-zh-patrol-configured**: 两版 001 行单元格分别以 `🤖 *15-min issue patrol configured*` 与 `🤖 *已配置每 15 分钟巡检*` 结尾（其后仅 ` |`）；与 `ac-patrol-copy-configured` 等价，按语言拆分的检查项。
- **ac-no-run-result-wording**: 两个 001 行都不含 `last run failed`、`failed`、`运行失败`、`失败`、`Active`、`维护中`、`正常巡检`、`运行正常`、`running`（大小写不敏感）；与 `ac-patrol-copy-configured` 的反向断言同义。

### 巡检状态口径

- **ac-patrol-copy-configured**: 两个 001 行单元格分别以 `15-min issue patrol configured` 与 `已配置每 15 分钟巡检` 结尾（其后仅表格分隔符）；该行不含 `last run failed`、`failed`、`运行失败`、`失败`、`Active`、`维护中`、`正常巡检`、`运行正常`、`running` 任一字样（大小写不敏感）。
- **ac-patrol-facts-consistent**: 巡检口径以 Host 真实任务/运行记录为准——`scheduleCron=*/15 * * * *` + `scheduleEnabled=true` 只支撑「已配置」；文案不得宣称巡检处于 Active / 正常状态，也不改 Host schedule 配置。运行结果不作为对外文案：`digest.md` 在盘，Host 记录的 failed / `digestPath=null` 属终态记账假阴性。

### 校验文件与门禁

- **ac-gate-no-self-comparison**: 校验文件（`.munk/checks/readme-001-cell.test.mjs`）中硬编码的目标文案字面量必须替换为新文案字面量，断言不得退化为「读取 README 实际内容再与自身比较」；`ac-patrol-copy-configured` 同时保留正向结尾断言与反向禁用词断言。
- **ac-gate-diff-allowlist**: 校验文件的差异断言按显式区间比较（`MUNK_DIFF_BASE` / `MUNK_DIFF_HEAD` 优先；head 默认 `HEAD`，base 未显式指定时脏树取 `HEAD`、干净树取 `HEAD^`，base 无父提交时回退空树 `4b825dc642cb6eb9a060e54bf8d69288fbee4904`）；先剔除 `.munk/changes/**` 与 `.munk/runs/**` 过程产物，再断言改动集合是 `README.md`、`README.zh-CN.md`、`.munk/checks/readme-001-cell.test.mjs`、`.munk/baseline/domains/readme/product.md` 的**子集**——不要求四者同时出现，纯门禁改动、纯基线改动、合并结果与空区间都必须通过；出现集合外文件时失败，并打印 base SHA、head SHA 与每个越界文件名。行级断言以 `git show <base>:<file>` 为对照快照，某 README 在区间内无差异即跳过该文件的行级用例。
- **ac-gate-whitelist-constant**: 校验文件存在显式白名单常量 `const ALLOWED_CHANGED_LINES = [27, 35];`，并在常量或断言处以注释说明 27（巡检流程段，按「只述配置」改写）与 35（001 状态行）的含义；行索引语义仍是 0-based，索引 27 = 第 28 行、索引 35 = 第 36 行。
- **ac-gate-line-guard**: `ac-single-changed-line-per-file` 的变化行断言要求「非空 + 无重复 + 全部落在 `ALLOWED_CHANGED_LINES` 内 + 长度 ≤ 白名单长度」，越界时失败信息点名文件与具体行号；行数不变、表头索引 33、分隔行索引 34、001 行 7 个管道符 / 6 列的原断言逐条保留。
- **ac-gate-other-lines-locked**: `ac-other-content-untouched` 的跳过集合取自 `ALLOWED_CHANGED_LINES`（不再是硬编码单行），其余行仍逐字节与对照快照比较；仅改第 28 行时该用例通过，并对剩余 68 行（71 行减去索引 27、35）实际比较。
- **ac-gate-semantics-unchanged**: 校验文件的 `ALLOWLIST` 仍恰好是 `README.md`、`README.zh-CN.md`、`.munk/checks/readme-001-cell.test.mjs`、`.munk/baseline/domains/readme/product.md` 四项；`IGNORED_PREFIXES` 仍只有 `.munk/changes/`、`.munk/runs/`；区间解析（`MUNK_DIFF_BASE` / `MUNK_DIFF_HEAD` 优先、head 默认 `HEAD`、脏树 base=`HEAD`、干净树 base=`HEAD^`、无父回退空树）不变；用例数与文件集合不变（13 个用例、1 个测试文件），不新增断言用例。
- **ac-baseline-patrol-acs**: readme 域基线存在 `ac-patrol-copy-configured` 且不再存在 `ac-patrol-copy-failed`；`ac-patrol-facts-consistent` 保留「不得宣称 Active / 正常，也不改 Host schedule」，删去「只能写最近一次运行失败」的推导，并写明 `digest.md` 在盘、Host failed / `digestPath=null` 为终态记账假阴性、运行结果不作为对外文案。
- **ac-no-other-baseline-domain**: `.munk/baseline/` 下除 `domains/readme/product.md` 外无任何文件改动；`AGENTS.md`、`.agents/skills/markdown-docs/SKILL.md`、`.munk/code-gates.json` 均未改动。
- **ac-code-gates-pass**: `git diff --check` 与 `node --test .munk/checks/readme-001-cell.test.mjs` 均返回 0，测试用例全绿。三种复跑方式：默认（head=`HEAD`；脏树 base=`HEAD`、干净树 base=`HEAD^`）、空区间 `MUNK_DIFF_BASE=$(git rev-parse HEAD) MUNK_DIFF_HEAD=$(git rev-parse HEAD)`、历史区间 `MUNK_DIFF_BASE=<sha> MUNK_DIFF_HEAD=<sha>`（如 `1b397be..0b99e07`，行级断言实际执行）；反向越界区间（如 `28e3bca..HEAD`）必须失败并点名越界文件。

### 外部仓库与流程

- **ac-opencompare-repo-clean**: 交付前后 OpenCompare 仓库（`codebases/projects/open-compare`）`git status --porcelain` 均为空且 HEAD 未变，未修改该仓任何文件（含 `docs/perf/`、证据 JSON、`large-directory-memory.md`），不重跑 benchmark。
- **ac-no-extra-scaffolding**: 不引入构建、打包、发版、浏览器自测或 `code_gates` 以外的大面积测试；不新增替身目标、条目或排版重设计。

## 最近交付证明

- WI: `wi_intake_28ac4ed3b602f2c4`（2026-10-23，Local merge）
- 结果: 两版 README 001 行巡检文案收敛为「只述配置」——`🤖 *15-min issue patrol configured*` / `🤖 *已配置每 15 分钟巡检*`，删除 `last run failed (2026-10-22)` / `最近一次运行失败（2026-10-22）`；同批把 `.munk/checks/readme-001-cell.test.mjs` 的三处旧文案断言改为新字面量（`ac-patrol-copy-failed` → `ac-patrol-copy-configured`，新增 `failed` / `失败` / `running` 等反向禁用词），并把差异断言从「仅两个 README」放宽为「两个 README + 001 校验文件 + readme 域基线」，剔除 `.munk/changes/**`、`.munk/runs/**` 过程产物。每个 README 仍各 1 hunk / 1 行替换（索引 35），6 列 7 管道符、行数不变。
- 覆盖: ac-diff-four-files、ac-one-line-per-readme、ac-en-patrol-configured、ac-zh-patrol-configured、ac-no-run-result-wording、ac-metrics-untouched、ac-evidence-and-installer-untouched、ac-other-rows-byte-identical、ac-gate-no-self-comparison、ac-gate-diff-allowlist、ac-baseline-patrol-acs、ac-no-other-baseline-domain、ac-opencompare-repo-clean、ac-code-gates-pass。
- 备注: 本轮 change pack 无 `tests/cases/**`（纯文案 + 校验口径同步，无独立 case 文件），QA fold 仅落 AC 定义；验证由 `.munk/checks/readme-001-cell.test.mjs` 承担，`code_gates` 通过。口径依据：`task_4e683c60a04d4fba` 的 `scheduleCron=*/15 * * * *` + `scheduleEnabled=true` 只支撑「已配置」；三场 failed 的 `digest.md` 均在盘（`ec8c911` 还抓到外部 Bug I#3），Host 的 failed + `digestPath=null` 判为终态记账假阴性，故运行结果不入对外文案，升级 Active / 正常需等 Host 记账修复并出现 succeeded 记录。

- WI: `wi_intake_a439b038ead1dae0`（2026-10-23，001 门禁改为显式区间可复跑）
- 结果: `.munk/checks/readme-001-cell.test.mjs` 的差异断言从 `git diff HEAD` 改为显式区间——head 默认 `HEAD`；base 未显式指定时脏树取 `HEAD`、干净树取 `HEAD^`、base 无父提交回退空树 `4b825dc642cb6eb9a060e54bf8d69288fbee4904`；先剔除 `.munk/changes/**`、`.munk/runs/**` 再对 4 个内容文件做子集断言，越界即失败并打印 base SHA、head SHA 与越界文件；行级断言改以 `git show <base>:<file>` 为基线，区间内无差异则跳过该文件的行级用例。其余内容断言全部保留并作用于所选 head 快照（head=`HEAD` 读工作树，其它提交读 `git show <head>:<file>`）。两版 README、`AGENTS.md`、`.munk/code-gates.json` 与 OpenCompare 仓未动。
- 覆盖: ac-gate-diff-allowlist、ac-code-gates-pass、ac-readmes-bytes-untouched、ac-gates-config-untouched、ac-baseline-acs-updated、ac-no-new-deps、ac-opencompare-repo-clean。
- 实测（被测 commit `12eaf31d7c8845ce2d20073f656244c95b464715`）: 脏树默认 base=head=`12eaf31` 退出 0；空区间 `12eaf31..12eaf31` 退出 0；历史区间 `1b397be..0b99e07` 退出 0 且两版 README 行级断言实际执行（非跳过）；反向越界 `28e3bca..HEAD` 退出 1 并点名 `AGENTS.md`、`.agents/skills/markdown-docs/SKILL.md`、`.munk/code-gates.json` 等越界文件；干净树默认在临时克隆（临时提交 `af6becb`，base=`HEAD^`=`12eaf31`，`git status --porcelain` 为空）退出 0；根提交场景 base 回退空树 `4b825dc6`、退出 0 且不抛错。
- 备注: 本轮 change pack 无 `tests/cases/**`，QA fold 仅落 AC 定义。由 Delivery 顺手修掉与新区间语义冲突的旧定义：`ac-diff-only-two-readmes` 原写「改动集合中内容文件恰好是两版 README」，会让纯门禁/纯基线批次（如本轮本身）看起来违规；现改为只约束 README 内容批次的恰好两项，并显式写明纯门禁、纯基线、合并结果与空区间按 `ac-gate-diff-allowlist` 的子集语义放行。

- WI: `wi_intake_7c82dce436e60da9`（2026-10-23，Local merge）
- 结果: 两版 README 第 28 行（索引 27）按裁决收窄为只述配置——英文 `... write regression gates, and triage feature requests.`，中文 `... 均已配置每 15 分钟自动巡检 GitHub Issues，自动复现 Bug、评估需求。`，删除 `cut signed releases around the clock` / `跑性能门禁并打包发版，绝不烂尾` 一类发版承诺；001 行（索引 35）零字节改动，`v0.2.5` 徽标与全部数字保持原样。同批把校验文件的行索引白名单放开为 `ALLOWED_CHANGED_LINES = [27, 35]`（含注释），`ac-single-changed-line-per-file` 改为「非空 + 无重复 + 全部落在白名单内 + 长度 ≤ 白名单长度」并点名越界文件与行号，`ac-other-content-untouched` 的跳过集合改取该常量；`ALLOWLIST`、`IGNORED_PREFIXES`、区间解析与内容断言一字未改，仍 13 个用例 / 1 个测试文件。
- 覆盖: ac-en-line28-exact、ac-zh-line28-exact、ac-line28-no-release-promise、ac-readmes-only-line28、ac-001-cell-untouched、ac-gate-whitelist-constant、ac-gate-line-guard、ac-gate-other-lines-locked、ac-gate-semantics-unchanged、ac-no-ci、ac-gates-config-unchanged、ac-baseline-whitelist、ac-code-gates-pass、ac-opencompare-untouched。
- 实测（被测 commit `18166f185cccacd342cb368e2651749364280049`）: `git diff --check` 退出 0；`node --test .munk/checks/readme-001-cell.test.mjs` 在脏树默认区间（base=head=`18166f1`）13 tests / 0 fail、退出 0；空区间 `18166f1..18166f1` 13 tests / 0 fail、退出 0；两版 README 各 1 hunk / 1 行替换（索引 27），文件仍各 71 行，`sed -n '28p;36p'` 复核行号一致。反向验证：临时改动索引 20 时 `ac-single-changed-line-per-file` 失败并输出 `README.md changed lines outside [27,35]: 20`，随后已还原。`.github/` 下仍只有 `ISSUE_TEMPLATE/`，`git diff --name-only` 仅 4 个允许文件；`.munk/code-gates.json` 仍是 `static`（`git diff --check`）+ `test`（`node --test .munk/checks/readme-001-cell.test.mjs`）两条；OpenCompare 仓 `git status --porcelain` 为空、HEAD 仍为 `f6a2beb0cdf01f4a122ef248189fc19cad92cb65`。
- 备注: `ac-line28-no-release-promise` 的禁用词按巡检段（第 28 行）判定——中文第 60 行「直播间」段落仍含「打包发版」，但该段属非目标明确冻结的 Watch Live 段落，本轮不动；保持「两版 README 仅第 28 行不同」这一更强的不变量。Delivery fold 另补齐此前未落域的 AC 定义：`ac-line28-no-release-promise`、`ac-no-ci`（表格结构与变更范围）与 `ac-gate-whitelist-constant`、`ac-gate-line-guard`、`ac-gate-other-lines-locked`、`ac-gate-semantics-unchanged`（校验文件与门禁）；本轮 change pack 无 `tests/cases/**`，QA fold 仅落 AC 定义，验证由 `code_gates` 的 `node --test .munk/checks/readme-001-cell.test.mjs`（13 tests / 0 fail）承担。
