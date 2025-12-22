import express from "express"
import http from "http"
import colors from "colors"
import cors from "cors"
import {Server} from "socket.io"

const app = express()
app.use(cors())

const server = http.createServer(app)


const io = new Server(server,{
   cors:'http://localhost:5173'
})

server.listen(5174,()=>{
    console.log(`server started on port ${5174}`)
})

