const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
   
  },
  slug:{
    type:String
  },
  description: {
    type: String,
   
  },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
