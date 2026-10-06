/**
 * 清理小说 TXT 中的站点推广水印（得奇、小原文学网等）
 */
const fs = require('fs');
const path = require('path');
const { SOURCE_SHARE_LINE, applyBookShareWatermarks } = require('./source-share-line');

/** 本站书源分享行（勿当源站推广删掉） */
function isSourceShareLine(line) {
  const t = line.trim();
  return /更多书源分享/.test(t) && /toolset\.site/i.test(t);
}

/** 速读谷「更新不易」水印 → 本站推广文案 */
const SHUWEI_PROMO = '更新不易，记得分享，小程序数维探索看最新章节！';

const SUDUGU_TO_SHUWEI_PATTERNS = [
  /更新不易，记得分享，速[-*·．.\s,，、]+读[-*·．.\s,，、]+谷\s*w[-*·．.\s,，、]*w[-*·．.\s,，、]*w[-*·．.\s,，、]*\.?\s*s[-*u/·．.\s,，、]+d[-*u/·．.\s,，、]+u[-*u/·．.\s,，、]+g[-*u/·．.\s,，、]+u\s*\.?\s*o[-*r/·．.\s,，、]+r[-*r/·．.\s,，、]+g\s*看最新章节[！!]?/g,
  /更新不易，请使用【必应】搜\s*s[\-/u·．.\s,，、]+d[\-/u·．.\s,，、]+u[\-/u·．.\s,，、]+g[\-/u·．.\s,，、]+u\.?\s*o[\-/r·．.\s,，、]+r[\-/r·．.\s,，、]+g\s*看更多最新小说章节[！!]?/g,
];

function replaceSuduguWithShuwei(text) {
  let result = text;
  for (const pattern of SUDUGU_TO_SHUWEI_PATTERNS) {
    result = result.replace(pattern, SHUWEI_PROMO);
  }
  return result;
}

const SPAM_LINE_PATTERNS = [
  /^来源[：:]\s*得奇小说网\s*$/,
  /^网址[：:]\s*https?:\/\/(www\.)?deqixs\.org\s*$/i,
  /记住更新地址不迷路/,
  /必应搜/,
  /必应搜索/,
  /必应搜索.*(嘚齐|德其|德齐|德旗|得奇)小说网/,
  /必应搜索[“"].*[“"].*(可看本书|最新更新)/,
  /搜索[“"].*(嘚齐|德其|德齐|德旗|得奇)小说网[“"].*模糊/,
  /前往.*必.*应.*搜.*小说网/,
  /w\)w\)w\)\.\)d\)e\)q\)i\)x\)s\)\.\)o\)r\)g/i,
  /d\\+[eE]\\+q\\+i\\+x\\+s\\+\\.\\+o\\+[rR]\\+g/,
  /请\.访问\.看最新章节/,
  /请进\s*w\)w\)w\)/i,
  /更多精彩小说.*得奇小说网/,
  /deqixs\.org/i,
  /DeQiXs\.Org/i,
  /dEqIxS\.oRg/i,
  /\.dêqix\./i,
  /站长只有这一个站/,
  /后续更新请访问[：:]/,
  /ｗｗｗ[\.．]ｄｅｑｉｘｓ[\.．]ｏｒｇ/,
  /请收「藏「得」「奇」小」说」/,
  /「德」「旗」「小」「说」「网」/,
  /「德」「齐」「小」「说」「网」/,
  /「德」「其」「小」「说」「网」/,
  /【搜】【索】【德】【[旗齐其]】【小】【说】【网】/,
  /搜索德[旗齐其]小说网.*查看.*本书.*最新.*章节/,
  /德[旗齐其]小说网/,
  /w「w」w」\.」d」e「q」i」x」s」/,
  /「站」「长」只「有这一个网「站/,
  /本书首发/,
  /记住全网最快小说站/,
  /写到这里我希望读者记一下我们域名/,
  /全手打无错站/,
  /101\s*看书网/,
  /必应搜索：速\s*读\s*谷/,
  /读好书上/,
  /读小说就上/,
  /追书就上/,
  /海量小说在/,
  /无错章节，无乱序章节/,
  /速读谷/,
  /速度谷/,
  /速\s*读\s*谷/,
  /速\s*度\s*谷/,
  /速[·．.\s,，、]+读[·．.\s,，、]+谷/,
  /速[·．.\s,，、]+度[·．.\s,，、]+谷/,
  /更新不易[^。\n]*为您呈现最新小说章节/,
  /^更新不易，记得分享网/,
  /更新不易.*请记住本站/,
  /[涑速][￥¥\s]*读\s*[￥¥\s]*谷/,
  /s[…·．.\s,，、￥¥^]*u[…·．.\s,，、￥¥^]*d[…·．.\s,，、￥¥^]*u[…·．.\s,，、￥¥^]*g[…·．.\s,，、￥¥^]*u/i,
  /s\^u\^d\^u\^g\^u/i,
  /sudugu\.org/i,
  /suduɡu/i,
  /输入速读谷的拼音后缀/,
  /^关注微信公众号[，,：:\s]*北尘阅读\s*$/,
  /^微信公众号[，,：:\s]*北尘阅读\s*$/,
  /^微信搜[：:\s]*北尘阅读\s*$/,
  /^北尘阅读[，,：:\s]*微信公众号\s*$/,
  /可以关注我的微信号/,
  /关注我的微信号[：:]/,
  /看更多的.*可以关注我的微信号/,
  /** min-yuan.com / 小原文学网（download-minyuan-book.js） */
  /^\[本章下载失败:[^\]]+\]\s*$/,
  /^来源[：:]\s*小原文学网\s*$/,
  /^网址[：:]\s*https?:\/\/(www\.)?min-yuan\.com[^。]*$/i,
  /^小原文学网\s*$/,
  /^www\.min-yuan\.com\s*$/i,
  /正在转码中[，,]?\s*请稍后再试/,
  /^章节正在手打中/,
  /** PHP/ThinkPHP 错误页、# 堆栈行（min-yuan 等站点转码失败时混入） */
  /^\s*#\d+\s/,
  /^\s*#\d+\s*\{main\}\s*$/,
  /^\s*错误位置\s*$/,
  /^\s*TRACE\s*$/,
  /^\s*FILE:\s*\/www\/sites\//i,
  /^\s*FILE:.*MyClass\.class\.php\s+LINE:\s*\d+/i,
  /Home\\Controller\\IndexController/,
  /Think\\App::invoke/,
  /** 含 min-yuan.com / qidian2.com 的整行（下载失败 URL、站点水印、错误页路径） */
  /min-yuan\.com/i,
  /qidian2\.com/i,
  /** 笔趣阁 e00df.icu 推广水印 */
  /e00df\.icu/i,
  /请收藏本站[：:]\s*\.?e00df\.icu/,
  /笔趣阁手机版[：:]\s*\.?e00df\.icu/,
  /** 邀请码 / 官方反馈群推广（勿匹配本站 toolset 分享行） */
  /最后一批邀请码/,
  /1900人发放/,
  /^官方反馈群\s*2497460/,
  /^2497460$/,
];

