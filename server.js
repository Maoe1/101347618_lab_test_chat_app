const app = require('express')()
const server = require('http').createServer(app)
const cors = require('cors')
const req = require('express/lib/request')
const res = require('express/lib/response')
const { Socket } = require('socket.io')
const mongoose = require('mongoose');
const UserRouter = require('./UserRoutes.js');
const PORT = 3000

//Create Server Side socket
const io = require('socket.io')(server)

app.use(cors())

//Default Express GET
app.get("/", (req, res) => {
    res.send("<h1>Welcome to Socket Programming</h1>")
})

//Get index.html
app.get("/signup.html", (req, res) => {
    res.sendFile(__dirname + "/signup.html")
})

//Get index.html
app.get("/login.html", (req, res) => {
    res.sendFile(__dirname + "/login.html")
})

// Create a namespace for chat rooms

//Accept client request
io.on('connection', (socket) => {
    console.log('A user connected');
  
    socket.on('join room', (room) => {
      console.log(`User joined room: ${room}`);
      socket.join(room);
    });


    socket.on('message', (message) => {
        console.log(`Message received: ${message}`);
      });


    
  });

mongoose
.connect(
    'mongodb+srv://maoe1:google123@cluster0.mtvhcjr.mongodb.net/chat_application?retryWrites=true&w=majority',
    {
        useNewUrlParser : true,
        useUnifiedTopology: true
    }
)
.then((success) =>{
    console.log("Success MongoDdb connection");
})
.catch((err) =>
{
    console.log('Error Mongodb connection');
});

app.use(UserRouter);

//Start HTTP server
server.listen(PORT, () => {
    console.log(`Server running at PORT ${PORT}`)
})