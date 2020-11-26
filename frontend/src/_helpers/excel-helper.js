import readXlsxFile from "read-excel-file";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

export default class DataHelper {
  parseExcelFile = (filePath) => {
    return readXlsxFile(filePath).then((rows) => {
      // `rows` is an array of rows
      // each row being an array of cells.
      for (const row of rows) {
        console.log(row);
      }
      return { header: rows.unshift(), data: rows.slice(1) };
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
  exportData = (csvData, fileName) => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };
}
