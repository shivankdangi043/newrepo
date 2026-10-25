# 🌾 Agri-Tech – Smart Farming Platform (MERN + MVC)

Data-driven web app that helps farmers manage farms, monitor soil & crop health, use weather forecasts and reduce agricultural risk.

## Tech stack
- **Frontend:** React (Vite), Tailwind CSS v4, Framer Motion, Recharts, Lucide, React Router DOM, Axios
- **Backend:** Node.js, Express.js (REST), JWT auth, bcrypt, Helmet, rate limiting
- **Database:** MongoDB + Mongoose
- **Pattern:** MVC (Models: `server/models`, Controllers/Routes: `server/routes`, Views: React `client/src`)
- **Design:** lavender, dusty blue, beige and olive palette, glassmorphism, dark mode, responsive (mobile bottom-nav)

## Features
Farmer: register/login, farm profile, crop lifecycle, live weather (geolocation, Open-Meteo), soil health score + fertilizer advice, disease detection with severity/treatment, agri store with cart + order history, Expert Desk (consultancy), dashboard charts and smart alerts.
Admin: verify farmers, inventory management + low-stock alerts, orders, sales analytics, answer farmer queries.

## Run locally
```bash
cd server && cp .env.example .env     # fill MONGO_URI, JWT_SECRET
npm install && node server.js         # API on :5000
cd ../client && npm install && npm run dev   # UI on :5173
```
Admin login = ADMIN_EMAIL / ADMIN_PASSWORD from `.env` (auto-created on first start).

## Deploy on Render
See the steps in the chat / `render.yaml` (Blueprint). Build: `npm run build`, Start: `npm start`.
