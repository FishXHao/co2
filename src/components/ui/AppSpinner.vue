<script setup>
const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  label: { type: String, default: '載入中' }
})
</script>

<template>
  <span
    class="app-spinner"
    :class="`app-spinner--${props.size}`"
    role="status"
    :aria-label="props.label"
  >
    <span class="sr-only">{{ props.label }}</span>
  </span>
</template>

<style scoped>
.app-spinner {
  display: inline-block;
  border-radius: var(--radius-full);
  border: 2px solid var(--color-neutral-200);
  border-top-color: var(--color-primary-500);
  animation: app-spin 0.7s linear infinite;
}

.app-spinner--sm { width: 1rem; height: 1rem; }
.app-spinner--md { width: 1.5rem; height: 1.5rem; }
.app-spinner--lg { width: 2.5rem; height: 2.5rem; border-width: 3px; }

@keyframes app-spin {
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .app-spinner { animation-duration: 1.5s; }
}
</style>
