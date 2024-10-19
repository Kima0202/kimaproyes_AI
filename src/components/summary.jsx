import { Table, TableBody, TableCell, TableHeader, TableRow } from "./components/ui/table";

const Summary = ({ summary }) => {
  if (!summary) return null;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Resumen General</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Aquí iría tu gráfico de resumen */}
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
  );
};

export default Summary;
