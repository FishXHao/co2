<script setup>
defineProps({
  steps: {
    type: Array,
    default: () => [] // [{ title, description }]
  }
})
</script>

<template>
  <ol class="service-steps">
    <li v-for="(step, index) in steps" :key="index" class="service-steps__item">
      <span class="service-steps__number" aria-hidden="true">{{ index + 1 }}</span>
      <div class="service-steps__content">
        <h4 class="service-steps__title">{{ step.title }}</h4>
        <p class="service-steps__desc">{{ step.description }}</p>
      </div>
    </li>
  </ol>
</template>

<style scoped>
.service-steps {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.service-steps__item {
  display: flex;
  gap: var(--spacing-4);
  align-items: flex-start;
}

.service-steps__number {
  flex-shrink: 0;
  width: 2.25rem;
  height: 2.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background: var(--color-primary-500);
  color: var(--color-neutral-0);
  font-weight: var(--font-weight-bold);
}

.service-steps__title { margin-bottom: var(--spacing-1); }
.service-steps__desc { color: var(--color-neutral-700); }
</style>
