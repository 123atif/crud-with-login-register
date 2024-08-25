require('dotenv').config()
const { checkTaskExpiry, datesValidation, checkTaskStatus } = require('../helperFunctions.js')
const Task = require("../models/task.js");
const User = require("../models/user.js")

// const dateRegex = \d{2,4}\-\d{1,2}\-\d{1,2};
const dateRegex = /^\d{2,4}\-\d{1,2}\-\d{1,2}$/;

//----------------------- Add Task -----------------------
const addTask = async (request, response) => {
    try {
        const { title, description, status, start_date, end_date } = request.body;

        console.log("req.body--------", request.body);

        if (!title || !description || !start_date || !end_date || typeof title !== 'string' || typeof description !== 'string' || typeof start_date !== 'string' || typeof end_date !== 'string' || typeof status !== 'number') {
            return response.status(400).send({ status: false, message: "User Input Error" });
        }

        // Dates Validation
        if (!dateRegex.test(start_date) || !dateRegex.test(end_date)) {
            return response.status(400).send({ status: 'error', error: 'Invalid date format' });
        }

        const user = await User.findById({ _id: request.user.id });
        if (!user) {
            return response.status(400).send({ status: false, message: 'User NOT Found' });
        }

        let dateValid = await datesValidation(start_date, end_date);
        if (dateValid == false) {
            return response.status(400).send({ status: 'error', error: 'Invalid date format!!! Dates must be ahead of today' });
        }
        // creates an instance of task model
        const task = new Task({
            title,
            description,
            status,
            start_date,
            end_date,
            user: user._id
        });
        await task.save();

        user.tasks.push(task._id);
        await user.save();

        return response.status(200).send({ status: true, message: 'Task Added Successfully' });
    } catch (error) {
        console.log('Error add-------------------', error);
        return response.status(400).send({ status: false, message: 'Error in Adding Task' });
    }
}

//----------------------- Get Tasks -----------------------
const getTasks = async (request, response) => {
    try {
        const user = await User.findById({ _id: request.user.id });
        if (!user) {
            return response.status(400).send({ status: false, message: 'User NOT Found' });
        }
        console.log('req GET API search---------------', request.params.search);
        let userSearch = request.params.search;

        let allTasks = await Task.find({ user: request.user.id });

        if (!allTasks) {
            return response.status(400).send({ status: false, message: 'No Tasks Found!' });
        }

        if (userSearch) {
            console.log("inside userSearch-----");

            let tasks;
            if (userSearch != "0" && userSearch != "1" && userSearch != "2" && userSearch != "true" && userSearch != "false") {
                tasks = allTasks.filter(item =>
                    item.title.toLowerCase().includes(userSearch.toLowerCase()) ||
                    item.description.toLowerCase().includes(userSearch.toLowerCase()) ||
                    item.start_date.toLowerCase().includes(userSearch.toLowerCase()) ||
                    item.end_date.toLowerCase().includes(userSearch.toLowerCase())
                );
                // tasks = await Task.find(
                //     {
                //         "$or": [
                //             {"title": {$regex:userSearch}},
                //             {"description": {$regex:userSearch}}
                //         ]
                //     }
                // )
            }
            // else if (userSearch == "true" || userSearch == "false") {
            //     tasks = []
            //     for (let i = 0; i < allTasks.length; i++) {
            //         console.log("task--------", allTasks[i]);
            //         if (allTasks[i].expiry_status.toString() == userSearch) {
            //             tasks.push(allTasks[i]);
            //         }
            //     }
            // }
            if (tasks.length == 0) {
                return response.status(400).send({ status: false, message: 'NO Search Found!' });
            }


            tasks = await checkTaskExpiry(tasks);
            return response.status(200).json({ status: true, tasks });
        }
        return response.status(200).json({ status: true, tasks: allTasks });
    } catch (error) {
        console.log('Error read-------------------', error);
        return response.status(400).send({ status: false, message: 'Error in get Task' });
    }
};


//----------------------- Get Single Task -----------------------
const getSingleTask = async (request, response) => {
    try {
        const user = await User.findById({ _id: request.user.id });
        const taskId = request.params.id;

        if (!user) {
            return response.status(400).send({ status: false, message: 'User NOT Found' });
        }
        if (!taskId) {
            return response.status(400).send({ status: false, message: "Error! params id missing" });
        }

        let task = await Task.findById({ _id: taskId });
        return response.status(200).json({ status: true, task });
    } catch (error) {
        console.log('Error read-------------------', error);
        return response.status(400).send({ status: false, message: 'Error in get Task' });
    }
};


