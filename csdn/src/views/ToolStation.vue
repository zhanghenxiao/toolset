<template>
    <div class="tool-station-page">
        <div class="container">
            <!-- Timestamp Converter Section -->
            <section class="tool-section timestamp-converter">
                <div class="section-header">
                    <h2>{{ isZh ? '时间戳转换工具' : 'Timestamp Converter' }}</h2>
                    <p class="section-desc">{{ description }}</p>
                </div>

                <div class="converter-card">
                    <div class="current-box">
                        <div class="input-field">
                            <label>{{ isZh ? '当前时间戳 (秒)' : 'Current Timestamp (s)' }}</label>
                            <div class="input-with-action">
                                <input type="text" v-model="currentTs" readonly />
                                <button class="btn-icon" @click="toggleTimer">
                                    <svg v-if="timer" viewBox="0 0 24 24" width="20" height="20">
                                        <path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                    </svg>
                                    <svg v-else viewBox="0 0 24 24" width="20" height="20">
                                        <path fill="currentColor" d="M8 5v14l11-7z" />
                                    </svg>
                                </button>
                                <button class="btn-text" @click="copy(currentTs)">{{ isZh ? '复制' : 'Copy' }}</button>
                            </div>
                        </div>
                    </div>

                    <div class="converter-grid">
                        <div class="input-field">
                            <label>Unix 时间戳 (s/ms)</label>
                            <div class="input-with-action">
                                <input type="text" v-model="inputTs" placeholder="1712110000" />
                                <button class="btn-primary" @click="toTime">{{ isZh ? '转换为日期' : 'To Date' }}</button>
                            </div>
                        </div>
                        <div class="input-field">
                            <label>{{ isZh ? '日期时间' : 'Datetime' }}</label>
                            <div class="input-with-action">
                                <input type="text" v-model="inputDate" placeholder="2024-04-03 10:00:00" />
                                <button class="btn-primary" @click="toTs">{{ isZh ? '转换为时间戳' : 'To Timestamp'
                                    }}</button>
                            </div>
                        </div>
                    </div>

                    <div v-if="convertResult" class="result-box">
                        <span class="label">{{ isZh ? '转换结果：' : 'Result:' }}</span>
                        <span class="value">{{ convertResult }}</span>
                    </div>
                </div>
            </section>

            <!-- AI Tools Navigation Section -->
            <section class="tool-section ai-nav-section">
                <div class="ai-layout">
                    <aside class="ai-sidebar">
                        <div class="sidebar-title">
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path fill="currentColor"
                                    d="M4 10h12v2H4zm0-4h12v2H4zm0 8h8v2H4zm15-4.59L17.41 7 16 8.41l1.59 1.59L16 11.59 17.41 13 19 11.41l1.59 1.59L22 11.59l-1.59-1.59L22 8.41 20.59 7z" />
                            </svg>
                            <span>AI {{ isZh ? '导航' : 'Nav' }}</span>
                        </div>
                        <nav class="sidebar-list">
                            <button v-for="group in aiToolsGroups" :key="group.category" class="sidebar-item"
                                :class="{ active: activeCategory === group.category }"
                                @click="activeCategory = group.category">
                                <span class="icon">{{ group.icon }}</span>
                                <span class="text">{{ group.category }}</span>
                            </button>
                        </nav>
                    </aside>

                    <main class="ai-main">
                        <div v-if="currentGroup" class="category-block">
                            <div class="cat-header">
                                <h3>{{ currentGroup.icon }} {{ currentGroup.category }}</h3>
                                <span class="count">{{ currentGroup.tools.length }}</span>
                            </div>
                            <div class="tools-grid">
                                <a v-for="tool in currentGroup.tools" :key="tool.name" :href="tool.url" target="_blank"
                                    class="tool-card">
                                    <div class="tool-icon">
                                        <img :src="tool.icon" :alt="tool.name" @error="handleImgError" />
                                    </div>
                                    <div class="tool-info">
                                        <h4>{{ tool.name }}</h4>
                                        <p>{{ tool.desc }}</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </main>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import { aiToolsGroups } from '../data/toolsData';

