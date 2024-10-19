import { BarChart, LineChart, ScatterChart, AreaChart, PieChart, RadarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, Line, Area, Pie, Radar, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Chart = ({ type, data, columns }) => {
  const commonProps = {
    data,
    margin: { top: 5, right: 30, left: 20, bottom: 5 },
  };

  switch (type) {
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
      );
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
      );
    case 'scatter':
      return (
        <ScatterChart {...commonProps}>
          <CartesianGrid />
          <XAxis dataKey="x" name={columns.x} />
          <YAxis dataKey="y" name={columns.y} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Legend />
          <Scatter name="Datos" data={data} fill="#8884d8" />
        </ScatterChart>
      );
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
      );
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
      );
    case 'radar':
      return (
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="x" />
          <PolarRadiusAxis />
          <Radar name={columns.y} dataKey="y" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          <Legend />
        </RadarChart>
      );
    default:
      return null;
  }
};

export default Chart;
