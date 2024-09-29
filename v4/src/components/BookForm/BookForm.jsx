import { PropTypes } from "prop-types";
import { useState } from "react";
import styles from "./BookForm.module.css";

export function BookForm({
  books,
  updateBooks,
  selectedBook,
  setSelectedBook,
}) {
  const [book, updateBook] = useState({
    id: "",
    title: "",
    author: "",
    pageCount: 0,
    description: "",
  });

  if (selectedBook.id && selectedBook.id !== book.id) {
    updateBook(selectedBook);
  }

  function clearForm(e) {
    selectedBook = {
      id: "",
      title: "",
      author: "",
      pageCount: 0,
      description: "",
    };
    setSelectedBook(selectedBook);
    updateBook(selectedBook);
    e.preventDefault();
    return;
  }

  function saveBook(e) {
    if (selectedBook.id) {
      const bookIndex = books.findIndex((b) => b.id === selectedBook.id);
      books[bookIndex] = book;
      updateBooks([...books]);
      return;
    }
    book.id = new Date().getTime();
    console.log(book);
    updateBook({ ...book });

    updateBooks([...books, book]);
    clearForm(e);
    e.preventDefault();
  }

  return (
    <div className={styles.container}>
      <h3>Add a Book</h3>
      <form onSubmit={saveBook}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={book.title}
          placeholder="Enter book title"
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
          placeholder="Enter book author"
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
          placeholder="Enter page count"
          onChange={(e) =>
            updateBook({
              ...book,
              pageCount: e.target.value,
            })
          }
        />
        <button type="submit">Save</button>
        <button type="reset" onClick={(e) => clearForm(e)}>
          Clear
        </button>
      </form>
    </div>
  );
}

BookForm.propTypes = {
  books: PropTypes.array.isRequired,
  updateBooks: PropTypes.func.isRequired,
};
