export { cn } from "cn"

// Set custom delay
export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}