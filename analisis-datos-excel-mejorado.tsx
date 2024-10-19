import React, { useEffect, useState } from 'react';
import useFileUpload from './src/hooks/useFileUpload';
import { processExcelData } from './src/utils/dataProcessing';

const AnalisisDatosExcelMejorado = () => {
  const { file, handleFileChange } = useFileUpload();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (file) {
      processExcelData(file)
        .then(setData)
        .catch((error) => console.error('Error al procesar el archivo:', error));
    }
  }, [file]);

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".xlsx,.xls" />
      {data.length > 0 && (
        <table>
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, i) => (
                  <td key={i}>{String(value)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AnalisisDatosExcelMejorado;