//----------------------- Update Tasks -----------------------
const updateTask = async (request, response) => {
    try {
        console.log('update-------------------', request.body);
        const taskId = request.params.id;

        if (!taskId) {
            return response.status(400).send({ status: false, message: "Error! params id missing" });
        }

        const { title, description, status, start_date, end_date } = request.body;

        console.log("req.body--------", request.body);

        if (!title || !description || !start_date || !end_date || typeof title !== 'string' || typeof description !== 'string' || typeof status !== 'number' || typeof start_date !== 'string' || typeof end_date !== 'string') {
            return response.status(400).send({ status: false, message: "User Input Error" });
        }

        // Dates Validation
        if (!dateRegex.test(start_date) || !dateRegex.test(end_date)) {
            return response.json({ status: 'error', error: 'Invalid date format' });
        }

        let dateValid = await datesValidation(start_date, end_date);
        if (dateValid == false) {
            return response.status(400).send({ status: 'error', error: 'Invalid date format!!! Dates must be ahead of today' });
        }

        const user = await User.findById({ _id: request.user.id });
        const task = await Task.findById({ _id: taskId });

        if (!user) {
            return response.status(400).send({ status: false, message: 'User NOT Found' });
        }
        if (!task) {
            return response.status(400).send({ status: false, message: 'Task NOT Found' });
        }
        if (task.user != user.id) {
            return response.status(400).send({ status: false, message: 'User have NO Access to update this task' });
        }
        const taskData = await Task.findByIdAndUpdate({ _id: taskId }, {
            $set: {
                title,
                description,
                status,
                start_date,
                end_date
            }
        })

        return response.status(200).send({ status: true, message: 'Task Updated Successfully' });
    } catch (error) {
        console.log('Error read-------------------', error);
        return response.status(400).send({ status: false, message: 'Error in updating Task' });
    }
};

//----------------------- Delete Task -----------------------
const deleteTask = async (request, response) => {
    try {
        console.log('delete-------------------');
        const taskId = request.params.id;
        const user = await User.findById({ _id: request.user.id });
        const task = await Task.findById({ _id: taskId });
        if (!user) {
            return response.status(400).send({ status: false, message: 'User NOT Found' });
        }
        if (!task) {
            return response.status(400).send({ status: false, message: 'Task NOT Found' });
        }
        if (task.user != user.id) {
            return response.status(400).send({ status: false, message: 'User have NO Access to delete this task' });
        }
        taskArray = user.tasks;
        await Task.deleteOne({ _id: taskId });
        const index = taskArray.indexOf(taskId);

        console.log('index-----------------', index);

        const x = taskArray.splice(index, 1);

        user.tasks = taskArray;
        await user.save();

        console.log(`myArray values: ${taskArray}`);
        console.log(`variable x value: ${x}`);

        return response.status(200).send({ status: true, message: 'Task Deleted Successfully' });
    } catch (error) {
        console.log('Error read-------------------', error);
        return response.status(400).send({ status: false, message: 'Error in deleting Task' });
    }
};


//----------------------- Search Tasks -----------------------
const searchTasks = async (request, response) => {
    try {
        console.log('req search---------------', request.params.key);
        let userSearch = request.params.key;
        if (!userSearch) {
            return response.status(400).send({ status: false, message: 'User Search is Empty' });
        }
        if (!request.user.id) {
            return response.status(400).send({ status: false, message: 'Token Error!!!' });
        }

        const allTasks = await Task.find({ user: request.user.id });
        if (!allTasks) {
            return response.status(400).send({ status: false, message: 'No Tasks Found!' });
        }
        let tasks;
        if (userSearch != "0" && userSearch != "1" && userSearch != "2" && userSearch != "true" && userSearch != "false") {
            tasks = allTasks.filter(item =>
                item.title.toLowerCase().includes(userSearch.toLowerCase()) ||
                item.description.toLowerCase().includes(userSearch.toLowerCase()) ||
                item.start_date.toLowerCase().includes(userSearch.toLowerCase()) ||
                item.end_date.toLowerCase().includes(userSearch.toLowerCase())
            );
        }

        // else if (userSearch == "0" || userSearch == "1" || userSearch == "2") {
        //     tasks = []
        //     for (let i = 0; i < allTasks.length; i++) {
        //         if(allTasks[i].status.toString() == userSearch)
        //         {
        //             tasks.push(allTasks);
        //         }
        //       }
        // }

        else if (userSearch == "true" || userSearch == "false") {
            tasks = []
            for (let i = 0; i < allTasks.length; i++) {
                console.log("task--------", allTasks[i]);
                if (allTasks[i].expiry_status.toString() == userSearch) {
                    tasks.push(allTasks[i]);
                }
            }
        }

        // const filteredRobots= this.state.robots.filter(robots => {
        //     return robots.name.toLowerCase().includes(this.state.searchfield.toLowerCase());
        // })
        if (!allTasks) {
            return response.status(400).send({ status: false, message: 'NO Search Found!' });
        }
        console.log('tasks search response-----------', tasks)
        return response.status(200).json({ status: true, tasks });
    } catch (error) {
        console.log('Error read-------------------', error);
        return response.status(400).send({ status: false, message: 'Error in searching Tasks' });
    }
};

module.exports = {
    addTask,
    getTasks,
    getSingleTask,
    updateTask,
    deleteTask,
    searchTasks
}