const INLINE_SPAM_PATTERNS = [
  /\s*记住更新地址不迷路[：:][^\n]*/g,
  /\s*必应搜[：:][^\n]*/g,
  /\s*必应搜索[“"][^"”\n]+[”"][^\n]*/g,
  /\s*【防走失指南】[^\n]*必应[^\n]*/g,
  /\s*前往(?:「[^」]*」)*必(?:「[^」]*」)*应(?:「[^」]*」)*搜(?:「[^」]*」)*索[^\n]*/g,
  /\s*请进\s*w\)w\)w\)[^\n]*/gi,
  /\s*请\.访问\.看最新章节[！!]?地址[：:]\s*d\\+[eE]\\+q\\+i\\+x\\+s\\+\\.\\+o\\+[rR]\\+g[^\n]*/gi,
  /\s*d\\+[eE]\\+q\\+i\\+x\\+s\\+\\.\\+o\\+[rR]\\+g[^\n]*/gi,
  /\s*更多精彩小说，请访问：得奇小说网\s*https?:\/\/(www\.)?deqixs\.org\s*/gi,
  /\s*请收「藏「得」「奇」小」说」[^\n]*/g,
  /\s*请收(?:「[^」]*」)*藏(?:「[^」]*」)*得(?:「[^」]*」)*奇(?:「[^」]*」)*小(?:「[^」]*」)*说(?:「[^」]*」)*[^\n]*/g,
  /\s*「得」「奇」「小」「说」「网」(?:「[^」]*」)*「d」「e」「q」「i」「x」「s」「.」「o」「r」「g」[^\n]*/g,
  /\s*「德」(?:「[^」]{1,2}」){2,}(?:「手打」)?(?:「更新」)?[^\n]*/g,
  /\s*【搜】【索】【德】【[旗齐其]】【小】【说】【网】[^。\n]*章节[！!]?/g,
  /\s*【搜】[^。\n]*【索】[^。\n]*【德】[^。\n]*【[旗齐其]】[^。\n]*【小】[^。\n]*【说】[^。\n]*【网】[^。\n]*章节[！!]?/g,
  /\s*前往(?:「[^」]*」)*德(?:「[^」]*」)*[旗齐其](?:「[^」]*」)*小(?:「[^」]*」)*说[^\n]*/g,
  /\s*速读谷\s*www\.sudugu\.org[^\n]*/gi,
  /\s*[,，]?\s*速读谷[,，]?\s*www\.sudugu\.org[^\n]*/gi,
  /\s*速\s*读\s*谷\s*(?:w\s*w\s*w\s*)?[\s.]*s\s*u\s*d\s*u\s*g\s*u\s*[\s.]*o\s*r\s*g[^\n]*/gi,
  /\s*速\s*度\s*谷\s*(?:w\s*w\s*w\s*)?[\s.]*s\s*u\s*d\s*u\s*g\s*u\s*[\s.]*o\s*r\s*g[^\n]*/gi,
  /\s*写到这里请记一下本站域名：速\s*读\s*谷[^\n]*/g,
  /\s*更新不易[^。\n]*请记住本站[^\n]*/g,
  /\s*更新不易[^。\n]*为您呈现最新小说章节[！!]?/g,
  /\s*更新不易，记得分享网/g,
  /\s*更新不易[^。\n]*速读谷[^。\n]*/g,
  /\s*更新不易[^。\n]*速[·．.\s,，、]+读[·．.\s,，、]+谷[^。\n]*/g,
  /\s*请分享[^。\n]*速读谷[^。\n]*/g,
  /\s*请记得分享[^。\n]*速读谷[^。\n]*/g,
  /\s*记得分享[^。\n]*速读谷[^。\n]*/g,
  /ｓuduɡu\.ｃｃ[^\n]*/g,
  /\s*速读谷[,，]?\s*www\.sudugu\.org\s*看[^\n]*/gi,
  /\s*[,，]?\s*s\^u\^d\^u\^g\^u\s*\.?\s*o\^r\^g[^\n]*/gi,
  /\s*s(?:\^u)+\^?g\^u\s*\.?\s*o(?:\^r)+\^?g[^\n！!。]*/gi,
  /\s*请使用[【[]?必应[】\]]?搜[^。\n]*s\^u\^d\^u\^g\^u[^。\n]*[！!]?/g,
  /\s*[,，]?\s*请使用[【[]?必应[】\]]?搜\s*$/g,
  /\s*关注微信公众号[，,：:\s]*北尘阅读\s*/g,
  /\s*微信公众号[，,：:\s]*北尘阅读\s*/g,
  /\s*微信搜[：:\s]*北尘阅读\s*/g,
  /\s*北尘阅读[，,：:\s]*微信公众号\s*/g,
  /[（(][^)）\n]*可以关注我的微信号[^)）\n]*[)）]/g,
  /[（(]看更多的[^)）\n]*微信号[^)）\n]*[)）]/g,
  /\s*可以关注我的微信号[：:][^\n)）]*/g,
  /\s*关注我的微信号[：:][^\n)）]*/g,
  /\s*手[·．.\s,，、]*打[·．.\s,，、]*全[本网本]?\s*/g,
  /\s*得[·．.\s,，、]*奇[·．.\s,，、]*小[·．.\s,，、]*说[网]?\s*/g,
  /\s*后续更新请访问[：:][^\n]*/g,
  /\s*后续更新请访问[：:]\s*\.?\s*d[êeëéè]qix\.?[^。\n]*/gi,
  /\.dêqix\.[^。\n]*/gi,
  /\s*ｗｗｗ[\.．]ｄｅｑｉｘｓ[\.．]ｏｒｇ[^。\n]*/g,
  /\s*[，,、；;]?\s*站长只有这一个站[^。\n！!]*[！!]?/g,
  /\s*\[本章下载失败:[^\]]+\]/g,
  /\s*https?:\/\/(www\.)?min-yuan\.com[^\s\n]*/gi,
  /\s*www\.min-yuan\.com[^\s\n]*/gi,
  /\s*正在转码中[，,]?\s*请稍后再试[\.。…]*\s*/g,
  /\s*章节正在手打中[^\n]*/g,
  /\s*请收藏本站[：:]\s*\.?e00df\.icu[。．.]?\s*笔趣阁手机版[：:]\s*\.?e00df\.icu\s*/g,
  /\s*请收藏本站[：:]\s*\.?e00df\.icu[。．.]?\s*/g,
  /\s*笔趣阁手机版[：:]\s*\.?e00df\.icu[。．.]?\s*/g,
  /\s*最后一批邀请码[^。\n]*/g,
  /\s*[,，]?\s*官方反馈群\s*2497460[^。\n]*/g,
  /\s*[,，]?\s*2497460[^。\n]*/g,
];

