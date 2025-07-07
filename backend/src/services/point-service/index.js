const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

const cors = require('cors');

// Allow all origins with credentials
app.use(cors({
  origin: true,  // allows all origins
  credentials: true // allow cookies/auth headers
}));

// app.use(cors({
//   origin: 'https://www.geonex.site',
//   credentials: true
// }));



app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Point Service Connected to MongoDB"))
.catch(err => console.error("MongoDB Connection Error:", err));

// Routes
const pointRoutes = require("./src/routes/pointRoutes");
app.use("/api/points", pointRoutes);

// Start Service

const PORT = process.env.SERVER_PORT || 5005;
app.listen(PORT, () => console.log(`Point Service running on port ${PORT}`));


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'point-service' });
});