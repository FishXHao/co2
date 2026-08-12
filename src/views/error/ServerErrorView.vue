<script setup>
import AppButton from '@/components/ui/AppButton.vue'

function reload() {
  window.location.reload()
}
</script>

<template>
  <div class="container section error-view">
    <p class="error-view__code" aria-hidden="true">500</p>
    <h1 class="error-view__title">伺服器發生錯誤</h1>
    <p class="error-view__desc">
      抱歉，系統目前發生問題，請稍後再試。
    </p>
    <div class="error-view__actions">
      <AppButton variant="primary" size="lg" @click="reload">重新載入</AppButton>
      <RouterLink :to="{ name: 'home' }">
        <AppButton variant="secondary" size="lg">返回首頁</AppButton>
      </RouterLink>
    </div>
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
  color: var(--color-error-500);
  line-height: 1;
}

.error-view__title { margin-block: var(--spacing-4); }

.error-view__desc {
  margin-bottom: var(--spacing-8);
  color: var(--color-neutral-700);
}

.error-view__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-3);
  justify-content: center;
}
</style>
