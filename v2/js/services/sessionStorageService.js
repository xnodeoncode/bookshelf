import { StorageItem } from "./storageItem.js";

export class SessionStorageService {
  constructor() {
    this._storageAvailable = this.storageAvailable("sessionStorage");
  }

  save(storageItemName, storageItemValue) {
    if (this._storageAvailable) {
      window.sessionStorage.setItem(storageItemName, storageItemValue);
    } else {
      console.log("Session storage is not available.");
    }
  }

  retrieve(storageItemName) {
    if (this._storageAvailable) {
      return window.sessionStorage.getItem(storageItemName);
    }
  }

  remove(storageItemName) {
    if (this._storageAvailable) {
      window.sessionStorage.removeItem(storageItemName);
    } else {
      console.log("Session storage is not available.");
    }
  }

  clear() {
    if (this._storageAvailable) {
      window.sessionStorage.clear();
    } else {
      console.log("Session storage is not available.");
    }
  }

  /***********************************************************************************
   * Storage avaialability test taken from MDN Web Docs
   * https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
   ***********************************************************************************/
  storageAvailable(type) {
    let storage;
    try {
      storage = window[type];
      const x = "__storage_test__";
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        // everything except Firefox
        (e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === "QuotaExceededError" ||
          // Firefox
          e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
      );
    }
  }
}
