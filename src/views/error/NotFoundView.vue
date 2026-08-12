<script setup>
import AppButton from '@/components/ui/AppButton.vue'
</script>

<template>
  <div class="container section error-view">
    <p class="error-view__code" aria-hidden="true">404</p>
    <h1 class="error-view__title">找不到頁面</h1>
    <p class="error-view__desc">
      抱歉，您要找的頁面不存在或已被移除。
    </p>
    <RouterLink :to="{ name: 'home' }">
      <AppButton variant="primary" size="lg">返回首頁</AppButton>
    </RouterLink>
  </div>
</template>

<style scoped>
.error-view {
  text-align: center;
  max-width: 32rem;
  margin-inline: auto;
}

.error-view__code {
  font-size: 5rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-500);
  line-height: 1;
}

.error-view__title { margin-block: var(--spacing-4); }

.error-view__desc {
  margin-bottom: var(--spacing-8);
  color: var(--color-neutral-700);
}
</style>
