import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string | Date | undefined | null, style: 'long' | 'short' = 'long'): string {
    if (!dateStr) return "";
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "";

        if (style === 'short') {
            return format(date, "MMM d, yyyy");
        }
        return format(date, "MMMM d, yyyy");
    } catch (error) {
        return "";
    }
}

export function relativeDate(dateStr: string | Date | undefined | null): string {
    if (!dateStr) return "Just now";
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "Just now";
        return formatDistanceToNow(date, { addSuffix: true });
    } catch (err) {
        return "Just now";
    }
}
