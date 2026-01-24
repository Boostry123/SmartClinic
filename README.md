# SmartClinic CRM 🏥

**SmartClinic** is a comprehensive Customer Relationship Management (CRM) system designed for medical clinics. It streamlines patient management, appointment scheduling, and administrative workflows using a modern, high-performance web architecture.

## 🚀 Tech Stack

### Frontend
* **Framework:** React (via Vite)
* **Styling:** Tailwind CSS
* **State Management:** Zustand
* **Caching:** React Query

### Backend
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** PostgreSQL (via Supabase)
* **Authentication:** Supabase Auth

---

## 🛠️ Features

* **Dashboard:** Real-time overview of clinic metrics and schedules.
* **Patient Management:** Create, read, update, and delete patient records.
* **Patient Overview:** Dedicated portal for patients to view their medical history and related information.
* **Secure Authentication:** Role-based access control (RBAC) for admins and staff + JWT token from SupaBase.

### 🚧 Roadmap (Upcoming Features)
* [ ] **Appointment Management:** Custom appointment handling for doctors.
* [ ] **Scheduling Management:** Personal schedule management for medical staff.

---

## 📦 Installation & Setup

### Prerequisites
Ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18+ recommended)
* [npm](https://www.npmjs.com/)

### 1. Clone the Repository
```bash
git clone [https://github.com/yourusername/smart-clinic.git](https://github.com/yourusername/smart-clinic.git)
cd smart-clinic
```

### 2. Install Dependencies
# Install Server Dependencies
```
cd server
npm install
```
# Install Client Dependencies
```
cd ../client
npm install
```
### 3. Environment Variables
Server Configuration (server/.env)
```
PORT=3001
JWT_SECRET=superSecretKey

# Database Configuration (PostgreSQL)
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=SmartClinic
DB_PASSWORD={your_db_password}
DB_PORT=5432

# Frontend Connection
BASE_FRONTEND_URL=http://localhost:5173

# Supabase Configuration
SUPABASE_URL={your_supabase_project_url}
SUPABASE_ANON_KEY={your_supabase_anon_key}
```
Client Configuration (client/.env)
```
VITE_API_URL=http://localhost:3001
```
### 4. Run the Application
Terminal 1: Server
```
cd server
npm run dev
```
Terminal 2: Client
```
cd client
npm run dev
```
Access the app at http://localhost:5173.
📄 License
This project is licensed under the MIT License.
