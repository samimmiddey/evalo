import { format } from "date-fns";

export function formatDate(date: string | Date) {
   return format(new Date(date), "MMM dd, yyyy");
}