import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'auth',
            component: () => import('../views/LoginView.vue')
        },
        {
            path: '/chat',
            name: 'chat',
            component: () => import('../views/ChatView.vue'),
            meta: { requiresAuth: true }
        }
    ]
})

// Navigation guard to protect routes
router.beforeEach((to, from, next) => {
    const { isAuthenticated, isLoading } = useAuth()

    // If route requires auth and user is not authenticated
    if (to.meta.requiresAuth && !isAuthenticated.value && !isLoading.value) {
        next({ name: 'login' })
    } else {
        next()
    }
})

export default router
