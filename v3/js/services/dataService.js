/*************************************************************************************
 * Service provider to manage storing values to various data stores using custom
 * services.
 *************************************************************************************/

/*************************************************************************************
 * Import the IndexedDB service in order to persist to indexedDB.
 ************************************************************************************/
import { IndexedDBService } from "./indexedDBService.js";

/*************************************************************************************
 * Import the SessionStorage service in order to persist to window.sessionStorage.
 ************************************************************************************/
import { SessionStorageService } from "./sessionStorageService.js";

/*************************************************************************************
 * Import the LocalStorage service in order to persist to window.localStorage.
 ************************************************************************************/
import { LocalStorageService } from "./localStorageService.js";

/*************************************************************************************
 * Import the CookieStorage service in order to persist to document.cookie.
 ************************************************************************************/
import { CookieService } from "./cookieService.js";

/*************************************************************************************
 * Import StorageItem class for a strongly typed storage object.
 ************************************************************************************/
import { StorageItem } from "./storageItem.js";

/*************************************************************************************
 * Import PersistenceTypes class for a strongly typed object.
 ************************************************************************************/
import { PersistenceTypes } from "./persistenceTypes.js";

/*************************************************************************************
 * The DataContext class definition.
 * persistenceType: The persistenceType to be used for storage.
 * databaseName: The name for the database.
 * databaseVersion: The version of the database to be used.
 * objectStoreName: The name of the specific object store being used.
 * keyPathField: The object's field or property that will be used for key values.
 ************************************************************************************/
export class DataService {
  constructor(databaseSettings) {
    this._databaseSettings = databaseSettings;
  }

  /*************************************************************************************
   * Retrieves data from persistence layer and returns an array.
   ************************************************************************************/
  async retrieve() {
    let data = [];
    let storageItem = new StorageItem();

    switch (this._persistenceType) {
      //retrieve from cookie service
      case PersistenceTypes.Cookie:
        let cookieService = new CookieService();
        storageItem = cookieService.retrieve(
          this._databaseSettings.databaseName
        );
        if (storageItem != null) data = JSON.parse(storageItem.Value);
        break;

      //retrieve from localStorage service
      case PersistenceTypes.LocalStorage:
        let localStorageService = new LocalStorageService();
        storageItem = localStorageService.retrieve(
          this._databaseSettings.databaseName
        );
        if (storageItem != null) data = JSON.parse(storageItem.Value);
        break;

      //retrieve from sessionStorage service
      case PersistenceTypes.SessionStorage:
        let sessionStorageService = new SessionStorageService();
        storageItem = sessionStorageService.retrieve(
          this._databaseSettings.databaseName
        );
        if (storageItem != null) data = JSON.parse(storageItem.Value);
        break;

      //retrieve from indexedDB service
      case PersistenceTypes.IndexedDB:
        break;

      default:
        break;
    }
    return data;
  }

  /*************************************************************************************
   * Retrieves data from persistence store and returns an array.
   * DatabaseProperties: The database settings to be used when storing the items.
   ************************************************************************************/
  async retrieve(databaseSettings) {
    let data = [];
    let storageItem = new StorageItem();

    switch (databaseSettings.persistenceType) {
      //retrieve from cookie service
      case PersistenceTypes.Cookie:
        let cookieService = new CookieService();
        storageItem = cookieService.retrieve(databaseSettings.databaseName);
        if (storageItem != null) data = JSON.parse(storageItem.Value);
        break;

      //retrieve from LocalStorage service
      case PersistenceTypes.LocalStorage:
        let localStorageService = new LocalStorageService();
        storageItem = localStorageService.retrieve(
          databaseSettings.databaseName
        );
        if (storageItem != null) data = JSON.parse(storageItem.Value);
        break;

      //retrieve from sessionStorage service
      case PersistenceTypes.SessionStorage:
        let sessionStorageService = new SessionStorageService();
        storageItem = sessionStorageService.retrieve(
          databaseSettings.databaseName
        );
        if (storageItem != null) data = JSON.parse(storageItem.Value);
        break;

      //retrieve from indexedDB service
      case PersistenceTypes.IndexedDB:
        let indexedDBService = new IndexedDBService();
        break;

      default:
        break;
    }

    return data;
  }

  /*************************************************************************************
   * Saves items to the data store based on properties set in service initialization.
   * Items: The array of objects or values to be stored.
   ************************************************************************************/
  async persist(items) {
    switch (this._persistenceType) {
      //persist to Cookie service
      case PersistenceTypes.Cookie:
        let cookieService = new CookieService();
        let cookieData = JSON.stringify(items);
        cookieService.save(this.databaseSettings.databaseName, cookieData);
        break;

      //persist to LocalStorage service
      case PersistenceTypes.LocalStorage:
        let localStorageService = new LocalStorageService();
        localStorageService.save(this._database, JSON.stringify(items));
        break;

      //persist to sessionStorage service
      case PersistenceTypes.SessionStorage:
        let sessionStorageService = new SessionStorageService();
        sessionStorageService.save(this._database, JSON.stringify(items));
        break;

      //persist to indexedDB service
      case PersistenceTypes.IndexedDB:
        let indexedDBService = new IndexedDBService();
        indexedDBService.save(null, items);
        break;

      default:
        break;
    }
  }

  /*************************************************************************************
   * Saves items to the data store based on database properties object that is passed in.
   * DatabaseProperties: The database settings to be used when storing the items.
   * Items: The array of objects or values to be stored.
   ************************************************************************************/
  async persist(databaseSettings, items) {
    switch (databaseSettings.persistenceType) {
      //persist to Cookie service
      case PersistenceTypes.Cookie:
        let cookieService = new CookieService();
        let cookieData = JSON.stringify(items);
        cookieService.save(databaseSettings.databaseName, cookieData);
        break;

      //persist to LocalStorage service
      case PersistenceTypes.LocalStorage:
        let localStorageService = new LocalStorageService();
        localStorageService.save(
          databaseSettings.databaseName,
          JSON.stringify(items)
        );
        break;

      //persist to sessionStorage service
      case PersistenceTypes.SessionStorage:
        let sessionStorageService = new SessionStorageService();
        sessionStorageService.save(
          databaseSettings.databaseName,
          JSON.stringify(items)
        );
        break;

      //persist to indexedDB service
      case PersistenceTypes.IndexedDB:
        let indexedDBService = new IndexedDBService();
        indexedDBService.save(databaseSettings, items);
        break;

      default:
        break;
    }
  }
}
