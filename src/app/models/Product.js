const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');
const random = require('mongoose-simple-random');
const  mongoosePaginate = require('mongoose-paginate');

const ProductSchema = new Schema({
    name: { type: String },
    price: { type: Number },
    amount: { type: String },
    image: { type: String },
    description: { type: String },
    star: { type: Number },
    slug: { type: String, slug: 'name', unique: true },
    comments: [{ type: mongoose.Schema.Types.ObjectID }],
}, {
    timestamps: true,
});

// Add Pluin
mongoose.plugin(slug);
ProductSchema.plugin(random);
ProductSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('products', ProductSchema);