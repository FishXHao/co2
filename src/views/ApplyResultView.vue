<script setup>
import { useRoute } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import AppBreadcrumb from '@/components/layout/AppBreadcrumb.vue'

// ⚠ ASSUMPTION: auth-gated result page; reference comes from the mock submit flow.
const props = defineProps({
  serviceId: { type: String, required: true }
})

const route = useRoute()
const reference = route.query.ref || null
</script>

<template>
  <div class="container section result">
    <AppBreadcrumb
      :items="[
        { label: '首頁', to: '/' },
        { label: '服務列表', to: '/services' },
        { label: '申辦結果' }
      ]"
      class="mb-8"
    />

    <div class="result__card card-surface">
      <div class="result__icon" aria-hidden="true">✅</div>
      <h1 class="result__title">申辦已成功送出</h1>
      <p class="result__desc">
        感謝您的申辦，我們已收到您的申請，將盡快為您處理。
      </p>

      <dl v-if="reference" class="result__meta">
        <dt>申辦編號</dt>
        <dd>{{ reference }}</dd>
      </dl>

      <div class="result__actions">
        <RouterLink :to="{ name: 'services' }">
          <AppButton variant="secondary">返回服務列表</AppButton>
        </RouterLink>
        <RouterLink :to="{ name: 'account' }">
          <AppButton variant="primary">查看我的帳戶</AppButton>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result__card {
  max-width: 32rem;
  margin-inline: auto;
  text-align: center;
}

.result__icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-4);
}

.result__title { margin-bottom: var(--spacing-3); }

.result__meta {
  background: var(--color-neutral-100);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
  margin-block: var(--spacing-6);
}
.result__meta dt {
  font-size: var(--font-size-sm);
  color: var(--color-neutral-400);
}
.result__meta dd {
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
}

.result__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-3);
  justify-content: center;
}
</style>
