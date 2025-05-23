# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Development Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build production version (runs TypeScript build & Vite build)
- `pnpm lint` - Run ESLint for code quality checks
- `pnpm preview` - Preview production build locally

## Code Style Guidelines
- **Imports**: Use absolute imports with `@/` prefix (e.g., `import { cn } from "@/lib/utils"`)
- **Component Structure**: Follow shadcn/ui patterns with React.forwardRef for components
- **Types**: Use TypeScript interfaces for props and explicit type definitions
- **Naming**: Use PascalCase for components, camelCase for variables/functions
- **Error Handling**: Use try/catch blocks with console.error for errors
- **CSS**: Use Tailwind with the cn utility for conditional class names
- **State Management**: Use React hooks (useState, useEffect, useRef)
- **Component Props**: Use interfaces extending HTMLElement attributes where applicable
- **Exports**: Named exports preferred over default exports