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

    iterator:0,

    generateId:function(){

        this.iterator++;
        return this.iterator;
    },

    getBookById:function(bookId){
        bookId = parseInt(bookId);
        var book = this.books.find(b=>b.id == bookId);
        console.log(`Found ${book.title} by id.`);
        return book;
    },

    addBook:function(book){
        book.id = parseInt(book.id);
        book.id = (book.id == 0) ? this.generateId() : book.id;
        book.numberOfPages = parseInt(book.numberOfPages);
        this.books.push(book);
        this.sort();
        console.log(`${book.title} has been added to the book collection.`);
    },

    updateBook:function(book){
        this.removeBook(book);
        this.addBook(book);
        this.log(book,"has been updated.");
    },

    removeBook:function(book){
        book.id = parseInt(book.id);
        this.books = this.books.filter(obj => obj.id !== book.id);
        console.log(`${book.title} has been removed from the book collection.`);
    },

    removeBookById:function(bookId){
        bookId = parseInt(bookId);
        var b = this.books.find(item => item.id == bookId);
        this.books.splice(this.books.findIndex(i=>i.id == b.id),1);
        console.log(`Book ${bookId} has been deleted by id.`);
        console.log(this.books);
    },

    sort:function(){
        this.books.sort(function(a,b){
            return a.id - b.id;
        });
    },

    log:function(book,message){
        console.log(`${book.title} ${message}`)
    }

};