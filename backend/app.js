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


app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Routes
app.use("/api/users", userRoute);
app.use("/api/pets", petRoute);
app.use("/api/foods", foodItemsRoute);
app.use('/api/dietPlan', dietPlanRoute);

app.use('/api/sellItem', sellItemRoute);

// Default route
app.get('/', (req, res) => {
  res.send('Pet Care Management System API');
});

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://root:root@cluster1.xycb3.mongodb.net/myDatabase")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
 