import { BookForm } from "../BookForm/BookForm";
import { BookList } from "../BookList/BookList";
import { useLocalStorage } from "../../servicehooks/useLocalStorage.jsx";
import { useState } from "react";

export default function BookShelf() {
  const [books, updateBooks] = useLocalStorage("MyBookShelf", []);
  const [selectedBook, setSelectedBook] = useState({});
  return (
    <>
      <BookForm
        books={books}
        updateBooks={updateBooks}
        selectedBook={selectedBook}
        setSelectedBook={setSelectedBook}
      />
      <BookList
        books={books}
        updateBooks={updateBooks}
        setSelectedBook={setSelectedBook}
      />
    </>
  );
}
