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
  padding: 0 20px;
}

.main-header {
  padding-top: 20px;
  flex-shrink: 0;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 0;
}

.main-footer {
  flex-shrink: 0;
  padding-bottom: 20px;
  background: linear-gradient(to top, var(--bg-primary) 80%, transparent);
}
</style>
