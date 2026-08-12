<script setup>
const props = defineProps({
  width: { type: String, default: '100%' },
  height: { type: String, default: '1rem' },
  radius: { type: String, default: 'var(--radius-sm)' },
  count: { type: Number, default: 1 }
})
</script>

<template>
  <span class="app-skeleton-wrap" aria-hidden="true">
    <span
      v-for="n in count"
      :key="n"
      class="app-skeleton"
      :style="{ width: props.width, height: props.height, borderRadius: props.radius }"
    />
  </span>
</template>

<style scoped>
.app-skeleton-wrap {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.app-skeleton {
  display: block;
  background: linear-gradient(
    90deg,
    var(--color-neutral-200) 25%,
    var(--color-neutral-100) 50%,
    var(--color-neutral-200) 75%
  );
  background-size: 200% 100%;
  animation: app-skeleton-shimmer 1.4s ease infinite;
}

@keyframes app-skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .app-skeleton { animation: none; }
}
</style>
