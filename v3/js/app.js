// Bookshelf App Interface (MVC).

/************************************************************************************
 * The model class can be imported for a type driven UI, but this is optional.
 * The datastore does not use model properties for persistence.
 * All items are added to an item collection.
 * The item collection is persisted as a JSON array, regardless of the persistence type selected.
 ***********************************************************************************/
import { Book } from "./book.js";

/************************************************************************************
 * The ItemStore module is required to manage the collection.
 * The DatabaseSettings module is required to override the default persistence settings.
 * See the example implementations below.
 ************************************************************************************/
import { ItemStore } from "./itemStore.js";

/*************************************************************************************
 * Persistence types is an enum of the browser supported persistence methods.
 * This module can be imported for strongly typed declarations but this is optional.
 * The persistence types can be passed directly as strings.
 ************************************************************************************/
import { PersistenceTypes } from "./services/persistenceTypes.js";

/*************************************************************************************
 * The DatabaseSettings class can be used to override the default persistence settings.
 * Properties such as database name, key field, and persistence type can all be
 * customized using valid options.
 *************************************************************************************/
import { DatabaseSettings } from "./services/databaseSettings.js";

/*************************************************************************************
 * Use this declaration to create a item store to manage the collection
 * using default settings.
 * The collection will be in memory only and deleted upon page refresh or
 * when the browser window is closed.
 ************************************************************************************/
//const bookDepot = new ItemStore();

/*************************************************************************************
 * Use this declaration to create a item store to manage the collection without persistence.
 * When the usePersistenceStore parameter is set to false, the collection is stored
 * in memory only and deleted upon page refresh or when the browser window is closed.
 *************************************************************************************/
//const bookDepot = new ItemStore(false);

/**************************************************************************************
 * Use this declaration to create an item store to manage the collection with
 * default persistence settings.
 * This implementation will use cookie storage by default.
 * The collection will be stored with the browser's cookie until the cookie expires or
 * is deleted.
 **************************************************************************************/
const bookDepot = new ItemStore(true);

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
  PersistenceTypes.IndexedDB
);
bookDepot.createDataStore(databaseSettings);

/**************************************************************************************
 * New page title
 **************************************************************************************/
const pageTitle = "Javascript - Bookshelf";

/***************************************************************************************
 * HTML markup to display the book collection.
 ***************************************************************************************/
const markUp =
  "<header>" +
  "<h1>Bookshelf</h1>" +
  "<h4>built with plain-old Javascript and HTML5</h4>" +
  "</header>" +
  "<p>" +
  "The aim of this project was to test how long it would take to develop a simple app using native browser language features. The conclusion was...too long. " +
  "Javascript libraries coupled with HTML5/CSS templates, while adding to the complexity of the app, can drastically reduce time to completion." +
  "</p>" +
  '<div class="row">' +
  '<div class="col">' +
  '<fieldset id="new-book-fieldset">' +
  "<legend>Book Details</legend>" +
  '<form style="display:inline-block; padding:5px;">' +
  '<input type="hidden" id="new-book-id" value="0" />' +
  '<label for="new-book-title">Title:</label><input type="text" id="new-book-title" style="display:inline-block; margin-left:8px" />' +
  '<label for="new-book-author" style="margin-left:8px">Author:</label><input type="text" id="new-book-author" style="display:inline-block; margin-left:8px" />' +
  '<label for="new-book-numberOfPages" style="margin-left:8px">Page count:</label><input type="number" id="new-book-numberOfPages"  style="display:inline-block; margin-left:8px" />' +
  '<button id="new-book-form-button" type="submit"  style="display:inline-block; margin-left:8px">Save</button>' +
  '<button id="clear-form" type="reset"  style="display:inline-block; margin-left:8px">Clear</button>' +
  '<button id="reload-data" type="button"  style="display:inline-block; margin-left:8px">Refresh List</button>' +
  "</form>" +
  "</fieldset>" +
  "</div>" +
  "</div>" +
  '<div class="row">' +
  '<div class="col" style="margin-top:50px">' +
  '<div id="book-list">' +
  "</div>" +
  "</div>" +
  "</div>" +
  "</div>";

/**********************************************************************************
 * initialize the page.
 **********************************************************************************/
(function () {
  // set page title
  document.title = pageTitle;

  // create the ui container and append it to the document.
  var container = document.createElement("div");
  container.id = "bookshelf-container";
  container.innerHTML = markUp;
  document.body.appendChild(container);

  // bind events.
  document
    .getElementById("new-book-form-button")
    .addEventListener("click", function (event) {
      saveBook();
      event.preventDefault();
    });

  document
    .getElementById("clear-form")
    .addEventListener("click", function (event) {
      resetForm();
      event.preventDefault();
    });

  document.getElementById("reload-data").addEventListener("click", function () {
    seedTheRepository();
  });

  // seed the collection and update the display
  seedTheRepository();

  // clear the form
  resetForm();
})();

/********************************************************************************
 * Clear all form values.
 ********************************************************************************/
function resetForm() {
  //reset the form.
  document.forms[0].reset();

  // set new book id to 0.
  document.getElementById("new-book-id").value = 0;

  // set focus on the first input
  document.getElementById("new-book-title").focus();
}

/***********************************************************************************
 * Update book list display
 ***********************************************************************************/
