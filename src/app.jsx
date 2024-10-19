"use client"

import { useState, useRef, useEffect, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card"; 

import Button from "./components/ui/button"; 

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "./components/ui/table"; 

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select"; 

import {
  BarChart,
  LineChart,
  ScatterChart,
  AreaChart,
  PieChart,
  RadarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  Line,
  Scatter,
  Area,
  Pie,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Cell,
} from 'recharts'; 

import {
  Download,
  Upload,
  Brain,
  RefreshCw,
} from 'lucide-react'; 

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "./components/ui/alert"; 

import Progress from "./components/ui/progress"; 

import * as XLSX from 'xlsx'; 


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

// Componente para renderizar gráficos
const Chart = ({ type, data, columns }) => {
  const commonProps = {
    data,
    margin: { top: 5, right: 30, left: 20, bottom: 5 },
  }

  switch(type) {
    case 'bar':
      return (
        <BarChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="y" fill="#8884d8" name={columns.y} />
        </BarChart>
      )
    case 'line':
      return (
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="y" stroke="#8884d8" name={columns.y} />
        </LineChart>
      )
    case 'scatter':
      return (
        <ScatterChart {...commonProps}>
          <CartesianGrid />
          <XAxis dataKey="x" name={columns.x} />
          <YAxis dataKey="y" name={columns.y} />
          {columns.z && <ZAxis dataKey="z" range={[64, 144]} name={columns.z} />}
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Legend />
          <Scatter name="Datos" data={data} fill="#8884d8" />
        </ScatterChart>
      )
    case 'area':
      return (
        <AreaChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="y" stroke="#8884d8" fill="#8884d8" name={columns.y} />
        </AreaChart>
      )
    case 'pie':
      return (
        <PieChart>
          <Pie data={data} dataKey="y" nameKey="x" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      )
    case 'radar':
      return (
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="x" />
          <PolarRadiusAxis />
          <Radar name={columns.y} dataKey="y" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          <Legend />
        </RadarChart>
      )
    default:
      return null
  }
}

export default function AnalisisDatosExcelMejorado() {
  const [workbook, setWorkbook] = useState(null)
  const [currentSheet, setCurrentSheet] = useState('')
  const [data, setData] = useState([])
  const [columns, setColumns] = useState([])
  const [chartType, setChartType] = useState('bar')
  const [selectedColumns, setSelectedColumns] = useState({ x: '', y: '', z: '' })
  const [error, setError] = useState('')
  const [aiInsights, setAiInsights] = useState('')
  const [aiConfidence, setAiConfidence] = useState(70)
  const [isTraining, setIsTraining] = useState(false)
  const [summary, setSummary] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'binary' })
        setWorkbook(wb)
        const firstSheetName = wb.SheetNames[0]
        setCurrentSheet(firstSheetName)
        const ws = wb.Sheets[firstSheetName]
        const json = XLSX.utils.sheet_to_json(ws)

        if (json.length > 0) {
          setData(json)
          const cols = Object.keys(json[0])
          setColumns(cols)
          // Seleccionar automáticamente las primeras columnas numéricas
          const numericColumns = cols.filter(col => typeof json[0][col] === 'number')
          setSelectedColumns({ 
            x: cols[0], 
            y: numericColumns[0] || '', 
            z: numericColumns[1] || '' 
          })
          setError('')
          generateSummary(json)
        } else {
          throw new Error('El archivo está vacío o no contiene datos válidos.')
        }
      } catch (err) {
        setError(`Error al leer el archivo: ${err.message}`)
      }
    }

    if (file) {
      reader.readAsBinaryString(file)
    }
  }

  const handleSheetChange = (sheetName) => {
    setCurrentSheet(sheetName)
    const ws = workbook.Sheets[sheetName]
    const json = XLSX.utils.sheet_to_json(ws)

    if (json.length > 0) {
      setData(json)
      const cols = Object.keys(json[0])
      setColumns(cols)
      const numericColumns = cols.filter(col => typeof json[0][col] === 'number')
      setSelectedColumns({ 
        x: cols[0], 
        y: numericColumns[0] || '', 
        z: numericColumns[1] || '' 
      })
      setError('')
      generateSummary(json)
    } else {
      setError('La hoja seleccionada está vacía o no contiene datos válidos.')
    }
  }

  const generateSummary = (data) => {
    const numericColumns = columns.filter(column => typeof data[0][column] === 'number')
    const summary = {}

    numericColumns.forEach(column => {
      const values = data.map(row => row[column])
      summary[column] = {
        min: Math.min(...values),
        max: Math.max(...values),
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        sum: values.reduce((a, b) => a + b, 0)
      }
    })

    setSummary(summary)
  }

  const chartData = useMemo(() => {
    if (!selectedColumns.x || !selectedColumns.y || data.length === 0) return []

    return data.map(item => ({
      x: item[selectedColumns.x],
      y: parseFloat(item[selectedColumns.y]) || 0,
      z: selectedColumns.z ? parseFloat(item[selectedColumns.z]) || 0 : undefined
    }))
  }, [data, selectedColumns])

  const renderSummaryChart = () => {
    if (!summary) return null

    const summaryData = Object.entries(summary).map(([column, stats]) => ({
      name: column,
      min: stats.min,
      max: stats.max,
      avg: stats.avg,
    }))

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={summaryData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="min" fill="#8884d8" name="Mínimo" />
          <Bar dataKey="max" fill="#82ca9d" name="Máximo" />
          <Bar dataKey="avg" fill="#ffc658" name="Promedio" />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Datos Analizados")
    XLSX.writeFile(wb, "datos_analizados_avanzados.xlsx")
  }

  const generateAiInsights = useCallback(() => {
    // Simulación de generación de insights con IA
    const insights = [
      "Se observa una correlación positiva entre las variables X e Y.",
      "Los datos muestran una tendencia creciente en los últimos períodos.",
      "Se detectan algunos valores atípicos que podrían requerir una investigación más profunda.",
      "La distribución de los datos sugiere una posible estacionalidad en los valores.",
      "Se recomienda realizar un análisis de regresión para predecir futuros valores."
    ]
    setAiInsights(insights[Math.floor(Math.random() * insights.length)])
  }, [])

  const trainAI = () => {
    setIsTraining(true)
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setAiConfidence(prevConfidence => {
        const newConfidence = prevConfidence + Math.random() * 2
        return newConfidence > 99 ? 99 : newConfidence
      })
      if (progress >= 100) {
        clearInterval(interval)
        setIsTraining(false)
        generateAiInsights()
      }
    }, 500)
  }

  useEffect(() => {
    if (data.length > 0) {
      generateAiInsights()
    }
  }, [data, generateAiInsights])

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Análisis de Datos Excel Mejorado</CardTitle>
        <CardDescription>Carga tu archivo Excel para un análisis detallado con múltiples gráficas y resumen general</CardDescription>
      </CardHeader>
      <CardContent>
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
            <Select value={currentSheet} onValueChange={handleSheetChange}>
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
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {columns.length > 0 && (
          <div className="flex justify-between items-center mb-4">
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo de gráfico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Gráfico de Barras</SelectItem>
                <SelectItem value="line">Gráfico de Líneas</SelectItem>
                <SelectItem value="scatter">Gráfico de Dispersión</SelectItem>
                <SelectItem value="area">Gráfico de Área</SelectItem>
                <SelectItem value="pie">Gráfico Circular</SelectItem>
                <SelectItem value="radar">Gráfico de Radar</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedColumns.x} onValueChange={(value) => setSelectedColumns(prev => ({ ...prev, x: value }))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Eje X" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedColumns.y} onValueChange={(value) => setSelectedColumns(prev => ({ ...prev, y: value }))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Eje Y" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {chartType === 'scatter' && (
              <Select value={selectedColumns.z} onValueChange={(value) => setSelectedColumns(prev => ({ ...prev, z: value }))}>
                <SelectTrigger  className="w-[180px]">
                  <SelectValue placeholder="Eje Z (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Ninguno</SelectItem>
                  {columns.map((column) => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}
        <div aria-live="polite" aria-atomic="true">
          {chartData.length > 0 && (
            <ResponsiveContainer width="100%" height={400}>
              <Chart type={chartType} data={chartData} columns={selectedColumns} />
            </ResponsiveContainer>
          )}
        </div>
        {aiInsights && (
          <Alert className="mt-4">
            <Brain className="h-4 w-4" />
            <AlertTitle>Insights de IA (Confianza: {aiConfidence.toFixed(2)}%)</AlertTitle>
            <AlertDescription>{aiInsights}</AlertDescription>
          </Alert>
        )}
        <div className="mt-4 flex items-center justify-between">
          <Button onClick={trainAI} disabled={isTraining}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {isTraining ? 'Entrenando...' : 'Entrenar IA'}
          </Button>
          {isTraining && (
            <Progress value={aiConfidence} className="w-[60%]" />
          )}
        </div>
        {summary && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Resumen General</CardTitle>
            </CardHeader>
            <CardContent>
              {renderSummaryChart()}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Columna</TableHead>
                    <TableHead>Mínimo</TableHead>
                    <TableHead>Máximo</TableHead>
                    <TableHead>Promedio</TableHead>
                    <TableHead>Suma</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(summary).map(([column, stats]) => (
                    <TableRow key={column}>
                      <TableCell>{column}</TableCell>
                      <TableCell>{stats.min.toFixed(2)}</TableCell>
                      <TableCell>{stats.max.toFixed(2)}</TableCell>
                      <TableCell>{stats.avg.toFixed(2)}</TableCell>
                      <TableCell>{stats.sum.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
        {data.length > 0 && (
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column}>{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.slice(0, 10).map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column}>{row[column]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter>
        {data.length > 0 && (
          <Button onClick={handleDownload} className="ml-auto">
            <Download className="mr-2 h-4 w-4" />
            Descargar Excel
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
