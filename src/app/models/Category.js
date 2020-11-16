const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');


const CategorySchema = new Schema({
    name: { type: String },
    slug: { type: String, slug: 'name', unique: true },
    kids: [{ type: mongoose.Schema.Types.ObjectID }],
},{
    timestamps: true,
});

// Add Pluin
mongoose.plugin(slug);

module.exports = mongoose.model('categoties', CategorySchema);