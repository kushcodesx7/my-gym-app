import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite is the build tool. This tells it to understand React (JSX) files.
export default defineConfig({
  plugins: [react()],
})
