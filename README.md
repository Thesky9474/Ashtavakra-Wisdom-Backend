
---

## 🔹 `Wisdom-of-Ashtavakra-Backend` — *Backend Repository*

```markdown
# 🌐 Wisdom of Ashtavakra — Backend

This is the backend for the Wisdom of Ashtavakra spiritual web app — built with Node.js and Express.

## ✨ Features

- 🔐 JWT-based user authentication (register/login)
- 💬 Chat logging with pagination & user linkage
- 📦 MongoDB Atlas integration via Mongoose
- 📮 Newsletter subscription & scheduled digest emails
- 🧘 REST API for verses, tags, chatbot interaction

## 🛠️ Tech Stack

- Node.js, Express.js
- MongoDB + Mongoose
- dotenv, bcrypt, jsonwebtoken
- CORS, Express middleware
- Node-cron (for newsletter scheduling)

## 🗂️ Key Routes

| Route                  | Purpose                      |
|-----------------------|------------------------------|
| `POST /auth/login`    | User login                   |
| `POST /auth/register` | New user registration        |
| `GET /chatbot/history`| Paginated chat fetch         |
| `POST /chatbot/ask-gemini` | Gemini-powered reply |
| `GET /tags/:tag`      | Get verses under a tag       |

## 🔑 Environment Variables (`.env`)
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
GOOGLE_API_KEY=your_gemini_api_key

## 🚀 Start Server

```bash
npm install
node index.js


