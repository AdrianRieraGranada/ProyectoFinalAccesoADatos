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
  padding: 20px 0;
  border-bottom: 1px solid var(--bg-primary); /* Blend with bg or separation? Image has separation */
  /* Actually looks like it floats or is part of the background */
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 0 4px;
}

.tracking-wide {
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--text-tertiary);
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
  background: #0f131d; /* Slightly different dark */
  padding: 4px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
}

.model-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
}

.model-tab:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.03);
}

.model-tab.active {
  background: var(--bg-tertiary); /* Card color */
  color: var(--accent-primary);
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.tab-icon {
  font-size: 1.1rem;
}
</style>