export default {
    name: 'ToolStation',
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
            navigator.clipboard.writeText(text).then(() => {
                alert(this.isZh ? '已复制到剪贴板' : 'Copied to clipboard');
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
            e.target.src = 'https://api.iowen.cn/favicon/default.png';
        }
    }
};
</script>

<style scoped>
.tool-station-page {
    padding-top: 40px;
    padding-bottom: 80px;
    background: var(--bg-color);
    min-height: calc(100vh - var(--header-height));
}

.tool-section {
    background: var(--card-bg);
    border-radius: 16px;
    padding: 32px;
    margin-bottom: 40px;
    box-shadow: var(--shadow);
    border: 1px solid var(--border-color);
}

.section-header {
    margin-bottom: 30px;
}

.section-header h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 8px;
    color: var(--text-main);
}

.section-desc {
    color: var(--text-muted);
    font-size: 0.95rem;
}

/* Converter Styles */
.converter-card {
    background: rgba(0, 0, 0, 0.02);
    padding: 24px;
    border-radius: 12px;
}

.input-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;
}

.input-field label {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-muted);
}

.input-with-action {
    display: flex;
    gap: 10px;
}

.input-with-action input {
    flex: 1;
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    background: var(--bg-color);
    color: var(--text-main);
    font-family: monospace;
}

.converter-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
}

.result-box {
    margin-top: 10px;
    padding: 16px;
    background: rgba(26, 115, 232, 0.05);
    border-radius: 8px;
    display: flex;
    gap: 10px;
}

.result-box .label {
    color: var(--text-muted);
}

.result-box .value {
    color: var(--primary-color);
    font-weight: 700;
}

/* AI Nav Styles */
.ai-layout {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 32px;
}

.ai-sidebar {
    border-right: 1px solid var(--border-color);
    padding-right: 20px;
}

.sidebar-title {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 12px 20px;
    font-weight: 700;
    color: var(--text-main);
}

.sidebar-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    background: transparent;
    border: none;
    color: var(--text-main);
}

.sidebar-item:hover {
    background: var(--dropdown-hover);
}

.sidebar-item.active {
    background: var(--primary-color);
    color: white;
}

.cat-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
}

.cat-header h3 {
    font-size: 1.2rem;
    margin: 0;
}

.cat-header .count {
    background: var(--dropdown-hover);
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 12px;
    color: var(--text-muted);
}

.tools-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
}

.tool-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border-radius: 12px;
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    text-decoration: none;
    transition: all 0.3s;
}

.tool-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-hover);
    border-color: var(--primary-color);
}

.tool-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    overflow: hidden;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
}

.tool-icon img {
    width: 24px;
    height: 24px;
}

.tool-info h4 {
    margin: 0 0 4px;
    font-size: 14px;
    color: var(--text-main);
}

.tool-info p {
    margin: 0;
    font-size: 12px;
    color: var(--text-muted);
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Buttons */
.btn-icon {
    width: 44px;
    height: 44px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    color: var(--text-main);
    cursor: pointer;
}

.btn-text {
    padding: 0 20px;
    border-radius: 8px;
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    color: var(--text-main);
    font-weight: 600;
    cursor: pointer;
}

.btn-primary {
    padding: 0 20px;
    border-radius: 8px;
    background: var(--primary-color);
    color: white;
    border: none;
    font-weight: 600;
    cursor: pointer;
}

@media (max-width: 768px) {
    .converter-grid {
        grid-template-columns: 1fr;
    }

    .ai-layout {
        grid-template-columns: 1fr;
    }

    .ai-sidebar {
        border: none;
        padding: 0;
    }

    .sidebar-list {
        display: flex;
        overflow-x: auto;
        padding-bottom: 10px;
        gap: 10px;
    }

    .sidebar-item {
        white-space: nowrap;
        width: auto;
    }
}
</style>
