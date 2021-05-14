const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
require('dotenv').config();
require('./Helpers/init_mongodb');
const AuthRoute = require('./Routes/Auth.route');
const { verifyAccessToken } = require('./Helpers/jwt_token');
require('./Helpers/init_redis');
const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', verifyAccessToken, async (req, res, next) => {
    res.send(`hello from api`);
});


app.use('/auth', AuthRoute);

app.use(async (req, res, next) => {
    //next(createError.NotFound());
    next(createError.NotFound('This route does not exist!'));
    // const error = new Error("Not found");
    // error.status = 404;
    // next(error);
});
app.use(async (err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
