const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    userName: { type: String },
    address: { type: String },
    phone: { type: String },
    total: { type: Number },
    kids: [{ type: mongoose.Schema.Types.ObjectID }],
    status: { type: Boolean },
},{
    timestamps: true,
});

module.exports = mongoose.model('orders', OrderSchema);