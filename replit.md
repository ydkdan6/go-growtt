# Growtt - Learn First, Invest Smart

## Overview

Growtt is a learning-powered investment platform that teaches users investment fundamentals before they start investing. Users complete educational modules to earn "seeds" which unlock real investing features. The application follows a gamified learning approach where knowledge unlocks access.

The project uses a full-stack TypeScript architecture with React on the frontend and Express on the backend, with PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with CSS variables for theming
- **Component Library**: shadcn/ui (Radix UI primitives with custom styling)
- **Build Tool**: Vite with hot module replacement

The frontend lives in `client/src/` with:
- `pages/` - Route components (home, course, not-found)
- `components/ui/` - Reusable shadcn/ui components
- `hooks/` - Custom React hooks
- `lib/` - Utility functions and API client

### Backend Architecture
- **Framework**: Express 5 on Node.js
- **Language**: TypeScript with ESM modules
- **API Pattern**: RESTful endpoints prefixed with `/api`
- **Server Entry**: `server/index.ts`

Key server files:
- `server/routes.ts` - API route registration
- `server/storage.ts` - Data access layer with storage interface
- `server/static.ts` - Static file serving for production
- `server/vite.ts` - Vite dev server integration

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts`
- **Migrations**: Generated in `migrations/` directory via `drizzle-kit`
- **Current Schema**: Users table with id, username, password fields

The storage layer uses an interface pattern (`IStorage`) allowing for swappable implementations. Currently uses `MemStorage` (in-memory) but designed for easy PostgreSQL migration.

### Shared Code
The `shared/` directory contains code used by both frontend and backend:
- Database schema definitions
- Zod validation schemas (via drizzle-zod)
- Type definitions

### Build System
- **Development**: Vite dev server with HMR proxied through Express
- **Production Build**: 
  - Frontend: Vite builds to `dist/public/`
  - Backend: esbuild bundles to `dist/index.cjs`
- **Scripts**: `npm run dev` (development), `npm run build` (production), `npm run db:push` (schema sync)

### Theming
- Light/dark mode support via CSS variables
- Theme stored in localStorage (`growtt-ui-theme`)
- Green-focused "growth" color palette

## External Dependencies

### Database
- **PostgreSQL**: Primary database (configured via `DATABASE_URL` environment variable)
- **Drizzle Kit**: Schema management and migrations

### UI Libraries
- **Radix UI**: Accessible component primitives (dialog, dropdown, tooltip, etc.)
- **Lucide React**: Icon library
- **Embla Carousel**: Carousel component
- **cmdk**: Command palette component
- **Vaul**: Drawer component
- **React Day Picker**: Calendar component
- **Recharts**: Charting library

### Form & Validation
- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **@hookform/resolvers**: Zod integration with React Hook Form

### Replit-Specific
- `@replit/vite-plugin-runtime-error-modal`: Error overlay in development
- `@replit/vite-plugin-cartographer`: Development tooling
- `@replit/vite-plugin-dev-banner`: Development banner

### Key NPM Packages
- `@tanstack/react-query`: Async state management
- `class-variance-authority`: Component variant management
- `tailwind-merge` + `clsx`: Utility class merging
- `date-fns`: Date manipulation
- `wouter`: Client-side routing