const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export const chatService = {
    /**
     * Envía un mensaje al API Gateway para guardarlo en DynamoDB
     */
    async sendMessage(messageData) {
        try {
            const response = await fetch(`${API_BASE_URL}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messageData)
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            return { success: true, data }
        } catch (error) {
            console.error('Error sending message:', error)
            return { success: false, error: error.message }
        }
    }
}
