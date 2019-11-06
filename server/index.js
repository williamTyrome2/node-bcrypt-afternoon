require('dotenv').config();
const express = require('express');
const session = require('expresssission');
const massive = require('massive')
const authCtrl = require('./controllers/authController');
const treasureCtrl = require('./controllers/treasureController');
const auth = require('./middleware/authMiddleware');

const PORT = 4000

const {SESSION_SECRET, CONNECTION_STRING} = process.env;

const app = express()

app.use(express.json());
app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout);

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
app.get('/api/treasure/user', treasureCtrl.getUserTreasure);
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, treasureCtrl.getAllTreasure);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
    console.log('db connected')
});

app.use(
    session({
        resave: true, 
        saveUninitialized: false,
        secret: SESSION_SECRET,
    })
);
app.listen(PORT, () => console.log(`Listen on port ${PORT}`));