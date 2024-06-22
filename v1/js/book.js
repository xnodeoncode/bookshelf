/**********************************************
 * Book class
 **********************************************/
export class Book {
  constructor(title, author, numberOfPages) {
    this.id = 0;
    this.title = title;
    this.author = author;
    this.numberOfPages = numberOfPages;
    this.createdOn = this.getDate();
    this.modifiedOn = this.getDate();
  }

  /*********************************************
   * Get current date as a locale string
   *********************************************/
  getDate() {
    let today = new Date();
    return today.toLocaleDateString();
  }

  /*********************************************
   * Returns book details.
   *********************************************/
  getDetails() {
    return `${this.title} has ${this.numberOfPages} pages and was written by ${this.author}`;
  }

  /**********************************************
   * Returns the total number of pages in the book.
   ***********************************************/
  totalPages() {
    return this.numberOfPages;
  }
}
