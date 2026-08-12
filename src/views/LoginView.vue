<script setup>
import { ref, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useUiStore } from '@/stores/ui'
import { useFormValidation, validators } from '@/composables/useFormValidation'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'

const router = useRouter()
const route = useRoute()
const auth = useAuth()
const ui = useUiStore()

const submitting = ref(false)
const formError = ref('')
const usernameRef = ref(null)
const passwordRef = ref(null)

const { values, errors, validateAll, validateField, firstErrorField } =
  useFormValidation(
    { username: '', password: '' },
    {
      username: [validators.required('請輸入帳號')],
      password: [validators.required('請輸入密碼'), validators.minLength(6, '密碼至少 6 個字元')]
    }
  )

async function focusFirstError() {
  await nextTick()
  const field = firstErrorField.value
  const map = { username: usernameRef, password: passwordRef }
  map[field]?.value?.$el?.querySelector('input')?.focus()
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
    await auth.login({ username: values.username, password: values.password })
    ui.success('登入成功')
    const redirect = route.query.redirect || { name: 'home' }
    router.push(redirect)
  } catch (e) {
    formError.value = e?.message || '登入失敗，請確認帳號密碼'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="container section login">
    <div class="login__card card-surface">
      <h1 class="login__title">登入</h1>
      <p class="login__hint">請輸入您的帳號與密碼以繼續。</p>

      <p v-if="formError" class="login__error" role="alert">{{ formError }}</p>

      <form class="login__form" novalidate @submit.prevent="onSubmit">
        <AppInput
          ref="usernameRef"
          v-model="values.username"
          label="帳號"
          required
          autocomplete="username"
          :error="errors.username"
          @blur="validateField('username')"
        />

        <AppInput
          ref="passwordRef"
          v-model="values.password"
          label="密碼"
          type="password"
          required
          autocomplete="current-password"
          :error="errors.password"
          @blur="validateField('password')"
        />

        <AppButton type="submit" variant="primary" size="lg" block :loading="submitting">
          {{ submitting ? '登入中…' : '登入' }}
        </AppButton>
      </form>

      <p class="login__demo">
        示範帳號：<strong>admin</strong> / <strong>password123</strong>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login {
  display: flex;
  justify-content: center;
}

.login__card {
  width: 100%;
  max-width: 26rem;
}

.login__title { margin-bottom: var(--spacing-2); }
.login__hint { margin-bottom: var(--spacing-6); }

.login__form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.login__error {
  background: var(--color-error-100);
  color: var(--color-error-500);
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-4);
}

.login__demo {
  margin-top: var(--spacing-6);
  font-size: var(--font-size-sm);
  color: var(--color-neutral-400);
  text-align: center;
}
</style>
