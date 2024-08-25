const express = require("express");
const session = require('express-session');
const morgan = require("morgan")
const cors = require('cors')
const { PORT, mongoDBURL } = require("./database/config.js");
const { checkConnection } = require("./database/connection.js");
const appRoute = require("./routes/userRoute.js")
const taskRoute = require("./routes/taskRoute.js")
const passport = require('passport');

const app = express()

//---- Middleware for parsing request body ---- 
app.use(express.json());
app.use(morgan('dev'))
app.use(cors());
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


app.use('/user', appRoute);
app.use('/task', taskRoute);

app.use('/Images', express.static('./Images'))

app.get('/', (request, response) => {
    response.send("Welcome to App");
});


// app.get('/logout', (req, res) => {
//     req.logout();
//     req.session.destroy();
//     res.send('Goodbye!');
// });

// app.get('/auth/failure', (req, res) => {
//     const redirectUrl = `${FAIL_URL}?error=loginError`;
//     res.redirect(redirectUrl);
// });

//----------------MongoDB Connection-------------------
checkConnection(app, PORT, mongoDBURL);