/**
 * 合并 booksData 分片为单一 booksData.js
 * 用法: node csdn/scripts/merge-books-data.js
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { compareBookIds } = require('./book-paths');

const root = path.resolve(__dirname, '../..');
const outPath = path.join(root, 'csdn/src/data/booksData.js');
const part1101Path = path.join(root, 'csdn/src/data/booksData1101_1700.js');
const part1700Path = path.join(root, 'csdn/src/data/booksData1-700.js');

function parseBookDataFile(content) {
  const imports = [];
  for (const line of content.split('\n')) {
    if (line.startsWith('import ')) imports.push(line.trim());
  }

  const itemsMatch = content.match(/export const bookItems = \[([\s\S]*?)\];/);
  const itemsBody = itemsMatch ? itemsMatch[1] : '';
  const blocks = [];
  const blockRe = /\n  \{[\s\S]*?\n  \},/g;
  let m;
  while ((m = blockRe.exec(itemsBody)) !== null) {
    blocks.push(m[0].trim());
  }

  const categories = content.match(/export const allBookCategories = (\[[\s\S]*?\]);/)?.[1];
  const tags = content.match(/export const allBookTags = (\[[\s\S]*?\]);/)?.[1];

  return { imports, blocks, categories, tags };
}

function parseBlockId(block) {
  const quoted = block.match(/id: "([^"]+)",/)?.[1];
  if (quoted) return quoted;
  const num = block.match(/id: (\d+),/)?.[1];
  return num ? Number(num) : null;
}

function mergeMeta(parts) {
  const categories = new Set();
  const tags = new Set();
  for (const part of parts) {
    if (!part.categories) continue;
    for (const name of JSON.parse(part.categories.replace(/'/g, '"'))) {
      categories.add(name);
    }
    if (!part.tags) continue;
    for (const name of JSON.parse(part.tags.replace(/'/g, '"'))) {
      tags.add(name);
    }
  }
  return {
    categories: [...categories].sort(),
    tags: [...tags].sort(),
  };
}

function loadGitHeadBooksData() {
  try {
    return execSync('git show HEAD:csdn/src/data/booksData.js', {
      cwd: root,
      encoding: 'utf8',
      maxBuffer: 100 * 1024 * 1024,
    });
  } catch {
    return '';
  }
}

const sources = [];

if (fs.existsSync(part1700Path) && fs.statSync(part1700Path).size > 100) {
  sources.push({ name: 'booksData1-700.js', ...parseBookDataFile(fs.readFileSync(part1700Path, 'utf8')) });
} else {
  const gitContent = loadGitHeadBooksData();
  if (!gitContent) throw new Error('booksData1-700.js 为空且无法从 git 读取 booksData.js');
  const gitPart = parseBookDataFile(gitContent);
  gitPart.blocks = gitPart.blocks.filter((b) => {
    const id = parseBlockId(b);
    return id != null && typeof id === 'number' && id <= 1100;
  });
  sources.push({ name: 'git HEAD 1-1100', ...gitPart });
  console.log(`booksData1-700.js 为空，已从 git 取 1-1100（${gitPart.blocks.length} 本）`);
}

if (!fs.existsSync(part1101Path)) throw new Error('缺少 booksData1101_1700.js');
sources.push({ name: 'booksData1101_1700.js', ...parseBookDataFile(fs.readFileSync(part1101Path, 'utf8')) });

const importSet = new Set();
const blockMap = new Map();

for (const src of sources) {
  for (const imp of src.imports) importSet.add(imp);
  for (const block of src.blocks) {
    const id = parseBlockId(block);
    if (id == null) continue;
    blockMap.set(id, block);
  }
  console.log(`${src.name}: ${src.blocks.length} 条`);
}

const ids = [...blockMap.keys()].sort(compareBookIds);
const { categories, tags } = mergeMeta(sources);

const importLines = [...importSet].sort((a, b) => {
  if (a.includes('wudaoCover')) return -1;
  if (b.includes('wudaoCover')) return 1;
  return a.localeCompare(b);
});

const output = `${importLines.join('\n')}

export const bookItems = [
${ids.map((id) => blockMap.get(id)).join('\n')}
];

export const allBookCategories = ${JSON.stringify(categories)};

export const allBookTags = ${JSON.stringify(tags)};
`;

fs.writeFileSync(outPath, output, 'utf8');
console.log(`已写入 ${outPath}，共 ${ids.length} 本书`);
