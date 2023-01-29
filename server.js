const express = require("express");
const TelegramBot = require('node-telegram-bot-api');
const app = express();
const server = require('http').Server(app);
let S = require('string');
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

app.use(cors(corsOptions))

let users = [];

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

const schema = {
  "name": "",
  "tokens": [],
  "message": []
}

const schemaMessege = {
  "text": "",
  "date": "",
  "role": ""
}


app.get('/', (req, res) => {
  res.send('hello world')
});


io.on('connection', (socket) => {
  console.log('a user connected ' + socket.id);

  // ловим событие первого подключения клиента
  socket.on('new message', function(data){
    console.log("данные сообщение", JSON.parse(data));
    
    let datamsg = JSON.parse(data)
    let user = users.find(el => el.name == String(datamsg.name));
    console.log(user)
    if (user) {
      console.log("данные токена", user.tokens) 
      user.tokens.push(socket.id)
       io.to(socket.id).emit('private message', user.message);
      console.log('юзер есть', user)

    } else {
      users.push({
        "name": String(datamsg.name),
        "tokens": [socket.id],
        "message": []
      })
       
    }
 console.log("юзеры", users);

  });


  // ловим события сообщений от клиента

  socket.on('chat message', (msg) => {
    let msgParse = JSON.parse(msg)
    console.log('message parse: ' + msgParse);  
    console.log('message: ' + msgParse.message);  
    let user = users.find(el => el.name == msgParse.name);
    if (user) {
      console.log("пользователь найден", user) 
      let newMassege = {
        "text": S(msgParse.message).stripTags().s,
        "date": Date.now(),
        "role": 0
      }
      user.message.push(newMassege)    
      io.to(socket.id).emit('private message', newMassege);
    }
    
    bot.sendMessage(process.env.CHATID, msgParse.message + ' пользователь: ' + socket.id)
      .then(payload => {
        console.log(payload)
        console.log(socket.id)
        // users.push({"socket":socket.id, "userid": payload.from.id})
        console.log(users)
      bot.once('message', (msgParse) => {
                         console.log(msgParse) // callback for sendMessage
                 });
    })
    
  .catch((error) => {
  console.log(error.code);  // => 'ETELEGRAM'
  console.log(error.response.body); // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }
});
  });
  console.log(users)
  // socket.on('disconnect', function () {
  //   console.log('разъединился: ', socket.id);
  //   let newarray = users.filter(el => el.socket == socket.id)
  //   users = newarray;
  //   console.log("пользоатль новые", users)
  // });
});


// ловим сообщения с телеграмм и направляем пользователю
  bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    
  
    // bot.sendMessage(chatId, 'Received your message2');

    // io.emit('chat message', msg); // отправка всем

    // отправить конкретному сокету, по socketid
    // let user = users.find(el => el.userid == msg.reply_to_message.from.id)
   
    console.log(users)
    console.log(msg.reply_to_message.from.id)
   
    console.log(msg)

    let tokenUser = msg.reply_to_message.text.substr(-20);
      console.log(tokenUser)
    let userT = users.filter(el => el.tokens.find(elem => elem == tokenUser))


    let newMassege = {
      "text": msg.text,
      "date": Date.now(),
      "role": 1
    }
   
 
    if (userT) {
      console.log(typeof userT)
      console.log(userT)
      console.log(userT[0].tokens)
      
      userT[0].tokens.forEach(el => {
        console.log("el", el)
         io.to(el).emit('private message', newMassege);  
      })
      
      userT[0].message.push(newMassege)

     
      console(users)
}
   
   
  });


  server.listen(port, () => {
    console.log(`App listening on port ${port}`);
   
  });


  