<script setup>
defineProps({
  // items: [{ label, to? }] - last item is the current page (no link).
  items: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <nav class="app-breadcrumb" aria-label="麵包屑導覽">
    <ol class="app-breadcrumb__list">
      <li v-for="(item, index) in items" :key="index" class="app-breadcrumb__item">
        <RouterLink v-if="item.to && index < items.length - 1" :to="item.to">
          {{ item.label }}
        </RouterLink>
        <span v-else aria-current="page">{{ item.label }}</span>
        <span
          v-if="index < items.length - 1"
          class="app-breadcrumb__sep"
          aria-hidden="true"
        >/</span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.app-breadcrumb__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-sm);
}

.app-breadcrumb__item {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  color: var(--color-neutral-400);
}

.app-breadcrumb__sep { color: var(--color-neutral-400); }
</style>
