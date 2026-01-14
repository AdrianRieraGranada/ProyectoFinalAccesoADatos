<script setup>
import { onMounted } from 'vue'
import AuthLayout from '../components/AuthLayout.vue'
import Button from '../components/Button.vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const route = useRoute()
const { signIn, handleCallback, isLoading, error } = useAuth()

// Handle OAuth callback
onMounted(async () => {
  // Check if this is a callback from Cognito (has 'code' parameter)
  if (route.query.code) {
    try {
      await handleCallback()
      // Redirect to chat after successful login
      router.push('/chat')
    } catch (err) {
      console.error('Login callback failed:', err)
    }
  }
})

const handleLogin = async () => {
  await signIn()
}
</script>

<template>
  <AuthLayout>
    <div class="login-header">
      <h2 class="text-2xl font-bold mb-2">Welcome</h2>
      <p class="text-secondary text-sm">Sign in or sign up with your Cognito account.</p>
    </div>

    <div v-if="error" class="error-message">
      Authentication error: {{ error.message }}
    </div>

    <div class="login-form">
      <Button @click="handleLogin" variant="primary" block :disabled="isLoading">
        {{ isLoading ? 'Redirecting...' : 'Sign In or Sign Up' }}
      </Button>
    </div>
  </AuthLayout>
</template>

<style scoped>
.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.text-2xl { font-size: 1.5rem; color: white; }
.mb-2 { margin-bottom: 0.5rem; }
.mt-6 { margin-top: 1.5rem; }
.text-center { text-align: center; }
.hover\:underline:hover { text-decoration: underline; }

.error-message {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  padding: 12px;
  border-radius: var(--radius-md);
  margin-bottom: 20px;
  font-size: 0.875rem;
}

.login-form {
  margin-bottom: 20px;
}
</style>
