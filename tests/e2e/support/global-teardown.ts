import { cleanup } from "./db";

export default async function globalTeardown() {
  await cleanup();
}
