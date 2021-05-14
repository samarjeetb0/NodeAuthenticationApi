const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../Modules/User.module');
const client = require('../Helpers/init_redis');

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {};
            const secret = process.env.ACCESS_TOKEN_SECRET;
            const options = {
                expiresIn: '1h',
                issuer: 'samar',
                audience: userId
            };
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    reject(createError.InternalServerError())
                }
                //reject(err)
                resolve(token)
            })
        })
    },
    verifyAccessToken: (req, res, next) => {
        if (!req.headers['authorization']) return next(createError.Unauthorized());
        const authHeader = req.headers['authorization'];
        const bearerToken = authHeader.split(' ');
        const token = bearerToken[1];
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) {
                const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
                return next(createError.Unauthorized(message));
            }
            req.payload = payload;
            next();
        })
    },
    signRefreshToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {};
            const secret = process.env.REFRESH_TOKEN_SECRET;
            const options = {
                expiresIn: '1y',
                issuer: 'samar',
                audience: userId
            };
            /**
             * 'EX', 365*24*60*60
             * means token will automatically expire from redis after 1year
             */
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    reject(createError.InternalServerError())
                }
                client.SET(userId, token, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
                    if (err) {
                        console.log(err.message);
                        reject(createError.InternalServerError());
                        return;
                    }
                    resolve(token);
                })
            })
            /*
            Before implementing redis server
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    reject(createError.InternalServerError())
                }
                resolve(token)
            })*/
        })
    },
    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
                if (err) return reject(createError.Unauthorized())
                const userId = payload.aud;
                client.GET(userId, (err, reply) => {
                    if (err) {
                        console.log(err.message);
                        reject(createError.InternalServerError());
                        return;
                    }
                    if (refreshToken === reply) return resolve(userId);
                    reject(createError.Unauthorized())
                })
            })
            /*
            Before redis was implemented
            JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
                if (err) return reject(createError.Unauthorized())
                const userId = payload.aud;
                resolve(userId);
            })
            */
        })
    },
}