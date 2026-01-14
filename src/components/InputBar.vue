<script setup>
import { ref, inject } from 'vue'
import { PhPaperPlaneRight } from '@phosphor-icons/vue'

const message = ref('')
const sendMessage = inject('sendMessage')

const handleSubmit = () => {
  if (message.value.trim()) {
    sendMessage(message.value)
    message.value = ''
  }
}

const handleKeyPress = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSubmit()
  }
}
</script>

<template>
  <div class="input-container">
    <div class="input-wrapper">
      
      <input 
        v-model="message"
        type="text" 
        placeholder="Escribe algo..."
        class="main-input"
        @keypress="handleKeyPress"
      />
      
      <div class="right-actions">
        
        <button class="send-btn" @click="handleSubmit" :disabled="!message.trim()">
          <PhPaperPlaneRight size="20" weight="fill" />
        </button>
      </div>
    </div>
    
    
  </div>
</template>

<style scoped>
.input-container {
  width: 100%;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 12px 16px;
  gap: 12px;
  transition: border-color 0.2s;
}

.input-wrapper:focus-within {
  border-color: var(--accent-primary);
}

.icon-slot {
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.2s;
}

.icon-slot:hover {
  color: var(--text-primary);
}

.main-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.main-input::placeholder {
  color: var(--text-tertiary);
}

.right-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.command-hint {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-primary);
  border: none;
  border-radius: var(--radius-md);
  padding: 8px 12px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.send-btn:hover:not(:disabled) {
  background: var(--accent-secondary);
  transform: translateY(-1px);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.footer-info {
  margin-top: 8px;
  text-align: center;
}
</style>
