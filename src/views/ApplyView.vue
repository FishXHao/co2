<script setup>
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { applyService } from '@/services/apply.service'
import { useUiStore } from '@/stores/ui'
import { useFormValidation, validators } from '@/composables/useFormValidation'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppBreadcrumb from '@/components/layout/AppBreadcrumb.vue'

// ⚠ ASSUMPTION: This view is auth-gated via route meta (requiresAuth) and the
// apply endpoint is MOCK (no swagger definition).
const props = defineProps({
  serviceId: { type: String, required: true }
})

const router = useRouter()
const ui = useUiStore()

const submitting = ref(false)
const formError = ref('')
const formRef = ref(null)

const companyTypes = [
  { value: 'manufacturing', label: '製造業' },
  { value: 'energy', label: '能源業' },
  { value: 'service', label: '服務業' },
  { value: 'other', label: '其他' }
]

const { values, errors, validateAll, validateField, firstErrorField } =
  useFormValidation(
    { companyName: '', contactName: '', email: '', companyType: '', note: '' },
    {
      companyName: [validators.required('請輸入公司名稱')],
      contactName: [validators.required('請輸入聯絡人姓名')],
      email: [validators.required('請輸入電子郵件'), validators.email()],
      companyType: [validators.required('請選擇產業類別')]
    }
  )

async function focusFirstError() {
  await nextTick()
  const field = firstErrorField.value
  if (!field) return
  const el = formRef.value?.querySelector(`[aria-invalid="true"]`)
  el?.focus()
}

async function onSubmit() {
  if (submitting.value) return // prevent double submit
  formError.value = ''

  if (!validateAll()) {
    await focusFirstError()
    return
  }

  submitting.value = true
  try {
    const result = await applyService.submit(props.serviceId, { ...values })
    ui.success('申辦已送出')
    router.push({
      name: 'apply-result',
      params: { serviceId: props.serviceId },
      query: { ref: result.reference }
    })
  } catch (e) {
    formError.value = e?.message || '送出申辦時發生錯誤，請稍後再試'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="container section apply">
    <AppBreadcrumb
      :items="[
        { label: '首頁', to: '/' },
        { label: '服務列表', to: '/services' },
        { label: '申辦' }
      ]"
      class="mb-8"
    />

    <h1 class="mb-8">申辦服務</h1>

    <p v-if="formError" class="apply__error" role="alert">{{ formError }}</p>

    <form ref="formRef" class="apply__form card-surface" novalidate @submit.prevent="onSubmit">
      <AppInput
        v-model="values.companyName"
        label="公司名稱"
        required
        :error="errors.companyName"
        @blur="validateField('companyName')"
      />
      <AppInput
        v-model="values.contactName"
        label="聯絡人姓名"
        required
        :error="errors.contactName"
        @blur="validateField('contactName')"
      />
      <AppInput
        v-model="values.email"
        label="電子郵件"
        type="email"
        required
        autocomplete="email"
        :error="errors.email"
        @blur="validateField('email')"
      />
      <AppSelect
        v-model="values.companyType"
        label="產業類別"
        required
        :options="companyTypes"
        :error="errors.companyType"
        @blur="validateField('companyType')"
      />
      <AppInput
        v-model="values.note"
        label="備註（選填）"
        hint="如有特殊需求可在此說明"
      />

      <AppButton type="submit" variant="primary" size="lg" :loading="submitting">
        {{ submitting ? '送出中…' : '送出申辦' }}
      </AppButton>
    </form>
  </div>
</template>

<style scoped>
.apply__form {
  max-width: 36rem;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.apply__error {
  background: var(--color-error-100);
  color: var(--color-error-500);
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-4);
  max-width: 36rem;
}
</style>
