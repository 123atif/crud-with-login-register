const mongoose = require("mongoose");

function checkConnection(app, PORT, mongoDBURL)
{
mongoose
    .connect(mongoDBURL)
    .then(()=>{
        console.log('App is connected to database');
        app.listen(PORT, () => {
            console.log(`App is listening to port: ${PORT}`);
        });
    })
    .catch((error)=>{
        console.log(error);
    })
}

module.exports = {
    checkConnection
}