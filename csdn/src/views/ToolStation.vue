<template>
    <div class="tool-station-page">
        <div class="container">
            <!-- Page Hero Header -->
            <div class="page-hero">
                <div class="hero-icon">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor"
                        stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
                    </svg>
                </div>
                <div>
                    <h1 class="hero-title">{{ isZh ? '工具站' : 'Tool Station' }}</h1>
                    <p class="hero-sub">{{ isZh ? '开发者效率工具集合' : 'Developer Productivity Toolkit' }}</p>
                </div>
            </div>

            <!-- Timestamp Converter Section -->
            <section class="tool-section">
                <div class="section-header">
                    <div class="section-title-group">
                        <div class="section-icon">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <circle cx="12" cy="12" r="9" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 3" />
                            </svg>
                        </div>
                        <h2>{{ isZh ? '时间戳转换工具' : 'Timestamp Converter' }}</h2>
                    </div>
                    <p class="section-desc">{{ description }}</p>
                </div>

                <div class="converter-body">
                    <!-- Live Timestamp -->
                    <div class="live-ts-bar">
                        <div class="live-badge">
                            <span class="live-dot"></span>
                            {{ isZh ? 'LIVE' : 'LIVE' }}
                        </div>
                        <div class="live-ts-value">{{ currentTs }}</div>
                        <div class="live-actions">
                            <button class="btn-icon" @click="toggleTimer"
                                :title="timer ? (isZh ? '暂停' : 'Pause') : (isZh ? '继续' : 'Resume')">
                                <svg v-if="timer" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                </svg>
                                <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </button>
                            <button class="btn-copy" @click="copy(currentTs)">
                                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </svg>
                                {{ isZh ? '复制' : 'Copy' }}
                            </button>
                        </div>
                    </div>

                    <!-- Converter Grid -->
                    <div class="converter-grid">
                        <div class="input-group">
                            <label class="input-label">
                                <span class="label-tag">Unix</span>
                                {{ isZh ? '时间戳 (s 或 ms)' : 'Timestamp (s or ms)' }}
                            </label>
                            <div class="input-row">
                                <input class="code-input" type="text" v-model="inputTs" placeholder="1712110000" />
                                <button class="btn-primary" @click="toTime">
                                    {{ isZh ? '→ 日期' : '→ Date' }}
                                </button>
                            </div>
                        </div>
                        <div class="input-group">
                            <label class="input-label">
                                <span class="label-tag">ISO</span>
                                {{ isZh ? '日期时间' : 'Datetime' }}
                            </label>
                            <div class="input-row">
                                <input class="code-input" type="text" v-model="inputDate"
                                    placeholder="2024-04-03 10:00:00" />
                                <button class="btn-primary" @click="toTs">
                                    {{ isZh ? '→ 戳' : '→ Ts' }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Result -->
                    <transition name="slide-fade">
                        <div v-if="convertResult" class="result-box">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                            <span class="result-label">{{ isZh ? '结果' : 'Result' }}</span>
                            <span class="result-value">{{ convertResult }}</span>
                            <button class="btn-copy-sm" @click="copy(convertResult)">
                                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </svg>
                            </button>
                        </div>
                    </transition>
                </div>
            </section>

            <!-- Video Cutter Section -->
            <section class="tool-section video-cutter-section">
                <VideoCutter />
            </section>
        </div>
    </div>
</template>

<script>
import { aiToolsGroups } from '../data/toolsData';
import VideoCutter from '../components/VideoCutter.vue';

export default {
    name: 'ToolStation',
    components: {
        VideoCutter
    },
    data() {
        return {
            currentTs: Math.floor(Date.now() / 1000),
            timer: null,
            inputTs: '',
            inputDate: '',
            convertResult: '',
            aiToolsGroups,
            activeCategory: aiToolsGroups[0].category
        };
    },
    computed: {
        isZh() {
            return this.$i18n.locale === 'zh';
        },
        currentGroup() {
            return this.aiToolsGroups.find(g => g.category === this.activeCategory);
        },
        description() {
            return this.isZh
                ? '快速在 Unix 时间戳和人类可读时间之间进行准确转换。'
                : 'Quickly convert between Unix timestamps and human-readable time.';
        }
    },
    mounted() {
        this.startTimer();
    },
    beforeDestroy() {
        this.stopTimer();
    },
    methods: {
        startTimer() {
            this.timer = setInterval(() => {
                this.currentTs = Math.floor(Date.now() / 1000);
            }, 1000);
        },
        stopTimer() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        },
        toggleTimer() {
            if (this.timer) this.stopTimer();
            else this.startTimer();
        },
        copy(text) {
            navigator.clipboard.writeText(String(text)).then(() => {
                const el = document.createElement('div');
                el.className = 'toast-msg';
                el.textContent = this.isZh ? '✓ 已复制' : '✓ Copied';
                document.body.appendChild(el);
                setTimeout(() => el.remove(), 2000);
            });
        },
        toTime() {
            if (!this.inputTs) return;
            let ts = parseInt(this.inputTs);
            if (this.inputTs.length === 10) ts *= 1000;
            const date = new Date(ts);
            this.convertResult = date.toLocaleString();
        },
        toTs() {
            if (!this.inputDate) return;
            const date = new Date(this.inputDate);
            if (isNaN(date.getTime())) {
                this.convertResult = this.isZh ? '无效的日期格式' : 'Invalid date format';
                return;
            }
            this.convertResult = Math.floor(date.getTime() / 1000).toString();
        },
        handleImgError(e) {
            e.target.src = '/favicon-default.png';
        }
    }
};
</script>

