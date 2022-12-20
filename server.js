require('dotenv').config();
let express = require('express');
let http = require('http');
let path = require('path');
let app = express();
let server = http.Server(app);
const TelegramBot = require('node-telegram-bot-api')
const token = process.env.TELEGRAM_API_TOKEN
const bot = new TelegramBot(token, { polling: true })
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({
    extended: false,
})

let users = require('./source/tg_users.json').users;

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/public/'));

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(5000, function() {
    console.log('Run server by port 5000');
});

app.post('/new_order', urlencodedParser, function (
    request,
    response
) {
    if (!request.body) return response.sendStatus(400)
    let resStr = "Пользователь "+ request.body.name + " с номером " + request.body.phone + " оставил заявку на покупку: \n";
    for(const sneaker of JSON.parse(request.body.order)){
        resStr+= sneaker.model + " " + sneaker.size + " размера;\n "
    }
    for (let i = 0; i < users.length; i++) {
        bot.sendMessage(users[i],  resStr)
    }
    response.sendStatus(200)
})

app.get('/sneakers/nike', function (request, response) {
    response.send(require('./source/sneakers.json').nike)
})

app.get('/sneakers/adidas', function (request, response) {
    response.send(require('./source/sneakers.json').adidas)
})

app.get('/sneakers/fila', function (request, response) {
    response.send(require('./source/sneakers.json').fila)
})

app.get('/sneakers/zara', function (request, response) {
    response.send(require('./source/sneakers.json').zara)
})

app.get('/sneakers/chanel', function (request, response) {
    response.send(require('./source/sneakers.json').chanel)
})

app.get('/sneakers/hm', function (request, response) {
    response.send(require('./source/sneakers.json').hm)
})

app.get('/photo/:path', function (request, response) {
    if(request.params.path.match("([^/:*?<>|\\\\]+(.(jpg|png|gif))$)")){
        response.sendFile(__dirname+ '/source/image/'+ request.params.path);
    }
})