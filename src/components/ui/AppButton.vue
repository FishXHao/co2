<script setup>
import { computed } from 'vue'
import AppSpinner from './AppSpinner.vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'ghost', 'danger'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  type: { type: String, default: 'button' },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  block: { type: Boolean, default: false }
})

const isDisabled = computed(() => props.disabled || props.loading)

const classes = computed(() => [
  'app-button',
  `app-button--${props.variant}`,
  `app-button--${props.size}`,
  { 'app-button--block': props.block, 'app-button--loading': props.loading }
])
</script>

<template>
  <button
    :type="type"
    :class="classes"
    :disabled="isDisabled"
    :aria-busy="loading ? 'true' : 'false'"
  >
    <AppSpinner v-if="loading" class="app-button__spinner" size="sm" />
    <span :class="{ 'sr-only': false }"><slot /></span>
  </button>
</template>

<style scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  line-height: 1;
  cursor: pointer;
  transition: background-color var(--transition-fast),
    border-color var(--transition-fast), color var(--transition-fast);
}

.app-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.app-button--sm { padding: var(--spacing-2) var(--spacing-3); font-size: var(--font-size-sm); }
.app-button--md { padding: var(--spacing-3) var(--spacing-4); font-size: var(--font-size-base); }
.app-button--lg { padding: var(--spacing-4) var(--spacing-6); font-size: var(--font-size-lg); }

.app-button--block { width: 100%; }

.app-button--primary {
  background-color: var(--color-primary-500);
  color: var(--color-neutral-0);
}
.app-button--primary:hover:not(:disabled) { background-color: var(--color-primary-700); }

.app-button--secondary {
  background-color: var(--color-neutral-0);
  color: var(--color-primary-500);
  border-color: var(--color-primary-500);
}
.app-button--secondary:hover:not(:disabled) { background-color: var(--color-primary-100); }

.app-button--ghost {
  background-color: transparent;
  color: var(--color-neutral-700);
}
.app-button--ghost:hover:not(:disabled) { background-color: var(--color-neutral-100); }

.app-button--danger {
  background-color: var(--color-error-500);
  color: var(--color-neutral-0);
}
.app-button--danger:hover:not(:disabled) { filter: brightness(0.92); }
</style>
