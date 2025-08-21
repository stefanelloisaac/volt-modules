# Volt Modules

A powerful CLI tool for generating Next.js App Router feature modules with TanStack Query, React Hook Form, and TypeScript.

## Features

- 🚀 **Interactive CLI** - Prompts for module name and custom hooks preference
- 📁 **Feature-based Architecture** - Creates organized `features/{module}/` structure  
- 🎨 **Custom Hooks** - Optional UI hooks, services, and constants
- 📋 **CRUD Operations** - Complete Create, Read, Update, Delete functionality
- 🔍 **Built-in Filtering** - Search and status filtering out of the box
- 🎯 **TypeScript First** - Fully typed with Zod schemas
- 📱 **Responsive Tables** - Mobile-friendly data tables
- 🎨 **Modal Forms** - Professional form components with validation

## Installation

```bash
# Install globally
npm install -g @volt.js/modules

# Or use with npx (no installation needed)
npx @volt.js/modules init
```

## Usage

### Create a New Module

```bash
volt-modules init
```

The CLI will prompt you for:
1. **Custom Hooks**: Whether to include reusable UI hooks and services
2. **Module Name**: The name of your feature module

### Example

```bash
$ volt-modules init
? Do you want to include custom hooks? (y/N): y
? Enter module name: user-management

✓ Created: features/user-management/_schemas/UserManagementSchema.ts
✓ Created: features/user-management/_api/queries/user-management.queries.ts
✓ Created: features/user-management/_api/mutations/user-management.mutations.ts
✓ Created: features/user-management/_components/UserManagementTable.tsx
✓ Created: features/user-management/_components/UserManagementForm.tsx
✓ Created: features/user-management/page.tsx
✓ Created: features/user-management/layout.tsx

✓ Module "user-management" created successfully in features/user-management
```

## Generated Structure

### With Custom Hooks (recommended)
```
features/
└── user-management/
    ├── hooks/
    │   ├── use-form.tsx
    │   ├── use-page.tsx
    │   └── use-user-preferences.ts
    ├── services/
    │   └── user-preferences.ts
    ├── constants/
    │   └── storage-keys.ts
    ├── _schemas/
    │   └── UserManagementSchema.ts
    ├── _api/
    │   ├── queries/
    │   │   └── user-management.queries.ts
    │   └── mutations/
    │       └── user-management.mutations.ts
    ├── _components/
    │   ├── UserManagementTable.tsx
    │   └── UserManagementForm.tsx
    ├── page.tsx
    └── layout.tsx
```

### Without Custom Hooks
```
features/
└── user-management/
    ├── _schemas/
    │   └── UserManagementSchema.ts
    ├── _api/
    │   ├── queries/
    │   │   └── user-management.queries.ts
    │   └── mutations/
    │       └── user-management.mutations.ts
    ├── _components/
    │   ├── UserManagementTable.tsx
    │   └── UserManagementForm.tsx
    ├── page.tsx
    └── layout.tsx
```

## What's Included

### 🔧 Core Files
- **Schema**: TypeScript types with Zod validation
- **API Layer**: TanStack Query hooks for data fetching
- **Components**: Table and Form components
- **Page**: Complete page component with CRUD operations
- **Layout**: Basic layout wrapper

### 🎨 Custom Hooks (Optional)
- **useFormHook**: Advanced form management with validation
- **usePage**: Page layout with tabs and actions
- **useUserPreferences**: Persistent user preferences
- **userPreferencesService**: Local storage service
- **Storage keys**: Centralized constants

### ✨ Features
- Search and filtering
- Modal forms with confirmation dialogs
- Loading states and error handling
- TypeScript types throughout
- Responsive design
- Accessibility support

## Requirements

- Node.js 18+
- Next.js 13+ with App Router
- TanStack Query
- React Hook Form
- Zod
- TypeScript

## Integration

After generating a module:

1. **Add to your route**:
```typescript
// In your route file
import "./features/user-management/user-management"
```

2. **Navigate to the page**:
```
http://localhost:3000/user-management
```

3. **Customize the module**:
   - Update the schema in `_schemas/`
   - Modify API calls in `_api/`
   - Customize components in `_components/`

## CLI Options

| Option | Description | Default |
|--------|-------------|---------|
| `-p, --path <path>` | Output directory | `'.'` |
| `-d, --dry-run` | Show files without creating | `false` |

## Examples

```bash
# Create in specific directory
volt-modules init --path ./src

# Preview what would be created
volt-modules init --dry-run
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © Your Name