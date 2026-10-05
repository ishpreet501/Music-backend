require("dotenv").config();
const dns = require("dns");
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
  console.warn("DNS server setup warning:", e.message);
}
const express = require("express");
const dbconnection = require("./database");
const songsRouter = require("./Routes/songs");
const cors = require("cors");
// const { router } = require("./Routes/admin");
const adminrouter = require("./Routes/admin");
const discographyRouter = require("./Routes/discography");
const contactRouter = require("./Routes/contact");

const port = process.env.PORT || 5000;
const server = express();

server.use(cors({
    origin: [
      "https://rad-douhua-2ff8b3.netlify.app",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000"
    ],
}));
server.use(express.json());
dbconnection();

server.use('/api', adminrouter);
server.use('/api', songsRouter);
server.use('/api', discographyRouter);
server.use('/api', contactRouter);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});