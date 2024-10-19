import { useRef } from 'react';
import { Button } from "./components/ui/button";
import { Upload } from 'lucide-react';

const FileUpload = ({ onFileUpload, workbook, currentSheet, onSheetChange }) => {
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    onFileUpload(file);
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <Button variant="outline" className="flex items-center" onClick={() => fileInputRef.current.click()}>
        <Upload className="mr-2 h-4 w-4" />
        Cargar Excel
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".xlsx,.xls"
        style={{ display: 'none' }}
        aria-label="Cargar archivo Excel"
      />
      {workbook && (
        <Select value={currentSheet} onValueChange={onSheetChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecciona hoja" />
          </SelectTrigger>
          <SelectContent>
            {workbook.SheetNames.map((sheetName) => (
              <SelectItem key={sheetName} value={sheetName}>
                {sheetName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default FileUpload;