function updateListDisplay() {
  // access the book container
  var bookList = document.getElementById("book-list");

  // create an html table element
  var bookTable =
    '<table id="book-table" width="100%">' +
    '<tr id="header-row">' +
    "<th class='table-header'>Title</th>" +
    "<th class='table-header'>Author</th>" +
    "<th class='table-header'>No. of Pages</th>" +
    "<th class='table-header'>Date Added</th>" +
    "<th class='table-header'>Actions</th>" +
    "</tr>" +
    "</table>";

  // add the table to the booklist container
  bookList.innerHTML = bookTable;

  // iterate over books collection and display the properties for each in the table
  for (var x = 0; x <= bookDepot.books.length - 1; x++) {
    // iterate over book collection to create the display list.
    var book = bookDepot.books[x];

    // create a new table row for each book.
    var tr = document.createElement("tr");
    tr.setAttribute("class", "table-row");

    // create a table cell for the title.
    var titleTd = document.createElement("td");
    titleTd.innerHTML = book.title;
    tr.appendChild(titleTd);

    // create a table cell for the author
    var authorTD = document.createElement("td");
    authorTD.innerHTML = book.author;
    tr.appendChild(authorTD);

    // create a table cell for the number of pages
    var pagesTD = document.createElement("td");
    pagesTD.innerHTML = book.numberOfPages;
    pagesTD.setAttribute("style", "text-align:center");
    tr.appendChild(pagesTD);

    // create a table cell for the date added
    var dateTD = document.createElement("td");
    dateTD.innerHTML = book.createdOn;
    dateTD.setAttribute("style", "text-align:center");
    tr.appendChild(dateTD);

    // create a table cell for the actions such as update/delete
    var actionsTD = document.createElement("td");
    actionsTD.setAttribute("id", "actions-" + book.id);
    actionsTD.setAttribute("style", "text-align:center");
    tr.appendChild(actionsTD);

    // create link to update the book.
    var a = document.createElement("a");
    a.setAttribute("href", "#");
    a.setAttribute("id", "u-" + book.id);
    a.setAttribute("data-book-id", book.id);
    a.setAttribute("data-action", "update");
    a.innerHTML = "<span>update</span>";
    actionsTD.appendChild(a);
    a.addEventListener("click", function (event) {
      updateBook(this.dataset.bookId);
      event.preventDefault();
    });

    // create space between the action links since they will be in the same cell
    var s = document.createElement("span");
    s.innerHTML = "&nbsp;&nbsp;";
    actionsTD.appendChild(s);

    // create link to delete the book.
    var d = document.createElement("a");
    d.setAttribute("href", "#");
    d.setAttribute("id", "d-" + book.id);
    d.setAttribute("data-book-id", book.id);
    d.setAttribute("data-action", "delete");
    d.innerHTML = "<span>delete</span>";
    actionsTD.appendChild(d);
    d.addEventListener("click", function (event) {
      deleteBook(this.dataset.bookId);
      event.preventDefault();
    });

    // get the book table container and append the book table to it.
    var bookTableElement = document.getElementById("book-table");
    bookTableElement.appendChild(tr);
  }
}

/***************************************************************************************
 * Save a new book using form values.
 ***************************************************************************************/
function saveBook() {
  // get values from the html input elements.
  let title = document.getElementById("new-book-title").value;
  let author = document.getElementById("new-book-author").value;
  let pages = document.getElementById("new-book-numberOfPages").value;
  let id = parseInt(document.getElementById("new-book-id").value);

  var b = {};

  // if the title and author fields are blank, exit without saving.
  if (
    title.replace(/\s/g, "").length === 0 ||
    author.replace(/\s/g, "").length === 0
  )
    return;

  if (id === 0) {
    // create a new book using the values and add it to the depot.
    b = bookDepot.addBook(new Book(title, author, pages));
  } else {
    //update the existing book
    var book = new Book(title, author, pages);
    book.id = id;
    b = bookDepot.updateBook(book);
  }

  // log the activity.
  console.log(JSON.stringify(b));

  // write the bookDepot object to the console to validate its properties.
  displayCollection();

  // update the display
  updateListDisplay();

  // clear the form
  resetForm();
}

/******************************************************************************************
 * Delete a book from the repository
 * bookId|int: The id for the item to be deleted.
 ******************************************************************************************/
function deleteBook(bookId) {
  // remove the book by id.
  var b = bookDepot.removeBookById(bookId);

  // update the display
  updateListDisplay();

  // log the activity.
  console.log(JSON.stringify(b));
}

/******************************************************************************************
 * Update book.
 * bookId|int: The id of the book to be updated.
 ******************************************************************************************/
function updateBook(bookId) {
  // find the book to be updated
  var book = bookDepot.getBookById(bookId);

  // load the values to the html input elements.
  document.getElementById("new-book-title").value = book.title;
  document.getElementById("new-book-author").value = book.author;
  document.getElementById("new-book-numberOfPages").value = book.numberOfPages;
  document.getElementById("new-book-id").value = book.id;
}

/******************************************************************************************
 * Output the contents of the repository object to the console.
 ******************************************************************************************/
function displayCollection() {
  // display the repository in the console.
  console.log(bookDepot);
}

/******************************************************************************************
 * Load any existing items from the repository and update the display.
 ******************************************************************************************/
async function seedTheRepository() {
  bookDepot.books = await bookDepot.retrieve();
  updateListDisplay();
}
