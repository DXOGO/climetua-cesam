const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;
  
// Enable CORS for all routes
app.use(cors());

// Import your Thredds route
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

// const http = require('http');
// const server = http.createServer(app); // Create an HTTP server instance

// server.setTimeout(600000); // Set timeout to 10 minutes

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   res.header('Access-Control-Max-Age', '86400');
//   next();
// });