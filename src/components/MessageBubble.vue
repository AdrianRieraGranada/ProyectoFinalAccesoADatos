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
  margin-bottom: 2rem;
  width: 100%;
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
  padding: 14px 20px;
  border-radius: var(--radius-lg);
  font-size: 1rem;
  max-width: 80%;
  line-height: 1.5;
  box-shadow: var(--shadow-lg);
}

.meta {
  margin-top: 8px;
  margin-right: 4px;
}

/* AI Message Styles */
.message-wrapper.ai {
  margin-top: 2rem;
}

.ai-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1rem;
}

.logo-placeholder {
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 4px; /* Adjust based on icon */
  /* Add specific green dot logo if needed via CSS or img */
}

.model-name {
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ai-content {
  background-color: var(--bg-secondary); /* Or transparent depending on exact look, image shows card-like potentially or just text on bg */
  /* Actually looks like the AI response is just text on the main background with special cards inside it. 
     Wait, looking closer at the image... 
     The text "Vector databases are designed..." is inside a border container? 
     No, the darker box is the card content. 
     Let's assume the whole AI response block is card-like or just text.
     In the image, "Vector databases..." is text. 
     Then there are cards "VECTOR DB" and "RELATIONAL DB".
  */
  color: var(--text-secondary); /* Looks like light grey text */
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

/* The box container around the whole response?
   The image shows a large border container around the AI response?
   No, it looks like a large card container for the whole AI response.
   Let's wrap AI response in a bordered card.
*/
.ai-message {
  border: 1px solid var(--border-color);
  background-color: rgba(17, 24, 39, 0.4); /* Very subtle fill */
  border-radius: var(--radius-xl);
  padding: 24px;
}

.ai-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
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
}

.action-btn.right {
  color: var(--accent-primary);
  background: rgba(37, 99, 235, 0.1);
  border-color: rgba(37, 99, 235, 0.2);
}
</style>
