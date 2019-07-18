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

    addBook:function(book){
        book.id = this.books.length + 1;
        this.books.push(book);
        console.log(this.books);
    },

    removeBook:function(book){
        for (let b in this.books){
            if(this.books[b].id === book.id){
                this.books.splice(this.books.findIndex(i => i.id === book.id),1);
            }
        }
        console.log(this.books);
    }

};