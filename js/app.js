// book class to instantiate new books.
class Book {
    constructor(title, author, numberOfPages) {
        this.id = 0;
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

// book depot object used to manage the book collection.
var bookDepot = {

    books:[],

    getBookById:function(bookId){
        var book = this.books.find(b=>b.id == bookId);
        console.log(`Found ${book.title} by id.`);
        return book;
    },

    addBook:function(book){
        book.id = this.books.length + 1;
        this.books.push(book);
        console.log(`${book.title} has been added to the book collection.`);
    },

    removeBook:function(book){
        var b = this.books.find(item => item === book);
        this.books.splice(this.books.findIndex(i=>i.id === book.id),1);
        console.log(`${book.title} has been removed from the book collection.`);
    },

    removeBookById:function(bookId){
        var b = this.books.find(item => item.id == bookId);
        this.books.splice(this.books.findIndex(i=>i.id == b.id),1);
        console.log(`Book ${bookId} has been deleted by id.`);
        console.log(this.books);
    }

};