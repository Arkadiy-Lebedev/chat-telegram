const express = require("express");
const TelegramBot = require('node-telegram-bot-api');
const app = express();
const server = require('http').Server(app);
// const server = http.createServer(app);
require('dotenv').config()
const port = process.env.PORT || 5000;
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});
// const io = new Server(server);



const cors = require('cors');
const corsOptions ={
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204
}
// app.use(cors(corsOptions));

app.use(cors(corsOptions))




// app.use(express.json());
// // Для парсинга application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));



// app.use("/", require("./routes/posts"));

let users = [];

const token = process.env.TOKEN;
const bot = new TelegramBot(token, {polling: true});


app.get('/', (req, res) => {
  res.send('hello world')
});


io.on('connection', (socket) => {
  console.log('a user connected ' + socket.id);

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);    
    bot.sendMessage(process.env.CHATID, msg)
      .then(payload => {
        console.log(payload)
        console.log(socket.id)
        users.push({"socket":socket.id, "userid": payload.from.id})
        console.log(users)
      bot.once('message', (msg) => {
                         console.log(msg) // callback for sendMessage
                 });
    })
    
  .catch((error) => {
  console.log(error.code);  // => 'ETELEGRAM'
  console.log(error.response.body); // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }
});
  });
  console.log(users)
  socket.on('disconnect', function () {
    console.log('разъединился: ', socket.id);
    let newarray = users.filter(el => el.socket == socket.id)
    users = newarray;
    console.log("пользоатль новые", users)
  });
});



  bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    
  
    // bot.sendMessage(chatId, 'Received your message2');

    // io.emit('chat message', msg); // отправка всем

    // отправить конкретному сокету, по socketid
    let user = users.find(el => el.userid == msg.reply_to_message.from.id)
    console.log(user)
    console.log(users)
    console.log(msg.reply_to_message.from.id)
    console.log(user.socket)
    console.log(msg)
    if (user) {
      io.to(user.socket).emit('private message', msg);  
    }
   
  });


  server.listen(port, () => {
    console.log(`App listening on port ${port}`);
   
  });

  
  