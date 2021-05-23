const fs = require('fs');
const booksData = require('../books.json');

const Book = {
  books: booksData || [],

  addBook(newBook) {
    this.books.push(newBook);
    this.updateJSON();

    return this.books.filter((book) => book.id === newBook.id).length > 0;
  },

  updateJSON() {
    const books = JSON.stringify(this.books, null, 2);
    fs.writeFile('books.json', books, (err) => {
      if (err) throw err;
    });
  },
};

module.exports = Book;
