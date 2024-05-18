/*
    This class is a middleware controller for storing and executing changes on a collection (array) of book objects.
    Dependencies:
        DataContext|dataService.js - provides browser persistence via indexedDB or cookies.
        Book|book.js - the class definition for book objects that will be stored.
        GoogleService|googleService.js - provides search services for Google Books API to allow importing titles to the collection.
*/

//import dependency modules.
import { dataContext, persistenceTypes } from "./dataService.js";
import { Book } from "./book.js";

// not yet implemented
import { GoogleService } from "./googleService.js";

export class BookStore {
  constructor() {
    this.name = "MyBookStore";
    this.books = [];
    this.iterator = 0;

    // database properties
    this.databaseProperties = {
      persistenceType: persistenceTypes.Cookie,
      databaseName: this.name,
      databaseVersion: 1,
      objectStoreName: "Books",
      keyPathField: "id",
    };

    this.dataContext = this.getDataStore(this.databaseProperties);
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
    // parse book id
    book.id = book.id == 0 ? this.generateId() : book.id;
    book.numberOfPages = parseInt(book.numberOfPages * 1);

    // add the new book to the array.
    this.books.push(book);

    // sort the array based on title.
    this.sort();

    // persist to the datastore.
    this.persist();

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

    // persist to the datastore
    this.persist();

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

    // persist to the datastore
    this.persist();

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

    // persist to the datastore
    this.persist();

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

  /*
    NOT YET IMPLEMENTED
    Search Google Books for a title.
  */
  async search(term) {
    let result = {};
    try {
      let googleService = new GoogleService();
      result = await googleService.search(term);
      return result;
    } catch (e) {
      console.log(e);
      result.Error = "Service unavailable";
      return result;
    }
  }

  /*
    Save book collection (array) to a cookie or indexedDB.
  */
  async persist() {
    // if the data service doesn't exist, create one.
    if (this.dataContext == null) {
      this.dataContext = this.getDataStore(this.databaseProperties);
    }

    // asynchronous call to store the array.
    await this.dataContext.persist(this.databaseProperties, this.books);

    // get the latest version of the collection.
    this.books = await this.dataContext.retrieve(this.databaseProperties);

    //return the collection
    return this.books;
  }

  /*
    Retrieve book collection from cookie or indexedDB.
  */
  async retrieve() {
    // if the data service does not exist, create it.
    if (this.dataContext == null)
      this.dataContext = new dataContext(this.databaseProperties);

    // get the latest version of the books collection
    this.books = await this.dataContext.retrieve(this.databaseProperties);

    // return the colleciton.
    return this.books;
  }

  /*
    Create an instance of the data service to manage persistence.
  */
  getDataStore(databaseProperties) {
    // create a new instance of the data service and return it.
    let context = new dataContext(
      databaseProperties.persistenceType,
      databaseProperties.databaseName,
      databaseProperties.databaseVersion,
      databaseProperties.objectStoreName,
      databaseProperties.keyPathField
    );
    return context;
  }
}
