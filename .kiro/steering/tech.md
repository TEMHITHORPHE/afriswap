# Technology Stack

## Frontend Framework
- **React 18.3.1** with TypeScript
- **Vite 6.3.5** as build tool and dev server
- **React Router DOM** for client-side routing
- **SWC** for fast compilation via `@vitejs/plugin-react-swc`

## UI & Styling
- **Tailwind CSS v4** for utility-first styling
- **Radix UI** comprehensive component library for accessible primitives
- **Lucide React** for consistent iconography
- **Sonner** for toast notifications
- **Vaul** for drawer components
- **Recharts** for data visualization and charts

## State Management & Data
- **Supabase** for backend services, real-time data, and authentication
- **React Hook Form** for form handling and validation
- **Custom hooks** for data fetching and state management

## Development Tools
- **pnpm** as package manager (v10.9.0+)
- **TypeScript** for type safety
- **Path aliases** configured with `@/` pointing to `src/`

## Build Configuration
- **Target**: ESNext
- **Output**: `build/` directory
- **Dev server**: Port 3000 with auto-open
- **Extensive alias mapping** for dependency resolution

## Common Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Architecture Notes
- Component-based architecture with reusable UI primitives
- Custom theme provider for dark/light mode
- Real-time data integration with Supabase hooks
- Wallet context for Web3 integration state management