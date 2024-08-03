import * as dotenv from "dotenv";
dotenv.config();
export function areEnvVariablesAvailable(...values: string[]): boolean {
  for (const value of values) {
    if (!process.env[value]) {
      console.error(`Please provide ${value}`);
      return false;
    }
  }
  return true;
}
