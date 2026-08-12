<script setup>
import { onMounted, ref } from 'vue'
import { servicesService } from '@/services/services.service'
import { useApiState } from '@/composables/useApiState'
import ServiceCard from '@/components/service/ServiceCard.vue'
import AppSkeleton from '@/components/ui/AppSkeleton.vue'
import AppButton from '@/components/ui/AppButton.vue'

const { status, run } = useApiState()
const services = ref([])

async function load() {
  try {
    services.value = await run(() => servicesService.list())
  } catch (e) {
    // status is already 'error'
  }
}

onMounted(load)
</script>

<template>
  <div>
    <section class="hero">
      <div class="container hero__inner">
        <div class="hero__content">
          <h1 class="hero__title">邁向淨零，從碳捕獲開始</h1>
          <p class="hero__subtitle">
            我們提供完整的碳捕獲申辦與碳排放查詢服務，協助企業掌握減碳進度，實現永續經營。
          </p>
          <div class="hero__actions">
            <RouterLink :to="{ name: 'services' }">
              <AppButton variant="primary" size="lg">瀏覽服務</AppButton>
            </RouterLink>
            <RouterLink :to="{ name: 'login' }">
              <AppButton variant="secondary" size="lg">立即登入</AppButton>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2 class="section__title">熱門服務</h2>

        <div v-if="status === 'loading'" class="grid grid-md-2 grid-lg-3">
          <div v-for="n in 3" :key="n" class="card-surface">
            <AppSkeleton width="40%" height="1rem" />
            <AppSkeleton width="80%" height="1.5rem" class="mt-4" />
            <AppSkeleton :count="2" class="mt-4" />
          </div>
        </div>

        <p v-else-if="status === 'error'" class="home__error" role="alert">
          載入服務時發生錯誤，請稍後再試。
        </p>

        <div v-else class="grid grid-md-2 grid-lg-3">
          <ServiceCard
            v-for="service in services"
            :key="service.id"
            :service="service"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  background: linear-gradient(135deg, var(--color-primary-100), var(--color-neutral-0));
  padding-block: var(--spacing-16);
}

.hero__title {
  font-size: var(--font-size-4xl);
  margin-bottom: var(--spacing-4);
}

.hero__subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-neutral-700);
  max-width: 40rem;
  margin-bottom: var(--spacing-8);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

.section__title {
  margin-bottom: var(--spacing-8);
}

.home__error {
  color: var(--color-error-500);
}
</style>
