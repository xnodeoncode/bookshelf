// Bookshelf App Interface (MVC).

/****************************************************************************************
 * The model class can be imported for a type driven UI, but this is optional.
 * The datastore does not use model properties for persistence.
 * All items are added to an item collection.
 * The item collection is persisted as a JSON array, regardless of the persistence type selected.
 *****************************************************************************************/
import { Book } from "./book.js";

/****************************************************************************************
 * The ItemStore module is required to manage the collection.
 *****************************************************************************************/
import { ItemStore } from "./itemStore.js";

/***************************************************************************************
 * Use this declaration to create a item store to manage the collection using default settings.
 * The collection will be in memory only and deleted upon page refresh or when the browser window is closed.
 ****************************************************************************************/
const bookDepot = new ItemStore();

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
  "</form>" +
  "</fieldset>" +
  "</div>" +
  "</div>" +
  '<div class="row">' +
  '<div class="col" style="margin-top:50px">' +
  '<div id="book-list"><div style="margin:auto; text-align:center; padding:90px;">Loading...</div>' +
  "</div>" +
  "</div>" +
  "</div>" +
  "</div>";

/*********************************************************************************
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

  // seed the collection and update the display
  seedTheRepository();

  // clear the form
  resetForm();
})();

/*********************************************************************************
 * Clear all form values.
 ********************************************************************************/
function resetForm() {
  // get all inputs
  var inputs = document.querySelectorAll(
    "input[type='text'],input[type='number']"
  );

  // traditional for loop over the collection of elements.
  for (var x = 0; x <= inputs.length; x++) {
    var element = inputs[x];
    if (element) {
      element.value = "";
    }
  }

  // set new book id to 0.
  document.getElementById("new-book-id").value = 0;

  // set focus on the first input
  document.getElementById("new-book-title").focus();
}

/**********************************************************************************
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
    var editLink = document.createElement("a");
    editLink.setAttribute("href", "#");
    editLink.setAttribute("id", "u-" + book.id);
    editLink.setAttribute("data-book-id", book.id);
    editLink.setAttribute("data-action", "update");
    editLink.innerHTML = "<span>update</span>";
    actionsTD.appendChild(editLink);
    editLink.addEventListener("click", function (event) {
      updateBook(this.dataset.bookId);
      event.preventDefault();
    });

    // create space between the action links since they will be in the same cell
    var s = document.createElement("span");
    s.innerHTML = "&nbsp;&nbsp;";
    actionsTD.appendChild(s);

    // create link to delete the book.
    var deleteLink = document.createElement("a");
    deleteLink.setAttribute("href", "#");
    deleteLink.setAttribute("id", "d-" + book.id);
    deleteLink.setAttribute("data-book-id", book.id);
    deleteLink.setAttribute("data-action", "delete");
    deleteLink.innerHTML = "<span>delete</span>";
    actionsTD.appendChild(deleteLink);
    deleteLink.addEventListener("click", function (event) {
      deleteBook(this.dataset.bookId);
      event.preventDefault();
    });

    // get the book table container and append the book table to it.
    var bookTableElement = document.getElementById("book-table");
    bookTableElement.appendChild(tr);
  }
}

/**************************************************************************************
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

/*****************************************************************************************
 * Delete a book from the repository
 ******************************************************************************************/
function deleteBook(bookId) {
  // remove the book by id.
  var b = bookDepot.removeBookById(bookId);

  // update the display
  updateListDisplay();

  // log the activity.
  console.log(JSON.stringify(b));
}

/*****************************************************************************************
 * Update a single book
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

/*****************************************************************************************
 * Output the contents of the repository object to the console.
 ******************************************************************************************/
function displayCollection() {
  console.log(bookDepot);
}

/******************************************************************************************
 * Seed the repository and update the display.
 ******************************************************************************************/
async function seedTheRepository() {
  var b1 = new Book("Every Day a Friday", "Joel Olsteen", 250);
  var b2 = new Book("Playing to Win", "A.G. Lafley", 820);
  var b3 = new Book(
    "Leading with Emotional Intelligence",
    "Reldan S. Nadler",
    540
  );

  bookDepot.addBook(b1);

  //This is a hack to prevent race conditions where multiple items may have the same id.
  //There could be another implementation.
  wait(0.5)
    .then(() => {
      bookDepot.addBook(b2);
    })
    .then(() => {
      wait(0.5).then(() => {
        bookDepot.addBook(b3);
        updateListDisplay();
      });
    });
}

/*********************************************************************************************
 * Simulates a delay.
 * Promise which expects seconds, which are converted to milliseconds.
 **********************************************************************************************/
function wait(time) {
  return new Promise((resolve) => setTimeout(resolve, time * 1000));
}
