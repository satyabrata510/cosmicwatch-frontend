/**
 * Class Name Merger
 *
 * Utility function to merge Tailwind CSS classes using `clsx` and `tailwind-merge`.
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
