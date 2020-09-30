import readXlsxFile from "read-excel-file";

export default class ExcelHelper {
  parseExcelFile = (filePath) => {
    return readXlsxFile(filePath).then((rows) => {
      // `rows` is an array of rows
      // each row being an array of cells.
      for (const row of rows) {
        console.log(row);
      }
      return rows;
    });
  };
}
