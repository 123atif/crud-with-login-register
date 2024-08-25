require('dotenv').config()
const { generateAccessToken } = require('../helperFunctions.js')
const { google } = require('googleapis');
const axios = require('axios');
const User = require("../models/user.js")
const jwt = require('jsonwebtoken')

//---------------------------------GOOGLE--------------------------------------
// const CLIENT_URL = "http://localhost:3001/"
// const FAIL_URL = "http://localhost:3001/"
const googleURL = 'http://localhost:3000/user/google/callback';

const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    googleURL
);

//----------------------- get Google URL -----------------------
const getGoogleURL = async (request, response) => {
    try {
        const authUrl = oAuth2Client.generateAuthUrl({
            scope: [
                "openid",
                "email",
                "profile",

            ],
            redirect_uri: `${googleURL}`,
        });

        return response.json({ authUrl });
    } catch (error) {
        console.error('Error in URL:', error);
        return response.status(400).send({ status: false, message: "Could NOT generate google URL"});
    }
}

//---------------------- Google callback -----------------------
const googleCallback = async (req, res) => {
    const code = req.query.code;

    try {
        const { tokens } = await oAuth2Client.getToken(code);

        let userInfo = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${tokens.access_token}`
                }
            });

        if (userInfo) {
            try {
                const responseUser = await User.create({
                    name: userInfo.data.name,
                    email: userInfo.data.email,
                    image: userInfo.data.picture
                });

                const accessToken = generateAccessToken(responseUser._id, responseUser.email);
                res.redirect(`http://localhost:3000/?token=${accessToken}`);
            } catch (error) {
                if (error.code === 11000) {
                    const user = await User.findOne({ email: userInfo.data.email }).lean();
                    const accessToken = generateAccessToken(user._id, user.email);
                    res.redirect(`http://localhost:3000/?token=${accessToken}`);
                }
            }
        }
    } catch (error) {
        console.error('Error getting tokens:', error);
        return response.status(400).send({ status: false, message: "Error in Google Callback"});
    }
}


//------------ verify Token -------- 
const verifyToken = async (request, response) => {
    const authHeader = request.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return response.status(400).send({ status: false, message: "NO Token"});

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {

        if (err) return response.status(400).send({ status: false, message: "Error in Verifying Token"});
        return response.status(200).send({ status: true, accessToken: accessToken, userEmail: user.email })
    })
}

module.exports = {
    getGoogleURL,
    googleCallback,
    verifyToken
}