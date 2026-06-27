# HouseFinderBot

House Finder is a full-stack real estate web app for browsing, filtering, saving, and managing property listings. It includes a public React frontend, an admin dashboard, cookie-based JWT authentication, MongoDB models, property/category/contact request CRUD, image upload, and Leaflet map views.

## Tech Stack

- Frontend: React, Vite, React Router DOM, Axios, Tailwind CSS, Framer Motion, React Icons, Leaflet
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, cookie-parser, Multer, CORS, dotenv
- Auth: JWT stored in an httpOnly cookie, not localStorage

## Project Structure

- `frontend/` - React public site and admin dashboard
- `backend/` - Express API, Mongoose models, controllers, routes, middleware, upload handling, seed script
- `telegram-bot/` - node-telegram-bot-api catalog bot for users

## Frontend Setup

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Default frontend URL:

```text
http://localhost:5173
```

Frontend env:

```env
VITE_API_URL=http://localhost:5000/api
```

## Backend Setup

```bash
cd backend
npm install
copy .env.example .env
npm start
```

Default backend URL:

```text
http://localhost:5000
```

Backend env:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/house-finder
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173
```

Cookie auth requires the frontend origin to match `CLIENT_URL` or be listed in `CORS_ORIGINS`. In local development, use `http://localhost:5173`, not `http://127.0.0.1:5173`, unless you also update those values.

## Seed Demo Data

```bash
cd backend
npm run seed
```

Important: the seed script clears existing users, categories, and properties before inserting demo data.

Demo admin:

```text
email: admin@example.com
password: admin123
```

## Main Routes

Public:

- `/`
- `/properties`
- `/properties/:id`
- `/login`
- `/register`
- `/add-property`

Admin:

- `/admin/login`
- `/admin/dashboard`
- `/admin/properties`
- `/admin/add-property`
- `/admin/edit-property/:id`
- `/admin/categories`
- `/admin/requests`

## API Endpoints

Auth:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/register-admin`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Properties:

- `GET /api/properties`
- `GET /api/properties/:id`
- `GET /api/properties/featured`
- `GET /api/properties/similar/:id`
- `POST /api/properties`
- `PUT /api/properties/:id`
- `DELETE /api/properties/:id`
- `PATCH /api/properties/:id/status`

Categories:

- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

Contact requests:

- `POST /api/contact-requests`
- `GET /api/contact-requests`
- `PATCH /api/contact-requests/:id/status`
- `DELETE /api/contact-requests/:id`

Admin and upload:

- `GET /api/admin/stats`
- `POST /api/upload`

Admin-only API routes are protected by `protect` and `adminOnly` middleware.
Logged-in users can create property listings with `POST /api/properties`; edit/delete/status actions remain admin-only.

## Deployment Notes

- Set `NODE_ENV=production`.
- Use a strong `JWT_SECRET`.
- Set `CLIENT_URL` to the deployed frontend URL.
- Set `CORS_ORIGINS` to allowed frontend origins, separated by commas if there is more than one.
- Set `VITE_API_URL` to the deployed backend API URL including `/api`, for example `https://gw70.onrender.com/api`.
- For cross-site production cookies, the backend uses `secure: true` and `sameSite: "none"`.
- Use MongoDB Atlas or another managed MongoDB service for production.

## Telegram Bot

The `telegram-bot/` folder contains a user catalog bot. It reads listings from the backend API and writes Telegram contact requests to the same MongoDB database.

```bash
cd telegram-bot
npm install
copy .env.example .env
npm run dev
```

The bot has no admin commands or admin panel.

## AI Assistant

The site includes a floating AI assistant and AI search mode.

Backend env:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-5.5
```

AI endpoints:

- `POST /api/ai/chat` - answers user questions using current property listings as context
- `POST /api/ai/recommend` - converts natural language search into property filters
- `POST /api/ai/evaluate-price` - gives a price evaluation for a property

If `OPENAI_API_KEY` is missing, the backend returns a safe fallback response instead of crashing.

## Botpress Webchat

Tawk.to was removed and the frontend now supports Botpress Webchat.

In Botpress Dashboard:

1. Open your bot workspace.
2. Go to `Webchat > Deploy Settings`.
3. Copy the embed code.
4. Put the two script URLs into `frontend/.env`:

```env
VITE_BOTPRESS_INJECT_URL=https://cdn.botpress.cloud/webchat/vX.X/inject.js
VITE_BOTPRESS_CONFIG_URL=https://files.bpcontent.cloud/xxxx/xx/xx/xx/xxxxxxxxxxxxx-xxxxxxxx.js
```

Then restart the frontend dev server.

Botpress ADK CLI is also installed locally. If your terminal cannot find it yet, restart the terminal or run:

```powershell
C:\Users\user\AppData\Local\Programs\adk\adk.exe --version
```

To connect ADK to Botpress:

```powershell
adk login
```
