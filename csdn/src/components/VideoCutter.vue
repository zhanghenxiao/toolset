<template>
    <div class="video-cutter-tool">
        <div class="tool-header">
            <h3>{{ isZh ? `视频剪切工具` : `Video Cutter` }}</h3>
            <p>{{ isZh ? `通过可视化界面轻松剪切视频并生成 FFmpeg 命令。` : `Easily cut videos and generate FFmpeg commands with a visual
                interface.` }}</p>
        </div>

        <!-- SharedArrayBuffer Warning -->
        <div v-if="!supportsWasm" class="warning-banner">
            <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor"
                    d="M12 2L1 21h22L12 2zm0 3.45L19.53 19H4.47L12 5.45zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z" />
            </svg>
            <span>{{ isZh ? `您的浏览器尚未启用共享内存支持。请确保已重启开发服务器（npm run dev），并使用最新版 Chrome/Edge 访问。` : `SharedArrayBuffer is
                not enabled. Please restart dev server (npm run dev) and use latest Chrome/Edge.` }}</span>
        </div>

        <div class="tool-container">
            <!-- File Secret Input -->
            <div v-if="!videoSrc" class="upload-zone" @click="$refs.fileInput.click()">
                <div class="upload-icon">
                    <svg viewBox="0 0 24 24" width="48" height="48">
                        <path fill="currentColor"
                            d="M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zM7 9l1.41 1.41L11 7.83V16h2V7.83l2.59 2.58L17 9l-5-5-5 5z" />
                    </svg>
                </div>
                <p>{{ isZh ? `点击或拖拽视频文件到此处进行预览` : `Click or drag video file here to preview` }}</p>
                <input type="file" ref="fileInput" accept="video/*" hidden @change="handleFileChange" />
            </div>

            <div v-else class="editor-layout">
                <!-- Video Preview -->
                <div class="preview-section">
                    <video ref="videoPlayer" :src="videoSrc" controls @loadedmetadata="onVideoLoaded"
                        @timeupdate="onTimeUpdate"></video>

                    <!-- Range Slider -->
                    <div class="range-controls">
                        <div class="range-inputs">
                            <div class="input-group">
                                <label>{{ isZh ? `开始时间 (秒)` : `Start Time (s)` }}</label>
                                <input type="number" v-model.number="startTime" min="0" :max="endTime" step="0.1"
                                    @input="updatePreview('start')" />
                            </div>
                            <div class="input-group">
                                <label>{{ isZh ? `结束时间 (秒)` : `End Time (s)` }}</label>
                                <input type="number" v-model.number="endTime" :min="startTime" :max="duration"
                                    step="0.1" @input="updatePreview('end')" />
                            </div>
                            <div class="input-group duration-info">
                                <label>{{ isZh ? `持续时间` : `Duration` }}</label>
                                <div class="value">{{ cutDuration.toFixed(2) }}s</div>
                            </div>
                        </div>

                        <div class="quick-actions">
                            <button class="btn-outline" @click="setCurrentTime('start')">{{ isZh ? `设为开始点` : `Set as
                                Start` }}</button>
                            <button class="btn-outline" @click="setCurrentTime('end')">{{ isZh ? `设为结束点` : `Set as End`
                                }}</button>
                            <button class="btn-primary" :disabled="isProcessing || !supportsWasm || !videoFile"
                                @click="cutAndDownload">
                                <span v-if="isProcessing">
                                    <template v-if="loadingStatus === 'processing'">{{ isZh ? `处理中 ` + progress + `%` :
                                        `Processing ` + progress + `%` }}</template>
                                    <template v-else>{{ loadingStatusText }}</template>
                                </span>
                                <span v-else>{{ isZh ? `开始剪切并下载` : `Start Cut & Download` }}</span>
                            </button>
                            <button class="btn-danger" :disabled="isProcessing" @click="reset">{{ isZh ? `清除视频` : `Clear
                                Video` }}</button>
                        </div>
                    </div>
                </div>

                <!-- Command Generator -->
                <div class="command-section">
                    <h4>{{ isZh ? `生成的 FFmpeg 命令` : `Generated FFmpeg Command` }}</h4>
                    <div class="command-box">
                        <code>{{ ffmpegCommand }}</code>
                        <button class="btn-copy" @click="copyCommand">
                            {{ isZh ? `复制命令` : `Copy Command` }}
                        </button>
                    </div>
                    <div class="tips">
                        <p><strong>{{ isZh ? `提示：` : `Tip:` }}</strong></p>
                        <ul>
                            <li>{{ isZh ? `点击“开始剪切并下载”将直接在浏览器中处理，无需上传服务器。` : `Clicking "Start Cut & Download" will
                                process directly in your browser.` }}</li>
                            <li>{{ isZh ? `首次使用会加载约 30MB 的处理引擎，请耐心等待。` : `The processing engine (~30MB) will be loaded
                                on first use.` }}</li>
                            <li>{{ isZh ? `处理大视频可能需要较多内存和 CPU。` : `Processing large videos may require significant
                                memory and CPU.` }}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

