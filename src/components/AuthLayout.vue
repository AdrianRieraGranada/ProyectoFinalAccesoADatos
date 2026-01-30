<template>
  <div class="auth-layout">
    <div class="auth-card">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  padding: var(--spacing-mobile);
}

@media (min-width: 768px) {
  .auth-layout {
    padding: var(--spacing-desktop);
  }
}

.auth-card {
  width: 100%;
  max-width: 400px;
  padding: 24px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
}

@media (min-width: 768px) {
  .auth-card {
    padding: 40px;
  }
}
</style>
