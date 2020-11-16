const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DetailOrderSchema = new Schema({
    nameProduct: { type: String },
    imageProduct: { type: String },
    price: { type: Number },
    amount: { type: Number },
},{
    timestamps: true,
});

module.exports = mongoose.model('detailOrder', DetailOrderSchema);