// 001 status-cell contract. Diff-based assertions replay an explicit commit range so the
// gate works on a clean tree, a dirty tree, a merge commit and any historical pair.
//
//   default     : node --test .munk/checks/readme-001-cell.test.mjs
//                 head = HEAD; base = HEAD while the worktree is dirty, HEAD^ when clean;
//                 a base without a parent falls back to the empty tree.
//   empty range : MUNK_DIFF_BASE=$(git rev-parse HEAD) MUNK_DIFF_HEAD=$(git rev-parse HEAD) \
//                 node --test .munk/checks/readme-001-cell.test.mjs
//   history     : MUNK_DIFF_BASE=1b397be MUNK_DIFF_HEAD=0b99e07 \
//                 node --test .munk/checks/readme-001-cell.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const EN = 'README.md';
const ZH = 'README.zh-CN.md';
const EVIDENCE_URL = 'https://github.com/chaxiu/OpenCompare/blob/main/docs/perf/large-directory-memory.md';
const RELEASES_URL = 'https://github.com/chaxiu/OpenCompare/releases';
const EMPTY_TREE = '4b825dc642cb6eb9a060e54bf8d69288fbee4904';
const ALLOWLIST = [EN, ZH, '.munk/checks/readme-001-cell.test.mjs', '.munk/baseline/domains/readme/product.md'];
const IGNORED_PREFIXES = ['.munk/changes/', '.munk/runs/'];
const RERUN_HINT = [
  'default     : node --test .munk/checks/readme-001-cell.test.mjs',
  'empty range : MUNK_DIFF_BASE=$(git rev-parse HEAD) MUNK_DIFF_HEAD=$(git rev-parse HEAD) node --test .munk/checks/readme-001-cell.test.mjs',
  'history     : MUNK_DIFF_BASE=1b397be MUNK_DIFF_HEAD=0b99e07 node --test .munk/checks/readme-001-cell.test.mjs',
].join('\n');

const git = (args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' });
const tryGit = (args) => {
  try {
    return git(args);
  } catch {
    return null;
  }
};
const env = (name) => (process.env[name] || '').trim();

const headSha = git(['rev-parse', 'HEAD']).trim();
const headInput = env('MUNK_DIFF_HEAD') || 'HEAD';
const headResolved = tryGit(['rev-parse', '--verify', `${headInput}^{commit}`]);
if (!headResolved) {
  throw new Error(`MUNK_DIFF_HEAD=${headInput} does not resolve to a commit\n${RERUN_HINT}`);
}
const headCommit = headResolved.trim();
const worktreeIsHead = headCommit === headSha;

const dirty = git(['status', '--porcelain']).trim() !== '';
const explicitBase = env('MUNK_DIFF_BASE');
const baseInput = explicitBase || (dirty ? 'HEAD' : 'HEAD^');
const baseResolved = tryGit(['rev-parse', '--verify', `${baseInput}^{commit}`]);
let baseSha;
if (baseResolved) {
  baseSha = baseResolved.trim();
} else if (baseInput === 'HEAD^') {
  baseSha = EMPTY_TREE;
} else {
  throw new Error(`MUNK_DIFF_BASE=${baseInput} does not resolve to a commit\n${RERUN_HINT}`);
}

const diffNames = git(
  worktreeIsHead
    ? ['diff', '--name-only', baseSha]
    : ['diff', '--name-only', `${baseSha}..${headCommit}`],
)
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean);
const changedSet = new Set(diffNames);
const changedFiles = diffNames.filter((file) => !IGNORED_PREFIXES.some((prefix) => file.startsWith(prefix))).sort();
const RANGE = `${baseSha}..${headCommit}`;

const read = (file) => readFileSync(path.join(root, file), 'utf8');
// HEAD reads the live worktree (staged + unstaged); any other head is an immutable snapshot.
const readAtHead = (file) => (worktreeIsHead ? read(file) : git(['show', `${headCommit}:${file}`]));
const readAtBase = (file) => (baseSha === EMPTY_TREE ? null : tryGit(['show', `${baseSha}:${file}`]));

const files = { [EN]: readAtHead(EN), [ZH]: readAtHead(ZH) };

function row(line) {
  assert.ok(line, '001 row must exist');
  return line;
}

function cells(line) {
  const parts = line.split('|');
  // 6 columns => ['', c1..c6, '']
  assert.equal(parts.length, 8, `001 row must keep 6 columns, got ${parts.length - 2}`);
  return { parts, cells: parts.slice(1, -1).map((c) => c.trim()) };
}

function statusCell(file) {
  const line = row(files[file].split('\n').find((l) => l.startsWith('| **001** |')));
  return { line, cell: cells(line).cells[5] };
}

