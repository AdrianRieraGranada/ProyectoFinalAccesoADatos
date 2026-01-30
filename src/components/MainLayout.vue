<template>
  <div class="layout-container">
    <header class="main-header">
      <div class="container">
        <slot name="header"></slot>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <slot></slot>
      </div>
    </main>

    <footer class="main-footer">
      <div class="container">
        <slot name="footer"></slot>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg-primary);
}

.container {
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
  padding: 0 var(--spacing-mobile);
}

@media (min-width: 768px) {
  .container {
    padding: 0 var(--spacing-tablet);
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0 var(--spacing-desktop);
  }
}

.main-header {
  padding-top: var(--spacing-mobile);
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .main-header {
    padding-top: var(--spacing-desktop);
  }
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-mobile) 0;
}

@media (min-width: 768px) {
  .main-content {
    padding: var(--spacing-desktop) 0;
  }
}

.main-footer {
  flex-shrink: 0;
  padding-bottom: var(--spacing-mobile);
  background: linear-gradient(to top, var(--bg-primary) 80%, transparent);
}

@media (min-width: 768px) {
  .main-footer {
    padding-bottom: var(--spacing-desktop);
  }
}
</style>
