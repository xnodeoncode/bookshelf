import { header } from "./AppHeader.module.css";
export default function AppHeader() {
  const meta = {
    title: "Bookshelf",
    description: "A library of books",
    author: "Bacardi Bryant",
    keywords: ["library", "books", "ReactJS", "Vite", "JavaScript"],
    version: "4.2.2",
  };
  return (
    <header className={header}>
      <h1>{meta.title}</h1>
      <p>
        {meta.description} | v{meta.version}
      </p>
    </header>
  );
}
