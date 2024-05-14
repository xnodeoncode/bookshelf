// this service manages an indexdb layer.

export const dbTransactionModes = {
  Read: "read",
  ReadWrite: "readwrite",
};

export const persistenceTypes = {
  Cookie: "cookie",
  IndexedDB: "indexeddb",
};

export class dataContext {
  constructor(dbName, dbVersion, objectStoreName, keyPathField) {
    this._dbName = dbName;
    this._dbVersion = dbVersion;
    this._objectStoreName = objectStoreName;
    this._keyPathField = keyPathField;
  }
  // this process runs on page launch. the api verifies the database and version. If it doesn't exist,
  // it is created.
  initiateIndexDB() {
    let request = indexedDB.open(this._dbName, this._dbVersion);

    //databases and datastores (tables) are created in this callback.
    request.onupgradeneeded = (e) => {
      let db = e.target.result;

      // create the datastore and define the key field.
      db.createObjectStore(objectStoreName, {
        keyPath: keyPathField,
      }).createIndex("by_date", "date", { unique: false });

      console.log(
        `upgrade is called on database name: ${db.name} version : ${db.version}`
      );
    };

    // the datastore can be read/viewed at during this callback.
    request.onsuccess = (e) => {
      let db = e.target.result;

      console.log(
        `success is called on database name: ${db.name} version : ${db.version}`
      );
    };

    // there has been an error accessing the database or the datastore.
    request.onerror = (e) => {
      console.log("error");
    };
  }

  // read all current entries in the indexedDB
  getEntries() {
    // connect to the datastore
    let tx = db
      .transaction(this._objectStoreName)
      .objectStore(this._objectStoreName);

    // request a cursor object to hold the results
    // onsuccess of reading the datastore, obtain the cursor object into a variable.
    tx.openCursor().onsuccess = (e) => {
      let cursor = e.target.result;
      if (cursor) {
        return cursor;
      }
    };
  }

  // add a record to the datastore using a indexeddb transaction.
  persist(persistenceType, databaseName, database) {
    // set the key field value based on the current date/time.
    // the calendar provides the post date, the time is calculated based on the current time.
    let now = new Date();
    let keyField = now.getTime();

    // create an entry object
    const entry = {
      logdate: keyField,
      databaseName: databaseName,
      data: JSON.stringify(database),
    };

    if (persistenceType == persistenceTypes.Cookie) {
      //TODO: validate size of cookie.
      // if it is too large, fall back to indexedDB and log a message.
      let dbdata = JSON.stringify(database);
      document.cookie = `${databaseName} = ${dbdata}`;
    } else if (persistenceType == this.persistenceTypes.indexedDB) {
      // connect to the datastore that was created in the onupgradeneeded callback.
      let tx = db.transaction(databaseName, dbTransactionModes.ReadWrite);

      // trap and respond to errors.
      tx.onerror = (e) => console.log(`Error! ${e.target.error}`);

      // read the datastore into memory.
      let db = tx.objectStore(objectStoreName);

      // add the record to the datastore.
      db.add(entry);

      console.log(entry.data);
    }
  }
}
