const jwt = require('jsonwebtoken')
const moment = require('moment');
require('dotenv').config()

//----------------Helper Functions-------------------

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}

function generateAccessToken(id, email) {
    return jwt.sign({ id, email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '36000s' })
}
//3600seconds = 60minutes


function generateRefreshToken(id, email) {
    return jwt.sign({ id, email }, process.env.REFRESH_TOKEN_SECRET)
}

async function checkTaskExpiry(tasks) {
    let currentDate = moment().format('YYYY-MM-DD');

    for (let i = 0; i < tasks.length; i++) {
        let taskEndDate = moment(tasks[i].end_date).format('YYYY-MM-DD');

        if (taskEndDate < currentDate) {
            tasks[i]['expiry_status'] = true;
        } else {
            tasks[i]['expiry_status'] = false;
        }
    }
    return tasks;
}

async function datesValidation(start_date, end_date) {
    let currentDate = moment().format('YYYY-MM-DD');

    if (start_date > currentDate && end_date > currentDate) {
        return true;
    } else {
        return false;
    }
}

async function checkTaskStatus(tasks) {

    for (let i = 0; i < tasks.length; i++) {
        if(tasks[i].status == "Done")
        {
            tasks[i].statusNo = 2;
        }
        else if(tasks[i].status == "Inprogress")
        {
            tasks[i].statusNo = 1;
        }
        else
        {
            tasks[i].statusNo = 0;
        }
    }
    return tasks;
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    generateOTP,
    checkTaskExpiry,
    checkTaskStatus,
    datesValidation
}




// tasks[i].expiry_status = false;
// task['expiry_status'] = false;
// tasks[i] = Object.assign({}, tasks[i], { newKey: 'newValue' });
// let task = tasks[i];
// task = { ...task, newKey: 'newValue' };
// data.push(task);
// console.log('task--------------', tasks[i])
// tasks[0]['status'] = 'todo';
// tasks[0].expiry = 'false';


// {
//     '$__': InternalCache { activePaths: [StateMachine], skipId: true },
//     '$isNew': false,
//     _doc: {
//       _id: new ObjectId('66026150b0824508eb2981cd'),
//       title: 'Udemy Academy',
//       description: 'vnmcsdpqwdjpwxnclncnqwnpqwdnwpdnqwpdqwpdnqwpdwdqwdqwdwqdq',
//       status: 'inprogress',
//       start_date: '2024-03-20',
//       end_date: '2024-03-15',
//       user: new ObjectId('65fd5798c0419826a74b4fd4'),
//       __v: 0
//     },
//     newKey: 'newValue'
//   }