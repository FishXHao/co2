<script setup>
defineProps({
  service: {
    type: Object,
    required: true // { id, name, description, category, steps }
  }
})
</script>

<template>
  <article class="service-card card-surface">
    <span class="service-card__category">{{ service.category }}</span>
    <h3 class="service-card__title">
      <RouterLink :to="{ name: 'service-detail', params: { id: service.id } }">
        {{ service.name }}
      </RouterLink>
    </h3>
    <p class="service-card__desc">{{ service.description }}</p>
    <div class="service-card__footer">
      <span class="service-card__steps">共 {{ service.steps }} 個步驟</span>
      <RouterLink
        class="service-card__link"
        :to="{ name: 'service-detail', params: { id: service.id } }"
      >
        查看詳情
        <span aria-hidden="true">→</span>
      </RouterLink>
    </div>
  </article>
</template>

<style scoped>
.service-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  height: 100%;
  transition: box-shadow var(--transition-base), transform var(--transition-base);
}

.service-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.service-card__category {
  align-self: flex-start;
  font-size: var(--font-size-xs);
  color: var(--color-primary-700);
  background: var(--color-primary-100);
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--radius-full);
}

.service-card__title a { color: var(--color-neutral-900); }
.service-card__title a:hover { color: var(--color-primary-500); text-decoration: none; }

.service-card__desc {
  color: var(--color-neutral-700);
  flex: 1;
}

.service-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--color-neutral-100);
  padding-top: var(--spacing-3);
}

.service-card__steps {
  font-size: var(--font-size-sm);
  color: var(--color-neutral-400);
}

.service-card__link {
  font-weight: var(--font-weight-medium);
  display: inline-flex;
  gap: var(--spacing-1);
}
</style>
