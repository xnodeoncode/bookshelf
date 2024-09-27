import { useState, useEffect } from "react";

function getItem(key, initialValue) {
  try {
    const item = window.localStorage.getItem(key, initialValue);
    console.log("getItem from useLocalStorage", item);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.log("Get item failed", { cause: error });
  }

  if (initialValue instanceof Function) return initialValue();
  return initialValue;
}

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    return getItem(key, initialValue);
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
}
