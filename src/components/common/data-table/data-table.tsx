import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { tableFeatures, useTable, type ColumnDef, type RowData } from '@tanstack/react-table';
import TableSkeleton from './table-skeleton';

export const features = tableFeatures({});

interface DataTableProps<TData extends RowData> {
   columns: ColumnDef<typeof features, TData>[];
   data: TData[];
   isLoading?: boolean;
}

export function DataTable<TData extends RowData>({
   columns,
   data,
   isLoading
}: DataTableProps<TData>) {
   const table = useTable({ features, columns, data });

   return (
      <Table>
         <TableHeader>
            {
               table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                     {
                        headerGroup.headers.map((header) => (
                           <TableHead key={header.id}>
                              {header.isPlaceholder ? null : (
                                 <table.FlexRender header={header} />
                              )}
                           </TableHead>
                        ))
                     }
                  </TableRow>
               ))
            }
         </TableHeader>
         <TableBody>
            {
               isLoading ? (
                  <TableSkeleton columns={columns.length} />
               ) :
                  table.getRowModel().rows.map(row => (
                     <TableRow key={row.id}>
                        {
                           row.getAllCells().map(cell => (
                              <TableCell key={cell.id}>
                                 <table.FlexRender cell={cell} />
                              </TableCell>
                           ))
                        }
                     </TableRow>
                  ))
            }
         </TableBody>
      </Table>
   );
}