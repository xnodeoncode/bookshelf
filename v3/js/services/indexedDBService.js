/********************************************************************
 * Import DatabaseSettings class for a strongly typed settings object.
 ********************************************************************/
import { DatabaseSettings } from "./databaseSettings.js";

/********************************************************************
 * IndexedDB transaction modes.
 ********************************************************************/
export const TransactionModes = {
  Read: "readonly",
  ReadWrite: "readwrite",
  Flush: "readwriteflush",
};

/********************************************************************
 * IndexedDB wrapper to provide access to indexedDB for data storage.
 ********************************************************************/
export class IndexedDBService {
  constructor(databaseSettings) {
    this._database;
    this._objectStore;

    this._databaseSettings = new DatabaseSettings(
      databaseSettings.databaseName,
      databaseSettings.databaseVersion,
      databaseSettings.tableName,
      databaseSettings.keyPathField,
      databaseSettings.persistenceType
    );

    //initialize the database.
    this.initializeIndexDB();
  }

  /********************************************************************
   * Initialize the database.
   ********************************************************************/
  initializeIndexDB() {
    if (this._database == null) {
      let request = indexedDB.open(
        this._databaseSettings.databaseName,
        this._databaseSettings.databaseVersion
      );

      request.onsuccess = (e) => {
        this._database = e.target.result;
        console.log("Success: Database exists", this._database);
      };

      request.onupgradeneeded = (e) => {
        this._database = e.target.result;

        //if the table does not exist, create it.
        if (
          !this._database.objectStoreNames.contains(
            this._databaseSettings.tableName
          )
        ) {
          //create the table (objectstore).
          this._objectStore = this._database.createObjectStore(
            this._databaseSettings.tableName,
            { keyPath: this._databaseSettings.keyPathField }
          );

          // create an index based on the keypathfield.
          this._objectStore.createIndex(
            this._databaseSettings.keyPathField,
            this._databaseSettings.keyPathField,
            {
              unique: true,
            }
          );
        }

        console.log("Database created / upgraded", this._database);
      };

      request.onerror = (e) => {
        console.warn("Error opening database.", e);
      };
      request.onblocked = (e) => {
        console.warn("Database request blocked.", e);
      };
    }
  }

  /********************************************************************
   * Returns an IndexedDB Transaction object.
   ********************************************************************/
  async getTransaction() {
    return await this._database.transaction(
      this._databaseSettings.tableName,
      TransactionModes.ReadWrite
    );
  }

  /********************************************************************
   * Returns|Array: All records in the table.
   ********************************************************************/
  async retrieve() {
    let data = [];

    if (this._database != null) {
      this.initializeIndexDB();
      let transaction = await this.getTransaction();

      this._objectStore = await transaction.objectStore(
        this._databaseSettings.tableName
      );

      let request = await this._objectStore.getAll();
      request.onsuccess = (e) => {
        let requestItems = e.target.result;
        requestItems.forEach((item) => {
          data.push(item);
        });
        console.log({ requestItems }, { data });

        // A workaround for the issue of data not being returned This should be removed.
        window.sessionStorage.setItem("fromIndexedDB", JSON.stringify(data));
      };

      transaction.oncomplete = (e) => {
        console.log("read complete", e);
      };

      transaction.onerror = (e) => {
        console.warn("read error", e);
      };
    }

    return data;
  }

  /********************************************************************
   * Adds a new record to the table.
   * Items|Array: An array of items that will be added to or updated in the table.
   ********************************************************************/
  async save(items) {
    // get transaction.
    let transaction = await this.getTransaction();

    // get object store.
    let store = await transaction.objectStore(this._databaseSettings.tableName);

    // add/update items in the table.
    items.forEach((item) => {
      let addRequest = store.put(item);
      addRequest.onsuccess = (e) => {
        console.log("Item added", item, e);
      };
      addRequest.onerror = (e) => {
        console.warn("error, item NOT saved", e);
      };
    });

    transaction.oncomplete = (e) => {
      console.log("complete, save transaction complete", e);
    };

    transaction.onerror = (e) => {
      console.warn("error, saved transaction failed", e);
    };
  }
}
