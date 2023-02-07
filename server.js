const app = require('express')()
const server = require('http').createServer(app)
const cors = require('cors')
const req = require('express/lib/request')
const res = require('express/lib/response')
const { Socket } = require('socket.io')
const mongoose = require('mongoose');
const UserRouter = require('./UserRoutes.js');
const PORT = 3000


const userModel = require('./User');
const messageModel = require('./message');

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
    console.log('a user connected');

    socket.on('join room', (username, room) => {
        console.log(`user ${username} joined room ${room}`);


      });
    
      socket.on('message', (message) => {
        const currentRoom = Object.keys(socket.rooms)[1];
        console.log(`received message ${message} in room ${currentRoom}`);
        io.to(currentRoom).emit('message', message);
    
        // Find the user who sent the message
        userModel.findOne({ socketId: socket.id }, (error, user) => {
          if (error) {
            console.error(error);
          } else {
            // Store the message in the database
            const messageToSave = new messageModel({
              room: currentRoom,
              sender: user._id,
              message: message,
              timestamp: new Date()
            });
            messageToSave.save((error) => {
              if (error) {
                console.error(error);
              } else {
                console.log(`message saved to database: ${messageToSave}`);
              }
            });
          }
        });
      });
    
      socket.on('disconnect', () => {
        console.log('user disconnected');
    
        // Remove the user from the database
        userModel.deleteOne({ socketId: socket.id }, (error) => {
          if (error) {
            console.error(error);
          } else {
            console.log(`user removed from database`);
          }
        });
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