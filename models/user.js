const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);