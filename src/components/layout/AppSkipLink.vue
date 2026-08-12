<script setup>
// Allows keyboard users to jump straight to the main content region.
</script>

<template>
  <a class="app-skip-link" href="#main-content">跳至主要內容</a>
</template>

<style scoped>
.app-skip-link {
  position: absolute;
  left: var(--spacing-4);
  top: -3rem;
  z-index: var(--z-toast);
  background: var(--color-primary-500);
  color: var(--color-neutral-0);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-md);
  transition: top var(--transition-fast);
}

.app-skip-link:focus {
  top: var(--spacing-4);
  text-decoration: none;
}
</style>
