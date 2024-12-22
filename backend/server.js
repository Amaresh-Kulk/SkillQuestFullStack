//server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const fs = require("fs");
const { exec } = require("child_process");

// Import custom modules
const connectDB = require("./config/db");
const aptitudeRouter = require("./routes/aptitude");
const codingRouter = require("./routes/coding");
const runCodeRouter = require("./routes/runCode"); // Add runCode route
const testCaseRouter = require("./routes/testcase");
const usersRouter = require("./routes/users");



dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for testing; restrict in production
  methods: ['GET', 'POST'],
}));

app.use(bodyParser.json());
app.use(express.json());

// Ensure the userCode folder exists
const userCodeFolder = './userCode';
if (!fs.existsSync(userCodeFolder)) {
  fs.mkdirSync(userCodeFolder);
}

// Ensure the testcases folder exists
const testCasesFolder = './testcases';
if (!fs.existsSync(testCasesFolder)) {
  fs.mkdirSync(testCasesFolder);
}

// Routes
app.use("/api/users", usersRouter); // User-related operations
app.use("/api/aptitude", aptitudeRouter); // Aptitude-related operations
app.use("/api/coding", codingRouter); // Coding-related operations
app.use("/api/testcases", testCaseRouter); // Test case-related operations
app.use("/api/run", runCodeRouter);

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
