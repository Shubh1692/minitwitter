// get all the tools we need
const express = require('express'),
    Config = require('./app.config'),
    app = express(),
    mongoose = require('mongoose'),
    passport = require('passport'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    http = require('http'),
    session = require('express-session'),
    path = require('path');
// connect app to database
mongoose.connect(Config.MONGOURL, {}).then((success) => {
    console.info('success connect mongo db')
}, (error) => {
    console.error('error connect mongo db', error)
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', Config.REQUEST_HEADER['Access-Control-Allow-Origin']);
    res.setHeader('Access-Control-Allow-Methods', Config.REQUEST_HEADER['Access-Control-Allow-Methods']);
    res.setHeader('Access-Control-Allow-Headers', Config.REQUEST_HEADER['Access-Control-Allow-Headers']);
    res.setHeader('Access-Control-Allow-Credentials', Config.REQUEST_HEADER['Access-Control-Allow-Credentials']);
    next();
});

app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(session({ secret: Config.EXPRESS_SESSION.SECRET, cookie: { maxAge: Config.EXPRESS_SESSION.COKKIES_MAX_AGE } }));
require('./server/Controllers/passport')(passport);
require('./server/route')(app, passport);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.set('port', (process.env.PORT || Config.NODE_SERVER_PORT));
app.use('/', express.static('build'));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/build/index.html'));
});
const appHttpServer = http.Server(app).listen(app.get('port'), () => {
    console.log(`server running at ${app.get('port')}`);
});
const io = require('socket.io')(appHttpServer);
require('./server/Controllers/socket')(io);
