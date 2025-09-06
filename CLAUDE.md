# Tooling context

This is a simple web app.

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
- `/src/main.tsx` - Application entry point with React Router setup
- `/src/App.tsx` - Main application component
- `/src/tools/` - Utility modules and reusable components:
  - `DataSource.tsx` - Data fetching utilities with URL prefix handling
  - `WrapState.ts` - State management wrapper interface
  - `Dropdown.tsx` - Dropdown component
  - `functional.ts` - Functional programming utilities (e.g., mapValues)
  - `string.ts` - String manipulation utilities

### Key Patterns
- **Data Fetching**: Uses `DataSource` class for URL prefix management and `useJsonData` hook for async data loading
- **State Management**: Custom `WrapState` interface provides a consistent state wrapper pattern
- **Routing**: Single-page application with React Router browser router
- **Styling**: TailwindCSS integrated via Vite plugin

### Configuration Files
- `vite.config.ts` - Vite configuration with React and TailwindCSS plugins
- `tsconfig.*.json` - TypeScript configurations for app and Node environments
- `eslint.config.js` - ESLint configuration with React and TypeScript support
