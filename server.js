const express = require("express");
const app = express();
const gameRoutes = require("./routes/gameRoutes");
app.use(express.json());
app.use("/api/game", gameRoutes);


app.use(express.static("public"))


app.listen(3000, () => {
  console.log("Server running on port 3000");
})
;