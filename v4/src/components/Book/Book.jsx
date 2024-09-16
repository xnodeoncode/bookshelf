import PropTypes from "prop-types";
import styles from "./Book.module.css";

export default function Book({ book, books, updateBooks }) {
  function deleteBook(book) {
    updateBooks(books.filter((b) => b.id !== book.id));
  }

  return (
    <>
      <div className={styles.item}>
        {book.id}
        {book.title}
        {book.author}

        <button
          className={styles.button}
          id={book.id}
          onClick={() => deleteBook(book)}
        >
          x
        </button>
      </div>
    </>
  );
}

Book.propTypes = {
  book: PropTypes.object.isRequired,
  books: PropTypes.array.isRequired,
  updateBooks: PropTypes.func.isRequired,
};
