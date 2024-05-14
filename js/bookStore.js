import { dataContext, persistenceTypes } from "./dataService.js";

export class BookStore {
  constructor() {
    this.name = "MyBookStore";
    this.books = [];
    this.iterator = 0;
  }

  name(name) {
    this.name = name;
  }

  getBooks() {
    return this.books;
  }

  generateId() {
    this.iterator++;
    return this.iterator;
  }

  getBookById(bookId) {
    bookId = parseInt(bookId);
    let book = this.books.find((b) => b.id == bookId);
    return book;
  }

  addBook(book) {
    book.id = parseInt(book.id);
    book.id = book.id == 0 ? this.generateId() : book.id;
    book.numberOfPages = parseInt(book.numberOfPages * 1);
    this.books.push(book);
    this.sort();

    // persist the datastore.
    this.persist();
    return this.log(book, ` ${book.title} has been added.`);
  }

  updateBook(book) {
    this.removeBook(book);

    let today = new Date();
    book.modifiedOn = today.toLocaleDateString();
    this.addBook(book);

    this.persist();
    return this.log(book, ` ${book.title} has been updated.`);
  }

  removeBook(book) {
    book.id = parseInt(book.id);
    this.books = this.books.filter((obj) => obj.id !== book.id);
    this.sort();
    return this.log(book, ` ${book.title} has been removed.`);
  }

  removeBookById(bookId) {
    bookId = parseInt(bookId);
    let b = this.books.find((item) => item.id == bookId);
    this.books = this.books.filter((o) => o.id !== b.id);
    this.sort();
    return this.log(b, ` ${b.title} has been removed by ID.`);
  }

  sort() {
    let sorted = this.books.sort((a, b) => {
      if (a.title < b.title) {
        return -1;
      }

      if (a.title > b.title) {
        return 1;
      }

      return 0;
    });
    this.books = sorted;
  }

  log(book, message) {
    console.log(book.getDetails());
    console.log(message);
    return { book, message };
  }

  persist() {
    let context = new dataContext();
    context.persist(persistenceTypes.Cookie, this.name, this.books);
  }

  retrieve() {
    let context = new dataContext();
    this.books = context.retrieve(persistenceTypes.Cookie, this.name);
  }
}
