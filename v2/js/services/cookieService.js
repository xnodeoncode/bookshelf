import { StorageItem } from "./storageItem.js";

export class CookieService {
  constructor() {}

  save(cookieName, cookieData) {
    //TODO: validate size of cookie.
    // if it is too large, fall back to indexedDB and log a message.
    let day = 24 * 60 * 60 * 1000;
    let cookie = {
      name: `${cookieName}`,
      value: `${cookieData}`,
      expires: Date.now() + day,
    };
    cookieStore.set(cookie);
  }
  retrieve(cookieName) {
    let data = null;
    let cookieData = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${cookieName}=`))
      ?.split("=")[1];

    if (cookieData != null && cookieData.length > 0) {
      data = cookieData;
    }
    return data;
  }
  remove(cookieName) {}
  clear(cookieName) {}
}
