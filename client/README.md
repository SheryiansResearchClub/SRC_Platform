# SRC Frontend

This React + Vite client powers the SRC application. Follow the steps below to install dependencies and run the app locally.

## Prerequisites

- **Node.js** v18+ (recommended: use the version declared in `.nvmrc` if present)
- **pnpm** 9+

## Setup & Installation

```bash
pnpm install
```

This command must be executed inside the `client/` directory. It installs all runtime and development dependencies, including React Query, Redux Toolkit, and axios.

## Development Server

```bash
pnpm dev
```

Runs the Vite development server with hot module replacement. Access the app at `http://localhost:5173/`.

## Production Build

```bash
pnpm build
```

Bundles the client for production output into `dist/`.

## Preview Production Build

```bash
pnpm preview
```

Serves the contents of `dist/` locally to verify the production build.

## Linting

```bash
pnpm lint
```

Runs ESLint using the shared configuration.

## Environment Variables

Create a `.env` file in the `client/` folder. Common keys include:

```
VITE_API_BASE_URL=https://api.example.com
VITE_DEV=true
```

Restart the dev server after changing env files to ensure Vite reloads the new values.