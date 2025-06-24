require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const seatRoutes = require('./routes/seats');
const errorHandler = require('./middleware/errorHandler');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('./cron');

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 requests per windowMs
});
app.use(limiter);
const reportRoutes = require("./routes/reportRoutes");
app.use("/api/reports", reportRoutes);


// Routes
app.use('/api/seats', seatRoutes);
app.use(errorHandler);

// Default route
app.get('/', (req, res) => {
  res.send('SitWise backend is running 🚀');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
