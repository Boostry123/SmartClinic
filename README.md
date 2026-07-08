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
- **Audit logger:** Pino

---

## 🛠️ Features

- **Dashboard:** Real-time overview of clinic metrics and schedules.
- **AI Operations Assistant:** A personal assistant for doctors that can fetch, summarize, and update clinic data via streaming SSE. ( able to run either with API key or private Ollama model )
* **Real-time Synchronization:** Automatic cache invalidation across all clients using Socket.io (Secured with JWT handshake verification).

- **Patient Management:** Comprehensive CRUD operations for patient records.
- **Patient Overview:** Dedicated portal for patients to view their medical history.
- **Treatment Templates:** Clinical treatment templates with dynamic field structures.
- **Appointment Engine:** Advanced scheduling system connected to custom treatments.
- **Calendar Integration:** Interactive weekly/monthly views using FullCalendar.
- **Documents Management:** Upload 'PDF' documents securely into a private bucket (sending via email is possible to add).
- **Image Management:** Upload images into patients' appointments securely saved inside a private bucket.
- **Audit Logger:** Every action made by a user will be recorded with no option of deletion. Sensitive data is filtered (HIPAA regulations).
- **Secure Authentication:** Role-based access control (RBAC) and JWT security.
- **Security & Performance:** Rate limiting and DDoS protection via Express-rate-limit.

- **Local development:** This project uses Docker to provide a seamless, hot-reloading local development environment.

### 🚧 Roadmap (Upcoming Features)
- [ ] **Custom Treatment Builder:** Dynamic UI for doctors to create custom treatment structures stored as JSON.
- [ ] **AI Tools:** The current AI Toolkit is (Appointments, Treatments) fetching. More tools will be added.
- [ ] **Admin dashboard:** Currently, most of the work is done on the overall CRM experience with a few features for the admin Role.
- [ ] **Automatic Reminders:** Patients will be able to receive automatic reminders before their appointment.

---

## 📦 Local Development (Docker)

This project uses Docker to provide a seamless, hot-reloading local development environment. 

> **Note:** The live version of SmartClinic is deployed via Render and Cloudflare. However, production-ready Docker configurations are included if you wish to self-host.

## 📦 Installation & Setup

### Prerequisites

Ensure you have the following installed:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (not a must)
- [Git](https://git-scm.com/)
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

`cp Server/.env.example Server/.env`

`cp Web/.env.example Web/.env`

If using Docker, otherwise ignore : 
`cp docker-compose.override.yml.example docker-compose.override.yml`
### 4. Run the Application

### Without Docker:
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

### With Docker development (local):

`docker compose watch`

Access the app at `http://localhost:5173`.

---

## 🖼️ Gallery & Examples:

AI chat assistant, fetching appointments of an exact date, plus filtering away appointments that are not related to the asking doctor.
<img width="800" height="400" alt="list appointments by exact date" src="https://github.com/user-attachments/assets/8ffd9272-bb8c-41af-a2b7-234f7a0add18" />

Creating a new appointment using a friendly Full calendar view, fully responsive for mobile view as well.
<img width="800" height="400" alt="Fullcalendar appointment creation" src="https://github.com/user-attachments/assets/492ef471-7c68-4ff2-96ba-34051a571026" />

Custom-made treatments, Images secured in a private bucket, as well as document upload in a secure private bucket.
<img width="800" height="400" alt="Screenshot 2026-03-22 123136" src="https://github.com/user-attachments/assets/461dbcc9-cbef-489f-9927-8a0ce2b729b7" />

Example of Audit logs, searching for a specific patient, updating his data
<img width="400" height="500" alt=" Example of Audit logs, searching for a specific patient, updating his data" src="https://github.com/user-attachments/assets/3eeb2ef5-80cf-4902-bd86-53f01de3641a" />




📄 **License**
All rights reserved to the developers of Smart Clinic AI
