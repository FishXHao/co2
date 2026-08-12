<script setup>
import { useUiStore } from '@/stores/ui'
import { storeToRefs } from 'pinia'

const ui = useUiStore()
const { toasts } = storeToRefs(ui)
</script>

<template>
  <div class="app-toast" aria-live="polite" aria-atomic="true">
    <TransitionGroup name="app-toast-item">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="app-toast__item"
        :class="`app-toast__item--${toast.type}`"
        role="status"
      >
        <span class="app-toast__message">{{ toast.message }}</span>
        <button
          type="button"
          class="app-toast__close"
          aria-label="關閉通知"
          @click="ui.removeToast(toast.id)"
        >
          &times;
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.app-toast {
  position: fixed;
  top: var(--spacing-4);
  right: var(--spacing-4);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  z-index: var(--z-toast);
  max-width: min(24rem, calc(100vw - 2rem));
}

.app-toast__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  border-left: 4px solid var(--color-info-500);
  background: var(--color-info-100);
  color: var(--color-neutral-900);
}

.app-toast__item--success {
  border-left-color: var(--color-success-500);
  background: var(--color-success-100);
}
.app-toast__item--error {
  border-left-color: var(--color-error-500);
  background: var(--color-error-100);
}
.app-toast__item--warning {
  border-left-color: var(--color-warning-500);
  background: var(--color-warning-100);
}

.app-toast__close {
  background: none;
  border: none;
  font-size: var(--font-size-xl);
  line-height: 1;
  color: var(--color-neutral-700);
}

.app-toast-item-enter-active,
.app-toast-item-leave-active {
  transition: opacity var(--transition-base), transform var(--transition-base);
}
.app-toast-item-enter-from,
.app-toast-item-leave-to {
  opacity: 0;
  transform: translateX(1rem);
}
</style>
