import { defineStore } from 'pinia'

export const useWebSocketStore = defineStore('websocket', {
    state: () => ({
        socket: null as WebSocket | null,
        isConnected: false,
        messages: [] as string[],
        error: null as string | null,
    }),
    actions: {
        connect(url: string) {
            if (this.socket) {
                this.socket.close()
            }

            try {
                this.socket = new WebSocket(url)

                this.socket.onopen = () => {
                    this.isConnected = true
                    this.error = null
                    console.log('WebSocket connected')
                }

                this.socket.onmessage = (event) => {
                    this.messages.push(event.data)
                }

                this.socket.onclose = () => {
                    this.isConnected = false
                    console.log('WebSocket disconnected')
                }

                this.socket.onerror = (error) => {
                    this.error = 'WebSocket error occurred'
                    console.error('WebSocket error:', error)
                }
            } catch (e) {
                this.error = 'Failed to create WebSocket connection'
                console.error(e)
            }
        },
        sendMessage(message: string) {
            if (this.socket && this.isConnected) {
                this.socket.send(message)
            } else {
                console.warn('WebSocket is not connected')
            }
        },
        disconnect() {
            if (this.socket) {
                this.socket.close()
                this.socket = null
                this.isConnected = false
            }
        }
    }
})
