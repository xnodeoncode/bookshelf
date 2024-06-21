/*
  Service provider to manage storing collections to an indexedDB instance or cookie.
*/

import { SessionStorageService } from "./sessionStorageService.js";
import { LocalStorageService } from "./localStorageService.js";
import { CookieService } from "./cookieService.js";

//var indexedDBServer = new Worker("./indexedDBService.js");

// IndexedDB transaction modes.
export const TransactionModes = {
  Read: "readonly",
  ReadWrite: "readwrite",
  Flush: "readwriteflush",
};

// Persistence types.
export const PersistenceTypes = {
  Cookie: "cookie",
  IndexedDB: "indexeddb",
  SessionStorage: "session",
  LocalStorage: "localstorage",
  BlockChain: "blockchain",
};

export class DataContext {
  constructor(
    persistenceType,
    databaseName,
    databaseVersion,
    objectStoreName,
    keyPathField
  ) {
    this._persistenceType = persistenceType;
    this._databaseName = databaseName;
    this._databaseVersion = databaseVersion;
    this._objectStoreName = objectStoreName;
    this._keyPathField = keyPathField;
    this._database = null;
    this._items = [];
    this._iterator = 0;
  }

  // Create a new indexedDB database.
  async initializeIndexDB() {
    let request = await indexedDB.open(
      this._databaseName,
      this._databaseVersion
    );
    request.onupgradeneeded = (e) => {
      this._database = e.target.result;

      try {
        // Create an objectStore
        this._database
          .createObjectStore(this._objectStoreName, {
            keyPath: this._keyPathField,
          })
          .createIndex("by_id", "id", { unique: true });
      } catch (e) {
        console.log(e);
      }
    };

    request.onsuccess = (e) => {
      this._database = e.target.result;
      this._database.onversionchange = () => {
        this._database.close();
        console.log("version changed.");
      };
    };

    request.onerror = (e) => {
      // Handle errors.
      console.log(e);
    };
    request.onblocked = (e) => {
      this._database.close();
    };
  }

  //Retrieve data from persistence layer and return an array.
  async retrieve() {
    let data = [];

    switch (this._persistenceType) {
      //retrieve from cookie service
      case PersistenceTypes.Cookie:
        let cookieService = new CookieService();
        let cookieData = cookieService.retrieve(this._databaseName);
        if (cookieData !== null && cookieData.length > 0) {
          data = JSON.parse(cookieData);
        }
        break;

      //retrieve from indexedDB service
      case PersistenceTypes.indexedDB:
        if (typeof this._database === "undefined" || this._database === null) {
          this.initializeIndexDB();
        }

        let transaction = await this._database.transaction(
          this._objectStoreName,
          TransactionModes.Read
        );

        let objectStore = await transaction.objectStore(this._objectStoreName);
        objectStore.openCursor().onsuccess = (e) => {
          const cursor = e.target.result;
          if (cursor) {
            data.push(cursor.value);
            cursor.continue();
          }
        };
        break;

      //retrieve from localStorage service
      case PersistenceTypes.LocalStorage:
        var localStorageService = new LocalStorageService();
        var items = localStorageService.retrieve(this._databaseName);
        data = JSON.parse(items);
        break;

      //retrieve from sessionStorage service
      case PersistenceTypes.SessionStorage:
        var sessionStorageService = new SessionStorageService();
        var items = sessionStorageService.retrieve(this._databaseName);
        data = JSON.parse(items);
        break;

      //retrieve from blockchain service
      case PersistenceTypes.BlockChain:
        break;

      default:
        break;
    }
    return data;
  }

