const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

const configuredOrigins = [
  process.env.CLIENT_URL,
  process.env.CORS_ORIGINS,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://stately-bunny-80d677.netlify.app',
]
  .filter(Boolean)
  .flatMap((origin) => origin.split(','))
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

const allowedOrigins = [...new Set(configuredOrigins)];

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
};

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// CORS configuration (crucial for cookies to work!)
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Serve static upload files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const contactRequestRoutes = require('./routes/contactRequestRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const aiRoutes = require('./routes/aiRoutes');
const crmRoutes = require('./routes/crmRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const currencyRoutes = require('./routes/currencyRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/contact-requests', contactRequestRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/currency', currencyRoutes);

// Backward-compatible routes for deployed clients built with the API root URL.
app.use('/auth', authRoutes);
app.use('/properties', propertyRoutes);
app.use('/categories', categoryRoutes);
app.use('/contact-requests', contactRequestRoutes);
app.use('/admin', adminRoutes);
app.use('/upload', uploadRoutes);
app.use('/ai', aiRoutes);
app.use('/crm', crmRoutes);
app.use('/complaints', complaintRoutes);
app.use('/currency', currencyRoutes);

// Root endpoint for healthcheck
app.get('/', (req, res) => {
  res.send('House Finder API is running...');
});

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
