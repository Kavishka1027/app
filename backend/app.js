const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// import Routes
const userRoute = require("./routes/userRoute");
const petRoute = require("./routes/petRoute");
const foodItemsRoute = require("./routes/foodItemsRoute");
const dietPlanRoute = require('./routes/dietPlanRoute');

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',  // Your React frontend URL
  credentials: true,  // Allow credentials (cookies, session)
}));

app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },  // Change to true if using HTTPS
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoute);
app.use("/api/pets", petRoute);
app.use("/api/foods", foodItemsRoute);
app.use('/api/dietPlan', dietPlanRoute);

// Default route
app.get('/', (req, res) => {
  res.send('Pet Care Management System API');
});

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://dushan:dushan12345@cluster0.2usapid.mongodb.net/")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
