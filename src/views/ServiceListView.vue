<script setup>
import { onMounted, ref } from 'vue'
import { servicesService } from '@/services/services.service'
import { useApiState } from '@/composables/useApiState'
import ServiceCard from '@/components/service/ServiceCard.vue'
import AppSkeleton from '@/components/ui/AppSkeleton.vue'
import AppEmptyState from '@/components/ui/AppEmptyState.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppBreadcrumb from '@/components/layout/AppBreadcrumb.vue'

const { status, run } = useApiState()
const services = ref([])

async function load() {
  try {
    services.value = await run(() => servicesService.list())
  } catch (e) {
    // handled by status
  }
}

onMounted(load)
</script>

<template>
  <div class="container section">
    <AppBreadcrumb
      :items="[{ label: '首頁', to: '/' }, { label: '服務列表' }]"
      class="mb-8"
    />

    <h1 class="mb-8">服務列表</h1>

    <div v-if="status === 'loading'" class="grid grid-md-2 grid-lg-3">
      <div v-for="n in 3" :key="n" class="card-surface">
        <AppSkeleton width="40%" height="1rem" />
        <AppSkeleton width="80%" height="1.5rem" class="mt-4" />
        <AppSkeleton :count="2" class="mt-4" />
      </div>
    </div>

    <div v-else-if="status === 'error'" class="service-list__error" role="alert">
      <p>載入服務時發生錯誤。</p>
      <AppButton variant="secondary" class="mt-4" @click="load">重新載入</AppButton>
    </div>

    <AppEmptyState
      v-else-if="status === 'empty'"
      title="目前沒有可用的服務"
      description="請稍後再回來查看。"
    />

    <div v-else class="grid grid-md-2 grid-lg-3">
      <ServiceCard v-for="service in services" :key="service.id" :service="service" />
    </div>
  </div>
</template>

<style scoped>
.service-list__error {
  color: var(--color-error-500);
}
</style>
