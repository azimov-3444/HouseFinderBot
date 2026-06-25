# House Finder Telegram Bot

Telegram catalog bot for the House Finder project. The bot uses the same backend API and MongoDB data as the website.

## Stack

- Node.js
- node-telegram-bot-api
- MongoDB and Mongoose
- Axios
- dotenv
- Nodemon

## Features

- Browse active website listings from `GET /api/properties/catalog`
- View listing cards and details
- Open listing map location
- Open listing page on the website
- Save and remove favorites
- Search by price, property type, city, and Telegram location
- Submit contact requests into the shared `ContactRequest` MongoDB collection
- Store Telegram users and favorites in MongoDB

## Setup

```bash
cd telegram-bot
npm install --strict-ssl=false
copy .env.example .env
```

Edit `.env`:

```env
BOT_TOKEN=your_botfather_token_here
BOT_USERNAME=@your_bot_username
MONGO_URI=mongodb://localhost:27017/house-finder
API_BASE_URL=http://localhost:5000/api
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Use the same `MONGO_URI` as the backend.

## Development

Start the backend first:

```bash
cd ../backend
npm run dev
```

Start the bot with nodemon:

```bash
cd ../telegram-bot
npm run dev
```

## Render Deploy

This bot uses Telegram polling, so deploy it as a Render Background Worker, not as a normal Web Service.

If you use the root `render.yaml`, Render will create a worker with:

- Root directory: `telegram-bot`
- Build command: `npm install --strict-ssl=false`
- Start command: `npm start`

Add these environment variables in Render:

```env
BOT_TOKEN=your_botfather_token_here
BOT_USERNAME=@your_bot_username
MONGO_URI=your_mongodb_connection_string
API_BASE_URL=https://your-backend-service.onrender.com/api
CLIENT_URL=https://your-frontend-domain
NODE_ENV=production
```

Important: `API_BASE_URL` cannot be `http://localhost:5000/api` on Render. The backend must also be deployed and reachable from the worker.

## Commands

- `/start`
- `/properties`
- `/search`
- `/favorites`
- `/contact`
- `/help`

## Notes

- Telegram cannot fetch `localhost` image URLs. In production, use public image URLs or open the listing through the website button.
- If npm fails with `UNABLE_TO_VERIFY_LEAF_SIGNATURE`, run install with `--strict-ssl=false` in this project.
