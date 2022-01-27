const express = require("express")
const { Socket } = require("socket.io")
const app = express()
app.use(express.static(__dirname + '/views/'));
const server = require("http").createServer(app)
const io = require("socket.io")(server, {cors: {origin: "*"}})

app.set('view engine', 'html');

app.engine('html', require('ejs').renderFile);

//app.use('/img', express.static(__dirname + '/Images'));

app.get("/", (req, res) => {
    res.render("score_fore_image")
})


server.listen(3001, () => {
    console.log("server läuft")
})

var userarray = []
io.on("connection", (socket) => {
    console.log(socket.id)
    var socketarray = []

    socket.on("disconnect", function() {
        userarray.splice(-1)
    })
    


    
    userarray.push(socket.id)
    

    io.emit("userjoin", userarray)
    socket.on("model", (counter, result, gamefield, player, position, room) => {      // io.emit == an alle clients, socket.braodcast.emit = an alle ausser den sendenden client
        gamefield[result[0]][result[1]].push(player)
        //counter++;
        //var ps = socket.id
        console.log(gamefield, socket.id);

        var servergamefield = gamefield 
        var servercounter = counter
        socketarray.push(socket.id)
        console.log(room)

        
        
        socket.broadcast.emit("view", servergamefield, servercounter, position)
        
        io.emit("gamefieldupdate", servergamefield, socketarray)
        
    })
})