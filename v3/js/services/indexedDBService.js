/********************************************************************
 * Import StorageItem class for a strongly typed storage object.
 ********************************************************************/
import { StorageItem } from "./storageItem.js";

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
    this._databaseSettings = databaseSettings;
    this._database = null;
    this._databaseName = "";
    this._databaseVersion = 1;
    this._objectStoreName = "Items";
  }

  /********************************************************************
   * Initialize the database.
   ********************************************************************/
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

  async retrieve(databaseProperties) {
    let data = [];

    if (databaseProperties == null) {
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
    } else {
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
    }
  }

  async save(databaseProperties, items) {
    if (databaseProperties == null) {
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
    } else {
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
    }
  }
}