  //Retrieves data from persistence store and returns an array.
  //DatabaseProperties - The properties collection that defines the data and how it is stored.
  async retrieve(databaseProperties) {
    let data = [];

    switch (databaseProperties.persistenceType) {
      //retrieve from cookie service
      case PersistenceTypes.Cookie:
        let cookieService = new CookieService();
        let cookieData = cookieService.retrieve(
          databaseProperties.databaseName
        );
        if (cookieData !== null && cookieData.length > 0) {
          data = JSON.parse(cookieData);
        }
        break;

      //retrieve from indexedDB service
      case PersistenceTypes.IndexedDB:
        if (typeof this._database === "undefined" || this._database === null) {
          await this.initializeIndexDB();
        }

        try {
          let transaction = await this._database
            .transaction(databaseProperties.objectStoreName)
            .objectStore(databaseProperties.objectStoreName);

          transaction.openCursor().onsuccess = (e) => {
            let cursor = e.target.result;
            if (cursor) {
              data.push(cursor.value);
              cursor.continue();
            }
          };
          return data;
        } catch (e) {
          console.log(e);
        }
        break;

      //retrieve from LocalStorage service
      case PersistenceTypes.LocalStorage:
        var localStorageService = new LocalStorageService();
        var items = localStorageService.retrieve(
          databaseProperties.databaseName
        );
        if (items !== null) {
          data = JSON.parse(items);
        }
        break;

      //retrieve from sessionStorage service
      case PersistenceTypes.SessionStorage:
        var sessionStorageService = new SessionStorageService();
        var items = sessionStorageService.retrieve(
          databaseProperties.databaseName
        );
        if (items !== null) {
          data = JSON.parse(items);
        }
        break;

      //retrieve from blockchain service
      case PersistenceTypes.BlockChain:
        break;
      default:
        break;
    }

    return data;
  }

  // Saves items to the data store based on properties set in service initialization.
  // Items-the array of objects to be saved to the data store.
  async persist(items) {
    switch (this._persistenceType) {
      //persist to Cookie service
      case PersistenceTypes.Cookie:
        let cookieService = new CookieService();
        let cookieData = JSON.stringify(items);
        cookieService.save(this._databaseName, cookieData);
        break;

      //persist to IndexedDB service.
      case PersistenceTypes.indexedDB:
        if (typeof this._database === "undefined" || this._database === null) {
          await this.initializeIndexDB();
        }
        let transaction = await this._database.transaction(
          this._objectStoreName,
          TransactionModes.ReadWrite
        );
        transaction.oncomplete = (e) => {};
        transaction.onerror = (e) => {};

        let objectTable = await transaction.objectStore(this._objectStoreName);

        for (i = 0; i <= items.length; i++) {
          let request = await objectTable.put(items[i]);
        }
        break;

      //persist to LocalStorage service
      case PersistenceTypes.LocalStorage:
        var localStorageService = new LocalStorageService();
        localStorageService.save(this._database, JSON.stringify(items));
        break;

      //persist to sessionStorage service
      case PersistenceTypes.SessionStorage:
        var sessionStorageService = new SessionStorageService();
        sessionStorageService.save(this._database, JSON.stringify(items));
        break;

      //persist to blockchain service
      case PersistenceTypes.BlockChain:
        break;
      default:
        break;
    }
  }

  // Saves items to the data store based on database properties object that is passed in.
  // PersistenceType|Cookie: Convert array to JSON string and store it in a cookie.
  // PersistenceType|IndexedDB: Add each element in the array to the database.
  async persist(databaseProperties, items) {
    switch (databaseProperties.persistenceType) {
      //persist to Cookie service
      case PersistenceTypes.Cookie:
        let cookieService = new CookieService();
        let cookieData = JSON.stringify(items);
        cookieService.save(databaseProperties.databaseName, cookieData);
        break;

      //persist to IndexedDB service.
      case PersistenceTypes.indexedDB:
        if (typeof this._database === "undefined" || this._database === null) {
          this.initializeIndexDB();
        }
        const transaction = await this._database.transaction(
          databaseProperties.objectStoreName,
          TransactionModes.ReadWrite
        );

        const objectStore = await transaction.objectStore(
          databaseProperties.objectStoreName
        );

        for (var i = 0; i < items.length; i++) {
          const request = await objectStore.put(items[i]);
        }
        break;

      //persist to LocalStorage service
      case PersistenceTypes.LocalStorage:
        var localStorageService = new LocalStorageService();
        localStorageService.save(
          databaseProperties.databaseName,
          JSON.stringify(items)
        );
        break;

      //persist to sessionStorage service
      case PersistenceTypes.SessionStorage:
        var sessionStorageService = new SessionStorageService();
        sessionStorageService.save(
          databaseProperties.databaseName,
          JSON.stringify(items)
        );
        break;

      //persist to blockchain service
      case PersistenceTypes.BlockChain:
        break;
      default:
        break;
    }
  }
}
