<script setup>
import { ref, watch, nextTick, onBeforeUnmount, useId } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'close'])

const dialogRef = ref(null)
const generatedId = useId()
const titleId = `modal-title-${generatedId}`

let previouslyFocused = null

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function onKeydown(event) {
  if (event.key === 'Escape') {
    close()
    return
  }
  if (event.key !== 'Tab') return

  // Simple focus trap.
  const focusable = dialogRef.value?.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  )
  if (!focusable || focusable.length === 0) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(
  () => props.modelValue,
  async (open) => {
    if (open) {
      previouslyFocused = document.activeElement
      await nextTick()
      dialogRef.value?.focus()
    } else if (previouslyFocused instanceof HTMLElement) {
      previouslyFocused.focus()
    }
  }
)

onBeforeUnmount(() => {
  if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="app-modal">
      <div
        v-if="modelValue"
        class="app-modal__overlay"
        @click.self="close"
      >
        <div
          ref="dialogRef"
          class="app-modal__dialog"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? titleId : undefined"
          tabindex="-1"
          @keydown="onKeydown"
        >
          <header v-if="title || $slots.header" class="app-modal__header">
            <h2 :id="titleId" class="app-modal__title">
              <slot name="header">{{ title }}</slot>
            </h2>
            <button
              type="button"
              class="app-modal__close"
              aria-label="關閉對話框"
              @click="close"
            >
              &times;
            </button>
          </header>

          <div class="app-modal__body">
            <slot />
          </div>

          <footer v-if="$slots.footer" class="app-modal__footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.app-modal__overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4);
  z-index: var(--z-modal);
}

.app-modal__dialog {
  background: var(--color-neutral-0);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 32rem;
  max-height: 90vh;
  overflow-y: auto;
}

.app-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-4) var(--spacing-6);
  border-bottom: 1px solid var(--color-neutral-200);
}

.app-modal__title { font-size: var(--font-size-xl); }

.app-modal__close {
  background: none;
  border: none;
  font-size: var(--font-size-2xl);
  line-height: 1;
  color: var(--color-neutral-700);
}

.app-modal__body { padding: var(--spacing-6); }

.app-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-3);
  padding: var(--spacing-4) var(--spacing-6);
  border-top: 1px solid var(--color-neutral-200);
}

.app-modal-enter-active,
.app-modal-leave-active {
  transition: opacity var(--transition-base);
}
.app-modal-enter-from,
.app-modal-leave-to {
  opacity: 0;
}
</style>
