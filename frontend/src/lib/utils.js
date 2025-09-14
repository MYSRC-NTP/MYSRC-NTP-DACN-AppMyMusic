import { clsx } from "clsx";  // Import thư viện clsx
import { twMerge } from "tailwind-merge";  // Import thư viện tailwind-merge

export function cn(...inputs) {
    return twMerge(clsx(inputs));  // Kết hợp clsx và tailwind-merge để xử lý các lớp CSS
}
