
# EventScribe - Notion-Inspired Event Management App

## Project Overview
EventScribe is a sleek event management application inspired by Notion's UI. It features a clean login system, event management dashboard, dark/light mode toggle, and Excel import/export functionality.

## Core Features
- User authentication (pre-defined credentials)
- Event management (date, notes, tags, collaborators)
- Multi-event creation and tracking
- Dark/light mode theme toggle
- Import/export events in JSON format
- Responsive design optimized for all devices

## Dependencies
The application uses the following core technologies:
- React 18+
- TypeScript
- Tailwind CSS
- Vite
- React Router DOM
- date-fns (for date formatting)
- Lucide React (for icons)
- Shadcn UI components

## Installation

```bash
# Clone the repository
git clone [repository-url]

# Navigate to project directory
cd eventscribe

# Install dependencies
npm install

# Start development server
npm run dev
```

## Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## Deployment
The application is ready for deployment on Vercel. No additional configuration is needed.

## Login Credentials
- Username: pallets
- Password: palletsyaap2025

## Project Structure
```
src/
├── components/       # Reusable UI components
├── pages/            # Application pages
├── types/            # TypeScript type definitions
├── lib/              # Utility functions
├── App.tsx           # Main application component
└── main.tsx          # Application entry point
```

## Additional Notes
- All event data is stored in localStorage
- The application features a responsive design that works on mobile, tablet, and desktop
- The UI is designed to be minimal and intuitive, similar to Notion
