<script setup>
import { computed, useId } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, required: true },
  type: { type: String, default: 'text' },
  id: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  autocomplete: { type: String, default: 'off' }
})

const emit = defineEmits(['update:modelValue', 'blur'])

const generatedId = useId()
const inputId = computed(() => props.id || `input-${generatedId}`)
const errorId = computed(() => `${inputId.value}-error`)
const hintId = computed(() => `${inputId.value}-hint`)

const describedBy = computed(() => {
  const ids = []
  if (props.hint) ids.push(hintId.value)
  if (props.error) ids.push(errorId.value)
  return ids.length ? ids.join(' ') : undefined
})

function onInput(event) {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <div class="app-input">
    <label :for="inputId" class="app-input__label">
      {{ label }}
      <span v-if="required" class="app-input__required" aria-hidden="true">*</span>
    </label>

    <p v-if="hint" :id="hintId" class="app-input__hint">{{ hint }}</p>

    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :autocomplete="autocomplete"
      :aria-invalid="error ? 'true' : 'false'"
      :aria-describedby="describedBy"
      class="app-input__field"
      :class="{ 'app-input__field--error': error }"
      @input="onInput"
      @blur="$emit('blur', $event)"
    />

    <p v-if="error" :id="errorId" class="app-input__error" role="alert">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
.app-input {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.app-input__label {
  font-weight: var(--font-weight-medium);
  color: var(--color-neutral-900);
}

.app-input__required { color: var(--color-error-500); }

.app-input__hint {
  font-size: var(--font-size-sm);
  color: var(--color-neutral-400);
}

.app-input__field {
  padding: var(--spacing-3) var(--spacing-4);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-md);
  background: var(--color-neutral-0);
  color: var(--color-neutral-900);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.app-input__field:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: var(--focus-ring);
}

.app-input__field:disabled {
  background: var(--color-neutral-100);
  cursor: not-allowed;
}

.app-input__field--error {
  border-color: var(--color-error-500);
}

.app-input__error {
  font-size: var(--font-size-sm);
  color: var(--color-error-500);
}
</style>
