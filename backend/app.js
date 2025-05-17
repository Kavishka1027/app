const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

//dotenv.config();

// Initialize Express App
const app = express();

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: { 
    origin: "http://localhost:3000", // Allow requests only from this origin
    methods: ["GET", "POST"],
    credentials: true, // Allow sending credentials like cookies
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("sendMessage", (message) => {
    io.emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow frontend app to communicate with the backend
  methods: ['GET', 'POST'], // Allow only GET and POST methods
  credentials: true, // Include credentials such as cookies
}));

app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }, // Set secure to true if using HTTPS
}));

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));




// Routes
const userRoute = require("./routes/userRoute");
const petRoute = require("./routes/petRoute");
const foodItemsRoute = require("./routes/foodItemsRoute");
const dietPlanRoute = require('./routes/dietPlanRoute');
const messageRoute = require("./routes/messageRoute");
const sellItemRoute = require("./routes/sellItemRoute");
const authRoute = require("./routes/authRoute");
const auctionRoute = require('./routes/auctionRoute');
const cartRoute = require("./routes/cartRoute");


app.use("/api/users", userRoute);
app.use("/api/pets", petRoute);
app.use("/api/foods", foodItemsRoute);
app.use('/api/dietPlan', dietPlanRoute);
app.use("/api/messages", messageRoute);
app.use('/api/sellItem', sellItemRoute);
app.use('/api/auctions', auctionRoute);
app.use('/api/cart', cartRoute);

 
app.use('/api/auth', authRoute);

// Default route
app.get('/', (req, res) => {
  res.send('Pet Care Management System API');
});

// Connect to MongoDB and Start Server
const PORT = process.env.PORT || 5000;

mongoose.connect("mongodb+srv://dushan:dushan12345@cluster0.2usapid.mongodb.net/petcare")
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));


