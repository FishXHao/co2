<script setup>
import { computed, useId } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, required: true },
  options: {
    type: Array,
    default: () => [] // [{ value, label }]
  },
  id: { type: String, default: '' },
  placeholder: { type: String, default: '請選擇' },
  error: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'blur'])

const generatedId = useId()
const selectId = computed(() => props.id || `select-${generatedId}`)
const errorId = computed(() => `${selectId.value}-error`)

function onChange(event) {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <div class="app-select">
    <label :for="selectId" class="app-select__label">
      {{ label }}
      <span v-if="required" class="app-select__required" aria-hidden="true">*</span>
    </label>

    <select
      :id="selectId"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      :aria-invalid="error ? 'true' : 'false'"
      :aria-describedby="error ? errorId : undefined"
      class="app-select__field"
      :class="{ 'app-select__field--error': error }"
      @change="onChange"
      @blur="$emit('blur', $event)"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>

    <p v-if="error" :id="errorId" class="app-select__error" role="alert">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
.app-select {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.app-select__label {
  font-weight: var(--font-weight-medium);
  color: var(--color-neutral-900);
}

.app-select__required { color: var(--color-error-500); }

.app-select__field {
  padding: var(--spacing-3) var(--spacing-4);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-md);
  background: var(--color-neutral-0);
  color: var(--color-neutral-900);
}

.app-select__field:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: var(--focus-ring);
}

.app-select__field--error { border-color: var(--color-error-500); }

.app-select__error {
  font-size: var(--font-size-sm);
  color: var(--color-error-500);
}
</style>
