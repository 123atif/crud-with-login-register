require('dotenv').config()
const jwt = require('jsonwebtoken')

//---- Middleware for auth Token ---- 
function authenticateToken(request, response, next) {
    const authHeader = request.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return response.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {

        if (err) return response.sendStatus(403)
        //decoded object user after verfication is assigned to request.user
        request.user = user
        next()
    })
}

function forgetPasswordAuthToken(request, response, next) {
    const authHeader = request.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    console.log("token------------", token)
    if (token == null) return response.sendStatus(401)

    jwt.verify(token, process.env.FORGETPASSWORD_TOKEN_SECRET, (err, user) => {
        console.log(err)
        if (err) return response.sendStatus(403)
        //decoded object user after verfication is assigned to request.user
        request.user = user
        next()
    })
}


function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
  }

module.exports = {
    authenticateToken,
    isLoggedIn,
    forgetPasswordAuthToken
}