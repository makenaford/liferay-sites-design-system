import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'Scratch',
      fileName: 'scratch',
    },
    rollupOptions: {
      /**
       * React and Mantine are peer dependencies — bundling them would ship a second copy of
       * Mantine, whose provider context would not match the host application's.
       */
      external: ['react', 'react-dom', 'react/jsx-runtime', '@mantine/core', '@mantine/hooks'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          '@mantine/core': 'MantineCore',
          '@mantine/hooks': 'MantineHooks',
        },
      },
    },
  },
})
