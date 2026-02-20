import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true, // external access allow karta hai
    allowedHosts: [
      "77d7-2404-7c80-5c-cd46-c840-f7ff-1b1f-1c9a.ngrok-free.app"
    ]
  }
})