require('dotenv').config()
const { sendEmail } = require("../mailer.js")
const crypto = require('crypto');
const jwt = require('jsonwebtoken')
const User = require("../models/user.js")
const { generateAccessToken, generateRefreshToken, generateOTP } = require('../helperFunctions.js')
const Task = require("../models/task.js");


// let refreshTokens = []

//----------------------- Registration -----------------------
const registration = async (request, response) => {
    const { name, email, password: plainTextPassword, dateofbirth, address } = request.body;
    console.log("req.body", request.body);
    if (!email || !plainTextPassword || !name || !dateofbirth || !address || typeof email !== 'string' || typeof plainTextPassword !== 'string' || typeof name !== 'string' || typeof dateofbirth !== 'string' || typeof address !== 'string') {
        return response.status(400).send({ status: false, message: "User Input Error" });
    }


    // Hashing Password
    const password = crypto.createHash('sha256').update(plainTextPassword).digest('hex');
    let image;
    if (request.file) {
        image = request.file.filename;
        console.log('image-------------', image)
    }
    // console.log('image-------------', request.file.filename);
    // console.log('image-------------', request.file.originalname);
    // console.log('req-------------', request);

    try {
        const user = await User.create({
            name,
            email,
            password,
            dateofbirth,
            address,
            image,
            otp: generateOTP()
        })
        console.log("ResponseUser----------------", user)

        const link = `http://localhost:3001/register`

        return sendEmail(user, link, response)
    } catch (error) {
        if (error.code === 11000) {
            return response.status(400).send({ status: false, message: "Email already in use" });
        }
        console.log('Error---------------------------', error)
        return response.status(400).send({ status: false, message: "Error in Registration" });
    }



    // return response.status(200).send({ status: true, message: "Registration Successful" });
}

//----------------------- Login -----------------------
const login = async (request, response) => {
    try {
        const { email, password } = request.body

        console.log("Request----------", request.body)
        const user = await User.findOne({ email }).lean()

        if (!user) {
            return response.status(400).send({ status: false, message: "User NOT Found" });
        }

        const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

        if (passwordHash == user.password) {
            const accessToken = generateAccessToken(user._id, user.email)
            return response.status(200).send({ status: true, accessToken: accessToken, userEmail: user.email })
        }
        if (request.headers) {
            console.log('header----------------', request.headers)
        }
        return response.status(400).send({ status: false, message: "Invalid Password" });
    } catch (error) {
        console.log('Error---------------------------', error)
        return response.status(400).send({ status: false, message: "Error in Login" });
    }
}


//----------------------- Update User -----------------------
const updateuser = async (request, response) => {

    try {
        const { newName, newEmail, newDateofbirth, newAddress } = request.body;
        const user = request.user;

        if (user) {
            if (!newEmail || !newName || !newDateofbirth || !newAddress || typeof newEmail !== 'string' || typeof newName !== 'string' || typeof newDateofbirth !== 'string' || typeof newAddress !== 'string') {
                return response.status(400).send({ status: false, message: "User Input Error" });
            }
            // const passwordHash = crypto.createHash('sha256').update(plainTextPassword).digest('hex');

            let newImage;
            if (request.file) {
                newImage = request.file.originalname;
            }
            const userData = await User.findByIdAndUpdate({ _id: user.id }, {
                $set: {
                    name: newName,
                    email: newEmail,
                    // password: passwordHash,
                    dateofbirth: newDateofbirth,
                    address: newAddress,
                    image: newImage
                }
            })
            return response.status(200).send({ status: true, message: "Updation Successful" });
        }
        else {
            return response.status(400).send({ status: false, message: "User NOT Found" });
        }
    } catch (error) {
        return response.status(400).send({ status: false, message: "Error in Login" });
    }
}

//----------------------- forget Password -----------------------
const forgetPassword = async (request, response) => {
    try {
        const { email } = request.body;
        const user = await User.findOne({ email });

        if (user) {
            const secret = process.env.FORGETPASSWORD_TOKEN_SECRET;
            const payload = {
                id: user._id,
                email: user.email
            }
            const token = jwt.sign(payload, secret, { expiresIn: '15m' })
            const link = `http://localhost:3001/resetpassword?token=${token}`
            console.log(link)
            return sendEmail(user, link, response)
        }
        else {
            return response.status(400).send({ status: false, message: "User NOT Found" });
        }

    } catch (error) {
        console.error('Error!!!---------------:', error);
        return response.status(400).send({ status: false, message: "Error in forget password" });
    }
}


