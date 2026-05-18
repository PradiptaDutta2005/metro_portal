import path from "path";
import fs from "fs";

export async function getDictionary(locale: string) {
  const filePath = path.join(process.cwd(), "public/locales", locale, "common.json");
  const json = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(json);
}
