import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
  },
  plugins: [
    react(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Define environment variables
    'import.meta.env.VITE_APP_NAME': JSON.stringify("BooksBoardroom Enterprise"),
    'import.meta.env.VITE_APP_VERSION': JSON.stringify("3.0.0"),
    'import.meta.env.VITE_APP_ENVIRONMENT': JSON.stringify(mode),
    'import.meta.env.MODE': JSON.stringify(mode),
    'import.meta.env.DEV': mode === 'development',
    'import.meta.env.PROD': mode === 'production',
    // Fix crypto.randomUUID for older browsers
    global: 'globalThis',
  },
}));