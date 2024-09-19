import { BookForm } from "../BookForm/BookForm";
import { BookList } from "../BookList/BookList";
import { useState } from "react";

/************************************************************************************
 * The ItemStore module is required to manage the collection.
 * The DatabaseSettings module is required to override the default persistence settings.
 * See the example implementations below.
 ************************************************************************************/
import { ItemStore } from "../../services/itemStore.js";

/*************************************************************************************
 * Persistence types is an enum of the browser supported persistence methods.
 * This module can be imported for strongly typed declarations but this is optional.
 * The persistence types can be passed directly as strings.
 ************************************************************************************/
import { PersistenceTypes } from "../../services/dataService.js";

/*************************************************************************************
 * The DatabaseSettings class can be used to override the default persistence settings.
 * Properties such as database name, key field, and persistence type can all be
 * customized using valid options.
 *************************************************************************************/
import { DatabaseSettings } from "../../services/databaseSettings.js";

export default function BookShelf() {
  /**************************************************************************************
   * Use this declaration to create an item store to manage the collection with
   * default persistence settings.
   * This implementation will use cookie storage by default.
   * The collection will be stored with the browser's cookie until the cookie expires or
   * is deleted.
   **************************************************************************************/
  const bookDepot = new ItemStore("MyBookShelf", true);

  /***************************************************************************************
   * An instace of the DatabaseSettings module is required to override the default settings.
   * Settings such as the database name, database version, table name, as well as key field
   * can be overridden.
   * This is also where the persistence type can be changed from cookie storage to another option.
   * This code is ignored when the ItemStore.usePersistence property is set to false.
   ***************************************************************************************/

  //Initialize the data store by passing in a DatabaseSettings object.
  //The persistence types enum can be used for a strongly typed list of supported types.
  let databaseSettings = new DatabaseSettings(
    "MyBookShelf",
    1,
    "Books",
    "id",
    PersistenceTypes.LocalStorage
  );
  bookDepot.initializeDataStore(databaseSettings);

  const [books, updateBooks] = useState([
    {
      id: new Date().getTime(),
      title: "The Road to React",
      author: "Robin Wieruch",
    },
    {
      id: new Date().getTime() + 5,
      title: "The Road to GraphQL",
      author: "Robin Wieruch",
    },
  ]);
  return (
    <>
      <BookForm books={books} updateBooks={updateBooks} />
      <BookList books={books} updateBooks={updateBooks} />
    </>
  );
}