let ffmpeg = null;

export default {
    name: 'VideoCutter',
    data() {
        return {
            videoSrc: '',
            videoFile: null,
            fileName: 'video.mp4',
            startTime: 0,
            endTime: 0,
            duration: 0,
            currentTime: 0,
            isProcessing: false,
            progress: 0,
            loadingStatus: 'idle' // 'idle', 'loading-engine', 'uploading', 'processing', 'saving'
        };
    },
    computed: {
        loadingStatusText() {
            const statusMap = {
                'loading-engine': this.isZh ? '正在加载引擎...' : 'Loading Engine...',
                'uploading': this.isZh ? '正在读取文件...' : 'Reading File...',
                'processing': this.isZh ? '正在处理...' : 'Processing...',
                'saving': this.isZh ? '正在保存...' : 'Saving...'
            };
            return statusMap[this.loadingStatus] || '';
        },
        isZh() {
            return this.$i18n.locale === 'zh';
        },
        cutDuration() {
            return Math.max(0, this.endTime - this.startTime);
        },
        supportsWasm() {
            return typeof WebAssembly !== 'undefined';
        },
        ffmpegCommand() {
            const outputName = `cut_${this.fileName}`;
            return `ffmpeg -i "${this.fileName}" -ss ${this.startTime.toFixed(2)} -t ${this.cutDuration.toFixed(2)} -c copy "${outputName}"`;
        }
    },
    methods: {
        handleFileChange(e) {
            const file = e.target.files[0];
            if (!file) return;
            this.videoFile = file;
            this.fileName = file.name;
            this.videoSrc = URL.createObjectURL(file);
        },
        onVideoLoaded() {
            const video = this.$refs.videoPlayer;
            this.duration = video.duration;
            this.endTime = video.duration;
        },
        onTimeUpdate() {
            this.currentTime = this.$refs.videoPlayer.currentTime;
        },
        updatePreview(type) {
            const video = this.$refs.videoPlayer;
            if (type === 'start') {
                video.currentTime = this.startTime;
            } else {
                video.currentTime = this.endTime;
            }
        },
        setCurrentTime(type) {
            if (type === 'start') {
                this.startTime = Number(this.currentTime.toFixed(2));
            } else {
                this.endTime = Number(this.currentTime.toFixed(2));
            }
        },
        async loadFFmpeg() {
            if (ffmpeg && ffmpeg.isLoaded()) return;

            console.log('[FFmpeg v0.11] Initializing single-threaded engine...');
            this.loadingStatus = 'loading-engine';

            // v0.11 API: createFFmpeg with corePath directly pointing to local file
            ffmpeg = createFFmpeg({
                corePath: '/ffmpeg-core-st.js',
                log: true,
                progress: ({ ratio }) => {
                    this.progress = Math.round(ratio * 100);
                }
            });

            try {
                console.log('[FFmpeg v0.11] Calling ffmpeg.load()...');
                await ffmpeg.load();
                console.log('[FFmpeg v0.11] Engine loaded successfully!');
            } catch (err) {
                console.error('[FFmpeg v0.11] Load failed:', err);
                const msg = (this.isZh ? '加载 FFmpeg 引擎失败：' : 'Failed to load FFmpeg: ') + err.message;
                throw new Error(msg);
            }
        },
        async cutAndDownload() {
            if (!this.videoFile) return;

            try {
                this.isProcessing = true;
                this.progress = 0;

                await this.loadFFmpeg();

                console.log('Starting cut process...');
                this.loadingStatus = 'uploading';

                const inputName = 'input_' + this.fileName.replace(/[^a-zA-Z0-9.]/g, '_');
                const outputName = `output_${Date.now()}.mp4`;

                // Write file to virtual FS using v0.11 API
                console.log(`Writing ${this.fileName} to virtual FS...`);
                ffmpeg.FS('writeFile', inputName, await fetchFile(this.videoFile));
                console.log('File written');

                // Execute command
                this.loadingStatus = 'processing';
                const args = [
                    '-ss', this.startTime.toFixed(2),
                    '-i', inputName,
                    '-t', this.cutDuration.toFixed(2),
                    '-c', 'copy',
                    outputName
                ];
                console.log(`Executing: ffmpeg ${args.join(' ')}`);

                try {
                    await ffmpeg.run(...args);
                    console.log('FFmpeg run completed');
                } catch (execError) {
                    console.error('FFmpeg run error:', execError);
                    throw new Error(this.isZh ? 'FFmpeg 执行失败，请检查视频格式。' : 'FFmpeg execution failed. Check video format.');
                }

                // Read result
                this.loadingStatus = 'saving';
                console.log(`Reading output: ${outputName}`);
                let data;
                try {
                    data = ffmpeg.FS('readFile', outputName);
                } catch (readError) {
                    console.error('Read error:', readError);
                    throw new Error(this.isZh ? '读取输出文件失败。' : 'Failed to read output file.');
                }

                const blob = new Blob([data.buffer], { type: 'video/mp4' });
                const url = URL.createObjectURL(blob);

                // Trigger download
                const a = document.createElement('a');
                a.href = url;
                a.download = `cut_${this.fileName}`;
                a.click();

                // Cleanup
                URL.revokeObjectURL(url);
                try {
                    ffmpeg.FS('unlink', inputName);
                    ffmpeg.FS('unlink', outputName);
                } catch (e) {
                    console.warn('Cleanup error:', e);
                }

                this.isProcessing = false;
                this.loadingStatus = 'idle';
                alert(this.isZh ? '剪切成功！' : 'Video cut successfully!');
            } catch (error) {
                console.error('Processing error:', error);
                alert((this.isZh ? '处理出错：' : 'Error: ') + error.message);
                this.isProcessing = false;
                this.loadingStatus = 'idle';
            }
        },
        reset() {
            this.videoSrc = '';
            this.videoFile = null;
            this.startTime = 0;
            this.endTime = 0;
            this.duration = 0;
        },
        copyCommand() {
            navigator.clipboard.writeText(this.ffmpegCommand).then(() => {
                alert(this.isZh ? '命令已复制' : 'Command copied');
            });
        }
    }
};
</script>

