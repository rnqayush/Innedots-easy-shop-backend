const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    richDescription: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    images: [{
        type: String
    }],
    brand: {
        type: String,
        default: ''
    },
    price : {
        type: Number,
        default:0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,   // only Id is passed over here
        ref: 'Category',                       // due to the ref it will  get connected to the category schema
        required:true                          // it is a method for making relation to some other table
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,              // count in stock cannot be lower than this value
        max: 255             //   count in stock cannot be max than this value
    },
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
})

productSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    const { _id:id, ...result } = object;
    return { ...result, id };
});


exports.Product = mongoose.model('Product', productSchema);
