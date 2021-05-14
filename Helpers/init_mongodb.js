const mongoose = require('mongoose');
//require('dotenv').config();
/**
 * Database connection
 */
mongoose.connect(process.env.DB_CON, { useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true})
    .then(() => {
        console.log('mongodb connected !')
    })
    .catch((err) => {
        console.log(err.message)
    });

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to db !')
});

mongoose.connection.on('error', (err) => {
    console.log(err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection is disconnected.')
})
/**
* DB connection close while closing the application using ctrl+c
*/
process.on('SIGINT', async () => {
    await mongoose.connection.close()
    process.exit(0)
})