const en = statusCell(EN);
const zh = statusCell(ZH);

test('ac-gate-diff-allowlist: content changes stay inside the 001 allowlist for the replayed range', (t) => {
  t.diagnostic(`diff range ${RANGE} (worktree=${worktreeIsHead}, dirty=${dirty})`);
  const outOfAllowlist = changedFiles.filter((file) => !ALLOWLIST.includes(file));
  assert.deepEqual(
    outOfAllowlist,
    [],
    `files outside the 001 allowlist for base ${baseSha} head ${headCommit}: ${outOfAllowlist.join(', ')}\n${RERUN_HINT}`,
  );
});

test('ac-single-changed-line-per-file: one replaced line against the base snapshot', (t) => {
  for (const file of [EN, ZH]) {
    if (!changedSet.has(file)) {
      t.diagnostic(`${file} has no change in ${RANGE}; skipping line assertions`);
      continue;
    }
    const beforeText = readAtBase(file);
    if (beforeText === null) {
      t.diagnostic(`${file} does not exist at base ${baseSha}; skipping line assertions`);
      continue;
    }
    const before = beforeText.split('\n');
    const after = files[file].split('\n');
    assert.equal(after.length, before.length, `${file} line count must not change`);

    const changedIdx = after.map((line, i) => (line === before[i] ? -1 : i)).filter((i) => i >= 0);
    assert.deepEqual(changedIdx, [35], `${file} must change exactly the 001 row`);

    const headerBefore = before[33];
    const headerAfter = after[33];
    const sepBefore = before[34];
    const sepAfter = after[34];
    assert.equal(headerAfter, headerBefore, `${file} table header must not change`);
    assert.equal(sepAfter, sepBefore, `${file} separator row must not change`);

    const { parts } = cells(after[35]);
    assert.equal(parts.length, 8, `${file} 001 row keeps 7 pipes / 6 columns`);
    assert.equal(after[35].split('|').length - 1, 7, `${file} 001 row must keep exactly 7 pipes`);
    assert.equal(parts[0], '');
    assert.equal(parts[7], '');
  }
});

test('ac-other-content-untouched: every line except the 001 row is byte-identical to base', (t) => {
  for (const file of [EN, ZH]) {
    if (!changedSet.has(file)) {
      t.diagnostic(`${file} has no change in ${RANGE}; skipping the untouched-lines comparison`);
      continue;
    }
    const beforeText = readAtBase(file);
    if (beforeText === null) {
      t.diagnostic(`${file} does not exist at base ${baseSha}; skipping the untouched-lines comparison`);
      continue;
    }
    const before = beforeText.split('\n');
    const after = files[file].split('\n');
    before.forEach((line, i) => {
      if (i === 35) return;
      assert.equal(after[i], line, `${file}:${i + 1} must be untouched`);
    });
  }
});

test('ac-en-001-cell-exact: English metrics, scope, evidence and patrol copy', () => {
  const c = en.cell;
  for (const required of [
    '752,479 files / 97,565 dirs (symlinks not followed)',
    'cold run 22,717 ms (round 1 actually hashed 76,604 files / 11,105,870,346 B)',
    'warm runs 9,361 / 9,547 ms',
    '3-round total 41,630 ms',
    'Source tree ≈ 47 GB',
    'combined du -sh of both local repos',
    'includes files not hashed',
    '15-min issue patrol configured',
  ]) {
    assert.ok(c.includes(required), `English cell missing: ${required}`);
  }
});

test('ac-zh-001-cell-exact: Chinese metrics, scope, evidence and patrol copy', () => {
  const c = zh.cell;
  for (const required of [
    '752,479 文件 / 97,565 目录（不跟随符号链接）',
    '冷跑 22,717 ms（第 1 轮实际哈希 76,604 文件 / 11,105,870,346 B）',
    '热跑 9,361 / 9,547 ms',
    '三轮合计 41,630 ms',
    '源目录体积约 47 GB',
    '两份本地仓库 du -sh 合计',
    '含未参与哈希的文件',
    '已配置每 15 分钟巡检',
  ]) {
    assert.ok(c.includes(required), `Chinese cell missing: ${required}`);
  }
});

test('ac-old-claims-removed: misleading claims are gone from both readmes', () => {
  for (const file of [EN, ZH]) {
    const text = files[file];
    for (const banned of ['47 GB / 752k files compared in 9.3s', '47 GB / 75.2 万文件大目录 9.3 秒比完', '752k', '75.2 万文件']) {
      assert.ok(!text.includes(banned), `${file} still contains: ${banned}`);
    }
    assert.ok(!/\b9\.3\s*(?:s|秒)/.test(text), `${file} still claims a 9.3s run`);
  }
});

