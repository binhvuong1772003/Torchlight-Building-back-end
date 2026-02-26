# 🔥 Torchlight Building Backend

A scalable and production-ready backend service for the Torchlight Building platform.

---

## 📖 About The Project

Torchlight Building Backend is a RESTful API service built with modern backend technologies.  
It is designed to provide secure authentication, data management, and scalable architecture.

---

## 🚀 Tech Stack

- Node.js
- Express.js / NestJS
- TypeScript
- PostgreSQL / MongoDB
- Prisma / Mongoose
- JWT Authentication
- Yarn (package manager)

---

## ⚙️ Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/Torchlight-building-backend.git
cd Torchlight-building-backend
```
Install dependencies
```bash
yarn install
```
Run development server
```bash
yarn dev
```
Environment Variables

Create a .env file in the root directory of the project.
```bash
# ==============================
# Server Configuration
# ==============================
PORT=5000
NODE_ENV=development

# ==============================
# Database
# ==============================
DATABASE_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/<database_name>

# ==============================
# JWT Authentication
# ==============================
JWT_ACCESS_SECRET=your_access_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key

# ==============================
# Email Service
# ==============================
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# ==============================
# Client URL
# ==============================
CLIENT_URL=http://localhost:5173

# ==============================
# Cloud Storage (Cloudinary)
# ==============================
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
