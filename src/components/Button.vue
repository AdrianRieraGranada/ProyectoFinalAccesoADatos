<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'icon'].includes(value)
  },
  block: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <button 
    :class="['btn', `btn-${variant}`, { 'btn-block': block }]"
    v-bind="$attrs"
  >
    <slot name="icon-left"></slot>
    <span v-if="$slots.default"><slot></slot></span>
    <slot name="icon-right"></slot>
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  user-select: none;
}

@media (min-width: 768px) {
  .btn {
    gap: 8px;
    padding: 10px 16px;
    font-size: 0.95rem;
  }
}

.btn-primary {
  background-color: var(--accent-primary);
  color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.btn-primary:hover {
  background-color: var(--accent-hover);
}

.btn-secondary {
  background-color: transparent;
  color: var(--text-secondary);
  border-color: var(--border-color);
}

.btn-secondary:hover {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
  border-color: var(--border-light);
}

.btn-icon {
  padding: 8px;
  background: transparent;
  color: var(--text-secondary);
}

.btn-icon:hover {
  color: var(--text-primary);
  background: var(--bg-tertiary);
}

.btn-block {
  width: 100%;
}
</style>
