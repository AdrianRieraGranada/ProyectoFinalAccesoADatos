import { initializeAuth } from '../composables/useAuth'

export default {
    install: (app, options) => {
        const cognitoAuthConfig = {
            authority: options.authority,
            client_id: options.client_id,
            redirect_uri: options.redirect_uri,
            response_type: options.response_type || 'code',
            scope: options.scope || 'phone openid email',
            post_logout_redirect_uri: options.post_logout_redirect_uri || options.redirect_uri,
        }

        // Initialize the auth system
        initializeAuth(cognitoAuthConfig)

        // Make config available globally if needed
        app.config.globalProperties.$authConfig = {
            cognitoDomain: options.cognitoDomain,
            clientId: options.client_id,
            logoutUri: options.post_logout_redirect_uri || options.redirect_uri
        }
    }
}
