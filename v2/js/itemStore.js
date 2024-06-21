/*
    This class is a middleware controller for storing and executing changes on a collection (array) of book objects.
    Dependencies:
        DataContext|dataService.js - provides browser persistence via various browser persistence methods.
        Book|book.js - the class definition for book objects that will be stored.
        GoogleService|googleService.js - provides search services for Google Books API to allow importing titles to the collection.
*/

//import dependency modules.

//import backend dataservices if persistence is needed.
import { DataContext, PersistenceTypes } from "./services/dataService.js";

//import database settings class to capture database settings for persistence.
import { DatabaseSettings } from "./services/databaseSettings.js";

//import object type to be stored.
import { Book } from "./book.js";

// import exception classes
import {
  PersistenceServiceNotEnabled,
  DataServiceUnavailable,
} from "./services/exceptions.js";

// not yet implemented
import { GoogleService } from "./services/googleService.js";

export class ItemStore {
  constructor(name, usePersistenceService) {
    this.name = name || "MyItemStore";
    this.books = [];
    this.usePersistenceService = usePersistenceService || false;

    this.dataServiceProperties = null;

    this.databaseDefaults = {
      databaseName: "ItemStore",
      databaseVersion: 1,
      objectStoreName: "Items",
      keyPathField: "id",
      persistenceType: PersistenceTypes.Cookie,
    };

    // initialize data store with default settings.
    if (usePersistenceService) {
      this.dataContext = this.initializeDataStore();
    }
  }

  initializeDataStore(databaseSettings) {
    if (this.usePersistenceService) {
      let settings = {};

      if (
        typeof databaseSettings === "undefined" ||
        databaseSettings === null ||
        databaseSettings === ""
      ) {
        settings = {
          databaseName: this.databaseDefaults.databaseName,
          databaseVersion: this.databaseDefaults.databaseVersion,
          objectStoreName: this.databaseDefaults.objectStoreName,
          keyPathField: this.databaseDefaults.keyPathField,
          persistenceType: this.databaseDefaults.persistenceType,
        };
      } else {
        settings = {
          databaseName:
            databaseSettings.databaseName || this.databaseDefaults.databaseName,
          databaseVersion:
            databaseSettings.databaseVersion ||
            this.databaseDefaults.databaseVersion,
          objectStoreName:
            databaseSettings.tableName || this.databaseDefaults.objectStoreName,
          keyPathField:
            databaseSettings.keyPathField || this.databaseDefaults.keyPathField,
          persistenceType:
            databaseSettings.persistenceType ||
            this.databaseDefaults.persistenceType,
        };
      }

      this.dataServiceProperties = new DatabaseSettings(
        settings.databaseName,
        settings.databaseVersion,
        settings.objectStoreName,
        settings.keyPathField,
        settings.persistenceType
      );
      this.dataContext = this.getDataStore(this.dataServiceProperties);
    } else {
      var e = new PersistenceServiceNotEnabled(
        "The persistence service is not enabled. Set usePersistenceService = true on the ItemStore."
      );
      console.log(e);
    }
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
    if (this.usePersistenceService) {
      // if the data service doesn't exist, try to create one.
      if (this.dataContext == null) {
        try {
          this.dataContext = this.getDataStore(this.dataServiceProperties);
        } catch (error) {
          throw new DataServiceUnavailable(
            "Error: Data service unavailable. Unable to persist data."
          );
        }
      }

      // asynchronous call to store the array.
      await this.dataContext.persist(this.dataServiceProperties, this.books);

      // get the latest version of the collection.
      this.books = await this.retrieve();
    }

    //return the collection
    return this.books;
  }

  /*
    Retrieve book collection from cookie or indexedDB.
  */
  async retrieve() {
    if (this.usePersistenceService) {
      // if the data service does not exist, create it.
      if (this.dataContext == null)
        this.dataContext = this.getDataStore(this.dataServiceProperties);

      // get the latest version of the books collection
      var items = await this.dataContext.retrieve(this.dataServiceProperties);
      if (items.length > 0) {
        this.books = items;
      }
    }

    // return the colleciton.
    return this.books;
  }

  /*
    Create an instance of the data service to manage persistence.
  */
  getDataStore(databaseProperties) {
    if (this.usePersistenceService) {
      // create a new instance of the data service and return it.
      let context = new DataContext(
        databaseProperties.persistenceType,
        databaseProperties.databaseName,
        databaseProperties.databaseVersion,
        databaseProperties.objectStoreName,
        databaseProperties.keyPathField
      );
      return context;
    }
    return {};
  }
}
