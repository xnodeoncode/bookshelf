import { DataContext, SampleData, StorageLocations } from "i45";
import { useState, useEffect } from "react";

const context = new DataContext("Books", StorageLocations.LocalStorage);
context.enableLogging(true);

export function useDataContext(data) {
  const [value, setValue] = useState(data);

  var existing = context.retrieve();

  useEffect(() => {
    existing.then((edata) => {
      if (edata && edata.length > 0) {
        setValue(edata);
      } else {
        setValue(data);
      }
    });
  }, []);

  useEffect(() => {
    if (value && value.length > 0) context.store(value);
  }, [value]);

  return [value, setValue];
}
