const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    pwd: {
        type: String,
        required: true
    },
    phoneno: {
        type: String,
        required: true,
    }
})
/**
 * Calles before saving user
 * Encrypting the user password before saving in db
 */
UserSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.pwd, salt)
        this.pwd = hashedPassword;
        next();
    }
    catch (error) {
        next(error);
    }
});

UserSchema.methods.isValidPassword = async function (pwd) {
    try {
        return await bcrypt.compare(pwd, this.pwd);
    }
    catch (error) {
        next(error);
    }
}
// UserSchema.post('save', async function (next) {
//     try {
//         console.log('after save user')
//     }
//     catch (error) {
//         next(error)
//     }
// });
const User = mongoose.model('user', UserSchema);
module.exports = User;