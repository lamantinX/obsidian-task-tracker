import { ProductsOverview } from "@/components/products-overview";
import { requireAppSession } from "@/server/auth/server-session";
import { getVaultAdapter } from "@/server/vault";

export default async function ProductsPage() {
  await requireAppSession();
  const products = await getVaultAdapter().listProducts();

  return <ProductsOverview products={products} />;
}
