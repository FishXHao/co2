<script setup>
defineProps({
  title: { type: String, default: '目前沒有資料' },
  description: { type: String, default: '' },
  icon: { type: String, default: '📭' }
})
</script>

<template>
  <div class="app-empty" role="status">
    <div class="app-empty__icon" aria-hidden="true">{{ icon }}</div>
    <h3 class="app-empty__title">{{ title }}</h3>
    <p v-if="description" class="app-empty__desc">{{ description }}</p>
    <div v-if="$slots.action" class="app-empty__action">
      <slot name="action" />
    </div>
  </div>
</template>

<style scoped>
.app-empty {
  text-align: center;
  padding: var(--spacing-12) var(--spacing-4);
  color: var(--color-neutral-700);
}

.app-empty__icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-4);
}

.app-empty__title { margin-bottom: var(--spacing-2); }

.app-empty__desc {
  color: var(--color-neutral-400);
  margin-bottom: var(--spacing-4);
}
</style>
