import { defineConfig } from 'vite'; // Import defineConfig from Vite
import { visualizer } from 'rollup-plugin-visualizer'; // Import visualizer
import react from '@vitejs/plugin-react'; // Import React plugin

export default defineConfig({
  plugins: [react(), visualizer()], // Use the visualizer plugin here
});
