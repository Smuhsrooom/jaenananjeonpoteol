import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { kmaPublicApiPlugin } from "./kmaPublicApiPlugin";

// 로컬 환경에서 PORT가 없으면 기본값 5173을 사용하도록 안전장치를 둡니다.
const rawPort = process.env.PORT || "5173";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// BASE_PATH가 없으면 로컬 기본값인 "/"을 사용합니다.
const basePath = process.env.BASE_PATH || "/";

// monorepo 루트 + 프론트 패키지 .env 를 모두 로드 (공공 API 키)
const monorepoRoot = path.resolve(import.meta.dirname, "../..");
const packageRoot = path.resolve(import.meta.dirname);
const mode = process.env.NODE_ENV === "production" ? "production" : "development";
const env = {
  ...loadEnv(mode, monorepoRoot, ""),
  ...loadEnv(mode, packageRoot, ""),
};
for (const [key, value] of Object.entries(env)) {
  if (process.env[key] == null) process.env[key] = value;
}

export default defineConfig({
  // 중요: 로컬 환경에서는 "/"로 작동하도록 보장합니다.
  base: basePath,
  envDir: monorepoRoot,
  plugins: [
    kmaPublicApiPlugin(),
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    // Vercel outputDirectory 와 맞춤 (dist)
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: false, // 포트 꼬임 방지를 위해 strict 해제
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: false, // 로컬 asset 접근을 위해 완화
    },
    // 로컬 Express(api-server) 프록시 제거 — 기상청 공공 API는 kmaPublicApiPlugin 사용
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