<style scoped>
.video-cutter-tool {
    padding: 10px 0;
}

.warning-banner {
    background: #fffbe6;
    border: 1px solid #ffe58f;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    color: #856404;
    font-size: 14px;
    line-height: 1.4;
}

.warning-banner svg {
    color: #faad14;
    flex-shrink: 0;
}

.tool-header {
    margin-bottom: 24px;
}

.tool-header h3 {
    font-size: 1.25rem;
    margin-bottom: 8px;
    color: var(--text-main);
}

.tool-header p {
    color: var(--text-muted);
    font-size: 0.9rem;
}

.upload-zone {
    border: 2px dashed var(--border-color);
    border-radius: 12px;
    padding: 60px 40px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    background: rgba(0, 0, 0, 0.01);
}

.upload-zone:hover {
    border-color: var(--primary-color);
    background: rgba(26, 115, 232, 0.05);
}

.upload-icon {
    color: var(--text-muted);
    margin-bottom: 16px;
}

.editor-layout {
    display: flex;
    flex-direction: column;
    gap: 32px;
}

.preview-section {
    background: #000;
    border-radius: 12px;
    overflow: hidden;
}

video {
    width: 100%;
    max-height: 500px;
    display: block;
}

.range-controls {
    background: var(--card-bg);
    padding: 24px;
    border-top: 1px solid var(--border-color);
}

.range-inputs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
}

.input-group label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
    margin-bottom: 6px;
}

.input-group input {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    background: var(--bg-color);
    color: var(--text-main);
    font-family: monospace;
}

.duration-info .value {
    padding: 10px;
    font-weight: 700;
    color: var(--primary-color);
}

.quick-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.btn-outline {
    padding: 8px 16px;
    border-radius: 6px;
    border: 1px solid var(--primary-color);
    color: var(--primary-color);
    font-weight: 600;
    font-size: 14px;
    transition: all 0.2s;
    cursor: pointer;
}

.btn-outline:hover {
    background: var(--primary-color);
    color: white;
}

.btn-danger {
    padding: 8px 16px;
    border-radius: 6px;
    background: #ea4335;
    color: white;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
}

.btn-primary {
    padding: 8px 20px;
    border-radius: 8px;
    background: var(--primary-color);
    color: white;
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-primary:hover {
    background: var(--primary-hover);
}

.btn-primary:disabled {
    background: var(--text-muted);
    cursor: not-allowed;
    opacity: 0.7;
}

.command-section h4 {
    margin-bottom: 16px;
    font-size: 1rem;
}

.command-box {
    background: #1e293b;
    color: #e2e8f0;
    padding: 20px;
    border-radius: 8px;
    position: relative;
    font-family: monospace;
    word-break: break-all;
    line-height: 1.5;
}

.btn-copy {
    position: absolute;
    top: 10px;
    right: 10px;
    background: var(--primary-color);
    color: white;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
}

.tips {
    margin-top: 16px;
    font-size: 13px;
    color: var(--text-muted);
}

.tips ul {
    margin-top: 8px;
    padding-left: 20px;
    list-style: disc;
}

@media (max-width: 600px) {
    .range-inputs {
        grid-template-columns: 1fr;
    }
}
</style>
