<template>
  <div>
    <!-- ConfirmDialog 組件 -->
    <div v-if="confirmDialog.visible" class="confirm-dialog-overlay" @click="handle_confirm_dialog_overlay_click">
      <div class="confirm-dialog" @click.stop>
        <div class="confirm-dialog-header">
          <h3>{{ confirmDialog.title }}</h3>
        </div>
        <div class="confirm-dialog-body">
          <p>{{ confirmDialog.message }}</p>
        </div>
        <div class="confirm-dialog-footer">
          <button class="confirm-btn cancel-btn" @click="cancel_confirm_dialog">
            {{ confirmDialog.cancelText }}
          </button>
          <button
            class="confirm-btn confirm-action-btn"
            :data-confirm-text="confirmDialog.confirmText"
            @click="confirm_confirm_dialog"
          >
            {{ confirmDialog.confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ConfirmDialogData {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

interface Props {
  confirmDialog: ConfirmDialogData;
}

interface Emits {
  (e: 'update:confirm_dialog', value: ConfirmDialogData): void;
  (e: 'confirm-dialog-confirm'): void;
  (e: 'confirm-dialog-cancel'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const confirm_confirm_dialog = () => {
  emit('confirm-dialog-confirm');
};

const cancel_confirm_dialog = () => {
  emit('confirm-dialog-cancel');
};

const handle_confirm_dialog_overlay_click = () => {
  // 點擊遮罩層時取消
  cancel_confirm_dialog();
};

// 導出組件供其他組件使用
defineExpose({
  // ConfirmDialog組件
});
</script>

<style lang="scss">
.confirm-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.confirm-dialog {
  background-color: #2a2a2a;
  border-radius: 12px;
  border: 1px solid #404040;
  min-width: 300px;
  max-width: 90vw;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.confirm-dialog-header {
  padding: 20px 20px 0 20px;

  h3 {
    margin: 0;
    color: #e0e0e0;
    font-size: 18px;
    font-weight: 600;
  }
}

.confirm-dialog-body {
  padding: 16px 20px;

  p {
    margin: 0;
    color: #b0b0b0;
    line-height: 1.5;
    font-size: 14px;
  }
}

.confirm-dialog-footer {
  padding: 0 20px 20px 20px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.confirm-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &.cancel-btn {
    background-color: #404040;
    color: #b0b0b0;

    &:hover {
      background-color: #505050;
    }
  }

  &.confirm-action-btn {
    background-color: #007acc;
    color: white;

    &:hover {
      background-color: #0056b3;
    }

    &:active {
      background-color: #004085;
    }

    // 如果是刪除操作，使用紅色按鈕
    &[data-confirm-text='刪除'] {
      background-color: #dc3545;

      &:hover {
        background-color: #c82333;
      }

      &:active {
        background-color: #bd2130;
      }
    }
  }
}
</style>
