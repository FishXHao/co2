<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { servicesService } from '@/services/services.service'
import { useApiState } from '@/composables/useApiState'
import { useAuth } from '@/composables/useAuth'
import ServiceSteps from '@/components/service/ServiceSteps.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppSkeleton from '@/components/ui/AppSkeleton.vue'
import AppEmptyState from '@/components/ui/AppEmptyState.vue'
import AppBreadcrumb from '@/components/layout/AppBreadcrumb.vue'

const props = defineProps({
  id: { type: String, required: true }
})

const router = useRouter()
const auth = useAuth()
const { status, run } = useApiState()
const service = ref(null)

async function load() {
  try {
    service.value = await run(() => servicesService.getById(props.id))
  } catch (e) {
    // handled by status
  }
}

function goApply() {
  // ⚠ ASSUMPTION: apply requires auth; guard redirects guests to login.
  router.push({ name: 'apply', params: { serviceId: props.id } })
}

onMounted(load)
watch(() => props.id, load)
</script>

<template>
  <div class="container section">
    <AppBreadcrumb
      :items="[
        { label: '首頁', to: '/' },
        { label: '服務列表', to: '/services' },
        { label: service?.name || '服務詳情' }
      ]"
      class="mb-8"
    />

    <div v-if="status === 'loading'">
      <AppSkeleton width="60%" height="2rem" />
      <AppSkeleton :count="3" class="mt-8" />
    </div>

    <div v-else-if="status === 'error'" role="alert" class="detail__error">
      <p>載入服務詳情時發生錯誤。</p>
      <AppButton variant="secondary" class="mt-4" @click="load">重新載入</AppButton>
    </div>

    <AppEmptyState
      v-else-if="status === 'empty' || !service"
      icon="🔍"
      title="找不到此服務"
      description="您要查看的服務不存在或已下架。"
    >
      <template #action>
        <RouterLink :to="{ name: 'services' }">
          <AppButton variant="primary">返回服務列表</AppButton>
        </RouterLink>
      </template>
    </AppEmptyState>

    <div v-else class="detail">
      <header class="detail__header">
        <span class="detail__category">{{ service.category }}</span>
        <h1>{{ service.name }}</h1>
        <p class="detail__desc">{{ service.details || service.description }}</p>
      </header>

      <section v-if="service.stepList?.length" class="detail__steps">
        <h2 class="mb-4">申辦流程</h2>
        <ServiceSteps :steps="service.stepList" />
      </section>

      <div class="detail__actions">
        <AppButton variant="primary" size="lg" @click="goApply">
          {{ auth.isLoggedIn.value ? '立即申辦' : '登入後申辦' }}
        </AppButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail { max-width: 48rem; }

.detail__category {
  display: inline-block;
  font-size: var(--font-size-sm);
  color: var(--color-primary-700);
  background: var(--color-primary-100);
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--radius-full);
  margin-bottom: var(--spacing-3);
}

.detail__desc {
  font-size: var(--font-size-lg);
  margin-top: var(--spacing-4);
}

.detail__steps { margin-block: var(--spacing-12); }

.detail__error { color: var(--color-error-500); }
</style>
