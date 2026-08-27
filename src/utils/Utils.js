import { saveAs } from "file-saver";

const downloadFile = (response) => {
  const dirtyFileName = response.headers["content-disposition"];
  const regex =
    /filename[^;=\n]*=(?:(\\?['"])(.*?)\1|(?:[^\s]+'.*?')?([^;\n]*))/;
  const fileName = dirtyFileName.match(regex)[3];
  const blob = new Blob([response.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, fileName);
};

const escapeCsvValue = (value) => {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
};

const downloadCsv = (rows, columns, filename) => {
  const header = columns.map((col) => escapeCsvValue(col.headerName)).join(",");
  const body = rows
    .map((row) => columns.map((col) => escapeCsvValue(row[col.field])).join(","))
    .join("\n");
  const blob = new Blob([`${header}\n${body}`], {
    type: "text/csv;charset=utf-8;",
  });
  saveAs(blob, filename);
};

export { downloadFile, downloadCsv };

