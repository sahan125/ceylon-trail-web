import fs from "fs/promises";
import path from "path";
import { TourPackage, normalizeTourPackage } from "@/types/tour";
import { SEED_TOURS } from "@/data/toursData";

export { SEED_TOURS };

const DATA_DIR = path.join(process.cwd(), "data");
const TOURS_FILE = path.join(DATA_DIR, "tours.json");

async function ensureToursFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(TOURS_FILE);
    } catch {
      await fs.writeFile(TOURS_FILE, JSON.stringify(SEED_TOURS, null, 2), "utf-8");
    }
  } catch (error) {
    console.error("Error ensuring tours file:", error);
  }
}

export async function getFallbackTours(): Promise<TourPackage[]> {
  await ensureToursFile();
  try {
    const raw = await fs.readFile(TOURS_FILE, "utf-8");
    const tours: any[] = JSON.parse(raw);
    return tours.map(normalizeTourPackage);
  } catch {
    return SEED_TOURS;
  }
}

export async function saveFallbackTours(tours: TourPackage[]): Promise<void> {
  await ensureToursFile();
  await fs.writeFile(TOURS_FILE, JSON.stringify(tours, null, 2), "utf-8");
}
