<script setup>
const year = new Date().getFullYear()
</script>

<template>
  <footer class="app-footer">
    <div class="container app-footer__inner">
      <div class="app-footer__brand">
        <strong>CO₂ 碳捕獲服務</strong>
        <p>致力於協助企業實現淨零碳排放目標。</p>
      </div>

      <nav class="app-footer__nav" aria-label="頁尾導覽">
        <h2 class="app-footer__heading">服務</h2>
        <ul>
          <li><RouterLink to="/services">服務列表</RouterLink></li>
          <li><RouterLink to="/info/about">關於我們</RouterLink></li>
          <li><RouterLink to="/info/privacy">隱私權政策</RouterLink></li>
        </ul>
      </nav>
    </div>

    <div class="app-footer__bottom">
      <p>© {{ year }} CO₂ 碳捕獲服務. 版權所有。</p>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background: var(--color-neutral-900);
  color: var(--color-neutral-100);
  margin-top: auto;
}

.app-footer__inner {
  display: grid;
  gap: var(--spacing-8);
  padding-block: var(--spacing-12);
}

.app-footer__brand p {
  color: var(--color-neutral-400);
  margin-top: var(--spacing-2);
}

.app-footer__heading {
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-3);
  color: var(--color-neutral-0);
}

.app-footer__nav a {
  color: var(--color-neutral-400);
  line-height: 2;
}
.app-footer__nav a:hover { color: var(--color-neutral-0); }

.app-footer__bottom {
  border-top: 1px solid var(--color-neutral-700);
  padding-block: var(--spacing-4);
  text-align: center;
}
.app-footer__bottom p {
  color: var(--color-neutral-400);
  font-size: var(--font-size-sm);
}

@media (min-width: 768px) {
  .app-footer__inner {
    grid-template-columns: 2fr 1fr;
  }
}
</style>