const VERTICAL_WATERMARKS = [
  ['得', '奇', '小', '说', '网', 'd', 'e', 'q', 'i', 'x', 's', '.', 'o', 'r', 'g'],
  ['嘚', '齐', '小', '说', '网', 'd', 'e', 'q', 'i', 'x', 's', '.', 'o', 'r', 'g'],
  ['德', '其', '小', '说', '网', 'd', 'e', 'q', 'i', 'x', 's', '.', 'o', 'r', 'g'],
  ['德', '旗', '小', '说', '网'],
  ['德', '齐', '小', '说', '网'],
];

function tryMatchVerticalWatermark(lines, startIndex) {
  const first = lines[startIndex]?.trim();
  if (!first) return null;

  for (const sequence of VERTICAL_WATERMARKS) {
    if (first !== sequence[0]) continue;

    let idx = startIndex;
    let matched = true;
    for (const ch of sequence) {
      if (idx >= lines.length || lines[idx].trim() !== ch) {
        matched = false;
        break;
      }
      idx++;
    }

    if (!matched) continue;

    while (idx < lines.length && lines[idx].trim() === '') {
      idx++;
    }
    return idx;
  }

  return null;
}

function removeVerticalWatermarks(lines) {
  const cleaned = [];
  let i = 0;

  while (i < lines.length) {
    const end = tryMatchVerticalWatermark(lines, i);
    if (end !== null) {
      i = end;
      continue;
    }
    cleaned.push(lines[i]);
    i++;
  }

  return cleaned;
}

