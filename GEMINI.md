# Gemini Project Context: SmartClinic CRM

This document provides a comprehensive overview of the SmartClinic CRM project for the Gemini AI assistant.

## Project Overview

SmartClinic is a full-stack web application designed as a Customer Relationship Management (CRM) system for medical clinics. It features a monorepo structure containing two distinct projects: a React-based frontend (`/Web`) and a Node.js/Express backend (`/Server`).

The application facilitates patient management, appointment scheduling, and provides a dashboard for clinic metrics.

### Core Technologies

*   **Frontend (`/Web`):**
    *   **Framework:** React (using Vite) with TypeScript
    *   **Compiler:** Includes the new `babel-plugin-react-compiler`.
    *   **State Management:** Zustand for global state and TanStack React Query for server state/caching.
    *   **Styling:** Tailwind CSS.
    *   **Routing:** React Router DOM.

*   **Backend (`/Server`):**
    *   **Framework:** Express.js running on Node.js with TypeScript.
    *   **Database:** PostgreSQL, managed and accessed via Supabase.
    *   **Authentication:** JWT-based authentication handled by Supabase Auth.
    *   **API:** RESTful API with routes for managing users, patients, treatments, appointments, and authentication.

## Building and Running the Application

The project requires running the frontend and backend servers concurrently in separate terminals.

### 1. Installation

Dependencies must be installed for both the server and the web client.

*   **Install Server Dependencies:**
    ```bash
    cd Server
    npm install
    ```

*   **Install Web Client Dependencies:**
    ```bash
    cd Web
    npm install
    ```

### 2. Environment Variables

Both the server and client require `.env` files with specific variables. Refer to the `.env.example` files in both `/Server` and `/Web` for the required keys.

*   **Server (`/Server/.env`):** Defines the server port, database connection details (PostgreSQL/Supabase), JWT secret, and the frontend URL for CORS.
*   **Web (`/Web/.env`):** Defines `VITE_API_URL`, which must point to the running backend server's address (e.g., `http://localhost:3001`).

### 3. Running in Development

*   **Start the Backend Server:**
    ```bash
    cd Server
    npm run dev
    ```
    This command uses `ts-node` to execute and watch the `src/server.ts` file. The server will typically run on `http://localhost:3001`.

*   **Start the Frontend Client:**
    ```bash
    cd Web
    npm run dev
    ```
    This command uses Vite to launch the React development server, typically available at `http://localhost:5173`.

## Development Conventions

*   **Monorepo Structure:** Development is split between the `/Web` and `/Server` directories. There is no top-level workspace management script; each part is run independently.
*   **API-Driven:** The frontend is decoupled from the backend and communicates via REST API calls.
*   **TypeScript:** Both projects use TypeScript, and type safety is enforced. `tsconfig.json` files are present in both directories.
*   **Styling:** The frontend uses Tailwind CSS for utility-first styling.
*   **Linting:** The `/Web` project is configured with ESLint (`eslint.config.js`) for code quality and consistency. The primary linting command is `npm run lint` in the `/Web` directory.
*   **Backend Structure:** The Express server follows a conventional structure, separating concerns into `routes`, `controllers`, `services`, and `middleware`.
*   **Frontend Structure:** The React application is organized by feature and function, with distinct folders for `api`, `components`, `pages`, `hooks`, and `store`.
