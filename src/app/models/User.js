const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    name: { type: String, required: true, },
    email: { type: String, required: true, },
    address: { type: String, required: true, },
    password: { type: String, required: true, },
    role: { type: String, required: true, },
},{
    timestamps: true,
});

// mã hóa password
UserSchema.pre('save', function (next) {
    const user = this;
    bcrypt.hash(user.password, 10, (error, hash) => {
        user.password = hash;
        next();
    });
});


module.exports = mongoose.model('users', UserSchema);