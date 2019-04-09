const mongoose = require("mongoose"),
    bcrypt = require('bcrypt'),
    Schema = mongoose.Schema,
    UserSchema = mongoose.Schema({
        name: {
            type: String,
            default: ''
        },
        email: {
            type: String,
            unique: [true, 'This email already registred.'],
            required: [true, 'Email Address is Require'],
        },
        password: {
            type: String,
            required: [true, 'Password is Require'],
        },
        subscribe_users: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }]
    }, {
            timestamps: true
        });
// Generate Hash passowrd
UserSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};
// Export User Schema
module.exports = mongoose.model('User', UserSchema);;