<style scoped>
/* ========== Page Layout ========== */
.tool-station-page {
    padding-top: 40px;
    padding-bottom: 80px;
    background: var(--bg-color);
    min-height: calc(100vh - var(--header-height));
}

/* ========== Page Hero ========== */
.page-hero {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 36px;
    padding: 0 4px;
}

.hero-icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: linear-gradient(135deg, #312E81 0%, #1E1B4B 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #818CF8;
    flex-shrink: 0;
    box-shadow: 0 4px 16px rgba(99, 102, 241, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.hero-title {
    font-size: 1.75rem;
    font-weight: 800;
    margin: 0 0 4px;
    color: var(--text-main);
    letter-spacing: -0.02em;
    line-height: 1.2;
}

.hero-sub {
    font-size: 0.875rem;
    color: var(--text-muted);
    margin: 0;
    font-weight: 400;
}

/* ========== Section Card ========== */
.tool-section {
    background: var(--card-bg);
    border-radius: 18px;
    padding: 32px;
    margin-bottom: 32px;
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow);
    position: relative;
    overflow: hidden;
}

.tool-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #6366F1 0%, #4F46E5 50%, transparent 100%);
    border-radius: 18px 18px 0 0;
}

/* ========== Section Header ========== */
.section-header {
    margin-bottom: 28px;
}

.section-title-group {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
}

.section-icon {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    background: rgba(99, 102, 241, 0.12);
    border: 1px solid rgba(99, 102, 241, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #818CF8;
    flex-shrink: 0;
}

.section-header h2 {
    font-size: 1.2rem;
    font-weight: 700;
    margin: 0;
    color: var(--text-main);
    letter-spacing: -0.01em;
}

.section-desc {
    color: var(--text-muted);
    font-size: 0.875rem;
    margin: 0;
    padding-left: 44px;
}

/* ========== Converter Body ========== */
.converter-body {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* Live Timestamp Bar */
.live-ts-bar {
    display: flex;
    align-items: center;
    gap: 14px;
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.4) 100%);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: 12px;
    padding: 14px 18px;
    font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
}

.live-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(99, 102, 241, 0.12);
    border: 1px solid rgba(99, 102, 241, 0.3);
    border-radius: 6px;
    padding: 3px 8px;
    font-size: 11px;
    font-weight: 700;
    color: #818CF8;
    letter-spacing: 0.08em;
    white-space: nowrap;
    font-family: inherit;
}

.live-dot {
    width: 7px;
    height: 7px;
    background: #818CF8;
    border-radius: 50%;
    animation: pulse-dot 1.4s ease-in-out infinite;
    flex-shrink: 0;
}

@keyframes pulse-dot {

    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }

    50% {
        opacity: 0.4;
        transform: scale(0.8);
    }
}

