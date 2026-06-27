---
name: Vite proxy for backend routing
description: How browser requests reach the Python FastAPI backend in Replit dev environment
---

Browser JS cannot call localhost:8000 directly in Replit (the proxy iframe means localhost resolves to the user's computer). Solution: add a Vite server proxy in vite.config.ts so Vite (running server-side in the container) forwards to localhost:8000.

```ts
server: {
  proxy: {
    '/api/chat': 'http://localhost:8080',   // Node.js api-server — MUST come before /api
    '/api/healthz': 'http://localhost:8080',
    '/api': 'http://localhost:8000',        // Python FastAPI
    '/health': 'http://localhost:8000',
  }
}
```

**Why:** Vite proxy keys are first-match in insertion order. More specific paths must be listed before their prefix.
**How to apply:** Never use absolute localhost URLs in frontend fetch calls — use relative paths that hit the Vite proxy.
