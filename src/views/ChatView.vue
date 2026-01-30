<script setup>
import { ref, getCurrentInstance, provide } from 'vue'
import MainLayout from '../components/MainLayout.vue'
import ModelSelector from '../components/ModelSelector.vue'
import InputBar from '../components/InputBar.vue'
import MessageBubble from '../components/MessageBubble.vue'
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'
import { chatService } from '../services/chatService'

const router = useRouter()
const { user, signOut, removeUser } = useAuth()
const app = getCurrentInstance()
const authConfig = app.appContext.config.globalProperties.$authConfig

const conversation = ref([])
const selectedModel = ref('gpt4')
const isLoading = ref(false)

// Mapeo de IDs de modelos a nombres completos
const modelNames = {
  'gpt4': 'GPT-4 Turbo',
  'claude': 'Claude 3.5 Sonnet',
  'gemini': 'Gemini 1.5 Pro',
  'llama': 'Llama 3.1 405B'
}

const handleLogout = async () => {
  await removeUser()
  router.push('/')
  
  if (authConfig.cognitoDomain && !authConfig.cognitoDomain.includes('YOUR-COGNITO-DOMAIN')) {
    const logoutUrl = `${authConfig.cognitoDomain}/logout?client_id=${authConfig.clientId}&logout_uri=${encodeURIComponent(authConfig.logoutUri)}`
    window.location.href = logoutUrl
  }
}

// Función para manejar el envío de mensajes
const handleSendMessage = async (messageText) => {
  if (!messageText.trim() || isLoading.value) return

  // Agregar mensaje del usuario a la conversación
  const userMessage = {
    id: Date.now(),
    role: 'user',
    content: messageText
  }
  conversation.value.push(userMessage)

  // Preparar datos para enviar a DynamoDB
  const messageData = {
    message: messageText,
    userId: user.value?.userId || 'anonymous',
    userEmail: user.value?.profile?.email || 'unknown',
    model: modelNames[selectedModel.value]  // Enviar nombre completo del modelo
  }

  isLoading.value = true

  // Enviar mensaje a DynamoDB
  const result = await chatService.sendMessage(messageData)

  if (result.success) {
    console.log('Mensaje guardado en DynamoDB:', result.data)
  } else {
    console.error('Error al guardar mensaje:', result.error)
  }

  // Simular respuesta del modelo
  setTimeout(() => {
    const aiMessage = {
      id: Date.now() + 1,
      role: 'ai',
      content: `Hola soy ${modelNames[selectedModel.value]}`,
      modelInfo: {
        name: modelNames[selectedModel.value],
        latency: '120ms',
        tokens: 8
      }
    }
    conversation.value.push(aiMessage)
    isLoading.value = false
  }, 500)
}

// Función para cambiar el modelo
const handleModelChange = (modelId) => {
  selectedModel.value = modelId
  // Limpiar conversación al cambiar de modelo
  conversation.value = []
}

// Proveer funciones a componentes hijos
provide('sendMessage', handleSendMessage)
provide('selectedModel', selectedModel)
provide('onModelChange', handleModelChange)
</script>

<template>
  <MainLayout>
    <template #header>
      <div class="header-content">
        <ModelSelector />
        <div class="user-info">
          <span class="user-email">{{ user?.profile?.email || 'User' }}</span>
          <button @click="handleLogout" class="logout-btn">Logout</button>
        </div>
      </div>
    </template>

    <div class="chat-area">
      <div v-if="conversation.length === 0" class="empty-state">
        <p class="text-secondary">Escribe un mensaje para comenzar...</p>
      </div>
      
      <MessageBubble 
        v-for="msg in conversation" 
        :key="msg.id"
        :role="msg.role"
        :content="msg.content"
        :modelInfo="msg.modelInfo"
      />
      
      <div v-if="isLoading" class="loading-indicator">
        <span class="text-secondary">{{ modelNames[selectedModel] }} está escribiendo...</span>
      </div>
    </div>

    <template #footer>
      <InputBar />
    </template>
  </MainLayout>
</template>

<style scoped>
.header-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (min-width: 768px) {
  .header-content {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  justify-content: space-between;
}

@media (min-width: 768px) {
  .user-info {
    width: auto;
    justify-content: flex-end;
  }
}

.user-email {
  font-size: 0.875rem;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 480px) {
  .user-email {
    max-width: 150px;
  }
}

.logout-btn {
  padding: 6px 12px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  border-radius: var(--radius-md);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

@media (min-width: 768px) {
  .logout-btn {
    padding: 8px 16px;
    font-size: 0.875rem;
  }
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.5);
}

.chat-area {
  padding-bottom: 20px;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  text-align: center;
}

.loading-indicator {
  padding: 12px;
  text-align: center;
  font-size: 0.875rem;
  font-style: italic;
}
</style>
