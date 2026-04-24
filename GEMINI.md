# Gemini Project Context: SmartClinic CRM

This document provides a comprehensive overview of the SmartClinic CRM project for the Gemini AI assistant.

## Project Overview

SmartClinic is a full-stack web application designed as a Customer Relationship Management (CRM) system for medical clinics. It features a monorepo structure containing two distinct projects: a React-based frontend (`/Web`) and a Node.js/Express backend (`/Server`).

The application facilitates patient management, appointment scheduling, and includes an AI-powered operations assistant for doctors.

### Core Technologies

*   **Frontend (`/Web`):**
    *   **Framework:** React 19 (using Vite 7) with TypeScript 5.9.
    *   **Compiler:** Uses `babel-plugin-react-compiler` for optimized performance.
    *   **State Management:** `Zustand` for global state and `TanStack React Query` (v5) for server state and caching.
    *   **AI Integration:** `@tanstack/ai-react` for streaming chatbot interactions.
    *   **UI & Styling:** `Tailwind CSS`, `Lucide React` icons, and `FullCalendar` for scheduling.
    *   **Content Rendering:** `react-markdown` with `remark-gfm` for rich text and tables in the chatbot.
    *   **Routing:** `react-router-dom` (v7).

*   **Backend (`/Server`):**
    *   **Framework:** Express.js 5 running on Node.js with TypeScript 5.9.
    *   **Development Tooling:** Uses `tsx` for high-performance execution and watching.
    *   **AI Engine:** `TanStack AI` integrated with Google's `Gemini 2.5 Flash` model.
    *   **Database:** PostgreSQL, managed via Supabase.
    *   **Authentication:** JWT-based authentication via Supabase Auth.
    *   **API:** RESTful API with Server-Sent Events (SSE) support for AI streaming.
    *   **Real-time:** `Socket.io` for live cache invalidation and state synchronization.

## Real-time Synchronization

The application uses `Socket.io` to ensure all clients stay in sync without manual refreshes.

*   **Server-Side:** Initialized in `Server/src/server.ts`. A middleware uses `getUserDetails(token)` to verify the JWT from `socket.handshake.auth.token` before allowing a connection. A utility `emitCacheInvalidation` in `Server/src/utils/socketUtils.ts` is used to broadcast invalidation events.
*   **Client-Side:** The `App.tsx` component manages the socket lifecycle. It only connects when `isAuthenticated` is true, providing the `accessToken` in the `auth` object.
*   **Security:** Handshake-level JWT verification ensures only authenticated clinic staff can maintain a websocket connection.

## AI Chatbot Architecture

The project features a specialized AI Operations Assistant designed specifically for doctors.

*   **Endpoint:** `/chatbot` (defined in `Server/src/routes/chatbot.ts`).
*   **Security:** Requires valid doctor role and JWT token via `authMiddleware`.
*   **Rate Limiting:** Enforced via `express-rate-limit` to prevent abuse.
*   **Streaming:** Utilizes Server-Sent Events (SSE) for real-time response generation.
*   **Extensibility:** AI capabilities are extended through modular "Tools" located in `Server/src/chatTools/`.

### Available AI Tools
*   **`fetch_appointments`** (`appointmentTools.ts`): Allows the AI to search and filter clinic appointments by date range, patient, status, or doctor.
*   **`fetch_treatments`** (`treatmentTools.ts`): Allows the AI to retrieve clinical treatment templates and details available in the system.

## Key Features

*   **Patient & Appointment Management:** CRUD operations for patients, doctors, treatments, and appointments.
*   **Role-Based Access:** Specific functionalities tailored for Doctors, Patients, and Secretaries.
*   **Real-time Calendar:** Interactive appointment scheduling via FullCalendar.

## Building and Running the Application

### 1. Installation

Install dependencies in both the server and web client directories:

*   **Server:** `cd Server && npm install`
*   **Web:** `cd Web && npm install`

### 2. Environment Variables

*   **Server (`/Server/.env`):**
    *   `PORT`: Server port (default: 3001).
    *   `DATABASE_URL`: PostgreSQL connection string.
    *   `SUPABASE_URL` & `SUPABASE_ANON_KEY`: Supabase configuration.
    *   `GEMINI_API_KEY`: API key for Google Gemini.
    *   `FRONTEND_URL`: URL of the React application for CORS.
*   **Web (`/Web/.env`):**
    *   `VITE_API_URL`: Backend API URL (e.g., `http://localhost:3001`).

### 3. Development

*   **Start Backend:** `cd Server && npm run dev` (Runs `tsx watch src/server.ts`).
*   **Start Frontend:** `cd Web && npm run dev` (Runs `vite`).

## Development Conventions & Rules

*   **Documentation Maintenance (CRITICAL):** Whenever a significant change is made to the project architecture, new tools are added, or core technologies are updated, **this `GEMINI.md` file MUST be updated** to reflect the new state.
*   **Type Safety:** TypeScript is strictly enforced across the monorepo.
*   **Surgical Updates:** When modifying existing logic, maintain the architectural patterns found in `controllers`, `services`, and `middleware`.
*   **AI Tool Development:** Follow the established convention in `Server/src/chatTools/`. Use `zod` for input/output schemas and ensure the tool is registered in the chatbot route.
*   **Frontend Components:** Functional components with Tailwind utility classes. Prefer Lucide icons for UI elements.
*   **Linting:** The `/Web` project uses ESLint 9 (`eslint.config.js`). Run `npm run lint` in the `/Web` directory to verify code quality.
