import { useState, useEffect, useMemo, useCallback } from 'react';
import Chart from './Chart';
import FileUpload from './FileUpload';
import Summary from './Summary';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Alert } from "./components/ui/alert";
import * as XLSX from 'xlsx';

export default function AnalisisDatosExcelMejorado() {
  const [workbook, setWorkbook] = useState(null);
  const [currentSheet, setCurrentSheet] = useState('');
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [chartType, setChartType] = useState('bar');
  const [selectedColumns, setSelectedColumns] = useState({ x: '', y: '', z: '' });
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'binary' });
        setWorkbook(wb);
        const firstSheetName = wb.SheetNames[0];
        setCurrentSheet(firstSheetName);
        const ws = wb.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(ws);
        if (json.length > 0) {
          setData(json);
          const cols = Object.keys(json[0]);
          setColumns(cols);
          // Auto-select numeric columns
          const numericColumns = cols.filter(col => typeof json[0][col] === 'number');
          setSelectedColumns({ x: cols[0], y: numericColumns[0] || '', z: numericColumns[1] || '' });
          setError('');
          generateSummary(json);
        } else {
          throw new Error('El archivo está vacío o no contiene datos válidos.');
        }
      } catch (err) {
        setError(`Error al leer el archivo: ${err.message}`);
      }
    };

    if (file) {
      reader.readAsBinaryString(file);
    }
  };

  const handleSheetChange = (sheetName) => {
    setCurrentSheet(sheetName);
    const ws = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(ws);
    if (json.length > 0) {
      setData(json);
      const cols = Object.keys(json[0]);
      setColumns(cols);
      const numericColumns = cols.filter(col => typeof json[0][col] === 'number');
      setSelectedColumns({ x: cols[0], y: numericColumns[0] || '', z: numericColumns[1] || '' });
      setError('');
      generateSummary(json);
    } else {
      setError('La hoja seleccionada está vacía o no contiene datos válidos.');
    }
  };

  const generateSummary = (data) => {
    const numericColumns = columns.filter(column => typeof data[0][column] === 'number');
    const summary = {};
    numericColumns.forEach(column => {
      const values = data.map(row => row[column]);
      summary[column] = {
        min: Math.min(...values),
        max: Math.max(...values),
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        sum: values.reduce((a, b) => a + b, 0)
      };
    });
    setSummary(summary);
  };

  const chartData = useMemo(() => {
    if (!selectedColumns.x || !selectedColumns.y || data.length === 0) return [];
    return data.map(item => ({
      x: item[selectedColumns.x],
      y: parseFloat(item[selectedColumns.y]) || 0,
      z: selectedColumns.z ? parseFloat(item[selectedColumns.z]) || 0 : undefined
    }));
  }, [data, selectedColumns]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Análisis de Datos Excel Mejorado</CardTitle>
        <CardDescription>Carga tu archivo Excel para un análisis detallado con múltiples gráficas y resumen general</CardDescription>
      </CardHeader>
      <CardContent>
        <FileUpload onFileUpload={handleFileUpload} workbook={workbook} currentSheet={currentSheet} onSheetChange={handleSheetChange} />
        {error && <Alert variant="destructive" className="mb-4">{error}</Alert>}
        {columns.length > 0 && (
          <div>
            {/* Componentes de selección para tipo de gráfico y columnas */}
          </div>
        )}
        {chartData.length > 0 && (
          <Chart type={chartType} data={chartData} columns={selectedColumns} />
        )}
        <Summary summary={summary} />
      </CardContent>
      <CardFooter>
        {/* Botón para descargar el Excel, si hay datos */}
      </CardFooter>
    </Card>
  );
}
