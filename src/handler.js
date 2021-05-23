const { nanoid } = require('nanoid');
const Book = require('./books');

const addBooksHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Data Payload Validation
  if (name === undefined) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      })
      .code(400);
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: 'fail',
        message:
          'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
  }

  const id = nanoid();
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const isSuccess = Book.addBook({
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  });

  if (isSuccess) {
    return h
      .response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      })
      .code(201);
  }

  // Generic Error
  return h
    .response({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    })
    .code(500);
};

const getAllBooksHandler = (request) => {
  const { name, reading, finished } = request.query;

  let filterData = {};

  if (name !== undefined) {
    filterData = { filter: 'name', value: String(name) };
  }
  if (reading !== undefined) {
    filterData = { filter: 'reading', value: Boolean(Number(reading)) };
  }
  if (finished !== undefined) {
    filterData = { filter: 'finished', value: Boolean(Number(finished)) };
  }

  const books = Book.getBooks(filterData).map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  return {
    status: 'success',
    data: { books },
  };
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = Book.findBookById(bookId);

  if (book !== undefined) {
    return {
      status: 'success',
      data: { book },
    };
  }

  return h
    .response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    })
    .code(404);
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Data Payload Validation
  if (name === undefined) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      })
      .code(400);
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: 'fail',
        message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
  }

  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;

  const book = Book.updateBook(bookId, {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    updatedAt,
  });

  if (book !== undefined) {
    return {
      status: 'success',
      message: 'Buku berhasil diperbarui',
    };
  }

  return h
    .response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    })
    .code(404);
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = Book.deleteBookById(bookId);

  if (book !== undefined) {
    return {
      status: 'success',
      message: 'Buku berhasil dihapus',
    };
  }

  return h
    .response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    })
    .code(404);
};

module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
