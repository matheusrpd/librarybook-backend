const { Schema, model } = require('mongoose');

const BookSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    pages: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: true,
    },
    url: String
}, {
    timestamps: true,
});

BookSchema.pre("save", function() {
    if (!this.url) {
      this.url = `${process.env.APP_URL}/files/${this.image}`;
    }
});

module.exports = model('Book', BookSchema);