/***********************************************************************
 * Book class
 * Title|string: The book title.
 * Author|string: The book's author.
 * NumberOfPages|int: The number of pages in the book.
 ***********************************************************************/
export class Book {
  constructor(title, author, numberOfPages) {
    this.id = 0;
    this.title = title;
    this.author = author;
    this.numberOfPages = numberOfPages;
    this.createdOn = this.getDate();
    this.modifiedOn = this.getDate();
  }

  /***********************************************************************
   * Gets current date as a locale string
   ***********************************************************************/
  getDate() {
    let today = new Date();
    return today.toLocaleDateString();
  }

  /***********************************************************************
   * Returns|string: Book details.
   ***********************************************************************/
  getDetails() {
    return `${this.title} has ${this.numberOfPages} pages and was written by ${this.author}`;
  }

  /***********************************************************************
   * Returns|int: The total number of pages in the book.
   ***********************************************************************/
  totalPages() {
    return this.numberOfPages;
  }
}
