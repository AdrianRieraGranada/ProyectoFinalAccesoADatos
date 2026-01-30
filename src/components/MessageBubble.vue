<script setup>
import { PhCheck, PhCopy, PhArrowsClockwise } from '@phosphor-icons/vue'

defineProps({
  role: {
    type: String,
    required: true,
    validator: (v) => ['user', 'ai'].includes(v)
  },
  content: {
    type: String,
    required: true
  },
  modelInfo: {
    type: Object,
    default: null // { name: 'GPT-4 TURBO', latency: '840ms', tokens: 312 }
  }
})
</script>

<template>
  <div :class="['message-wrapper', role]">
    
    <!-- User Message -->
    <div v-if="role === 'user'" class="user-message">
       <div class="user-bubble">
         {{ content }}
       </div>
       <div class="meta text-xs text-secondary">Sent at 14:32 YOU</div>
    </div>

    <!-- AI Message -->
    <div v-else class="ai-message">
      <div v-if="modelInfo" class="ai-header">
        <div class="model-icon">
          <!-- Placeholder logo -->
          <div class="logo-placeholder"></div>
        </div>
        <div class="model-meta">
          <div class="model-name text-sm font-semibold">{{ modelInfo.name }}</div>
          <div class="model-stats text-xs text-secondary">
            Latency: {{ modelInfo.latency }} | Tokens: {{ modelInfo.tokens }}
          </div>
        </div>
      </div>

      <div class="ai-content">
        <!-- Render content (could be markdown later, raw text for now) -->
        <p>{{ content }}</p>
        <slot></slot>
      </div>

      <div class="ai-actions">
        <button class="action-btn success">
          <PhCheck size="16" weight="bold" />
          <span>Logged to DB</span>
        </button>
        <button class="action-btn">
          <PhCopy size="16" />
          <span>Copy</span>
        </button>
         <button class="action-btn">
          <PhArrowsClockwise size="16" />
          <span>Regenerate</span>
        </button>
        
        <div class="spacer"></div>
        
        <button class="action-btn right">
           <!-- Graph icon placeholder -->
           <span class="text-xs">Quality Analysis</span>
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped>
.message-wrapper {
  margin-bottom: 1.5rem;
  width: 100%;
}

@media (min-width: 768px) {
  .message-wrapper {
    margin-bottom: 2rem;
  }
}

/* User Bubble Styles */
.message-wrapper.user {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.user-bubble {
  background-color: var(--accent-primary);
  color: white;
  padding: 12px 16px;
  border-radius: var(--radius-lg);
  font-size: 0.95rem;
  max-width: 95%;
  line-height: 1.5;
  box-shadow: var(--shadow-lg);
}

@media (min-width: 480px) {
  .user-bubble {
    max-width: 85%;
  }
}

@media (min-width: 768px) {
  .user-bubble {
    padding: 14px 20px;
    font-size: 1rem;
    max-width: 80%;
  }
}

.meta {
  margin-top: 6px;
  margin-right: 4px;
  font-size: 0.7rem;
}

@media (min-width: 768px) {
  .meta {
    margin-top: 8px;
  }
}

/* AI Message Styles */
.message-wrapper.ai {
  margin-top: 1.5rem;
}

@media (min-width: 768px) {
  .message-wrapper.ai {
    margin-top: 2rem;
  }
}

.ai-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 0.75rem;
}

@media (min-width: 768px) {
  .ai-header {
    gap: 12px;
    margin-bottom: 1rem;
  }
}

.logo-placeholder {
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 4px;
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .logo-placeholder {
    width: 24px;
    height: 24px;
  }
}

.model-name {
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.8rem;
}

@media (min-width: 768px) {
  .model-name {
    font-size: inherit;
  }
}

.ai-content {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.6;
  font-size: 0.9rem;
}

@media (min-width: 768px) {
  .ai-content {
    margin-bottom: 1.5rem;
    font-size: 1rem;
  }
}

.ai-message {
  border: 1px solid var(--border-color);
  background-color: rgba(17, 24, 39, 0.4);
  border-radius: var(--radius-xl);
  padding: 16px;
}

@media (min-width: 768px) {
  .ai-message {
    padding: 24px;
  }
}

.ai-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

@media (min-width: 768px) {
  .ai-actions {
    gap: 12px;
    margin-top: 24px;
    padding-top: 20px;
  }
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

@media (min-width: 768px) {
  .action-btn {
    gap: 6px;
    padding: 6px 12px;
    font-size: 0.8rem;
  }
}

.action-btn:hover {
  background: var(--border-light);
  color: var(--text-primary);
}

.action-btn.success {
  color: var(--success);
  border-color: rgba(16, 185, 129, 0.2);
  background: rgba(16, 185, 129, 0.1);
}

.spacer {
  flex: 1;
  min-width: 100%;
}

@media (min-width: 640px) {
  .spacer {
    min-width: auto;
  }
}

.action-btn.right {
  color: var(--accent-primary);
  background: rgba(37, 99, 235, 0.1);
  border-color: rgba(37, 99, 235, 0.2);
}
</style>
