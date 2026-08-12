<script setup>
import { computed } from 'vue'
import AppBreadcrumb from '@/components/layout/AppBreadcrumb.vue'
import AppEmptyState from '@/components/ui/AppEmptyState.vue'
import AppButton from '@/components/ui/AppButton.vue'

const props = defineProps({
  slug: { type: String, required: true }
})

// ⚠ ASSUMPTION/MOCK: static info content keyed by slug (no CMS/API defined).
const CONTENT = {
  about: {
    title: '關於我們',
    paragraphs: [
      'CO₂ 碳捕獲服務致力於協助企業實現淨零碳排放目標。',
      '我們整合碳捕獲技術申辦與碳排放查詢，提供一站式的減碳解決方案。'
    ]
  },
  privacy: {
    title: '隱私權政策',
    paragraphs: [
      '我們重視您的個人資料保護，僅在提供服務所需的範圍內蒐集與使用您的資料。',
      '您可隨時要求查詢、更正或刪除您的個人資料。'
    ]
  },
  terms: {
    title: '服務條款',
    paragraphs: [
      '使用本服務即表示您同意遵守相關使用規範。',
      '本服務保留隨時修改條款的權利，修改後將於本頁公告。'
    ]
  }
}

const content = computed(() => CONTENT[props.slug] || null)
</script>

<template>
  <div class="container section info">
    <AppBreadcrumb
      :items="[{ label: '首頁', to: '/' }, { label: content?.title || '資訊' }]"
      class="mb-8"
    />

    <template v-if="content">
      <h1 class="mb-8">{{ content.title }}</h1>
      <div class="info__body">
        <p v-for="(para, index) in content.paragraphs" :key="index">{{ para }}</p>
      </div>
    </template>

    <AppEmptyState
      v-else
      icon="📄"
      title="找不到此資訊頁面"
      description="您要查看的內容不存在。"
    >
      <template #action>
        <RouterLink :to="{ name: 'home' }">
          <AppButton variant="primary">返回首頁</AppButton>
        </RouterLink>
      </template>
    </AppEmptyState>
  </div>
</template>

<style scoped>
.info__body {
  max-width: 42rem;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  font-size: var(--font-size-lg);
}
</style>
