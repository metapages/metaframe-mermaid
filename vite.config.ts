import * as fs from "fs";
import { resolve } from 'path';
import { defineConfig } from 'vite';
import typescript from '@rollup/plugin-typescript';
import preact from "@preact/preset-vite";

const APP_FQDN = process.env.APP_FQDN || "metaframe1.dev";
const APP_PORT = process.env.APP_PORT || "443";
const fileKey = `./.certs/${APP_FQDN}-key.pem`;
const fileCert = `./.certs/${APP_FQDN}.pem`;

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  plugins: [
    preact(),
    typescript({ sourceMap: mode !== 'production', inlineSources: mode !== 'production' }),
  ],
  build: {
    outDir: mode === "production" ? "dist" : "build",
    target: 'esnext',
    sourcemap: true,
    minify: mode === 'development' ? false : 'esbuild',
    emptyOutDir: true,
  },
  server: mode === "development" ? {
    open: '/',
    host: APP_FQDN,
    port: parseInt(fs.existsSync(fileKey) ? APP_PORT : "8000"),
    https: fs.existsSync(fileKey) && fs.existsSync(fileCert) ? {
      key: fs.readFileSync(fileKey),
      cert: fs.readFileSync(fileCert),
    } : undefined,
  } : {
    // glitch.com default
    strictPort: true,
    hmr: {
      port: 443 // Run the websocket server on the SSL port
    }
  }
}));
