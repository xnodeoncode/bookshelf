/***********************************************************************
 * This class is a middleware controller for storing and executing
 * changes on a collection (array) of book objects.
 * Dependencies:
 *    DataContext|dataService.js - provides browser persistence via various browser persistence methods.
 *    Book|book.js - the class definition for book objects that will be stored.
 ***********************************************************************/

/***********************************************************************
 * Import object type to be stored.
 ***********************************************************************/
import { Book } from "./book.js";

/***********************************************************************
 * Import backend dataservices if persistence is needed.
 ***********************************************************************/
import { DataContext, PersistenceTypes } from "./services/dataService.js";

/***********************************************************************
 * import DatabaseSettings class to capture database settings for persistence.
 ***********************************************************************/
import { DatabaseSettings } from "./services/databaseSettings.js";

/***********************************************************************
 * Import custom exception classes
 ***********************************************************************/
import {
  PersistenceServiceNotEnabled,
  DataServiceUnavailable,
} from "./services/exceptions.js";

/***********************************************************************
 * Class definition
 * Name|string: The name of the item store.
 * UsePersistenceService|bool: Whether or not persistence should be enabled.
 ***********************************************************************/
export class ItemStore {
  constructor(name, usePersistenceService) {
    this.name = name || "MyItemStore";
    this.books = [];
    this.usePersistenceService = usePersistenceService || false;

    this.dataServiceProperties = null;

    this.databaseDefaults = {
      databaseName: this.name || "ItemStore",
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

  /***********************************************************************
   * Initializes the database using the DatabaseSettings object.
   * DatabaseSettings|object: Class containing values for database options.
   ***********************************************************************/
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

  /***********************************************************************
   * Sets/Resets the name of the item store.
   * Name|string: The name of the item store.
   ***********************************************************************/
  name(name) {
    this.name = name;
  }

  /***********************************************************************
   * Returns the collection of items.
   ***********************************************************************/
  getBooks() {
    return this.books;
  }

  /***********************************************************************
   * Generates an id based on the timestamp.
   ***********************************************************************/
  generateId() {
    let id = Date.now();
    return id;
  }

  /***********************************************************************
   * Finds an item by its Id.
   * Returns: An item from the collection.
   * Id|Int: The id of the item.
   ***********************************************************************/
  getBookById(id) {
    id = parseInt(id);
    let book = this.books.find((b) => b.id == id);
    return book;
  }

  /***********************************************************************
   * Adds a new item to the collection.
   * Book|object: The item that will be added to the collection.
   ***********************************************************************/
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

  /***********************************************************************
   * Updates an item in the collection.
   * Book|object: The item that will be updated.
   ***********************************************************************/
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

  /***********************************************************************
   * Removes an item from the collection.
   * Book|object: The item that will be removed.
   ***********************************************************************/
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

  /***********************************************************************
   * Removes an item from the collection.
   * Id|int: The id of the item that will be removed.
   ***********************************************************************/
  removeBookById(id) {
    // find the existing book
    id = parseInt(id);
    let b = this.books.find((item) => item.id == id);

    //filter the book from the array.
    this.books = this.books.filter((o) => o.id !== b.id);

    // sort the remaining books by title.
    this.sort();

    //this method takes an integer (id) and not an object.
    //create an instance of the book to get access to methods.
    let b2 = new Book(b.title, b.author, b.numberOfPages);

    // persist to the datastore
    this.persist();

    // log the activity
    return this.log(b2, ` ${b2.title} has been removed by ID.`);
  }

  /***********************************************************************
   * Sorts the collection by title.
   ***********************************************************************/
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

  /***********************************************************************
   * Logs activity to the console.
   * Book|object: The item that has been modified.
   * Message|string: The message to display.
   ***********************************************************************/
  log(book, message) {
    // log details of the book.
    console.log(book.getDetails());

    // log the related message.
    console.log(message);

    // return the objects
    return { book, message };
  }

  /***********************************************************************
   * Saves the collection to storage.
   ***********************************************************************/
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

  /***********************************************************************
   * Retrieves the collection from storage.
   ***********************************************************************/
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

  /***********************************************************************
   * Creates an instance of the data context to manage persistence.
   * DatabaseProperties|object: Class containing values for database options.
   ***********************************************************************/
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
