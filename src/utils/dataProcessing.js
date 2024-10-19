import * as XLSX from 'xlsx';

export const processExcelData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'binary' });
        const firstSheetName = wb.SheetNames[0];
        const ws = wb.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(ws);
        resolve(json);
      } catch (error) {
        reject(error);
      }
    };

    reader.readAsBinaryString(file);
  });
};
