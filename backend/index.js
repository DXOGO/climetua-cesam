const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;
  
// Enable CORS for all routes
app.use(cors());

// Import Thredds route
const threddsRoute = require('./routes/thredds');

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/api', threddsRoute);

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the CESAM backend service!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});