import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import authPlugin from './plugins/authPlugin'
import './assets/base.css'
import { WebStorageStateStore } from 'oidc-client-ts'

const app = createApp(App)

// Configure Cognito authentication using environment variables
const cognitoAuthConfig = {
    authority: import.meta.env.VITE_COGNITO_AUTHORITY,
    client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_REDIRECT_URI || `${window.location.origin}/`,
    response_type: "code",
    scope: "phone openid email",
    post_logout_redirect_uri: import.meta.env.VITE_POST_LOGOUT_REDIRECT_URI || `${window.location.origin}/`,
    cognitoDomain: import.meta.env.VITE_COGNITO_DOMAIN,
    // Configuraciones adicionales importantes para evitar errores de state
    automaticSilentRenew: false,
    validateSubOnSilentRenew: true,
    monitorSession: false,
    // Store en sessionStorage en lugar de localStorage para evitar conflictos
    userStore: new WebStorageStateStore({ store: window.sessionStorage })
}

console.log('Auth config:', {
    authority: cognitoAuthConfig.authority,
    client_id: cognitoAuthConfig.client_id.substring(0, 5) + '...',
    redirect_uri: cognitoAuthConfig.redirect_uri,
    cognitoDomain: cognitoAuthConfig.cognitoDomain
})

app.use(authPlugin, cognitoAuthConfig)
app.use(router)

app.mount('#app')