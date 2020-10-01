import readXlsxFile from "read-excel-file";

export default class DataHelper {
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

  parseRows = (rows) => {
    if (!rows || rows.length == 0) throw Error("empty rows");
    let users = [];
    rows.map((row, index) => {
      let user = {};
      row.forEach((cols, idx) => {
        switch (idx) {
          case 0:
            user["username"] = row[idx];
            break;
          case 1:
            user["firstname"] = row[idx];
            break;
        }
      });
    });
  };
}
