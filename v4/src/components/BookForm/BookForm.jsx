import { PropTypes } from "prop-types";
import { useState } from "react";
import styles from "./BookForm.module.css";

export function BookForm({ books, updateBooks }) {
  const [book, updateBook] = useState({
    id: "",
    title: "",
    author: "",
    pageCount: 0,
    description: "",
  });

  function saveBook(e) {
    book.id = new Date().getTime();
    console.log(book);
    updateBook({ ...book });

    updateBooks([...books, book]);
    e.preventDefault();
  }

  return (
    <div className={styles.container}>
      <h3>Add a Book</h3>
      <form onSubmit={saveBook}>
        <label htmlFor="name">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={book.title}
          onChange={(e) =>
            updateBook({
              ...book,
              title: e.target.value,
            })
          }
        />
        <label htmlFor="author">Author:</label>
        <input
          type="text"
          id="author"
          name="author"
          value={book.author}
          onChange={(e) =>
            updateBook({
              ...book,
              author: e.target.value,
            })
          }
        />
        <label htmlFor="pageCount">Pages:</label>
        <input
          type="text"
          id="pageCount"
          name="pageCount"
          value={book.pageCount}
          onChange={(e) =>
            updateBook({
              ...book,
              pageCount: e.target.value,
            })
          }
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

BookForm.propTypes = {
  books: PropTypes.array.isRequired,
  updateBooks: PropTypes.func.isRequired,
};
