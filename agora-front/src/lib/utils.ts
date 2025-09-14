import { clsx, type ClassValue } from "clsx";
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formarDate = (dateString: string) => {
const date = parse(dateString, "d 'de' MMMM 'de' yyyy - hh:mm a", new Date(), {
  locale: es,
});

// 2. Formateamos a "14 sep 8am"
const formatted = format(date, "d MMM  h aa", { locale: es })
  .replace(".", "") // quita el "a. m."
  .toLowerCase(); // estilo "am/pm" en minúsculas
return formatted;
}