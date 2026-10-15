/**
 * 章节解析工具
 * 用于解析 txt 格式的小说内容
 */

/**
 * 解析 txt 内容为章节列表
 * @param {String} content - 完整的txt内容
 * @returns {Array} 章节数组
 */
export function parseChapters(content) {
  // 匹配章节标题的正则（支持多种格式）
  // 支持：第1章、第一章、第001章、第1章 标题、第一章 标题等
  const chapterRegex = /第[0-9零一二三四五六七八九十百千万]+章[^\n]*/g;
  const chapters = [];
  let match;
  let lastIndex = 0;
  
  // 记录前言内容（第一章之前的内容）
  let prologueEnd = 0;
  
  while ((match = chapterRegex.exec(content)) !== null) {
    if (chapters.length === 0) {
      prologueEnd = match.index;
    }
    
    if (chapters.length > 0) {
      // 保存上一章的内容
      const prevChapter = chapters[chapters.length - 1];
      prevChapter.content = content.substring(lastIndex, match.index).trim();
      prevChapter.length = match.index - lastIndex;
    }
    
    chapters.push({
      chapter: chapters.length + 1,
      title: match[0].trim(),
      startPos: match.index,
      length: 0,
      content: ''
    });
    
    lastIndex = match.index;
  }
  
  // 处理最后一章
  if (chapters.length > 0) {
    const lastChapter = chapters[chapters.length - 1];
    lastChapter.content = content.substring(lastIndex).trim();
    lastChapter.length = content.length - lastIndex;
  }
  
  // 如果有前言，作为第0章
  if (prologueEnd > 0) {
    const prologue = content.substring(0, prologueEnd).trim();
    if (prologue) {
      chapters.unshift({
        chapter: 0,
        title: '前言',
        startPos: 0,
        length: prologueEnd,
        content: prologue
      });
      
      // 重新编号后续章节
      for (let i = 1; i < chapters.length; i++) {
        chapters[i].chapter = i;
      }
    }
  }
  
  return chapters;
}

/**
 * 根据章节索引快速提取章节内容
 * @param {String} content - 完整txt内容
 * @param {Object} chapterInfo - 章节信息 {startPos, length}
 * @returns {String} 章节内容
 */
export function extractChapter(content, chapterInfo) {
  const { startPos, length } = chapterInfo;
  
  if (length && length > 0) {
    return content.substring(startPos, startPos + length).trim();
  }
  
  // 如果没有长度信息，尝试找到下一章的位置
  const nextChapterRegex = /第[0-9零一二三四五六七八九十百千万]+章[^\n]*/g;
  nextChapterRegex.lastIndex = startPos + 1; // 从当前章节后开始查找
  const nextMatch = nextChapterRegex.exec(content);
  
  if (nextMatch) {
    return content.substring(startPos, nextMatch.index).trim();
  }
  
  // 如果找不到下一章，返回到文件末尾
  return content.substring(startPos).trim();
}

/**
 * 生成章节索引（不包含内容，只包含位置信息）
 * @param {String} content - 完整txt内容
 * @returns {Array} 章节索引数组
 */
export function generateChapterIndex(content) {
  const chapters = parseChapters(content);
  
  return chapters.map(chapter => ({
    chapter: chapter.chapter,
    title: chapter.title,
    startPos: chapter.startPos,
    length: chapter.length
  }));
}

/**
 * 统计书籍信息
 * @param {String} content - 完整txt内容
 * @returns {Object} 统计信息
 */
export function analyzeBook(content) {
  const chapters = parseChapters(content);
  
  return {
    totalChapters: chapters.length,
    wordCount: content.length,
    averageChapterLength: chapters.length > 0 
      ? Math.floor(content.length / chapters.length) 
      : 0,
    chapterIndex: chapters.map(ch => ({
      chapter: ch.chapter,
      title: ch.title,
      startPos: ch.startPos,
      length: ch.length
    }))
  };
}

/**
 * 根据章节号获取章节标题
 * @param {Array} chapterIndex - 章节索引数组
 * @param {Number} chapterNum - 章节号
 * @returns {String} 章节标题
 */
export function getChapterTitle(chapterIndex, chapterNum) {
  const chapter = chapterIndex.find(ch => ch.chapter === chapterNum);
  return chapter ? chapter.title : `第${chapterNum}章`;
}

/**
 * 清理章节内容（去除空行、广告等）
 * @param {String} content - 原始内容
 * @returns {String} 清理后的内容
 */
export function cleanChapterContent(content) {
  return content
    .replace(/更多书源分享.*?最新资源获取方式.*?\n/g, '') // 去除广告
    .replace(/\n{3,}/g, '\n\n') // 合并多余空行
    .trim();
}
