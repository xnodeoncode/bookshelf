/*
    This class is a middleware controller for storing and executing changes on a collection (array) of book objects.
    Dependencies:
        Book|book.js - the class definition for book objects that will be stored.
*/

//import object type to be stored.
import { Book } from "./book.js";

export class ItemStore {
  constructor(name) {
    this.name = name || "MyItemStore";
    this.books = [];
  }

  name(name) {
    this.name = name;
  }

  getBooks() {
    return this.books;
  }

  generateId() {
    let id = Date.now();
    return id;
  }

  getBookById(bookId) {
    bookId = parseInt(bookId);
    let book = this.books.find((b) => b.id == bookId);
    return book;
  }

  addBook(book) {
    // parse book id
    book.id = book.id == 0 ? this.generateId() : book.id;
    book.numberOfPages = parseInt(book.numberOfPages * 1);

    // add the new book to the array.
    this.books.push(book);

    // sort the array based on title.
    this.sort();

    // log activity.
    return this.log(book, ` ${book.title} has been added.`);
  }

  updateBook(book) {
    // remove the existing intance of the book
    this.removeBook(book);

    // update the properties of the book.
    let today = new Date();
    book.modifiedOn = today.toLocaleDateString();

    // add the updated book to the array.
    this.addBook(book);

    // log the activity.
    return this.log(book, ` ${book.title} has been updated.`);
  }

  removeBook(book) {
    // find the existing book
    book.id = parseInt(book.id);

    // filter it out of the array.
    this.books = this.books.filter((obj) => obj.id !== book.id);

    // sort the remaining books by title.
    this.sort();

    // log the activity.
    return this.log(book, ` ${book.title} has been removed.`);
  }

  removeBookById(bookId) {
    // find the existing book
    bookId = parseInt(bookId);
    let b = this.books.find((item) => item.id == bookId);

    //filter the book from the array.
    this.books = this.books.filter((o) => o.id !== b.id);

    // sort the remaining books by title.
    this.sort();

    //this method takes an integer (bookId) and not an object.
    //create an instance of the book to get access to methods.
    let b2 = new Book(b.title, b.author, b.numberOfPages);

    // log the activity
    return this.log(b2, ` ${b2.title} has been removed by ID.`);
  }

  /*
    Sort the array by book title.
    */
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

  /*
    Logs activity to the console
  */
  log(book, message) {
    // log details of the book.
    console.log(book.getDetails());

    // log the related message.
    console.log(message);

    // return the objects
    return { book, message };
  }
}