function looksLikeChineseNovel(text) {
  const sample = text.slice(0, 4000);
  return /[\u4e00-\u9fff]{20,}/.test(sample)
    && (/《[^》]+》/.test(sample) || /作者[：:]/.test(sample));
}

function readTextFile(filePath) {
  const buffer = fs.readFileSync(filePath);
  const utf8 = buffer.toString('utf8');
  if (looksLikeChineseNovel(utf8)) return utf8;
  const sample = utf8.slice(0, 4000);
  if (!utf8.includes('\uFFFD') && /《|第\d+章|作者[：:]/.test(sample)) {
    return utf8;
  }
  try {
    const gb = new TextDecoder('gb18030').decode(buffer);
    if (looksLikeChineseNovel(gb) || /《|作者[：:]/.test(gb.slice(0, 4000))) return gb;
  } catch {
    // ignore
  }
  return utf8;
}

function normalizeBracketSpam(text) {
  return text.replace(/「/g, '').replace(/」/g, '');
}

function isBracketDeqixsLine(line) {
  const normalized = normalizeBracketSpam(line).replace(/\s/g, '');
  if (/得奇小说网.*deqixs\.org/i.test(normalized)) return true;
  if (/得奇小说网首发/i.test(normalized) && /deqixs/i.test(normalized)) return true;
  if (/得奇小说.*deqixs/i.test(normalized)) return true;
  if (/得奇小说/.test(normalized) && /手打|首发|更新|网址|www/.test(normalized)) return true;
  if (/「得」/.test(line) && /「奇」/.test(line) && /「d」|deqixs/i.test(line)) return true;
  if (/德[旗齐其]小说网/.test(normalized)) return true;
  if (/「德」/.test(line) && /「旗」|「齐」|「其」/.test(line) && /「说」|「小」/.test(line)) return true;
  if (/「手打」/.test(line) && /「全」/.test(line) && (/「得」|「奇」/.test(line) || /得奇小说/.test(normalized))) return true;
  return false;
}

/** 「德」「旗」… 括号分隔推广水印（整行删除） */
function isDeqiBracketSpamLine(line) {
  const content = line.replace(/^[\s　]+/, '').trim();
  if (!content) return false;

  const normalized = normalizeBracketSpam(content).replace(/\s+/g, '');
  if (/德[旗齐其]小说网/.test(normalized)) return true;
  if (/德[旗齐其].*手打.*更新/.test(normalized)) return true;

  if (!/「/.test(content)) return false;

  const hasDe = /「德」/.test(content);
  const hasQiVariant = /「旗」|「齐」|「其」/.test(content);
  const hasNovel = /「小」|「说」/.test(content) || /小说/.test(normalized);
  const hasSiteHint = /「网」|手打|更新|首发|章节|搜/.test(content) || /小说网/.test(normalized);

  if (hasDe && hasQiVariant && hasNovel && hasSiteHint) return true;

  const blocks = content.match(/「[^」]{1,2}」/g) || [];
  if (blocks.length >= 5 && hasDe && hasQiVariant) return true;

  return false;
}

