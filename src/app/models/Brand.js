const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');


const BrandSchema = new Schema({
    name: { type: String },
    slug: { type: String, slug: 'name', unique: true },
    products: [{ type: mongoose.Schema.Types.ObjectID }],
});

// Add Pluin
mongoose.plugin(slug);

module.exports = mongoose.model('brands', BrandSchema);