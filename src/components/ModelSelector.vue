<script setup>
import { ref, inject, watch } from 'vue'
import { PhLightning, PhSparkle, PhGoogleLogo, PhRobot } from '@phosphor-icons/vue'

const selectedModel = inject('selectedModel')
const onModelChange = inject('onModelChange')

const models = [
  { id: 'gpt4', name: 'GPT-4 Turbo', icon: PhLightning },
  { id: 'claude', name: 'Claude 3.5', icon: PhSparkle },
  { id: 'gemini', name: 'Gemini 1.5 Pro', icon: PhGoogleLogo },
  { id: 'llama', name: 'Llama 3', icon: PhRobot }
]

const selectModel = (modelId) => {
  if (onModelChange) {
    onModelChange(modelId)
  }
}
</script>

<template>
  <div class="model-selector-wrapper">
    <div class="header-top">
      <span class="text-xs font-semibold text-secondary tracking-wide">SELECCIONA UN MODELO</span>
      
    </div>
    
    <div class="model-tabs">
      <button 
        v-for="model in models" 
        :key="model.id"
        :class="['model-tab', { active: selectedModel === model.id }]"
        @click="selectModel(model.id)"
      >
        <component :is="model.icon" weight="fill" v-if="selectedModel === model.id" class="tab-icon" />
        <component :is="model.icon" v-else class="tab-icon" />
        <span>{{ model.name }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.model-selector-wrapper {
  padding: 12px 0;
  border-bottom: 1px solid var(--bg-primary);
}

@media (min-width: 768px) {
  .model-selector-wrapper {
    padding: 20px 0;
  }
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 0 4px;
}

@media (min-width: 768px) {
  .header-top {
    margin-bottom: 12px;
  }
}

.tracking-wide {
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--text-tertiary);
  font-size: 0.65rem;
}

@media (min-width: 768px) {
  .tracking-wide {
    letter-spacing: 1px;
  }
}

.status-badge {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid rgba(16, 185, 129, 0.2);
  letter-spacing: 0.5px;
}

.model-tabs {
  display: flex;
  background: #0f131d;
  padding: 3px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  gap: 2px;
}

@media (min-width: 768px) {
  .model-tabs {
    padding: 4px;
    gap: 0;
  }
}

.model-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 4px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
}

@media (min-width: 480px) {
  .model-tab {
    gap: 6px;
    padding: 10px 8px;
    font-size: 0.8rem;
  }
}

@media (min-width: 768px) {
  .model-tab {
    gap: 8px;
    padding: 12px;
    font-size: 0.9rem;
  }
}

.model-tab:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.03);
}

.model-tab.active {
  background: var(--bg-tertiary);
  color: var(--accent-primary);
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.tab-icon {
  font-size: 0.9rem;
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .tab-icon {
    font-size: 1.1rem;
  }
}
</style>
