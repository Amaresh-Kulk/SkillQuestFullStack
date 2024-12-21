const express = require('express');
const connectDB = require('./config/db');
const usersRouter = require('./routes/users');
const questionsRouter = require('./routes/questions');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', usersRouter);
app.use('/api/questions', questionsRouter);

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
