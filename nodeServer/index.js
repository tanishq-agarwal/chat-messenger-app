// Node server which will handle socket io connections

const io = require('socket.io')(8000)

const users = {};

io.on('connection',  socket => {
    //If any new user joins, let other users connected to the server know!
    socket.on('new-user-joined', name => { //event name can be anything here it is 'new-user-joined'. As soon as new user join the chat io.on listens it and calls the arrow function 
        users[socket.id] = name; //socket.on gives the name of the new user joined in.
        socket.broadcast.emit('user-joined', name); //tell everyone in the chat group that this user has newly joined
    });

    socket.on('send', message => { 
        //If someone sends a message, broadcast it to other people
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    socket.on('disconnect', message => {
        //If someone leaves the chat, let other people know
        socket.broadcast.emit('leave', users[socket.id])
        delete users[socket.id];
    });
})

