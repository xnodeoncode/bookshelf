import { StorageItem } from "./storageItem.js";

export class LocalStorageService {
  constructor() {
    this._storageAvailable = this.storageAvailable("localStorage");
  }

  save(storageItemName, storageValue) {
    if (this._storageAvailable) {
      let storageItem = new StorageItem(storageItemName, storageValue);
      window.localStorage.setItem(storageItem.Name, storageItem.Value);
    } else {
      console.log("Local storage is not available.");
    }
  }

  retrieve(storageItemName) {
    let item = new StorageItem();

    if (this._storageAvailable) {
      if (storageItemName.length > 0) {
        item = window.localStorage.getItem(storageItemName);
      }
    } else {
      console.log("Local storage is not available.");
    }

    return item;
  }

  remove(storageItemName) {
    if (this._storageAvailable) {
      if (storageItemName.length > 0) {
        window.localStorage.removeItem(storageItemName);
      }
    } else {
      console.log("Local storage is not available.");
    }
  }

  clear() {
    if (this._storageAvailable) {
      window.localStorage.clear();
    } else {
      console.log("Local storage is not available.");
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
