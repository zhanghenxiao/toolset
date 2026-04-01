<template>
    <div class="dropdown-filter" v-click-outside="close">
        <div class="dropdown-trigger" @click="toggle" :class="{ 'is-open': isOpen }">
            <div class="selected-area">
                <template v-if="value.length > 0">
                    <div v-if="showChips" class="chips">
                        <span v-for="val in value" :key="val" class="chip">
                            {{ val }}
                            <i class="close-icon" @click.stop="remove(val)">&times;</i>
                        </span>
                    </div>
                    <span v-else class="text-truncate">{{ value.join(', ') }}</span>
                </template>
                <span v-else class="placeholder">{{ placeholder }}</span>
            </div>
            <div class="arrow-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" :style="{ transform: isOpen ? 'rotate(180deg)' : '' }">
                    <path fill="currentColor" d="M7 10l5 5 5-5z" />
                </svg>
            </div>
        </div>

        <transition name="fade-slide">
            <div v-if="isOpen" class="dropdown-panel">
                <div class="search-box" v-if="searchable">
                    <svg viewBox="0 0 24 24" width="16" height="16" class="search-icon">
                        <path fill="currentColor"
                            d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                    </svg>
                    <input type="text" v-model="searchQuery" :placeholder="'搜索' + placeholder + '...'"
                        class="search-input" />
                    <i v-if="searchQuery" class="clear-icon" @click="searchQuery = ''">&times;</i>
                </div>

                <div class="options-list">
                    <label v-for="option in filteredOptions" :key="option" class="option-item">
                        <input type="checkbox" :value="option" v-model="internalValue" @change="updateValue" />
                        <span class="checkbox-custom"></span>
                        <span class="option-label">{{ option }}</span>
                    </label>
                    <div v-if="filteredOptions.length === 0" class="no-options">无匹配结果</div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'DropdownFilter',
    props: {
        placeholder: { type: String, default: '请选择' },
        options: { type: Array, required: true },
        value: { type: Array, default: () => [] },
        searchable: { type: Boolean, default: true },
        showChips: { type: Boolean, default: false }
    },
    data() {
        return {
            isOpen: false,
            searchQuery: '',
            internalValue: [...this.value]
        };
    },
    watch: {
        value(newVal) {
            this.internalValue = [...newVal];
        }
    },
    computed: {
        filteredOptions() {
            if (!this.searchQuery) return this.options;
            const q = this.searchQuery.toLowerCase();
            return this.options.filter(opt => opt.toLowerCase().includes(q));
        }
    },
    methods: {
        toggle() { this.isOpen = !this.isOpen; },
        close() { this.isOpen = false; },
        updateValue() { this.$emit('input', this.internalValue); },
        remove(val) {
            const idx = this.internalValue.indexOf(val);
            if (idx > -1) {
                this.internalValue.splice(idx, 1);
                this.updateValue();
            }
        }
    },
    directives: {
        'click-outside': {
            bind(el, binding, vnode) {
                el.clickOutsideEvent = function (event) {
                    if (!(el === event.target || el.contains(event.target))) {
                        vnode.context[binding.expression](event);
                    }
                };
                document.body.addEventListener('click', el.clickOutsideEvent);
            },
            unbind(el) {
                document.body.removeEventListener('click', el.clickOutsideEvent);
            },
        }
    }
};
</script>

<style scoped>
.dropdown-filter {
    position: relative;
    width: 100%;
    user-select: none;
}

.dropdown-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    min-height: 44px;
    background: white;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
}

.dropdown-trigger:hover,
.dropdown-trigger.is-open {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1);
}

.selected-area {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    flex: 1;
    min-width: 0;
}

.placeholder {
    color: var(--text-muted);
    font-size: 14px;
}

.text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    color: var(--text-main);
}

.chips {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}

.chip {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    background: var(--primary-color);
    color: white;
    border-radius: 4px;
    font-size: 12px;
}

.close-icon {
    cursor: pointer;
    font-style: normal;
    opacity: 0.8;
}

.close-icon:hover {
    opacity: 1;
}

.arrow-icon {
    color: var(--text-muted);
    display: flex;
    align-items: center;
    transition: all 0.3s;
}

.dropdown-panel {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(12px);
    border-radius: 12px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
    padding: 12px;
    z-index: 1000;
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.search-box {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: #f1f3f4;
    border-radius: 6px;
    margin-bottom: 8px;
}

.search-icon {
    color: var(--text-muted);
}

.search-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-size: 13px;
    color: var(--text-main);
}

.clear-icon {
    cursor: pointer;
    color: var(--text-muted);
}

.options-list {
    max-height: 200px;
    overflow-y: auto;
    padding-right: 4px;
}

.options-list::-webkit-scrollbar {
    width: 4px;
}

.options-list::-webkit-scrollbar-thumb {
    background: #e0e0e0;
    border-radius: 2px;
}

.option-item {
    display: flex;
    align-items: center;
    padding: 8px;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.2s;
}

.option-item:hover {
    background: #f8f9fa;
}

.option-item input {
    display: none;
}

.checkbox-custom {
    width: 18px;
    height: 18px;
    border: 2px solid var(--border-color);
    border-radius: 4px;
    margin-right: 12px;
    position: relative;
    transition: all 0.2s;
}

.option-item input:checked+.checkbox-custom {
    background: var(--primary-color);
    border-color: var(--primary-color);
}

.option-item input:checked+.checkbox-custom::after {
    content: '';
    position: absolute;
    left: 5px;
    top: 2px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

.option-label {
    font-size: 14px;
    color: var(--text-main);
}

.no-options {
    padding: 20px;
    text-align: center;
    color: var(--text-muted);
    font-size: 13px;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.3s ease;
}

.fade-slide-enter,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

[data-theme="dark"] .dropdown-trigger,
[data-theme="dark"] .dropdown-panel {
    background: var(--card-bg);
    border-color: var(--border-color);
}

[data-theme="dark"] .text-truncate,
[data-theme="dark"] .option-label {
    color: var(--text-main);
}

[data-theme="dark"] .search-box {
    background: rgba(255, 255, 255, 0.05);
}

[data-theme="dark"] .option-item:hover {
    background: rgba(255, 255, 255, 0.03);
}
</style>
