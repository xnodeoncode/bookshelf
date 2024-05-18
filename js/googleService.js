"use strict";

// NOT YET IMPLEMENTED
// Google Service to search Google Books and provide info on titles.

import { GoogleConfigurationOptions } from "./googleConfiguration.js";

export class GoogleService {
  constructor() {
    (this._apiKey = this.getAPIKey()),
      (this._baseURL = "https://www.googleapis.com/books/v1/volumes?q=");
    this._querySuffix = `&key=${this._apiKey}`;
    this._searchTerms = {
      Title: "intitle",
      Author: "inauthor",
      Publisher: "inpublisher",
      Subject: "subject",
      ISBN: "isbn",
      LCCN: "lccn",
      OCLC: "oclc",
    };
  }

  async search(term) {
    searchTerm = `+${this._searchTerms.Title}`;
    let fullURL = this._baseURL + term + searchTerm + this._querySuffix;
    let result = "";

    result = await restRequest(fullURL);

    return result;
  }

  async restRequest(destination) {
    let response = await fetch(destination);
    const jsonResult = await response.json();
    return jsonResult;
  }

  getAPIKey() {
    var gco = new GoogleConfigurationOptions();
    return gco.APIKeys.GoogleBooks;
  }
}
