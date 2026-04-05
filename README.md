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
* **AI chat BOT** The chat bot is a perssonal assistant of the doctor, It has access to the premade APIs to fetch ,summarize and update data.
* **Patient Management:** Create, read and update patient records.
* **Patient Overview:** Dedicated portal for patients to view their medical history and related information.
* **Treatments:** Reading custom made treatments from JSON file.
* **Appointments:** Creating and updating appointments , connected to a chosen custom treatment.
* **Scheduling Management:** Full weekly calendar view for appointment scheduling.
* **Secure Authentication:** Role-based access control (RBAC) for admins and staff + JWT token from SupaBase.
* **DDos prevention:** Using Express-rate-limiter , limits both auth requests and API calls.

### 🚧 Roadmap (Upcoming Features)
* [ ] **Document sending trough email:** Doctors will be able to upload and send documents to patients in an easy and interactive way.
* [ ] **Custom Treatment builder:** Doctors will be able to create a custom treatment structure and it will be saved as a json on the DB.

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
SUPABASE_SECRET_KEY={your_supabase_SECRET_key}

#Gemini API key
GEMINI_API_KEY={your Gemini API key}
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
All rights reserved to the developers of Smart Clinic AI