test('ac-volume-separate-from-timing: 47 GB and run timings live on different lines', () => {
  for (const { cell } of [en, zh]) {
    const segments = cell.split('<br>');
    const volume = segments.filter((s) => s.includes('47 GB'));
    const timing = segments.filter((s) => s.includes('22,717 ms'));
    assert.equal(volume.length, 1, 'exactly one line carries the 47 GB volume');
    assert.equal(timing.length, 1, 'exactly one line carries the cold run timing');
    assert.notEqual(volume[0], timing[0], '47 GB must not sit on the timing line');
    for (const segment of segments) {
      assert.ok(
        !(segment.includes('47 GB') && /9\.3\s*(?:s|秒)?/.test(segment)),
        '47 GB must never share a line with 9.3s wording',
      );
    }
  }
});

test('ac-warm-label-required: warm timings are labelled and never collapsed to 9.3s', () => {
  const labelled = [
    [en.cell, /warm runs 9,361 \/ 9,547 ms/],
    [zh.cell, /热跑 9,361 \/ 9,547 ms/],
  ];
  for (const [cell, re] of labelled) {
    assert.ok(re.test(cell), `warm pair missing: ${re}`);
    for (const segment of cell.split('<br>')) {
      if (/9\.3/.test(segment)) {
        assert.ok(/warm|热跑/.test(segment), 'any 9.3 mention must be labelled warm');
      }
    }
  }
});

test('ac-cold-hot-values-sourced: cold, warm and total values are distinct and ordered', () => {
  const coldRe = /(?:cold run|冷跑) 22,717 ms/;
  const warmRe = /(?:warm runs|热跑) 9,361 \/ 9,547 ms/;
  const totalRe = /(?:3-round total|三轮合计) 41,630 ms/;
  for (const [label, cell] of [
    ['en', en.cell],
    ['zh', zh.cell],
  ]) {
    const cold = cell.search(coldRe);
    const warm = cell.search(warmRe);
    const total = cell.search(totalRe);
    assert.ok(cold >= 0 && warm >= 0 && total >= 0, `${label}: one of cold/warm/total missing`);
    assert.ok(cold < warm && warm < total, `${label}: cold → warm → total order broken`);
    assert.equal(cell.split('22,717 ms').length - 1, 1, `${label}: 22,717 ms must appear once`);
    assert.equal(cell.split('41,630 ms').length - 1, 1, `${label}: 41,630 ms must appear once`);
  }
});

test('ac-evidence-link: both cells link the archived evidence doc', () => {
  assert.ok(
    en.cell.includes(`*[Method & evidence](${EVIDENCE_URL})*`),
    'English evidence link must be Method & evidence',
  );
  assert.ok(
    zh.cell.includes(`*[方法与证据](${EVIDENCE_URL})*`),
    'Chinese evidence link must be 方法与证据',
  );
});

test('ac-installer-version-untouched: version and installer links keep their wording', () => {
  assert.ok(en.cell.includes('✅ **v0.2.5 Shipped** · [Get Installer](https://github.com/chaxiu/OpenCompare/releases)'));
  assert.ok(zh.cell.includes('✅ **v0.2.5 已发布** · [下载安装包](https://github.com/chaxiu/OpenCompare/releases)'));
  for (const cell of [en.cell, zh.cell]) {
    assert.ok(cell.includes(`(${RELEASES_URL})`), 'installer URL must be untouched');
  }
});

test('ac-patrol-copy-configured: patrol copy ends the cell and states configuration only', () => {
  assert.match(
    en.cell,
    /\*15-min issue patrol configured\*$/,
    'English cell must end with the configured-patrol copy',
  );
  assert.match(
    zh.cell,
    /\*已配置每 15 分钟巡检\*$/,
    'Chinese cell must end with the configured-patrol copy',
  );
  for (const [label, line] of [
    ['en', en.line],
    ['zh', zh.line],
  ]) {
    assert.ok(
      !/last run failed|failed|运行失败|失败|Active|维护中|正常巡检|运行正常|running/i.test(line),
      `${label} must not mention a run result or claim Active/healthy patrol`,
    );
  }
});

test('ac-opencompare-repo-clean: the OpenCompare repo is never touched', (t) => {
  const repo =
    process.env.OPENCOMPARE_REPO ||
    '/Users/zhutao/Library/Application Support/Munk AI/munk-auto/codebases/projects/open-compare';
  if (!existsSync(path.join(repo, '.git'))) {
    t.skip(`OpenCompare checkout not present at ${repo}`);
    return;
  }
  const porcelain = execFileSync('git', ['status', '--porcelain'], { cwd: repo, encoding: 'utf8' });
  assert.equal(porcelain.trim(), '', 'OpenCompare worktree must stay clean');
});
