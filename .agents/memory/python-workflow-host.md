---
name: Python backend workflow binding
description: uvicorn host flag required for Replit workflow port verification to succeed
---

When configuring a Python/uvicorn workflow in Replit, always use --host 0.0.0.0:

  uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

**Why:** Replit's workflow system verifies the port by making an HTTP request from outside localhost. If uvicorn binds to 127.0.0.1 (default), the port check fails and the workflow is marked FAILED even though the process started successfully.
**How to apply:** Any configureWorkflow() call with waitForPort must have the server bind to 0.0.0.0.
