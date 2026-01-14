import { ref, readonly } from 'vue'
import { UserManager } from 'oidc-client-ts'

let userManager = null
const user = ref(null)
const isLoading = ref(true)
const isAuthenticated = ref(false)
const error = ref(null)

export function initializeAuth(config) {
    userManager = new UserManager(config)

    // Set up event handlers
    userManager.events.addUserLoaded((loadedUser) => {
        user.value = loadedUser
        isAuthenticated.value = true
        isLoading.value = false
    })

    userManager.events.addUserUnloaded(() => {
        user.value = null
        isAuthenticated.value = false
    })

    userManager.events.addAccessTokenExpired(() => {
        user.value = null
        isAuthenticated.value = false
    })

    // Check for existing session
    userManager.getUser().then((existingUser) => {
        if (existingUser && !existingUser.expired) {
            user.value = existingUser
            isAuthenticated.value = true
        }
        isLoading.value = false
    }).catch((err) => {
        console.error('Error loading user:', err)
        error.value = err
        isLoading.value = false
    })

    return userManager
}

export function useAuth() {
    const signIn = async () => {
        try {
            error.value = null
            isLoading.value = true
            // Prompt user to select account (allows switching accounts)
            await userManager.signinRedirect({
                extraQueryParams: {
                    prompt: 'select_account'
                }
            })
        } catch (err) {
            console.error('Sign in error:', err)
            error.value = err
            isLoading.value = false
        }
    }

    const handleCallback = async () => {
        try {
            error.value = null
            isLoading.value = true
            const callbackUser = await userManager.signinRedirectCallback()
            user.value = callbackUser
            isAuthenticated.value = true
            isLoading.value = false
            return callbackUser
        } catch (err) {
            console.error('Callback error:', err)
            error.value = err
            isLoading.value = false
            throw err
        }
    }

    const signOut = async (cognitoDomain, clientId, logoutUri) => {
        try {
            error.value = null
            // Remove user from OIDC client
            await userManager.removeUser()

            // Redirect to Cognito logout endpoint
            const logoutUrl = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`
            window.location.href = logoutUrl
        } catch (err) {
            console.error('Sign out error:', err)
            error.value = err
        }
    }

    const removeUser = async () => {
        try {
            await userManager.removeUser()
            user.value = null
            isAuthenticated.value = false
        } catch (err) {
            console.error('Remove user error:', err)
            error.value = err
        }
    }

    return {
        user: readonly(user),
        isLoading: readonly(isLoading),
        isAuthenticated: readonly(isAuthenticated),
        error: readonly(error),
        signIn,
        signOut,
        handleCallback,
        removeUser
    }
}
