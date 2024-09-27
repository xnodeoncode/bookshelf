import PropTypes from "prop-types";
import Book from "../Book/Book";
import styles from "./BookList.module.css";

export function BookList({ books, updateBooks, setSelectedBook }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Book List</h1>
      {books.map((book) => (
        <Book
          key={book.id}
          book={book}
          books={books}
          updateBooks={updateBooks}
          setSelectedBook={setSelectedBook}
        />
      ))}
    </div>
  );
}

BookList.propTypes = {
  books: PropTypes.array.isRequired,
  updateBooks: PropTypes.func.isRequired,
};
