<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useUiStore } from '@/stores/ui'
import AppButton from '@/components/ui/AppButton.vue'

const menuOpen = ref(false)
const route = useRoute()
const router = useRouter()
const auth = useAuth()
const ui = useUiStore()

const navLinks = [
  { name: 'home', label: '首頁' },
  { name: 'services', label: '服務' },
  { to: '/info/about', label: '關於我們' }
]

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

// Close mobile menu on route change.
watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
  }
)

async function onLogout() {
  await auth.logout()
  ui.success('已成功登出')
  router.push({ name: 'home' })
}
</script>

<template>
  <header class="app-header">
    <div class="container app-header__inner">
      <RouterLink :to="{ name: 'home' }" class="app-header__brand">
        <span aria-hidden="true">🌱</span>
        <span>CO₂ 碳捕獲服務</span>
      </RouterLink>

      <button
        type="button"
        class="app-header__toggle"
        :aria-expanded="menuOpen ? 'true' : 'false'"
        aria-controls="primary-navigation"
        @click="toggleMenu"
      >
        <span class="sr-only">切換選單</span>
        <span class="app-header__toggle-bar" aria-hidden="true"></span>
        <span class="app-header__toggle-bar" aria-hidden="true"></span>
        <span class="app-header__toggle-bar" aria-hidden="true"></span>
      </button>

      <nav
        id="primary-navigation"
        class="app-header__nav"
        :class="{ 'app-header__nav--open': menuOpen }"
        aria-label="主要導覽"
      >
        <ul class="app-header__list">
          <li v-for="link in navLinks" :key="link.label">
            <RouterLink
              v-if="link.name"
              :to="{ name: link.name }"
              class="app-header__link"
            >
              {{ link.label }}
            </RouterLink>
            <RouterLink v-else :to="link.to" class="app-header__link">
              {{ link.label }}
            </RouterLink>
          </li>
        </ul>

        <div class="app-header__actions">
          <template v-if="auth.isLoggedIn.value">
            <RouterLink :to="{ name: 'account' }" class="app-header__link">
              {{ auth.user.value?.username || '我的帳戶' }}
            </RouterLink>
            <AppButton variant="ghost" size="sm" @click="onLogout">登出</AppButton>
          </template>
          <template v-else>
            <RouterLink :to="{ name: 'login' }">
              <AppButton variant="primary" size="sm">登入</AppButton>
            </RouterLink>
          </template>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: var(--color-neutral-0);
  border-bottom: 1px solid var(--color-neutral-200);
  position: sticky;
  top: 0;
  z-index: var(--z-header);
}

.app-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 4rem;
  gap: var(--spacing-4);
}

.app-header__brand {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
  color: var(--color-neutral-900);
}
.app-header__brand:hover { text-decoration: none; }

.app-header__toggle {
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  padding: var(--spacing-2);
}

.app-header__toggle-bar {
  display: block;
  width: 1.5rem;
  height: 2px;
  background: var(--color-neutral-900);
}

.app-header__nav {
  display: none;
  flex-direction: column;
  gap: var(--spacing-4);
}

.app-header__nav--open {
  display: flex;
  position: absolute;
  top: 4rem;
  left: 0;
  right: 0;
  background: var(--color-neutral-0);
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--color-neutral-200);
  box-shadow: var(--shadow-md);
}

.app-header__list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.app-header__link {
  color: var(--color-neutral-700);
  font-weight: var(--font-weight-medium);
}
.app-header__link.router-link-active { color: var(--color-primary-500); }

.app-header__actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

@media (min-width: 768px) {
  .app-header__toggle { display: none; }

  .app-header__nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-6);
    position: static;
    padding: 0;
    box-shadow: none;
    border: none;
  }

  .app-header__list {
    flex-direction: row;
    gap: var(--spacing-6);
  }
}
</style>
