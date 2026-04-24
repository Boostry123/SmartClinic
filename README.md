# SmartClinic CRM 🏥

**SmartClinic** is a comprehensive Customer Relationship Management (CRM) system designed for medical clinics. It streamlines patient management, appointment scheduling, and administrative workflows using a modern, high-performance web architecture.

## 🚀 Tech Stack

### Frontend

- **Framework:** React 19 (via Vite 7)
- **Compiler:** React Compiler
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State Management:** Zustand
- **Caching:** TanStack React Query v5
- **Real-time:** Socket.io-client

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js 5
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** Supabase Auth (JWT)
- **AI Engine:** Google Gemini 2.5 Flash (via TanStack AI)
- **Real-time:** Socket.io

---

## 🛠️ Features

- **Dashboard:** Real-time overview of clinic metrics and schedules.
- **AI Operations Assistant:** A personal assistant for doctors that can fetch, summarize, and update clinic data via streaming SSE.
- **Real-time Synchronization:** Automatic cache invalidation across all clients using Socket.io (No refresh needed).
- **Patient Management:** Comprehensive CRUD operations for patient records.
- **Patient Overview:** Dedicated portal for patients to view their medical history.
- **Treatment Templates:** Clinical treatment templates with dynamic field structures.
- **Appointment Engine:** Advanced scheduling system connected to custom treatments.
- **Calendar Integration:** Interactive weekly/monthly views using FullCalendar.
- **Documents Management:** Upload 'PDF' documents securely into a private bucket.
- **Image Management:** Upload images into patients appointments securily saved inside a private bucket.
- **Secure Authentication:** Role-based access control (RBAC) and JWT security.
- **Security & Performance:** Rate limiting and DDoS protection via Express-rate-limit.

### 🚧 Roadmap (Upcoming Features)

- [ ] **Document Sending:** Easy document sharing with patients via email.
- [ ] **Custom Treatment Builder:** Dynamic UI for doctors to create custom treatment structures stored as JSON.

---

## 📦 Installation & Setup

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [npm](https://www.npmjs.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/smart-clinic.git
cd smart-clinic
```

### 2. Install Dependencies

```bash
# Install Server Dependencies
cd Server
npm install

# Install Web Dependencies
cd ../Web
npm install
```

### 3. Environment Variables

**Server Configuration (`Server/.env`)**

```env
PORT=3001
DATABASE_URL={your_postgresql_url}
FRONTEND_URL=http://localhost:5173

# Supabase Configuration
SUPABASE_URL={your_supabase_project_url}
SUPABASE_ANON_KEY={your_supabase_anon_key}
SUPABASE_SECRET_KEY={your_supabase_service_role_key}

# Gemini API key
GEMINI_API_KEY={your_gemini_api_key}
```

**Web Configuration (`Web/.env`)**

```env
VITE_API_URL=http://localhost:3001
```

### 4. Run the Application

**Terminal 1: Server**

```bash
cd Server
npm run dev
```

**Terminal 2: Web**

```bash
cd Web
npm run dev
```

Access the app at `http://localhost:5173`.

---

📄 **License**
All rights reserved to the developers of Smart Clinic AI
