// src/services/user-service/index.js
const express = require('express');
const app = express();
require("dotenv").config();
const {connectDb} = require('./src/config/db');

const exportRoutes = require('./src/routes/exportRoutes');
const cors = require('cors');


app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use('/api/export',exportRoutes);


connectDb();

const PORT = process.env.SERVER_PORT || 5006;
app.listen(PORT, () => {
  console.log(`Export service running on port ${PORT}`);
}
);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'export-service' });
});