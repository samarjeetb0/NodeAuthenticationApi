const createError = require('http-errors');
const User = require('../Modules/User.module');
const { authSchema, authLoginSchema } = require('../Helpers/validation_schema');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../Helpers/jwt_token');
const client = require('../Helpers/init_redis');



module.exports = {
    register: async (req, res, next) => {
        try {
            const { email, pwd, phoneno } = req.body;
            const validateUser = await authSchema.validateAsync(req.body);
            const isemailExist = await User.findOne({ email: validateUser.email });
            const isPhoneExist = await User.findOne({ phoneno: validateUser.phoneno })
            if (isemailExist)
                throw createError.Conflict(`${validateUser.email} is already been register`);
            if (isPhoneExist)
                throw createError.Conflict(`${validateUser.phoneno} is already taken`);
            const user = new User({ email, pwd, phoneno });
            const savedUser = await user.save();
            const accessToken = await signAccessToken(savedUser.id)
            const refreshToken = await signRefreshToken(savedUser.id)
            // res.send(savedUser);
            res.send({ accessToken, refreshToken });
        }
        catch (error) {
            if (error.isJoi === true) error.status = 422;
            next(error);
        }
    },
    login : async (req, res, next) => {
        try {
            const validateUser = await authLoginSchema.validateAsync(req.body);
            const user = await User.findOne({ email: validateUser.email });
            if (!user) throw createError.NotFound('Email not found !');
            const isPwdMatch = await user.isValidPassword(validateUser.pwd);
            if (!isPwdMatch) throw createError.Unauthorized('Email/password not valid !');
            const accessToken = await signAccessToken(user.id);
            const refreshToken = await signRefreshToken(user.id)
            res.send({ accessToken, refreshToken });
        }
        catch (error) {
            if (error.isJoi === true)
                return next(createError.BadRequest('Invalid email/password !'));
            next(error);
        }
    },
    refreshToken : async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) throw createError.BadRequest();
            const userId = await verifyRefreshToken(refreshToken);
            const accessToken = await signAccessToken(userId);
            const refToken = await signRefreshToken(userId);
            res.send({ "accessToken": accessToken, "refreshToken": refToken });
        }
        catch (error) {
            next(error);
        }
    },
    logout : async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            console.log(req.body)
            if (!refreshToken) throw createError.BadRequest();
            const userId = await verifyRefreshToken(refreshToken);
            /**
             * Removing the refreshtoken from redis
             */
            client.DEL(userId, (err, reply) => {
                if (err) {
                    console.log(err.message);
                    throw createError.InternalServerError();
                }
                console.log(reply);
                //res.status(204);
            })
            res.status(204);
        }
        catch (error) {
            next(error);
        }
    }
}