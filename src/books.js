const Book = {
  books: [],

  addBook(newBook) {
    this.books.push(newBook);

    return this.books.filter((book) => book.id === newBook.id).length > 0;
  },

  getBooks(filterData) {
    // Get All Books
    if (Object.keys(filterData).length === 0) return this.books;

    // Get Filtered Book
    const { filter, value } = filterData;
    const filteredBook = this.books.filter((book) => {
      // filter Name
      if (filter === 'name') {
        return book.name.toLowerCase().includes(value.toLowerCase());
      }

      return book[filter] === value;
    });
    // If not found, return empty array
    return filteredBook === undefined ? [] : filteredBook;
  },

  findBookById(id) {
    return this.books.find((book) => book.id === id);
  },
};

module.exports = Book;