.live-ts-value {
    flex: 1;
    font-size: 1.35rem;
    font-weight: 600;
    color: #F8FAFC;
    letter-spacing: 0.04em;
}

.live-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
}

/* ========== Input Group ========== */
.converter-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.input-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-muted);
}

.label-tag {
    font-size: 10px;
    font-weight: 700;
    background: rgba(99, 102, 241, 0.12);
    color: #818CF8;
    border: 1px solid rgba(99, 102, 241, 0.25);
    border-radius: 4px;
    padding: 1px 6px;
    letter-spacing: 0.05em;
    font-family: monospace;
}

.input-row {
    display: flex;
    gap: 8px;
}

.code-input {
    flex: 1;
    padding: 11px 14px;
    border-radius: 9px;
    border: 1px solid var(--border-color);
    background: var(--bg-color);
    color: var(--text-main);
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.9rem;
    transition: border-color 0.2s, box-shadow 0.2s;
    min-width: 0;
}

.code-input::placeholder {
    color: var(--text-muted);
    opacity: 0.5;
}

.code-input:focus {
    outline: none;
    border-color: #6366F1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

/* ========== Buttons ========== */
.btn-primary {
    padding: 11px 18px;
    border-radius: 9px;
    background: #6366F1;
    color: #FFFFFF;
    border: none;
    font-weight: 700;
    font-size: 0.85rem;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
    white-space: nowrap;
    letter-spacing: 0.01em;
}

.btn-primary:hover {
    background: #4F46E5;
    box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
}

.btn-primary:active {
    transform: scale(0.97);
}

.btn-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #94A3B8;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
}

.btn-icon:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #F8FAFC;
    border-color: rgba(255, 255, 255, 0.2);
}

.btn-copy {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #94A3B8;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
}

.btn-copy:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #F8FAFC;
    border-color: rgba(255, 255, 255, 0.2);
}

.btn-copy-sm {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(99, 102, 241, 0.1);
    border: 1px solid rgba(99, 102, 241, 0.2);
    color: #818CF8;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
}

.btn-copy-sm:hover {
    background: rgba(99, 102, 241, 0.2);
}

/* ========== Result Box ========== */
.result-box {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    background: rgba(99, 102, 241, 0.07);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: 10px;
    color: #818CF8;
}

.result-label {
    color: #64748B;
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
}

.result-value {
    flex: 1;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.95rem;
    font-weight: 700;
    color: #A5B4FC;
    word-break: break-all;
}

/* Slide Fade Transition */
.slide-fade-enter-active {
    transition: all 0.25s ease;
}

.slide-fade-enter-from {
    opacity: 0;
    transform: translateY(-8px);
}

/* ========== Toast ========== */
:global(.toast-msg) {
    position: fixed;
    bottom: 32px;
    right: 32px;
    background: #6366F1;
    color: #FFFFFF;
    padding: 10px 20px;
    border-radius: 10px;
    font-weight: 700;
    font-size: 14px;
    z-index: 9999;
    box-shadow: 0 8px 32px rgba(99, 102, 241, 0.4);
    animation: toast-in 0.25s ease;
}

@keyframes toast-in {
    from {
        opacity: 0;
        transform: translateY(12px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Video Cutter Section */
.video-cutter-section::before {
    background: linear-gradient(90deg, #3B82F6 0%, #2563EB 50%, transparent 100%);
}

/* ========== Responsive ========== */
@media (max-width: 768px) {
    .converter-grid {
        grid-template-columns: 1fr;
    }

    .live-ts-bar {
        flex-wrap: wrap;
        gap: 10px;
    }

    .live-ts-value {
        font-size: 1.1rem;
        width: 100%;
        order: 2;
    }

    .live-badge {
        order: 1;
    }

    .live-actions {
        order: 3;
        width: 100%;
        justify-content: flex-end;
    }

    .tool-section {
        padding: 22px;
    }

    .page-hero {
        margin-bottom: 24px;
    }
}

@media (max-width: 480px) {
    .input-row {
        flex-direction: column;
    }

    .btn-primary {
        width: 100%;
        padding: 12px;
    }

    .section-desc {
        padding-left: 0;
    }
}
</style>
