/*
  Service provider to manage storing collections to an indexedDB instance or cookie.
*/

// IndexedDB transaction modes.
export const dbTransactionModes = {
  Read: "read",
  ReadWrite: "readwrite",
};

// Persistence types.
export const persistenceTypes = {
  Cookie: "cookie",
  IndexedDB: "indexeddb",
};

export class dataContext {
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
  }

  // Create a new indexedDB database.
  async initializeIndexDB() {
    let request = await indexedDB.open(this._databaseName, this._databaseVersion);

    request.onupgradeneeded = e => {
      this._database = e.target.result;

      // Create an objectStore
      this._database
        .createObjectStore(this._objectStoreName, {keyPath: this._keyPathField});
    };

    request.onsuccess = e => {
      this._database = request.result;
    };

    request.onerror = e => {
      // Handle errors.
      console.log(event.target.errorCode);
    };
    request.onblocked = (e) =>{
      this._database.close();
    }
  }

  //Retrieve data from persistence layer and return an array.
  async retrieve() {
    let data = [];

    if (this._persistenceType == persistenceTypes.Cookie) {
      let cookieData = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${this._databaseName}=`))
        ?.split("=")[1];

      if (cookieData != null && cookieData.length > 0) {
        data = JSON.parse(cookieData);
      }
    } else if (this._persistenceType == persistenceTypes.IndexedDB) {

      let transaction = await this._database.transaction(
        this._objectStoreName,
        dbTransactionModes.ReadWrite
      );
      transaction.oncomplete = (e) => {
        this._database.close();
      };
      transaction.onerror = (e) => {};

      let objectStore = await transaction.objectStore(this._objectStoreName);
      objectStore.openCursor().onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          data.push(cursor.value.data);
          cursor.continue();
        }
      };
    }

    return data;
  }

  //Retrieves data from persistence store and returns an array.
  //DatabaseProperties - The properties collection that defines the data and how it is stored.
  async retrieve(databaseProperties) {
    let data = [];

    if (databaseProperties.persistenceType == persistenceTypes.Cookie) {
      let cookieData = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${databaseProperties.databaseName}=`))
        ?.split("=")[1];

      if (cookieData != null && cookieData.length > 0) {
        data = JSON.parse(cookieData);
      }
    } else if (databaseProperties.persistenceType == persistenceTypes.IndexedDB) {

      let transaction = await this._db.transaction(
        databaseProperties.objectStoreName,
        dbTransactionModes.ReadWrite
      );
      transaction.oncomplete = (e) => {
        this._db.close();
      };
      transaction.onerror = (e) => {};

      let objectStore = await transaction.objectStore(databaseProperties.objectStoreName);
      objectStore.openCursor().onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          data.push(cursor.value.data);
          cursor.continue();
        }
      };
    }

    return data;
  }

  // Saves items to the data store based on properties set in service initialization.
  // Items-the array of objects to be saved to the data store.
  async persist(items) {

    if (this._persistenceType == persistenceTypes.Cookie) {
      //TODO: validate size of cookie.
      // if it is too large, fall back to indexedDB and log a message.
      let day = 24*60*60*1000;
      let cookieData = JSON.stringify(items);
      let cookie = {
        name:`${this._databaseName}`,
        value:`${cookieData}`,
        expires:Date.now() + day
      }
      cookieStore.set(cookie);
    } else if (this._persistenceType == persistenceTypes.IndexedDB) {

      // set the key field value based on the current date/time.
    // the calendar provides the post date, the time is calculated based on the current time.
    let now = new Date();
    let keyField = now.getTime();
    let jsonData = JSON.stringify(items);

    // create an entry object
    let entry = {
      id:0,
      logdate: keyField,
      databaseName: this._databaseName,
      data: jsonData
    };
      if (this._database == null) {
        this.initializeIndexDB();
      }
      const transaction = await this._database.transaction(
        this._objectStoreName,
        dbTransactionModes.ReadWrite
      );
      transaction.oncomplete = (e) => {};
      transaction.onerror = (e) => {};

      const objectStore = await transaction.objectStore(this._objectStoreName);
      const request = objectStore.add(entry);

      request.onsuccess = (e) => {};
      request.onerror = (e) => {
        console.log(e.target.errorCode);
      };
    }
  }

  // Saves items to the data store based on database properties object that is passed in.
  // PersistenceType|Cookie: Convert array to JSON string and store it in a cookie.
  // PersistenceType|IndexedDB: Add each element in the array to the database.
  async persist(databaseProperties, items) {
    

    if (databaseProperties.persistenceType == persistenceTypes.Cookie) {
      //TODO: validate size of cookie.
      // if it is too large, fall back to indexedDB and log a message.
      let day = 24*60*60*1000;
      let cookieData = JSON.stringify(items);
      let cookie = {
        name:`${databaseProperties.databaseName}`,
        value:`${cookieData}`,
        expires:Date.now() + day
      }
      cookieStore.set(cookie);
    } else if (databaseProperties.persistenceType == persistenceTypes.IndexedDB) {

      // set the key field value based on the current date/time.
    // the calendar provides the post date, the time is calculated based on the current time.
    let now = new Date();
    let keyField = now.getTime();
    let jsonData = JSON.stringify(items);

    // create an entry object
    let entry = {
      id:0,
      logdate: keyField,
      databaseName: databaseProperties.databaseName,
      data: jsonData
    };
      if (this._db == null) {
        this.initializeIndexDB();
      }
      const transaction = await this._database.transaction(
        databaseProperties.objectStoreName,
        dbTransactionModes.ReadWrite
      );
      transaction.oncomplete = (e) => {};
      transaction.onerror = (e) => {};

      const objectStore = await transaction.objectStore(databaseProperties.objectStoreName);
      const request = await objectStore.add(entry);

      request.onsuccess = (e) => {};
      request.onerror = (e) => {
        console.log(e.target.errorCode);
      };
    }
  }
}
