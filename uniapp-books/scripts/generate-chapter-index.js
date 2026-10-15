// 生成章节索引的脚本
// 用于批量处理 books 目录下的 txt 文件，生成章节索引数据

const fs = require('fs');
const path = require('path');

/**
 * 解析单个文件的章节索引
 */
function generateChapterIndex(filePath) {
  console.log(`正在处理: ${filePath}`);
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const chapterRegex = /第[0-9零一二三四五六七八九十百千万]+章[^\n]*/g;
  const chapters = [];
  let match;
  let lastIndex = 0;
  
  while ((match = chapterRegex.exec(content)) !== null) {
    if (chapters.length > 0) {
      chapters[chapters.length - 1].length = match.index - lastIndex;
    }
    
    chapters.push({
      chapter: chapters.length + 1,
      title: match[0].trim(),
      startPos: match.index,
      length: 0
    });
    
    lastIndex = match.index;
  }
  
  // 最后一章
  if (chapters.length > 0) {
    chapters[chapters.length - 1].length = content.length - lastIndex;
  }
  
  return {
    totalChapters: chapters.length,
    wordCount: content.length,
    fileSize: Buffer.byteLength(content, 'utf-8'),
    chapterIndex: chapters.slice(0, 10) // 只保留前10章作为示例
  };
}

/**
 * 批量处理
 */
function main() {
  const booksDir = path.join(__dirname, '../../books');
  
  if (!fs.existsSync(booksDir)) {
    console.error('错误: books 目录不存在');
    process.exit(1);
  }
  
  const files = fs.readdirSync(booksDir).filter(f => f.endsWith('.txt'));
  
  if (files.length === 0) {
    console.log('未找到 txt 文件');
    return;
  }
  
  console.log(`找到 ${files.length} 个文件\n`);
  
  const results = {};
  
  files.forEach(file => {
    // 从文件名提取 bookId: 格式 {id}_书名.txt
    const match = file.match(/^(\d+)_/);
    if (!match) {
      console.log(`跳过: ${file} (文件名格式不符)`);
      return;
    }
    
    const bookId = parseInt(match[1]);
    const filePath = path.join(booksDir, file);
    
    try {
      const info = generateChapterIndex(filePath);
      results[bookId] = {
        fileName: file,
        ...info
      };
      
      console.log(`✓ Book ID ${bookId}: ${info.totalChapters} 章, ${(info.wordCount / 10000).toFixed(1)}万字\n`);
    } catch (error) {
      console.error(`✗ 处理失败: ${file}`);
      console.error(`  错误: ${error.message}\n`);
    }
  });
  
  // 保存结果
  const outputPath = path.join(__dirname, '../data/chapter-indexes.json');
  fs.writeFileSync(
    outputPath,
    JSON.stringify(results, null, 2),
    'utf-8'
  );
  
  console.log(`\n✅ 完成！章节索引已保存到: ${outputPath}`);
  console.log(`共处理 ${Object.keys(results).length} 本书`);
}

// 运行
main();
