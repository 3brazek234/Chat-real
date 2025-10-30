import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export const registerSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const dateFormatter = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
  }).format(new Date(date));
};
export const profileFormSchema = z.object({
  name: z.string().min(2, { message: "minimum 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "minimum 6 characters" }),
  confirmPassword: z.string().min(6, { message: "minimum 6 characters" }),
});
export type ProfileFormValues = z.infer<typeof profileFormSchema>;
export const getSentimentBadgeVariant = (
  sentiment: string | undefined
): "success" | "destructive" | "warning" => {
  switch (sentiment) {
    case "positive":
      return "success";
    case "negative":
      return "destructive";
    default: // Handles "neutral" or undefined
      return "warning";
  }
};
