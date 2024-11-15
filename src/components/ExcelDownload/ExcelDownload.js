import { saveAs } from "file-saver";
import * as XLSX from 'xlsx';


export default function ExportToExcel(data, fileName = "data") {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([buf], { type: "application/octet-stream" });
  saveAs(blob, `${fileName}.xlsx`);
}