function isBracketSpamLine(line) {
  const normalized = normalizeBracketSpam(line);
  return /请收藏得奇小说唯一网址.*deqixs\.org/.test(normalized) ||
    /请收.*得.*奇.*小.*说.*www\.deqixs\.org.*断更/.test(normalized);
}

/** 必应搜索推广水印（整行删除）；不误删「有求必应」「想必应该」等正文 */
function normalizeBingCheck(text) {
  return normalizeBracketSpam(text).replace(/\s+/g, '');
}

function isBingSpamLine(line) {
  const content = line.replace(/^[\s　]+/, '').trim();
  if (!content) return false;

  const normalized = normalizeBingCheck(content);
  if (!/必应/.test(normalized)) return false;

  if (/必应搜/.test(normalized)) return true;
  if (/必应搜索/.test(normalized)) return true;
  if (/百度/.test(normalized) && /必应/.test(normalized) && /搜/.test(normalized)) return true;
  if (/前往/.test(normalized) && /必应/.test(normalized) && /搜/.test(normalized)) return true;
  if (/防走失/.test(normalized) && /必应/.test(normalized)) return true;

  const spamHints = /(?:小说网|最新章|德[齐旗其]|嘚齐|得奇|deqixs|查看本书|首發|首发|可看本书)/i;
  return spamHints.test(normalized);
}

const OBFUSCATED_SPAM_PHRASES = [
  '提醒您查看最新内容',
  '提醒你可以啦',
  '提醒您可以啦',
  '最快的',
  '的章节',
  '本章节来源于',
  '章节来源于',
  '最新章节来源',
  '观看访问',
  '提供最快',
  '101看书网',
  '全手打无错站',
  '无错章节',
  '速读谷',
  '速度谷',
];

const STANDALONE_SPAM_LINES = [
  '提醒您查看最新内容',
  '提醒你可以啦',
  '提醒您可以啦',
];

function compactText(text) {
  return text.replace(/\s+/g, '').toLowerCase();
}

/** 去除速读谷水印常用分隔符：空格、·、.、,、…、￥ 等 */
function deobfuscateSudugu(text) {
  return text
    .replace(/[\^￥¥…·．.,，、•‧\s]/g, '')
    .replace(/涑/g, '速')
    .toLowerCase();
}

/** 反斜杠分隔域名：d\E\q\i\x\s\.\o\R\g → deqixs.org */
function deobfuscateBackslashDomain(text) {
  return text.replace(/\\/g, '').toLowerCase();
}

/** 去除中文推广水印常用分隔符（空格、标点等） */
function deobfuscateChineseSpam(text) {
  return text.replace(/[·．.\s,，、•‧！!。．￥¥…:：;；]/g, '');
}

/** 「秒级更新，精彩不卡顿」类推广水印（模糊匹配） */
function miaojiSpamResidual(compact) {
  return compact
    .replace(/秒级更新精彩不卡顿/g, '')
    .replace(/秒级更新/g, '')
    .replace(/精彩不卡顿/g, '');
}

function isMiaojiSpamLine(line) {
  const content = line.replace(/^[\s　]+/, '').trim();
  if (!content) return false;

  const compact = deobfuscateChineseSpam(content);
  const hasMiaoji = /秒[·．.\s,，、!！]*级[·．.\s,，、]*更[·．.\s,，、]*新/.test(content)
    || /秒级更新/.test(compact);
  const hasSmooth = /精[·．.\s,，、]*彩[·．.\s,，、]*不[·．.\s,，、]*卡[·．.\s,，、]*顿/.test(content)
    || /精彩不卡顿/.test(compact);

  if (!hasMiaoji && !hasSmooth) return false;

  const residual = miaojiSpamResidual(compact);
  if (residual.length >= 4) return false;

  if (hasMiaoji && hasSmooth) return true;
  if (/秒级更新精彩不卡顿/.test(compact)) return true;
  if (content.length <= 48 && hasMiaoji && /卡顿|精彩|不卡/.test(compact)) return true;

  return hasMiaoji;
}

const MIAOJI_INLINE_PATTERN = /秒[·．.\s,，、!！]*级[·．.\s,，、]*更[·．.\s,，、]*新[·．.\s,，、，,！!：:]*精[·．.\s,，、]*彩[·．.\s,，、]*不[·．.\s,，、]*卡[·．.\s,，、]*顿[！!。．]*/g;

const DEQI_SHOUDA_INLINE_PATTERNS = [
  /手[·．.\s,，、]*打[·．.\s,，、]*全[本网本]?/g,
  /得[·．.\s,，、]*奇[·．.\s,，、]*小[·．.\s,，、]*说[网]?/g,
  /得奇小说[网]?/g,
  /手打全[本网]?/g,
];

