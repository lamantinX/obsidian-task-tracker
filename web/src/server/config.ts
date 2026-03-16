import path from "node:path";

export function getVaultPath() {
  return process.env.TASK_TRACKER_VAULT_PATH ?? path.resolve(process.cwd(), "..");
}
