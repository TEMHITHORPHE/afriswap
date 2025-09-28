# Project Structure

## Root Directory
```
├── .kiro/                    # Kiro IDE configuration and steering rules
├── .vscode/                  # VS Code workspace settings
├── node_modules/             # Dependencies (managed by pnpm)
├── src/                      # Source code
├── index.html               # HTML entry point
├── package.json             # Project dependencies and scripts
├── pnpm-lock.yaml          # Lock file for reproducible installs
├── pnpm-workspace.yaml     # Workspace configuration
├── vite.config.ts          # Vite build configuration
└── README.md               # Project documentation
```

## Source Directory (`src/`)
```
src/
├── components/              # React components
│   ├── ui/                 # Reusable UI primitives (Radix-based)
│   ├── figma/              # Figma-generated components
│   ├── Header.tsx          # Main navigation header
│   ├── LandingPage.tsx     # Landing page component
│   ├── ConversionDashboard.tsx  # Main conversion interface
│   ├── TransactionHistory.tsx   # Transaction tracking
│   ├── PriceAlerts.tsx     # Price notification management
│   ├── BankAccounts.tsx    # Bank account management
│   ├── AdminDashboard.tsx  # Administrative interface
│   ├── WalletConnectionModal.tsx # Web3 wallet connection
│   └── ConversionWidget.tsx # Core conversion functionality
├── supabase/               # Supabase integration
│   └── functions/          # Edge functions and server code
├── utils/                  # Utility functions and hooks
│   ├── supabase/          # Supabase-specific utilities
│   └── theme.tsx          # Theme provider and context
├── styles/                 # Additional styling files
├── guidelines/             # Development guidelines and docs
├── App.tsx                # Main application component
├── main.tsx               # Application entry point
├── index.css              # Global styles and Tailwind imports
└── Attributions.md        # Third-party attributions
```

## Component Organization

### UI Components (`src/components/ui/`)
- **Primitive Components**: Based on Radix UI for accessibility
- **Consistent Naming**: kebab-case filenames, PascalCase exports
- **Utility Functions**: `utils.ts` for component helpers
- **Mobile Hook**: `use-mobile.ts` for responsive behavior

### Page Components (`src/components/`)
- **Feature-based**: Each major feature has its own component
- **Route Components**: Correspond to application routes
- **Shared Components**: Header, modals, widgets used across pages

## Configuration Files

### Path Aliases
- `@/` → `src/` (configured in vite.config.ts)
- Extensive dependency aliases for version-specific imports

### Styling
- **Tailwind CSS v4**: Utility-first approach
- **CSS Custom Properties**: Theme variables in index.css
- **Component Variants**: Using class-variance-authority

## Development Conventions

### File Naming
- **Components**: PascalCase (e.g., `ConversionDashboard.tsx`)
- **Utilities**: camelCase (e.g., `theme.tsx`)
- **UI Components**: kebab-case (e.g., `button.tsx`)

### Import Organization
- External libraries first
- Internal components and utilities
- Relative imports last
- Type imports separated when needed

### Component Structure
- Props interface definition
- Main component function
- Export statement
- Default export preferred for page components