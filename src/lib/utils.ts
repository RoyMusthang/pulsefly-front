import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { useLocation } from "react-router-dom";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export { useQuery };