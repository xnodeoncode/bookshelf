/*
  Persistence store class with default property values. These property values can be overwritten by constructor values.
*/
export class DatabaseSettings {
  constructor(
    databaseName,
    databaseVersion,
    tableName,
    keyPathField,
    persistenceType
  ) {
    this.databaseName = databaseName || "Default";
    this.databaseVersion = databaseVersion || 1;
    this.objectStoreName = tableName || "ItemStore";
    this.keyPathField = keyPathField || "id";
    this.persistenceType = persistenceType || PersistenceTypes.Cookie;
  }
}
