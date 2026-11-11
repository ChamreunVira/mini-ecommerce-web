# VStore Web

VStore Web is a modern e-commerce frontend built with Next.js. It provides a customer shopping experience and a protected administration area for managing the store.

## Features

- Browse products and categories.
- View product details and manage a shopping cart.
- Save products to a wishlist.
- Complete checkout and review orders.
- Manage customer profile and contact information.
- Authenticate through login and registration pages.
- Manage products, categories, orders, payments, and store settings from the admin area.
- View administration metrics and charts.
- Generate and print order invoices.
- Display product images and QR codes from the connected backend service.

## Technology

- [Next.js](https://nextjs.org/) 16 with the App Router
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) and Radix UI components
- Axios for API communication
- React Hook Form for form handling
- Recharts for administration charts
- Bun as the project package manager

## Requirements

Install the following tools before starting the project:

- Node.js 20 or later
- Bun 1.3.14 or later
- A running VStore backend API

## Installation

1. Install the project dependencies:

   ```bash
   bun install
   ```

2. Create a local environment file named `.env.local` in the project root:

   ```env
   NEXT_PUBLIC_BASE_API_URL=http://localhost:8000/api
   NEXT_PUBLIC_STORAGE_URL=http://localhost:8000/storage
   ```

   Both variables are optional during local development because the application uses these values as defaults. Set them when the backend runs at a different URL.

3. Start the development server:

   ```bash
   bun run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in a browser.

## Available Scripts

| Command         | Description                                 |
| --------------- | ------------------------------------------- |
| `bun run dev`   | Start the development server.               |
| `bun run build` | Create a production build.                  |
| `bun run start` | Start the production server after building. |
| `bun run lint`  | Run ESLint checks.                          |

The equivalent `npm run` commands are also supported when Bun is not available.

## Application Areas

### Customer Area

Customer-facing pages are located under `app/(client)`. They include the home page, product catalog, checkout, profile, about, and contact pages.

### Authentication

Login and registration pages are located under `app/(auth)`.

### Administration Area

Administrative pages are located under `app/admin`. Access is protected by the application authentication guard. The area includes overview, product, category, order, payment, and settings pages.

## Project Structure

```text
app/          Application routes and layouts
components/   Reusable UI and feature components
constant/     Shared application constants
context/      React context providers
hooks/        Reusable React hooks
lib/          API, formatting, and utility modules
services/     Backend service clients
types/        Shared TypeScript types
utils/        Domain utility functions
public/       Static assets
```

## Backend Integration

API requests are handled through the service modules in `services/` and the Axios configuration in `lib/axios.ts`. The frontend expects the backend to provide authentication, product, category, cart, wishlist, order, address, overview, and payment operations.

Product image URLs use `NEXT_PUBLIC_STORAGE_URL`. For local development, the default storage URL is `http://localhost:8000/storage`.

## Production Build

Run the following commands to validate and start a production build:

```bash
bun run lint
bun run build
bun run start
```

The application can be deployed to any platform that supports Next.js. Configure the public API and storage URLs in the deployment environment before starting the application.

## Contribution Guidelines

- Keep components reusable and focused on one responsibility.
- Use TypeScript types for API data and component props.
- Follow the existing component and styling conventions.
- Run linting and a production build before submitting changes.
