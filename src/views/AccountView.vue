<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useUiStore } from '@/stores/ui'
import AppButton from '@/components/ui/AppButton.vue'
import AppBreadcrumb from '@/components/layout/AppBreadcrumb.vue'

// ⚠ ASSUMPTION: auth-gated account page; profile fields depend on planned APIs.
const router = useRouter()
const auth = useAuth()
const ui = useUiStore()

async function onLogout() {
  await auth.logout()
  ui.success('已成功登出')
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="container section account">
    <AppBreadcrumb
      :items="[{ label: '首頁', to: '/' }, { label: '我的帳戶' }]"
      class="mb-8"
    />

    <h1 class="mb-8">我的帳戶</h1>

    <div class="account__card card-surface">
      <dl class="account__list">
        <div class="account__row">
          <dt>帳號</dt>
          <dd>{{ auth.user.value?.username || '—' }}</dd>
        </div>
        <div class="account__row">
          <dt>登入狀態</dt>
          <dd>{{ auth.isLoggedIn.value ? '已登入' : '未登入' }}</dd>
        </div>
      </dl>

      <div class="account__actions">
        <AppButton variant="danger" @click="onLogout">登出</AppButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.account__card { max-width: 36rem; }

.account__list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-6);
}

.account__row {
  display: flex;
  justify-content: space-between;
  padding-bottom: var(--spacing-3);
  border-bottom: 1px solid var(--color-neutral-100);
}

.account__row dt { color: var(--color-neutral-400); }
.account__row dd { font-weight: var(--font-weight-medium); }
</style>
