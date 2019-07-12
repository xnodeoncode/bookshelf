class Book {
    constructor(title, author, numberOfPages) {
        this.title = title;
        this.author = author;
        this.numberOfPages = numberOfPages;
    }

    getDetails() {
        return `${this.title} is ${this.numberOfPages} long and was written by ${this.author}`;
    }

    static totalPages(book) {
        return book.numberOfPages;
    }
}

var bookOne = new Book("Playing to Win", "A.G. Lafley", 260);
console.log(bookOne.getDetails());

console.log(Book.totalPages(bookOne));