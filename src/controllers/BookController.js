const Book = require('../models/Book');

const aws = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const s3 = new aws.S3();

module.exports = {
    async index(req, res) {
        const books = await Book.find();

        return res.json(books);
    },

    async show(req, res) {
        const book = await Book.findById(req.params.id);

        return res.json(book);
    },

    async store(req, res) {
        const { name, author, description, pages, status} = req.body;
        const { key: image, location: url = "" } = req.file;

        const book = await Book.create({
            name, 
            author,
            description,
            pages,
            status,
            image,
            url
        });

        return res.json(book);
    }, 

    async update(req, res) {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
          new: true
        });
    
        return res.json(book);
    },
    
    async destroy(req, res) {
        const book = await Book.findById(req.params.id);

        if (process.env.STORAGE_TYPE === "s3") {
            s3.deleteObject({
                    Bucket: "librarybook",
                    Key: book.image
                }).promise();
        } else {
            promisify(fs.unlink)(
                path.resolve(__dirname, "..", "..", "uploads", book.image)
            );
        }

        await Book.deleteOne({ _id: req.params.id });
 
        return res.status(200).json({ msg: "Deletado com sucesso!" });
    }
};