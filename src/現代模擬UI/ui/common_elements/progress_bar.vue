<template>
  <div class="progress-bar-container">
    <div class="progress-bar-label">{{ label }}</div>
    <div class="progress-bar-wrapper">
      <div class="progress-bar-fill" :style="{ width: `${percentage}%`, background: fillColor }"></div>
      <div class="progress-bar-value">{{ value }}{{ unit }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string;
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  color?: string;
  attributeType?: string;
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  unit: '',
  color: '#007acc',
  attributeType: '',
});

// 根據屬性類型和值動態決定顏色和範圍
const dynamicConfig = computed(() => {
  const { attributeType, value } = props;

  switch (attributeType) {
    case 'mood':
      if (value >= 0) {
        return { color: '#ffdd44', min: 0, max: 100, isReverse: false }; // 黃色，範圍 0~100
      } else {
        return { color: '#007acc', min: 0, max: 100, isReverse: false }; // 藍色，範圍 0~100
      }
    case 'horny':
      return { color: '#ff44aa', min: 0, max: 100, isReverse: false }; // 粉色，範圍 0~100
    case 'friendship':
      if (value >= 0) {
        return { color: '#44ff44', min: 0, max: 1000, isReverse: false }; // 綠色，範圍 0~1000
      } else {
        return { color: '#888888', min: 0, max: 1000, isReverse: false }; // 灰色，範圍 0~1000
      }
    case 'love':
      return { color: '#ff4444', min: 0, max: 1000, isReverse: false }; // 紅色，範圍 0~1000
    default:
      return { color: props.color, min: props.min, max: props.max, isReverse: false };
  }
});

const percentage = computed(() => {
  const config = dynamicConfig.value;
  // 使用絕對值來計算填充百分比
  const absValue = Math.abs(props.value);
  const clampedValue = Math.max(config.min, Math.min(config.max, absValue));

  // 正常進度條，基於絕對值
  const range = config.max - config.min;
  return ((clampedValue - config.min) / range) * 100;
});

const fillColor = computed(() => {
  const config = dynamicConfig.value;
  return `linear-gradient(90deg, ${config.color} 0%, ${config.color}dd 100%)`;
});
</script>

<style lang="scss" scoped>
.progress-bar-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.progress-bar-label {
  font-size: 12px;
  color: #888;
  letter-spacing: 0.5px;
  font-weight: 500;
  min-width: 100px;
  flex-shrink: 0;
}

.progress-bar-wrapper {
  position: relative;
  height: 20px;
  background: #333;
  border-radius: 10px;
  border: 1px solid #555;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 0 8px;
  flex: 1;
}

.progress-bar-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s ease;
  z-index: 1;
}

.progress-bar-value {
  position: relative;
  z-index: 2;
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
  text-shadow:
    0 0 2px rgba(0, 0, 0, 1),
    0 0 4px rgba(0, 0, 0, 0.9),
    0 0 8px rgba(0, 0, 0, 0.7),
    0 1px 2px rgba(0, 0, 0, 0.8);
  -webkit-text-stroke: 0.5px rgba(0, 0, 0, 0.5);
}
</style>
