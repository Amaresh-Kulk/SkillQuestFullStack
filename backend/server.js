const express = require('express');
const connectDB = require('./config/db');
const usersRouter = require('./routes/users'); // Import user routes
const aptitudeRouter = require('./routes/aptitude'); // Import aptitude routes
const codingRouter = require('./routes/coding'); // Import coding routes
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', usersRouter); // Route for user-related operations
app.use('/api/aptitude', aptitudeRouter); // Route for aptitude-related operations
app.use('/api/coding', codingRouter); // Route for coding-related operations

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
