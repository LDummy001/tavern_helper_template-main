<template>
  <div class="fold-bar">
    <div class="fold-bar-header">
      <button class="fold-bar-btn" @click="toggle">
        <span>{{ title }}</span>
        <div class="fold-bar-title-actions">
          <slot name="title-actions"></slot>
        </div>
        <div class="fold-bar-toggle-icon" :class="{ open: isOpen }"></div>
      </button>
      <div class="fold-bar-header-actions">
        <slot name="header-actions"></slot>
      </div>
    </div>
    <div ref="contentRef" class="fold-bar-content" :class="{ open: isOpen }">
      <div class="fold-bar-content-text">
        <slot></slot>
      </div>
      <div class="fold-bar-footer-toggle" @click="toggle">▲ 收起 ▲</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  isOpen: boolean;
}

interface Emits {
  (e: 'toggle', value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isOpen = ref(props.isOpen);
const contentRef = ref<HTMLElement>();

const toggle = () => {
  if (!contentRef.value) return;

  if (isOpen.value) {
    // 收起
    isOpen.value = false;
    contentRef.value.style.maxHeight = '0';
  } else {
    // 展開 - 動態計算實際高度
    isOpen.value = true;
    // 使用 setTimeout 確保 DOM 更新完成後再計算高度
    setTimeout(() => {
      if (contentRef.value) {
        const scrollHeight = contentRef.value.scrollHeight;
        const maxHeight = window.innerHeight * 0.8; // 80vh
        const height = Math.min(scrollHeight, maxHeight);
        contentRef.value.style.maxHeight = height + 'px';
      }
    }, 0);
  }

  emit('toggle', isOpen.value);
};

// 監聽props變化
watch(
  () => props.isOpen,
  (new_val: boolean) => {
    if (new_val !== isOpen.value) {
      // 同步外部狀態變化
      if (contentRef.value) {
        if (new_val) {
          // 使用 setTimeout 確保 DOM 更新完成後再計算高度
          setTimeout(() => {
            if (contentRef.value) {
              const scrollHeight = contentRef.value.scrollHeight;
              const maxHeight = window.innerHeight * 0.8; // 80vh
              const height = Math.min(scrollHeight, maxHeight);
              contentRef.value.style.maxHeight = height + 'px';
            }
          }, 0);
        } else {
          contentRef.value.style.maxHeight = '0';
        }
      }
      isOpen.value = new_val;
    }
  },
);
</script>

<style lang="scss" scoped>
.fold-bar {
  background: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none;
  font-size: 14px;
  font-weight: 500;
  color: #e0e0e0;
  padding: 0;
  margin: 0;
}

.fold-bar-header {
  margin-bottom: 0;
  padding-bottom: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
}

.fold-bar-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
}

.fold-bar-btn {
  cursor: pointer;
  display: flex;
  align-items: center;
  background: #333333;
  border: 1px solid #404040;
  border-bottom: none;
  flex: 1;
  text-align: left;
  color: #e0e0e0;
  font-size: 14px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 0;
}

.fold-bar-title-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  margin-right: 8px;
}

.fold-bar-btn:hover {
  background: #404040;
}

.fold-bar-btn:focus {
  outline: none;
}

.fold-bar-toggle-icon {
  margin-left: 8px;
  flex-shrink: 0;
  font-size: 12px;
  color: #b0b0b0;
  transition: transform 0.3s ease;

  &::before {
    content: '▼';
  }

  &.open {
    transform: rotate(180deg);
  }
}

.fold-bar-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  background: #1a1a1a;
  border: 1px solid #404040;
  border-top: none;
  padding: 0;
}

.fold-bar-content.open {
  overflow-y: auto;

  /* 隱藏滾動條 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, and Opera */
  }
}

.fold-bar-content-text {
  padding: 0 12px;
}

.fold-bar-footer-toggle {
  text-align: center;
  color: #888;
  font-size: 12px;
  cursor: pointer;
  margin-top: 8px;
  padding: 8px 12px;
  border-top: 1px solid #404040;
  background: #333333;
}

.fold-bar-footer-toggle:hover {
  color: #b0b0b0;
  background: #404040;
}

@media (max-width: 768px) {
  .fold-bar-btn {
    font-size: 12px;
  }

  .fold-bar-footer-toggle {
    font-size: 11px;
  }
}
</style>
