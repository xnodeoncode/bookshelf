import PropTypes from "prop-types";
import styles from "./Book.module.css";

export default function Book({ book, books, updateBooks, setSelectedBook }) {
  function deleteBook(book) {
    updateBooks(books.filter((b) => b.id !== book.id));
  }

  return (
    <>
      <div className={styles.item}>
        <div className={styles.itemInfo}>
          <h3>{book.title}</h3>
          Author: {book.author} | Pages: {book.pageCount}
        </div>
        <div className={styles.buttons}>
          <button
            id={"e_" + book.id}
            type="button"
            onClick={() => setSelectedBook(book)}
          >
            ✏️
          </button>
          <button
            type="button"
            id={"d_" + book.id}
            onClick={() => deleteBook(book)}
          >
            🗑️
          </button>
        </div>
      </div>
    </>
  );
}

Book.propTypes = {
  book: PropTypes.object.isRequired,
  books: PropTypes.array.isRequired,
  updateBooks: PropTypes.func.isRequired,
};
