# 🤝 Contributing to Basera

Thank you for your interest in contributing! This guide explains how to work on the project cleanly.

---

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/basera.git
   cd basera
   ```
3. Follow the [SETUP_GUIDE.md](./SETUP_GUIDE.md) to get the project running locally
4. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

---

## Branch Naming

| Type | Format | Example |
|---|---|---|
| New feature | `feature/name` | `feature/map-view` |
| Bug fix | `fix/description` | `fix/login-redirect` |
| Docs | `docs/what` | `docs/api-examples` |
| Refactor | `refactor/what` | `refactor/listing-card` |

---

## Commit Messages

Use clear, present-tense commit messages:

```
✅  feat: add map view for listings
✅  fix: correct price display for tiffin category
✅  docs: update API documentation
✅  style: improve mobile bottom nav spacing

❌  fixed stuff
❌  update
❌  wip
```

---

## Code Style

- Use functional React components with hooks
- Use Tailwind CSS for all styling (no inline styles except dynamic values)
- Async API routes should always have try/catch
- Always use `dbConnect()` before any Mongoose query
- Use `lean()` on Mongoose queries that only need to read data (faster)
- Keep components small and focused — one job per component

---

## Pull Request Process

1. Make sure the app runs without errors locally
2. Run linting:
   ```bash
   npm run lint
   ```
3. Push your branch and open a Pull Request on GitHub
4. Write a clear PR description: what you changed and why
5. Reference any related issue: `Closes #12`

---

## Project Priorities (What to Work On)

Check the **Issues** tab on GitHub for open tasks. High-priority items are labeled:
- `good first issue` — beginner friendly
- `enhancement` — new feature
- `bug` — something broken

---

## Questions?

Open an issue or start a GitHub Discussion. All questions are welcome.
