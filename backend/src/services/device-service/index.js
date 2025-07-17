const express = require('express');
const app = express();
require("dotenv").config();
const { connectDb } = require('./src/config/db');

const cors = require('cors');

// Apply CORS middleware early
app.use(cors({
  origin: true,           
  credentials: true       
}));

// JSON parser
app.use(express.json());

// Routers
const deviceRouter = require('./src/routes/deviceRoutes');
app.use('/api/devices', deviceRouter);

// DB Connect
connectDb();

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'device-service' });
});

// Start server
const PORT = process.env.SERVER_PORT || 5003;
app.listen(PORT, () => {
  console.log(`Device service running on port ${PORT}`);
});
