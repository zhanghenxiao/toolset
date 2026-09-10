const BLOCKED_UA = /headless|phantomjs|selenium|puppeteer|playwright|scrapy|httpclient|python-requests|curl\/|wget\/|go-http|java\/|libwww|bytespider|gptbot|claudebot|ccbot|ahrefsbot|semrushbot/i;

const RATE_LIMITS = {
  default: { windowMs: 10000, max: 100 },
  books: { windowMs: 10000, max: 50 },
  navigation: { windowMs: 60000, max: 40 },
  interaction: { windowMs: 5000, max: 30 },
};

const buckets = new Map();
let blocked = false;

export function isSiteBlocked() {
  return blocked;
}

export function checkRateLimit(bucket = 'default') {
  if (blocked) return false;

  const cfg = RATE_LIMITS[bucket] || RATE_LIMITS.default;
  const now = Date.now();
  let state = buckets.get(bucket);

  if (!state || now - state.start > cfg.windowMs) {
    state = { start: now, count: 0 };
    buckets.set(bucket, state);
  }

  state.count += 1;
  if (state.count > cfg.max) {
    triggerBlock('访问过于频繁，请稍后再试');
    return false;
  }

  return true;
}

function triggerBlock(message) {
  if (blocked) return;
  blocked = true;
  showBlockOverlay(message);
}

function showBlockOverlay(message) {
  if (document.getElementById('site-guard-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'site-guard-overlay';
  overlay.setAttribute('role', 'alert');
  overlay.innerHTML = `
    <div class="site-guard-panel">
      <h2>访问受限</h2>
      <p>${message}</p>
      <button type="button" id="site-guard-retry">刷新页面</button>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    #site-guard-overlay {
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: rgba(15, 23, 42, 0.72);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .site-guard-panel {
      max-width: 420px;
      background: #fff;
      border-radius: 12px;
      padding: 28px 24px;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    }
    .site-guard-panel h2 {
      margin: 0 0 12px;
      font-size: 1.25rem;
      color: #111;
    }
    .site-guard-panel p {
      margin: 0 0 20px;
      color: #555;
      line-height: 1.6;
    }
    #site-guard-retry {
      border: none;
      background: #1a73e8;
      color: #fff;
      padding: 10px 18px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(overlay);
  document.getElementById('site-guard-retry')?.addEventListener('click', () => {
    window.location.reload();
  });
}

function detectAutomation() {
  const ua = navigator.userAgent || '';

  return !!(
    navigator.webdriver
    || window._phantom
    || window.__nightmare
    || window.callPhantom
    || window.domAutomation
    || window.domAutomationController
    || BLOCKED_UA.test(ua)
  );
}

function preventIframeEmbedding() {
  try {
    if (window.self !== window.top) {
      window.top.location = window.self.location.href;
    }
  } catch {
    triggerBlock('不允许通过 iframe 嵌入访问');
  }
}

function setupHoneypot() {
  const trap = document.createElement('a');
  trap.href = '/__data-export-all-books.csv';
  trap.textContent = 'export';
  trap.className = 'site-guard-honeypot';
  trap.tabIndex = -1;
  trap.setAttribute('aria-hidden', 'true');
  trap.addEventListener('click', (event) => {
    event.preventDefault();
    triggerBlock('检测到异常抓取行为');
  });
  document.body.appendChild(trap);

  const style = document.createElement('style');
  style.textContent = `
    .site-guard-honeypot {
      position: absolute;
      left: -9999px;
      top: -9999px;
      width: 1px;
      height: 1px;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);
}

function setupInteractionGuard() {
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) checkRateLimit('interaction');
  });
}

export function initSiteGuard() {
  if (import.meta.env.DEV) return;

  preventIframeEmbedding();
  setupHoneypot();
  setupInteractionGuard();

  if (detectAutomation()) {
    triggerBlock('检测到自动化访问，请使用正常浏览器访问');
  }
}
