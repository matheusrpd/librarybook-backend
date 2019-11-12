const express = require('express');
const multer = require("multer");
const uploadConfig = require("./config/upload");

const BookController = require('./controllers/BookController');

const routes = express.Router();
const upload = multer(uploadConfig);

routes.get('/books', BookController.index);
routes.get('/books/:id', BookController.show);
routes.post('/books', upload.single('image'), BookController.store);
routes.put('/books/:id', BookController.update);
routes.delete('/books/:id', BookController.destroy);

module.exports = routes;