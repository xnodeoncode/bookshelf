"use strict";

// export class Exceptions {
//   constructor() {
//     this.PersistenceServiceNotEnabled.prototpe = Error.prototype;
//   }
//   PersistenceServiceNotEnabled(message = "") {
//     this.message = message;
//     this.name = "PersistenceServiceNotEnabled";
//   }
// }

export function PersistenceServiceNotEnabled(message = "") {
  this.message = message;
  this.name = "PersistenceServiceNotEnabled";
}
PersistenceServiceNotEnabled.prototpe = Error.prototype;

export function DataServiceUnavailable(message = "") {
  this.name = "DataServiceUnavailable";
  this.message = message;
}
DataServiceUnavailable.prototype = Error.prototype;
