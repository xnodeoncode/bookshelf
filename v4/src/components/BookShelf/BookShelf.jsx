import { BookForm } from "../BookForm/BookForm";
import { BookList } from "../BookList/BookList";
import { useState } from "react";

export default function BookShelf() {
  const [books, updateBooks] = useState([
    {
      id: new Date().getTime(),
      title: "The Road to React",
      author: "Robin Wieruch",
    },
    {
      id: new Date().getTime() + 5,
      title: "The Road to GraphQL",
      author: "Robin Wieruch",
    },
  ]);
  return (
    <>
      <BookForm books={books} updateBooks={updateBooks} />
      <BookList books={books} updateBooks={updateBooks} />
    </>
  );
}
