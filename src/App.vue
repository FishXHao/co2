<script setup>
import { onMounted } from 'vue'
import AppSkipLink from '@/components/layout/AppSkipLink.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import AppToast from '@/components/ui/AppToast.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

// ⚠ ASSUMPTION: /api/users/me is "規劃中"; attempt a silent session restore.
onMounted(() => {
  auth.fetchMe().catch(() => {})
})
</script>

<template>
  <AppSkipLink />
  <AppHeader />

  <main id="main-content" class="app-main" tabindex="-1">
    <RouterView v-slot="{ Component }">
      <component :is="Component" />
    </RouterView>
  </main>

  <AppFooter />
  <AppToast />
</template>

<style scoped>
.app-main {
  flex: 1;
  width: 100%;
}
</style>
