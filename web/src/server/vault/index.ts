import { createVaultAdapter } from "@/server/vault/vault-adapter";
import { getVaultPath } from "@/server/config";

export function getVaultAdapter() {
  return createVaultAdapter({
    vaultPath: getVaultPath()
  });
}
