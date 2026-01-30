<script setup>
import AuthLayout from '../components/AuthLayout.vue'
import Button from '../components/Button.vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const { signIn, isLoading, error } = useAuth()

const handleRegister = async () => {
  // Cognito Hosted UI handles both login and registration
  await signIn()
}
</script>

<template>
  <AuthLayout>
    <div class="login-header">
      <h2 class="text-2xl font-bold mb-2">Create Account</h2>
      <p class="text-secondary text-sm">Sign up with Cognito.</p>
    </div>

    <div v-if="error" class="error-message">
      Authentication error: {{ error.message }}
    </div>

    <div class="login-form">
      <Button @click="handleRegister" variant="primary" block :disabled="isLoading">
        {{ isLoading ? 'Redirecting...' : 'Sign Up with Cognito' }}
      </Button>
    </div>
    
    <div class="text-center mt-6 text-sm text-secondary">
      Already have an account? 
      <RouterLink to="/" class="text-accent hover:underline">Sign in</RouterLink>
    </div>
  </AuthLayout>
</template>

<style scoped>
.login-header {
  text-align: center;
  margin-bottom: 24px;
}

@media (min-width: 768px) {
  .login-header {
    margin-bottom: 32px;
  }
}

.text-2xl { 
  font-size: 1.35rem; 
  color: white; 
}

@media (min-width: 768px) {
  .text-2xl { 
    font-size: 1.5rem; 
  }
}

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
