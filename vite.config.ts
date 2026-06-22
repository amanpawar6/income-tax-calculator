import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  base: '/income-tax-calculator/',
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'node',
  },
})
