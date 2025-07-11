import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Define environment variables
    'import.meta.env.VITE_APP_NAME': JSON.stringify("Financial Operations Portal"),
    'import.meta.env.VITE_APP_VERSION': JSON.stringify("1.0.0"),
    'import.meta.env.VITE_APP_ENVIRONMENT': JSON.stringify(mode),
    'import.meta.env.MODE': JSON.stringify(mode),
    'import.meta.env.DEV': mode === 'development',
    'import.meta.env.PROD': mode === 'production',
    // Fix crypto.randomUUID for older browsers
    global: 'globalThis',
  },
}));