/** HTML 数字实体混淆推广（&#8204;、&#65279; 等拼 deqixs.org） */
const HTML_ENTITY_SPAM_TAIL_PATTERNS = [
  /[，,；;]?最新章节不迷路[^。！？\n]*$/g,
  /[，,；;]?更多无错精彩章节[^。！？\n]*$/g,
  /[，,；;]?后续章节可以进[：:][^。！？\n]*$/g,
  /[，,；;]?免费阅读全文[^。！？\n]*$/g,
  /[，,；;]?全网同步更新[^。！？\n]*$/g,
  /[，,；;]?避免乱码[^。！？\n]*$/g,
  /[，,；;]?浏览器直接输入[：:][a-zA-Z.]*$/gi,
  /[，,；;]?请访问[^。！？\n]*$/g,
  /[，,；;]?请进[：:][^。！？\n]*$/g,
  /[，,；;]?请认准[^。！？\n]*$/g,
  /[，,；;]?文字更新\s*www?\.?\s*$/gi,
  /[，,；;]?域名防封[^。！？\n]*$/g,
  /[，,；;]?【紧急公告】[^】\n]*$/g,
  /[，,；;]?【提示：[^\n]*$/g,
  /[（(]\s*$/g,
  /[，,；;]?全文字手打[^。！？\n]*$/g,
];

function deqiShoudaResidual(compact) {
  return compact
    .replace(/得奇小说网/g, '')
    .replace(/得奇小说/g, '')
    .replace(/手打全网/g, '')
    .replace(/手打全本/g, '')
    .replace(/手打全/g, '');
}

/** 「手打全」「得奇小说」推广水印（模糊匹配） */
function isDeqiShoudaSpamLine(line) {
  const content = line.replace(/^[\s　]+/, '').trim();
  if (!content) return false;

  const compact = deobfuscateChineseSpam(content);
  const normalized = normalizeBracketSpam(content).replace(/\s+/g, '');

  const hasShoudaQuan = /手[·．.\s,，、]*打[·．.\s,，、]*全/.test(content)
    || /手打全/.test(compact);
  const hasDeqiNovel = /得[·．.\s,，、]*奇[·．.\s,，、]*小[·．.\s,，、]*说/.test(content)
    || /得奇小说/.test(compact);
  const hasSpamHint = /deqixs|小说网|更新|首发|网址|www|来源|收藏|断更|手打/.test(compact)
    || /deqixs/i.test(normalized);

  if (!hasShoudaQuan && !hasDeqiNovel) return false;

  const residual = deqiShoudaResidual(compact);
  if (residual.length >= 4) return false;

  if (hasShoudaQuan && hasDeqiNovel) return true;
  if (hasShoudaQuan && hasSpamHint) return true;
  if (hasDeqiNovel && hasSpamHint) return true;
  if (content.length <= 48 && hasShoudaQuan) return true;
  if (content.length <= 48 && hasDeqiNovel) return true;
  if (/「手打」/.test(content) && /「全」/.test(content) && /「得」|「奇」|得奇小说/.test(content + normalized)) {
    return true;
  }

  return false;
}

/** 含 .org 域名水印的整行删除（含全角点、逗号分隔变体） */
function isOrgDomainLine(line) {
  const content = line.replace(/^[\s　]+/, '').trim();
  if (!content) return false;
  if (/\.org/i.test(content)) return true;
  if (/[.。．]org/i.test(content)) return true;
  if (/\.o[·．.\s,，、…^]*r[·．.\s,，、…^]*g/i.test(content)) return true;
  if (/o[…·．.\s,，、^]+r[…·．.\s,，、^]+g/i.test(content)) return true;
  if (/d\\+[eE]\\+q\\+i\\+x\\+s\\+\\.\\+o\\+[rR]\\+g/.test(content)) return true;
  const deobSlash = deobfuscateBackslashDomain(content);
  if (/deqixs\.org/.test(deobSlash)) return true;
  const deob = deobfuscateSudugu(content);
  if (deob.includes('.org')) return true;
  if (/deqixsorg|suduguorg|wwwsudugu|wwfdeqixs/i.test(deob)) return true;
  return false;
}

/** 小原文学网 min-yuan.com 推广水印 */
function isMinyuanSpamLine(line) {
  const content = line.replace(/^[\s　]+/, '').trim();
  if (!content) return false;

  if (/min-yuan\.com/i.test(content)) return true;
  if (/www\.min-yuan/i.test(content)) return true;
  if (/正在转码中/.test(content) && /请稍后再试/.test(content)) return true;
  if (/^章节正在手打中/.test(content)) return true;
  if (content === '小原文学网' || /^小原文学网[！!。．…]*$/.test(content)) return true;

  if (/小原文学网/.test(content)) {
    const hints = /记住|更新|首发|网址|www|min-yuan|阅读|收藏|最新章|手打|本站|访问|域名/;
    if (hints.test(content) && content.length <= 120) return true;
  }

  return false;
}

/** 含 qidian2.com 的站点错误页路径行 */
function isQidian2SpamLine(line) {
  return /qidian2\.com/i.test(line);
}

/** 行首 # 堆栈行、PHP/ThinkPHP 错误页残留（不误删正文中的 名字#名字） */
function isHashOrPhpErrorSpamLine(line) {
  const content = line.replace(/^[\s　]+/, '').trim();
  if (!content) return false;

  if (/^#/.test(content)) return true;

  if (content === '错误位置' || content === 'TRACE') return true;
  if (/^FILE:\s*\/www\/sites\//i.test(content)) return true;
  if (/Think\\Think::/.test(content)) return true;
  if (/ThinkPHP/.test(content)) return true;
  if (/IndexController\.class\.php/.test(content)) return true;
  if (/MyClass\.class\.php/.test(content)) return true;
  if (/spl_autoload_call/.test(content)) return true;
  if (/ReflectionMethod->invoke/.test(content)) return true;
  if (/Think\\App::/.test(content)) return true;
  if (/Home\\Controller\\IndexController/.test(content)) return true;
  if (/require\('\/www\/sites\//.test(content)) return true;

  return false;
}

/**
 * 移除 qidian2 ThinkPHP 整段错误页（min-yuan 转码失败时插入章节中间）
 * 示例：
 *   错误位置
 *   FILE: .../MyClass.class.php  LINE: 766
 *   TRACE
 *   #0 ... #9 {main}
 */
function removeQidian2PhpErrorBlocks(text) {
  const block =
    /(?:^|\n)错误位置\r?\n(?:FILE:[^\n]*(?:qidian2\.com|ThinkPHP)[^\n]*\r?\n)?TRACE\r?\n(?:#[^\n]*\r?\n)+#\d+\s*\{main\}\s*(?=\r?\n|$)/gi;
  return text.replace(block, '\n');
}

function isSuduguSpamLine(line) {
  const content = line.replace(/^[\s　]+/, '').trim();
  const compact = compactText(content);
  const deob = deobfuscateSudugu(content);

  // 模糊匹配：速 读 谷 / 速·读·谷 / 速.读.谷 / w,w,w.s,u,d,u,g,u.o,r,g
  if (/速\s*读\s*谷/.test(content)) return true;
  if (/速\s*度\s*谷/.test(content)) return true;
  if (/速[·．.\s,，、]+读[·．.\s,，、]+谷/.test(content)) return true;
  if (/速[·．.\s,，、]+度[·．.\s,，、]+谷/.test(content)) return true;
  if (compact.includes('速读谷') || compact.includes('速度谷')) return true;
  if (deob.includes('速读谷') || deob.includes('速度谷')) return true;
  if (compact.includes('sudugu') || deob.includes('sudugu')) return true;
  if (/suduɡu/i.test(content)) return true;
  if (/s\s*u\s*d\s*u\s*g\s*u/i.test(content) && /速/.test(content)) return true;
  if (/w[·．.\s,，、,]+w[·．.\s,，、,]+w/i.test(content) && /s[·．.\s,，、,]+u/i.test(content) && /速/.test(content)) {
    return true;
  }
  if (/更新不易.*记得分享.*为您呈现最新小说章节/.test(content)) return true;
  if (/更新不易.*请记住本站/.test(content)) return true;
  if (/[涑速][￥¥\s]*读/.test(content) && /[￥¥\s]*谷/.test(content)) return true;
  if (/s[…·．.\s,，、￥¥^]*u[…·．.\s,，、￥¥^]*d[…·．.\s,，、￥¥^]*u[…·．.\s,，、￥¥^]*g[…·．.\s,，、￥¥^]*u/i.test(content)) {
    return true;
  }
  return false;
}

function isObfuscatedSpamLine(line) {
  const content = line.replace(/^[\s　]+/, '').trim();
  if (!content) return false;

  if (isSuduguSpamLine(line)) return true;

  if (isBracketDeqixsLine(content)) return true;

  if (STANDALONE_SPAM_LINES.includes(content)) return true;

  if (content.includes('看本书') && /[\?\.]/.test(content)) return true;

  if (/^章节[\?\.mM\d]+$/.test(content)) return true;
  if (/^[\?\.mM\d]+提供最快$/.test(content)) return true;

  if (/101\s*看书网/.test(content)) return true;
  if (/必应搜索：速\s*读\s*谷/.test(content)) return true;
  if (/超(顺畅|赞|给力|实用|省心|靠谱)/.test(content) && /[\?]/.test(content)) return true;

  const hasSpamPhrase = OBFUSCATED_SPAM_PHRASES.some((phrase) => content.includes(phrase));
  if (hasSpamPhrase && /[\?]/.test(content)) return true;
  if (hasSpamPhrase && /101/.test(content)) return true;

  if (/^[,，]?[\?\.mM\d]+$/.test(content)) return true;
  if (/^[,，]?[\?\.mM\d]{1,30}$/.test(content)) return true;
  if (/^【.*】$/.test(content) && /[\?]/.test(content)) return true;

  return false;
}

function isSpamLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (isSourceShareLine(trimmed)) return false;
  if (isMinyuanSpamLine(line)) return true;
  if (isQidian2SpamLine(line)) return true;
  if (isHashOrPhpErrorSpamLine(line)) return true;
  if (isMiaojiSpamLine(line)) return true;
  if (isDeqiShoudaSpamLine(line)) return true;
  if (isBingSpamLine(line)) return true;
  if (isDeqiBracketSpamLine(line)) return true;
  if (isOrgDomainLine(line)) return true;
  if (isBracketSpamLine(trimmed)) return true;
  if (isObfuscatedSpamLine(line)) return true;
  return SPAM_LINE_PATTERNS.some((pattern) => pattern.test(trimmed));
}

function cleanHtmlEntitySpam(line) {
  if (!line.includes('&#')) return line;
  let result = line.replace(/&#.*$/g, '');
  for (const pattern of HTML_ENTITY_SPAM_TAIL_PATTERNS) {
    result = result.replace(pattern, '');
  }
  return result;
}

function cleanInlineSpam(line) {
  let result = cleanHtmlEntitySpam(line);
  for (const pattern of INLINE_SPAM_PATTERNS) {
    result = result.replace(pattern, '');
  }
  result = result.replace(MIAOJI_INLINE_PATTERN, '');
  for (const pattern of DEQI_SHOUDA_INLINE_PATTERNS) {
    result = result.replace(pattern, '');
  }
  // 移除行尾注入的 ?? 水印残留
  result = result.replace(/\s+\?\?\s*$/g, '');
  // 移除行内孤立的 ?? 片段（前后为中文）
  result = result.replace(/([\u4e00-\u9fff])\?\?([\u4e00-\u9fff])/g, '$1$2');
  return result;
}

function cleanBookText(content) {
  let normalized = replaceSuduguWithShuwei(
    content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  );
  normalized = removeQidian2PhpErrorBlocks(normalized);
  const lines = normalized.split('\n');
  const cleaned = [];
  let inPhpErrorBlock = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!inPhpErrorBlock && trimmed === '错误位置') {
      inPhpErrorBlock = true;
      continue;
    }
    if (inPhpErrorBlock) {
      if (/^#\d+\s*\{main\}\s*$/.test(trimmed)) {
        inPhpErrorBlock = false;
      }
      continue;
    }

    if (isSourceShareLine(trimmed)) {
      cleaned.push(SOURCE_SHARE_LINE);
      continue;
    }

    const nextLine = cleanInlineSpam(line);
    if (isSpamLine(nextLine)) continue;
    if (isOrgDomainLine(nextLine)) continue;
    if (nextLine.trim() === '' && line.trim() !== '') continue;
    cleaned.push(nextLine);
  }

  return removeVerticalWatermarks(cleaned).join('\n').replace(/\n{4,}/g, '\n\n\n').trimEnd() + '\n';
}

function cleanFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`  - 跳过（不存在）: ${filePath}`);
    return 0;
  }

  const original = readTextFile(filePath);
  const cleaned = applyBookShareWatermarks(cleanBookText(original));
  if (cleaned === original) {
    console.log(`  - 无需清理: ${filePath}`);
    return 0;
  }

  fs.writeFileSync(filePath, cleaned, 'utf-8');
  const removed = original.length - cleaned.length;
  console.log(`  ✓ 已清理: ${filePath}（减少 ${removed} 字符）`);
  return removed;
}

function discoverBookTargets() {
  const { discoverBookTxtTargets } = require('./book-paths');
  return discoverBookTxtTargets(rootDir);
}

const rootDir = path.resolve(__dirname, '../..');
const targets = discoverBookTargets();

console.log('清理书籍 TXT 推广水印...');
let totalRemoved = 0;
for (const target of targets) {
  totalRemoved += cleanFile(target);
}
console.log(`完成，共减少 ${totalRemoved} 字符`);
