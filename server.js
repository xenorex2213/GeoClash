require("dotenv").config();
require("./models/db")
const express = require("express");
const app = express();
const gameRoutes = require("./routes/gameRoutes");
app.use(express.json());
app.use("/api/game", gameRoutes);


app.use(express.static("public"))


app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
})
console.log("API KEY:", process.env.OPENCAGE_KEY);
;