//----------------------- Reset Password -----------------------
const resetPassword = async (request, response) => {
    try {
        const newPassword = request.body.newpassword;
        const user = await User.findById({ _id: request.user.id });

        if (user) {
            try {
                if (!newPassword || typeof newPassword !== 'string') {
                    return response.status(400).send({ status: false, message: "User Input Error" });
                }

                const passwordHash = crypto.createHash('sha256').update(newPassword).digest('hex');

                if (passwordHash == user.password) {
                    return response.status(200).send({ status: true, message: "Password Reset Completed... Same as previous Password" });
                }

                const userData = await User.findByIdAndUpdate({ _id: user.id }, { $set: { password: passwordHash } })
                return response.status(200).send({ status: true, message: "Password Reset Completed" });
            } catch (error) {
                return response.status(400).send({ status: false, message: "Token Invalid!!!" });
            }
        }
        else {
            return response.status(400).send({ status: false, message: "User NOT Found" });
        }

    } catch (error) {
        console.error('Error!!!---------------:', error);
        return response.status(400).send({ status: false, message: "Error in Reset Password" });
    }
}

//----------------------- Get USER -----------------------
const getUser = async (request, response) => {
    try {
        console.log('GET USER _____ request id--------------------', request.user.id)
        const userData = await User.findById({ _id: request.user.id });

        console.log('user--------------------', userData)
        return response.status(200).send({ status: true, user: userData });
    } catch (error) {
        console.error('Error!!!---------------:', error);
        return response.status(400).send({ status: false, message: "Error in get User Data" });
    }
}

//----------------------- user input OTP Verify -------
const verifyOTP = async (request, response) => {
    try {
        const { email, otp } = request.body;

        const user = await User.findOne({ email });

        if (!user) {
            return response.status(400).send({ status: false, message: "User NOT Found" });
        }

        if (user.otp !== otp) {
            return response.status(400).send({ status: false, message: "Invalid OTP" });
        }

        if (user.verified == true) {
            return response.status(200).send({ status: true, message: "User already Verified" });
        }
        let verify = true;

        const userData = await User.findByIdAndUpdate({ _id: user.id }, {
            $set: {
                verified: verify
            }
        })
        return response.status(200).send({ status: true, message: "OTP verification successful" });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return response.status(400).send({ status: false, message: "Error in Verifying OTP" });
    }
}

//----------------------- Update Password -----------------------
const updatePassword = async (request, response) => {
    try {
        console.log('GET USER update password _____ request id--------------------', request.user.id)
        const user = await User.findById({ _id: request.user.id });

        const { oldPassword, newPassword } = request.body;

        if (user) {
            const passwordHash = crypto.createHash('sha256').update(oldPassword).digest('hex');

            if (passwordHash != user.password) {
                return response.status(400).send({ status: false, message: "Invalid Old Password" });
            }
            if (oldPassword == newPassword) {
                return response.status(400).send({ status: false, message: "new password same as old password" });
            }
            const newpasswordHash = crypto.createHash('sha256').update(newPassword).digest('hex');
            const userData = await User.findByIdAndUpdate({ _id: user.id }, {
                $set: {
                    password: newpasswordHash,

                }
            })
            return response.status(200).send({ status: true, message: "Updation of Password Successful" });
        } else {
            return response.status(400).send({ status: false, message: "User NOT Found" });
        }
    } catch (error) {
        console.error('Error!!!---------------:', error);
        return response.status(400).send({ status: false, message: "Error in get User Data" });
    }
}

//----------------------- delete User -----------------------
const deleteUser = async (request, response) => {
    try {

        console.log('delete User-------------------');
        const userId = request.params.id;
        const user = await User.findById({ _id: userId });
        if (!user) {
            return response.status(400).send({ status: false, message: 'User NOT Found' });
        }

        taskArray = user.tasks;

        // for (let i = 0; i < taskArray.length; i++) {
        //     let taskId = taskArray[i];

        // await Task.deleteOne({ _id: taskId });
        await Task.deleteMany({ user: userId });
        //     const index = taskArray.indexOf(taskId);

        //     console.log('index-----------------', index);

        //     const x = taskArray.splice(index, 1);
        // }

        await User.deleteOne({ _id: userId });

        return response.status(200).send({ status: true, message: 'User Deleted Successfully' });
    } catch (error) {
        console.error('Error!!!---------------:', error);
        return response.status(400).send({ status: false, message: "Error in deleting User Data" });
    }
}

module.exports = {
    registration,
    login,
    updateuser,
    forgetPassword,
    resetPassword,
    getUser,
    verifyOTP,
    updatePassword,
    deleteUser
}