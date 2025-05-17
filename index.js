const express = require("express");
const dbconnection = require("./database");
const songsRouter = require("./Routes/songs");
const cors = require("cors");
// const { router } = require("./Routes/admin");
const adminrouter = require("./Routes/admin");
const discographyRouter = require("./Routes/discography");

const port = 5000;
const server = express()

server.use(cors({
    origin:["https://rad-douhua-2ff8b3.netlify.app","http://localhost:5173"],
  
}
))
server.use(express.json());
dbconnection()
server.use('/api', adminrouter);
server.use("/api", songsRouter)
server.use('/api',discographyRouter)
server.listen(port,() => {
    console.log(`Server is running on port ${port}`)
})