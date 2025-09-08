# Tooling context

This is a web app for drawing and analyzing the effective income tax rate
schedule in Finland.

The app is in Finnish, but development is in English.
The detailed specification lives in `DESIGN.md`.

## Development fundamentals

The project is written in React + TypeScript,
using Vite (with the React plugin) to build.
Routing happens through `react-router-dom`
and styling uses TailwindCSS.
It is deployed in a Docker container.
It supports deployment at a sub-path via nginx reverse proxy
(e.g. `example.com/app/` instead of `example.com/`).

### Commands

Run the development server:
```bash
npm run dev
```

Docker deployment:
```bash
docker build --build-arg VITE_BASE_PATH=/app/ -t my-app .
docker run -e BASE_PATH=/app/ -p 80:80 my-app
```

### Project Structure

Generic components, hooks, utilities and other features can be found under `src/base/`.
This is stuff that is reusable between projects; do not put anything app-specific here.
Base code presents in a uniform style, based on TailwindCSS.

Other subdirectories of `src/` are app-specific.

### Configuration Files

- `vite.config.ts` - Vite configuration with React and TailwindCSS plugins
- `tsconfig.*.json` - TypeScript configurations for app and Node environments
- `eslint.config.js` - ESLint configuration with React and TypeScript support
