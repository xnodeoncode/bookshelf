/*******************************************************************************************************************
    This class is a middleware controller for storing and executing changes on a collection (array) of objects.
    Dependencies:
        Book|book.js - the class definition for book objects that will be stored.
********************************************************************************************************************/

/**********************************************************************
 * Import object type to be stored.
 **********************************************************************/
import { Book } from "./book.js";

/**********************************************************************
 * Class definition
 *********************************************************************/
export class ItemStore {
  constructor(name) {
    this.name = name || "MyItemStore";
    this.books = [];
  }

  /******************************************************************
   * Returns the name of the item store.
   *****************************************************************/
  name(name) {
    this.name = name;
  }

  /******************************************************************
   * Returns the collection of items.
   *****************************************************************/
  getBooks() {
    return this.books;
  }

  /******************************************************************
   * Generate an id based on the timestamp of when it the item added
   * to the collection.
   *****************************************************************/
  generateId() {
    let id = Date.now();
    return id;
  }
  /********************************************************************
   * Finds item by id.
   *******************************************************************/
  getBookById(bookId) {
    bookId = parseInt(bookId);
    let book = this.books.find((b) => b.id == bookId);
    return book;
  }

  /*******************************************************************
   * Adds a new item to the collection
   *******************************************************************/
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

  /********************************************************************
   * Update an item in the collection by removing the existing one
   * and adding a new one
   *******************************************************************/
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

  /**********************************************************************
   * Remove an item from the collection.
   **********************************************************************/
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

  /**************************************************************************
   * Remove an item based on it's ID.
   **************************************************************************/
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

  /***************************************************************************
    Sort the collection by title.
  ****************************************************************************/
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

  /****************************************************************************
    Logs activity to the console
  *****************************************************************************/
  log(book, message) {
    // log details of the book.
    console.log(book.getDetails());

    // log the related message.
    console.log(message);

    // return the objects
    return { book, message };
  }
}
